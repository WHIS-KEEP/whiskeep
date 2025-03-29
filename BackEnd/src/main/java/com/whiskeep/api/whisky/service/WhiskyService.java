package com.whiskeep.api.whisky.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.whiskeep.api.record.service.RecordService;
import com.whiskeep.api.whisky.domain.Whisky;
import com.whiskeep.api.whisky.dto.WhiskyDetailResponseDto;
import com.whiskeep.api.whisky.repository.WhiskyRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class WhiskyService {

	private final WhiskyRepository whiskyRepository;
	private final TastingProfileService tastingProfileService;
	private final RecordService recordService;

	public WhiskyDetailResponseDto getWhiskyById(Long whiskyId) {

		Whisky whisky = whiskyRepository.findById(whiskyId)
			.orElseThrow(() -> new IllegalArgumentException("Whisky not found"));

		List<String> nosingList = tastingProfileService.extractTopFeatures(whisky.getNosing());
		List<String> tastingList = tastingProfileService.extractTopFeatures(whisky.getTasting());
		List<String> finishList = tastingProfileService.extractTopFeatures(whisky.getFinish());

		Integer recordCnt = recordService.countRecord(whiskyId);
		Double recordAvg = recordService.getAverageRating(whiskyId);

		return WhiskyDetailResponseDto.builder()
			.whiskyId(whisky.getWhiskyId())
			.whiskyImg(whisky.getWhiskyImg())
			.koName(whisky.getKoName())
			.enName(whisky.getEnName())
			.distillery(whisky.getDistillery())
			.country(whisky.getCountry())
			.abv(whisky.getAbv())
			.type(whisky.getType())
			.tastingNotes(WhiskyDetailResponseDto.TastingNotesDto
				.builder()
				.nosing(nosingList)
				.tasting(tastingList)
				.finish(finishList)
				.build())
			.description(whisky.getDescription()).recordInfo(WhiskyDetailResponseDto.RecordInfo
				.builder()
				.ratingAvg(recordAvg)
				.recordCnt(recordCnt)
				.build())
			.build();
	}

}
