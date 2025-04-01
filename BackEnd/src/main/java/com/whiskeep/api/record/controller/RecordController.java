package com.whiskeep.api.record.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.whiskeep.api.member.domain.Member;
import com.whiskeep.api.record.dto.request.RecordCreateRequestDto;
import com.whiskeep.api.record.dto.request.RecordUpdateRequestDto;
import com.whiskeep.api.record.dto.response.MyRecordResponseDto;
import com.whiskeep.api.record.dto.response.RecordDetailResponseDto;
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
	public ResponseEntity<?> getWhiskyRecords(@Auth Member member) {
		List<WhiskyRecordResponseDto> records = recordService.getWhiskyRecordsByMember(member);
		return ResponseEntity.ok(records);
	}

	@GetMapping("/{whiskyId}")
	public ResponseEntity<?> getRecordsByWhiskyIdAndMember(
		@Auth Member member, @PathVariable Long whiskyId) {

		MyRecordResponseDto myRecordResponseDto
			= recordService.getRecordByWhiskyIdAndMember(whiskyId, member);

		return ResponseEntity.ok(myRecordResponseDto);
	}

	@GetMapping("/{whiskyId}/{recordId}")
	public ResponseEntity<?> getRecordDetail(@Auth Member member, @PathVariable("recordId") Long recordId) {
		RecordDetailResponseDto recordDetailResponseDto = recordService.getRecordDetail(member, recordId);

		return ResponseEntity.ok(recordDetailResponseDto);
	}

	@PutMapping("/{whiskyId}/{recordId}")
	public ResponseEntity<?> updateRecordDetail(@Auth Member member, @PathVariable("recordId") Long recordId,
		@RequestBody RecordUpdateRequestDto recordUpdateRequestDto) {

		recordService.updateRecord(member, recordId, recordUpdateRequestDto);

		return new ResponseEntity<>(HttpStatus.OK);
	}

	@DeleteMapping("/{whiskyId}/{recordId}")
	public ResponseEntity<?> deleteRecord(@Auth Member member, @PathVariable("recordId") Long recordId) {

		recordService.deleteRecord(member, recordId);

		return new ResponseEntity<>(HttpStatus.NO_CONTENT);
	}

}
