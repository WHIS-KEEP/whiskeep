package com.whiskeep.common.util;

import java.util.Random;

import org.springframework.stereotype.Component;

@Component
public class NicknameGenerator {
	// 위스키 느낌의 형용사
	private static final String[] adjectives = {
		"숙성된", "은은한", "강렬한", "스모키한", "싱글몰트", "더블캐스크", "탄내나는", "묵직한", "달콤한", "짙은",
		"피트향", "오크향", "헤이즐넛", "토프향", "캐스크강도", "크리미한", "말트향", "리치한", "프루티한", "탄탄한"
	};

	// 위스키 관련 명사 (브랜드, 재료, 특징 등)
	private static final String[] nouns = {
		"글렌피딕", "라프로익", "맥켈란", "아드벡", "버번", "오크통", "피트", "몰트", "위스키잔", "디캔터",
		"타락한캐스크", "하이볼", "싱글몰트", "더블우드", "브루클라디", "탐나불린", "카스크", "헬리야", "제임슨", "탈리스커"
	};

	// 랜덤 닉네임 생성 (400,000개)
	public String generateNickname() {
		Random random = new Random();

		String adjective = adjectives[random.nextInt(adjectives.length)];
		String noun = nouns[random.nextInt(nouns.length)];
		int number = random.nextInt(1000);

		return adjective + noun + number;
	}
}
