// StartPage.jsx
import React from 'react';
import '../styles/StartPage.css';
import characterImage from '../assets/images/start/character.png'; // ✅ 이미지 import

function StartPage() {
  return (
    <div className="start-page-background">
      <img src={characterImage} alt="Character" className="character-image" />
    </div>
  );
}

export default StartPage;
