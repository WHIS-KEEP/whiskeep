package com.whiskeep.api.member.controller;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.whiskeep.api.member.domain.Member;
import com.whiskeep.api.member.dto.MemberResponseDto;
import com.whiskeep.api.member.dto.MemberUpdateRequestDto;
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
	public ResponseEntity<MemberResponseDto> getMember(@Auth Long memberId) {

		Member member = memberService.getCurrentMember(memberId);

		MemberResponseDto memberInfo = MemberResponseDto.from(member);

		return ResponseEntity.ok().body(memberInfo);
	}

	// 사용자 정보 수정
	@PutMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<MemberResponseDto> updateMember(@Auth Long memberId,
		@RequestPart("member") MemberUpdateRequestDto request,
		@RequestPart(value = "profileImg", required = false) MultipartFile profileImg) {
		MemberResponseDto updatedMember = memberService.updateMember(memberId, request, profileImg);

		return ResponseEntity.ok().body(updatedMember);
	}

	// 사용자 닉네임 중복 확인
	@PostMapping("/check-nickname")
	public ResponseEntity<Boolean> checkNicknameDuplicate(@RequestBody MemberUpdateRequestDto request) {
		boolean isAvailable = memberService.isNicknameAvailable(request.nickname());

		return ResponseEntity.ok().body(isAvailable);
	}
}
