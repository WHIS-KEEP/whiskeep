package com.whiskeep.api.record.dto;

public record RecordCreateDto(
	long memberId,
	long whiskyId,
	int rating,
	String content,
	String recordImg,
	boolean isPublic
) {
}
