package com.whiskeep.api.oauth.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.whiskeep.api.member.dto.MemberResponseDto;
import com.whiskeep.api.oauth.dto.google.GoogleTokenDto;
import com.whiskeep.api.oauth.service.OauthService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/members/login")
@RequiredArgsConstructor
public class OauthController {

	private final OauthService oauthService;

	@GetMapping("/{provider}")
	public ResponseEntity<String> socialLogin(@PathVariable String provider) {
		String loginUrl = oauthService.getLoginUrl(provider);

		return ResponseEntity.ok(loginUrl);
	}

	@PostMapping("/success")
	public ResponseEntity<String> socialLoginRedirect(@RequestParam String code) {

		// 1️⃣ 인증 코드로 Access Token 요청
		GoogleTokenDto googleTokenDto = oauthService.getAccessTokenFromCode(code);

		// 2️⃣ Access Token으로 사용자 정보 가져오기
		MemberResponseDto memberResponseDto = oauthService.getUserInfoFromToken(googleTokenDto);

		// 3️⃣ JWT 생성
		String jwtToken = oauthService.createJwtToken(memberResponseDto.memberId());

		// 4️⃣ 프론트엔드로 JWT 응답
		return ResponseEntity.ok(jwtToken);
	}

}
