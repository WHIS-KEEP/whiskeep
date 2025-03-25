package com.whiskeep.common.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

import com.whiskeep.api.member.auth.CustomOAuth2UserService;
import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

	private final CustomOAuth2UserService customOAuth2UserService;

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http
			.csrf(csrf -> csrf.disable()) // CSRF 보안 해제 (API 서버의 경우 비활성화 가능)
			.authorizeHttpRequests(auth -> auth
				.requestMatchers("/api/member/login/**").permitAll() // 누구나 접근 가능
				.anyRequest().authenticated() // 그 외 요청은 인증 필요
			)
			.oauth2Login(oauth2 -> oauth2
				.userInfoEndpoint(endpoint -> endpoint.userService(customOAuth2UserService)) // OAuth2 사용자 정보 서비스 등록
				.defaultSuccessUrl("/api/home", true) // 로그인 성공 시 이동할 페이지
				// .failureUrl("/api/login?error=true")
			)
			.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // 세션을 사용하지 않음 (JWT 기반)
			.formLogin(form -> form.disable()) // 기본 로그인 페이지 비활성화
			.httpBasic(httpBasic -> httpBasic.disable()); // HTTP 기본 인증 비활성화

		return http.build();
	}


}
