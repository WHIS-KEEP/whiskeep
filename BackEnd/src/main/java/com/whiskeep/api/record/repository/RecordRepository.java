package com.whiskeep.api.record.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.whiskeep.api.record.domain.Record;

public interface RecordRepository extends JpaRepository<Record, Long> {


	@Query("SELECT AVG(r.rating) FROM Record r WHERE r.whisky.whiskyId = :whiskyId")
	Optional<Double> findAverageRatingByWhiskyId(@Param("whiskyId") Long whiskyId);

	Integer countRecordsByWhisky_WhiskyId(Long whiskyId);

	Page<Record> findByWhiskyWhiskyIdOrderByCreatedAtDesc(Long whiskyId, Pageable pageable);
}
