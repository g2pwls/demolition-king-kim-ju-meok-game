// ✅ src/pages/MultiLobbyPage.jsx
import React, { useEffect, useState, useRef } from "react";
import {
  createLocalAudioTrack,
  createLocalVideoTrack,
  Room,
  RoomEvent,
  Track,
} from "livekit-client";
import { useNavigate } from "react-router-dom";
import awaitroomBg from "../assets/images/awaitroom/awaitroom.png";
import characterBack from "../assets/images/awaitroom/awaitroom.png"; // 안 쓰면 삭제해도 됨
import api from "../utils/api"; // 안 쓰면 삭제해도 됨
import "../styles/MultiLobbyPage.css";

const APPLICATION_SERVER_URL = "http://localhost:6080/";
const LIVEKIT_URL = "ws://localhost:7880/";

// 👉 게임 페이지 라우트 경로(원하는 경로로 바꿔도 됨)
const NEXT_GAME_PATH = "/multiplay";

// 👉 시작 신호 페이로드(충돌 방지를 위해 특이한 문자열 사용)
const GAME_START_SIGNAL = "__GAME_START__";

// --- LiveKit 비디오 타일 (트랙 attach 전용) ---
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
      <video
          ref={vref}
          autoPlay
          playsInline
          muted={!!muted}
          className="slot-video"
      />
  );
}

function MultiLobbyPage() {
  const navigate = useNavigate();

  const [participants, setParticipants] = useState([]); // 원격 참가자 identity 리스트
  const [room, setRoom] = useState(undefined);

  // 원격 비디오 트랙들: [{ sid, participantIdentity, track }]
  const [remoteTracks, setRemoteTracks] = useState([]);

  // 내 비디오 트랙
  const [localVideoTrack, setLocalVideoTrack] = useState(null);

  const [roomName, setRoomName] = useState("Test Room");
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");

  const chatListRef = useRef(null);
  const [nickName, setNickName] = useState("");
  const [userUuid, setUserUuid] = useState("");

  // ✅ chatMessages 변경 시 자동 스크롤 맨 아래로
  useEffect(() => {
    const el = chatListRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight;
    });
  }, [chatMessages]);

  // ✅ 유저 정보 불러오기
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      alert("로그인이 필요합니다.");
      return;
    }

    fetch("https://i13e106.p.ssafy.io/api/user/auth/getUserInfo", {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` },
    })
        .then((res) => {
          if (!res.ok) throw new Error("응답 오류 " + res.status);
          return res.json();
        })
        .then((data) => {
          if (data?.result?.userUuid && data?.result?.userNickname) {
            const name = data.result.userNickname;
            setUserUuid(data.result.userUuid);
            setNickName(name);
            setRoomName(`${name}의방`);
          } else {
            throw new Error("데이터 형식 오류");
          }
        })
        .catch((err) => {
          console.error("❌ 유저 정보 조회 실패", err);
          alert("유저 정보를 가져오는 데 실패했습니다.");
        });
  }, []);

  // 👉 2x2 슬롯 채우기용 배열 & 현재 인원 수
  const displayUuids = [userUuid, ...participants].slice(0, 4);
  while (displayUuids.length < 4) displayUuids.push(null);
  const filledCount = displayUuids.filter(Boolean).length;
  const isRoomFull = filledCount === 4;

  async function joinRoom() {
    const newRoom = new Room();
    setRoom(newRoom);

    // 원격 트랙 구독
    newRoom.on(
        RoomEvent.TrackSubscribed,
        (track, publication, participant) => {
          // 비디오만 관리
          if (track.kind !== Track.Kind.Video) return;
          setRemoteTracks((prev) => [
            ...prev,
            {
              sid: publication.trackSid,
              participantIdentity: participant.identity,
              track,
            },
          ]);
        }
    );

    // 원격 트랙 해제
    newRoom.on(
        RoomEvent.TrackUnsubscribed,
        (_track, publication /* , participant */) => {
          if (publication.kind !== Track.Kind.Video) return;
          setRemoteTracks((prev) =>
              prev.filter((t) => t.sid !== publication.trackSid)
          );
        }
    );

    // 참가/퇴장 이벤트로 participants(원격만) 갱신
    newRoom.on(RoomEvent.ParticipantConnected, (participant) => {
      setParticipants((prev) => {
        if (prev.includes(participant.identity)) return prev;
        return [...prev, participant.identity];
      });
      console.log("참가자 입장:", participant.identity);
    });

    newRoom.on(RoomEvent.ParticipantDisconnected, (participant) => {
      setParticipants((prev) =>
          prev.filter((id) => id !== participant.identity)
      );
      // 해당 참가자의 비디오 트랙도 정리
      setRemoteTracks((prev) =>
          prev.filter((t) => t.participantIdentity !== participant.identity)
      );
      console.log("참가자 퇴장:", participant.identity);
    });

    // 데이터 채널 수신(채팅 + 게임 시작 신호)
    newRoom.on(RoomEvent.DataReceived, (payload, participant) => {
      const message = new TextDecoder().decode(payload);

      if (message === GAME_START_SIGNAL) {
        // ✅ 누가 눌러도 모든 클라이언트가 동시에 이동
        goToGame();
        return;
      }

      setChatMessages((prev) => [
        ...prev,
        { sender: participant?.identity ?? "system", message },
      ]);
    });

    try {
      const token = await getToken(roomName, nickName, userUuid);
      await newRoom.connect(LIVEKIT_URL, token);

      // ✅ 로컬 오디오/비디오 퍼블리시
      const audioTrack = await createLocalAudioTrack();
      const videoTrack = await createLocalVideoTrack();

      await newRoom.localParticipant.publishTrack(audioTrack);
      await newRoom.localParticipant.publishTrack(videoTrack);

      setLocalVideoTrack(videoTrack); // 내 슬롯에 표시용

      // participants 배열은 원격만 관리(로컬은 userUuid로 슬롯 고정)
    } catch (error) {
      console.log("❌ 연결 오류:", error.message);
      await leaveRoom();
    }
  }

  async function leaveRoom() {
    try {
      await room?.disconnect();
    } finally {
      setRoom(undefined);
      setRemoteTracks([]);
      setParticipants([]);
      setLocalVideoTrack(null);
    }
  }

  async function getToken(roomName, nickName, userUuid) {
    const response = await fetch(`${APPLICATION_SERVER_URL}token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomName, nickName, userUuid }),
    });

    if (!response.ok) {
      let errorMessage = "unknown";
      try {
        const error = await response.json();
        errorMessage = error.errorMessage || JSON.stringify(error);
      } catch (_) {}
      throw new Error(`Failed to get token: ${errorMessage}`);
    }
    const data = await response.json();
    return data.token;
  }

  async function sendMessage() {
    if (!room || !chatInput.trim()) return;
    const encoder = new TextEncoder();
    await room.localParticipant.publishData(encoder.encode(chatInput), {
      reliable: true,
    });
    setChatMessages((prev) => [
      ...prev,
      { sender: nickName, message: chatInput },
    ]);
    setChatInput("");
  }

  // ✅ 게임 시작 브로드캐스트 + 즉시 이동
  async function startGame() {
    if (!room || !isRoomFull) return;
    const encoder = new TextEncoder();
    try {
      await room.localParticipant.publishData(
          encoder.encode(GAME_START_SIGNAL),
          { reliable: true }
      );
    } catch (e) {
      console.warn("게임 시작 신호 전송 실패(무시 가능):", e);
    }
    goToGame();
  }

  function goToGame() {
    // 필요하면 state에 방 정보/멤버 전달
    navigate(NEXT_GAME_PATH, {
      state: {
        roomName,
        // 멤버 식별: 로컬은 userUuid, 원격은 identity(닉네임)로 전달 중
        members: displayUuids.filter(Boolean),
      },
      replace: true,
    });
  }

  // 슬롯마다 트랙 찾아 꽂기
  const renderSlotContent = (uuid) => {
    if (!uuid) return null;
    if (uuid === userUuid) {
      // 내 슬롯
      return localVideoTrack ? (
          <LKVideoTile track={localVideoTrack} muted />
      ) : null;
    }
    // 친구 슬롯
    const remote = remoteTracks.find((t) => t.participantIdentity === uuid);
    return remote?.track ? <LKVideoTile track={remote.track} /> : null;
  };

  return (
      <>
        {!room ? (
            <div
                id="join"
                style={{
                  width: "100vw",
                  height: "100vh",
                  backgroundImage: `url(${awaitroomBg})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
            >
              <div id="join-dialog">
                <h2>Join a Room</h2>
                <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      joinRoom();
                    }}
                >
                  <div id="roombox">
                    <label htmlFor="room-name">방제목</label>
                    <input
                        id="room-name"
                        type="text"
                        value={roomName}
                        onChange={(e) => setRoomName(e.target.value)}
                        required
                    />
                  </div>
                  <button type="submit" disabled={!roomName || !nickName}>
                    입장하기
                  </button>
                </form>
              </div>
            </div>
        ) : (
            <div
                id="room"
                style={{
                  width: "100vw",
                  height: "100vh",
                  backgroundImage: `url(${awaitroomBg})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  gap: 24,
                  padding: 20,
                }}
            >
              {/* ⬅ 슬롯 래퍼 */}
              <div className="slot-wrapper">
                <div className="character-grid">
                  {displayUuids.map((uuid, idx) => (
                      <div
                          key={idx}
                          className={`character-slot ${uuid ? "filled" : "empty"}`}
                          data-uuid={uuid || ""}
                      >
                        {renderSlotContent(uuid)}
                      </div>
                  ))}
                </div>

                {/* ✅ 시작 버튼(슬롯 아래 배치) */}
                <div className="start-area">
                  <div className="player-count">인원: {filledCount} / 4</div>
                  <button
                      className="start-button"
                      disabled={!isRoomFull}
                      onClick={startGame}
                      title={
                        isRoomFull
                            ? "게임을 시작합니다"
                            : "4명이 모이면 시작할 수 있어요"
                      }
                  >
                    게임 시작
                  </button>
                </div>
              </div>

              {/* ⬅ 채팅 래퍼 */}
              <div className="chat-wrapper">
                <div id="chat-section" className="chat-box">
                  <div id="chat-title">CHAT</div>
                  <div id="chat-messages" ref={chatListRef}>
                    {chatMessages.map((msg, idx) => (
                        <div
                            className={`chat-message ${
                                msg.sender === nickName ? "me" : "other"
                            }`}
                            key={idx}
                        >
                          {/* 아바타 자리(원하면 이미지 연결) */}
                          <div className="avatar" />
                          <div className="bubble">
                            {msg.message}
                            <div className="meta">
                              <span className="name">{msg.sender}</span>
                              {/* 시간 찍고 싶으면 여기서 포맷팅해서 추가 */}
                            </div>
                          </div>
                        </div>
                    ))}
                  </div>
                  <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        sendMessage();
                      }}
                      id="chat-input-container"
                  >
                    <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="채팅을 입력하세요..."
                    />
                    <button type="submit">전송</button>
                  </form>
                </div>
              </div>
            </div>
        )}
      </>
  );
}

export default MultiLobbyPage;
