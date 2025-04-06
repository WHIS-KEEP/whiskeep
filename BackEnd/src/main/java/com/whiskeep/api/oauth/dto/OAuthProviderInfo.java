package com.whiskeep.api.oauth.dto;

public record OAuthProviderInfo(
	String authorizationUri,
	String clientId,
	String redirectUri
) { }
