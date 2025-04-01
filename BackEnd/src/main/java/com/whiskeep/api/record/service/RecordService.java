package com.whiskeep.api.record.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.whiskeep.api.member.domain.Member;
import com.whiskeep.api.member.repository.MemberRepository;
import com.whiskeep.api.record.domain.Record;
import com.whiskeep.api.record.dto.RecordCreateRequestDto;
import com.whiskeep.api.record.dto.RecordDetailResponseDto;
import com.whiskeep.api.record.dto.RecordListWhiskyAndMemberResponseDto;
import com.whiskeep.api.record.repository.RecordRepository;
import com.whiskeep.api.whisky.domain.Whisky;
import com.whiskeep.api.whisky.dto.RecordListResponseDto;
import com.whiskeep.api.whisky.dto.WhiskyRecordResponseDto;
import com.whiskeep.api.whisky.repository.WhiskyRepository;
import com.whiskeep.common.exception.ErrorMessage;
import com.whiskeep.common.exception.ForbiddenException;
import com.whiskeep.common.exception.NotFoundException;

import com.whiskeep.common.exception.UnauthorizedException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RecordService {

	private final RecordRepository recordRepository;
	private final MemberRepository memberRepository;
	private final WhiskyRepository whiskyRepository;

	@Transactional
	public void addRecord(Member member, RecordCreateRequestDto recordCreateRequestDto) {

		Whisky whisky = whiskyRepository.findById(recordCreateRequestDto.whiskyId())
			.orElseThrow(() -> new NotFoundException(ErrorMessage.WHISKY_NOT_FOUND));

		Record record = Record.builder()
			.member(member)
			.whisky(whisky)
			.rating(recordCreateRequestDto.rating())
			.content(recordCreateRequestDto.content())
			.isPublic(recordCreateRequestDto.isPublic())
			.recordImg(recordCreateRequestDto.recordImg())
			.build();

		recordRepository.save(record);
	}

	public Integer countRecord(Long whiskyId) {

		return recordRepository.countRecordsByWhisky_WhiskyId(whiskyId);
	}

	public Double getAverageRating(Long whiskyId) {

		return recordRepository.findAverageRatingByWhiskyId(whiskyId).orElse(0.0);

	}

	public RecordListResponseDto getRecordByWhiskyId(Long whiskyId, int page, int size) {

		Pageable pageable = PageRequest.of(page, size);
		Page<Record> recordPage = recordRepository.findByWhiskyWhiskyIdAndIsPublicTrueOrderByCreatedAtDesc(
			whiskyId, pageable);

		List<RecordListResponseDto.RecordResponseDto> records = recordPage.getContent().stream()
			.map(record -> RecordListResponseDto.RecordResponseDto.builder()
				.recordId(record.getRecordId())
				.nickname(record.getMember().getNickname())
				.profileImage(record.getMember().getProfileImg())
				.content(record.getContent())
				.recordImg(record.getRecordImg())
				.rating(record.getRating())
				.createdAt(record.getCreatedAt())
				.build())
			.collect(Collectors.toList());

		RecordListResponseDto.PageInfo pageInfo = RecordListResponseDto.PageInfo.builder()
			.page(recordPage.getNumber())
			.size(recordPage.getSize())
			.totalPages(recordPage.getTotalPages())
			.build();

		return RecordListResponseDto.builder()
			.records(records)
			.pageInfo(pageInfo)
			.build();

	}

	public List<WhiskyRecordResponseDto> getWhiskyRecordsByMember(Member member) {

		//login 한 유저의 모든 record 를 map 으로 수집 후, list 로 반환하여 중복 제거
		return recordRepository.findAllByMember(member)
			.stream()
			.collect(Collectors.toMap(
				record -> {
					return Optional.ofNullable(record)
						.map(r -> r.getWhisky())
						.map(w -> w.getWhiskyId())
						.orElseThrow(() -> new NotFoundException(ErrorMessage.RECORD_NOT_FOUND));
				},
				record -> {
					Whisky whisky = record.getWhisky();
					return new WhiskyRecordResponseDto(
						whisky.getWhiskyId(),
						whisky.getWhiskyImg()
					);
				},
				(existing, replacement) -> existing
			))
			.values()
			.stream()
			.collect(Collectors.toList());
	}

	public RecordListWhiskyAndMemberResponseDto getRecordByWhiskyIdAndMember(Long whiskyId, Member member) {

		Whisky whisky = whiskyRepository.findById(whiskyId)
			.orElseThrow(()-> new NotFoundException(ErrorMessage.WHISKY_NOT_FOUND));


		List<RecordListWhiskyAndMemberResponseDto.RecordSummaryDto> recordDtos =
			recordRepository.findAllByMemberAndWhisky(member, whisky)
				.stream()
				.map(record -> new RecordListWhiskyAndMemberResponseDto.RecordSummaryDto(
					record.recordId(),
					record.recordImg()
				))
				.collect(Collectors.toList());

		return new RecordListWhiskyAndMemberResponseDto(
			whisky.getWhiskyId(),
			whisky.getWhiskyImg(),
			whisky.getKoName(),
			whisky.getEnName(),
			recordDtos
		);

	}

	public RecordDetailResponseDto getRecordDetail(Member member, Long recordId) {

		Record record = recordRepository.findById(recordId)
			.orElseThrow(()-> new NotFoundException(ErrorMessage.RECORD_NOT_FOUND));

		//기록을 쓴 유저인지 확인
		if (!record.getMember().getMemberId().equals(member.getMemberId())) {
			throw new ForbiddenException(ErrorMessage.FORBIDDEN);
		}

		return new RecordDetailResponseDto(
			record.getRecordImg(),
			record.getRating(),
			record.getContent(),
			record.getCreatedAt()
		);

	}
}
