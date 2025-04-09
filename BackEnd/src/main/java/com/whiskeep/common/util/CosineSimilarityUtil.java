package com.whiskeep.common.util;

import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import org.apache.commons.math3.linear.ArrayRealVector;
import org.apache.commons.math3.linear.RealVector;

public class CosineSimilarityUtil {

	/**
	 * 	두 개의 벡터 기반으로 코사인 유사도 계산하는 메서드
	 *
	 * @param vector1 사용자 또는 기준 벡터
	 * @param vector2 비교 대상 벡터(위스키)
	 * @return 코사인 유사도 값 (0.0 ~ 1.0 사이의 값)
	 */
	public static double calculateCosineSimilarity(Map<String, Double> vector1, Map<String, Double> vector2) {
		// 1. 두 벡터의 key를 모두 합쳐서 하나의 feature(공통 기준)을 정의
		Set<String> keys = new HashSet<>();
		keys.addAll(vector1.keySet());
		keys.addAll(vector2.keySet());

		// 2. feature 크기 만큼 빈 벡터를 생성 (Apache Commons Math의 실수 벡터)
		RealVector vec1 = new ArrayRealVector(keys.size());
		RealVector vec2 = new ArrayRealVector(keys.size());

		// 3. 모든 key를 돌면서 순서대로 value를 채움 (key가 없는 경우, 0.0 )
		int idx = 0;
		for (String key : keys) {
			vec1.setEntry(idx, vector1.getOrDefault(key, 0.0));
			vec2.setEntry(idx, vector2.getOrDefault(key, 0.0));
			idx++;
		}

		// 4. 두 벡터 중 하나라도 크기가 0일 경우, 유사도 정의 X
		if (vec1.getNorm() == 0 || vec2.getNorm() == 0) {
			return 0.0;
		}

		// 5. Apache Commons Math의 cosine 메서드 사용 => 코사인 유사도 계산
		// cosine = (A · B) / (||A|| * ||B||)
		return vec1.cosine(vec2);

	}
}
