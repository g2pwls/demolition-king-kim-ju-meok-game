// StartPage.jsx
import React, { useState } from 'react';
import '../styles/MainPage.css';
import myPageIcon from '../assets/images/main/mypageicon1.png';
import tutorialIcon from '../assets/images/main/tutorialicon1.png';
import modeEvent from '../assets/images/main/modee.png';
import modeSingle from '../assets/images/main/modes.png';
import modeMulti from '../assets/images/main/modem.png';
import myPageModal from '../assets/images/main/mypagemodal.png';
import { useNavigate } from 'react-router-dom';

function MainPage() {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
  return (
    <div className="main-page-background">
      <div className="top-right-buttons">
        <button className="top-icon-button">
          <img src={tutorialIcon} alt="튜토리얼" />
        </button>
        <button className="top-icon-button" onClick={() => setShowModal(true)}>
          <img src={myPageIcon} alt="마이페이지" />
        </button>
      </div>

      <div className="bottom-right-buttons">
        <button className="bottom-icon-button">
          <img src={modeEvent} alt="이벤트 모드" />
        </button>
        <button className="bottom-icon-button">
          <img src={modeSingle} alt="싱글 모드" />
        </button>
        <button className="bottom-icon-button">
          <img src={modeMulti} alt="멀티 모드" />
        </button>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={myPageModal} alt="마이페이지 모달" />
          </div>
        </div>
      )}
    </div>
  );
}

export default MainPage;
