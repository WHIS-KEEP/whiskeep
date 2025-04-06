package com.whiskeep.api.whiskylike.dto;

import java.util.List;

public record LikeListResponseDto(
	List<LikeResponseDto> whiskies
) {
}
