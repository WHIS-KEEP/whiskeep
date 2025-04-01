package com.whiskeep.api.record.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.whiskeep.api.member.domain.Member;
import com.whiskeep.api.record.dto.RecordCreateRequestDto;
import com.whiskeep.api.record.service.RecordService;
import com.whiskeep.api.whisky.dto.WhiskyRecordResponseDto;
import com.whiskeep.common.auth.annotation.Auth;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/records")
public class RecordController {

	private final RecordService recordService;

	@PostMapping
	public ResponseEntity<?> createRecord(@RequestBody RecordCreateRequestDto recordCreateRequestDto,
		@Auth Member member) {

		recordService.addRecord(member, recordCreateRequestDto);

		return new ResponseEntity<>(HttpStatus.CREATED);

	}

	@GetMapping
	public ResponseEntity<List<WhiskyRecordResponseDto>> getWhiskyRecords(@Auth Member member) {
		List<WhiskyRecordResponseDto> records = recordService.getWhiskyRecordsByMember(member);
		return ResponseEntity.ok(records);
	}


}
