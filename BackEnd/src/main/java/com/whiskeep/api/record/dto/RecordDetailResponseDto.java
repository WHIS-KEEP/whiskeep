package com.whiskeep.api.record.dto;

import java.time.LocalDateTime;

public record RecordDetailResponseDto(
	String recordImg,
	Integer rating,
	String content,
	LocalDateTime createdAt
	) {
}
