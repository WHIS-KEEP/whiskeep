package com.whiskeep.api.whiskylike.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.whiskeep.api.whiskylike.dto.LikeListResponseDto;
import com.whiskeep.api.whiskylike.dto.LikeUpdateResponseDto;
import com.whiskeep.api.whiskylike.service.WhiskyLikeService;
import com.whiskeep.common.auth.annotation.Auth;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class WhiskyLikeController {

	private final WhiskyLikeService whiskyLikeService;

	@PostMapping("/{whiskyId}/likes")
	public ResponseEntity<LikeUpdateResponseDto> likeWhisky(@PathVariable Long whiskyId, @Auth Long memberId) {
		return ResponseEntity.ok(whiskyLikeService.likeWhisky(whiskyId, memberId));
	}

	@DeleteMapping("/{whiskyId}/likes")
	public ResponseEntity<LikeUpdateResponseDto> unlikeWhisky(@PathVariable Long whiskyId, @Auth Long memberId) {
		return ResponseEntity.ok(whiskyLikeService.unlikeWhisky(whiskyId, memberId));
	}

	@GetMapping("/likes")
	public ResponseEntity<LikeListResponseDto> getLikedWhiskies(@Auth Long memberId) {
		return ResponseEntity.ok(whiskyLikeService.getLikedWhiskies(memberId));
	}
}
