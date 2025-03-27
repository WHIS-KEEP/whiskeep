package com.whiskeep.api.member.dto.google;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@ToString
@NoArgsConstructor
public class GoogleUserResponseDto {
	@JsonProperty("id")
	private String id; // Google 사용자 oAuth 고유 id

	@JsonProperty("email")
	private String email;

	@JsonProperty("verified_email")
	private Boolean verifiedEmail;

	@JsonProperty("name")
	private String name; // 전체 이름

	@JsonProperty("given_name")
	private String givenName; // 이름

	@JsonProperty("family_name")
	private String familyName; // 성

	@JsonProperty("picture")
	private String picture;

	@JsonProperty("hd")
	private String hd; // 이메일에서 @ 뒷 부분
}
