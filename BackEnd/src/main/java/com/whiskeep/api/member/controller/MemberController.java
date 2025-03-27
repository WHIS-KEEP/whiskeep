package com.whiskeep.api.member.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.nimbusds.oauth2.sdk.token.AccessToken;
import com.whiskeep.api.member.auth.CustomOAuth2UserService;
import com.whiskeep.api.member.domain.Member;
import com.whiskeep.api.member.dto.google.GoogleTokenDto;
import com.whiskeep.api.member.dto.google.GoogleUserResponseDto;
import com.whiskeep.api.member.dto.member.MemberResponseDto;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/member")
@RequiredArgsConstructor
public class MemberController {

	private final CustomOAuth2UserService customOAuth2UserService;

	@GetMapping("/login/{provider}")
	public ResponseEntity<String> socialLogin(@PathVariable String provider) {
		String loginUrl = customOAuth2UserService.getLoginUrl(provider);
		System.out.println(loginUrl);

		return ResponseEntity.ok(loginUrl);
	}

	@GetMapping("/login/success")
	public ResponseEntity<Map<String, String>> socialLoginRedirect(@RequestParam String code) {

		// 1️⃣ 인증 코드로 Access Token 요청
		GoogleTokenDto googleTokenDto = customOAuth2UserService.getAccessTokenFromCode(code);
		System.out.println("✅ 구글 Access Token: " + googleTokenDto.toString());

		// 2️⃣ Access Token으로 사용자 정보 가져오기
		MemberResponseDto memberResponseDto = customOAuth2UserService.getUserInfoFromToken(googleTokenDto);
		System.out.println("✅ 사용자 정보: " + memberResponseDto.toString());

		// 3️⃣ JWT 생성
		String jwtToken = customOAuth2UserService.createJwtToken(memberResponseDto.getNickname());
		System.out.println("✅ 생성된 JWT: " + jwtToken);

		// 4️⃣ 프론트엔드로 JWT 응답
		return ResponseEntity.ok(Map.of("access-token", jwtToken));
	}

}
