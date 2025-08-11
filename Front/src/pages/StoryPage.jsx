// src/pages/StoryPage.jsx
import React, { useEffect, useRef, useState } from 'react';
import '../styles/StoryPage.css';
import TypewriterText from '../components/TypewriterText';
import { useNavigate } from 'react-router-dom';
import AnimatedPage from '../components/AnimatedPage';

// 🔊 타이핑 효과음(BGM처럼 루프)
import keyboardBgm from '../assets/sounds/keyboard_bgm.wav';

function StoryPage() {
  const navigate = useNavigate();
  const audioRef = useRef(null);
  const [soundLocked, setSoundLocked] = useState(false);

  // ▶ 효과음 시작 (루프), 자동재생 차단 시 버튼 표시
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.loop = true;
    audio.volume = 0.45;

    const tryPlay = () =>
      audio.play().then(
        () => setSoundLocked(false),
        () => setSoundLocked(true) // 차단되면 버튼 보여줌
      );

    // 첫 시도
    tryPlay();

    // 언마운트 시 정지/리셋
    return () => {
      try {
        audio.pause();
        audio.currentTime = 0;
      } catch {}
    };
  }, []);

  const storyText = `

  한때, 그는 대한민국 복싱계를 뒤흔든 레전드였다.
하지만 세월은 흘렀고, 
지금 그는 낡은 철거 건물들을 부수는 일용직 노동자로 살아간다. 

어느 날, 철거 현장에서 오래된 체육관을 마주한 순간 
과거의 기억과 뜨거웠던 피가 다시 끓어오른다. 

"이 철거는... 그냥 철거가 아니야." 
철근, 콘크리트, 유리창...
그에겐 이제 모두 상대 선수일 뿐이다.

다시, 주먹 하나로 모든 걸 무너뜨릴 시간이다.`;

  // ⏹ 타이핑 종료 시 효과음 멈춤 후 이동
  const handleDone = () => {
    const audio = audioRef.current;
    if (audio) {
      try {
        audio.pause();
        audio.currentTime = 0;
      } catch {}
    }
    setTimeout(() => navigate('/main'), 1000);
  };

  // ⏹ SKIP 시도 시에도 효과음 정지
  const handleSkip = () => {
    const audio = audioRef.current;
    if (audio) {
      try {
        audio.pause();
        audio.currentTime = 0;
      } catch {}
    }
    navigate('/main');
  };

  return (
    <AnimatedPage>
      <div className="story-background">
        {/* 🔊 루프 BGM (타이핑 중만 재생) */}
        <audio ref={audioRef} src={keyboardBgm} preload="auto" />

        {/* 자동재생 차단 해제 버튼 */}
        {soundLocked && (
          <button
            onClick={() =>
              audioRef.current?.play().then(() => setSoundLocked(false)).catch(() => {})
            }
            style={{
              position: 'fixed', top: 16, right: 16, zIndex: 9999,
              padding: '8px 12px', borderRadius: 8, border: '1px solid #ccc',
              background: '#111', color: '#fff', cursor: 'pointer'
            }}
          >
            🔊 사운드 켜기
          </button>
        )}

        <TypewriterText text={storyText} speed={40} onDone={handleDone} />

        <button className="skip-button" onClick={handleSkip}>
          SKIP →
        </button>
      </div>
    </AnimatedPage>
  );
}

export default StoryPage;
