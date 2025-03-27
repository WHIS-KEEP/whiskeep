package com.whiskeep.api.recommend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.whiskeep.api.member.domain.Member;
import com.whiskeep.api.recommend.dto.RecommendResponseDto;
import com.whiskeep.api.recommend.dto.RecommendedListResponseDto;
import com.whiskeep.api.recommend.repository.RecommendRepository;

import com.whiskeep.api.record.repository.RecordRepository;
import com.whiskeep.api.whisky.domain.Whisky;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RecommendService {

	private final RecordRepository recordRepository;
	private final RecommendRepository recommendRepository;


	//1. 일단 사용자가 남긴 위스킹에 대한 기록들 다 가져옴
	public List<Record> getRecords(Long memberId) {
		return recordRepository.findAll(memberId);
	}

	private double[] getWhiskyFeautureVectors(Whisky whisky) {
		return new double[] {
			whisky.get
		}
	}


	//2. 그거에 대한 코사인 유사도? 를 계산
	public double calculateSimilarity(List<Record> records) {
		//여기에서 위싀키 평점들 다 가져오고
		getRecords().get;
		//여기에서 코사인 유사도 계산
	}


	//3. 기록한 애들과 가장 비슷한 위스키를 추천해줌

	//추천
	public RecommendedListResponseDto recommend() {
		double similarity = calculateSimilarity();
		return recommendRepository.recommend(similarity);

	}



}
