package com.whiskeep.api.whisky.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.whiskeep.common.model.TastingComponent;
import com.whiskeep.common.model.TastingProfile;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class TastingProfileService {

	public List<String> extractTopFeatures(TastingProfile<Map<String, Double>> notes) {

		Map<String, Double> allFeatures = new HashMap<>();
		// 6가지 카테고리 별 데이터들을 하나의 맵에 다 추가하기
		addFeatures(allFeatures, notes.getFruity());
		addFeatures(allFeatures, notes.getSweet());
		addFeatures(allFeatures, notes.getSpicy());
		addFeatures(allFeatures, notes.getHerbal());
		addFeatures(allFeatures, notes.getBriny());
		addFeatures(allFeatures, notes.getOaky());

		return allFeatures.entrySet().stream()
			.filter(entry -> entry.getValue() > 0)
			.sorted(Map.Entry.<String, Double>comparingByValue().reversed())
			.limit(3)
			.map(Map.Entry::getKey)
			.collect(Collectors.toList());
	}

	//6개 카테고리의 총점 내는 로직 (그래프 그리기 위한 용)
	private void calculateCategories(Map<String, Double> categoryScores, String categoryName,
		TastingComponent<Map<String, Double>> categoryDetails) {

		if (categoryDetails == null) {
			return;
		}
		Map<String, Double> data = categoryDetails.getData();

	}

	// 데이터들 하나의 맵에 더하기
	private void addFeatures(Map<String, Double> allFeatures,
		TastingComponent<Map<String, Double>> component) {

		if (component == null) {
			return;
		}

		Map<String, Double> features = component.getData();
		if (features != null) {
			features.forEach((feature, value) -> {
				if (value != null && value > 0) {
					allFeatures.put(feature, value);
				}
			});
		}
	}
}
