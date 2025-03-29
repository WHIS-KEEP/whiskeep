package com.whiskeep.api.whisky.dto;

import java.util.List;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class WhiskyDetailResponseDto {

	private Long whiskyId;
	private String whiskyImg;
	private String koName;
	private String enName;
	private String distillery;
	private String country;
	private Double abv;
	private String type;
	private String description;

	private TastingNotesDto tastingNotes;

	// private TastingProfile<Map<String, Double>> nosing;
	// private TastingProfile<Map<String, Double>> tasting;
	// private TastingProfile<Map<String, Double>> finish;


	private RecordInfo recordInfo;

	@Getter
	@Builder
	public static class TastingNotesDto {
		private List<String> nosing;
		private List<String> tasting;
		private List<String> finish;
	}

	@Getter
	@Builder
	public static class RecordInfo {
		private Double ratingAvg;
		private Integer recordCnt;
	}
}
