package com.e106.demolition_king.friend.websocket;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PresenceService {

    private final RedisTemplate<String, String> redisTemplate;

    public void setOnline(String userUuid) {
        redisTemplate.opsForValue().set("online:" + userUuid, "true");
    }

    public void setOffline(String userUuid) {
        redisTemplate.delete("online:" + userUuid);
    }

    public boolean isOnline(String userUuid) {
        return Boolean.TRUE.equals(redisTemplate.hasKey("online:" + userUuid));
    }
}
