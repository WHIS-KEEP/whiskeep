package com.whiskeep.common.enumclass;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import lombok.Getter;

@Getter
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

	private static final Map<String, WhiskyType> LOOKUP_MAP = new HashMap<>();

	static {
		for (WhiskyType type : values()) {
			for (String val : type.dbValues) {
				LOOKUP_MAP.put(val.trim().toLowerCase(), type);
			}
		}
	}

	WhiskyType(List<String> dbValues) {
		this.dbValues = dbValues;
	}

	// DB 문자열을 받아 소문자와 trim 적용 후 매핑된 enum 반환, 없으면 OTHER
	public static WhiskyType fromDbValue(String dbValue) {
		if (dbValue == null) {
			return OTHER;
		}
		return LOOKUP_MAP.getOrDefault(dbValue.trim().toLowerCase(), OTHER);
	}
}
