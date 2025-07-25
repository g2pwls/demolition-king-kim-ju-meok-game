import React, { useEffect } from 'react';
import '../styles/EventPage.css';
import paperSound from '../assets/sounds/paper.mp3'; // 사운드 파일 import

function EventPage() {
  useEffect(() => {
    const audio = new Audio(paperSound);
    audio.play().catch(err => {
      console.warn('소리 재생 실패:', err);
    });
  }, []);

  return (
    <div className="event-page">
      <div className="event-background" />
      
      {/* 부드러운 밝아지는 효과 */}
      <div className="light-mask-gradient" />

      <h1 className="event-title">이벤트 모드</h1>
    </div>
  );
}

export default EventPage;
