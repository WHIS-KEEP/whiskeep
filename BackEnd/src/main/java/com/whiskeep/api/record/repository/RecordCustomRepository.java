package com.whiskeep.api.record.repository;

import java.util.Map;
import java.util.Optional;

import com.whiskeep.api.record.dto.RecordStats;

public interface RecordCustomRepository {
	Map<Long, RecordStats> findAllWhiskyStats();

	Optional<RecordStats> findStatsByWhiskyId(Long whiskyId);
}
