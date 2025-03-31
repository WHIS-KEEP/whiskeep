package com.whiskeep.api.oauth.dto;

import com.whiskeep.api.member.dto.MemberResponseDto;

public record LoginResponseDto(
	String accessToken,
	MemberResponseDto member
) { }
