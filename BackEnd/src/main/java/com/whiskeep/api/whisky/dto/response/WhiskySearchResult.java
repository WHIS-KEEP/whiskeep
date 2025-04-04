package com.whiskeep.api.whisky.dto.response;


public record WhiskySearchResult(
	Long whiskyId,
	String enName,
	String koName,
	String type,
	Integer age,
	Double avgRating,
	Integer recordCounts,
	String whiskyImg
) {
}
