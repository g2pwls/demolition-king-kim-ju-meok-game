// src/pages/SingleTestPage.jsx
import React from "react";
import SingleGame from "./SingleGame"; // Pixi 게임 영역
import MyVideo from "../components/ui/MyVideo";
import "../styles/SingleTestPage.css";


function SingleTestPage() {
  return (
    <div className="single-test-container">
      <div className="game-area">
        <SingleGame />
      </div>
      <div className="video-area">
        <h3>📷 내 캠 화면</h3>
        <div className="video-wrapper">
          <MyVideo />
        </div>
      </div>
    </div>
  );
}

export default SingleTestPage;
