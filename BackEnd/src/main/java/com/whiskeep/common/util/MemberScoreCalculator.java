package com.whiskeep.common.util;

import java.util.Comparator;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.whiskeep.api.whisky.domain.Whisky;
import com.whiskeep.common.cache.WhiskyStatusCache;
import com.whiskeep.common.enumclass.TastingCategory;
import com.whiskeep.common.model.TastingComponent;
import com.whiskeep.common.model.TastingProfile;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class MemberScoreCalculator {

	private final WhiskyStatusCache whiskyStatusCache;

	// 사용자가 선택한 위스키 맛 데이터 바탕으로 사용자 점수 계산
	// Top-K 평균 -> 정규화 (Max 값 활용) -> 1~5점으로 스케일링
	public Map<TastingCategory, Double> calculateProfileScore(List<Whisky> whiskyList,
		List<Double> ratingList, String type) {
		Map<TastingCategory, Double> weightedTotal = new EnumMap<>(TastingCategory.class);
		Map<TastingCategory, Double> totalWeight = new EnumMap<>(TastingCategory.class);

		for (int idx = 0; idx < whiskyList.size(); idx++) {
			Whisky whisky = whiskyList.get(idx);
			double weight = ratingList.get(idx) / 5.0; // 평점 1~5점 => 가중치 계산

			TastingProfile<Map<String, Double>> profile = getProfileByType(type, whisky);

			for (TastingCategory category : TastingCategory.values()) {
				TastingComponent<Map<String, Double>> comp = profile.getComponent(category);
				if (comp == null || comp.getData() == null) {
					continue;
				}

				List<Double> topK = comp.getData().values().stream()
					.sorted(Comparator.reverseOrder())
					.limit(3)
					.toList();

				double avgTopK = topK.stream().mapToDouble(d -> d).average().orElse(0.0);

				weightedTotal.merge(category, avgTopK * weight, Double::sum);
				totalWeight.merge(category, weight, Double::sum);
			}
		}

		Map<TastingCategory, Double> maxMap = whiskyStatusCache.getCategoryMaxMap();
		Map<TastingCategory, Double> scaledScores = new EnumMap<>(TastingCategory.class);

		for (TastingCategory category : TastingCategory.values()) {
			if (!weightedTotal.containsKey(category)) {
				continue;
			}
			double avg = weightedTotal.get(category) / totalWeight.get(category);
			double max = maxMap.getOrDefault(category, 1.0);

			double normalized = avg / max;
			double scaled = Math.sqrt(normalized) * 5.0 + 0.5;

			scaledScores.put(category, Math.min(scaled, 5.0)); // 최대 5점으로 제한
		}

		return scaledScores;
	}

	private TastingProfile<Map<String, Double>> getProfileByType(String type, Whisky whisky) {
		return switch (type) {
			case "nosing" -> whisky.getNosing();
			case "tasting" -> whisky.getTasting();
			case "finish" -> whisky.getFinish();
			default -> throw new IllegalStateException("Unexpected value: " + type);
		};
	}
}
