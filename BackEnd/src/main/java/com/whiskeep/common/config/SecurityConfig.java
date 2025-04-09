package com.whiskeep.common.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.whiskeep.common.auth.jwt.JwtAuthenticationEntryPoint;
import com.whiskeep.common.auth.jwt.JwtAuthenticationFilter;
import com.whiskeep.common.auth.jwt.JwtTokenProvider;
import com.whiskeep.common.util.RedisUtil;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

	private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
	private final RedisUtil redisUtil;

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtTokenProvider jwtTokenProvider,
		CorsConfigurationSource corsConfigurationSource) throws
		Exception {
		http
			.cors(cors -> cors.configurationSource(corsConfigurationSource)) // ✅ CORS 설정 추가
			.csrf(AbstractHttpConfigurer::disable) // CSRF 보안 해제 (API 서버의 경우 비활성화 가능)
			.exceptionHandling(ex -> ex.authenticationEntryPoint(jwtAuthenticationEntryPoint))
			.authorizeHttpRequests(auth -> auth
				.requestMatchers("/api/members/login/**").permitAll() // 누구나 접근 가능
				.anyRequest().authenticated() // 그 외 요청은 인증 필요
			)
			.oauth2Login(AbstractHttpConfigurer::disable
			)
			.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
			.formLogin(AbstractHttpConfigurer::disable) // 기본 로그인 페이지 비활성화
			.httpBasic(AbstractHttpConfigurer::disable) // HTTP 기본 인증 비활성화
			.addFilterBefore(new JwtAuthenticationFilter(jwtTokenProvider, jwtAuthenticationEntryPoint, redisUtil),
				UsernamePasswordAuthenticationFilter.class);

		return http.build();
	}

	@Bean
	public CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration config = new CorsConfiguration();
		config.setAllowedOriginPatterns(
			List.of("http://localhost:5173",
				"https://j12a409.p.ssafy.io",
				"https://www.whiskeep.com",
				"https://whiskeep.com")
		);
		config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
		config.setAllowedHeaders(List.of("*"));
		config.setAllowCredentials(true);

		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", config);
		return source;
	}
}
