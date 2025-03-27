package com.whiskeep.api.recommend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.whiskeep.api.recommend.dto.RecommendResponseDto;
import com.whiskeep.api.recommend.dto.RecommendedListResponseDto;
import com.whiskeep.api.recommend.service.RecommendService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/recommends")
@RequiredArgsConstructor
public class RecommendController {

	private final RecommendService recommendService;

	@GetMapping //추천가져오기
	public ResponseEntity<RecommendedListResponseDto> recommend() {

		RecommendedListResponseDto recommendations = recommendService.recommend();
		return ResponseEntity.ok(recommendations);
	}
}
