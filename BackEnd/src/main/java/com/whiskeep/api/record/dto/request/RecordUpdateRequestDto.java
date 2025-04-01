package com.whiskeep.api.record.dto.request;

public record RecordUpdateRequestDto(
	String content,
	Integer rating,
	Boolean isPublic,
	String recordImg
) {
}
