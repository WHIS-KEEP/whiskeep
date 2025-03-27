package com.whiskeep.api.member.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MemberResponseDto {
	private String email;
	private String name;
	private String nickname;
	private String profileImg;
	private String provider;
}

