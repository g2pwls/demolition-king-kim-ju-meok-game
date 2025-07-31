package com.e106.demolition_king.friend.sse;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class SseEmitters {

    private final Map<String, SseEmitter> emitters = new ConcurrentHashMap<>();

    public void add(String userUuid, SseEmitter emitter) {
        emitters.put(userUuid, emitter);
    }

    public void remove(String userUuid) {
        emitters.remove(userUuid);
    }

    public void send(String userUuid, String message) {
        SseEmitter emitter = emitters.get(userUuid);
        if (emitter != null) {
            try {
                emitter.send(SseEmitter.event()
                        .name("friend-request")
                        .data(message));
            } catch (IOException e) {
                emitters.remove(userUuid);
            }
        }
    }

    public boolean isOnline(String userUuid) {
        return emitters.containsKey(userUuid);
    }
}
