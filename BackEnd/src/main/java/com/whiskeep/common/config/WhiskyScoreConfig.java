package com.whiskeep.common.config;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.annotation.Transactional;

import com.whiskeep.api.whisky.domain.Whisky;
import com.whiskeep.api.whisky.repository.WhiskyRepository;
import com.whiskeep.common.cache.WhiskyStatusCache;
import com.whiskeep.common.enumclass.TastingCategory;
import com.whiskeep.common.exception.ErrorMessage;
import com.whiskeep.common.model.TastingComponent;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Configuration
@Slf4j
@RequiredArgsConstructor
public class WhiskyScoreConfig {
	/* TODO 개발환경에서 한번만 실행시키고 주석처리
	 *   (DB에 적재후엔 안돌아가도록)	*/
	private final WhiskyRepository whiskyRepository;
	private final WhiskyStatusCache whiskyStatusCache;
	private static final double MAX_SCORE = 5.0;
	private static final int TOP_N = 3;

	/*애플리케이션 시작 시 위스키 점수 계산 실행*/
	@Bean
	public CommandLineRunner runCalculator() {
		return args -> {

			if (true) {
				return;
			}
			log.info("Running whisky calculator...");
			saveAllWhiskyScores();
			log.info("Finished running whisky calculator...");
		};
	}

	@Transactional
	//모든 위스키 점수 계산
	public void saveAllWhiskyScores() {
		List<Whisky> allWhiskies = whiskyRepository.findAll();

		log.info("전체 위스키 수" + allWhiskies.size());

		int errorCnt = 0;

		try {
			//각 위스키 계산
			for (Whisky whisky : allWhiskies) {
				updateWhiskyScoreWithNormalizedTopN(whisky);

				//로그출력용
				logWhiskyScores(whisky);
				//저장
				whiskyRepository.save(whisky);
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

	// 점수 로그로 출력하는 메서드
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

	// 위스키 업데이트하기 - 수정 버전
	private void updateWhiskyScoreWithNormalizedTopN(Whisky whisky) {
		// Nosing 업데이트
		if (whisky.getNosing() != null) {
			normalizedTopNScore(whisky.getNosing().getFruity(), TastingCategory.FRUITY);
			normalizedTopNScore(whisky.getNosing().getSweet(), TastingCategory.SWEET);
			normalizedTopNScore(whisky.getNosing().getOaky(), TastingCategory.OAKY);
			normalizedTopNScore(whisky.getNosing().getSpicy(), TastingCategory.SPICY);
			normalizedTopNScore(whisky.getNosing().getBriny(), TastingCategory.BRINY);
			normalizedTopNScore(whisky.getNosing().getHerbal(), TastingCategory.HERBAL);
		}

		// Tasting 업데이트
		if (whisky.getTasting() != null) {
			normalizedTopNScore(whisky.getTasting().getFruity(), TastingCategory.FRUITY);
			normalizedTopNScore(whisky.getTasting().getSweet(), TastingCategory.SWEET);
			normalizedTopNScore(whisky.getTasting().getOaky(), TastingCategory.OAKY);
			normalizedTopNScore(whisky.getTasting().getSpicy(), TastingCategory.SPICY);
			normalizedTopNScore(whisky.getTasting().getBriny(), TastingCategory.BRINY);
			normalizedTopNScore(whisky.getTasting().getHerbal(), TastingCategory.HERBAL);
		}

		// Finish 업데이트
		if (whisky.getFinish() != null) {
			normalizedTopNScore(whisky.getFinish().getFruity(), TastingCategory.FRUITY);
			normalizedTopNScore(whisky.getFinish().getSweet(), TastingCategory.SWEET);
			normalizedTopNScore(whisky.getFinish().getOaky(), TastingCategory.OAKY);
			normalizedTopNScore(whisky.getFinish().getSpicy(), TastingCategory.SPICY);
			normalizedTopNScore(whisky.getFinish().getBriny(), TastingCategory.BRINY);
			normalizedTopNScore(whisky.getFinish().getHerbal(), TastingCategory.HERBAL);
		}
	}

	// 정규화된 상위 N개 평균 계산 - 카테고리 파라미터 추가
	private void normalizedTopNScore(TastingComponent<Map<String, Double>> component, TastingCategory category) {
		if (component == null || component.getData() == null || component.getData().isEmpty()) {
			// 데이터가 없으면 점수 0 설정
			component.setScore(0.0);
			return;
		}

		// 상위 N개 평균 계산
		List<Double> values = new ArrayList<>(component.getData().values());
		values.removeIf(Objects::isNull);
		Collections.sort(values, Collections.reverseOrder());

		int topN = Math.min(TOP_N, values.size());
		double topNSum = 0.0;
		for (int i = 0; i < topN; i++) {
			topNSum += values.get(i);
		}
		double topNAvg = topN > 0 ? topNSum / topN : 0.0;

		// WhiskyStatusCache에서 해당 카테고리의 최대값 가져오기
		double maxValue = whiskyStatusCache.getCategoryMaxMap().getOrDefault(category, 1.0);

		// 정규화
		double normalized = topNAvg / maxValue;

		// MemberScoreCalculator와 동일한 스케일링 적용
		double score = Math.sqrt(normalized) * 5.0 + 0.5;
		score = Math.min(score, MAX_SCORE);

		component.setScore(score);
	}
}
