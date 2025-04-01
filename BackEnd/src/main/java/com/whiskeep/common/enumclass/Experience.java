package com.whiskeep.common.enumclass;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum Experience {
	BEGINNER,
	FAMILIAR;

	@JsonCreator
	public static Experience from(String value) {
		return Experience.valueOf(value.toUpperCase());
	}
}
