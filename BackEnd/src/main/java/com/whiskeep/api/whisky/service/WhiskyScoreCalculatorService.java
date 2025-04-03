package com.whiskeep.api.whisky.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.annotation.Transactional;

import com.whiskeep.api.whisky.domain.Whisky;
import com.whiskeep.api.whisky.repository.WhiskyRepository;
import com.whiskeep.common.exception.ErrorMessage;
import com.whiskeep.common.model.TastingComponent;
import com.whiskeep.common.model.TastingProfile;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Configuration
@Slf4j
@RequiredArgsConstructor
public class WhiskyScoreCalculatorService {
	/* TODO 개발환경에서 한번만 실행시키고 주석처리
	 *   (DB에 적재후엔 안돌아가도록)	*/
	private final WhiskyRepository whiskyRepository;
	private static final double MAX_SCORE = 5.0;
	private static final double PERCENTILE = 0.9;
	private static final double MIN_COEFFICIENT = 0.8;


	/*애플리케이션 시작 시 위스키 점수 계산 실행*/
	@Bean
	public CommandLineRunner runCalculator() {
		return args -> {

			// if(true) return;
			log.info("Running whisky calculator...");
			saveAllWhiskyScores();
			log.info("Finished running whisky calculator...");
		};
	}

	@Transactional
	//모든 위스키 점수를 계산
	public void saveAllWhiskyScores() {
		List<Whisky> allWhiskies = whiskyRepository.findAll();

		log.info("전체 위스키 수" + allWhiskies.size());
		//계수 계산
		Map<String, Double> coefficients = calculateCoefficients(allWhiskies);

		coefficients.forEach((k, v) -> log.info(" {} = {}", k, v));

		int errorCnt = 0;

		try {
			//각 위스키 계산
			for (Whisky whisky : allWhiskies) {
				//고정계수로 점수 계산
				updateWhiskyScore(whisky, coefficients);
				//로그출력
				logWhiskyScores(whisky);
				//저장
				// whiskyRepository.save(whisky);
			}
		} catch (Exception e) {
			log.error("위스키 점수 계산 중 오류 발생: {}", ErrorMessage.UNEXPECTED_ERROR.getMessage(), e);
			errorCnt++;
			log.info("오류 발생 건수: {}", errorCnt);
		}

	}

	//테스트용
	private double getScore(TastingComponent<Map<String, Double>> component) {
		return component != null ? (component.getScore() != null ? component.getScore() : 0.0) : 0.0;
	}

	// 계산된 점수를 로그로 출력하는 메서드
	private void logWhiskyScores(Whisky whisky) {
		log.info("위스키 [{}][{}] 점수 결과:", whisky.getWhiskyId(), whisky.getKoName());

		if (whisky.getNosing() != null) {
			log.info("  Nosing - F:{}, S:{}, O:{}, Sp:{}, B:{}, H:{}",
				getScore(whisky.getNosing().getFruity()),
				getScore(whisky.getNosing().getSweet()),
				getScore(whisky.getNosing().getOaky()),
				getScore(whisky.getNosing().getSpicy()),
				getScore(whisky.getNosing().getBriny()),
				getScore(whisky.getNosing().getHerbal()));
		}

		if (whisky.getTasting() != null) {
			log.info("  Tasting - F:{}, S:{}, O:{}, Sp:{}, B:{}, H:{}",
				getScore(whisky.getTasting().getFruity()),
				getScore(whisky.getTasting().getSweet()),
				getScore(whisky.getTasting().getOaky()),
				getScore(whisky.getTasting().getSpicy()),
				getScore(whisky.getTasting().getBriny()),
				getScore(whisky.getTasting().getHerbal()));
		}

		if (whisky.getFinish() != null) {
			log.info("  Finish - F:{}, S:{}, O:{}, Sp:{}, B:{}, H:{}",
				getScore(whisky.getFinish().getFruity()),
				getScore(whisky.getFinish().getSweet()),
				getScore(whisky.getFinish().getOaky()),
				getScore(whisky.getFinish().getSpicy()),
				getScore(whisky.getFinish().getBriny()),
				getScore(whisky.getFinish().getHerbal()));
		}
	}

	//위스키 업데이트하기
	private void updateWhiskyScore(Whisky whisky, Map<String, Double> coefficients) {

		//Nosing 업데이트
		if (whisky.getNosing() != null) {
			updateCategoryScore("fruity_nosing", whisky.getNosing().getFruity(), coefficients);
			updateCategoryScore("sweet_nosing", whisky.getNosing().getSweet(), coefficients);
			updateCategoryScore("oaky_nosing", whisky.getNosing().getOaky(), coefficients);
			updateCategoryScore("spicy_nosing", whisky.getNosing().getSpicy(), coefficients);
			updateCategoryScore("briny_nosing", whisky.getNosing().getBriny(), coefficients);
			updateCategoryScore("herbal_nosing", whisky.getNosing().getHerbal(), coefficients);
		}
		//Tasting
		if (whisky.getTasting() != null) {
			updateCategoryScore("fruity_tasting", whisky.getTasting().getFruity(), coefficients);
			updateCategoryScore("sweet_tasting", whisky.getTasting().getSweet(), coefficients);
			updateCategoryScore("oaky_tasting", whisky.getTasting().getOaky(), coefficients);
			updateCategoryScore("spicy_tasting", whisky.getTasting().getSpicy(), coefficients);
			updateCategoryScore("briny_tasting", whisky.getTasting().getBriny(), coefficients);
			updateCategoryScore("herbal_tasting", whisky.getTasting().getHerbal(), coefficients);
		}
		//Finish
		if (whisky.getFinish() != null) {
			updateCategoryScore("fruity_finish", whisky.getFinish().getFruity(), coefficients);
			updateCategoryScore("sweet_finish", whisky.getFinish().getSweet(), coefficients);
			updateCategoryScore("oaky_finish", whisky.getFinish().getOaky(), coefficients);
			updateCategoryScore("spicy_finish", whisky.getFinish().getSpicy(), coefficients);
			updateCategoryScore("briny_finish", whisky.getFinish().getBriny(), coefficients);
			updateCategoryScore("herbal_finish", whisky.getFinish().getHerbal(), coefficients);

		}
	}

	private void updateCategoryScore(String categoryKey, TastingComponent<Map<String, Double>> category, Map<String,
		Double> coefficients) {
		if (category == null || category.getData() == null) {
			return;
		}

		//카테고리 별 세부데이터들 합산
		double sum = category.getData().values().stream()
			.filter(Objects::nonNull)
			.mapToDouble(Double::doubleValue)
			.sum();

		double coefficient = coefficients.getOrDefault(categoryKey, 1.0);
		double score;

		//제곱근 형식 적용
		double sqrtCoefficient = Math.sqrt(coefficient * MAX_SCORE);
		score = Math.min(MAX_SCORE, Math.sqrt(sum) * (MAX_SCORE / sqrtCoefficient));

		category.setScore(score);
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

		//변환 계수 계산 - 각 카테고리 별
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
				if (coefficient < MIN_COEFFICIENT) {
					coefficient = MIN_COEFFICIENT;
				}
				coefficients.put(entry.getKey(), coefficient);

			} else {
				coefficients.put(category, 1.0);
			}
		}

		return coefficients;

	}

	//6가지 카테고리의 맛데이터 다 추출
	private void extractFlavorValues(Map<String, List<Double>> categoryValues,
		TastingProfile<Map<String, Double>> category, String type) {
		if (category == null) {
			return;
		}
		putFlavorsToGroup(categoryValues, "fruity_" + type, category.getFruity());
		putFlavorsToGroup(categoryValues, "sweet_" + type, category.getSweet());
		putFlavorsToGroup(categoryValues, "oaky_" + type, category.getOaky());
		putFlavorsToGroup(categoryValues, "briny_" + type, category.getBriny());
		putFlavorsToGroup(categoryValues, "herbal_" + type, category.getHerbal());
		putFlavorsToGroup(categoryValues, "spicy_" + type, category.getSpicy());
	}

	private void putFlavorsToGroup(Map<String, List<Double>> categoryValues, String categoryKey,
		TastingComponent<Map<String, Double>> component) {
		if (component == null || component.getData() == null) {
			return;
		}
		double sum = component.getData().values().stream()
			.filter(Objects::nonNull)
			.mapToDouble(Double::doubleValue)
			.sum();

		if (sum > 0) {
			categoryValues.get(categoryKey).add(sum);
		}
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
