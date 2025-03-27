package com.whiskeep.api.recommend.dto;

import java.util.List;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class RatingResponseDto {
	private List<RatingDto> ratings;
}
