package com.whiskeep.api.whisky.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

	public WhiskyDetailResponseDto getWhiskyById(Long whiskyId) {

		Whisky whisky = whiskyRepository.findById(whiskyId)
			.orElseThrow(() -> new IllegalArgumentException("Whisky not found"));

		String nosingTopThree = tastingProfileService.extractTopFeatures(whisky.getNosing());
		String tastingTopThree = tastingProfileService.extractTopFeatures(whisky.getTasting());
		String finishTopThree = tastingProfileService.extractTopFeatures(whisky.getFinish());

		return WhiskyDetailResponseDto.builder()
			.whiskyImg(whisky.getWhiskyImg())
			.koName(whisky.getKoName())
			.enName(whisky.getEnName())
			.distillery(whisky.getDistillery())
			.country(whisky.getCountry())
			.abv(whisky.getAbv())
			.type(whisky.getType())
			.nosing(nosingTopThree)
			.tasting(tastingTopThree)
			.finish(finishTopThree)
			.description(whisky.getDescription())
			.build();
	}

}
