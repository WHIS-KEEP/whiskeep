package com.whiskeep.api.record.dto.response;

import java.util.List;

public record MyRecordResponseDto(
	Long whiskyId,
	String whiskyImg,
	String whiskyKoName,
	String whiskyEnName,
	List<RecordSummaryDto> recordList
) {
	public record RecordSummaryDto(
		Long recordId,
		String recordImg
	) {
	}
}
