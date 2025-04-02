package com.whiskeep.api.member.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.whiskeep.api.member.dto.BeginnerPreferenceRequestDto;
import com.whiskeep.api.member.dto.FamiliarPreferenceRequestDto;
import com.whiskeep.api.member.dto.MemberScoreResponseDto;
import com.whiskeep.api.member.service.MemberService;
import com.whiskeep.api.member.service.PreferenceService;
import com.whiskeep.common.auth.annotation.Auth;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/members")
public class PreferenceController {

	private final PreferenceService preferenceService;
	private final MemberService memberService;

	@PostMapping("/preference/beginner")
	public ResponseEntity<?> createPreferenceForBeginner(
		@RequestBody BeginnerPreferenceRequestDto beginnerPreferenceRequestDto, @Auth Long memberId) {
		preferenceService.createBeginnerPreferenceScore(beginnerPreferenceRequestDto, memberId);
		return new ResponseEntity<>(HttpStatus.CREATED);
	}

	@PostMapping("/preference/familiar")
	public ResponseEntity<?> createPreferenceForFamiliar(
		@RequestBody FamiliarPreferenceRequestDto familiarPreferenceRequestDto, @Auth Long memberId) {
		preferenceService.createFamiliarPreferenceScore(familiarPreferenceRequestDto, memberId);
		return new ResponseEntity<>(HttpStatus.CREATED);
	}

	@GetMapping("/score")
	public ResponseEntity<?> getPreferenceScore(@Auth Long memberId) {
		MemberScoreResponseDto memberScore = preferenceService.getMemberPreferenceScore(memberId);
		return ResponseEntity.ok(memberScore);
	}

}
