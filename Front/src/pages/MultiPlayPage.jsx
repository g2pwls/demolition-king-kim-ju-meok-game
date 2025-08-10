import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PixiCanvas from "../components/pixi/PixiCanvas";
import api from "../utils/api";
import "../styles/MultiPlayPage.css";

import {
    createSession,
    getToken,
    initOpenVidu, // { OV, session }
} from "../hooks/useOpenViduSession";

/* ───────────── 작은 뷰 컴포넌트들 ───────────── */

function RemotePeerTile({ stream, nickname = "대기 중...", uuid }) {
    const vref = useRef(null);
    useEffect(() => {
        if (!vref.current) return;
        vref.current.srcObject = stream || null;
        if (stream) vref.current.play().catch(() => {});
    }, [stream]);
    return (
        <div className={`peer-tile ${stream ? "on" : "off"}`}>
            <video ref={vref} autoPlay playsInline />
            <div className="peer-badge">
                <span className="name">{nickname}</span>
                {uuid ? <span className="uuid">{uuid.slice(0, 6)}…</span> : null}
            </div>
        </div>
    );
}

function LocalPIP({ stream }) {
    const vref = useRef(null);
    useEffect(() => {
        if (!vref.current) return;
        vref.current.srcObject = stream || null;
        if (stream) vref.current.play().catch(() => {});
    }, [stream]);
    return (
        <div className="local-pip">
            <video ref={vref} autoPlay playsInline muted className="mirror" />
        </div>
    );
}

function ChatLog({ messages, onSend }) {
    const [text, setText] = useState("");
    return (
        <div className="mp-chat">
            <div className="mp-chat-title">LOG</div>
            <div className="mp-chat-list">
                {messages.map((m, i) => (
                    <div key={i} className="mp-chat-item">
                        <span className="nick">{m.sender}</span>
                        <span className="msg">{m.message}</span>
                    </div>
                ))}
            </div>
            <form
                className="mp-chat-input"
                onSubmit={(e) => {
                    e.preventDefault();
                    const t = text.trim();
                    if (!t) return;
                    onSend(t);
                    setText("");
                }}
            >
                <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="메시지 입력..."
                />
                <button type="submit">전송</button>
            </form>
        </div>
    );
}

/* ───────────── 페이지 ───────────── */

export default function MultiPlayPage() {
    const navigate = useNavigate();
    const { state } = useLocation(); // { roomName, members }
    const roomName = state?.roomName ?? "unknown-room";
    const members = state?.members ?? [];

    /* ===== 유저 정보 ===== */
    const [userUuid, setUserUuid] = useState("");
    const [nickname, setNickname] = useState("");

    /* ===== 로컬 미디어 ===== */
    const [localStream, setLocalStream] = useState(null);
    const inputVideoRef = useRef(null);   // Mediapipe 입력용 video
    const overlayCanvasRef = useRef(null); // (옵션) 랜드마크 오버레이

    /* ===== OpenVidu ===== */
    const [status, setStatus] = useState("disconnected");
    const ovRef = useRef(null);
    const sessionRef = useRef(null);
    const publisherRef = useRef(null);
    const [remotePeers, setRemotePeers] = useState([]); // [{uuid,nickname,stream,connId}]
    const [chat, setChat] = useState([]);

    /* ===== 게임 상태 (SingleTestPage 로직 그대로) ===== */
    const [action, setAction] = useState("idle");
    const [timeover, setTimeover] = useState(100);
    const [kcal, setKcal] = useState(0);
    const [coinCount, setCoinCount] = useState(0);
    const [destroyedCount, setDestroyedCount] = useState(0);

    const [buildingList, setBuildingList] = useState([]);
    const [buildingIndex, setBuildingIndex] = useState(0);
    const currentBuilding = buildingList[buildingIndex] ?? null;

    const [combo, setCombo] = useState([]);
    const [patternIdx, setPatternIdx] = useState(0);
    const [stepIdx, setStepIdx] = useState(0);
    const [isGameOver, setIsGameOver] = useState(false);
    const [destroyedSeqs, setDestroyedSeqs] = useState([]);
    const COIN_PER_BUILDING = 1;
    const [playerSkin, setPlayerSkin] = useState("");

    const advanceLockRef = useRef(false);
    const lastActionRef = useRef("idle");
    const audioRef = useRef(null);

    /* ===== Mediapipe FSM/필터 (Single 그대로) ===== */
    const mediapipeCameraRef = useRef(null);
    const fsmStateRef = useRef("get_ready");
    const startPosRef = useRef({ left: null, right: null });
    const startShoulderRef = useRef({ left: null, right: null });
    const lastActionAtRef = useRef(0);

    const lPrevRef = useRef({ x: 0, y: 0, init: false });
    const rPrevRef = useRef({ x: 0, y: 0, init: false });
    const lFiltRef = useRef({ x: 0, y: 0, init: false });
    const rFiltRef = useRef({ x: 0, y: 0, init: false });
    const lOverCntRef = useRef(0);
    const rOverCntRef = useRef(0);
    const lastTsRef = useRef(0);

    const EMA_ALPHA = 0.5;
    const HIT_MIN_FRAMES = 3;
    const COOLDOWN_SEC = 0.6;

    const NOSE = 0, LS = 11, RS = 12, LE = 13, RE = 14, LW = 15, RW = 16;
    const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

    function isReadyPoseNorm(lm) {
        const noseY = lm[NOSE].y;
        const LwY = lm[LW].y;
        const RwY = lm[RW].y;
        const LeY = lm[LE].y;
        const ReY = lm[RE].y;
        const LsY = lm[LS].y;
        const RsY = lm[RS].y;

        const shoulderBand = 0.08;
        const handInGuard =
            noseY < LwY && LwY < (LsY + shoulderBand) &&
            noseY < RwY && RwY < (RsY + shoulderBand);
        const elbowsDown = LeY > LsY && ReY > RsY;

        return handInGuard && elbowsDown;
    }

    /* ── 유저 정보 로드 ── */
    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            alert("로그인이 필요합니다.");
            navigate("/", { replace: true });
            return;
        }
        fetch("https://i13e106.p.ssafy.io/api/user/auth/getUserInfo", {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((r) => r.json())
            .then((data) => {
                setUserUuid(data?.result?.userUuid ?? "");
                setNickname(data?.result?.userNickname ?? "");
            })
            .catch(() => {});
    }, [navigate]);

    /* ── 게임 리소스 로드 ── */
    useEffect(() => {
        (async () => {
            try {
                const { data, status } = await api.get("/constructures/generate", {
                    params: { count: 50 },
                });
                if (status === 200 && data.isSuccess) {
                    setBuildingList(data.result);
                }
            } catch (e) {
                console.warn("건물 리스트 로드 실패", e);
            }
        })();
    }, []);
    useEffect(() => {
        (async () => {
            try {
                const token = localStorage.getItem("accessToken");
                const { data } = await api.get("/skins/getSkin", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setPlayerSkin(data?.result ?? "");
            } catch (e) {
                console.warn("스킨 로드 실패", e);
            }
        })();
    }, []);
    useEffect(() => {
        (async () => {
            try {
                const token = localStorage.getItem("accessToken");
                const { data, status } = await api.get("users/games/generate/numeric", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (status === 200 && Array.isArray(data?.patterns)) {
                    setCombo(data.patterns);
                }
            } catch (e) {
                console.warn("콤보 로드 실패", e);
            }
        })();
    }, []);
    useEffect(() => {
        if (Array.isArray(combo) && combo.length > 0) {
            setPatternIdx(0);
            setStepIdx(0);
        }
    }, [combo]);

    /* ── 타이머 ── */
    useEffect(() => {
        const it = setInterval(() => {
            if (action !== "punch") {
                setTimeover((p) => Math.max(p - 1, 0));
            }
        }, 1000);
        return () => clearInterval(it);
    }, [action]);

    /* ── 액션 → 스텝 진행 ── */
    useEffect(() => {
        const isHit =
            action === "punch" ||
            (typeof action === "string" &&
                (action.endsWith("_jab") || action.endsWith("_uppercut")));
        if (isHit && lastActionRef.current !== action) {
            advanceStepOnce();
        }
        lastActionRef.current = action;
    }, [action]);

    function advanceStepOnce() {
        if (!Array.isArray(combo) || combo.length === 0) return;
        if (advanceLockRef.current) return;
        advanceLockRef.current = true;

        const current = combo[patternIdx];
        const total = (current?.moves || []).length;

        setStepIdx((prev) => {
            const next = prev + 1;
            if (next >= total) {
                setDestroyedCount((c) => c + 1);
                setCoinCount((c) => c + COIN_PER_BUILDING);
                setPatternIdx((p) => (p + 1) % combo.length);
                return 0;
            }
            return next;
        });

        setTimeout(() => {
            advanceLockRef.current = false;
        }, 250);
    }

    /* ── 게임 오버 ── */
    useEffect(() => {
        if (timeover === 0) setIsGameOver(true);
    }, [timeover]);

    /* ── BGM ── */
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = 0.5;
            audioRef.current.loop = true;
            audioRef.current.play().catch(() => {});
        }
    }, []);

    /* ====== getUserMedia (로컬 스트림 1회) ====== */
    useEffect(() => {
        let s;
        (async () => {
            try {
                s = await navigator.mediaDevices.getUserMedia({
                    video: { width: 640, height: 480, facingMode: "user" },
                    audio: false,
                });
                setLocalStream(s);
                // Mediapipe 입력용 비디오에만 붙임 (PIP은 LocalPIP 컴포넌트가 따로 표시)
                if (inputVideoRef.current) {
                    inputVideoRef.current.srcObject = s;
                    await inputVideoRef.current.play().catch(() => {});
                }
            } catch (e) {
                console.error("getUserMedia 실패:", e);
            }
        })();
        return () => {
            s?.getTracks()?.forEach((t) => t.stop());
        };
    }, []);

    /* ====== OpenVidu 연결 ====== */
    useEffect(() => {
        if (!roomName || !userUuid || !localStream) return;
        let cancelled = false;

        (async () => {
            setStatus("connecting");

            const sessionId = await createSession(roomName);
            const token = await getToken(sessionId);
            if (cancelled) return;

            const { OV, session } = initOpenVidu();
            ovRef.current = OV;
            sessionRef.current = session;

            session.on("streamCreated", (event) => {
                const subscriber = session.subscribe(event.stream, undefined);
                subscriber.on("videoElementCreated", () => {
                    const info = parseConnData(event.stream.connection.data);
                    setRemotePeers((prev) => {
                        const next = prev.filter(
                            (p) => p.connId !== event.stream.connection.connectionId
                        );
                        next.push({
                            uuid: info?.userUuid ?? null,
                            nickname: info?.nickname ?? "게스트",
                            stream: subscriber.stream.getMediaStream(),
                            connId: event.stream.connection.connectionId,
                        });
                        return [...next];
                    });
                });
            });

            session.on("streamDestroyed", (event) => {
                setRemotePeers((prev) =>
                    prev.filter((p) => p.connId !== event.stream.connection.connectionId)
                );
            });

            session.on("signal:chat", (event) => {
                try {
                    const payload = JSON.parse(event.data);
                    const from = parseConnData(event.from?.data);
                    setChat((prev) => [
                        ...prev,
                        {
                            sender: payload?.sender ?? from?.nickname ?? "unknown",
                            message: payload?.message ?? "",
                        },
                    ]);
                } catch {}
            });

            await session.connect(token, {
                clientData: JSON.stringify({ userUuid, nickname }),
            });

            const audioTrack = localStream.getAudioTracks()[0] || undefined;
            const videoTrack = localStream.getVideoTracks()[0] || undefined;

            const publisher = OV.initPublisher(undefined, {
                audioSource: audioTrack ?? undefined,
                videoSource: videoTrack ?? undefined,
                publishAudio: !!audioTrack,
                publishVideo: !!videoTrack,
                resolution: "480x640",
                frameRate: 30,
                mirror: true,
            });
            publisherRef.current = publisher;
            await session.publish(publisher);

            if (!cancelled) setStatus("connected");
        })().catch((e) => {
            console.error("[OV] connect error:", e);
            setStatus("error");
        });

        return () => {
            cancelled = true;
            try {
                sessionRef.current?.disconnect();
            } catch {}
            publisherRef.current = null;
            sessionRef.current = null;
            ovRef.current = null;
            setRemotePeers([]);
            setStatus("disconnected");
        };
    }, [roomName, userUuid, nickname, localStream]);

    /* ====== Mediapipe(Pose) – Single 그대로, 단 getUserMedia 재사용 ====== */
    useEffect(() => {
        const videoEl = inputVideoRef.current;
        if (!videoEl || !localStream) return;

        // 캔버스 사이즈 동기화
        if (overlayCanvasRef.current) {
            overlayCanvasRef.current.width = videoEl.videoWidth || 640;
            overlayCanvasRef.current.height = videoEl.videoHeight || 480;
        }

        // 지연 로드 (mediapipe deps)
        let pose;
        let cam;
        (async () => {
            const { Pose } = await import("@mediapipe/pose");
            const { Camera } = await import("@mediapipe/camera_utils");
            // const { drawLandmarks } = await import("@mediapipe/drawing_utils"); // 원하면 표시

            pose = new Pose({
                locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
            });
            pose.setOptions({
                modelComplexity: 0,
                smoothLandmarks: true,
                enableSegmentation: false,
                minDetectionConfidence: 0.5,
                minTrackingConfidence: 0.5,
            });

            pose.onResults((results) => {
                const lm = results.poseLandmarks;

                // (옵션) 오버레이
                const c = overlayCanvasRef.current;
                if (c) {
                    const ctx = c.getContext("2d");
                    ctx.clearRect(0, 0, c.width, c.height);
                    // lm && drawLandmarks(ctx, lm, { color: '#FF0000', radius: 3 });
                }

                if (!lm) {
                    fsmStateRef.current = "get_ready";
                    setAction("idle");
                    return;
                }

                const nowSec = performance.now() / 1000;

                if (fsmStateRef.current === "get_ready") {
                    if (isReadyPoseNorm(lm)) {
                        const left  = { x: lm[LW].x, y: lm[LW].y };
                        const right = { x: lm[RW].x, y: lm[RW].y };
                        const lSh   = { x: lm[LS].x, y: lm[LS].y };
                        const rSh   = { x: lm[RS].x, y: lm[RS].y };

                        startPosRef.current = { left, right };
                        startShoulderRef.current = { left: lSh, right: rSh };

                        lFiltRef.current = { ...left,  init: true };
                        rFiltRef.current = { ...right, init: true };
                        lPrevRef.current = { ...left,  init: true };
                        rPrevRef.current = { ...right, init: true };
                        lastTsRef.current = nowSec;

                        lOverCntRef.current = 0;
                        rOverCntRef.current = 0;

                        fsmStateRef.current = "action";
                    }
                    return;
                }

                if (fsmStateRef.current === "action") {
                    let dt = nowSec - (lastTsRef.current || nowSec);
                    if (dt <= 0 || dt > 0.2) dt = 0.016;
                    lastTsRef.current = nowSec;

                    const shoulderDist = Math.abs(lm[LS].x - lm[RS].x);

                    const JAB_X_TH       = 0.22 * shoulderDist;
                    const JAB_FLAT_Y_MAX = 0.22 * shoulderDist;
                    const JAB_DIST_GAIN  = 0.18 * shoulderDist;
                    const VEL_X_TH       = 0.04 * shoulderDist / Math.max(dt, 1e-3);

                    const UPP_Y_TH      = 0.33 * shoulderDist;
                    const UPP_DOM_RATIO = 1.70;
                    const VEL_Y_TH      = 0.06 * shoulderDist / Math.max(dt, 1e-3);

                    const lNowRaw = { x: lm[LW].x, y: lm[LW].y };
                    const rNowRaw = { x: lm[RW].x, y: lm[RW].y };
                    if (!lFiltRef.current.init) {
                        lFiltRef.current = { ...lNowRaw, init: true };
                        rFiltRef.current = { ...rNowRaw, init: true };
                    }
                    const a = EMA_ALPHA;
                    lFiltRef.current.x = a * lNowRaw.x + (1 - a) * lFiltRef.current.x;
                    lFiltRef.current.y = a * lNowRaw.y + (1 - a) * lFiltRef.current.y;
                    rFiltRef.current.x = a * rNowRaw.x + (1 - a) * rFiltRef.current.x;
                    rFiltRef.current.y = a * rNowRaw.y + (1 - a) * rFiltRef.current.y;

                    const lNow = lFiltRef.current;
                    const rNow = rFiltRef.current;

                    const lStart = startPosRef.current.left;
                    const rStart = startPosRef.current.right;
                    const lSh0   = startShoulderRef.current.left;
                    const rSh0   = startShoulderRef.current.right;
                    if (!lStart || !rStart || !lSh0 || !rSh0) return;

                    const ldx = lNow.x - lStart.x, ldy = lNow.y - lStart.y;
                    const rdx = rNow.x - rStart.x, rdy = rNow.y - rStart.y;

                    if (!lPrevRef.current.init) lPrevRef.current = { ...lNow, init: true };
                    if (!rPrevRef.current.init) rPrevRef.current = { ...rNow, init: true };
                    const lvx = (lNow.x - lPrevRef.current.x) / dt;
                    const lvy = (lNow.y - lPrevRef.current.y) / dt;
                    const rvx = (rNow.x - rPrevRef.current.x) / dt;
                    const rvy = (rNow.y - rPrevRef.current.y) / dt;
                    lPrevRef.current = { ...lNow, init: true };
                    rPrevRef.current = { ...rNow, init: true };

                    const lWS0 = dist(lStart, lSh0);
                    const rWS0 = dist(rStart, rSh0);
                    const lWS  = dist(lNow,   lSh0);
                    const rWS  = dist(rNow,   rSh0);

                    let lHitKind = null;
                    const lJabCand =
                        (Math.abs(ldx) > JAB_X_TH || (lWS - lWS0) > JAB_DIST_GAIN) &&
                        Math.abs(ldy) < JAB_FLAT_Y_MAX &&
                        Math.abs(lvx) > VEL_X_TH;
                    const lUpperCand =
                        -ldy > UPP_Y_TH &&
                        Math.abs(ldy) > Math.abs(ldx) * UPP_DOM_RATIO &&
                        -lvy > VEL_Y_TH;
                    if (lJabCand || lUpperCand) {
                        lOverCntRef.current++;
                        if (lOverCntRef.current >= Math.max(2, HIT_MIN_FRAMES - 1)) {
                            lHitKind = lJabCand ? "left_jab" : "left_uppercut";
                        }
                    } else {
                        lOverCntRef.current = Math.max(0, lOverCntRef.current - 1);
                    }

                    let rHitKind = null;
                    const rJabCand =
                        (Math.abs(rdx) > JAB_X_TH || (rWS - rWS0) > JAB_DIST_GAIN) &&
                        Math.abs(rdy) < JAB_FLAT_Y_MAX &&
                        Math.abs(rvx) > VEL_X_TH;
                    const rUpperCand =
                        -rdy > UPP_Y_TH &&
                        Math.abs(rdy) > Math.abs(rdx) * UPP_DOM_RATIO &&
                        -rvy > VEL_Y_TH;
                    if (rJabCand || rUpperCand) {
                        rOverCntRef.current++;
                        if (rOverCntRef.current >= Math.max(2, HIT_MIN_FRAMES - 1)) {
                            rHitKind = rJabCand ? "right_jab" : "right_uppercut";
                        }
                    } else {
                        rOverCntRef.current = Math.max(0, rOverCntRef.current - 1);
                    }

                    if (lHitKind || rHitKind) {
                        const motion = lHitKind || rHitKind;
                        setAction(motion);
                        setTimeout(() => setAction("idle"), 0);
                        lastActionAtRef.current = nowSec;
                        fsmStateRef.current = "cooldown";
                        lOverCntRef.current = 0;
                        rOverCntRef.current = 0;
                        return;
                    }
                    return;
                }

                if (fsmStateRef.current === "cooldown") {
                    if (nowSec - lastActionAtRef.current > COOLDOWN_SEC) {
                        fsmStateRef.current = "get_ready";
                    }
                    return;
                }
            });

            cam = new Camera(videoEl, {
                onFrame: async () => {
                    try {
                        await pose.send({ image: videoEl });
                    } catch {}
                },
                width: 640,
                height: 480,
            });
            mediapipeCameraRef.current = cam;
            cam.start();
        })();

        return () => {
            try { mediapipeCameraRef.current?.stop(); } catch {}
            mediapipeCameraRef.current = null;
        };
    }, [localStream]);

    /* ====== 사이드바 순서 ====== */
    const sidebarPeers = useMemo(() => {
        const order = members.filter((u) => u && u !== userUuid);
        const map = new Map(remotePeers.map((p) => [p.uuid, p]));
        const arr = order.slice(0, 3).map((uuid) => map.get(uuid) ?? { uuid, nickname: "대기 중", stream: null });
        while (arr.length < 3) arr.push({ uuid: null, nickname: "대기 중", stream: null });
        return arr;
    }, [members, userUuid, remotePeers]);

    /* ====== 채팅 전송 ====== */
    const sendChat = (text) => {
        const s = sessionRef.current;
        if (!s) return;
        s.signal({
            type: "chat",
            data: JSON.stringify({ sender: nickname || "me", message: text }),
        }).catch((e) => console.warn("signal chat failed:", e));
        setChat((prev) => [...prev, { sender: nickname || "me", message: text }]);
    };

    return (
        <div className="mp-root">
            {/* 좌측: 원격 3 썸네일 (화면 1/7) */}
            <aside className="mp-sidebar">
                {sidebarPeers.map((p, idx) => (
                    <RemotePeerTile key={idx} stream={p.stream} nickname={p.nickname} uuid={p.uuid} />
                ))}
            </aside>

            {/* 메인 게임 영역 */}
            <main className="mp-main">
                <div className="mp-game">
                    {/* 상단 오버레이(타임바/콤보) */}
                    <div className="overlay-ui">
                        <div className="progress-bar">
                            <div className="progress-fill" style={{ width: `${timeover}%` }} />
                        </div>

                        {/* 콤보 서클 (간단 버전) */}
                        <div className="command-sequence">
                            {(combo[patternIdx]?.moves || []).map((m, i) => {
                                const meta =
                                    m === 0 ? { label: "왼잽", color: "red" } :
                                        m === 1 ? { label: "오잽", color: "red" } :
                                            m === 2 ? { label: "왼어퍼", color: "black" } :
                                                m === 3 ? { label: "오어퍼", color: "black" } :
                                                    { label: "?", color: "black" };
                                const stateClass = i < stepIdx ? "done" : i === stepIdx ? "current" : "";
                                const colorClass = meta.color === "red" ? "red" : meta.color === "green" ? "green" : "black";
                                return (
                                    <div key={i} className={`command-circle ${colorClass} ${stateClass}`}>{meta.label}</div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Pixi 월드 */}
                    <PixiCanvas
                        action={action}
                        building={currentBuilding}
                        playerSkin={playerSkin}
                        combo={combo}
                        onBuildingDestroyed={(seq) => {
                            if (seq) setDestroyedSeqs((prev) => [...prev, seq]);
                            setBuildingIndex((prev) =>
                                buildingList.length === 0 ? 0 : (prev + 1) % buildingList.length
                            );
                            setDestroyedCount((c) => c + 1);
                            setCoinCount((c) => c + COIN_PER_BUILDING);
                        }}
                        setKcal={setKcal}
                        showBuildingHp={false}
                    />
                </div>

                {/* 내 PIP (좌하단) */}
                <LocalPIP stream={localStream} />

                {/* Mediapipe 입력용(숨김) + (선택) 오버레이 캔버스 */}
                <video ref={inputVideoRef} className="mp-hidden-input" muted playsInline autoPlay />
                <canvas ref={overlayCanvasRef} className="mp-hidden-input" />
            </main>

            {/* 우상단: 채팅/로그 + 간단 스탯 */}
            <div className="mp-chat-wrap">
                <ChatLog messages={chat} onSend={sendChat} />
                <div style={{ marginTop: 8, color: "#e9ecf1", fontSize: 14 }}>
                    <div>🔥 {kcal} KCAL</div>
                    <div>🏢 {destroyedCount}</div>
                    <div>💰 {coinCount}</div>
                </div>
            </div>

            <audio ref={audioRef} src="/sounds/bgm.mp3" />
        </div>
    );
}

/* util */
function parseConnData(str) {
    try {
        const parsed = JSON.parse(typeof str === "string" ? str : "{}");
        if (parsed?.clientData && typeof parsed.clientData === "string") {
            return JSON.parse(parsed.clientData);
        }
        return parsed;
    } catch {
        return null;
    }
}
