// ✅ MultiLobbyPage.jsx
import React, { useEffect, useState, useRef } from "react";
import { createLocalAudioTrack, Room, RoomEvent } from "livekit-client";
import awaitroomBg from "../assets/images/awaitroom/awaitroom.png";
import characterBack from "../assets/images/awaitroom/awaitroom.png"; // 안 쓰면 삭제해도 됨
import api from "../utils/api"; // 안 쓰면 삭제해도 됨
import "../styles/MultiLobbyPage.css";
import AnimatedPage from '../components/AnimatedPage';

const APPLICATION_SERVER_URL = "http://localhost:6080/";
const LIVEKIT_URL = "ws://localhost:7880/";

function MultiLobbyPage() {
  const [participants, setParticipants] = useState([]);
  const [room, setRoom] = useState(undefined);
  const [remoteTracks, setRemoteTracks] = useState([]);
  const [roomName, setRoomName] = useState("Test Room");
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");

  const chatListRef = useRef(null); // ✅ 채팅 리스트 ref
  const [nickName, setNickName] = useState("");
  const [userUuid, setUserUuid] = useState("");

  // ✅ chatMessages 변경 시 자동 스크롤 맨 아래로
  useEffect(() => {
    const el = chatListRef.current;
    if (!el) return;
    // 레이아웃 반영 후 스크롤 (이미지/폰트 로딩 보정)
    requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight;
    });
  }, [chatMessages]);

  // ✅ 유저 정보 불러오기
  // ✅ 유저 정보 불러오기
useEffect(() => {
  const accessToken = localStorage.getItem("accessToken"); // 🔹 저장된 토큰 불러오기

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
      console.log("✅ userInfo 결과", data);
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


  async function joinRoom() {
    const newRoom = new Room();
    setRoom(newRoom);

    newRoom.on(RoomEvent.TrackSubscribed, (_track, publication, participant) => {
      setRemoteTracks((prev) => [
        ...prev,
        { trackPublication: publication, participantIdentity: participant.identity },
      ]);
    });

    newRoom.on(RoomEvent.TrackUnsubscribed, (_track, publication) => {
      setRemoteTracks((prev) =>
        prev.filter((track) => track.trackPublication.trackSid !== publication.trackSid)
      );
    });

    newRoom.on(RoomEvent.ParticipantConnected, (participant) => {
      setParticipants((prev) => [...prev, participant.identity]);
      console.log("참가자 입장:", participant.identity);
    });

    newRoom.on(RoomEvent.ParticipantDisconnected, (participant) => {
      setParticipants((prev) => prev.filter((id) => id !== participant.identity));
      console.log("참가자 퇴장:", participant.identity);
    });

    newRoom.on(RoomEvent.DataReceived, (payload, participant) => {
      const message = new TextDecoder().decode(payload);
      setChatMessages((prev) => [...prev, { sender: participant.identity, message }]);
    });

    try {
      const token = await getToken(roomName, nickName, userUuid);
      await newRoom.connect(LIVEKIT_URL, token);
      const audioTrack = await createLocalAudioTrack();
      await newRoom.localParticipant.publishTrack(audioTrack);
      setParticipants((prev) => [...prev, newRoom.localParticipant.identity]);
    } catch (error) {
      console.log("❌ 연결 오류:", error.message);
      await leaveRoom();
    }
  }

  async function leaveRoom() {
    await room?.disconnect();
    setRoom(undefined);
    setRemoteTracks([]);
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
    await room.localParticipant.publishData(encoder.encode(chatInput), { reliable: true });
    setChatMessages((prev) => [...prev, { sender: nickName, message: chatInput }]);
    setChatInput("");
  }

  const displayUuids = [userUuid, ...participants].slice(0, 4);
  while (displayUuids.length < 4) displayUuids.push(null);

  return (<AnimatedPage>
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
                />
              ))}
            </div>
          </div>

          {/* ⬅ 채팅 래퍼 */}
          <div className="chat-wrapper">
            <div id="chat-section" className="chat-box">
              <div id="chat-title">CHAT</div>
              <div id="chat-messages" ref={chatListRef}>
                {chatMessages.map((msg, idx) => (
                  <div className="chat-message" key={idx}>
                    <span className="chat-sender">{msg.sender}:</span> {msg.message}
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
    </AnimatedPage>
  );
}

export default MultiLobbyPage;
