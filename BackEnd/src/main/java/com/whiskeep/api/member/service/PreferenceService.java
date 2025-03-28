package com.whiskeep.api.member.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.whiskeep.api.member.domain.Member;
import com.whiskeep.api.member.domain.MemberPreference;
import com.whiskeep.api.member.dto.BeginnerPreferenceRequestDto;
import com.whiskeep.api.member.dto.FamiliarPreferenceRequestDto;
import com.whiskeep.api.member.repository.MemberPreferenceRepository;
import com.whiskeep.api.member.repository.MemberRepository;
import com.whiskeep.common.enumclass.TastingCategory;
import com.whiskeep.common.model.TastingComponent;
import com.whiskeep.common.model.TastingProfile;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PreferenceService {

	private final MemberRepository memberRepository;
	private final MemberPreferenceRepository memberPreferenceRepository;


	@Transactional
	public void createBeginnerPreferenceScore(BeginnerPreferenceRequestDto preferenceRequestDto) {
		// 사용자 검색
		Member member =
			memberRepository.findById(preferenceRequestDto.memberId()).orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "존재하지 않은 사용자입니다."));

		// 사용자의 맛 별 score(1~5점)
		BeginnerPreferenceRequestDto.TastingScoreRequest baseScore = preferenceRequestDto.tastingScore();

		// [nosing, tasting, finish] 순으로 1~3순위
		// 1순위 : 0.5, 2순위 : 0.3, 3순위 : 0.2
		List<Double> weights = preferenceRequestDto.preferenceOrder();


		// 1. 각 영역별 가중치 점수 구하기
		TastingProfile<Double> nosing = calculateWeightedProfile(baseScore, weights.get(0));
		TastingProfile<Double> tasting = calculateWeightedProfile(baseScore, weights.get(1));
		TastingProfile<Double> finish = calculateWeightedProfile(baseScore, weights.get(2));

		// 2. 가장 높은 가중치를 가진 note 찾기
		int topNoteIdx = 0;
		for (int i = 1; i < weights.size(); i++) {
			if (weights.get(i) > weights.get(topNoteIdx)) {
				topNoteIdx = i;
			}
		}

		TastingProfile<Double> topNote = switch (topNoteIdx) {
			case 0 -> nosing;
			case 1 -> tasting;
			case 2 -> finish;
			default -> throw new IllegalStateException("Invalid note index");
		};

		// 3. 그 note 내에서 가장 높은 category 점수 기준으로 scale
		double maxScore = List.of(
			topNote.getFruity().getScore(),
			topNote.getSweet().getScore(),
			topNote.getSpicy().getScore(),
			topNote.getOaky().getScore(),
			topNote.getHerbal().getScore(),
			topNote.getBriny().getScore()
		).stream().mapToDouble(Double::doubleValue).max().orElse(1.0);

		// 4. scale factor 계산
		double scaleFactor = 5.0 / maxScore;


		// 5. 정규화 팩터 적용 (비율은 유지하면서 점수 자체를 키우기)
		TastingProfile<Double> nomalizedNosing = scaleProfile(nosing, scaleFactor);
		TastingProfile<Double> nomalizedTasting = scaleProfile(tasting, scaleFactor);
		TastingProfile<Double> nomalizedFinish = scaleProfile(finish, scaleFactor);

		// 6. 보정된 score 값으로 DB에 저장
		MemberPreference memberPreference = MemberPreference.builder()
			.member(member)
			.nosing(nomalizedNosing)
			.tasting(nomalizedTasting)
			.finish(nomalizedFinish)
			.build();

		memberPreferenceRepository.save(memberPreference);
	}

	// 숙련자 선택한 위스키 기반 점수 계산
	public void createFamiliarPreferenceScore(FamiliarPreferenceRequestDto preferenceRequestDto) {

	}

	private TastingProfile<Double> scaleProfile(TastingProfile<Double> note, double scaleFactor) {
		return TastingProfile.<Double>builder()
			.fruity(scale(note.getFruity(), scaleFactor))
			.sweet(scale(note.getSweet(), scaleFactor))
			.spicy(scale(note.getSpicy(), scaleFactor))
			.oaky(scale(note.getOaky(), scaleFactor))
			.herbal(scale(note.getHerbal(), scaleFactor))
			.briny(scale(note.getBriny(), scaleFactor))
			.build();
	}

	private TastingComponent<Double> scale(TastingComponent<Double> component, double factor) {
		double scaledScore = component.getScore() * factor;

		// 점수의 최솟값 하한선 설정
		// 최소 2점 이상 보장
		scaledScore = Math.max(scaledScore, 2);

		return TastingComponent.<Double>builder()
			.score(scaledScore)
			.data(component.getData())
			.build();
	}

	private Map<TastingCategory, Double> sumProfile(TastingProfile<Double>... profiles) {
		Map<TastingCategory, Double> sum = new HashMap<>();

		for(TastingProfile<Double> profile : profiles) {
			sum.merge(TastingCategory.FRUITY, profile.getFruity().getScore(), Double::sum);
			sum.merge(TastingCategory.SWEET, profile.getSweet().getScore(), Double::sum);
			sum.merge(TastingCategory.SPICY, profile.getSpicy().getScore(), Double::sum);
			sum.merge(TastingCategory.OAKY, profile.getOaky().getScore(), Double::sum);
			sum.merge(TastingCategory.HERBAL, profile.getHerbal().getScore(), Double::sum);
			sum.merge(TastingCategory.BRINY, profile.getBriny().getScore(), Double::sum);
		}
		return sum;
	}

	private TastingProfile<Double> calculateWeightedProfile(BeginnerPreferenceRequestDto.TastingScoreRequest baseScore,
		Double weight) {
		return TastingProfile.<Double>builder()
			.fruity(makeComponent(TastingCategory.FRUITY, baseScore, weight))
			.sweet(makeComponent(TastingCategory.SWEET, baseScore, weight))
			.spicy(makeComponent(TastingCategory.SPICY, baseScore, weight))
			.oaky(makeComponent(TastingCategory.OAKY, baseScore, weight))
			.herbal(makeComponent(TastingCategory.HERBAL, baseScore, weight))
			.briny(makeComponent(TastingCategory.BRINY, baseScore, weight))
			.build();
	}

	private TastingComponent<Double> makeComponent(TastingCategory category,
		BeginnerPreferenceRequestDto.TastingScoreRequest baseScore,
		Double weight) {
		int rawScore = switch (category){
			case FRUITY -> baseScore.fruity();
			case SWEET -> baseScore.sweet();
			case SPICY -> baseScore.spicy();
			case OAKY -> baseScore.oaky();
			case HERBAL -> baseScore.herbal();
			case BRINY -> baseScore.briny();
		};

		return TastingComponent.<Double>builder()
			.score(rawScore * weight)
			.data(null)
			.build();
	}
}
