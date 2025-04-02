package com.whiskeep.api.ocr.service;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import java.util.HashMap;
import java.util.Map;

@Service
public class OcrService {

	private final String FASTAPI_OCR_URL = "http://localhost:8000/ocr/";
	private final RestTemplate restTemplate = new RestTemplate();

	public Map<String, Object> performOcr(MultipartFile file) {
		try {
			HttpHeaders headers = new HttpHeaders();
			headers.setContentType(MediaType.MULTIPART_FORM_DATA);

			MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
			body.add("file", new org.springframework.core.io.ByteArrayResource(file.getBytes()) {
				@Override
				public String getFilename() {
					return file.getOriginalFilename();  // FastAPI가 파일명을 받을 수 있도록 설정
				}
			});

			HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

			ResponseEntity<Map> response = restTemplate.exchange(
				FASTAPI_OCR_URL, HttpMethod.POST, requestEntity, Map.class
			);

			return response.getBody();
		} catch (Exception e) {
			Map<String, Object> errorResponse = new HashMap<>();
			errorResponse.put("error", "OCR 처리 중 오류 발생: " + e.getMessage());
			return errorResponse;
		}
	}
}
