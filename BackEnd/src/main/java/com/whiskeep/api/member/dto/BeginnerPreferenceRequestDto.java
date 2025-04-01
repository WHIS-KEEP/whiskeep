package com.whiskeep.api.member.dto;

import java.util.List;

import com.whiskeep.common.enumclass.Experience;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record BeginnerPreferenceRequestDto(
	@NotNull(message = "초보자 초기 설문 정보가 들어오지 않았습니다.")
	Long memberId,
	Experience experience,
	List<Double> preferenceOrder,
	TastingScoreRequest tastingScore) {

	public record TastingScoreRequest(
		@NotNull @Min(1) @Max(5)
		Integer fruity,

		@NotNull @Min(1) @Max(5)
		Integer sweet,

		@NotNull @Min(1) @Max(5)
		Integer spicy,

		@NotNull @Min(1) @Max(5)
		Integer oaky,

		@NotNull @Min(1) @Max(5)
		Integer herbal,

		@NotNull @Min(1) @Max(5)
		Integer briny
	) {
	}
}
