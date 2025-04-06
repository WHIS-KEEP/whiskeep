package com.whiskeep.api.whiskylike.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.whiskeep.api.member.domain.Member;
import com.whiskeep.api.whisky.domain.Whisky;
import com.whiskeep.api.whiskylike.domain.WhiskyLike;

public interface WhiskyLikeRepository extends JpaRepository<WhiskyLike, Long> {
	Optional<WhiskyLike> findByMemberAndWhisky(Member member, Whisky whisky);

	List<WhiskyLike> findAllByMemberOrderByCreatedAtDesc(Member member);
}
