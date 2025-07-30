package com.e106.demolition_king.friend.websocket;

import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.Message;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component
@RequiredArgsConstructor
public class StompPresenceEventListener {

    private final PresenceService presenceService;

    @EventListener
    public void handleSessionConnect(SessionConnectEvent event) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(event.getMessage(), StompHeaderAccessor.class);
        String userUuid = (String) accessor.getSessionAttributes().get("userUuid");
        System.out.println("🧩 세션에서 꺼낸 userUuid = " + userUuid);
        if (userUuid != null) {
            presenceService.setOnline(userUuid);
            System.out.println("✅ Redis 등록 완료: " + userUuid);
        } else {
            System.out.println("❌ 세션에 userUuid 없음");
        }
    }

    @EventListener
    public void handleSessionDisconnect(SessionDisconnectEvent event) {
        String userUuid = extractUserUuid(event.getMessage());
        System.out.println("🔴 DISCONNECT UUID from session: " + userUuid);
        if (userUuid != null) {
            presenceService.setOffline(userUuid);
        }
    }

    private String extractUserUuid(Message<?> message) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
        if (accessor != null && accessor.getNativeHeader("userUuid") != null) {
            return accessor.getNativeHeader("userUuid").get(0); // 첫 번째 값
        }
        return null;
    }
}
