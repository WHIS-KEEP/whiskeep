package com.whiskeep.common.enumclass;

import java.util.Arrays;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum AgeRange {

	UNDER_10(10, null, 10),
	BETWEEN_11_12(12, 11, 12),
	BETWEEN_13_15(15, 13, 15),
	BETWEEN_16_18(18, 16, 18),
	OVER_19(19, 19, null);

	final int key;
	final Integer lower;
	final Integer upper;

	public static AgeRange from(int age) {
		return Arrays.stream(values())
			.filter(r -> r.key == age)
			.findFirst()
			.orElse(null);
	}
}
