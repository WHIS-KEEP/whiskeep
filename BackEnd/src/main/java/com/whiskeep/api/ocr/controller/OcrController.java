package com.whiskeep.api.ocr.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.whiskeep.api.ocr.dto.OcrResponseDto;
import com.whiskeep.api.ocr.service.OcrService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/ocr")
public class OcrController {

	private final OcrService ocrService;

	@PostMapping
	public ResponseEntity<OcrResponseDto> doOcr(@RequestPart("image") MultipartFile image) {
		OcrResponseDto response = ocrService.performOcr(image);

		return ResponseEntity.ok(response);
	}
}
