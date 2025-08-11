// src/pages/MultiPlayPage.jsx
import React from "react";

export default function MultiPlayPage() {
  return (
    <div style={{padding: 24}}>
      멀티 플레이 페이지 준비중
    </div>
  );
}

// import React, { useEffect, useMemo, useRef, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import {
//     Room,
//     RoomEvent,
//     Track,
//     createLocalAudioTrack,
//     createLocalVideoTrack,
// } from "livekit-client";
// import * as mpPose from "@mediapipe/pose";
// import { Camera } from "@mediapipe/camera_utils";
// import { drawLandmarks, drawConnectors } from "@mediapipe/drawing_utils";

// import PixiCanvas from "../components/pixi/PixiCanvas";
// import api from "../utils/api";
// import "../styles/MultiPlayPage.css";

// const APPLICATION_SERVER_URL = "http://localhost:6080/";
// const LIVEKIT_URL = "ws://localhost:7880/";

// // ✅ Pose 랜드마크 인덱스를 숫자로 고정(빌드 환경에 따라 PoseLandmark 미노출 이슈 방지)
// const LM = {
//     NOSE: 0,
//     LEFT_SHOULDER: 11,
//     RIGHT_SHOULDER: 12,
//     LEFT_ELBOW: 13,
//     RIGHT_ELBOW: 14,
//     LEFT_WRIST: 15,
//     RIGHT_WRIST: 16,
//     LEFT_HIP: 23,
//     RIGHT_HIP: 24,
// };

// const MOVE_META = {
//     0: { label: "왼잽", color: "red" },
//     1: { label: "오잽", color: "red" },
//     2: { label: "왼어퍼", color: "black" },
//     3: { label: "오어퍼", color: "black" },
// };

// /* ---------- 공용 비디오 타일 ---------- */
// function LKVideoTile({ track, muted, className = "" }) {
//     const vref = useRef(null);
//     useEffect(() => {
//         if (!track || !vref.current) return;
//         track.attach(vref.current);
//         return () => {
//             try {
//                 track.detach(vref.current);
//             } catch {}
//         };
//     }, [track]);
//     return (
//         <video
//             ref={vref}
//             autoPlay
//             playsInline
//             muted={!!muted}
//             className={`slot-video ${className}`}
//         />
//     );
// }

// /* ---------- 좌측 원격 타일 ---------- */
// function RemotePeerTile({ track, nickname = "대기 중...", uuid }) {
//     const on = !!track;
//     return (
//         <div className={`peer-tile ${on ? "on" : "off"}`}>
//             {track ? <LKVideoTile track={track} /> : null}
//             <div className="peer-badge">
//                 <span className="name">{nickname}</span>
//                 {uuid ? <span className="uuid">{String(uuid).slice(0, 6)}…</span> : null}
//             </div>
//         </div>
//     );
// }

// /* ---------- 콤보 HUD ---------- */
// function CommandSequence({ combo, patternIdx, stepIdx }) {
//     const current = combo?.[patternIdx];
//     const moves = current?.moves || [];
//     return (
//         <div className="command-sequence">
//             {moves.map((m, i) => {
//                 const meta = MOVE_META[m] || { label: "?", color: "black" };
//                 const stateClass = i < stepIdx ? "done" : i === stepIdx ? "current" : "";
//                 const colorClass = meta.color === "red" ? "red" : "black";
//                 return (
//                     <div key={i} className={`command-circle ${colorClass} ${stateClass}`}>
//                         {meta.label}
//                     </div>
//                 );
//             })}
//         </div>
//     );
// }

// /* ---------- 로그 패널(읽기 전용) ---------- */
// function LogPanel({ messages }) {
//     return (
//         <div className="mp-chat">
//             <div className="mp-chat-title">LOG</div>
//             <div className="mp-chat-list">
//                 {messages.map((m, i) => (
//                     <div key={i} className="mp-chat-item">
//                         <span className="nick">{m.sender}</span>
//                         <span className="msg"> {m.message}</span>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }

// /* ---------- 우측: 내 카메라 + Mediapipe 오버레이 ---------- */
// function MyCamera({ stream, overlayRef }) {
//     const vref = useRef(null);
//     useEffect(() => {
//         if (!vref.current) return;
//         vref.current.srcObject = stream || null;
//         if (stream) vref.current.play().catch(() => {});
//     }, [stream]);

//     return (
//         <div className="local-pip">
//             {/* contain으로 크롭 방지 */}
//             <video
//                 ref={vref}
//                 autoPlay
//                 playsInline
//                 muted
//                 className="mirror"
//                 style={{ width: "100%", height: "100%", objectFit: "contain" }}
//             />
//             {/* Mediapipe 오버레이 */}
//             <canvas
//                 ref={overlayRef}
//                 className="overlay mirror"
//                 style={{ width: "100%", height: "100%" }}
//             />
//         </div>
//     );
// }

// export default function MultiPlayPage() {
//     const navigate = useNavigate();
//     const { state } = useLocation(); // { roomName }
//     const roomName = state?.roomName ?? "unknown-room";

//     /* ===== 사용자 ===== */
//     const [userUuid, setUserUuid] = useState("");
//     const [nickname, setNickname] = useState("");

//     /* ===== LiveKit ===== */
//     const [room, setRoom] = useState(null);
//     const [remoteTracks, setRemoteTracks] = useState([]);
//     const [localVideoTrack, setLocalVideoTrack] = useState(null);

//     /* ===== 게임 로그(채팅 대신) ===== */
//     const [log, setLog] = useState([]);

//     /* ===== 내 카메라(미리보기 & Mediapipe 입력) ===== */
//     const [localStream, setLocalStream] = useState(null);
//     const inputVideoRef = useRef(null); // Mediapipe 입력용(숨김)
//     const overlayCanvasRef = useRef(null); // 내 PIP 위에 그리는 캔버스

//     /* ===== 싱글플레이 로직 이식: 상태 ===== */
//     const [action, setAction] = useState("idle");
//     const [timeover, setTimeover] = useState(100);
//     const [kcal, setKcal] = useState(0);
//     const [coinCount, setCoinCount] = useState(0);
//     const [destroyedCount, setDestroyedCount] = useState(0);

//     const [buildingList, setBuildingList] = useState([]);
//     const [buildingIndex, setBuildingIndex] = useState(0);
//     const currentBuilding = buildingList[buildingIndex] ?? null;
//     const [playerSkin, setPlayerSkin] = useState("");
//     const [combo, setCombo] = useState([]);

//     const [patternIdx, setPatternIdx] = useState(0);
//     const [stepIdx, setStepIdx] = useState(0);
//     const advanceLockRef = useRef(false);

//     /* ===== 타이머/게임오버(간단 모드) ===== */
//     const TIME_LIMIT_SEC = 100;
//     const startTimeRef = useRef(null);
//     const [elapsedTime, setElapsedTime] = useState(0);
//     const [isGameOver, setIsGameOver] = useState(false);
//     const isGameOverRef = useRef(false);
//     useEffect(() => {
//         isGameOverRef.current = isGameOver;
//     }, [isGameOver]);

//     /* ───────── 유저 정보 ───────── */
//     useEffect(() => {
//         const token = localStorage.getItem("accessToken");
//         if (!token) {
//             alert("로그인이 필요합니다.");
//             navigate("/", { replace: true });
//             return;
//         }
//         fetch("https://i13e106.p.ssafy.io/api/user/auth/getUserInfo", {
//             method: "GET",
//             headers: { Authorization: `Bearer ${token}` },
//         })
//             .then((r) => r.json())
//             .then((data) => {
//                 setUserUuid(data?.result?.userUuid ?? "");
//                 setNickname(data?.result?.userNickname ?? "");
//             })
//             .catch(() => {});
//     }, [navigate]);

//     /* ───────── 리소스 로드 ───────── */
//     useEffect(() => {
//         (async () => {
//             try {
//                 const { data, status } = await api.get("/constructures/generate", {
//                     params: { count: 40 },
//                 });
//                 if (status === 200 && data?.isSuccess) setBuildingList(data.result || []);
//             } catch {}
//         })();
//     }, []);
//     useEffect(() => {
//         (async () => {
//             try {
//                 const token = localStorage.getItem("accessToken");
//                 const { data } = await api.get("/skins/getSkin", {
//                     headers: { Authorization: `Bearer ${token}` },
//                 });
//                 setPlayerSkin(data?.result ?? "");
//             } catch {}
//         })();
//     }, []);
//     useEffect(() => {
//         (async () => {
//             try {
//                 const token = localStorage.getItem("accessToken");
//                 const { data, status } = await api.get("users/games/generate/numeric", {
//                     headers: { Authorization: `Bearer ${token}` },
//                 });
//                 if (status === 200) setCombo(Array.isArray(data?.patterns) ? data.patterns : []);
//             } catch {}
//         })();
//     }, []);
//     useEffect(() => {
//         if (Array.isArray(combo) && combo.length > 0) {
//             setPatternIdx(0);
//             setStepIdx(0);
//         }
//     }, [combo]);

//     /* ───────── Mediapipe (내 화면만) ───────── */
//     useEffect(() => {
//         let stream;
//         let cam = null;
//         let pose = null;

//         (async () => {
//             try {
//                 // 1) 로컬 카메라
//                 stream = await navigator.mediaDevices.getUserMedia({
//                     video: { width: 640, height: 480, facingMode: "user" },
//                     audio: false,
//                 });
//                 setLocalStream(stream);

//                 // 입력용(숨김) 비디오에 연결
//                 if (inputVideoRef.current) {
//                     inputVideoRef.current.srcObject = stream;
//                     inputVideoRef.current.muted = true;
//                     inputVideoRef.current.playsInline = true;
//                     await new Promise((res) => (inputVideoRef.current.onloadedmetadata = res));
//                     await inputVideoRef.current.play().catch(() => {});
//                 }

//                 // 2) Pose 초기화 (버전 고정)
//                 pose = new mpPose.Pose({
//                     locateFile: (file) =>
//                         `https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.5.1675469404/${file}`,
//                 });
//                 pose.setOptions({
//                     modelComplexity: 0,
//                     smoothLandmarks: true,
//                     minDetectionConfidence: 0.5,
//                     minTrackingConfidence: 0.5,
//                 });

//                 // 내부 상태
//                 const LW = LM.LEFT_WRIST;
//                 const RW = LM.RIGHT_WRIST;
//                 const LS = LM.LEFT_SHOULDER;
//                 const RS = LM.RIGHT_SHOULDER;
//                 const LH = LM.LEFT_HIP;
//                 const RH = LM.RIGHT_HIP;

//                 let startL = null,
//                     startR = null;
//                 let armed = false;
//                 let lastTs = 0;

//                 // 3) 결과 콜백
//                 pose.onResults((res) => {
//                     if (isGameOverRef.current) return;

//                     const lm = res.poseLandmarks;
//                     const cvs = overlayCanvasRef.current;

//                     // 오버레이 캔버스를 PIP 크기로 동기화
//                     if (cvs) {
//                         const cw = cvs.clientWidth || 0;
//                         const ch = cvs.clientHeight || 0;
//                         if (cw && ch && (cvs.width !== cw || cvs.height !== ch)) {
//                             cvs.width = cw;
//                             cvs.height = ch;
//                         }
//                     }

//                     const ctx = cvs?.getContext("2d");
//                     if (ctx) ctx.clearRect(0, 0, cvs.width, cvs.height);

//                     if (!lm) {
//                         setAction("idle");
//                         armed = false;
//                         return;
//                     }

//                     // === 점/선 스켈레톤 ===
//                     if (ctx) {
//                         drawConnectors(ctx, lm, mpPose.POSE_CONNECTIONS, { lineWidth: 2 });
//                         drawLandmarks(ctx, lm, { radius: 2 });
//                     }

//                     // === 간단 동작 인식 ===
//                     const now = performance.now() / 1000;
//                     const dt = Math.max(0.016, Math.min(0.2, now - (lastTs || now)));
//                     lastTs = now;

//                     const shoulderDx = Math.abs(lm[LS].x - lm[RS].x);
//                     const torsoDy =
//                         Math.abs((lm[LH].y + lm[RH].y) / 2 - (lm[LS].y + lm[RS].y) / 2);

//                     const JAB_X_TH = 0.22 * shoulderDx;
//                     const VEL_X_TH = 0.04 * shoulderDx / dt;

//                     const UPPER_Y_TH = 0.25 * torsoDy;
//                     const VEL_Y_TH = 0.06 * torsoDy / dt;

//                     const L = { x: lm[LW].x, y: lm[LW].y };
//                     const R = { x: lm[RW].x, y: lm[RW].y };

//                     if (!armed) {
//                         startL = L;
//                         startR = R;
//                         armed = true;
//                         return;
//                     }

//                     const ldx = L.x - startL.x,
//                         ldy = L.y - startL.y;
//                     const rdx = R.x - startR.x,
//                         rdy = R.y - startR.y;

//                     const lvx = ldx / dt,
//                         lvy = ldy / dt;
//                     const rvx = rdx / dt,
//                         rvy = rdy / dt;

//                     const leftJab =
//                         Math.abs(ldx) > JAB_X_TH &&
//                         Math.abs(lvx) > VEL_X_TH &&
//                         Math.abs(ldy) < UPPER_Y_TH * 0.6;
//                     const rightJab =
//                         Math.abs(rdx) > JAB_X_TH &&
//                         Math.abs(rvx) > VEL_X_TH &&
//                         Math.abs(rdy) < UPPER_Y_TH * 0.6;

//                     const leftUpper = ldy < -UPPER_Y_TH && lvy < -VEL_Y_TH;
//                     const rightUpper = rdy < -UPPER_Y_TH && rvy < -VEL_Y_TH;

//                     let moveIdx = null; // 0:왼잽 1:오잽 2:왼어퍼 3:오어퍼
//                     if (leftJab) moveIdx = 0;
//                     else if (rightJab) moveIdx = 1;
//                     else if (leftUpper) moveIdx = 2;
//                     else if (rightUpper) moveIdx = 3;

//                     if (moveIdx !== null) {
//                         setAction("punch");
//                         setTimeout(() => setAction("idle"), 0);

//                         const curr = combo?.[patternIdx];
//                         const need = curr?.moves?.[stepIdx];
//                         if (need === moveIdx) advanceStepOnce();

//                         if (ctx) {
//                             const labels = ["왼잽", "오잽", "왼어퍼", "오어퍼"];
//                             const text = labels[moveIdx];
//                             ctx.save();
//                             ctx.font = "bold 24px sans-serif";
//                             const w = ctx.measureText(text).width + 16;
//                             ctx.fillStyle = "rgba(0,0,0,.65)";
//                             ctx.fillRect(12, 12, w, 34);
//                             ctx.fillStyle = "#ffd54a";
//                             ctx.fillText(text, 20, 38);
//                             ctx.restore();
//                         }

//                         startL = L;
//                         startR = R;
//                     }
//                 });

//                 // 4) Mediapipe 카메라 루프
//                 cam = new Camera(inputVideoRef.current, {
//                     onFrame: async () => {
//                         if (isGameOverRef.current) return;
//                         try {
//                             await pose.send({ image: inputVideoRef.current });
//                         } catch {}
//                     },
//                     width: 640,
//                     height: 480,
//                 });
//                 cam.start();
//             } catch (e) {
//                 console.error("getUserMedia / Mediapipe 실패:", e);
//             }
//         })();

//         // 정리
//         return () => {
//             try { cam?.stop?.(); } catch {}
//             cam = null;
//             try { pose?.close?.(); } catch {}
//             pose = null;
//             try {
//                 stream?.getTracks?.().forEach((t) => t.stop());
//             } catch {}
//         };
//     }, [combo, patternIdx, stepIdx]);

//     /* ───────── LiveKit 연결 ───────── */
//     useEffect(() => {
//         if (!roomName || !userUuid) return;

//         let currentRoom;

//         const onTrackSubscribed = (track, publication, participant) => {
//             if (track.kind !== Track.Kind.Video) return;
//             setRemoteTracks((prev) => [
//                 ...prev.filter((t) => t.sid !== publication.trackSid),
//                 { sid: publication.trackSid, participantIdentity: participant.identity, track },
//             ]);
//         };
//         const onTrackUnsubscribed = (_track, publication) => {
//             if (publication.kind !== Track.Kind.Video) return;
//             setRemoteTracks((prev) => prev.filter((t) => t.sid !== publication.trackSid));
//         };

//         (async () => {
//             const token = await getToken(roomName, nickname || "player", userUuid);

//             const r = new Room();
//             currentRoom = r;
//             setRoom(r);

//             r.on(RoomEvent.TrackSubscribed, onTrackSubscribed);
//             r.on(RoomEvent.TrackUnsubscribed, onTrackUnsubscribed);

//             r.on(RoomEvent.DataReceived, (payload, from) => {
//                 try {
//                     const text = new TextDecoder().decode(payload);
//                     const obj = JSON.parse(text);
//                     if (obj?.type === "log") {
//                         const sender = obj.sender || from?.identity || "player";
//                         setLog((prev) => [...prev, { sender, message: obj.text || "" }]);
//                     }
//                 } catch {}
//             });

//             await r.connect(LIVEKIT_URL, token);

//             const audio = await createLocalAudioTrack().catch(() => null);
//             const video = await createLocalVideoTrack().catch(() => null);
//             if (audio) await r.localParticipant.publishTrack(audio);
//             if (video) {
//                 await r.localParticipant.publishTrack(video);
//                 setLocalVideoTrack(video);
//             }

//             // 시딩
//             const remotes = Array.from(r.remoteParticipants?.values?.() || []);
//             remotes.forEach((p) => {
//                 p.videoTracks?.forEach?.((pub) => {
//                     const t = pub.track;
//                     if (t) {
//                         setRemoteTracks((prev) => [
//                             ...prev.filter((x) => x.sid !== pub.trackSid),
//                             { sid: pub.trackSid, participantIdentity: p.identity, track: t },
//                         ]);
//                     }
//                 });
//             });
//         })().catch((e) => {
//             console.error("LiveKit connect error:", e);
//         });

//         return () => {
//             try {
//                 currentRoom?.disconnect();
//             } catch {}
//             setRoom(null);
//             setRemoteTracks([]);
//             setLocalVideoTrack(null);
//         };
//     }, [roomName, userUuid, nickname]);

//     async function getToken(roomName, nickName, userUuid) {
//         const res = await fetch(`${APPLICATION_SERVER_URL}token`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ roomName, nickName, userUuid }),
//         });
//         const text = await res.text();
//         if (!res.ok) throw new Error(`token api ${res.status}: ${text}`);
//         let data;
//         try {
//             data = JSON.parse(text);
//         } catch {
//             throw new Error(`token non-json: ${text}`);
//         }
//         if (!data?.token) throw new Error(`token missing: ${text}`);
//         return data.token;
//     }

//     /* ───────── 게임 타이머 ───────── */
//     useEffect(() => {
//         if (isGameOver) return;
//         if (!startTimeRef.current) startTimeRef.current = Date.now();
//         const it = setInterval(() => {
//             const now = Date.now();
//             setElapsedTime(Math.floor((now - startTimeRef.current) / 1000));
//         }, 250);
//         return () => clearInterval(it);
//     }, [isGameOver]);

//     useEffect(() => {
//         const remaining = Math.max(TIME_LIMIT_SEC - elapsedTime, 0);
//         setTimeover(remaining);
//         if (remaining === 0 && !isGameOverRef.current) setIsGameOver(true);
//     }, [elapsedTime]);

//     const timePercent = Math.max(
//         0,
//         Math.min(100, Math.round(((TIME_LIMIT_SEC - elapsedTime) / TIME_LIMIT_SEC) * 100))
//     );

//     /* ───────── 콤보 진행(간략) ───────── */
//     const lastActionRef = useRef("idle");
//     useEffect(() => {
//         if (isGameOver) return;
//         const isHit = action === "punch";
//         if (isHit && lastActionRef.current !== action) {
//             advanceStepOnce();
//         }
//         lastActionRef.current = action;
//     }, [action, isGameOver]);

//     function advanceStepOnce() {
//         if (!Array.isArray(combo) || combo.length === 0) return;
//         if (advanceLockRef.current) return;
//         advanceLockRef.current = true;

//         const current = combo[patternIdx];
//         const total = (current?.moves || []).length;

//         setStepIdx((prev) => {
//             const next = prev + 1;
//             if (next >= total) {
//                 setPatternIdx((p) => (p + 1) % combo.length);
//                 return 0;
//             }
//             return next;
//         });

//         setTimeout(() => (advanceLockRef.current = false), 250);
//     }

//     /* ───────── 파괴 로그 브로드캐스트 ───────── */
//     const broadcastDestroyLog = (buildingObj) => {
//         if (!room) return;
//         const name =
//             buildingObj?.name ||
//             buildingObj?.title ||
//             buildingObj?.imageName ||
//             buildingObj?.filename ||
//             "건물";
//         const text = `${nickname || "플레이어"}님이 "${name}"를 부쉈습니다.`;
//         const payload = JSON.stringify({ type: "log", text, sender: nickname || "me" });
//         room.localParticipant
//             .publishData(new TextEncoder().encode(payload), { reliable: true })
//             .catch(() => {});
//         setLog((prev) => [...prev, { sender: nickname || "me", message: text }]);
//     };

//     /* ───────── UI ───────── */
//     const sidebarPeers = useMemo(() => {
//         const ids = Array.from(
//             new Set(remoteTracks.map((t) => t.participantIdentity))
//         ).filter((u) => u && u !== userUuid);
//         const map = new Map(remoteTracks.map((t) => [t.participantIdentity, t.track]));
//         const arr = ids.slice(0, 3).map((uuid) => ({
//             uuid,
//             track: map.get(uuid) || null,
//             nickname: "대기 중",
//         }));
//         while (arr.length < 3) arr.push({ uuid: null, track: null, nickname: "대기 중" });
//         return arr;
//     }, [userUuid, remoteTracks]);

//     return (
//         <div className="mp-root">
//             {/* 좌: 원격 참가자 3명 */}
//             <aside className="mp-sidebar">
//                 {sidebarPeers.map((p, idx) => (
//                     <RemotePeerTile key={idx} track={p.track} uuid={p.uuid} />
//                 ))}
//             </aside>

//             {/* 가운데: 게임 */}
//             <main className="mp-main">
//                 {/* === HUD: 타이머바 + 콤보 시퀀스 === */}
//                 <div className="mp-hud">
//                     <div className="timer-bar">
//                         <div className="timer-fill" style={{ width: `${timePercent}%` }} />
//                     </div>
//                     <CommandSequence combo={combo} patternIdx={patternIdx} stepIdx={stepIdx} />
//                 </div>

//                 <div className="mp-game">
//                     <PixiCanvas
//                         action={action}
//                         building={currentBuilding}
//                         playerSkin={playerSkin}
//                         combo={combo}
//                         onBuildingDestroyed={() => {
//                             setBuildingIndex((prev) =>
//                                 buildingList.length === 0 ? 0 : (prev + 1) % buildingList.length
//                             );
//                             setDestroyedCount((c) => c + 1);
//                             setCoinCount((c) => c + 1);
//                             broadcastDestroyLog(currentBuilding);
//                         }}
//                         setKcal={setKcal}
//                         showBuildingHp={false}
//                     />
//                 </div>

//                 {/* Mediapipe 입력 전용(숨김) */}
//                 <video
//                     ref={inputVideoRef}
//                     className="mp-hidden-input"
//                     muted
//                     playsInline
//                     autoPlay
//                 />
//             </main>

//             {/* 우: 로그 + 내 카메라(오버레이 포함) + 스탯 */}
//             <aside className="mp-right">
//                 <LogPanel messages={log} />
//                 <MyCamera stream={localStream} overlayRef={overlayCanvasRef} />
//                 <div className="mp-stats">
//                     ⏱ {timeover}s · 🔥 {kcal} KCAL · 💰 {coinCount} · 🏢 {destroyedCount}
//                 </div>
//             </aside>
//         </div>
//     );
// }
