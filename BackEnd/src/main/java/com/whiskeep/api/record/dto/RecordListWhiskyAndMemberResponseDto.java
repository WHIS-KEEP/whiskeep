package com.whiskeep.api.record.dto;

import java.util.List;

public record RecordListWhiskyAndMemberResponseDto(
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
