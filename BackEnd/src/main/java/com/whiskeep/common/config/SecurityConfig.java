package com.whiskeep.common.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http
			.csrf(csrf -> csrf.disable()) // CSRF 보안 해제 (API 서버의 경우 비활성화 가능)
			.authorizeHttpRequests(auth -> auth
				.requestMatchers("/api/member/login/**").permitAll() // 누구나 접근 가능
				.anyRequest().authenticated() // 그 외 요청은 인증 필요
			)
			.oauth2Login(oauth2 -> oauth2
				.defaultSuccessUrl("/api/member/login/success", true) // 로그인 성공 시 리디렉션할
				.failureUrl("/api/member/login?error=true") // 로그인 실패 시 리디렉션할 URL
			)
			.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
			.formLogin(form -> form.disable()) // 기본 로그인 페이지 비활성화
			.httpBasic(httpBasic -> httpBasic.disable()); // HTTP 기본 인증 비활성화

		return http.build();
	}


}
