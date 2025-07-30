import React, { useState, useEffect } from "react";
import "../styles/StartPage.css";
import { useNavigate } from "react-router-dom";
import logoImage from "../assets/images/start/logo.png";
import character1 from "../assets/images/start/characterpick.png";
import character2 from "../assets/images/start/charp.png";
import pressStartImage from "../assets/images/start/pressstart.png";
import AnimatedPage from "../components/AnimatedPage";

function StartPage() {
  const [currentCharacter, setCurrentCharacter] = useState(character1);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCharacter((prev) =>
        prev === character1 ? character2 : character1
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleStartClick = () => {
    const autoLogin = localStorage.getItem("autoLogin");
    const user = JSON.parse(localStorage.getItem("user"));

    if (autoLogin === "true" && user) {
      navigate("/story"); // 자동 로그인 → 메인화면
    } else {
      navigate("/login"); // 기본 → 로그인
    }
  };

  const characterClass =
    currentCharacter === character2
      ? "start-character punch-style"
      : "start-character";

  return (
    <AnimatedPage>
      <div className="start-page-background">
        <div className="start-content">
          <div className="logo-wrapper">
            <img src={logoImage} alt="Logo" className="start-logo" />
          </div>
          <div className="character-wrapper">
            <img
              src={currentCharacter}
              alt="Character"
              className={characterClass}
            />
          </div>
          <div className="button-wrapper">
            <img
              src={pressStartImage}
              alt="Press Start"
              className="start-button"
              onClick={handleStartClick}
            />
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
}

export default StartPage;
