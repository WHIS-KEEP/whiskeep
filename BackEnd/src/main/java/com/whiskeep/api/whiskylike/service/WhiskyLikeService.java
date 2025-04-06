package com.whiskeep.api.whiskylike.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.whiskeep.api.member.domain.Member;
import com.whiskeep.api.member.repository.MemberRepository;
import com.whiskeep.api.whisky.domain.Whisky;
import com.whiskeep.api.whisky.repository.WhiskyRepository;
import com.whiskeep.api.whiskylike.domain.WhiskyLike;
import com.whiskeep.api.whiskylike.dto.LikeListResponseDto;
import com.whiskeep.api.whiskylike.dto.LikeResponseDto;
import com.whiskeep.api.whiskylike.dto.LikeUpdateResponseDto;
import com.whiskeep.api.whiskylike.repository.WhiskyLikeRepository;
import com.whiskeep.common.exception.BadRequestException;
import com.whiskeep.common.exception.ErrorMessage;
import com.whiskeep.common.exception.NotFoundException;

import lombok.RequiredArgsConstructor;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class WhiskyLikeService {

	private final WhiskyRepository whiskyRepository;
	private final MemberRepository memberRepository;
	private final WhiskyLikeRepository whiskyLikeRepository;

	@Transactional
	public LikeUpdateResponseDto likeWhisky(Long whiskyId, Long memberId) {
		Whisky whisky = findWhisky(whiskyId);
		Member member = findMember(memberId);

		if (whiskyLikeRepository.findByMemberAndWhisky(member, whisky).isPresent()) {
			throw new BadRequestException(ErrorMessage.LIKE_ALREADY_REGISTERED);
		}

		whiskyLikeRepository.save(WhiskyLike.builder()
			.member(member)
			.whisky(whisky)
			.build());

		return new LikeUpdateResponseDto(whiskyId, true);
	}

	@Transactional
	public LikeUpdateResponseDto unlikeWhisky(Long whiskyId, Long memberId) {
		Whisky whisky = findWhisky(whiskyId);
		Member member = findMember(memberId);

		WhiskyLike like = whiskyLikeRepository.findByMemberAndWhisky(member, whisky)
			.orElseThrow(() -> new BadRequestException(ErrorMessage.LIKE_UNREGISTERED));

		whiskyLikeRepository.delete(like);

		return new LikeUpdateResponseDto(whiskyId, false);
	}

	public LikeListResponseDto getLikedWhiskies(Long memberId) {
		Member member = findMember(memberId);

		List<LikeResponseDto> likedWhiskies = whiskyLikeRepository.findAllByMemberOrderByCreatedAtDesc(member).stream()
			.map(like -> LikeResponseDto.of(like.getWhisky()))
			.toList();

		return new LikeListResponseDto(likedWhiskies);
	}

	private Whisky findWhisky(Long whiskyId) {
		return whiskyRepository.findById(whiskyId)
			.orElseThrow(() -> new NotFoundException(ErrorMessage.WHISKY_NOT_FOUND));
	}

	private Member findMember(Long memberId) {
		return memberRepository.findById(memberId)
			.orElseThrow(() -> new NotFoundException(ErrorMessage.MEMBER_NOT_FOUND));
	}
}
