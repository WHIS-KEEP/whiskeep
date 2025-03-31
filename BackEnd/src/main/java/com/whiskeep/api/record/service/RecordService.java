package com.whiskeep.api.record.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.whiskeep.api.member.domain.Member;
import com.whiskeep.api.member.repository.MemberRepository;
import com.whiskeep.api.record.domain.Record;
import com.whiskeep.api.record.dto.RecordCreateRequestDto;
import com.whiskeep.api.record.repository.RecordRepository;
import com.whiskeep.api.whisky.domain.Whisky;
import com.whiskeep.api.whisky.repository.WhiskyRepository;
import com.whiskeep.common.exception.ErrorMessage;
import com.whiskeep.common.exception.NotFoundException;

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
}
