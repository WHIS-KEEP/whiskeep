package com.whiskeep.common.auth.jwt;

import java.security.Key;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.whiskeep.common.exception.ErrorMessage;
import com.whiskeep.common.exception.UnauthorizedException;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtTokenProvider {
	private final Key key;
	private final long expiration;
	private final String issuer;

	public JwtTokenProvider(
		@Value("${spring.security.jwt.secret-key}") String secretKey,
		@Value("${spring.security.jwt.expiration-time}") long expiration,
		@Value("${spring.security.jwt.issuer}") String issuer
	) {
		this.key = Keys.hmacShaKeyFor(secretKey.getBytes());
		this.expiration = expiration;
		this.issuer = issuer;
	}

	public String createToken(Long memberId) {
		Date now = new Date();
		Date expiry = new Date(now.getTime() + expiration);

		return Jwts.builder()
			.setHeaderParam("typ", "JWT")
			.setSubject(memberId.toString())
			.setIssuer(issuer)
			.setIssuedAt(now)
			.setExpiration(expiry)
			.signWith(key, SignatureAlgorithm.HS256)
			.compact();
	}

	public Long getMemberIdFromToken(String token) {
		Claims claims = parseClaims(token);
		return Long.parseLong(claims.getSubject());
	}

	public boolean validateToken(String token) {
		try {
			parseClaims(token); // 파싱 성공 == 유효
			return true;
		} catch (ExpiredJwtException e) {
			throw new UnauthorizedException(ErrorMessage.EXPIRED_TOKEN);
		} catch (JwtException | IllegalArgumentException e) {
			throw new UnauthorizedException(ErrorMessage.INVALID_TOKEN);
		}
	}

	public long getExpiration(String token) {
		try {
			Claims claims = parseClaims(token);
			long now = System.currentTimeMillis();
			return claims.getExpiration().getTime() - now;
		} catch (ExpiredJwtException e) {
			return 0L;
		}
	}

	private Claims parseClaims(String token) {
		return Jwts.parserBuilder()
			.setSigningKey(key)
			.build()
			.parseClaimsJws(token)
			.getBody();
	}
}
