package com.whiskeep.api.whisky.dto.response;

import com.whiskeep.api.whisky.document.WhiskyDocument;

public record WhiskySearchResult(
	Long whiskyId,
	String enName,
	String koName,
	String type,
	Double abv,
	Integer age,
	Double avgRating,
	Integer recordCounts,
	String whiskyImg
) {
	public static WhiskySearchResult of(WhiskyDocument doc) {
		return new WhiskySearchResult(
			doc.getWhiskyId(),
			doc.getEnName(),
			doc.getKoName(),
			doc.getType(),
			doc.getAbv(),
			doc.getAge(),
			doc.getAvgRating(),
			doc.getRecordCounts(),
			doc.getWhiskyImg()
		);
	}
}
