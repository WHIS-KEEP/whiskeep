package com.whiskeep.api.whiskylike.dto;

public record LikeUpdateResponseDto(
	Long whiskyId,
	boolean liked
) {
}
