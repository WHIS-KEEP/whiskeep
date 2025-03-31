package com.whiskeep.api.member.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.whiskeep.api.member.dto.MemberResponseDto;
import com.whiskeep.api.member.service.MemberService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/members")
public class MemberController {

	private final MemberService memberService;

	// 사용자 정보 조회
	@GetMapping
	public ResponseEntity<MemberResponseDto> getMember(HttpServletRequest request) {
		// 헤더에서 Authorization 값 추출
		String token = request.getHeader("Authorization");

		// 토큰이 없거나 잘못된 경우 예외 처리
		if (token == null || !token.startsWith("Bearer ")) {
			return ResponseEntity.status(401).body(null);
		}

		try {
			MemberResponseDto memberInfo = memberService.getUserInfo(token);
			return ResponseEntity.ok().body(memberInfo);
		} catch (UsernameNotFoundException e) {
			return ResponseEntity.status(404).body(null);
		} catch (Exception e) {
			return ResponseEntity.status(401).body(null);
		}

	}
}
