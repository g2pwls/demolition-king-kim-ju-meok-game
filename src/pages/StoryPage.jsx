// src/pages/StoryPage.jsx
import React from 'react';
import '../styles/StoryPage.css';
import TypewriterText from '../components/TypewriterText';

function StoryPage() {
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

  return (
    <div className="story-background">
      <TypewriterText text={storyText} speed={40} />
    </div>
  );
}

export default StoryPage;
