package com.e106.demolition_king.user.repository;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Repository;
import java.util.concurrent.TimeUnit;                 // ← 추가!
import org.springframework.data.redis.core.RedisTemplate;  // ← 추가!

@Repository
public class EmailRedisRepository {
    private final StringRedisTemplate redis;

    public EmailRedisRepository(StringRedisTemplate redis) {
        this.redis = redis;
    }

    private String key(String email) {
        return "email:verify:" + email;
    }

    /** 인증 코드 저장 (10분 TTL) */
    public void saveCode(String email, String code) {
        redis.opsForValue().set(key(email), code, 600, TimeUnit.SECONDS);
    }

    /** 나중에 검증할 때 꺼내 쓸 수 있도록 */
    public String getCode(String email) {
        return redis.opsForValue().get(key(email));
    }

    public void delete(String email) {
        redis.delete(key(email));
    }

}