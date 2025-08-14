// src/components/FriendNotification.jsx
import React, { useEffect, useRef } from "react";
import api from "../utils/api";

/**
 * SSE 구독 전용: 화면에 아무것도 렌더하지 않음.
 * - token: JWT (쿼리스트링 전달)
 * - onFriendRequest: 친구요청 payload 콜백
 * - onAnyEvent: 모든 이벤트 콜백
 * - onToast: 메인에서 토스트 띄우도록 메시지 전달
 */
export default function FriendNotification({
  token,
  onFriendRequest,
  onAnyEvent,
  onToast,                    // ✅ 추가: 토스트 메시지를 메인으로 올림
  autoOpenPopupOnFriendReq = true,
}) {
  const esRef = useRef(null);
  const retryRef = useRef(1000);

  useEffect(() => {
    if (!token) return;

    let closed = false;

    const baseURL =
      api?.defaults?.baseURL?.replace(/\/+$/, "") || window.location.origin;

    const connect = () => {
      if (closed) return;

      const url = `${baseURL}/sse/subscribe?token=${encodeURIComponent(token)}`;
      const es = new EventSource(url, { withCredentials: false });
      esRef.current = es;

      es.onopen = () => {
        retryRef.current = 1000;
        console.log("[SSE] connected", url);
      };

      es.onerror = (err) => {
        try { es.close(); } catch {}
        const wait = Math.min(retryRef.current, 30000);
        retryRef.current = Math.min(retryRef.current * 2, 30000);
        setTimeout(() => { if (!closed) connect(); }, wait);
      };

      es.onmessage = (evt) => {
        const payload = safeParse(evt?.data);
        if (!payload) return;

        onAnyEvent?.(payload);

        const typeKey = String(payload.type || payload.event || "").toLowerCase();
        if (typeKey === "friend_request" || typeKey === "friend-request") {
          const nick =
            payload?.data?.friendNickname ||
            payload?.friendNickname ||
            "새 친구";

          // ✅ 화면 토스트는 메인에서 처리
          onToast?.(`📩 ${nick} 님이 친구 요청을 보냈어요!`);
          onFriendRequest?.(payload.data || payload);

          if (autoOpenPopupOnFriendReq) {
            window.dispatchEvent(
              new CustomEvent("friend-request-received", {
                detail: payload.data || payload,
              })
            );
          }
        }
      };

      // named event
      es.addEventListener("friend-request", (evt) => {
        const p = safeParse(evt?.data);
        if (!p) return;
        const nick = p?.friendNickname || "새 친구";
        onToast?.(`📩 ${nick} 님이 친구 요청을 보냈어요!`); // ✅ 메인으로
        onFriendRequest?.(p);
        onAnyEvent?.(p);
        if (autoOpenPopupOnFriendReq) {
          window.dispatchEvent(new CustomEvent("friend-request-received", { detail: p }));
        }
      });
    };

    connect();

    const onVisible = () => {
      if (document.visibilityState === "visible") {
        if (!esRef.current || esRef.current.readyState === EventSource.CLOSED) {
          connect();
        }
      }
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      closed = true;
      document.removeEventListener("visibilitychange", onVisible);
      try { esRef.current?.close(); } catch {}
    };
  }, [token, onFriendRequest, onAnyEvent, onToast, autoOpenPopupOnFriendReq]);

  return null; // ✅ 화면에 아무것도 렌더하지 않음
}

function safeParse(data) {
  if (!data) return null;
  if (typeof data === "object") return data;
  try { return JSON.parse(data); } catch { return data; }
}
