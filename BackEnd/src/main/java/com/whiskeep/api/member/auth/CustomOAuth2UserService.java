package com.whiskeep.api.member.auth;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import com.whiskeep.api.member.domain.Member;
import com.whiskeep.api.member.repository.MemberRepository;
import com.whiskeep.common.util.JwtTokenProvider;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

	private final MemberRepository memberRepository;
	private final JwtTokenProvider jwtTokenProvider;

	// GOOGLE 관련 변수
	String googleLoginUrl = "https://accounts.google.com/o/oauth2/auth";
	@Value("${spring.security.oauth2.client.registration.google.client-id}")
	String googleClientId;
	@Value("${spring.security.oauth2.client.registration.google.redirect-uri}")
	String googleRedirectUri;

	public String getLoginUrl(String provider){
		StringBuilder loginUrl = new StringBuilder();

		if("google".equals(provider)){
			loginUrl.append(googleLoginUrl)
				.append("?client_id=").append(googleClientId)
				.append("&redirect_uri=").append(googleRedirectUri)
				.append("&response_type=code")
				.append("&scope=email%20profile");
		}

		return loginUrl.toString();
	}

	@Override
	public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
		OAuth2User oAuth2User = super.loadUser(userRequest);
		OAuth2UserInfo oAuth2UserInfo = null;

		String provider = userRequest.getClientRegistration().getRegistrationId();
		String accessToken = userRequest.getAccessToken().getTokenValue();

		if ("google".equals(provider)) {
			oAuth2UserInfo = new GoogleUserInfo(oAuth2User.getAttributes());
		} else {
			oAuth2UserInfo = new KakaoUserInfo(oAuth2User.getAttributes());
		}

		// 고유값인 providerId로 기존 회원 조회
		Optional<Member> existingMember = memberRepository.findByProviderId(oAuth2UserInfo.getProviderId());

		Member member;
		if (existingMember.isPresent()) {
			member = existingMember.get(); // 기존 회원이면 그대로 사용
		} else {
			// 신규 회원이면 저장
			member = Member.builder()
				.email(oAuth2UserInfo.getEmail())
				.name(oAuth2UserInfo.getName())
				.nickname(generateUniqueNickname(oAuth2UserInfo.getName())) //닉네임 추가 로직 작성
				.profileImg(oAuth2UserInfo.getProfileImg())
				.provider(oAuth2UserInfo.getProvider())
				.providerId(oAuth2UserInfo.getProviderId())
				.build();
			memberRepository.save(member);
		}

		// ✅ JWT 생성
		String jwtToken = jwtTokenProvider.createToken(member.getEmail(), provider);

		// ✅ 프론트엔드로 JWT 반환
		// return new CustomOAuth2User(oAuth2User, jwtToken);
		return oAuth2User;
	}

	private String generateUniqueNickname(String name) {
		return name + "_" + System.currentTimeMillis(); // 예: "John_171515151515"
	}
}
