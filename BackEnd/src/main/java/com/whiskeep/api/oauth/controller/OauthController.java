package com.whiskeep.api.oauth.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.whiskeep.api.member.dto.MemberResponseDto;
import com.whiskeep.api.oauth.dto.LoginRequestDto;
import com.whiskeep.api.oauth.dto.LoginResponseDto;
import com.whiskeep.api.oauth.dto.LoginUserDto;
import com.whiskeep.api.oauth.dto.OAuthTokenResponseDto;
import com.whiskeep.api.oauth.service.OauthService;
import com.whiskeep.common.util.AuthUtil;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/members")
@RequiredArgsConstructor
public class OauthController {

	private final OauthService oauthService;

	@GetMapping("/login/{provider}")
	public ResponseEntity<String> socialLogin(@PathVariable String provider) {
		String loginUrl = oauthService.getLoginUrl(provider);

		return ResponseEntity.ok(loginUrl);
	}

	@PostMapping("/login/success")
	public ResponseEntity<LoginResponseDto> socialLoginRedirect(@RequestBody LoginRequestDto request) {
		MemberResponseDto memberResponseDto = null;

		// 인증 코드로 Access Token 요청
		OAuthTokenResponseDto oAuthTokenResponseDto = oauthService.getAccessTokenFromCode(request);

		// Access Token으로 사용자 정보 가져오기
		memberResponseDto = oauthService.getUserInfoFromToken(request.provider(), oAuthTokenResponseDto);

		// JWT 생성
		String jwtToken = oauthService.createJwtToken(memberResponseDto.memberId());

		// LoginResponseDto 저장
		LoginResponseDto loginInfo = new LoginResponseDto(jwtToken, new LoginUserDto(memberResponseDto.nickname(),
			memberResponseDto.profileImg()));

		// 프론트엔드로 JWT 응답
		return ResponseEntity.ok(loginInfo);
	}

	@PostMapping("/logout")
	public ResponseEntity<Void> logout() {
		String accessToken = AuthUtil.getCurrentAccessToken(); // 🔥 현재 사용자의 access token
		oauthService.logout(accessToken); // Redis 블랙리스트 등록
		return ResponseEntity.ok().build();
	}
}
