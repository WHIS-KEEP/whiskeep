package com.whiskeep.api.member.dto;

import com.whiskeep.api.member.domain.Member;

public record MemberResponseDto(
	Long memberId,
	String email,
	String name,
	String nickname,
	String profileImg,
	String provider
) {
	public static MemberResponseDto from(Member member) {
		return new MemberResponseDto(
			member.getMemberId(),
			member.getEmail(),
			member.getName(),
			member.getNickname(),
			member.getProfileImg(),
			member.getProvider().name()
		);
	}
}

