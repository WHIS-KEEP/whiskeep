package com.whiskeep.api.recommend.dto;

import java.util.List;

import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@Builder
public class RecommendedListResponseDto {

	private List<RecommendResponseDto> recommendList;
}
