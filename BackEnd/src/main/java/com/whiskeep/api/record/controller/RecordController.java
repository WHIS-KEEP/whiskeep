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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.whiskeep.api.record.dto.RecordImageResponseDto;
import com.whiskeep.api.record.dto.request.RecordCreateRequestDto;
import com.whiskeep.api.record.dto.request.RecordUpdateRequestDto;
import com.whiskeep.api.record.dto.response.MyRecordResponseDto;
import com.whiskeep.api.record.dto.response.RecordDetailResponseDto;
import com.whiskeep.api.record.service.RecordService;
import com.whiskeep.api.whisky.dto.response.WhiskyRecordResponseDto;
import com.whiskeep.common.auth.annotation.Auth;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/records")
public class RecordController {

	private final RecordService recordService;

	@PostMapping
	public ResponseEntity<?> createRecord(@RequestBody RecordCreateRequestDto recordCreateRequestDto,
		@Auth Long memberId) {

		recordService.addRecord(memberId, recordCreateRequestDto);

		return new ResponseEntity<>(HttpStatus.CREATED);

	}

	@GetMapping
	public ResponseEntity<?> getWhiskyRecords(@Auth Long memberId) {
		List<WhiskyRecordResponseDto> records = recordService.getWhiskyRecordsByMember(memberId);
		return ResponseEntity.ok(records);
	}

	@GetMapping("/{whiskyId}")
	public ResponseEntity<?> getRecordsByWhiskyIdAndMember(
		@Auth Long memberId, @PathVariable Long whiskyId) {

		MyRecordResponseDto myRecordResponseDto
			= recordService.getRecordByWhiskyIdAndMember(whiskyId, memberId);

		return ResponseEntity.ok(myRecordResponseDto);
	}

	@GetMapping("/{whiskyId}/{recordId}")
	public ResponseEntity<?> getRecordDetail(@Auth Long memberId, @PathVariable("recordId") Long recordId) {
		RecordDetailResponseDto recordDetailResponseDto = recordService.getRecordDetail(memberId, recordId);

		return ResponseEntity.ok(recordDetailResponseDto);
	}

	@PutMapping("/{whiskyId}/{recordId}")
	public ResponseEntity<?> updateRecordDetail(@Auth Long memberId,
		@PathVariable("whiskyId") Long whiskyId,
		@PathVariable("recordId") Long recordId,
		@RequestBody RecordUpdateRequestDto recordUpdateRequestDto) {

		recordService.updateRecord(memberId, whiskyId, recordId, recordUpdateRequestDto);

		return new ResponseEntity<>(HttpStatus.OK);
	}

	@DeleteMapping("/{whiskyId}/{recordId}")
	public ResponseEntity<?> deleteRecord(@Auth Long memberId,
		@PathVariable("whiskyId") Long whiskyId,
		@PathVariable("recordId") Long recordId) {

		recordService.deleteRecord(memberId, whiskyId, recordId);

		return new ResponseEntity<>(HttpStatus.NO_CONTENT);
	}

	@PostMapping("/image")
	public ResponseEntity<?> uploadImage(@Auth Long memberId,
		@RequestParam("file") MultipartFile file) {
		RecordImageResponseDto recordImageResponseDto = recordService.uploadImage(file);
		return new ResponseEntity<>(recordImageResponseDto, HttpStatus.OK);

	}

}
