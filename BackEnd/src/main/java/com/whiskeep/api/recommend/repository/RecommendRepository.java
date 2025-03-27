package com.whiskeep.api.recommend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.whiskeep.api.recommend.dto.RecommendResponseDto;
import com.whiskeep.api.recommend.dto.RecommendedListResponseDto;
import com.whiskeep.api.record.repository.RecordRepository;
import com.whiskeep.api.whisky.domain.Whisky;

public interface RecommendRepository extends JpaRepository<Whisky, Long> {


	RecommendedListResponseDto recommend(double similarity);
}
