package com.whiskeep.api.recommend.service;

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.commons.math3.linear.ArrayRealVector;
import org.apache.commons.math3.linear.RealVector;
import org.springframework.stereotype.Service;

import com.whiskeep.api.member.domain.Member;
import com.whiskeep.api.member.domain.MemberPreference;
import com.whiskeep.api.member.repository.MemberPreferenceRepository;
import com.whiskeep.api.recommend.dto.RecommendResponseDto;
import com.whiskeep.api.recommend.dto.RecommendedListResponseDto;
import com.whiskeep.api.whisky.domain.Whisky;
import com.whiskeep.api.whisky.repository.WhiskyRepository;
import com.whiskeep.common.enumclass.TastingCategory;
import com.whiskeep.common.exception.ErrorMessage;
import com.whiskeep.common.exception.NotFoundException;
import com.whiskeep.common.model.TastingComponent;
import com.whiskeep.common.model.TastingProfile;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RecommendBeginnerService {

	private final MemberPreferenceRepository memberPreferenceRepository;
	private final WhiskyRepository whiskyRepository;

	// 초보자가 입력한 점수 기반 추천 알고리즘
	public RecommendedListResponseDto recommendForBeginnerService(Member member) {

		// 1. 초보자가 입력한 점수와 순서(향, 맛, 여운)을 담은 MemberPreference 찾기
		MemberPreference beginnerPref =
			memberPreferenceRepository.findByMember(member)
				.orElseThrow(() -> new NotFoundException(ErrorMessage.PREFERENCE_NOT_FOUND));

		// 2. 초보자에 맞는 Vector 생성하기
		Map<String, Double> userVector = buildUserVector(beginnerPref);

		// 3. 모든 위스키 리스트 돌면서 -> 코사인 유사도가 높은 위스키 반환하기
		List<Whisky> allWhiskies = whiskyRepository.findAll();

		Set<String> seenKoNames = new HashSet<>();

		List<RecommendResponseDto> recommendList = allWhiskies.stream()
			.map(whisky -> RecommendResponseDto.builder()
				.whiskyId(whisky.getWhiskyId())
				.koName(whisky.getKoName())
				.whiskyImg(whisky.getWhiskyImg())
				.abv(whisky.getAbv())
				.similarity(cosineSimilarity(userVector, extraWhiskyVector(whisky)))
				.build())
			.filter(dto -> seenKoNames.add(dto.getKoName())) // Set으로 중복 제거 (같은 koName 일 경우, 중복 제거)
			.sorted((a, b) -> Double.compare(b.getSimilarity(), a.getSimilarity()))
			.limit(5)
			.toList();

		return RecommendedListResponseDto.builder().recommendList(recommendList).build();
	}

	// 초보자 점수 기반 벡터 만들기
	private Map<String, Double> buildUserVector(MemberPreference beginnerPref) {
		Map<String, Double> userVector = new HashMap<>();
		List<Double> weights = beginnerPref.getPreferenceOrder();

		double totalWeight = weights.stream().mapToDouble(Double::doubleValue).sum();
		double wNosing = weights.get(0) / totalWeight;
		double wTasting = weights.get(1) / totalWeight;
		double wFinish = weights.get(2) / totalWeight;

		for (TastingCategory category : TastingCategory.values()) {
			double score = getScore(beginnerPref.getNosing(), category) * wNosing
				+ getScore(beginnerPref.getTasting(), category) * wTasting
				+ getScore(beginnerPref.getFinish(), category) * wFinish;

			userVector.put(category.name().toLowerCase(), score);
		}
		return userVector;
	}

	private double getScore(TastingProfile<Double> profile, TastingCategory category) {
		TastingComponent<Double> tastingComponent = profile.getComponent(category);

		return tastingComponent != null && tastingComponent.getScore() != null ? tastingComponent.getScore() : 0.0;
	}

	private Map<String, Double> extraWhiskyVector(Whisky whisky) {
		Map<String, Double> extraWhiskyVector = new HashMap<>();

		for (TastingCategory category : TastingCategory.values()) {
			double sum = 0.0;
			int count = 0;

			for (TastingProfile<Map<String, Double>> profile : List.of(whisky.getNosing(), whisky.getTasting(),
				whisky.getFinish())) {

				if (profile == null) {
					continue;
				}

				TastingComponent<Map<String, Double>> whiskyComponent = profile.getComponent(category);
				if (whiskyComponent != null && whiskyComponent.getData() != null) {
					for (Double value : whiskyComponent.getData().values()) {
						sum += value;
						count++;
					}
				}
			}
			extraWhiskyVector.put(category.name().toLowerCase(), count > 0 ? sum / count : 0.0);
		}
		return extraWhiskyVector;
	}

	// 사용자 벡터와 위스키 벡터 코사인 유사도 비교하기
	private Double cosineSimilarity(Map<String, Double> userVector, Map<String, Double> stringDoubleMap) {
		// 모든 키를 합치기
		Set<String> keys = new HashSet<>();
		keys.addAll(userVector.keySet());
		keys.addAll(stringDoubleMap.keySet());

		RealVector vec1 = new ArrayRealVector(keys.size());
		RealVector vec2 = new ArrayRealVector(keys.size());

		int idx = 0;
		for (String key : keys) {
			vec1.setEntry(idx, userVector.getOrDefault(key, 0.0));
			vec2.setEntry(idx, stringDoubleMap.getOrDefault(key, 0.0));
			idx++;
		}

		if (vec1.getNorm() == 0 || vec2.getNorm() == 0) {
			return 0.0;
		}
		return vec1.cosine(vec2);
	}
}
