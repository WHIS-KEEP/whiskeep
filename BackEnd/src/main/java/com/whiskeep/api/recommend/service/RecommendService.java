package com.whiskeep.api.recommend.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.apache.commons.math3.linear.ArrayRealVector;
import org.apache.commons.math3.linear.RealVector;
import org.springframework.stereotype.Service;

import com.whiskeep.api.recommend.dto.RecommendResponseDto;
import com.whiskeep.api.recommend.dto.RecommendedListResponseDto;
import com.whiskeep.api.recommend.repository.RecommendRepository;
import com.whiskeep.api.record.domain.Record;
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
	private final WhiskyRepository whiskyRepository;

	// 추천된 리스트들
	public RecommendedListResponseDto recommendWhiskies(Long memberId) {
		List<Record> records = recordRepository.findByMemberId(memberId);

		List<Whisky> notRatedWhiskies = whiskyRepository.findWhiskiesNotRatedByMember(memberId);
		List<RecommendResponseDto> recommendList = new ArrayList<>();
		for (Whisky whisky : notRatedWhiskies) {
			RecommendResponseDto whiskies = getRecommendedWhiskies(whisky, records);
			recommendList.add(whiskies);
		}

		List<RecommendResponseDto> topRecommendations = recommendList.stream()
			.sorted((w1, w2) -> Double.compare(w2.getSimilarity(), w1.getSimilarity()))
			.limit(5)
			.collect(Collectors.toList());

		return RecommendedListResponseDto.builder()
			.recommendList(topRecommendations).build();
	}

	//2. 유사도 계산
	private double calculateWhiskySimilarity(Whisky myWhisky, Whisky newWhisky) {

		double nosingSimilarity = calculateSimilarity(myWhisky.getNosing(), newWhisky.getNosing());
		double tastingSimilarity = calculateSimilarity(myWhisky.getTasting(), newWhisky.getTasting());
		double finishSimilarity = calculateSimilarity(myWhisky.getFinish(), newWhisky.getFinish());

		//일단 nosing, tasting, finish 들의 평균을 기준으로 유사도 계산
		double avgSimilarity = (nosingSimilarity + tastingSimilarity + finishSimilarity) / 3;
		return avgSimilarity;

	}

	//두 위스키 비교 - 두 위스키 간의 코사인 유사도 값 계산
	@SuppressWarnings("checkstyle:LocalVariableName")
	private double calculateSimilarity(TastingProfile<Map<String, Double>> profile1,
		TastingProfile<Map<String, Double>> profile2) {

		//위스키의 세부특성 수치 가져오기
		Map<String, Double> whiskyFlavorDetails1 = getWhiskyFlavorDetails(profile1);
		Map<String, Double> whiskyFlavorDetails2 = getWhiskyFlavorDetails(profile2);

		//비교하고 있는 두개의 위스키가 가지고 있는 특성들 하나에 저장
		Set<String> allFlavors = new HashSet<>();
		allFlavors.addAll(whiskyFlavorDetails1.keySet());
		allFlavors.addAll(whiskyFlavorDetails2.keySet());

		RealVector whiskyV1 = new ArrayRealVector(allFlavors.size());
		RealVector whiskyV2 = new ArrayRealVector(allFlavors.size());

		// 없는 맛은 0으로 채우기
		int cnt = 0;
		for (String flavor : allFlavors) {
			whiskyV1.setEntry(cnt, whiskyFlavorDetails1.getOrDefault(flavor, 0.0));
			whiskyV2.setEntry(cnt, whiskyFlavorDetails2.getOrDefault(flavor, 0.0));
			cnt++;
		}

		if (whiskyV1.getNorm() == 0.0 || whiskyV2.getNorm() == 0.0) {
			return 0.0;
		}

		return whiskyV1.cosine(whiskyV2);

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
		if (component != null & component.getData() != null) {
			component.getData().forEach((key, value) -> {
				allDetails.put(key, value);
			});
		}
	}



	//위스키 추천하기
	private RecommendResponseDto getRecommendedWhiskies(Whisky newWhisky, List<Record> records) {
		double totalSimilarity = 0.0;
		double totalWeight = 0.0;
		for (Record record : records) {

			Whisky ratedWhisky = record.getWhisky();
			//가중치
			double similarity = calculateWhiskySimilarity(ratedWhisky, newWhisky);
			double weight = record.getRating().doubleValue() / 5;

			totalSimilarity += similarity * weight;
			totalWeight += weight;
		}

		//가중 산술 평균으로 가중치
		double avgSimilarity = totalWeight > 0 ? totalSimilarity / totalWeight : 0.0;

		return RecommendResponseDto.builder()
			.whiskyId(newWhisky.getWhiskyId())
			.koName(newWhisky.getKoName())
			.whiskyImg(newWhisky.getWhiskyImg())
			.abv(newWhisky.getAbv())
			.similarity(avgSimilarity)
			.build();
	}


}
