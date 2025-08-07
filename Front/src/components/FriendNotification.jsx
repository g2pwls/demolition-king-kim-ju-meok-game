// FriendNotification.jsx
import React, { useEffect } from 'react';

const FriendNotification = ({ token }) => {
  useEffect(() => {
    if (!token) return;

    const eventSource = new EventSource(`/api/sse/subscribe?token=${token}`);

    eventSource.onopen = () => {
      console.log("✅ SSE 연결됨");
    };

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("📩 새로운 친구 요청 알림 수신:", data);

      // 여기에 알림 띄우기
      alert(`📨 친구 요청 도착: ${data.senderNickname}`);
      // 또는 state로 저장해서 UI에 표시
    };

    eventSource.onerror = (err) => {
      console.error("❌ SSE 오류 발생:", err);
      eventSource.close();
    };

    return () => {
      console.log("🔌 SSE 연결 종료됨");
      eventSource.close();
    };
  }, [token]);

  return null; // 알림 UI 필요시 컴포넌트로 만들어도 됨
};

export default FriendNotification;
