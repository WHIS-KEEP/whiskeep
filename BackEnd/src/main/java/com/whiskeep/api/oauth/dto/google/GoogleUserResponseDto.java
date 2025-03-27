package com.whiskeep.api.oauth.dto.google;

import com.fasterxml.jackson.annotation.JsonProperty;

public record GoogleUserResponseDto(
	@JsonProperty("id") String id, // Google 사용자 oAuth 고유 id
	@JsonProperty("email") String email,
	@JsonProperty("verified_email") Boolean verifiedEmail,
	@JsonProperty("name") String name, // 전체 이름
	@JsonProperty("given_name") String givenName, // 이름
	@JsonProperty("family_name") String familyName, // 성
	@JsonProperty("picture") String picture,
	@JsonProperty("hd") String hd // 이메일에서 @ 뒷 부분
) { }
