package com.whiskeep.api.member.auth;

import java.util.Optional;

import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import com.whiskeep.api.member.domain.Member;
import com.whiskeep.api.member.repository.MemberRepository;
import com.whiskeep.common.enumclass.Provider;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

	private final MemberRepository memberRepository;

	@Override
	public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
		OAuth2User oAuth2User = super.loadUser(userRequest);
		OAuth2UserInfo oAuth2UserInfo = null;

		if (userRequest.getClientRegistration().getRegistrationId().equals("google")) {
			oAuth2UserInfo = new GoogleUserInfo(oAuth2User.getAttributes());
		} else if (userRequest.getClientRegistration().getRegistrationId().equals("kakao")) {
			oAuth2UserInfo = new KakaoUserInfo(oAuth2User.getAttributes());
		} else {
			System.out.println("지원하지 않는 소셜입니다.");
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
				// 닉네임 추가 로직 작성
				// .nickname()
				.profileImg(oAuth2UserInfo.getProfileImg())
				.provider(oAuth2UserInfo.getProvider())
				.build();
			memberRepository.save(member);
		}

		return oAuth2User;
		// return new PrincipalDetails(member, oAuth2User.getAttributes());
	}
}
