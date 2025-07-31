package com.e106.demolition_king.friend.controller;

import com.e106.demolition_king.friend.sse.SseEmitters;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/sse")
public class FriendSseController {

    private final SseEmitters sseEmitters;

    @GetMapping("/subscribe/{userUuid}")
    public SseEmitter subscribe(@PathVariable String userUuid) {
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);
        sseEmitters.add(userUuid, emitter);

        emitter.onCompletion(() -> sseEmitters.remove(userUuid));
        emitter.onTimeout(() -> sseEmitters.remove(userUuid));
        emitter.onError(e -> sseEmitters.remove(userUuid));

        return emitter;
    }
}
