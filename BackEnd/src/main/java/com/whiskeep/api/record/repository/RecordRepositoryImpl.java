package com.whiskeep.api.record.repository;

import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.whiskeep.api.record.domain.QRecord;
import com.whiskeep.api.record.dto.RecordStats;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class RecordRepositoryImpl implements RecordCustomRepository {

	private final JPAQueryFactory jpaQueryFactory;
	@Override
	public Map<Long, RecordStats> findAllWhiskyStats() {
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
				tuple -> new RecordStats(
					tuple.get(avgRatingExpr),
					tuple.get(countExpr).intValue()
				)
			));
	}

	@Override
	public Optional<RecordStats> findStatsByWhiskyId(Long whiskyId) {
		QRecord qr = QRecord.record;

		var avgExpr = qr.rating.avg();
		var cntExpr = qr.count();

		var tuple = jpaQueryFactory
			.select(avgExpr, cntExpr)
			.from(qr)
			.where(qr.whisky.whiskyId.eq(whiskyId))
			.fetchOne();

		if (tuple == null || tuple.get(cntExpr) == null) {
			return Optional.empty();
		}

		return Optional.of(new RecordStats(
			tuple.get(avgExpr),
			tuple.get(cntExpr).intValue()
		));
	}
}
