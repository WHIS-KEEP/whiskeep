package com.whiskeep.api.recommend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.whiskeep.api.whisky.domain.Whisky;

public interface RecommendRepository extends JpaRepository<Whisky, Long> {

}
