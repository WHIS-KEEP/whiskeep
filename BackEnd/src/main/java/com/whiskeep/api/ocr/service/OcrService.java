package com.whiskeep.api.ocr.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import com.whiskeep.api.ocr.dto.OcrResponseDto;
import com.whiskeep.api.whisky.domain.Whisky;
import com.whiskeep.api.whisky.dto.reqeust.WhiskySearchRequestDto;
import com.whiskeep.api.whisky.dto.response.WhiskySearchResponseDto;
import com.whiskeep.api.whisky.service.WhiskyService;
import com.whiskeep.common.exception.BaseException;
import com.whiskeep.common.exception.ErrorMessage;
import com.whiskeep.common.exception.InternalServerException;
import com.whiskeep.common.exception.NotFoundException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OcrService {

	private final WhiskyService whiskyService;

	@Value("${ocr.api-url}")
	private String fastApiOcrUrl;
	private final RestTemplate restTemplate = new RestTemplate();

	public OcrResponseDto performOcr(MultipartFile file) {
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
				fastApiOcrUrl, HttpMethod.POST, requestEntity, Map.class
			);

			// response 값 : {bestMatch : _, similarityScore: _}
			String enName = response.getBody().get("bestMatch").toString();
			// 1. 위스키 조회
			List<Whisky> whiskies = whiskyService.getWhiskiesByEnName(enName);
			// sameWhiskyIds 추출
			List<Long> sameWhiskyIds = whiskies.stream()
				.map(Whisky::getWhiskyId)
				.toList();

			// 2. ES 로 whisky 목록 가져오기
			WhiskySearchRequestDto whiskySearchRequestDto = new WhiskySearchRequestDto(
				enName,
				10,
				null,
				null,
				true,
				null,
				null
			);

			WhiskySearchResponseDto whiskySearchResponseDto = whiskyService.searchWhiskies(whiskySearchRequestDto);

			return new OcrResponseDto(sameWhiskyIds, whiskySearchResponseDto.whiskies());
		} catch (HttpClientErrorException e) {
			// ocr 정상 수행했지만 결과값이 없을 때
			if (e.getStatusCode() == HttpStatus.NOT_ACCEPTABLE) {
				throw new BaseException(HttpStatus.NOT_ACCEPTABLE, ErrorMessage.OCR_RESULT_NOT_FOUND);
			}
			// ocr 정상 수행 못했을 때
			throw new InternalServerException(ErrorMessage.OCR_FAILED_ERROR);
		} catch (Exception e) {
			// es 실패
			throw new NotFoundException(ErrorMessage.WHISKY_NOT_FOUND);
		}
	}
}
