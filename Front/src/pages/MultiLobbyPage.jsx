// ✅ MultiLobbyPage.jsx에서 사용자 정보를 localStorage + getUserInfo API로 가져오도록 최소 수정 적용

import React, { useEffect, useState } from "react";
import { createLocalAudioTrack, Room, RoomEvent } from "livekit-client";
import awaitroomBg from "../assets/images/awaitroom/awaitroom.png";
import characterBack from "../assets/images/awaitroom/characterback.png";
import api from "../utils/api"; 
import "../styles/App.css";

// const APPLICATION_SERVER_URL = "https://i13e106.p.ssafy.io/openviduback/";
// const LIVEKIT_URL = "wss://i13e106.p.ssafy.io/livekit";
const APPLICATION_SERVER_URL = "http://localhost:6080/";
const LIVEKIT_URL = "ws://localhost:7880/";


function MultiLobbyPage() {
  const [participants, setParticipants] = useState([]);
  const [room, setRoom] = useState(undefined);
  const [remoteTracks, setRemoteTracks] = useState([]);
  const [roomName, setRoomName] = useState("Test Room");
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");

  // ✅ 닉네임, uuid useState 추가
  const [nickName, setNickName] = useState("");
  const [userUuid, setUserUuid] = useState("");

// useEffect(() => {
//   // const accessToken = localStorage.getItem("accessToken");
//   const accessToken = "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI3MTgyMDMyYi02ZGVhLTQwY2MtYjZmZS1lMTc0YThmYzdiMmQiLCJyb2xlcyI6WyJVU0VSIl0sImlhdCI6MTc1NDQ4MjU2NCwiZXhwIjoxNzU0NDg2MTY0fQ.MGDEhxJFiISo55QW6pMgaVv-F8fh8VQuhMxdWFM5uMQ";
//   if (!accessToken) {
//     alert("로그인이 필요합니다.");
//     return;
//   }

//   fetch("https://i13e106.p.ssafy.io/api/user/auth/getUserInfo", {
//     method: "GET",
//     headers: {
//       Authorization: accessToken,
//     },
//   })
//     .then((res) => {
//       const user = res.data.result;
//       setUserUuid(user.userUuid);
//       setNickName(user.nickName);
//     })
//     .catch((err) => {
//       console.error("❌ 유저 정보 조회 실패", err);
//     });
// }, []);

useEffect(() => {
  // const accessToken = localStorage.getItem("accessToken");
  const accessToken = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI3MTgyMDMyYi02ZGVhLTQwY2MtYjZmZS1lMTc0YThmYzdiMmQiLCJyb2xlcyI6WyJVU0VSIl0sImlhdCI6MTc1NDQ4NjU1NSwiZXhwIjoxNzU0NDkwMTU1fQ.iK7Wmm5w2I4lG4bQ8TqXJfczbAHAheN8LkW5iLlAiSc";


  if (!accessToken) {
    alert("로그인이 필요합니다.");
    return;
  }

  fetch("https://i13e106.p.ssafy.io/api/user/auth/getUserInfo", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((res) => {
      if (!res.ok) throw new Error("응답 오류" + res.status);
      return res.json();
    })
    .then((data) => {
      console.log("✅ userInfo 결과", data);
      if (data?.result?.userUuid && data?.result?.userNickname) {
        const name = data.result.userNickname;
        setUserUuid(data.result.userUuid);
        setNickName(name);
        setRoomName(name + "의방");
      } else {
        throw new Error("데이터 형식 오류");
      }
    })
    .catch((err) => {
      console.error("❌ 유저 정보 조회 실패", err);
      alert("유저 정보를 가져오는 데 실패했습니다.");
    });
  }, []);
  
 console.log("nickname : " + nickName);
 console.log("roomname : " + roomName);

 console.log("uuid : " + userUuid);

  // ✅ 로그인된 유저의 UUID와 닉네임 가져오기 (최소 수정)
  // useEffect(() => {
  //   const accessToken = localStorage.getItem("accessToken");
  //   const uuid = localStorage.getItem("userUuid");
  //   if (!accessToken || !uuid) {
  //     alert("로그인이 필요합니다.");
  //     return;
  //   }
  //   setUserUuid(uuid);
  //   api
  //     .get(`/user/auth/getUserInfo?userUuid=${uuid}`, {
  //       headers: { Authorization: accessToken },
  //     })
  //     .then((res) => {
  //       setNickName(res.data.result.userNickname);
  //     })
  //     .catch((err) => {
  //       console.error("❌ 유저 정보 조회 실패", err);
  //     });
  // }, []);


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

     // ✅ 참가자 입장 이벤트 등록
    newRoom.on(RoomEvent.ParticipantConnected, (participant) => {
      setParticipants((prev) => [...prev, participant.identity]);
      console.log("참가자 입장:", participant.identity);
    });

    // ✅ 참가자 퇴장 이벤트 등록
    newRoom.on(RoomEvent.ParticipantDisconnected, (participant) => {
      setParticipants((prev) => prev.filter((id) => id !== participant.identity));
      console.log("참가자 퇴장:", participant.identity);
    });

    newRoom.on(RoomEvent.DataReceived, (payload, participant) => {
      const message = new TextDecoder().decode(payload);
      setChatMessages((prev) => [...prev, { sender: participant.identity, message }]);
    });

    try {
      const token = await getToken(roomName, nickName, userUuid); // ✅ nickname, uuid 반영
      await newRoom.connect(LIVEKIT_URL, token);
      const audioTrack = await createLocalAudioTrack();
      await newRoom.localParticipant.publishTrack(audioTrack);

      // ✅ 본인도 참가자 목록에 추가
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
      const error = await response.json();
      throw new Error(`Failed to get token: ${error.errorMessage}`);
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

    setChatMessages((prev) => [...prev, { sender: nickName, message: chatInput }]);
    setChatInput("");
  }

  return (
    // ✅ 배경 등 기존 UI는 그대로 유지
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
                joinRoom();
                e.preventDefault();
              }}
            >
              <div>
                <label htmlFor="room-name">Room</label>
                <input
                  id="room-name"
                  type="text"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  required
                />
              </div>
              <button type="submit" disabled={!roomName || !nickName}>
                Join
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
            justifyContent: "center",
            gap: 40,
            padding: 20,
          }}
        >
          <div className="character-container">
            {[1, 2, 3, 4].map((i) => (
              <img key={i} src={characterBack} alt={`character slot ${i}`} className="character-box" />
            ))}
          </div>

          <div id="chat-section" className="chat-box">
            <div id="chat-title">CHAT</div>
            <div id="chat-messages">
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
                 <div style={{ marginTop: 10, color: "black" }}>참가자 수: {participants.length}</div>
             {/* <ul style={{ color: "black" }}>
              {participants.map((id, idx) => (
                <li key={idx}>{id}</li>
              ))}
            </ul> */}
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default MultiLobbyPage;