package com.whiskeep.api.member.auth;

import java.util.Map;
import com.whiskeep.common.enumclass.Provider;

public class KakaoUserInfo implements OAuth2UserInfo {

	private Map<String, Object> attributes;

	public KakaoUserInfo(Map<String, Object> attributes) {
		this.attributes = attributes;
	}

	@Override
	public String getEmail() {
		Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
		return (kakaoAccount != null) ? (String) kakaoAccount.get("email") : null;
	}

	@Override
	public String getName() {
		Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
		if (kakaoAccount != null) {
			Map<String, Object> profile = (Map<String, Object>) kakaoAccount.get("profile");
			return (profile != null) ? (String) profile.get("nickname") : null;
		}
		return null;
	}

	@Override
	public String getProfileImg() {
		Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
		if (kakaoAccount != null) {
			Map<String, Object> profile = (Map<String, Object>) kakaoAccount.get("profile");
			return (profile != null) ? (String) profile.get("profile_image_url") : null;
		}
		return null;
	}

	@Override
	public Provider getProvider() {
		return Provider.KAKAO;
	}

	@Override
	public String getProviderId() {
		return Provider.KAKAO.name() + "_" + attributes.get("id").toString();
	}
}
