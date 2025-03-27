package com.whiskeep.common.util;

import java.security.Key;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtTokenProvider {
	private final Key key;
	private final long expiration;
	private final String issuer;

	// 생성자에서 값을 주입받도록 변경
	public JwtTokenProvider(
		@Value("${spring.security.jwt.secret-key}") String secretKey,
		@Value("${spring.security.jwt.expiration-time}") long expiration,
		@Value("${spring.security.jwt.issuer}") String issuer
	) {
		this.key = Keys.hmacShaKeyFor(secretKey.getBytes());
		this.expiration = expiration;
		this.issuer = issuer;
	}

	public String createToken(String nickName) {
		return Jwts.builder()
			.setHeaderParam("typ", "JWT")
			.setSubject(nickName)
			.setIssuer(issuer)
			.setIssuedAt(new Date())
			.setExpiration(new Date(System.currentTimeMillis() + expiration))
			.signWith(key, SignatureAlgorithm.HS256)
			.compact();
	}

	public String getUserFromToken(String token) {
		Claims claims = Jwts.parserBuilder()
			.setSigningKey(key)
			.build()
			.parseClaimsJws(token)
			.getBody();
		return claims.getSubject();
	}
}
