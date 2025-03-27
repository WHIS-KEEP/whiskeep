package com.whiskeep.api.member.dto;

import java.util.List;
import java.util.Map;

import com.whiskeep.common.enumclass.Experience;
import jakarta.validation.constraints.NotNull;

public record BeginnerPreferenceRequestDto (
	@NotNull(message = "초보자 초기 설문 정보가 들어오지 않았습니다.")
	Long memberId,
	Experience experience,
	List<Double> preferenceOrder,
	Map<String, Integer> tastingScore){

}
