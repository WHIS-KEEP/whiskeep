package com.whiskeep.common.util;

import java.util.concurrent.TimeUnit;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class RedisUtil {

	private final RedisTemplate<String, String> redisTemplate;

	public static final String BLACKLIST_PREFIX = "blacklist:";
	public static final String BLACKLIST_VALUE_LOGOUT = "logout";

	public void saveBlackListToken(String accessToken, long expiration) {
		save(BLACKLIST_PREFIX + accessToken, BLACKLIST_VALUE_LOGOUT, expiration);
	}

	public boolean isBlacklisted(String token) {
		return exists(BLACKLIST_PREFIX + token);
	}

	public void save(String key, String value, long ttlMillis) {
		redisTemplate.opsForValue().set(key, value, ttlMillis, TimeUnit.MILLISECONDS);
	}

	public String get(String key) {
		return redisTemplate.opsForValue().get(key);
	}

	public boolean exists(String key) {
		return Boolean.TRUE.equals(redisTemplate.hasKey(key));
	}
}
