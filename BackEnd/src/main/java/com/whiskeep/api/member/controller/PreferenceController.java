package com.whiskeep.api.member.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.whiskeep.api.member.domain.Member;
import com.whiskeep.api.member.dto.BeginnerPreferenceRequestDto;
import com.whiskeep.api.member.dto.FamiliarPreferenceRequestDto;
import com.whiskeep.api.member.service.PreferenceService;
import com.whiskeep.common.annotation.Auth;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/members")
public class PreferenceController {

	private final PreferenceService preferenceService;

	@PostMapping("/preference/beginner")
	public ResponseEntity<?> createPreferenceForBeginner(
		@RequestBody BeginnerPreferenceRequestDto beginnerPreferenceRequestDto, @Auth Member member) {
		preferenceService.createBeginnerPreferenceScore(beginnerPreferenceRequestDto, member);
		return new ResponseEntity<>(HttpStatus.CREATED);
	}

	@PostMapping("/preference/familiar")
	public ResponseEntity<?> createPreferenceForFamiliar(
		@RequestBody FamiliarPreferenceRequestDto familiarPreferenceRequestDto) {
		preferenceService.createFamiliarPreferenceScore(familiarPreferenceRequestDto);
		return new ResponseEntity<>(HttpStatus.CREATED);
	}
}
