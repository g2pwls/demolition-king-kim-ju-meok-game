package com.e106.demolition_king.friend.websocket;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.*;

@Configuration
@EnableWebSocket
@RequiredArgsConstructor
public class FriendWebSocketConfig implements WebSocketConfigurer {

    private final FriendWebSocketHandler friendWebSocketHandler;

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(friendWebSocketHandler, "/ws/friend")
                .setAllowedOrigins("*");
    }
}
