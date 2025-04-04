package com.whiskeep.api.record.repository;

import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.whiskeep.api.record.domain.QRecord;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class RecordRepositoryImpl implements RecordCustomRepository {

	private final JPAQueryFactory jpaQueryFactory;
	@Override
	public Map<Long, RecordStatsDto> findAllWhiskyStats() {
		QRecord qr = QRecord.record;

		var avgRatingExpr = qr.rating.avg();
		var countExpr = qr.count();

		var result = jpaQueryFactory
			.select(
				qr.whisky.whiskyId,
				avgRatingExpr,
				countExpr
			)
			.from(qr)
			.join(qr.whisky)
			.groupBy(qr.whisky.whiskyId)
			.fetch();

		return result.stream()
			.collect(Collectors.toMap(
				tuple -> tuple.get(qr.whisky.whiskyId),
				tuple -> RecordStatsDto.of(
					tuple.get(avgRatingExpr),
					tuple.get(countExpr).intValue()
				)
			));
	}
}
