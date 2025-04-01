package com.whiskeep.common.auth.jwt;

import java.security.Key;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.whiskeep.common.exception.ErrorMessage;
import com.whiskeep.common.exception.UnauthorizedException;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;

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

	public String createToken(Long memberId) {
		return Jwts.builder()
			.setHeaderParam("typ", "JWT")
			.setSubject(memberId.toString())
			.setIssuer(issuer)
			.setIssuedAt(new Date())
			.setExpiration(new Date(System.currentTimeMillis() + expiration))
			.signWith(key, SignatureAlgorithm.HS256)
			.compact();
	}

	public Long getMemberIdFromToken(String token) {
		Claims claims = Jwts.parserBuilder()
			.setSigningKey(key)
			.build()
			.parseClaimsJws(token)
			.getBody();
		return Long.parseLong(claims.getSubject());
	}

	// 토큰 유효성 검사
	public boolean validateToken(String token) {
		try {
			Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
			return true;
		} catch (ExpiredJwtException e) {
			throw new UnauthorizedException(ErrorMessage.EXPIRED_TOKEN);
		} catch (UnsupportedJwtException | MalformedJwtException | SecurityException | SignatureException e) {
			throw new UnauthorizedException(ErrorMessage.INVALID_TOKEN);
		} catch (IllegalArgumentException e) {
			throw new UnauthorizedException(ErrorMessage.INVALID_PARAMETER);
		}
	}
}
