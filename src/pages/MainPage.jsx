// StartPage.jsx
import React, { useState } from 'react';
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
import { useNavigate } from 'react-router-dom';

function MainPage() {
    const navigate = useNavigate();
    const [modalType, setModalType] = useState(null); // 'tutorial' 또는 'mypage' 또는 null
    const [isFriendPopupOpen, setIsFriendPopupOpen] = useState(false); // ✅ 반드시 함수 컴포넌트 내부에

  return (
    <div className="main-page-background">
      <div class="main-fixed-wrapper">
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
        <button className="bottom-icon-button">
          <img src={modeSingle} alt="싱글 모드" />
        </button>
        <button className="bottom-icon-button" onClick={() => setModalType('multi')}>
          <img src={modeMulti} alt="멀티 모드" />
        </button>
      </div>

      {modalType && (
        <div className="modal-overlay" onClick={() => setModalType(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {modalType === 'tutorial' && <img src={tutorialModal} alt="튜토리얼 모달" />}
            {modalType === 'mypage' && <img src={myPageModal} alt="마이페이지 모달" />}
            {modalType === 'multi' && (
              <div className="multi-mode-buttons">
                <button>
                  <img src={roomMake} alt="방 만들기" />
                </button>
                <button>
                  <img src={roomParticipation} alt="방 참가하기" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}



      <div className="friend-buttons">
        <button
          className={`floating-button ${modalType ? 'disabled' : ''}`}
          onClick={() => {
            if (!modalType) setIsFriendPopupOpen(prev => !prev);
          }}
          disabled={!!modalType}
        >
          <img src={fbottom} alt="플로팅 버튼" />
        </button>
      </div>


      {isFriendPopupOpen && (
        <div className="friend-popup-overlay" onClick={() => setIsFriendPopupOpen(false)}>
          <div
            className="friend-popup"
            onClick={(e) => e.stopPropagation()} // 팝업 안 누르면 닫히지 않도록
          >
            <button className="friend-popup-close-btn" onClick={() => setIsFriendPopupOpen(false)}>
              <img src={fcbottom} alt="닫기 버튼" />
            </button>
            <div className="friend-popup-content">
              <p style={{ color: '#fff' }}>친구 리스트 또는 내용</p>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

export default MainPage;
