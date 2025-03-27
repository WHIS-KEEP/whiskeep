package com.whiskeep.api.member.service;

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
		Map<String, Integer> baseScore = preferenceRequestDto.tastingScore();
		List<Double> weights = preferenceRequestDto.preferenceOrder();

		TastingProfile<Double> nosing = calculateWeightedProfile(baseScore, weights.get(0));
		TastingProfile<Double> tasting = calculateWeightedProfile(baseScore, weights.get(1));
		TastingProfile<Double> finish = calculateWeightedProfile(baseScore, weights.get(2));

		Member member =
			memberRepository.findById(preferenceRequestDto.memberId()).orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "존재하지 않은 사용자입니다."));

		MemberPreference memberPreference = MemberPreference.builder()
			.member(member)
			.nosing(nosing)
			.tasting(tasting)
			.finish(finish)
			.build();

		memberPreferenceRepository.save(memberPreference);
	}

	public void createFamiliarPreferenceScore(FamiliarPreferenceRequestDto preferenceRequestDto) {

	}

	private TastingProfile<Double> calculateWeightedProfile(Map<String, Integer> baseScore, Double weight) {
		return TastingProfile.<Double>builder()
			.fruity(makeComponent("fruity", baseScore, weight))
			.sweet(makeComponent("sweet", baseScore, weight))
			.spicy(makeComponent("spicy", baseScore, weight))
			.oaky(makeComponent("oaky", baseScore, weight))
			.herbal(makeComponent("herbal", baseScore, weight))
			.briny(makeComponent("briny", baseScore, weight))
			.build();
	}

	private TastingComponent<Double> makeComponent(String key, Map<String, Integer> baseScore, Double weight) {
		return TastingComponent.<Double>builder()
			.score(baseScore.getOrDefault(key, 0) * weight)
			.data(null)
			.build();
	}
}
