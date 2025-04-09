package com.whiskeep.api.recommend.service;

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

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
import com.whiskeep.common.util.CosineSimilarityUtil;

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

		// 중복된 한글이름(koName) 제거 위한 Set
		Set<String> seenKoNames = new HashSet<>();

		// 4. 모든 위스키에 대한 유사도 계산 후 sort 하여 추천 리스트 생성하기
		List<RecommendResponseDto> recommendList = allWhiskies.stream()
			.map(whisky -> RecommendResponseDto.builder()
				.whiskyId(whisky.getWhiskyId())
				.koName(whisky.getKoName())
				.enName(whisky.getEnName())
				.type(whisky.getType())
				.whiskyImg(whisky.getWhiskyImg())
				.abv(whisky.getAbv())
				.similarity(CosineSimilarityUtil.calculateCosineSimilarity(userVector, extraWhiskyVector(whisky))) //
				// 사용자 벡터와 위스키 벡터 사이 코사인 유사도 검사
				.build())
			.filter(dto -> seenKoNames.add(dto.getKoName()))
			.sorted((a, b) -> Double.compare(b.getSimilarity(), a.getSimilarity()))
			.limit(5)
			.toList();

		return RecommendedListResponseDto.builder().recommendList(recommendList).build();
	}

	// 초보자 점수 기반 벡터 만들기
	private Map<String, Double> buildUserVector(MemberPreference beginnerPref) {
		Map<String, Double> userVector = new HashMap<>();
		List<Double> weights = beginnerPref.getPreferenceOrder();

		// 총합을 기준으로 정규화하여 가중치 계산
		double totalWeight = weights.stream().mapToDouble(Double::doubleValue).sum();
		double wNosing = weights.get(0) / totalWeight;
		double wTasting = weights.get(1) / totalWeight;
		double wFinish = weights.get(2) / totalWeight;

		// TastingCategory에 대한 가중합 점수 계산
		for (TastingCategory category : TastingCategory.values()) {
			double score = getScore(beginnerPref.getNosing(), category) * wNosing
				+ getScore(beginnerPref.getTasting(), category) * wTasting
				+ getScore(beginnerPref.getFinish(), category) * wFinish;

			// toLowerCase() : 키 이름 통일 및 일관성 유지를 위해
			userVector.put(category.name().toLowerCase(), score);
		}
		return userVector;
	}

	// 각 TastingCategory 별로 score 가져오기
	private double getScore(TastingProfile<Double> profile, TastingCategory category) {
		TastingComponent<Double> tastingComponent = profile.getComponent(category);

		return tastingComponent != null && tastingComponent.getScore() != null ? tastingComponent.getScore() : 0.0;
	}

	// 위스키 하나에 대한 카테고리별 평균 점수 기반으로 벡터 추출하는 메서드
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

}
