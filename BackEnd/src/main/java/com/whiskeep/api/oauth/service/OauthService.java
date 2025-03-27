package com.whiskeep.api.oauth.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.whiskeep.api.member.domain.Member;
import com.whiskeep.api.member.dto.MemberResponseDto;
import com.whiskeep.api.member.repository.MemberRepository;
import com.whiskeep.api.oauth.dto.google.GoogleTokenDto;
import com.whiskeep.api.oauth.dto.google.GoogleUserResponseDto;
import com.whiskeep.common.enumclass.Provider;
import com.whiskeep.common.util.JwtTokenProvider;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OauthService {

	private final MemberRepository memberRepository;
	private final JwtTokenProvider jwtTokenProvider;

	// GOOGLE 관련 변수
	String googleLoginUrl = "https://accounts.google.com/o/oauth2/auth";
	@Value("${spring.security.oauth2.client.registration.google.client-id}")
	String googleClientId;
	@Value("${spring.security.oauth2.client.registration.google.client-secret}")
	private String googleClientSecret;
	@Value("${spring.security.oauth2.client.registration.google.redirect-uri}")
	String googleRedirectUri;

	public String getLoginUrl(String provider) {
		StringBuilder loginUrl = new StringBuilder();

		if ("google".equals(provider)) {
			loginUrl.append(googleLoginUrl)
				.append("?client_id=").append(googleClientId)
				.append("&redirect_uri=").append(googleRedirectUri)
				.append("&response_type=code")
				.append("&scope=email%20profile");
		}

		return loginUrl.toString();
	}

	// ✅ 1️⃣ 인증 코드로 Access Token 요청
	public GoogleTokenDto getAccessTokenFromCode(String code) {
		String tokenRequestUrl = null;

		// 구글 Access Token 요청
		tokenRequestUrl = "https://oauth2.googleapis.com/token"
			+ "?client_id=" + googleClientId
			+ "&client_secret=" + googleClientSecret
			+ "&code=" + code
			+ "&grant_type=authorization_code"
			+ "&redirect_uri=" + googleRedirectUri;

		// RestTemplate: HTTP 요청 보내는 클라이언트
		RestTemplate restTemplate = new RestTemplate();
		return restTemplate.postForObject(tokenRequestUrl, null, GoogleTokenDto.class);
	}

	// ✅ 2️⃣ Access Token으로 사용자 정보 가져오기
	public MemberResponseDto getUserInfoFromToken(GoogleTokenDto token) {
		String userInfoUrl = "https://www.googleapis.com/oauth2/v2/userinfo";

		RestTemplate restTemplate = new RestTemplate();
		GoogleUserResponseDto googleUserInfo = restTemplate.getForObject(userInfoUrl + "?access_token="
			+ token.getAccessToken(), GoogleUserResponseDto.class);

		// ✅ DB에서 사용자 확인 (없으면 새로 저장)
		String providerId = Provider.GOOGLE.name() + "_" + googleUserInfo.getId();
		Optional<Member> existingMember = memberRepository.findByProviderId(providerId);
		if (existingMember.isPresent()) {
			return new MemberResponseDto(
				existingMember.get().getEmail(),
				existingMember.get().getName(),
				existingMember.get().getNickname(),
				existingMember.get().getProfileImg(),
				existingMember.get().getProvider().name()
			);

		} else {
			Member newMember = Member.builder()
				.email(googleUserInfo.getEmail())
				.name(googleUserInfo.getName())
				.nickname(generateUniqueNickname(googleUserInfo.getName()))
				.provider(Provider.GOOGLE)
				.providerId(providerId)
				.build();
			memberRepository.save(newMember);

			return new MemberResponseDto(
				newMember.getEmail(),
				newMember.getName(),
				newMember.getNickname(),
				newMember.getProfileImg(),
				newMember.getProvider().name()
			);
		}
	}

	public String createJwtToken(String nickName) {
		return jwtTokenProvider.createToken(nickName);
	}

	private String generateUniqueNickname(String name) {
		return name + "_" + System.currentTimeMillis(); // 예: "John_171515151515"
	}
}
