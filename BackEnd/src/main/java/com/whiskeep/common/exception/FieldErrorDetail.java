package com.whiskeep.common.exception;

import org.springframework.validation.FieldError;

import lombok.Builder;

@Builder
public record FieldErrorDetail(
	String field,
	String message
) {
	public static FieldErrorDetail of(final FieldError fieldError) {
		return com.whiskeep.common.exception.FieldErrorDetail.builder()
			.field(fieldError.getField())
			.message(fieldError.getDefaultMessage())
			.build();
	}
}
