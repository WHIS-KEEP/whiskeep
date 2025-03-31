package com.whiskeep.api.member.service;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.whiskeep.api.member.domain.Member;
import com.whiskeep.api.member.dto.MemberResponseDto;
import com.whiskeep.api.member.repository.MemberRepository;
import com.whiskeep.common.util.JwtTokenProvider;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MemberService {

	private final MemberRepository memberRepository;
	private final JwtTokenProvider jwtTokenProvider;

	@Transactional
	public MemberResponseDto getUserInfo(String token) {
		// "Bearer " 문자열 제거 후 실제 토큰 값만 추출
		String accessToken = token.substring(7);

		// 토큰에서 사용자 ID 추출
		Long memberId = jwtTokenProvider.getMemberIdFromToken(accessToken);

		Member member = memberRepository.findById(memberId)
			.orElseThrow(() -> new UsernameNotFoundException("Member not found" + memberId));

		return new MemberResponseDto(member.getMemberId(), member.getEmail(), member.getName(),
			member.getNickname(), member.getProfileImg(), member.getProvider().name());
	}
}
