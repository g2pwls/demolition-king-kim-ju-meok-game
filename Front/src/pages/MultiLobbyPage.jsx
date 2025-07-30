import React, { useEffect, useRef, useState } from "react";
import { OpenVidu } from "openvidu-browser";

const APPLICATION_SERVER_URL = "http://localhost:7880"; // 로컬 OpenVidu 서버 주소
const OPENVIDU_SECRET = "secret"; // .env에 설정한 비밀번호로 교체

function MultiLobbyPage() {
  const [session, setSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const nickname = useRef("User" + Math.floor(Math.random() * 1000));
  const sessionRef = useRef(null);

  useEffect(() => {
    const OV = new OpenVidu();
    const mySession = OV.initSession();

    mySession.on("signal:chat", (event) => {
      const { data, from } = event;
      const sender = from.connection.data
        .split('"clientData":"')[1]
        .split('"')[0];
      setMessages((prev) => [...prev, `${sender}: ${data}`]);
    });

    const SESSION_ID = "MultiLobbySession";

    createSession(SESSION_ID)
      .then(() => createToken(SESSION_ID))
      .then((token) => {
        return mySession.connect(token, { clientData: nickname.current });
      })
      .then(() => {
        setSession(mySession);
        sessionRef.current = mySession;
      })
      .catch((error) => {
        console.error("❌ 오류 발생:", error);
      });

    return () => {
      mySession.disconnect();
    };
  }, []);

  const createSession = async (sessionId) => {
    const response = await fetch(
      `${APPLICATION_SERVER_URL}/openvidu/api/sessions`,
      {
        method: "POST",
        headers: {
          Authorization: "Basic " + btoa(`OPENVIDUAPP:${OPENVIDU_SECRET}`),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ customSessionId: sessionId }),
      }
    );

    if (response.status === 409) return sessionId;
    if (!response.ok) throw new Error("세션 생성 실패");
    return (await response.json()).id;
  };

  const createToken = async (sessionId) => {
    const response = await fetch(
      `${APPLICATION_SERVER_URL}/openvidu/api/sessions/${sessionId}/connection`,
      {
        method: "POST",
        headers: {
          Authorization: "Basic " + btoa(`OPENVIDUAPP:${OPENVIDU_SECRET}`),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      }
    );

    if (!response.ok) throw new Error("토큰 생성 실패");
    return (await response.json()).token;
  };

  const sendMessage = () => {
    if (sessionRef.current && input.trim() !== "") {
      sessionRef.current
        .signal({
          data: input,
          type: "chat",
        })
        .catch((err) => console.error("Signal 전송 오류:", err));
      setInput("");
    }
  };

  return (
    <div>
      <h2>멀티 대기방 채팅</h2>
      <div
        style={{
          border: "1px solid gray",
          padding: "10px",
          height: "200px",
          overflowY: "scroll",
        }}
      >
        {messages.map((msg, idx) => (
          <div key={idx}>{msg}</div>
        ))}
      </div>
      <div style={{ marginTop: "10px" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>전송</button>
      </div>
    </div>
  );
}

export default MultiLobbyPage;
