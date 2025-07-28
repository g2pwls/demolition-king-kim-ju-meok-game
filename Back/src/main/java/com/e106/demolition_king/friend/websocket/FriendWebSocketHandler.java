package com.e106.demolition_king.friend.websocket;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.*;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
@RequiredArgsConstructor
public class FriendWebSocketHandler extends TextWebSocketHandler {

    private final RedisTemplate<String, String> redisTemplate;

    // 세션 추적 (옵션)
    private final Map<String, WebSocketSession> sessionMap = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        String userUuid = extractUserUuid(session);
        if (userUuid != null) {
            sessionMap.put(userUuid, session);
            redisTemplate.opsForValue().set("online:" + userUuid, "true");
            System.out.println("[WebSocket] " + userUuid + " 접속 - online 상태 저장됨");
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        String userUuid = extractUserUuid(session);
        if (userUuid != null) {
            sessionMap.remove(userUuid);
            redisTemplate.delete("online:" + userUuid);
            System.out.println("[WebSocket] " + userUuid + " 종료 - online 상태 삭제됨");
        }
    }

    private String extractUserUuid(WebSocketSession session) {
        // ws://localhost:8080/ws/friend?user_uuid=abc-123
        try {
            return UriComponentsBuilder.fromUri(session.getUri())
                    .build()
                    .getQueryParams()
                    .getFirst("user_uuid");
        } catch (Exception e) {
            return null;
        }
    }
}
