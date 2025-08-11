import React, { useEffect, useRef, useState } from "react";
import {
  Room,
  RoomEvent,
  Track,
  createLocalAudioTrack,
  createLocalVideoTrack,
} from "livekit-client";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import awaitroomBg from "../assets/images/awaitroom/awaitroom.png";
import "../styles/MultiLobbyPage.css";
import AnimatedPage from '../components/AnimatedPage';

const APPLICATION_SERVER_URL = "http://localhost:6080/";
const LIVEKIT_URL = "ws://localhost:7880/";
const NEXT_GAME_PATH = "/multiplay";
const GAME_START_SIGNAL = "__GAME_START__";

function LKVideoTile({ track, muted }) {
  const vref = useRef(null);
  useEffect(() => {
    if (!track || !vref.current) return;
    track.attach(vref.current);
    return () => {
      try {
        track.detach(vref.current);
      } catch {}
    };
  }, [track]);
  return (
      <video ref={vref} autoPlay playsInline muted={!!muted} className="slot-video" />
  );
}

export default function MultiLobbyPage() {
  const navigate = useNavigate();
  const { roomId: paramId } = useParams();
  const [search] = useSearchParams();
  const queryId = search.get("room") || "";
  const roomId = paramId || queryId; // /lobby/:id 또는 ?room= 지원

  const [room, setRoom] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [remoteTracks, setRemoteTracks] = useState([]);
  const [localVideoTrack, setLocalVideoTrack] = useState(null);

  const [nickName, setNickName] = useState("");
  const [userUuid, setUserUuid] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const chatListRef = useRef(null);

  // 유저 정보
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;
    fetch("https://i13e106.p.ssafy.io/api/user/auth/getUserInfo", {
      headers: { Authorization: `Bearer ${token}` },
    })
        .then((r) => r.json())
        .then((d) => {
          setUserUuid(d?.result?.userUuid || "");
          setNickName(d?.result?.userNickname || "player");
        })
        .catch(() => {});
  }, []);

  // 채팅 자동 스크롤
  useEffect(() => {
    const el = chatListRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight;
    });
  }, [chatMessages]);

  // 슬롯 계산
  const displayUuids = [userUuid, ...participants].slice(0, 4);
  while (displayUuids.length < 4) displayUuids.push(null);
  const filledCount = displayUuids.filter(Boolean).length;
  const isRoomFull = filledCount === 4;

  async function getToken(roomName, nick, uuid) {
    const res = await fetch(`${APPLICATION_SERVER_URL}token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomName, nickName: nick, userUuid: uuid }),
    });
    const data = await res.json();
    if (!res.ok || !data?.token)
      throw new Error(data?.errorMessage || "token failed");
    return data.token;
  }

  async function joinRoom() {
    const r = new Room();
    setRoom(r);

    r.on(RoomEvent.TrackSubscribed, (track, pub, participant) => {
      if (track.kind !== Track.Kind.Video) return;
      setRemoteTracks((prev) => [
        ...prev.filter((t) => t.sid !== pub.trackSid),
        { sid: pub.trackSid, participantIdentity: participant.identity, track },
      ]);
    });
    r.on(RoomEvent.TrackUnsubscribed, (_t, pub) => {
      if (pub.kind !== Track.Kind.Video) return;
      setRemoteTracks((prev) => prev.filter((t) => t.sid !== pub.trackSid));
    });
    r.on(RoomEvent.ParticipantConnected, (p) => {
      setParticipants((prev) => (prev.includes(p.identity) ? prev : [...prev, p.identity]));
    });
    r.on(RoomEvent.ParticipantDisconnected, (p) => {
      setParticipants((prev) => prev.filter((id) => id !== p.identity));
      setRemoteTracks((prev) => prev.filter((t) => t.participantIdentity !== p.identity));
    });
    r.on(RoomEvent.DataReceived, (payload, p) => {
      const msg = new TextDecoder().decode(payload);
      if (msg === GAME_START_SIGNAL) {
        goToGame();
        return;
      }
      const sender = p?.name || p?.identity || "system";
      setChatMessages((prev) => [...prev, { sender, message: msg }]);
    });

    try {
      const token = await getToken(roomId, nickName || "player", userUuid);
      await r.connect(LIVEKIT_URL, token);

      const audio = await createLocalAudioTrack().catch(() => null);
      const video = await createLocalVideoTrack().catch(() => null);
      if (audio) await r.localParticipant.publishTrack(audio);
      if (video) {
        await r.localParticipant.publishTrack(video);
        setLocalVideoTrack(video);
      }

      const remotes = Array.from(r.remoteParticipants?.values?.() || []);
      setParticipants((prev) => {
        const ids = remotes.map((p) => p.identity);
        return Array.from(new Set([...prev, ...ids]));
      });
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
    } catch (e) {
      console.error("connect failed:", e);
      try {
        await r.disconnect();
      } catch {}
      setRoom(null);
    }
  }

  // 유저/roomId 준비되면 자동 입장
  const joiningRef = useRef(false);
  useEffect(() => {
    if (joiningRef.current) return;
    if (room || !roomId || !userUuid) return;
    joiningRef.current = true;
    (async () => {
      try {
        await joinRoom();
      } finally {
        joiningRef.current = false;
      }
    })();
  }, [room, roomId, userUuid]);

  function goToGame() {
    navigate(NEXT_GAME_PATH, {
      state: { roomName: roomId, members: displayUuids.filter(Boolean) },
      replace: true,
    });
  }

  async function startGame() {
    if (!room || !isRoomFull) return;
    const enc = new TextEncoder();
    try {
      await room.localParticipant.publishData(enc.encode(GAME_START_SIGNAL), {
        reliable: true,
      });
    } catch {}
    goToGame();
  }

  async function sendMessage() {
    if (!room || !chatInput.trim()) return;
    const enc = new TextEncoder();
    await room.localParticipant.publishData(enc.encode(chatInput), {
      reliable: true,
    });
    setChatMessages((prev) => [
      ...prev,
      { sender: nickName || "me", message: chatInput },
    ]);
    setChatInput("");
  }

  const renderSlot = (uuid) => {
    if (!uuid) return null;
    if (uuid === userUuid)
      return localVideoTrack ? <LKVideoTile track={localVideoTrack} muted /> : null;
    const remote = remoteTracks.find((t) => t.participantIdentity === uuid);
    return remote?.track ? <LKVideoTile track={remote.track} /> : null;
  };

  return (
      <div
          className="lobby-root"
          style={{ backgroundImage: `url(${awaitroomBg})` }}
      >
        {!room ? (
            <div className="join-card">
              <h2>Join a Room</h2>
              <div className="room-line">
                <label>방 제목</label>
                <input value={roomId || ""} disabled />
              </div>
              <button className="btn primary" onClick={joinRoom} disabled={!nickName}>
                입장하기
              </button>
              <button
                  className="btn ghost"
                  onClick={() => {
                    const origin = window.location.origin;
                    const link = `${origin}/lobby/${encodeURIComponent(roomId)}`;
                    navigator.clipboard.writeText(link).catch(() => {});
                  }}
              >
                초대 링크 복사
              </button>
            </div>
        ) : (
            <div className="room-grid">
              <div className="slot-wrapper">
                <div className="character-grid">
                  {displayUuids.map((uuid, i) => (
                      <div
                          key={i}
                          className={`character-slot ${uuid ? "filled" : "empty"}`}
                      >
                        {renderSlot(uuid)}
                      </div>
                  ))}
                </div>
                <div className="start-area">
                  <div className="player-count">인원: {filledCount} / 4</div>
                  <button
                      className="btn start"
                      onClick={startGame}
                      disabled={!isRoomFull}
                  >
                    게임 시작
                  </button>
                </div>
              </div>

              <div className="chat-wrapper">
                <div className="chat-card">
                  <div className="chat-title">CHAT</div>
                  <div className="chat-list" ref={chatListRef}>
                    {chatMessages.map((m, idx) => (
                        <div
                            key={idx}
                            className={`chat-row ${m.sender === nickName ? "me" : "other"}`}
                        >
                          <div className="bubble">
                            {m.message}
                            <div className="meta">
                              <span className="name">{m.sender}</span>
                            </div>
                          </div>
                        </div>
                    ))}
                  </div>
                  <form
                      className="chat-input"
                      onSubmit={(e) => {
                        e.preventDefault();
                        sendMessage();
                      }}
                  >
                    <input
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="메시지 입력..."
                    />
                    <button type="submit" className="btn send">
                      전송
                    </button>
                  </form>
                </div>
              </div>
            </div>
        )}
      </div>
  );
}
