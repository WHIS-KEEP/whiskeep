package com.whiskeep.api.recommend.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class RecommendResponseDto {

	private Long whiskyId;
	private String koName;
	private String whiskyImg;
	private Double avg;
}
