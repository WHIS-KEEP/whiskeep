package com.whiskeep.api.oauth.dto.kakao;

import java.util.Date;
import java.util.HashMap;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.whiskeep.api.oauth.dto.OAuthUserInfo;

public record KakaoUserResponseDto(
	@JsonProperty("id") Long kakaoId, // Kakao 사용자 oAuth 고유 id
	@JsonProperty("has_signed_up") Boolean hasSignedUp, // 자동연결설정 비활성화 한 경우 존재
	@JsonProperty("connected_at") Date connectedAt, // 서비스에 연결 완료된 시각 (UTC)
	@JsonProperty("synched_at") Date synchedAt, // 카카오 간편가입을 통해 로그인한 시각
	@JsonProperty("properties") HashMap<String, String> properties, // 사용자 프로퍼티
	@JsonProperty("kakao_account") KakaoAccount kakaoAccount,
	@JsonProperty("for_partner") Partner partner
) implements OAuthUserInfo {
	@Override
	public String id() {
		return String.valueOf(kakaoId);
	}

	@Override
	public String email() {
		return kakaoAccount.email();
	}

	@Override
	public String name() {
		return kakaoAccount.profile.nickName();
	}

	@Override
	public String profileImg() {
		return kakaoAccount.profile.profileImageUrl();
	}

	@JsonIgnoreProperties(ignoreUnknown = true)
	public record KakaoAccount(
		@JsonProperty("profile_needs_agreement") Boolean isProfileAgree,
		@JsonProperty("profile_nickname_needs_agreement") Boolean isNickNameAgree,
		@JsonProperty("profile_image_needs_agreement") Boolean isProfileImageAgree,
		@JsonProperty("profile") Profile profile,
		@JsonProperty("name_needs_agreement") Boolean isNameAgree,
		@JsonProperty("name") String name,
		@JsonProperty("email_needs_agreement") Boolean isEmailAgree,
		@JsonProperty("is_email_valid") Boolean isEmailValid,
		@JsonProperty("is_email_verified") Boolean isEmailVerified,
		@JsonProperty("email") String email,
		@JsonProperty("age_range_needs_agreement") Boolean isAgeAgree,
		@JsonProperty("age_range") String ageRange,
		@JsonProperty("birthyear_needs_agreement") Boolean isBirthYearAgree,
		@JsonProperty("birthyear") String birthYear,
		@JsonProperty("birthday_needs_agreement") Boolean isBirthDayAgree,
		@JsonProperty("birthday") String birthDay,
		@JsonProperty("birthday_type") String birthDayType,
		@JsonProperty("is_leap_month") Boolean isLeapMonth,
		@JsonProperty("gender_needs_agreement") Boolean isGenderAgree,
		@JsonProperty("gender") String gender,
		@JsonProperty("phone_number_needs_agreement") Boolean isPhoneNumberAgree,
		@JsonProperty("phone_number") String phoneNumber,
		@JsonProperty("ci_needs_agreement") Boolean isCiAgree,
		@JsonProperty("ci") String ci,
		@JsonProperty("ci_authenticated_at") Date ciCreatedAt
	) {
		@JsonIgnoreProperties(ignoreUnknown = true)
		public record Profile(
			@JsonProperty("nickname") String nickName,
			@JsonProperty("thumbnail_image_url") String thumbnailImageUrl,
			@JsonProperty("profile_image_url") String profileImageUrl,
			@JsonProperty("is_default_image") String isDefaultImage,
			@JsonProperty("is_default_nickname") Boolean isDefaultNickName
		) { }
	}
	@JsonIgnoreProperties(ignoreUnknown = true)
	public record Partner(
		@JsonProperty("uuid") String uuid
	) { }
}
