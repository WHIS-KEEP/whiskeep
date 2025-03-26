package com.whiskeep.api.member.controller;

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
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/member")
@RequiredArgsConstructor
public class MemberController {

	private final CustomOAuth2UserService customOAuth2UserService;

	@GetMapping("/login/{provider}")
	public ResponseEntity<String> socialLogin(@PathVariable String provider) {

		String loginUrl = customOAuth2UserService.getLoginUrl(provider);

		return ResponseEntity.ok(loginUrl);
	}

	@GetMapping("/login/success")
	public ResponseEntity<Map<String, String>> socialLoginRedirect(@RequestParam String code) {

		// // 1️⃣ 인증 코드로 Access Token 요청
		// String accessToken = customOAuth2UserService.getAccessTokenFromCode(code);
		// System.out.println("✅ 구글 Access Token: " + accessToken);
		//
		// // 2️⃣ Access Token으로 사용자 정보 가져오기
		// Member member = customOAuth2UserService.getUserInfoFromToken(accessToken);
		// System.out.println("✅ 사용자 정보: " + member);
		//
		// // 3️⃣ JWT 생성
		// String jwtToken = customOAuth2UserService.createToken(member.getEmail(), member.getProvider().name());
		// System.out.println("✅ 생성된 JWT: " + jwtToken);
		//
		// // 4️⃣ 프론트엔드로 JWT 응답
		// return ResponseEntity.ok(Map.of("jwtToken", jwtToken));

		return null;
	}

}
