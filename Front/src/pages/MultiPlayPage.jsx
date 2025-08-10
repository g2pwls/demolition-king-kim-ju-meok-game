import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    Room,
    RoomEvent,
    Track,
    createLocalAudioTrack,
    createLocalVideoTrack,
} from "livekit-client";
import PixiCanvas from "../components/pixi/PixiCanvas";
import api from "../utils/api";
import "../styles/MultiPlayPage.css";

// LiveKit 접속 정보 (로비와 동일)
const APPLICATION_SERVER_URL = "http://localhost:6080/";
const LIVEKIT_URL = "ws://localhost:7880/";

// --- LiveKit 비디오 타일 (트랙 attach 전용) ---
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

// 좌측 친구 타일 (LiveKit 구독 트랙)
function RemotePeerTile({ track, nickname = "대기 중...", uuid }) {
    const on = !!track;
    return (
        <div className={`peer-tile ${on ? "on" : "off"}`}>
            {track ? <LKVideoTile track={track} /> : null}
            <div className="peer-badge">
                <span className="name">{nickname}</span>
                {uuid ? <span className="uuid">{String(uuid).slice(0, 6)}…</span> : null}
            </div>
        </div>
    );
}

// 좌하단 내 PIP (getUserMedia 스트림 사용)
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

// 우상단 채팅/로그
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

export default function MultiPlayPage() {
    const navigate = useNavigate();
    const { state } = useLocation(); // { roomName, members }
    const roomName = state?.roomName ?? "unknown-room";
    const members = state?.members ?? [];

    // 유저
    const [userUuid, setUserUuid] = useState("");
    const [nickname, setNickname] = useState("");

    // LiveKit
    const [room, setRoom] = useState(null);
    const [remoteTracks, setRemoteTracks] = useState([]); // [{sid, participantIdentity, track}]
    const [localVideoTrack, setLocalVideoTrack] = useState(null);

    // 채팅
    const [chat, setChat] = useState([]);

    // Mediapipe 입력용 로컬 스트림 + 비디오
    const [localStream, setLocalStream] = useState(null);
    const inputVideoRef = useRef(null);
    const overlayCanvasRef = useRef(null); // 원하면 랜드마크 오버레이에 사용

    // ===== 게임 상태(싱글 로직 재사용) =====
    const [action, setAction] = useState("idle");
    const [timeover, setTimeover] = useState(100);
    const [kcal, setKcal] = useState(0);
    const [coinCount, setCoinCount] = useState(0);
    const [destroyedCount, setDestroyedCount] = useState(0);

    const [buildingList, setBuildingList] = useState([]);
    const [buildingIndex, setBuildingIndex] = useState(0);
    const currentBuilding = buildingList[buildingIndex] ?? null;
    const [playerSkin, setPlayerSkin] = useState("");
    const [combo, setCombo] = useState([]);

    // 콤보 진행
    const [patternIdx, setPatternIdx] = useState(0);
    const [stepIdx, setStepIdx] = useState(0);
    const advanceLockRef = useRef(false);

    // ── 유저 정보
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

    // ── 리소스 로드
    useEffect(() => {
        (async () => {
            try {
                const { data, status } = await api.get("/constructures/generate", {
                    params: { count: 40 },
                });
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
                const { data, status } = await api.get("users/games/generate/numeric", {
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

    // ── getUserMedia (Mediapipe/내 PIP용)
    useEffect(() => {
        let s;
        (async () => {
            try {
                s = await navigator.mediaDevices.getUserMedia({
                    video: { width: 640, height: 480, facingMode: "user" },
                    audio: false,
                });
                setLocalStream(s);
                if (inputVideoRef.current) {
                    inputVideoRef.current.srcObject = s;
                    await inputVideoRef.current.play().catch(() => {});
                }
                if (overlayCanvasRef.current && inputVideoRef.current) {
                    overlayCanvasRef.current.width = inputVideoRef.current.videoWidth || 640;
                    overlayCanvasRef.current.height = inputVideoRef.current.videoHeight || 480;
                }
            } catch (e) {
                console.error("getUserMedia 실패:", e);
            }
        })();
        return () => {
            s?.getTracks()?.forEach((t) => t.stop());
        };
    }, []);

    // ── LiveKit 연결 (로비와 동일 패턴)
    useEffect(() => {
        if (!roomName || !userUuid) return;

        let currentRoom;

        const onTrackSubscribed = (track, publication, participant) => {
            if (track.kind !== Track.Kind.Video) return;
            setRemoteTracks((prev) => [
                ...prev.filter((t) => t.sid !== publication.trackSid),
                {
                    sid: publication.trackSid,
                    participantIdentity: participant.identity,
                    track,
                },
            ]);
        };

        const onTrackUnsubscribed = (_track, publication, participant) => {
            if (publication.kind !== Track.Kind.Video) return;
            setRemoteTracks((prev) =>
                prev.filter((t) => t.sid !== publication.trackSid)
            );
        };

        (async () => {
            // 방/토큰
            const token = await getToken(roomName, nickname || "player", userUuid);

            // 룸 생성 및 이벤트 바인딩
            const r = new Room();
            currentRoom = r;
            setRoom(r);

            r.on(RoomEvent.TrackSubscribed, onTrackSubscribed);
            r.on(RoomEvent.TrackUnsubscribed, onTrackUnsubscribed);

            r.on(RoomEvent.DataReceived, (payload, from) => {
                try {
                    const text = new TextDecoder().decode(payload);
                    const obj = JSON.parse(text);
                    const sender =
                        obj?.sender || from?.identity || (from?.name ?? "player");
                    setChat((prev) => [...prev, { sender, message: obj?.message ?? "" }]);
                } catch {
                    // 평문도 허용
                    const text = new TextDecoder().decode(payload);
                    setChat((prev) => [...prev, { sender: from?.identity ?? "player", message: text }]);
                }
            });

            // 접속
            await r.connect(LIVEKIT_URL, token);

            // 로컬 트랙 퍼블리시(오디오/비디오)
            const audio = await createLocalAudioTrack().catch(() => null);
            const video = await createLocalVideoTrack().catch(() => null);
            if (audio) await r.localParticipant.publishTrack(audio);
            if (video) {
                await r.localParticipant.publishTrack(video);
                setLocalVideoTrack(video); // 필요하면 메인에서도 attach 가능
            }
        })().catch((e) => {
            console.error("LiveKit connect error:", e);
        });

        return () => {
            try { currentRoom?.disconnect(); } catch {}
            setRoom(null);
            setRemoteTracks([]);
            setLocalVideoTrack(null);
        };
    }, [roomName, userUuid, nickname]);

    // ── 채팅 전송 (LiveKit data)
    const sendChat = (text) => {
        if (!room || !text.trim()) return;
        const payload = JSON.stringify({ sender: nickname || "me", message: text });
        room.localParticipant
            .publishData(new TextEncoder().encode(payload), { reliable: true })
            .catch(() => {});
        setChat((prev) => [...prev, { sender: nickname || "me", message: text }]);
    };

    // ── 게임 타이머
    useEffect(() => {
        const it = setInterval(() => {
            if (action !== "punch") setTimeover((p) => Math.max(p - 1, 0));
        }, 1000);
        return () => clearInterval(it);
    }, [action]);

    // 콤보 진행 (간단 모드)
    const lastActionRef = useRef("idle");
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
                setCoinCount((c) => c + 1);
                setPatternIdx((p) => (p + 1) % combo.length);
                return 0;
            }
            return next;
        });

        setTimeout(() => (advanceLockRef.current = false), 250);
    }

    // 좌측 사이드바 표시 순서 (로비에서 넘긴 members 기준, 내 uuid 제외)
    const sidebarPeers = useMemo(() => {
        const order = members.filter((u) => u && u !== userUuid);
        // uuid -> track 매핑
        const map = new Map(remoteTracks.map((t) => [t.participantIdentity, t.track]));
        const arr = order.slice(0, 3).map((uuid) => ({
            uuid,
            track: map.get(uuid) || null,
            nickname: "대기 중",
        }));
        while (arr.length < 3) arr.push({ uuid: null, track: null, nickname: "대기 중" });
        return arr;
    }, [members, userUuid, remoteTracks]);

    // LiveKit 토큰 요청
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

    return (
        <div className="mp-root">
            {/* 좌측: 친구 3명 (전체폭의 1/7은 CSS에서) */}
            <aside className="mp-sidebar">
                {sidebarPeers.map((p, idx) => (
                    <RemotePeerTile key={idx} track={p.track} uuid={p.uuid} />
                ))}
            </aside>

            {/* 메인 게임 */}
            <main className="mp-main">
                <div className="mp-game">
                    <PixiCanvas
                        action={action}
                        building={currentBuilding}
                        playerSkin={playerSkin}
                        combo={combo}
                        onBuildingDestroyed={() => {
                            setBuildingIndex((prev) =>
                                buildingList.length === 0 ? 0 : (prev + 1) % buildingList.length
                            );
                            setDestroyedCount((c) => c + 1);
                            setCoinCount((c) => c + 1);
                        }}
                        setKcal={setKcal}
                        showBuildingHp={false}
                    />
                </div>

                {/* 내 카메라 PIP */}
                <LocalPIP stream={localStream} />

                {/* Mediapipe 입력용 (숨김) + 오버레이(옵션) */}
                <video ref={inputVideoRef} className="mp-hidden-input" muted playsInline autoPlay />
                <canvas ref={overlayCanvasRef} className="mp-hidden-input" />
            </main>

            {/* 우상단: 채팅/로그 */}
            <div className="mp-chat-wrap">
                <ChatLog messages={chat} onSend={sendChat} />
                <div style={{ marginTop: 8, color: "#e9ecf1", fontSize: 12 }}>
                    ⏱ {timeover}% · 🔥 {kcal} KCAL · 💰 {coinCount} · 🏢 {destroyedCount}
                </div>
            </div>
        </div>
    );
}
