package com.whiskeep.api.whisky.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.whiskeep.api.whisky.domain.Whisky;

public interface WhiskyRepository extends JpaRepository<Whisky, Long> {
	List<Whisky> findWhiskiesNotRatedByMember(Long memberId);
}
