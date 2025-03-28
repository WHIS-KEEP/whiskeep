package com.whiskeep.common.exception;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class FailResponse {

	private int status;
	private String messege;

	public static FailResponse fail(int status, String messege) {
		return FailResponse.builder()
			.status(status)
			.messege(messege)
			.build();
	}
}
