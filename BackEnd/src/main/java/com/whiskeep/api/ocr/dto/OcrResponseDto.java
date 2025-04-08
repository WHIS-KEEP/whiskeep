package com.whiskeep.api.ocr.dto;

import java.util.List;

import com.whiskeep.api.whisky.dto.response.WhiskySearchResult;

public record OcrResponseDto(
	List<Long> sameWhiskyIds,
	List<WhiskySearchResult> whiskies
) { }
