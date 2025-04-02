package com.whiskeep.common.cache;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.whiskeep.api.whisky.domain.Whisky;
import com.whiskeep.api.whisky.repository.WhiskyRepository;
import com.whiskeep.common.enumclass.TastingCategory;
import com.whiskeep.common.model.TastingComponent;
import com.whiskeep.common.model.TastingProfile;

import jakarta.annotation.PostConstruct;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Component
@Getter
@RequiredArgsConstructor
public class WhiskyStatusCache {

	private final WhiskyRepository whiskyRepository;
	private Map<TastingCategory, Double> categoryMaxMap;

	private static final int TOP_K = 3; // TOP-K 평균에서 K 값

	// 최초 1회 실행 후 MaxMap에 저장
	@PostConstruct
	public void init() {
		this.categoryMaxMap = calculateMaxMap();
	}

	// 전체 위스키 DB를 돌면서 TastingCategory의 최대 평균 점수 계산
	// Top-K 방식 활용
	private Map<TastingCategory, Double> calculateMaxMap() {

		List<Whisky> whiskyList = whiskyRepository.findAll();
		Map<TastingCategory, List<Double>> categoryToTopAvgList = new EnumMap<>(TastingCategory.class);

		for (Whisky whisky : whiskyList) {
			for (String type : List.of("nosing", "tasting", "finish")) {
				TastingProfile<Map<String, Double>> profile = getProfileByType(type, whisky);

				for (TastingCategory category : TastingCategory.values()) {
					TastingComponent<Map<String, Double>> component = profile.getComponent(category);

					if (component == null || component.getData() == null) {
						continue;
					}

					List<Double> sortedTopK = component.getData()
						.values()
						.stream()
						.sorted(Comparator.reverseOrder())
						.toList();

					int finalTopK = Math.min(sortedTopK.size(), TOP_K); // 카테코리 내 데이터가 3개보다 낮을 경우,
					double avgTopK = sortedTopK.stream()
						.limit(finalTopK)
						.mapToDouble(Double::doubleValue)
						.average()
						.orElse(0.0);

					categoryToTopAvgList.computeIfAbsent(category, c -> new ArrayList<>()).add(avgTopK);
				}

			}
		}
		// 카테고리별 Top-K 평균 중 가장 높은 값 사용
		Map<TastingCategory, Double> maxMap = new EnumMap<>(TastingCategory.class);
		for (TastingCategory category : TastingCategory.values()) {
			List<Double> values = categoryToTopAvgList.getOrDefault(category, Collections.emptyList());
			double max = values.stream().mapToDouble(Double::doubleValue).max().orElse(1.0);
			maxMap.put(category, max);
		}

		return maxMap;

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
