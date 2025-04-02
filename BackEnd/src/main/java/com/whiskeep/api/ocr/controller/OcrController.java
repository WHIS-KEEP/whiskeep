package com.whiskeep.api.ocr.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.whiskeep.api.ocr.service.OcrService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/ocr")
public class OcrController {

	private final OcrService ocrService;

	@PostMapping
	public ResponseEntity<?> doOcr(@RequestPart("image") MultipartFile image) {
		System.out.println("🔥 OCR 요청 받음! 파일명: " + image.getOriginalFilename());
		Map<String, Object> response = ocrService.performOcr(image);

		return ResponseEntity.ok(response);
	}

	@PostMapping("/string")
	public ResponseEntity<String> testOcr() {
		return ResponseEntity.ok("파일을 잘 받았습니다!");
	}
}
