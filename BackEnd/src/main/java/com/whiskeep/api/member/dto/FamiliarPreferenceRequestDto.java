package com.whiskeep.api.member.dto;

import java.util.List;

import com.whiskeep.common.enumclass.Experience;

import jakarta.validation.constraints.NotNull;

public record FamiliarPreferenceRequestDto(
	@NotNull(message = "숙련자 초기 설문 정보가 들어오지 않았습니다.")
	Experience experience,
	List<Long> likedWhiskies
) {
}
