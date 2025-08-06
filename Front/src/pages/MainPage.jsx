// MainPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import '../styles/MainPage.css';
import myPageIcon from '../assets/images/main/mypageicon1.png';
import tutorialIcon from '../assets/images/main/tutorialicon1.png';
import lankingIcon from '../assets/images/main/lankingicon.png';
import modeEvent from '../assets/images/main/modee.png';
import modeSingle from '../assets/images/main/modes.png';
import modeMulti from '../assets/images/main/modem.png';
import myPageModal from '../assets/images/main/mypagemodal.png';
import tutorialModal from '../assets/images/main/tutorialback.png';
import fbottom from '../assets/images/main/fbottom.png';
import fcbottom from '../assets/images/main/fcbottom.png';
import roomParticipation from '../assets/images/main/roomi.png';
import roomMake from '../assets/images/main/roomm.png';
import avatarUrl from '../assets/images/avatar.png';
import pencilIcon from '../assets/images/mypage/pencil.png';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import character1 from "../assets/images/main/character1.png";
import character2 from "../assets/images/main/character2.png";
import character3 from "../assets/images/main/character3.png";
import arrowLeft from "../assets/images/main/left.png";
import arrowRight from "../assets/images/main/right.png";
import selectButton from "../assets/images/main/select.png";
import { addRoom, roomExists } from "../utils/roomUtils";

function MainPage() {
  const [userNickname, setUserNickname] = useState('');
  const characterList = [character1, character2, character3];
  const [animationDirection, setAnimationDirection] = useState(null);
  const [nickname, setNickname] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const navigate = useNavigate();
  const [modalType, setModalType] = useState(null);
  const [isFriendPopupOpen, setIsFriendPopupOpen] = useState(false);

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
    setCurrentIndex((prev) => (prev - 1 + characterList.length) % characterList.length);
  };

  const handleRight = () => {
    setAnimationDirection("right");
    setCurrentIndex((prev) => (prev + 1) % characterList.length);
  };

  const handleSelect = () => {
    localStorage.setItem("selectedCharacter", currentIndex);
    setSelectedIndex(currentIndex);
  };

  const handleRoomCreate = () => {
  const randomRoomId = Math.random().toString(36).substring(2, 10);
  addRoom(randomRoomId); // localStorage에 저장
  navigate(`/multilobby?room=${randomRoomId}`);
};

  const handleRoomJoin = () => {
  const roomId = prompt("참가할 방 이름을 입력하세요:");
  if (!roomId) return;

  if (roomExists(roomId)) {
    navigate(`/multilobby?room=${roomId}`);
  } else {
    alert("해당 방은 존재하지 않습니다.");
  }
};
  return (
    <div className="main-page-background">
      <div className="main-fixed-wrapper">
        <div className="top-right-buttons">
          <button className="top-icon-button" onClick={() => setModalType('lank')}>
            <img src={lankingIcon} alt="랭킹" />
          </button>
          <button className="top-icon-button" onClick={() => setModalType('tutorial')}>
            <img src={tutorialIcon} alt="튜토리얼" />
          </button>
          <button className="top-icon-button" onClick={() => setModalType('mypage')}>
            <img src={myPageIcon} alt="마이페이지" />
          </button>
        </div>

        <div className="bottom-right-buttons">
          <button className="bottom-icon-button" onClick={() => navigate('/event')}>
            <img src={modeEvent} alt="이벤트 모드" />
          </button>
          <button className="bottom-icon-button" onClick={() => navigate('/singletest')}>
            <img src={modeSingle} alt="싱글 모드" />
          </button>
          <button className="bottom-icon-button" onClick={() => setModalType('multi')}>
            <img src={modeMulti} alt="멀티 모드" />
          </button>
        </div>

        <div className="character-section">
          <div className="nickname-text">{userNickname}</div>
          <div className={`character-selector animate-${animationDirection}`}>
            <img src={arrowLeft} alt="왼쪽" className="arrow-button large" onClick={handleLeft} />
            <img src={characterList[currentIndex]} alt="캐릭터" className="main-character large" onAnimationEnd={() => setAnimationDirection(null)} />
            <img src={arrowRight} alt="오른쪽" className="arrow-button large" onClick={handleRight} />
          </div>
          <div className="select-button-wrapper">
            <img src={selectButton} alt="선택 버튼" className={`select-button ${selectedIndex === currentIndex ? 'selected' : ''}`} onClick={handleSelect} />
          </div>
        </div>

        {modalType === 'multi' && (
          <div className="modal-overlay" onClick={() => setModalType(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="multi-mode-buttons">
                <button onClick={handleRoomCreate}><img src={roomMake} alt="방 만들기" /></button>
                <button onClick={handleRoomJoin}><img src={roomParticipation} alt="방 참가하기" /></button>
              </div>
            </div>
          </div>
        )}

        <div className="friend-buttons">
          <button className={`floating-button ${modalType ? 'disabled' : ''}`} onClick={() => { if (!modalType) setIsFriendPopupOpen(prev => !prev); }} disabled={!!modalType}>
            <img src={fbottom} alt="플로팅 버튼" />
          </button>
        </div>

        {isFriendPopupOpen && (
          <div className="friend-popup-overlay" onClick={() => setIsFriendPopupOpen(false)}>
            <div className="friend-popup" onClick={(e) => e.stopPropagation()}>
              <button className="friend-popup-close-btn" onClick={() => setIsFriendPopupOpen(false)}>
                <img src={fcbottom} alt="닫기 버튼" />
              </button>
              <div className="friend-popup-content">
                <div className="my-profile">
                  <img src={avatarUrl} alt="내 아바타" className="friend-avatar" />
                  <div className="friend-nickname">나 (닉네임)</div>
                </div>
                <hr className="friend-divider" />
                <div className="friend-list">
                  <div className="friend-title">친구목록</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MainPage;
