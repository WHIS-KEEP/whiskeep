package com.whiskeep.api.record.dto;

public record RecordUpdateRequestDto(
	String content,
	Integer rating,
	Boolean isPublic,
	String recordImg
) {
}
