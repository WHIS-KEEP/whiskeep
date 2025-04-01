package com.whiskeep.api.whisky.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.whiskeep.api.whisky.domain.Whisky;


public interface WhiskyRepository extends JpaRepository<Whisky, Long> {

	@Query("SELECT w FROM Whisky w WHERE w NOT IN (SELECT r.whisky FROM Record r WHERE r.member.memberId = :memberId)")
	List<Whisky> findWhiskiesNotRatedByMember(Long memberId);
}
