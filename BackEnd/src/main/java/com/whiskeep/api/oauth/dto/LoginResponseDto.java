package com.whiskeep.api.oauth.dto;

import com.whiskeep.api.oauth.LoginUserDto;

public record LoginResponseDto(
	String accessToken,
	LoginUserDto member
) { }
