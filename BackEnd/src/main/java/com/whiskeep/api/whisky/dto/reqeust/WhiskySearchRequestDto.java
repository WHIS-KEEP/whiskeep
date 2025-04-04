package com.whiskeep.api.whisky.dto.reqeust;

import java.util.List;

public record WhiskySearchRequestDto(
	String keyword,
	int pageSize,
	List<Object> searchAfter,
	String sortField,
	boolean desc,
	Integer age,
	String type
) {
}
