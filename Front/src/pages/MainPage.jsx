import React, { useState, useEffect } from "react";
import "../styles/MainPage.css";
import { useNavigate } from "react-router-dom";

import myPageIcon from "../assets/images/main/mypageicon1.png";
import tutorialIcon from "../assets/images/main/tutorialicon1.png";
import lankingIcon from "../assets/images/main/lankingicon.png";
import modeEvent from "../assets/images/main/modee.png";
import modeSingle from "../assets/images/main/modes.png";
import modeMulti from "../assets/images/main/modem.png";
import myPageModal from "../assets/images/main/mypagemodal.png";
import tutorialModal from "../assets/images/main/tutorialback.png";
import fbottom from "../assets/images/main/fbottom.png";
import fcbottom from "../assets/images/main/fcbottom.png";
import roomParticipation from "../assets/images/main/roomi.png";
import roomMake from "../assets/images/main/roomm.png";

import character1 from "../assets/images/main/character1.png";
import character2 from "../assets/images/main/character2.png";
import character3 from "../assets/images/main/character3.png";
import arrowLeft from "../assets/images/main/left.png";
import arrowRight from "../assets/images/main/right.png";
import selectButton from "../assets/images/main/select.png";

function MainPage() {
  const navigate = useNavigate();
  const [modalType, setModalType] = useState(null);
  const [isFriendPopupOpen, setIsFriendPopupOpen] = useState(false);
  const characterList = [character1, character2, character3];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nickname, setNickname] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [animationDirection, setAnimationDirection] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.nickname) setNickname(user.nickname);

    const savedIndex = localStorage.getItem("selectedCharacter");
    if (savedIndex !== null) {
      setCurrentIndex(parseInt(savedIndex));
      setSelectedIndex(parseInt(savedIndex));
    }
  }, []);

  const handleLeft = () => {
    setAnimationDirection("left");
    setCurrentIndex(
      (prev) => (prev - 1 + characterList.length) % characterList.length
    );
  };

  const handleRight = () => {
    setAnimationDirection("right");
    setCurrentIndex((prev) => (prev + 1) % characterList.length);
  };

  const handleSelect = () => {
    localStorage.setItem("selectedCharacter", currentIndex);
    setSelectedIndex(currentIndex);
  };

  return (
    <div className="main-page-background">
      <div className="main-fixed-wrapper">
        {/* 상단 아이콘 */}
        <div className="top-right-buttons">
          <button
            className="top-icon-button"
            onClick={() => setModalType("lank")}
          >
            {" "}
            <img src={lankingIcon} alt="랭킹" />{" "}
          </button>
          <button
            className="top-icon-button"
            onClick={() => setModalType("tutorial")}
          >
            {" "}
            <img src={tutorialIcon} alt="튜토리얼" />{" "}
          </button>
          <button
            className="top-icon-button"
            onClick={() => setModalType("mypage")}
          >
            {" "}
            <img src={myPageIcon} alt="마이페이지" />{" "}
          </button>
        </div>

        {/* 캐릭터 선택 */}
        <div className="character-section">
          <div className="nickname-text">{nickname}</div>
          <div className={`character-selector animate-${animationDirection}`}>
            <img
              src={arrowLeft}
              alt="왼쪽"
              className="arrow-button large"
              onClick={handleLeft}
            />
            <img
              src={characterList[currentIndex]}
              alt="캐릭터"
              className="main-character large"
              onAnimationEnd={() => setAnimationDirection(null)}
            />
            <img
              src={arrowRight}
              alt="오른쪽"
              className="arrow-button large"
              onClick={handleRight}
            />
          </div>
          <div className="select-button-wrapper">
            <img
              src={selectButton}
              alt="선택 버튼"
              className={`select-button ${
                selectedIndex === currentIndex ? "selected" : ""
              }`}
              onClick={handleSelect}
            />
          </div>
        </div>

        {/* 모드 선택 */}
        <div className="bottom-right-buttons">
          <button
            className="bottom-icon-button"
            onClick={() => navigate("/event")}
          >
            {" "}
            <img src={modeEvent} alt="이벤트 모드" />{" "}
          </button>
          <button
            className="bottom-icon-button"
            onClick={() => navigate("/single")} // 이 부분 추가
          >
            <img src={modeSingle} alt="싱글 모드" />
          </button>
          <button
            className="bottom-icon-button"
            onClick={() => setModalType("multi")}
          >
            {" "}
            <img src={modeMulti} alt="멀티 모드" />{" "}
          </button>
        </div>

        {modalType && (
          <div className="modal-overlay" onClick={() => setModalType(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              {modalType === "tutorial" && (
                <img src={tutorialModal} alt="튜토리얼" />
              )}
              {modalType === "mypage" && (
                <img src={myPageModal} alt="마이페이지" />
              )}
              {modalType === "multi" && (
                <div className="multi-mode-buttons">
                  <button>
                    <img src={roomMake} alt="방 만들기" />
                  </button>
                  <button>
                    <img src={roomParticipation} alt="방 참가" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 친구 */}
        <div className="friend-buttons">
          <button
            className={`floating-button ${modalType ? "disabled" : ""}`}
            onClick={() => !modalType && setIsFriendPopupOpen((prev) => !prev)}
            disabled={!!modalType}
          >
            <img src={fbottom} alt="플로팅" />
          </button>
        </div>

        {isFriendPopupOpen && (
          <div
            className="friend-popup-overlay"
            onClick={() => setIsFriendPopupOpen(false)}
          >
            <div className="friend-popup" onClick={(e) => e.stopPropagation()}>
              <button
                className="friend-popup-close-btn"
                onClick={() => setIsFriendPopupOpen(false)}
              >
                <img src={fcbottom} alt="닫기" />
              </button>
              <div className="friend-popup-content">
                <p style={{ color: "#fff" }}>친구 리스트 또는 내용</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MainPage;
