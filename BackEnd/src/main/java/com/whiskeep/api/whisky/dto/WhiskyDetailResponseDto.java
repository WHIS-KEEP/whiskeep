package com.whiskeep.api.whisky.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class WhiskyDetailResponseDto {

	private String whiskyImg;
	private String koName;
	private String enName;
	private String distillery;
	private String country;
	private Double abv;
	private String type;

	private String nosing;
	private String tasting;
	private String finish;
	// private TastingProfile<Map<String, Double>> nosing;
	// private TastingProfile<Map<String, Double>> tasting;
	// private TastingProfile<Map<String, Double>> finish;

	private String description;
}
