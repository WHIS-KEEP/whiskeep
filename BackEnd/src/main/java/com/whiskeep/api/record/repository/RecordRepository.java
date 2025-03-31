package com.whiskeep.api.record.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.whiskeep.api.record.domain.Record;

public interface RecordRepository extends JpaRepository<Record, Long> {
}
