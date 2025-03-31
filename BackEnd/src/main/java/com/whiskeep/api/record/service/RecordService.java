package com.whiskeep.api.record.service;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.whiskeep.api.member.domain.Member;
import com.whiskeep.api.member.repository.MemberRepository;
import com.whiskeep.api.record.domain.Record;
import com.whiskeep.api.record.dto.RecordCreateDto;
import com.whiskeep.api.record.repository.RecordRepository;
import com.whiskeep.api.whisky.domain.Whisky;
import com.whiskeep.api.whisky.repository.WhiskyRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RecordService {

	private final RecordRepository recordRepository;
	private final MemberRepository memberRepository;
	private final WhiskyRepository whiskyRepository;

	public void addRecord(RecordCreateDto recordCreateDto) {

		Member member = memberRepository.findById(recordCreateDto.memberId())
			.orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "존재하지 않은 사용자입니다."));

		Whisky whisky = whiskyRepository.findById(recordCreateDto.whiskyId())
			.orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "위스키를 찾을 수 없습니다."));

		Record record = Record.builder()
			.member(member)
			.whisky(whisky)
			.rating(recordCreateDto.rating())
			.content(recordCreateDto.content())
			.isPublic(recordCreateDto.isPublic())
			.recordImg(recordCreateDto.recordImg())
			.build();

		recordRepository.save(record);
	}
}
