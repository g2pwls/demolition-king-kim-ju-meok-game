// src/components/MultiLobbyChat.jsx
import React, { useEffect, useRef, useState } from "react";

function MultiLobbyChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = new WebSocket("ws://localhost:7880");

    socketRef.current.onopen = () => {
      console.log("✅ WebSocket connected");
    };

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data && data.message) {
        setMessages((prev) => [...prev, data.message]);
      }
    };

    socketRef.current.onerror = (err) => {
      console.error("❌ WebSocket error", err);
    };

    socketRef.current.onclose = () => {
      console.log("❌ WebSocket closed");
    };

    return () => {
      socketRef.current.close();
    };
  }, []);

  const sendMessage = () => {
    if (socketRef.current && input.trim()) {
      const payload = {
        message: input,
      };
      socketRef.current.send(JSON.stringify(payload));
      setInput("");
    }
  };

  return (
    <div>
      <h3>채팅</h3>
      <div style={{ height: 150, overflowY: "auto", border: "1px solid gray" }}>
        {messages.map((m, i) => (
          <div key={i}>{m}</div>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
      />
      <button onClick={sendMessage}>전송</button>
    </div>
  );
}

export default MultiLobbyChat;
