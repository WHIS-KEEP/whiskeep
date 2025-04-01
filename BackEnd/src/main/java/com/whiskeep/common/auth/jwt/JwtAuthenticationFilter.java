package com.whiskeep.common.auth.jwt;

import java.io.IOException;
import java.util.List;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import com.whiskeep.common.exception.BadRequestException;
import com.whiskeep.common.exception.ErrorMessage;
import com.whiskeep.common.exception.UnauthorizedException;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class JwtAuthenticationFilter extends OncePerRequestFilter {

	private final JwtTokenProvider jwtTokenProvider;

	public JwtAuthenticationFilter(JwtTokenProvider jwtTokenProvider) {
		this.jwtTokenProvider = jwtTokenProvider;
	}

	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
		FilterChain filterChain) throws
		ServletException, IOException {
		String header = request.getHeader("Authorization");

		if (header != null && header.startsWith("Bearer ")) {
			String token = header.substring(7);

			if (jwtTokenProvider.validateToken(token)) {
				Long memberId = jwtTokenProvider.getMemberIdFromToken(token);

				UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(memberId, null,
					List.of(new SimpleGrantedAuthority("ROLE_USER")));

				SecurityContextHolder.getContext().setAuthentication(auth);
			} else {
				// 토큰이 유효하지 않으면
				throw new UnauthorizedException(ErrorMessage.INVALID_TOKEN);
			}
		}
		filterChain.doFilter(request, response);
	}

}
