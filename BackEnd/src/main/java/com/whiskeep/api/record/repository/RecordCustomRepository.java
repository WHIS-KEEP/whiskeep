package com.whiskeep.api.record.repository;

import java.util.Map;

import com.whiskeep.api.record.dto.RecordStats;

public interface RecordCustomRepository {
	Map<Long, RecordStats> findAllWhiskyStats();
}
