package com.whiskeep.api.oauth.dto;

public record LoginResponseDto(
	String accessToken,
	LoginUserDto member
) { }
