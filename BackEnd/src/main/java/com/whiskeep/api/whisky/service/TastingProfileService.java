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
		Map<String, Double> score = new HashMap<>();

		addEachCategory(score, "Fruity", notes.getFruity());
		addEachCategory(score, "Sweet", notes.getSweet());
		addEachCategory(score, "Spicy", notes.getSpicy());
		addEachCategory(score, "Herbal", notes.getHerbal());
		addEachCategory(score, "Briny", notes.getBriny());
		addEachCategory(score, "Oaky", notes.getOaky());

		return score.entrySet().stream()
			.sorted(Map.Entry.<String, Double>comparingByValue().reversed())
			.limit(3)
			.map(Map.Entry::getKey)
			.collect(Collectors.toList());
	}

	private void addEachCategory(Map<String, Double> noteMap, String categoryName,
		TastingComponent<Map<String, Double>> component) {
		noteMap.put(categoryName, component.getScore());
	}
}
