package com.whiskeep.common.enumclass;

import java.util.Arrays;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum WhiskyType {

	SINGLE_MALT(Arrays.asList("Single Malt Whisky", "Single Malt Whiskey")),
	BLENDED(Arrays.asList("Blended Whisky", "Blended Whiskey", "Blended Malt Whisky")),
	BOURBON(Arrays.asList("Kentucky Straight Bourbon", "Straight Bourbon", "Bourbon")),
	TENNESSEE(List.of("Tennessee Whiskey")),
	RYE(Arrays.asList("Straight Rye", "Kentucky Straight Rye", "Rye")),
	GIN(Arrays.asList("Dry Gin", "Gin")),
	SINGLE_GRAIN(Arrays.asList("Single Grain Whisky", "Single Grain Whiskey", "Grain Whiskey")),
	LIQUEUR(List.of("Likör")),
	OTHER(Arrays.asList("Whisky", "Whiskey", "other"));

	private final List<String> dbValues;

	public static WhiskyType fromName(String name) {
		if (name == null) {
			return OTHER;
		}
		try {
			return WhiskyType.valueOf(name.trim().toUpperCase());
		} catch (IllegalArgumentException e) {
			return OTHER;
		}
	}
}
