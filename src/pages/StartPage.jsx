// StartPage.jsx
import React, { useState, useEffect } from 'react';
import '../styles/StartPage.css';
import { useNavigate } from 'react-router-dom';
import logoImage from '../assets/images/start/logo.png';
import character1 from '../assets/images/start/characterpick.png';
import character2 from '../assets/images/start/charpunch.png';
import pressStartImage from '../assets/images/start/pressstart.png';
import AnimatedPage from '../components/AnimatedPage';


function StartPage() {
  const [currentCharacter, setCurrentCharacter] = useState(character1);
  const navigate = useNavigate(); // 🔸 페이지 이동 함수

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCharacter(prev => (prev === character1 ? character2 : character1));
    }, 1000); // 1초마다 이미지 전환

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 정리
  }, []);
  const handleStartClick = () => {
      navigate('/login'); // 🔸 로그인 페이지로 이동
    };
  const characterClass =
    currentCharacter === character2 ? 'start-character punch-style' : 'start-character';

  return (
    <AnimatedPage>
    <div className="start-page-background">
      <div className="start-content">
        <div className="logo-wrapper">
          <img src={logoImage} alt="Logo" className="start-logo" />
        </div>
        <div className="character-wrapper">
          <img src={currentCharacter} alt="Character" className={characterClass} />
        </div>
        <div className="button-wrapper">
          <img src={pressStartImage} alt="Press Start" className="start-button" onClick={handleStartClick} />
        </div>
      </div>
    </div>
    </AnimatedPage>
  );
}

export default StartPage;
 