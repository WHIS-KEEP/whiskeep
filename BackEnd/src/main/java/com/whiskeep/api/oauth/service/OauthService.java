package com.whiskeep.api.oauth.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import com.whiskeep.api.member.domain.Member;
import com.whiskeep.api.member.dto.MemberResponseDto;
import com.whiskeep.api.member.repository.MemberRepository;
import com.whiskeep.api.member.service.MemberService;
import com.whiskeep.api.oauth.dto.LoginRequestDto;
import com.whiskeep.api.oauth.dto.OAuthProviderInfo;
import com.whiskeep.api.oauth.dto.OAuthProviderTokenConfig;
import com.whiskeep.api.oauth.dto.OAuthTokenResponseDto;
import com.whiskeep.api.oauth.dto.OAuthUserInfo;
import com.whiskeep.api.oauth.dto.OAuthUserInfoConfig;
import com.whiskeep.api.oauth.dto.google.GoogleUserResponseDto;
import com.whiskeep.api.oauth.dto.kakao.KakaoUserResponseDto;
import com.whiskeep.common.auth.jwt.JwtTokenProvider;
import com.whiskeep.common.enumclass.Provider;
import com.whiskeep.common.exception.BadRequestException;
import com.whiskeep.common.exception.ErrorMessage;
import com.whiskeep.common.exception.InternalServerException;
import com.whiskeep.common.util.NicknameGenerator;
import com.whiskeep.common.util.RedisUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OauthService {

	private final MemberRepository memberRepository;
	private final JwtTokenProvider jwtTokenProvider;
	private final NicknameGenerator nicknameGenerator;
	private final MemberService memberService;
	private final RedisUtil redisUtil;

	private static final String RESPONSE_TYPE = "code";

	// GOOGLE 관련 변수
	@Value("${spring.security.oauth2.client.provider.google.authorization-uri}")
	String googleAuthorizationUri;
	@Value("${spring.security.oauth2.client.registration.google.client-id}")
	String googleClientId;
	@Value("${spring.security.oauth2.client.registration.google.redirect-uri}")
	String googleRedirectUri;
	@Value("${spring.security.oauth2.client.provider.google.token-uri}")
	String googleTokenUri;
	@Value("${spring.security.oauth2.client.registration.google.client-secret}")
	private String googleClientSecret;
	@Value("${spring.security.oauth2.client.provider.google.user-info-uri}")
	String googleUserInfoUri;

	// KAKAO 관련 변수
	@Value("${spring.security.oauth2.client.provider.kakao.authorization-uri}")
	String kakaoAuthorizationUri;
	@Value("${spring.security.oauth2.client.registration.kakao.client-id}")
	String kakaoClientId;
	@Value("${spring.security.oauth2.client.registration.kakao.redirect-uri}")
	String kakaoRedirectUri;
	@Value("${spring.security.oauth2.client.provider.kakao.token-uri}")
	String kakaoTokenUri;
	@Value("${spring.security.oauth2.client.registration.kakao.client-secret}")
	private String kakaoClientSecret;
	@Value("${spring.security.oauth2.client.provider.kakao.user-info-uri}")
	String kakaoUserInfoUri;

	// provider별 로그인 URL 생성 정보
	private OAuthProviderInfo getProviderInfo(String provider) {
		return switch (provider) {
			case "google" -> new OAuthProviderInfo(googleAuthorizationUri, googleClientId, googleRedirectUri);
			case "kakao" -> new OAuthProviderInfo(kakaoAuthorizationUri, kakaoClientId, kakaoRedirectUri);
			default -> throw new BadRequestException(ErrorMessage.UNSUPPORTED_PROVIDER);
		};
	}

	// provider별 token 요청 설정
	private OAuthProviderTokenConfig getTokenConfig(String provider) {
		return switch (provider) {
			case "google" -> new OAuthProviderTokenConfig(
				provider, googleClientId, googleClientSecret, googleRedirectUri, googleTokenUri
			);
			case "kakao" -> new OAuthProviderTokenConfig(
				provider, kakaoClientId, kakaoClientSecret, kakaoRedirectUri, kakaoTokenUri
			);
			default -> throw new BadRequestException(ErrorMessage.UNSUPPORTED_PROVIDER);
		};
	}

	// provider별 userInfo DTO
	private OAuthUserInfoConfig getUserInfoConfig(String provider) {
		return switch (provider.toLowerCase()) {
			case "google" -> new OAuthUserInfoConfig(googleUserInfoUri, GoogleUserResponseDto.class);
			case "kakao" -> new OAuthUserInfoConfig(kakaoUserInfoUri, KakaoUserResponseDto.class);
			default -> throw new BadRequestException(ErrorMessage.UNSUPPORTED_PROVIDER);
		};
	}


	public String getLoginUrl(String provider) {
		OAuthProviderInfo providerInfo = getProviderInfo(provider);
		StringBuilder loginUrl = new StringBuilder();

		loginUrl.append(providerInfo.authorizationUri())
				.append("?client_id=").append(providerInfo.clientId())
				.append("&redirect_uri=").append(providerInfo.redirectUri())
				.append("&response_type=").append(RESPONSE_TYPE);

		if ("google".equals(provider)) {
			loginUrl.append("&scope=email%20profile");
		}

		return loginUrl.toString();
	}

	// ✅ 1️⃣ 인증 코드로 Access Token 요청
	public OAuthTokenResponseDto getAccessTokenFromCode(LoginRequestDto request) {
		OAuthProviderTokenConfig config = getTokenConfig(request.provider());

		String tokenRequestUrl = config.tokenUri()
			+ "?client_id=" + config.clientId()
			+ "&client_secret=" + config.clientSecret()
			+ "&code=" + request.code()
			+ "&grant_type=authorization_code"
			+ "&redirect_uri=" + config.redirectUri();

		// RestTemplate: HTTP 요청 보내는 클라이언트
		RestTemplate restTemplate = new RestTemplate();
		return restTemplate.postForObject(tokenRequestUrl, null,
			OAuthTokenResponseDto.class);
	}

	// ✅ 2️⃣ Access Token으로 사용자 정보 가져오기
	@Transactional
	public MemberResponseDto getUserInfoFromToken(String provider, OAuthTokenResponseDto token) {
		RestTemplate restTemplate = new RestTemplate();
		OAuthUserInfoConfig config = getUserInfoConfig(provider);

		OAuthUserInfo userInfo = restTemplate.getForObject(
			config.userInfoUri() + "?access_token=" + token.accessToken(),
			config.responseType()
		);

		// ✅ DB에서 사용자 확인 (없으면 새로 저장)
		String providerId = provider.toUpperCase() + "_" + userInfo.id();
		Optional<Member> existingMember = memberRepository.findByProviderId(providerId);
		if (existingMember.isPresent()) {
			return new MemberResponseDto(
				existingMember.get().getMemberId(),
				existingMember.get().getEmail(),
				existingMember.get().getName(),
				existingMember.get().getNickname(),
				existingMember.get().getProfileImg(),
				existingMember.get().getProvider().name()
			);
		} else {
			Member newMember = Member.builder()
				.email(userInfo.email())
				.name(userInfo.name())
				.nickname(generateUniqueNickname())
				.provider(Provider.valueOf(provider.toUpperCase()))
				.providerId(providerId)
				.build();
			memberRepository.save(newMember);

			return new MemberResponseDto(
				newMember.getMemberId(),
				newMember.getEmail(),
				newMember.getName(),
				newMember.getNickname(),
				newMember.getProfileImg(),
				newMember.getProvider().name()
			);
		}
	}

	public String createJwtToken(Long memberId) {
		return jwtTokenProvider.createToken(memberId);
	}

	private String generateUniqueNickname() {
		String nickname;
		int attempt = 0;
		int maxAttempts = 10;

		do {
			nickname = nicknameGenerator.generateNickname();
			attempt++;
		} while (!memberService.isNicknameAvailable(nickname) && attempt < maxAttempts);

		if (attempt == maxAttempts) {
			throw new InternalServerException(ErrorMessage.NICKNAME_GENERATION_FAILED);
		}

		return nickname;
	}

	public void logout(String accessToken) {
		if (!jwtTokenProvider.validateToken(accessToken)) {
			return;
		}

		long expiration = jwtTokenProvider.getExpiration(accessToken);
		redisUtil.saveBlackListToken(accessToken, expiration);
	}
}
