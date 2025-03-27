package com.whiskeep.api.oauth.dto.google;

import com.fasterxml.jackson.annotation.JsonProperty;

public record GoogleTokenDto(
	@JsonProperty("access_token") String accessToken,
	@JsonProperty("expires_in") Integer expiresIn,
	@JsonProperty("scope") String scope,
	@JsonProperty("token_type") String tokenType,
	@JsonProperty("id_token") String idToken
) { }
