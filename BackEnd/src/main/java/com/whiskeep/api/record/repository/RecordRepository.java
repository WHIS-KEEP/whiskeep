package com.whiskeep.api.record.repository;



import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.whiskeep.api.member.domain.Member;
import com.whiskeep.api.record.domain.Record;
import com.whiskeep.api.record.dto.response.MyRecordResponseDto;
import com.whiskeep.api.whisky.domain.Whisky;

public interface RecordRepository extends JpaRepository<Record, Long>, RecordCustomRepository {


	@Query("SELECT AVG(r.rating) FROM Record r WHERE r.whisky.whiskyId = :whiskyId")
	Optional<Double> findAverageRatingByWhiskyId(@Param("whiskyId") Long whiskyId);

	@EntityGraph(attributePaths = {"member"})
	Page<Record> findByWhiskyWhiskyIdAndIsPublicTrueOrderByCreatedAtDesc(Long whiskyId, Pageable pageable);

	int countByMember(Member member);

	List<Record> findAllByMember(Member member);

	List<MyRecordResponseDto.RecordSummaryDto> findAllByMemberAndWhisky(Member member, Whisky whisky, Sort sort);

	@Query("SELECT DISTINCT r. whisky.whiskyId FROM Record r WHERE r.member = :member")
	Set<Long> findDistinctWhiskyIdsByMember(@Param("member") Member member);

	void deleteByMember(Member member);
}
