package com.whiskeep.api.whisky.dto.response;

import java.util.List;

public record WhiskySearchResponseDto(
	List<WhiskySearchResult> whiskies,
	List<Object> nextSearchAfter,
	boolean hasNext
) {
}
