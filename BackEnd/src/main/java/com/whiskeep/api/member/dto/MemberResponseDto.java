package com.whiskeep.api.member.dto;

public record MemberResponseDto(
	Long memberId,
	String email,
	String name,
	String nickname,
	String profileImg,
	String provider
) {
}

