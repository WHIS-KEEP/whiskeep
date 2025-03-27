package com.whiskeep.api.recommend.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.whiskeep.api.member.domain.Member;
import com.whiskeep.api.recommend.dto.RecommendResponseDto;
import com.whiskeep.api.recommend.dto.RecommendedListResponseDto;
import com.whiskeep.api.recommend.repository.RecommendRepository;

import com.whiskeep.api.record.repository.RecordRepository;
import com.whiskeep.api.whisky.domain.Whisky;
import com.whiskeep.api.whisky.repository.WhiskyRepository;
import com.whiskeep.common.model.TastingComponent;
import com.whiskeep.common.model.TastingProfile;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RecommendService {

	private final RecordRepository recordRepository;
	private final RecommendRepository recommendRepository;
	private final WhiskyRepository whiskyRepository;

	//1. 일단 사용자가 남긴 위스킹에 대한 기록들 다 가져옴
	public List<Record> getRecords(Long memberId) {

		return recordRepository.findAll(memberId);
	}

	//2. 유사도 계산
	private double calculateWhiskySimilarity(Whisky myWhisky, Whisky newWhisky) {

		double nosingSimilarity = calculateSimilarity(myWhisky.getNosing(), newWhisky.getNosing());
		double tastingSimilarity = calculateSimilarity(newWhisky.getTasting(), myWhisky.getTasting());
		double finishSimilarity = calculateSimilarity(myWhisky.getFinish(), newWhisky.getFinish());

		//일단 nosing, tasting, finish 들의 평균을 기준으로 유사도 계산
		double avgSimilarity = (nosingSimilarity + tastingSimilarity + finishSimilarity) / 3;
		return avgSimilarity;

	}

	//두 위스키 비교하기
	private double calculateSimilarity(TastingProfile<Map<String, Double>> profile1,
		TastingProfile<Map<String, Double>> profile2) {

		//위스키의 세부특성 수치 가져오기
		Map<String, Double> whiskyFlavorDetails1 = getWhiskyFlavorDetails(profile1);
		Map<String, Double> whiskyFlavorDetails2 = getWhiskyFlavorDetails(profile2);

	}

	//위스키 속 세부항목 가져오기
	private Map<String, Double> getWhiskyFlavorDetails(TastingProfile<Map<String, Double>> whiskyProfile) {
		Map<String, Double> allDetails = new HashMap<>();
		if (whiskyProfile != null) {
			addComponentDetails(allDetails, "fruity", whiskyProfile.getFruity());
			addComponentDetails(allDetails, "sweet", whiskyProfile.getSweet());
			addComponentDetails(allDetails, "briny", whiskyProfile.getBriny());
			addComponentDetails(allDetails, "spicy", whiskyProfile.getSpicy());
			addComponentDetails(allDetails, "herbal", whiskyProfile.getHerbal());
			addComponentDetails(allDetails, "oaky", whiskyProfile.getOaky());
		}
		return allDetails;
	}

	//맵에 넣어주는 메서드
	private void addComponentDetails(Map<String, Double> allDetails, String category,
													TastingComponent<Map<String, Double>> component) {
		if(component != null & component.getData() != null) {
			component.getData().forEach((key, value) -> {
				allDetails.put(key, value);
			});
		}
	}

	//3. 기록한 애들과 가장 비슷한 위스키를 추천해줌

	//추천하기
	public RecommendedListResponseDto recommendWhiskies(Long memberId) {
		List<Record> records = recordRepository.findAll(memberId);
		List<Whisky> whiskies = whiskyRepository.findWhiskiesNotRatedByMember(memberId);

	}

	private RecommendResponseDto getRecommendedWhiskies() {

	}

}
