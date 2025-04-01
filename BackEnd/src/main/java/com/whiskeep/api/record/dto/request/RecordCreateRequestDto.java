package com.whiskeep.api.record.dto.request;

public record RecordCreateRequestDto(
	long whiskyId,
	int rating,
	String content,
	String recordImg,
	boolean isPublic
) {
}
