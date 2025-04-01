package com.whiskeep.api.member.service;

import org.springframework.stereotype.Service;

import com.whiskeep.api.member.domain.Member;
import com.whiskeep.api.member.dto.MemberResponseDto;
import com.whiskeep.api.member.repository.MemberRepository;
import com.whiskeep.common.exception.ErrorMessage;
import com.whiskeep.common.exception.NotFoundException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MemberService {

	private final MemberRepository memberRepository;

	public MemberResponseDto getCurrentMember(Long memberId) {

		Member member = memberRepository.findById(memberId)
			.orElseThrow(() -> new NotFoundException(ErrorMessage.MEMBER_NOT_FOUND));

		return new MemberResponseDto(
			member.getMemberId(),
			member.getEmail(),
			member.getName(),
			member.getNickname(),
			member.getProfileImg(),
			member.getProvider().name()
		);
	}
}
