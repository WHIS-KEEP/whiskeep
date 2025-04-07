package com.whiskeep.common.auth.jwt;

import java.io.IOException;
import java.util.List;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import com.whiskeep.common.exception.ErrorMessage;
import com.whiskeep.common.exception.UnauthorizedException;
import com.whiskeep.common.util.RedisUtil;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

	private final JwtTokenProvider jwtTokenProvider;
	private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
	private final RedisUtil redisUtil;

	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
		FilterChain filterChain) throws ServletException, IOException {
		try {
			String token = extractToken(request);

			if (token != null) {
				if (redisUtil.isBlacklisted(token)) {
					throw new UnauthorizedException(ErrorMessage.BLACKLISTED_TOKEN);
				}
				if (jwtTokenProvider.validateToken(token)) {
					Long memberId = jwtTokenProvider.getMemberIdFromToken(token);
					UsernamePasswordAuthenticationToken authentication =
						new UsernamePasswordAuthenticationToken(
							memberId,
							token,
							List.of(new SimpleGrantedAuthority("ROLE_USER"))
						);
					SecurityContextHolder.getContext().setAuthentication(authentication);
				}
			}
			filterChain.doFilter(request, response);
		} catch (AuthenticationException e) {
			SecurityContextHolder.clearContext();
			jwtAuthenticationEntryPoint.commence(request, response, e);
		}
	}

	private String extractToken(HttpServletRequest request) {
		String header = request.getHeader("Authorization");
		if (header != null && header.startsWith("Bearer ")) {
			return header.substring(7);
		}
		return null;
	}
}
