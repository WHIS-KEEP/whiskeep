package com.whiskeep.api.member.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.whiskeep.api.member.domain.Member;
import com.whiskeep.api.member.domain.MemberPreference;
import com.whiskeep.api.member.dto.BeginnerPreferenceRequestDto;
import com.whiskeep.api.member.dto.FamiliarPreferenceRequestDto;
import com.whiskeep.api.member.repository.MemberPreferenceRepository;
import com.whiskeep.api.member.repository.MemberRepository;
import com.whiskeep.common.exception.BadRequestException;
import com.whiskeep.common.exception.ErrorMessage;
import com.whiskeep.common.model.TastingComponent;
import com.whiskeep.common.model.TastingProfile;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PreferenceService {

	private final MemberRepository memberRepository;
	private final MemberPreferenceRepository memberPreferenceRepository;

	@Transactional
	public void createBeginnerPreferenceScore(BeginnerPreferenceRequestDto preferenceRequestDto, Member member) {
		// 사용자 검색
		if (memberPreferenceRepository.existsByMember(member)) {
			throw new BadRequestException(ErrorMessage.PREFERENCE_ALREADY_REGISTERED);
		}

		// 사용자의 맛 별 score(1~5점)
		BeginnerPreferenceRequestDto.TastingScoreRequest baseScore = preferenceRequestDto.tastingScore();

		// 1. 각 영역별 가중치 점수 구하기
		TastingProfile<Double> nosing = createSimpleProfile(baseScore);
		TastingProfile<Double> tasting = createSimpleProfile(baseScore);
		TastingProfile<Double> finish = createSimpleProfile(baseScore);

		// 6. 보정된 score 값으로 DB에 저장
		MemberPreference memberPreference = MemberPreference.builder()
			.member(member)
			.nosing(nosing)
			.tasting(tasting)
			.finish(finish)
			.build();

		memberPreferenceRepository.save(memberPreference);
	}

	private TastingProfile<Double> createSimpleProfile(BeginnerPreferenceRequestDto.TastingScoreRequest baseScore) {
		return TastingProfile.<Double>builder()
			.fruity(simpleComponent(baseScore.fruity()))
			.sweet(simpleComponent(baseScore.sweet()))
			.spicy(simpleComponent(baseScore.spicy()))
			.oaky(simpleComponent(baseScore.oaky()))
			.herbal(simpleComponent(baseScore.herbal()))
			.briny(simpleComponent(baseScore.briny()))
			.build();
	}

	private TastingComponent<Double> simpleComponent(Integer score) {
		return TastingComponent.<Double>builder()
			.score(score.doubleValue()) // 그냥 Double로 변환
			.data(null) // 추후 분석 데이터 필요 시 사용
			.build();
	}

	// 숙련자 선택한 위스키 기반 점수 계산
	public void createFamiliarPreferenceScore(FamiliarPreferenceRequestDto preferenceRequestDto) {

	}

	// private TastingProfile<Double> scaleProfile(TastingProfile<Double> note, double scaleFactor) {
	// 	return TastingProfile.<Double>builder()
	// 		.fruity(scale(note.getFruity(), scaleFactor))
	// 		.sweet(scale(note.getSweet(), scaleFactor))
	// 		.spicy(scale(note.getSpicy(), scaleFactor))
	// 		.oaky(scale(note.getOaky(), scaleFactor))
	// 		.herbal(scale(note.getHerbal(), scaleFactor))
	// 		.briny(scale(note.getBriny(), scaleFactor))
	// 		.build();
	// }
	//
	// private TastingComponent<Double> scale(TastingComponent<Double> component, double factor) {
	// 	double scaledScore = component.getScore() * factor;
	//
	// 	// 점수의 최솟값 하한선 설정
	// 	// 최소 2점 이상 보장
	// 	scaledScore = Math.max(scaledScore, 2);
	//
	// 	return TastingComponent.<Double>builder()
	// 		.score(scaledScore)
	// 		.data(component.getData())
	// 		.build();
	// }
	//
	// private Map<TastingCategory, Double> sumProfile(TastingProfile<Double>... profiles) {
	// 	Map<TastingCategory, Double> sum = new HashMap<>();
	//
	// 	for (TastingProfile<Double> profile : profiles) {
	// 		sum.merge(TastingCategory.FRUITY, profile.getFruity().getScore(), Double::sum);
	// 		sum.merge(TastingCategory.SWEET, profile.getSweet().getScore(), Double::sum);
	// 		sum.merge(TastingCategory.SPICY, profile.getSpicy().getScore(), Double::sum);
	// 		sum.merge(TastingCategory.OAKY, profile.getOaky().getScore(), Double::sum);
	// 		sum.merge(TastingCategory.HERBAL, profile.getHerbal().getScore(), Double::sum);
	// 		sum.merge(TastingCategory.BRINY, profile.getBriny().getScore(), Double::sum);
	// 	}
	// 	return sum;
	// }
	//
	// private TastingProfile<Double> calculateWeightedProfile
	// (BeginnerPreferenceRequestDto.TastingScoreRequest baseScore, Double weight) {
	// 	return TastingProfile.<Double>builder()
	// 		.fruity(makeComponent(TastingCategory.FRUITY, baseScore, weight))
	// 		.sweet(makeComponent(TastingCategory.SWEET, baseScore, weight))
	// 		.spicy(makeComponent(TastingCategory.SPICY, baseScore, weight))
	// 		.oaky(makeComponent(TastingCategory.OAKY, baseScore, weight))
	// 		.herbal(makeComponent(TastingCategory.HERBAL, baseScore, weight))
	// 		.briny(makeComponent(TastingCategory.BRINY, baseScore, weight))
	// 		.build();
	// }
	//
	// private TastingComponent<Double> makeComponent(TastingCategory category,
	// 	BeginnerPreferenceRequestDto.TastingScoreRequest baseScore,
	// 	Double weight) {
	// 	int rawScore = switch (category) {
	// 		case FRUITY -> baseScore.fruity();
	// 		case SWEET -> baseScore.sweet();
	// 		case SPICY -> baseScore.spicy();
	// 		case OAKY -> baseScore.oaky();
	// 		case HERBAL -> baseScore.herbal();
	// 		case BRINY -> baseScore.briny();
	// 	};
	//
	// 	return TastingComponent.<Double>builder()
	// 		.score(rawScore * weight)
	// 		.data(null)
	// 		.build();
	// }
}
