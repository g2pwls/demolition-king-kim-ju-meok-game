import {
  createLocalAudioTrack,
  Room,
  RoomEvent,
} from "livekit-client";

import React, { useState } from "react";
import awaitroomBg from "../assets/images/awaitroom/awaitroom.png";
import characterBack from "../assets/images/awaitroom/characterback.png";
import "../styles/App.css";

const APPLICATION_SERVER_URL = "https://i13e106.p.ssafy.io/openviduback/";
const LIVEKIT_URL = "wss://i13e106.p.ssafy.io/livekit";

function MultiLobbyPage() {
  const [room, setRoom] = useState(undefined);
  const [remoteTracks, setRemoteTracks] = useState([]);
  const [participantName, setParticipantName] = useState(
    "Participant" + Math.floor(Math.random() * 100)
  );
  const [roomName, setRoomName] = useState("Test Room");
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");

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

    newRoom.on(RoomEvent.DataReceived, (payload, participant) => {
      const message = new TextDecoder().decode(payload);
      setChatMessages((prev) => [
        ...prev,
        { sender: participant.identity, message },
      ]);
    });

    try {
      const token = await getToken(roomName, participantName);
      await newRoom.connect(LIVEKIT_URL, token);

      const audioTrack = await createLocalAudioTrack();
      await newRoom.localParticipant.publishTrack(audioTrack);
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

  async function getToken(roomName, participantName) {
    const response = await fetch(APPLICATION_SERVER_URL + "token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomName, participantName }),
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

    setChatMessages((prev) => [
      ...prev,
      { sender: participantName, message: chatInput },
    ]);

    setChatInput("");
  }

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
                joinRoom();
                e.preventDefault();
              }}
            >
              <div>
                <label htmlFor="participant-name">Participant</label>
                <input
                  id="participant-name"
                  type="text"
                  value={participantName}
                  onChange={(e) => setParticipantName(e.target.value)}
                  required
                />
              </div>
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
              <button type="submit" disabled={!roomName || !participantName}>
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
          {/* 왼쪽 캐릭터 슬롯 4개 */}
          <div className="character-container">
            {[1, 2, 3, 4].map((i) => (
              <img
                key={i}
                src={characterBack}
                alt={`character slot ${i}`}
                className="character-box"
              />
            ))}
          </div>

          {/* 채팅창 */}
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
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default MultiLobbyPage;
