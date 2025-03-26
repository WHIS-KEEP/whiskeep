package com.whiskeep.common.util;

import java.util.Base64;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtTokenProvider {
	@Value("${jwt.secretKey}")
	private String secret;
	@Value("${jwt.expiration}")
	private long expiration; // 1시간

	private final String keyBase64Encoded = Base64.getEncoder().encodeToString(secret.getBytes());
	private final SecretKey secretKey = Keys.hmacShaKeyFor(keyBase64Encoded.getBytes());

	// ✅ JWT 생성
	public String createToken(String email, String provider) {
		return Jwts.builder()
			.setSubject(email) // 이메일을 subject로 설정
			.claim("provider", provider) // 추가 정보 저장
			.setIssuedAt(new Date()) // 발급 시간
			.setExpiration(new Date(System.currentTimeMillis() + expiration)) // 만료 시간
			.signWith(secretKey, SignatureAlgorithm.HS256) // 서명 알고리즘
			.compact();
	}

	// ✅ JWT 검증
	public boolean validateToken(String token) {
		try {
			Jwts.parserBuilder().setSigningKey(secretKey).build().parseClaimsJws(token);
			return true;
		} catch (JwtException | IllegalArgumentException e) {
			return false;
		}
	}

	// ✅ JWT에서 이메일 추출
	public String getEmailFromToken(String token) {
		return Jwts.parserBuilder()
			.setSigningKey(secretKey)
			.build()
			.parseClaimsJws(token)
			.getBody()
			.getSubject();
	}
}
