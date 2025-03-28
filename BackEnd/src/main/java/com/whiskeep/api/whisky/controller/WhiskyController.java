package com.whiskeep.api.whisky.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.whiskeep.api.whisky.dto.WhiskyDetailResponseDto;
import com.whiskeep.api.whisky.service.WhiskyService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/whiskies")
@RequiredArgsConstructor
public class WhiskyController {

	private final WhiskyService whiskyService;

	@GetMapping("/{whiskyId}")
	public ResponseEntity<WhiskyDetailResponseDto> getWhisky(@PathVariable Long whiskyId) {
		WhiskyDetailResponseDto whiskyDetail = whiskyService.getWhiskyById(whiskyId);

		return ResponseEntity.ok(whiskyDetail);
	}
}
