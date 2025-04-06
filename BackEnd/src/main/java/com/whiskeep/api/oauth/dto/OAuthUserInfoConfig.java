package com.whiskeep.api.oauth.dto;

public record OAuthUserInfoConfig(
	String userInfoUri,
	Class<? extends OAuthUserInfo> responseType
) { }
