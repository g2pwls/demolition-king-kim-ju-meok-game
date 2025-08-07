import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/MultiModeEntryPage.css"; // 필요 시 생성

function MultiModeEntryPage() {
  const navigate = useNavigate();

  const handleCreateRoom = () => {
    // 랜덤 roomName 생성 or 이후 uuid 방식으로 수정 가능
    const roomName = "Room_" + Math.random().toString(36).substr(2, 6);
    navigate(`/multilobby?room=${roomName}`);
  };

  const handleJoinRoom = () => {
    const inputRoom = prompt("방 코드(이름)를 입력하세요");
    if (inputRoom) {
      navigate(`/multilobby?room=${inputRoom}`);
    }
  };

  return (
    <div className="multi-mode-entry">
      <h1>멀티모드</h1>
      <div className="button-wrapper">
        <button onClick={handleCreateRoom}>방 만들기</button>
        <button onClick={handleJoinRoom}>참가하기</button>
      </div>
    </div>
  );
}

export default MultiModeEntryPage;
