package com.whiskeep.api.member.auth;

import com.whiskeep.common.enumclass.Provider;

// OAuth 사용자 정보 공통 인터페이스
public interface OAuth2UserInfo {

	String getEmail();

	String getName();

	String getProfileImg();

	Provider getProvider();

	String getProviderId();
}
