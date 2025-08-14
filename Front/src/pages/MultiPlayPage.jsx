import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    Room,
    RoomEvent,
    Track,
    createLocalAudioTrack,
    createLocalVideoTrack,
} from "livekit-client";
import * as mpPose from "@mediapipe/pose";
import { Camera } from "@mediapipe/camera_utils";
import { drawLandmarks, drawConnectors } from "@mediapipe/drawing_utils";
import jabLeftImage from '../assets/images/ljjap.png';
import jabRightImage from '../assets/images/rjjap.png';
import upperLeftImage from '../assets/images/lupper.png';
import upperRightImage from '../assets/images/rupper.png';
import PixiCanvas from "../components/pixi/PixiCanvas";
import api from "../utils/api";
import "../styles/MultiPlayPage.css";

const APPLICATION_SERVER_URL =
    import.meta.env.VITE_TOKEN_SERVER_URL || "http://127.0.0.1:6080/";
const LIVEKIT_URL =
    import.meta.env.VITE_LIVEKIT_URL || "ws://127.0.0.1:7880";

// ===== Pose 랜드마크(숫자 고정) =====
const LM = {
    NOSE: 0,
    LEFT_SHOULDER: 11,
    RIGHT_SHOULDER: 12,
    LEFT_ELBOW: 13,
    RIGHT_ELBOW: 14,
    LEFT_WRIST: 15,
    RIGHT_WRIST: 16,
    LEFT_HIP: 23,
    RIGHT_HIP: 24,
};

const MOVE_META = {
  0: { label: '왼잽', imgSrc: jabLeftImage },
  1: { label: '오잽', imgSrc: jabRightImage },
  2: { label: '왼어퍼', imgSrc: upperLeftImage },
  3: { label: '오어퍼', imgSrc: upperRightImage },


};

/* -------------------- 공용 비디오 타일 -------------------- */
function LKVideoTile({ track, muted, className = "" }) {
    const vref = useRef(null);
    useEffect(() => {
        if (!track || !vref.current) return;
        track.attach(vref.current);
        return () => {
            try { track.detach(vref.current); } catch {}
        };
    }, [track]);
    return (
        <video
            ref={vref}
            autoPlay
            playsInline
            muted={!!muted}
            className={`slot-video ${className}`}
        />
    );
}

/* -------------------- 좌측 원격 타일 -------------------- */
function RemotePeerTile({ track, nickname = "대기 중...", uuid, stat }) {
    const on = !!track;
    return (
        <div className={`peer-tile ${on ? "on" : "off"}`}>
            {track ? <LKVideoTile track={track} /> : null}
            <div className="peer-badge">
                <span className="name">{nickname}</span>
                {uuid ? <span className="uuid">{String(uuid).slice(0, 6)}…</span> : null}
            </div>
            {stat ? (
                <div className="peer-stat">🏢 {stat.destroyed ?? 0} · 💰 {stat.coin ?? 0}</div>
            ) : null}
        </div>
    );
}

/* -------------------- 콤보 HUD -------------------- */
function CommandSequence({ combo, patternIdx, stepIdx }) {
    const current = combo?.[patternIdx];
    const moves = current?.moves || [];
    return (
        <div className="command-sequence">
            {moves.map((m, i) => {
                const meta = MOVE_META[m] || { label: "?", imgSrc: '' };
                const stateClass = i < stepIdx ? "done" : i === stepIdx ? "current" : "";
                const colorClass = meta.color === "red" ? "red" : "black";
                return (
                    <div key={i} className={`command-circle ${colorClass} ${stateClass}`}>
                        {meta.imgSrc ? (
                    <img src={meta.imgSrc} alt={meta.label} className="command-image" />
                    ) : (
                    meta.label
                    )}
                    </div>
                );
            })}
        </div>
    );
}

/* -------------------- 로그 패널 -------------------- */
function LogPanel({ messages }) {
    return (
        <div className="mp-chat">
            <div className="mp-chat-title">LOG</div>
            <div className="mp-chat-list">
                {messages.map((m, i) => (
                    <div key={i} className="mp-chat-item">
                        <span className="msg"> {m.message}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* -------------------- 내 카메라 + 오버레이 -------------------- */
function MyCamera({ stream, overlayRef }) {
    const vref = useRef(null);
    useEffect(() => {
        if (!vref.current) return;
        vref.current.srcObject = stream || null;
        if (stream) vref.current.play().catch(() => {});
    }, [stream]);

    return (
        <div className="local-pip">
            <video
                ref={vref}
                autoPlay
                playsInline
                muted
                className="mirror"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
            <canvas ref={overlayRef} className="overlay mirror" style={{ width: "100%", height: "100%" }} />
        </div>
    );
}

/* ===== 유틸: 정렬 ===== */
function sortAll(finalMap) {
    const arr = Array.from(finalMap.values());
    arr.sort(
        (a, b) =>
            b.kcal - a.kcal ||
            b.destroyed - a.destroyed ||
            b.coin - a.coin ||
            (a.playTimeSec ?? 0) - (b.playTimeSec ?? 0)
    );
    return arr;
}

/* =========================================================
   MultiPlayPage
========================================================= */
export default function MultiPlayPage() {
    const navigate = useNavigate();
    const { state } = useLocation(); // { roomName, members? }
    const roomName = state?.roomName ?? "unknown-room";

    /* ===== 사용자 ===== */
    const [userUuid, setUserUuid] = useState("");
    const [nickname, setNickname] = useState("");

    /* ===== LiveKit ===== */
    const [room, setRoom] = useState(null);
    const [remoteTracks, setRemoteTracks] = useState([]);
    const [localVideoTrack, setLocalVideoTrack] = useState(null);

    /* ===== 게임 로그 ===== */
    const [log, setLog] = useState([]);

    /* ===== 내 카메라 / Mediapipe ===== */
    const [localStream, setLocalStream] = useState(null);
    const inputVideoRef = useRef(null);
    const overlayCanvasRef = useRef(null);

    /* ===== 게임 상태 ===== */
    const [action, setAction] = useState("idle");
    const [timeover, setTimeover] = useState(100);

    const [buildingList, setBuildingList] = useState([]);
    const [buildingIndex, setBuildingIndex] = useState(0);
    const currentBuilding = buildingList[buildingIndex] ?? null;
    const [playerSkin, setPlayerSkin] = useState("");
    const [combo, setCombo] = useState([]);

    const [patternIdx, setPatternIdx] = useState(0);
    const [stepIdx, setStepIdx] = useState(0);
    const advanceLockRef = useRef(false);

    /* ===== 타이머/게임오버 ===== */
    const TIME_LIMIT_SEC = 100;
    const startTimeRef = useRef(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [isGameOver, setIsGameOver] = useState(false);
    const isGameOverRef = useRef(false);
    useEffect(() => { isGameOverRef.current = isGameOver; }, [isGameOver]);

    /* 🔹 시작 카운트다운 (추가) */
    const READY_SECONDS = 5;
    const [isPlaying, setIsPlaying] = useState(false);
    const isPlayingRef = useRef(false);
    const [readyLeft, setReadyLeft] = useState(READY_SECONDS);

    /* ===== 누적 스탯 (state + ref 동기화) ===== */
    const [kcal, setKcal] = useState(0);
    const [coinCount, setCoinCount] = useState(0);
    const [destroyedCount, setDestroyedCount] = useState(0);
    const kcalRef = useRef(0);
    const coinRef = useRef(0);
    const destroyedRef = useRef(0);
    useEffect(() => { kcalRef.current = kcal; }, [kcal]);
    useEffect(() => { coinRef.current = coinCount; }, [coinCount]);
    useEffect(() => { destroyedRef.current = destroyedCount; }, [destroyedCount]);

    /* ===== 보너스 시간 ===== */
    const [addTimeMs] = useState(3000);

    /* ===== 원격 스탯/파이널 ===== */
    const [remoteStats, setRemoteStats] = useState(new Map());
    const finalsRef = useRef(new Map()); // id -> 최종 스냅샷

    /* ===== 참가자 집합(배리어) ===== */
    const expectedIdsRef = useRef(new Set()); // identity(userUuid) 집합
    const resultsAnnouncedRef = useRef(false);
    const [waitingOverlay, setWaitingOverlay] = useState(false);
    const [resultsReady, setResultsReady] = useState(false);

    /* ───────── 유저 정보 ───────── */
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

    /* ───────── 리소스 로드 ───────── */
    useEffect(() => {
        (async () => {
            try {
                const { data, status } = await api.get("/constructures/generate", { params: { count: 40 } });
                if (status === 200 && data?.isSuccess) setBuildingList(data.result || []);
            } catch {}
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
            } catch {}
        })();
    }, []);
    useEffect(() => {
        (async () => {
            try {
                const token = localStorage.getItem("accessToken");
                const { data, status } = await api.get("/users/games/generate/numeric", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (status === 200) setCombo(Array.isArray(data?.patterns) ? data.patterns : []);
            } catch {}
        })();
    }, []);
    useEffect(() => {
        if (Array.isArray(combo) && combo.length > 0) {
            setPatternIdx(0);
            setStepIdx(0);
        }
    }, [combo]);

    /* 🔹 시작 카운트다운 (추가) */
    useEffect(() => {
        setReadyLeft(READY_SECONDS);
        const t = setInterval(() => {
            setReadyLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(t);
                    setIsPlaying(true);
                    isPlayingRef.current = true;
                    startTimeRef.current = Date.now(); // 타이머 기준 시각
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(t);
    }, []);

    /* ───────── Mediapipe (내 화면만) ───────── */
    useEffect(() => {
        let stream;
        let cam = null;
        let pose = null;

        (async () => {
            try {
                stream = await navigator.mediaDevices.getUserMedia({
                    video: { width: 640, height: 480, facingMode: "user" },
                    audio: false,
                });
                setLocalStream(stream);

                if (inputVideoRef.current) {
                    inputVideoRef.current.srcObject = stream;
                    inputVideoRef.current.muted = true;
                    inputVideoRef.current.playsInline = true;
                    await new Promise((res) => (inputVideoRef.current.onloadedmetadata = res));
                    await inputVideoRef.current.play().catch(() => {});
                }

                pose = new mpPose.Pose({
                    locateFile: (file) =>
                        `https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.5.1675469404/${file}`,
                });
                pose.setOptions({
                    modelComplexity: 0,
                    smoothLandmarks: true,
                    minDetectionConfidence: 0.5,
                    minTrackingConfidence: 0.5,
                });

                const LW = LM.LEFT_WRIST, RW = LM.RIGHT_WRIST;
                const LS = LM.LEFT_SHOULDER, RS = LM.RIGHT_SHOULDER;
                const LH = LM.LEFT_HIP, RH = LM.RIGHT_HIP;

                let startL = null, startR = null;
                let armed = false;
                let lastTs = 0;

                pose.onResults((res) => {
                    if (isGameOverRef.current || !isPlayingRef.current) return; // ← 추가
                    const lm = res.poseLandmarks;
                    const cvs = overlayCanvasRef.current;

                    if (cvs) {
                        const cw = cvs.clientWidth || 0;
                        const ch = cvs.clientHeight || 0;
                        if (cw && ch && (cvs.width !== cw || cvs.height !== ch)) {
                            cvs.width = cw; cvs.height = ch;
                        }
                    }

                    const ctx = cvs?.getContext("2d");
                    if (ctx) ctx.clearRect(0, 0, cvs.width, cvs.height);

                    if (!lm) {
                        setAction("idle");
                        armed = false;
                        return;
                    }

                    if (ctx) {
                        drawConnectors(ctx, lm, mpPose.POSE_CONNECTIONS, { lineWidth: 2 });
                        drawLandmarks(ctx, lm, { radius: 2 });
                    }

                    const now = performance.now() / 1000;
                    const dt = Math.max(0.016, Math.min(0.2, now - (lastTs || now)));
                    lastTs = now;

                    const shoulderDx = Math.abs(lm[LS].x - lm[RS].x);
                    const torsoDy = Math.abs((lm[LH].y + lm[RH].y) / 2 - (lm[LS].y + lm[RS].y) / 2);

                    const JAB_X_TH = 0.22 * shoulderDx;
                    const VEL_X_TH = (0.04 * shoulderDx) / dt;

                    const UPPER_Y_TH = 0.25 * torsoDy;
                    const VEL_Y_TH = (0.06 * torsoDy) / dt;

                    const L = { x: lm[LW].x, y: lm[LW].y };
                    const R = { x: lm[RW].x, y: lm[RW].y };

                    if (!armed) { startL = L; startR = R; armed = true; return; }

                    const ldx = L.x - startL.x, ldy = L.y - startL.y;
                    const rdx = R.x - startR.x, rdy = R.y - startR.y;

                    const lvx = ldx / dt, lvy = ldy / dt;
                    const rvx = rdx / dt, rvy = rdy / dt;

                    const leftJab = Math.abs(ldx) > JAB_X_TH && Math.abs(lvx) > VEL_X_TH && Math.abs(ldy) < UPPER_Y_TH * 0.6;
                    const rightJab = Math.abs(rdx) > JAB_X_TH && Math.abs(rvx) > VEL_X_TH && Math.abs(rdy) < UPPER_Y_TH * 0.6;

                    const leftUpper = ldy < -UPPER_Y_TH && lvy < -VEL_Y_TH;
                    const rightUpper = rdy < -UPPER_Y_TH && rvy < -VEL_Y_TH;

                    let moveIdx = null;
                    if (leftJab) moveIdx = 0;
                    else if (rightJab) moveIdx = 1;
                    else if (leftUpper) moveIdx = 2;
                    else if (rightUpper) moveIdx = 3;

                    if (moveIdx !== null) {
                        setAction("punch"); // Pixi가 이 값을 기대한다고 가정
                        setTimeout(() => setAction("idle"), 0);

                        const curr = combo?.[patternIdx];
                        const need = curr?.moves?.[stepIdx];
                        if (need === moveIdx) advanceStepOnce();

                        if (ctx) {
                            const labels = ["왼잽", "오잽", "왼어퍼", "오어퍼"];
                            const text = labels[moveIdx];
                            ctx.save();
                            ctx.font = "bold 24px sans-serif";
                            const w = ctx.measureText(text).width + 16;
                            ctx.fillStyle = "rgba(0,0,0,.65)";
                            ctx.fillRect(12, 12, w, 34);
                            ctx.fillStyle = "#ffd54a";
                            ctx.fillText(text, 20, 38);
                            ctx.restore();
                        }

                        startL = L; startR = R;
                    }
                });

                cam = new Camera(inputVideoRef.current, {
                    onFrame: async () => {
                        if (isGameOverRef.current || !isPlayingRef.current) return; // ← 추가
                        try { await pose.send({ image: inputVideoRef.current }); } catch {}
                    },
                    width: 640,
                    height: 480,
                });
                cam.start();
            } catch (e) {
                console.error("getUserMedia / Mediapipe 실패:", e);
            }
        })();

        return () => {
            try { cam?.stop?.(); } catch {}
            cam = null;
            try { pose?.close?.(); } catch {}
            pose = null;
            try { stream?.getTracks?.().forEach((t) => t.stop()); } catch {}
        };
    }, [combo, patternIdx, stepIdx]);

    /* ───────── LiveKit 연결 ───────── */
    useEffect(() => {
        if (!roomName || !userUuid) return;
        let currentRoom;

        const onTrackSubscribed = (track, publication, participant) => {
            if (track.kind !== Track.Kind.Video) return;
            setRemoteTracks((prev) => [
                ...prev.filter((t) => t.sid !== publication.trackSid),
                { sid: publication.trackSid, participantIdentity: participant.identity, track },
            ]);
        };
        const onTrackUnsubscribed = (_track, publication) => {
            if (publication.kind !== Track.Kind.Video) return;
            setRemoteTracks((prev) => prev.filter((t) => t.sid !== publication.trackSid));
        };

        const recalcExpected = (r) => {
            const ids = new Set([r.localParticipant.identity]);
            for (const p of r.remoteParticipants.values()) ids.add(p.identity);
            expectedIdsRef.current = ids;
        };

        (async () => {
            const token = await getToken(roomName, nickname || "player", userUuid);

            const r = new Room();
            currentRoom = r;
            setRoom(r);

            r.on(RoomEvent.TrackSubscribed, onTrackSubscribed);
            r.on(RoomEvent.TrackUnsubscribed, onTrackUnsubscribed);

            r.on(RoomEvent.ParticipantConnected, () => recalcExpected(r));
            r.on(RoomEvent.ParticipantDisconnected, () => recalcExpected(r));

            const onData = (payload, from) => {
                let obj;
                try { obj = JSON.parse(new TextDecoder().decode(payload)); } catch { return; }
                if (!obj?.type) return;

                if (obj.type === "log") {
                    const sender = obj.sender || from?.identity || "player";
                    setLog((prev) => [...prev, { sender, message: obj.text || "" }]);
                } else if (obj.type === "stat" && from?.identity) {
                    setRemoteStats((prev) => {
                        const next = new Map(prev);
                        next.set(from.identity, {
                            destroyed: obj.destroyedCount ?? 0,
                            coin: obj.coinCount ?? 0,
                        });
                        return next;
                    });
                } else if (obj.type === "final_stat") {
                    const { user, stat, sentAt } = obj;
                    if (!user?.id || !stat) return;
                    const cur = finalsRef.current.get(user.id);
                    if (!cur || (cur.arrivedAt ?? 0) < (sentAt ?? 0)) {
                        finalsRef.current.set(user.id, {
                            id: user.id,
                            nick: user.nick || from?.identity || "player",
                            destroyed: stat.destroyed ?? 0,
                            coin: stat.coin ?? 0,
                            kcal: stat.kcal ?? 0,
                            playTimeSec: stat.playTimeSec ?? 0,
                            arrivedAt: sentAt || Date.now(),
                        });
                    }
                    maybeAnnounceResults(); // 누군가 끝날 때마다 체크
                } else if (obj.type === "results_ready") {
                    if (resultsReady) return; // 한 번만 처리
                    setResultsReady(true);
                    setWaitingOverlay(false);
                    const delay = Math.max(0, (obj.goAt ?? Date.now()) - Date.now());
                    setTimeout(() => goToResultWithPayload(obj), delay);
                }
            };

            r.on(RoomEvent.DataReceived, onData);

            await r.connect(LIVEKIT_URL, token);

            const audio = await createLocalAudioTrack().catch(() => null);
            const video = await createLocalVideoTrack().catch(() => null);
            if (audio) await r.localParticipant.publishTrack(audio);
            if (video) {
                await r.localParticipant.publishTrack(video);
                setLocalVideoTrack(video);
            }

            // 참가자 집합 초기화
            recalcExpected(r);

            // 기존 원격 트랙 시딩
            const remotes = Array.from(r.remoteParticipants?.values?.() || []);
            remotes.forEach((p) => {
                p.videoTracks?.forEach?.((pub) => {
                    const t = pub.track;
                    if (t) {
                        setRemoteTracks((prev) => [
                            ...prev.filter((x) => x.sid !== pub.trackSid),
                            { sid: pub.trackSid, participantIdentity: p.identity, track: t },
                        ]);
                    }
                });
            });
        })().catch((e) => {
            console.error("LiveKit connect error:", e);
        });

        return () => {
            try { currentRoom?.disconnect(); } catch {}
            setRoom(null);
            setRemoteTracks([]);
            setLocalVideoTrack(null);
            setRemoteStats(new Map());
        };
    }, [roomName, userUuid, nickname, resultsReady]);

    async function getToken(roomName, nickName, userUuid) {
        const res = await fetch(`${APPLICATION_SERVER_URL}token`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ roomName, nickName, userUuid }),
        });
        const text = await res.text();
        if (!res.ok) throw new Error(`token api ${res.status}: ${text}`);
        let data;
        try { data = JSON.parse(text); } catch { throw new Error(`token non-json: ${text}`); }
        if (!data?.token) throw new Error(`token missing: ${text}`);
        return data.token;
    }

    /* ───────── 게임 타이머 (시작 후에만 동작) ───────── */
    useEffect(() => {
        if (!isPlaying) return;
        if (!startTimeRef.current) startTimeRef.current = Date.now();
        const it = setInterval(() => {
            const now = Date.now();
            setElapsedTime(Math.floor((now - startTimeRef.current) / 1000));
        }, 250);
        return () => clearInterval(it);
    }, [isPlaying]);

    useEffect(() => {
        const remaining = Math.max(TIME_LIMIT_SEC - elapsedTime, 0);
        setTimeover(remaining);
        if (remaining === 0 && !isGameOverRef.current) {
            setIsGameOver(true);
            triggerGameOver("timeup");
        }
    }, [elapsedTime]);

    const timePercent = Math.max(
        0,
        Math.min(100, Math.round(((TIME_LIMIT_SEC - elapsedTime) / TIME_LIMIT_SEC) * 100))
    );

    /* ───────── 콤보 진행 ───────── */
    const lastActionRef = useRef("idle");
    useEffect(() => {
        if (isGameOver) return;
        const isHit = action === "punch";
        if (isHit && lastActionRef.current !== action) {
            advanceStepOnce();
        }
        lastActionRef.current = action;
    }, [action, isGameOver]);

    function advanceStepOnce() {
        if (!Array.isArray(combo) || combo.length === 0) return;
        if (advanceLockRef.current) return;
        advanceLockRef.current = true;

        const current = combo[patternIdx];
        const total = (current?.moves || []).length;

        setStepIdx((prev) => {
            const next = prev + 1;
            if (next >= total) {
                setPatternIdx((p) => (p + 1) % combo.length);
                return 0;
            }
            return next;
        });

        setTimeout(() => (advanceLockRef.current = false), 250);
    }

    /* ───────── 브로드캐스트 ───────── */
    const broadcast = (type, payload = {}) => {
        if (!room) return;
        const msg = JSON.stringify({ type, ...payload });
        room.localParticipant
            .publishData(new TextEncoder().encode(msg), { reliable: true })
            .catch(() => {});
    };

    const sendMyFinal = () => {
        const playTimeSec = Math.max(
            0,
            Math.floor((Date.now() - (startTimeRef.current || Date.now())) / 1000)
        );
        const snap = {
            id: userUuid,
            nick: nickname || "me",
            destroyed: destroyedRef.current,
            coin: coinRef.current,
            kcal: Math.round(kcalRef.current),
            playTimeSec,
            arrivedAt: Date.now(),
        };
        finalsRef.current.set(userUuid, snap);

        broadcast("final_stat", {
            user: { id: userUuid, nick: nickname || "me" },
            stat: snap,
            sentAt: snap.arrivedAt,
        });
        return snap;
    };

    /* ───────── 배리어: 모두 끝나면 결과 공표 ───────── */
    const haveAllFinals = () => {
        const ids = expectedIdsRef.current;
        for (const id of ids) {
            if (!finalsRef.current.has(id)) return false;
        }
        return true;
    };

    const maybeAnnounceResults = () => {
        if (resultsAnnouncedRef.current) return;
        if (!haveAllFinals()) return;

        resultsAnnouncedRef.current = true;

        const full = sortAll(finalsRef.current).map((x, i) => ({ rank: i + 1, ...x }));
        const top3 = full.slice(0, 3);

        const payload = {
            type: "results_ready",
            top3,
            full,
            endedAt: Date.now(),
            goAt: Date.now() + 1200,
        };

        broadcast("results_ready", payload);

        const delay = Math.max(0, payload.goAt - Date.now());
        setTimeout(() => goToResultWithPayload(payload), delay);
    };

    const goToResultWithPayload = (payload) => {
        const full = payload.full || sortAll(finalsRef.current).map((x, i) => ({ rank: i + 1, ...x }));
        const top3 = payload.top3 || full.slice(0, 3);
        const meEntry =
            full.find((x) => x.id === userUuid) ||
            finalsRef.current.get(userUuid) || {
                id: userUuid, nick: nickname || "me",
                destroyed: destroyedRef.current, coin: coinRef.current, kcal: Math.round(kcalRef.current),
                playTimeSec: 0,
            };
        const me = meEntry.rank ? meEntry : { ...meEntry, rank: full.findIndex((x) => x.id === meEntry.id) + 1 };

        navigate("/multi-result", {
            replace: true,
            state: {
                roomName,
                meId: userUuid,
                me,
                results: top3,
                endedAt: payload.endedAt || Date.now(),
            },
        });
    };

    const triggerGameOver = () => {
        if (isGameOverRef.current) return;
        setIsGameOver(true);
        setWaitingOverlay(true);
        sendMyFinal();
        maybeAnnounceResults();
    };

    /* ───────── 로그/스탯 브로드캐스트 ───────── */
    const broadcastDestroyLog = (buildingObj) => {
        if (!room) return;
        const name =
            buildingObj?.name ||
            buildingObj?.title ||
            buildingObj?.imageName ||
            buildingObj?.filename ||
            "건물";
        const text = `${nickname || "플레이어"}님이 "${name}"를 부쉈습니다.`;
        const payload = JSON.stringify({ type: "log", text, sender: nickname || "me" });
        room.localParticipant
            .publishData(new TextEncoder().encode(payload), { reliable: true })
            .catch(() => {});
        setLog((prev) => [...prev, { sender: nickname || "me", message: text }]);
    };

    const broadcastMyStat = (nextDestroyed, nextCoin) => {
        if (!room) return;
        const payload = JSON.stringify({
            type: "stat",
            destroyedCount: nextDestroyed,
            coinCount: nextCoin,
        });
        room.localParticipant
            .publishData(new TextEncoder().encode(payload), { reliable: true })
            .catch(() => {});
    };

    /* ───────── 파괴 핸들러(단일) ───────── */
    const handleDestroyed = () => {
        if (isGameOverRef.current) return;

        const nextDestroyed = destroyedRef.current + 1;
        const nextCoin = coinRef.current + 1;

        setDestroyedCount(nextDestroyed);
        setCoinCount(nextCoin);

        broadcastMyStat(nextDestroyed, nextCoin);

        if (startTimeRef.current) startTimeRef.current += addTimeMs;

        broadcastDestroyLog(currentBuilding);

        setBuildingIndex((prev) =>
            buildingList.length === 0 ? 0 : (prev + 1) % buildingList.length
        );
    };

    /* ───────── UI 데이터 ───────── */
    const sidebarPeers = useMemo(() => {
        const ids = Array.from(new Set(remoteTracks.map((t) => t.participantIdentity))).filter(
            (u) => u && u !== userUuid
        );
        const trackById = new Map(remoteTracks.map((t) => [t.participantIdentity, t.track]));
        const arr = ids.slice(0, 3).map((uuid) => ({
            uuid,
            track: trackById.get(uuid) || null,
            nickname: "대기 중",
            stat: remoteStats.get(uuid),
        }));
        while (arr.length < 3) arr.push({ uuid: null, track: null, nickname: "대기 중", stat: null });
        return arr;
    }, [userUuid, remoteTracks, remoteStats]);

    return (
        <div className="mp-root">
            {/* 🔹 시작 전 카운트다운 오버레이 (추가) */}
            {!isGameOver && !isPlaying && (
                <div className="prestart-overlay">
                    <div className="countdown">{readyLeft}</div>
                </div>
            )}

            {/* 좌: 원격 참가자 3명 */}
            <aside className="mp-sidebar">
                {sidebarPeers.map((p, idx) => (
                    <RemotePeerTile key={idx} track={p.track} uuid={p.uuid} stat={p.stat} />
                ))}
            </aside>

            {/* 가운데: 게임 */}
            <main className="mp-main">
                {/* HUD: 타이머바 + 콤보 */}
                <div className="mp-hud">
                    <div className="timer-bar">
                        <div className="timer-fill" style={{ width: `${timePercent}%` }} />
                    </div>
                    <CommandSequence combo={combo} patternIdx={patternIdx} stepIdx={stepIdx} />
                </div>

                <div className="mp-game">
                    <PixiCanvas
                        key={currentBuilding?.id || buildingIndex}   // HP 초기화
                        action={action}
                        building={currentBuilding}
                        playerSkin={playerSkin}
                        combo={combo}
                        onBuildingDestroyed={handleDestroyed}
                        onDestroyed={handleDestroyed}
                        setKcal={(v) => { setKcal(v); kcalRef.current = v; }}
                        onKcalChange={(v) => { setKcal(v); kcalRef.current = v; }}
                        showBuildingHp
                    />
                </div>

                {/* Mediapipe 입력 전용(숨김) */}
                <video ref={inputVideoRef} className="mp-hidden-input" muted playsInline autoPlay />
            </main>

            {/* 우: 로그 + 내 카메라 + 스탯 */}
            <aside className="mp-right">
                <LogPanel messages={log} />

                <div className="me-card">
                    <div className="me-video-wrap">
                        <MyCamera stream={localStream} overlayRef={overlayCanvasRef} />
                    </div>
                    <div className="me-stats">
                        ⏱ {timeover}s · 🔥 {kcal} KCAL · 💰 {coinCount} · 🏢 {destroyedCount}
                    </div>
                </div>
            </aside>

            {waitingOverlay && !resultsReady && (
                <div
                    style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(0,0,0,.55)",
                        filter: "grayscale(1)",
                        zIndex: 9999,
                    }}
                />
            )}
        </div>
    );
}
