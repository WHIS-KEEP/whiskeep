package com.whiskeep.common.auth.jwt;

import java.io.IOException;
import java.util.List;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;


import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class JwtAuthenticationFilter extends OncePerRequestFilter {

	private final JwtTokenProvider jwtTokenProvider;
	private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

	public JwtAuthenticationFilter(JwtTokenProvider jwtTokenProvider,
		JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint) {
		this.jwtTokenProvider = jwtTokenProvider;
		this.jwtAuthenticationEntryPoint = jwtAuthenticationEntryPoint;
	}

	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
		FilterChain filterChain) throws
		ServletException, IOException {
		String header = request.getHeader("Authorization");

		try {
			if (header != null && header.startsWith("Bearer ")) {
				String token = header.substring(7);

				if (jwtTokenProvider.validateToken(token)) {
					Long memberId = jwtTokenProvider.getMemberIdFromToken(token);

					UsernamePasswordAuthenticationToken auth =
						new UsernamePasswordAuthenticationToken(memberId, null,
							List.of(new SimpleGrantedAuthority("ROLE_USER")));

					SecurityContextHolder.getContext().setAuthentication(auth);
				}
			}
			filterChain.doFilter(request, response);
		} catch (AuthenticationException e) {
			SecurityContextHolder.clearContext();
			jwtAuthenticationEntryPoint.commence(request, response, e);
		}
	}
}
