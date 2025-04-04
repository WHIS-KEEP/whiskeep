package com.whiskeep.api.record.repository;

import java.util.Map;

public interface RecordCustomRepository {
	Map<Long, RecordStatsDto> findAllWhiskyStats();
}
