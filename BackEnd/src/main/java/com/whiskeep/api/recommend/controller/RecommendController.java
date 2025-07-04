package com.whiskeep.api.recommend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.whiskeep.api.recommend.dto.RecommendedListResponseDto;
import com.whiskeep.api.recommend.service.RecommendService;
import com.whiskeep.common.auth.annotation.Auth;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/recommends")
@RequiredArgsConstructor
public class RecommendController {

	private final RecommendService recommendService;

	@GetMapping //추천 가져오기
	public ResponseEntity<RecommendedListResponseDto> recommend(@Auth Long memberId) {

		RecommendedListResponseDto recommendations = recommendService.recommend(memberId);
		return ResponseEntity.ok(recommendations);
	}
}
