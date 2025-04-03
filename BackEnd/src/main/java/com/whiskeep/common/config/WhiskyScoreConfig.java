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
import com.whiskeep.common.exception.ErrorMessage;
import com.whiskeep.common.model.TastingComponent;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Configuration
@Slf4j
@RequiredArgsConstructor
public class WhiskyScoreConfig{
	/* TODO 개발환경에서 한번만 실행시키고 주석처리
	 *   (DB에 적재후엔 안돌아가도록)	*/
	private final WhiskyRepository whiskyRepository;
	private static final double MAX_SCORE = 5.0;
	private static final int TOP_N = 3;

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

	//위스키 업데이트하기
	private void updateWhiskyScoreWithNormalizedTopN(Whisky whisky) {

		// Nosing 업데이트
		if (whisky.getNosing() != null) {
			normalizedTopNScore(whisky.getNosing().getFruity());
			normalizedTopNScore(whisky.getNosing().getSweet());
			normalizedTopNScore(whisky.getNosing().getOaky());
			normalizedTopNScore(whisky.getNosing().getSpicy());
			normalizedTopNScore(whisky.getNosing().getBriny());
			normalizedTopNScore(whisky.getNosing().getHerbal());
		}

		// Tasting 업데이트
		if (whisky.getTasting() != null) {
			normalizedTopNScore(whisky.getTasting().getFruity());
			normalizedTopNScore(whisky.getTasting().getSweet());
			normalizedTopNScore(whisky.getTasting().getOaky());
			normalizedTopNScore(whisky.getTasting().getSpicy());
			normalizedTopNScore(whisky.getTasting().getBriny());
			normalizedTopNScore(whisky.getTasting().getHerbal());
		}

		// Finish 업데이트
		if (whisky.getFinish() != null) {
			normalizedTopNScore(whisky.getFinish().getFruity());
			normalizedTopNScore(whisky.getFinish().getSweet());
			normalizedTopNScore(whisky.getFinish().getOaky());
			normalizedTopNScore(whisky.getFinish().getSpicy());
			normalizedTopNScore(whisky.getFinish().getBriny());
			normalizedTopNScore(whisky.getFinish().getHerbal());
		}
	}

	// 정규화된 상위 N개 평균 계산
	private void normalizedTopNScore(TastingComponent<Map<String, Double>> category) {
		if (category == null || category.getData() == null || category.getData().isEmpty()) {
			// 데이터가 없으면 점수 0 설정
			category.setScore(0.0);
			return;
		}

		// 상위 N개 평균 계산
		List<Double> values = new ArrayList<>(category.getData().values());
		values.removeIf(Objects::isNull);
		Collections.sort(values, Collections.reverseOrder());

		int topN = Math.min(TOP_N, values.size());
		double topNSum = 0.0;
		for (int i = 0; i < topN; i++) {
			topNSum += values.get(i);
		}
		double topNAvg = topN > 0 ? topNSum / topN : 0.0;

		// 항목 수와 총합에 따른 가중치 계산
		int totalItems = category.getData().size();
		double totalSum = category.getData().values().stream()
			.filter(Objects::nonNull)
			.mapToDouble(Double::doubleValue)
			.sum();

		// 항목 수 가중치 (로그 스케일)
		double itemCountFactor = Math.log(1 + totalItems) / Math.log(10);

		// 총합 가중치 (로그 스케일)
		double sumFactor = Math.log1p(totalSum) / Math.log1p(15); // 최대 예상 합계를 15로 가정

		// 복합 가중치 (항목 수 40%, 총합 60% 반영)
		double combinedFactor = (itemCountFactor * 0.4) + (sumFactor * 0.6);

		// 최종 점수 계산
		double score = Math.min(MAX_SCORE, topNAvg * combinedFactor);

		category.setScore(score);
	}

}
