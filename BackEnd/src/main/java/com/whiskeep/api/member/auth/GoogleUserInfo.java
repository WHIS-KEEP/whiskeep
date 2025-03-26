package com.whiskeep.api.member.auth;

import java.util.Map;

import com.whiskeep.common.enumclass.Provider;

public class GoogleUserInfo implements OAuth2UserInfo {

	private final Map<String, Object> attributes;

	public GoogleUserInfo(Map<String, Object> attributes) {
		this.attributes = attributes;
	}

	@Override
	public String getEmail() {
		return (String) attributes.get("email");
	}

	@Override
	public String getName() {
		return (String) attributes.get("name");
	}

	@Override
	public String getProfileImg() {
		return (String) attributes.get("picture");
	}

	@Override
	public Provider getProvider() {
		return Provider.GOOGLE;
	}

	@Override
	public String getProviderId() {
		return Provider.GOOGLE.name() + "_" + attributes.get("sub");
	}
}
