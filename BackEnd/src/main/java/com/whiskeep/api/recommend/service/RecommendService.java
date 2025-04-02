package com.whiskeep.api.recommend.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.whiskeep.api.member.domain.FamiliarWhiskyPreference;
import com.whiskeep.api.member.domain.Member;
import com.whiskeep.api.member.repository.FamiliarWhiskyPreferenceRepository;
import com.whiskeep.api.member.repository.MemberRepository;
import com.whiskeep.api.recommend.dto.RecommendResponseDto;
import com.whiskeep.api.recommend.dto.RecommendedListResponseDto;
import com.whiskeep.api.recommend.util.CosineSimilarityUtil;
import com.whiskeep.api.record.domain.Record;
import com.whiskeep.api.record.repository.RecordRepository;
import com.whiskeep.api.whisky.domain.Whisky;
import com.whiskeep.api.whisky.repository.WhiskyRepository;
import com.whiskeep.common.exception.ErrorMessage;
import com.whiskeep.common.exception.NotFoundException;
import com.whiskeep.common.model.TastingComponent;
import com.whiskeep.common.model.TastingProfile;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RecommendService {

	private final RecordRepository recordRepository;
	private final WhiskyRepository whiskyRepository;
	private final RecommendBeginnerService recommendBeginnerService;
	private final FamiliarWhiskyPreferenceRepository familiarWhiskyPreferenceRepository;
	private final MemberRepository memberRepository;

	public RecommendedListResponseDto recommend(Long memberId) {
		Member member =
			memberRepository.findById(memberId).orElseThrow(()-> new NotFoundException(ErrorMessage.MEMBER_NOT_FOUND));


		int recordCnt = recordRepository.countByMember(member);

		if (recordCnt >= 3) {
			return recommendWhiskies(member, true);
		}

		boolean isFamiliar = familiarWhiskyPreferenceRepository.existsByMember(member);
		if (isFamiliar) {
			return recommendWhiskies(member, false);
		}

		// 초보자 로직 서비스
		return recommendBeginnerService.recommendForBeginnerService(member);
	}

	// 추천된 리스트들
	public RecommendedListResponseDto recommendWhiskies(Member member, boolean usedRecords) {

		Long memberId = member.getMemberId();

		List<?> baseList;
		if (usedRecords) {
			// 1. 기록이 3개 이상인 경우, 멤버가 작성한 기록 찾기
			baseList = recordRepository.findAllByMember(member);

		} else {
			// 2. 기록이 3개 이하일 경우, 멤버가 초기 선택한 위스키 리스트 찾기
			FamiliarWhiskyPreference pref =
				familiarWhiskyPreferenceRepository.findByMember(member).orElseThrow(() -> new NotFoundException(
					ErrorMessage.PREFERENCE_NOT_FOUND));
			baseList = whiskyRepository.findAllById(pref.getLikedWhiskyIdList());
		}

		// 멤버가 평점을 남기지 않은 모든 위스키들 확인
		List<Whisky> notRatedWhiskies = whiskyRepository.findWhiskiesNotRatedByMember(memberId);

		List<RecommendResponseDto> recommendList = new ArrayList<>();

		for (Whisky whisky : notRatedWhiskies) {
			RecommendResponseDto whiskies = getRecommendedWhiskies(whisky, baseList);
			recommendList.add(whiskies);
		}

		List<RecommendResponseDto> sortedRecommendations = recommendList.stream()
			.sorted((w1, w2) -> Double.compare(w2.getSimilarity(), w1.getSimilarity()))
			.collect(Collectors.toList());

		return getNoDuplicatedRecommendations(sortedRecommendations, 5);
	}

	//중복 안된 추천 리스트 만들기
	private RecommendedListResponseDto getNoDuplicatedRecommendations(List<RecommendResponseDto> sortedRecommendations,
		int limit) {

		List<RecommendResponseDto> noDuplicatedRecommendations = new ArrayList<>();

		//중복검사용
		Set<String> uniqueNames = new HashSet<>();

		for (RecommendResponseDto recommendResponseDto : sortedRecommendations) {
			if (!uniqueNames.contains(recommendResponseDto.getKoName())) {
				noDuplicatedRecommendations.add(recommendResponseDto);
				uniqueNames.add(recommendResponseDto.getKoName());

				if (noDuplicatedRecommendations.size() >= limit) {
					break;
				}
			}

		}

		return RecommendedListResponseDto.builder()
			.recommendList(noDuplicatedRecommendations)
			.build();
	}

	// 유사도 계산
	private double calculateWhiskySimilarity(Whisky myWhisky, Whisky newWhisky) {

		double nosingSimilarity = calculateSimilarity(myWhisky.getNosing(), newWhisky.getNosing());
		double tastingSimilarity = calculateSimilarity(myWhisky.getTasting(), newWhisky.getTasting());
		double finishSimilarity = calculateSimilarity(myWhisky.getFinish(), newWhisky.getFinish());

		//일단 nosing, tasting, finish 들의 평균을 기준으로 유사도 계산
		double avgSimilarity = (nosingSimilarity + tastingSimilarity + finishSimilarity) / 3;
		return avgSimilarity;

	}

	//두 위스키 비교 - 두 위스키 간의 코사인 유사도 값 계산
	private double calculateSimilarity(TastingProfile<Map<String, Double>> profile1,
		TastingProfile<Map<String, Double>> profile2) {

		//위스키의 세부특성 수치 가져오기
		Map<String, Double> whiskyFlavorDetails1 = getWhiskyFlavorDetails(profile1);
		Map<String, Double> whiskyFlavorDetails2 = getWhiskyFlavorDetails(profile2);

		// 코사인 유사도 비교 util 계산하기
		return CosineSimilarityUtil.calculateCosineSimilarity(whiskyFlavorDetails1, whiskyFlavorDetails2);
	}

	//위스키 속 세부항목 가져오기
	private Map<String, Double> getWhiskyFlavorDetails(TastingProfile<Map<String, Double>> whiskyProfile) {
		Map<String, Double> allDetails = new HashMap<>();
		if (whiskyProfile != null) {
			addComponentDetails(allDetails, whiskyProfile.getFruity());
			addComponentDetails(allDetails, whiskyProfile.getSweet());
			addComponentDetails(allDetails, whiskyProfile.getBriny());
			addComponentDetails(allDetails, whiskyProfile.getSpicy());
			addComponentDetails(allDetails, whiskyProfile.getHerbal());
			addComponentDetails(allDetails, whiskyProfile.getOaky());
		}
		return allDetails;
	}

	//맵에 넣어주는 메서드
	private void addComponentDetails(Map<String, Double> allDetails,
		TastingComponent<Map<String, Double>> component) {
		if (component != null && component.getData() != null) {
			component.getData().forEach((key, value) -> {
				allDetails.put(key, value);
			});
		}
	}

	//위스키 추천하기
	private RecommendResponseDto getRecommendedWhiskies(Whisky newWhisky, List<?> baseList) {
		double totalSimilarity = 0.0;
		double totalWeight = 0.0;

		for (Object obj : baseList) {
			Whisky baseWhisky;
			double weight;

			if (obj instanceof Record record) {
				baseWhisky = record.getWhisky();
				weight = record.getRating().doubleValue() / 5.0;
			} else if (obj instanceof Whisky whisky) {
				baseWhisky = whisky;
				weight = 5.0 / 5.0; // 초기 선택한 위스키의 경우, 평점 5점으로 간주하여 가중치 1.0
			} else {
				continue;
			}

			//가중치
			double similarity = calculateWhiskySimilarity(baseWhisky, newWhisky);

			totalSimilarity += similarity * weight;
			totalWeight += weight;
		}

		//가중 산술 평균으로 가중치
		double avgSimilarity = totalWeight > 0 ? totalSimilarity / totalWeight : 0.0;

		return RecommendResponseDto.builder()
			.whiskyId(newWhisky.getWhiskyId())
			.koName(newWhisky.getKoName())
			.whiskyImg(newWhisky.getWhiskyImg())
			.abv(newWhisky.getAbv())
			.similarity(avgSimilarity)
			.build();
	}

}

