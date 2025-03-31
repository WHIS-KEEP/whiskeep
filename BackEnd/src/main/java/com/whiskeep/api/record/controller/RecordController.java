package com.whiskeep.api.record.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.whiskeep.api.record.dto.RecordCreateDto;
import com.whiskeep.api.record.service.RecordService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/records")
public class RecordController {

	private final RecordService recordService;

	@PostMapping("/")
	public ResponseEntity<?> createRecord(@RequestBody RecordCreateDto recordCreateDto) {
		System.out.println("test");

		recordService.addRecord(recordCreateDto);

		return new ResponseEntity<>(HttpStatus.CREATED);

	}
}
