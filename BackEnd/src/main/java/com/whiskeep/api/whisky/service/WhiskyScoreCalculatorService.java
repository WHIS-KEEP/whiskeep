package com.whiskeep.api.whisky.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.whiskeep.api.whisky.domain.Whisky;
import com.whiskeep.api.whisky.repository.WhiskyRepository;
import com.whiskeep.common.model.TastingProfile;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class WhiskyScoreCalculatorService {
	/* TODO 개발환경에서 한번만 실행시키고 주석처리
	 *   (DB에 적재후엔 안돌아가도록)	*/
	private final WhiskyRepository whiskyRepository;
	private static final double MAX_SCORE = 5.0;
	private static final double PERCENTILE = 0.95;

	/*애플리케이션 시작 시 위스키 점수 계산 실행*/

	//모든 위스키 점수를 계산
	public void saveAllWhiskyScores() {
		List<Whisky> allWhiskies = whiskyRepository.findAll();

		Map<String, Double> coefficients = calculateCoefficients(allWhiskies);

		coefficients.forEach((k, v) -> log.info(" {} = {}", k, v));

		for (Whisky w : allWhiskies) {
			updateWhiskyScore(w, coefficients);
			whiskyRepository.save(w);
		}

	}

	//위스키 업데이트
	private void updateWhiskyScore(Whisky whisky, Map<String, Double> coefficients) {
		//Nosing
		if (whisky.getNosing() != null) {
			update
		}
		//Tasting
		if (whisky.getNosing() != null) {
			update
		}
		//Finish
		if (whisky.getNosing() != null) {
			update
		}
	}

	//계수 계산하기
	private Map<String, Double> calculateCoefficients(List<Whisky> allWhiskies) {
		Map<String, Double> coefficients = new HashMap<>();

		Map<String, List<Double>> categoryValues = new HashMap<>();
		//초기화해주기
		initializeCategoryMap(categoryValues);

		for (Whisky whisky : allWhiskies) {
			extractFlavorValues(categoryValues, whisky.getNosing(), "nosing");
			extractFlavorValues(categoryValues, whisky.getTasting(), "tasting");
			extractFlavorValues(categoryValues, whisky.getFinish(), "finish");
		}

		//변환 계수 계산
		for (Map.Entry<String, List<Double>> entry : categoryValues.entrySet()) {
			String category = entry.getKey();
			List<Double> values = entry.getValue();

			if (!values.isEmpty()) {
				Collections.sort(values);
				//정렬된 값 목록에서 정확히 95% 위치에 있는 값 구하기
				int percentileIndex = (int)(values.size() * PERCENTILE);
				//안전장치
				if (percentileIndex >= values.size()) {
					percentileIndex = values.size() - 1;
				}
				double percentileValue = values.get(percentileIndex);

				double coefficient = percentileValue / MAX_SCORE;
				if (coefficient < 0.1) {
					coefficient = 0.1;
				}
				coefficients.put(category, coefficient);

			} else {
				coefficients.put(category, 1.0);
			}
		}

		return coefficients;

	}

	private void extractFlavorValues(Map<String, List<Double>> categoryValues,
		TastingProfile<Map<String, Double>> nosing, String nosing1) {
	}

	private void initializeCategoryMap(Map<String, List<Double>> categoryValues) {
		String[] categoryNames = {"fruity", "sweet", "spicy", "oaky", "herbal", "briny"};
		String[] types = {"nosing", "tasting", "finish"};

		for (String category : categoryNames) {
			for (String type : types) {
				categoryValues.put(category + "_" + type, new ArrayList<>());
			}
		}
	}

}
