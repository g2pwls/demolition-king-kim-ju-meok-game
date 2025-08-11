// src/pages/StoryPage.jsx
import React, { useEffect } from 'react';
import '../styles/StoryPage.css';
import TypewriterText from '../components/TypewriterText';
import { useNavigate, useLocation } from 'react-router-dom';
import AnimatedPage from '../components/AnimatedPage';
import api from '../utils/api';

function StoryPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // 1) 해시로 온 access 토큰 저장 + 해시 제거
  useEffect(() => {
    try {
      const hash = location.hash?.slice(1) || ''; // "access=..."
      if (!hash) return;
      const params = new URLSearchParams(hash);
      const at = params.get('access');
      if (at) {
        localStorage.setItem('accessToken', at);
        // URL 정리: 해시 제거 (히스토리 오염 방지)
        navigate(location.pathname + location.search, { replace: true });
      }
    } catch (e) {
      console.error('[Story] hash parse failed', e);
    }
  }, [location, navigate]);

  // 2) 혹시 해시가 없고, localStorage도 비어있다면 (새로고침 등)
  //    refresh 쿠키로 교환 API를 한 번 시도 (선택사항)
  useEffect(() => {
    (async () => {
      if (localStorage.getItem('accessToken')) return;
      try {
        const { data } = await api.post('/user/auth/tokenrefresh'); // 쿠키 동봉됨
        const at = data?.result?.accessToken ?? data?.accessToken;
        if (at) localStorage.setItem('accessToken', at);
      } catch {
        // 교환도 실패하면 로그인으로
        // 여기서 바로 튕기지 않고, 아래 onDone에서 /main 가기 전에 체크해도 OK
      }
    })();
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

  return (
    <AnimatedPage>
    <div className="story-background">
      <TypewriterText text={storyText} speed={40} 
      onDone={() => {
            // ✅ 5초 뒤에 자동 이동
            setTimeout(() => {
              navigate('/main');
            }, 1000);
          }} />
      

      <button
        className="skip-button"
        onClick={() => navigate('/main')}
      >
        SKIP →
      </button>
    </div>
    </AnimatedPage>
  );
}

export default StoryPage;
