package com.whiskeep.api.member.service;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.whiskeep.api.member.domain.FamiliarWhiskyPreference;
import com.whiskeep.api.member.domain.Member;
import com.whiskeep.api.member.domain.MemberPreference;
import com.whiskeep.api.member.dto.BeginnerPreferenceRequestDto;
import com.whiskeep.api.member.dto.FamiliarPreferenceRequestDto;
import com.whiskeep.api.member.dto.MemberScoreResponseDto;
import com.whiskeep.api.member.dto.PopularWhiskyResponseDto;
import com.whiskeep.api.member.repository.FamiliarWhiskyPreferenceRepository;
import com.whiskeep.api.member.repository.MemberPreferenceRepository;
import com.whiskeep.api.member.repository.MemberRepository;
import com.whiskeep.api.member.util.MemberScoreCalculator;
import com.whiskeep.api.record.repository.RecordRepository;
import com.whiskeep.api.whisky.domain.Whisky;
import com.whiskeep.api.whisky.repository.WhiskyRepository;
import com.whiskeep.common.enumclass.TastingCategory;
import com.whiskeep.common.exception.BadRequestException;
import com.whiskeep.common.exception.ErrorMessage;
import com.whiskeep.common.exception.NotFoundException;
import com.whiskeep.common.model.TastingComponent;
import com.whiskeep.common.model.TastingProfile;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PreferenceService {

	private final MemberRepository memberRepository;
	private final MemberPreferenceRepository memberPreferenceRepository;
	private final FamiliarWhiskyPreferenceRepository familiarWhiskyPreferenceRepository;
	private final WhiskyRepository whiskyRepository;
	private final MemberScoreCalculator memberScoreCalculator;
	private final RecordRepository recordRepository;

	@Transactional
	public void createBeginnerPreferenceScore(BeginnerPreferenceRequestDto preferenceRequestDto, Long memberId) {
		Member member =
			memberRepository.findById(memberId).orElseThrow(() -> new NotFoundException(ErrorMessage.MEMBER_NOT_FOUND));

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
			.fruity(toComponent(baseScore.fruity().doubleValue()))
			.sweet(toComponent(baseScore.sweet().doubleValue()))
			.spicy(toComponent(baseScore.spicy().doubleValue()))
			.oaky(toComponent(baseScore.oaky().doubleValue()))
			.herbal(toComponent(baseScore.herbal().doubleValue()))
			.briny(toComponent(baseScore.briny().doubleValue()))
			.build();
	}

	private TastingComponent<Double> toComponent(Double score) {
		return TastingComponent.<Double>builder()
			.score(score) // 그냥 Double로 변환
			.data(null) // 추후 분석 데이터 필요 시 사용
			.build();
	}

	// 숙련자 선택한 위스키 기반 점수 계산
	@Transactional
	public void createFamiliarPreferenceScore(FamiliarPreferenceRequestDto preferenceRequestDto, Long memberId) {
		Member member =
			memberRepository.findById(memberId).orElseThrow(() -> new NotFoundException(ErrorMessage.MEMBER_NOT_FOUND));

		// 이미 초기 설문조사를 완료한 경우,
		if (familiarWhiskyPreferenceRepository.existsByMember(member)) {
			throw new BadRequestException(ErrorMessage.PREFERENCE_ALREADY_REGISTERED);
		}

		// 1. 숙련자(familiar)가 고른 초기 위스키 3병을 테이블에 저장
		FamiliarWhiskyPreference familiarPreference = FamiliarWhiskyPreference.builder()
			.member(member)
			.likedWhiskyIdList(preferenceRequestDto.likedWhiskies())
			.build();

		familiarWhiskyPreferenceRepository.save(familiarPreference);

		// 2. 위스키 정보 불러오기
		// 초기 숙련자가 설문조사를 바탕으로 고른 위스키 Id 기반으로 위스키 리스트 반환
		List<Whisky> whiskyList = whiskyRepository.findAllById(preferenceRequestDto.likedWhiskies());

		// 위스키 평점 리스트 조회하기
		List<Double> ratingList =
			whiskyList.stream()
				.map(w -> recordRepository.findAverageRatingByWhiskyId(w.getWhiskyId()).orElse(5.0))
				.toList();

		// 3. 사용자 점수 계산하기
		MemberPreference memberPreference = createPreferenceScore(member, whiskyList, ratingList, false);

		memberPreferenceRepository.save(memberPreference);
	}

	private TastingProfile<Double> createProfileFromMap(Map<TastingCategory, Double> scores) {
		return TastingProfile.<Double>builder()
			.fruity(toComponent(scores.getOrDefault(TastingCategory.FRUITY, 0.0)))
			.sweet(toComponent(scores.getOrDefault(TastingCategory.SWEET, 0.0)))
			.spicy(toComponent(scores.getOrDefault(TastingCategory.SPICY, 0.0)))
			.oaky(toComponent(scores.getOrDefault(TastingCategory.OAKY, 0.0)))
			.herbal(toComponent(scores.getOrDefault(TastingCategory.HERBAL, 0.0)))
			.briny(toComponent(scores.getOrDefault(TastingCategory.BRINY, 0.0)))
			.build();
	}

	// 사용자 점수 조회하기
	public MemberScoreResponseDto getMemberPreferenceScore(Long memberId) {
		Member member = memberRepository.findById(memberId)
			.orElseThrow(() -> new NotFoundException(ErrorMessage.MEMBER_NOT_FOUND));

		MemberPreference memberPreference = memberPreferenceRepository.findByMember(member)
			.orElseThrow(() -> new NotFoundException(ErrorMessage.PREFERENCE_NOT_FOUND));

		return MemberScoreResponseDto.from(memberPreference);
	}

	// 사용자 기록이 3병 이상일 경우 -> 점수 업데이트하기
	@Transactional
	public void updateMemberPreference(Member member, List<Whisky> whiskyList, List<Double> ratingList) {
		// 1. 사용자 점수 계산하기
		MemberPreference memberPreference = createPreferenceScore(member, whiskyList, ratingList, true);

		// 2. 계산한 점수 DB에 Update 하기
		memberPreferenceRepository.save(memberPreference);

	}

	// 사용자 점수 계산 메서드 분리하기
	public MemberPreference createPreferenceScore(Member member, List<Whisky> whiskyList, List<Double> ratingList,
		boolean isUpdate) {

		// 1. 사용자 점수 계산
		Map<TastingCategory, Double> nosingScores = memberScoreCalculator.calculateProfileScore(whiskyList,
			ratingList, "nosing");
		Map<TastingCategory, Double> tastingScores = memberScoreCalculator.calculateProfileScore(whiskyList,
			ratingList,
			"tasting");
		Map<TastingCategory, Double> finishScores = memberScoreCalculator.calculateProfileScore(whiskyList,
			ratingList, "finish");

		// 2. 맛 프로필 별로 score 값 세팅
		TastingProfile<Double> nosing = createProfileFromMap(nosingScores);
		TastingProfile<Double> tasting = createProfileFromMap(tastingScores);
		TastingProfile<Double> finish = createProfileFromMap(finishScores);

		// 3. 계산된 score 값으로 MemberPreference 객체 생성
		MemberPreference memberPreference = memberPreferenceRepository.findByMember(member)
			.orElse(MemberPreference.builder()
				.member(member)
				.nosing(nosing)
				.tasting(tasting)
				.finish(finish)
				.build());

		// 4. 업데이트가 필요할 경우, update
		if (isUpdate) {
			memberPreference.update(nosing, tasting, finish);
		}

		return memberPreference;
	}

	// 숙련자 설문조사 시, 선택할 위스키 9개 정보 조회하기
	@Transactional(readOnly = true)
	public List<PopularWhiskyResponseDto> getPopularWhiskyList() {

		// 인기 있는 위스키 TOP 9
		List<Long> popularWhiskyIds = List.of(2544L, 402L, 1470L, 1L, 2542L, 2184L,
			3L, 4L, 2505L);

		return whiskyRepository.findAllById(popularWhiskyIds)
			.stream()
			.map(whisky -> new PopularWhiskyResponseDto(whisky.getWhiskyId(), whisky.getKoName(),
				whisky.getWhiskyImg()))
			.toList();
	}

	@Transactional
	public void deletePreferenceByMember(Member member) {
		memberPreferenceRepository.deleteByMember(member);
		familiarWhiskyPreferenceRepository.deleteByMember(member);
	}
}
