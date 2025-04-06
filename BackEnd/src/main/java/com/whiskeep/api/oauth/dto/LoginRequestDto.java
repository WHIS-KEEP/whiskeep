package com.whiskeep.api.oauth.dto;

public record LoginRequestDto(
	String provider,
	String code
) { }
