package com.whiskeep.api.member.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.whiskeep.api.member.domain.Member;
import com.whiskeep.api.member.dto.MemberResponseDto;
import com.whiskeep.api.member.service.MemberService;
import com.whiskeep.common.auth.annotation.Auth;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/members")
public class MemberController {

	private final MemberService memberService;

	// 사용자 정보 조회
	@GetMapping
	public ResponseEntity<MemberResponseDto> getMember(@Auth Member member) {
		return null;
	}
}
