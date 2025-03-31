package com.whiskeep.api.member.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.whiskeep.api.member.domain.InitialWhiskyPreference;
import com.whiskeep.api.member.domain.Member;
import com.whiskeep.api.member.domain.MemberPreference;
import com.whiskeep.api.member.dto.BeginnerPreferenceRequestDto;
import com.whiskeep.api.member.dto.FamiliarPreferenceRequestDto;
import com.whiskeep.api.member.repository.InitialWhiskyPreferenceRepository;
import com.whiskeep.api.member.repository.MemberPreferenceRepository;
import com.whiskeep.api.member.repository.MemberRepository;
import com.whiskeep.api.whisky.domain.Whisky;
import com.whiskeep.api.whisky.repository.WhiskyRepository;
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
	private final InitialWhiskyPreferenceRepository initialWhiskyPreferenceRepository;
	private final WhiskyRepository whiskyRepository;

	@Transactional
	public void createBeginnerPreferenceScore(BeginnerPreferenceRequestDto preferenceRequestDto, Member member) {
		// 이미 초기 설문조사를 완료한 경우
		if (memberPreferenceRepository.existsByMember(member)) {
			throw new BadRequestException(ErrorMessage.PREFERENCE_ALREADY_REGISTERED);
		}

		// 사용자의 맛 별 score(1~5점)
		BeginnerPreferenceRequestDto.TastingScoreRequest baseScore = preferenceRequestDto.tastingScore();

		// 1. 각 영역별 가중치 점수 구하기
		TastingProfile<Double> nosing = createSimpleProfile(baseScore);
		TastingProfile<Double> tasting = createSimpleProfile(baseScore);
		TastingProfile<Double> finish = createSimpleProfile(baseScore);

		// 2. 입력된 score 값으로 DB에 저장
		MemberPreference memberPreference = MemberPreference.builder()
			.member(member)
			.nosing(nosing)
			.tasting(tasting)
			.finish(finish)
			.preferenceOrder(preferenceRequestDto.preferenceOrder())
			.build();

		memberPreferenceRepository.save(memberPreference);
	}

	private TastingProfile<Double> createSimpleProfile(BeginnerPreferenceRequestDto.TastingScoreRequest baseScore) {
		return TastingProfile.<Double>builder()
			.fruity(toComponent(baseScore.fruity()))
			.sweet(toComponent(baseScore.sweet()))
			.spicy(toComponent(baseScore.spicy()))
			.oaky(toComponent(baseScore.oaky()))
			.herbal(toComponent(baseScore.herbal()))
			.briny(toComponent(baseScore.briny()))
			.build();
	}

	private TastingComponent<Double> toComponent(Integer score) {
		return TastingComponent.<Double>builder()
			.score(score.doubleValue()) // 그냥 Double로 변환
			.data(null) // 추후 분석 데이터 필요 시 사용
			.build();
	}

	// 숙련자 선택한 위스키 기반 점수 계산
	@Transactional
	public void createFamiliarPreferenceScore(FamiliarPreferenceRequestDto preferenceRequestDto, Member member) {

		// 이미 초기 설문조사를 완료한 경우,
		if (initialWhiskyPreferenceRepository.existsByMember(member)) {
			throw new BadRequestException(ErrorMessage.PREFERENCE_ALREADY_REGISTERED);
		}

		// 1. 숙련자(familiar)가 고른 초기 위스키 3병을 테이블에 저장
		InitialWhiskyPreference familiarPreference = InitialWhiskyPreference.builder()
			.member(member)
			.likedWhiskyIdList(preferenceRequestDto.likedWhiskies())
			.build();


		initialWhiskyPreferenceRepository.save(familiarPreference);

		// TODO 정확한 계산방법 적용하여 점수 생성하기
		// 2. 초기에 고른 위스키 3병 기반으로 MemberPreference 점수 계산하여 생성하기

		List<Whisky> whiskyList = whiskyRepository.findAllById(preferenceRequestDto.likedWhiskies());

		// TastingProfile<Double> nosing = calculateAvgProfile(preferenceRequestDto.likedWhiskies(), "noising");
		// TastingProfile<Double> tasting = calculateAvgProfile(preferenceRequestDto.likedWhiskies(), "tasting");
		// TastingProfile<Double> finish = calculateAvgProfile(preferenceRequestDto.likedWhiskies(), "finish");


		// 3. 계산된 score 값으로 Member Preference DB에 저장
		// MemberPreference memberPreference = MemberPreference.builder()
		// 	.member(member)
		// 	.nosing(nosing)
		// 	.tasting(tasting)
		// 	.finish(finish)
		// 	.build();

		// memberPreferenceRepository.save(memberPreference);
	}

}
