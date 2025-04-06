package com.whiskeep.api.oauth.dto;

public record OAuthProviderTokenConfig(
	String provider,
	String clientId,
	String clientSecret,
	String redirectUri,
	String tokenUri
) { }
