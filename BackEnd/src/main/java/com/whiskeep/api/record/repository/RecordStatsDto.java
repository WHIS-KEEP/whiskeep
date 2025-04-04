package com.whiskeep.api.record.repository;

import lombok.Builder;

@Builder
public record RecordStatsDto(
	Double ratingAvg,
	Integer recordCnt
) {
	public static RecordStatsDto of(Double ratingAvg, Integer recordCnt) {
		return RecordStatsDto.builder()
			.ratingAvg(ratingAvg)
			.recordCnt(recordCnt)
			.build();
	}
}
