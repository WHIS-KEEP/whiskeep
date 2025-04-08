package com.whiskeep.api.whisky.service;

import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.whiskeep.api.record.dto.RecordStats;
import com.whiskeep.api.record.repository.RecordRepository;
import com.whiskeep.api.whisky.document.WhiskyDocument;
import com.whiskeep.api.whisky.domain.Whisky;
import com.whiskeep.api.whisky.dto.reqeust.WhiskySearchRequestDto;
import com.whiskeep.api.whisky.dto.response.WhiskyDetailResponseDto;
import com.whiskeep.api.whisky.dto.response.WhiskyScoreResponseDto;
import com.whiskeep.api.whisky.dto.response.WhiskySearchResponseDto;
import com.whiskeep.api.whisky.dto.response.WhiskySearchResult;
import com.whiskeep.api.whisky.repository.WhiskyRepository;
import com.whiskeep.common.enumclass.AgeRange;
import com.whiskeep.common.enumclass.WhiskyType;
import com.whiskeep.common.exception.ErrorMessage;
import com.whiskeep.common.exception.NotFoundException;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch._types.FieldValue;
import co.elastic.clients.elasticsearch._types.SortOrder;
import co.elastic.clients.elasticsearch._types.query_dsl.BoolQuery;
import co.elastic.clients.elasticsearch._types.query_dsl.FieldValueFactorModifier;
import co.elastic.clients.elasticsearch._types.query_dsl.FunctionBoostMode;
import co.elastic.clients.elasticsearch._types.query_dsl.FunctionScoreMode;
import co.elastic.clients.elasticsearch._types.query_dsl.Query;
import co.elastic.clients.elasticsearch._types.query_dsl.RangeQuery;
import co.elastic.clients.elasticsearch.core.SearchRequest;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import co.elastic.clients.elasticsearch.core.search.Hit;
import co.elastic.clients.elasticsearch.core.search.SourceConfig;
import lombok.RequiredArgsConstructor;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class WhiskyService {

	private final WhiskyRepository whiskyRepository;
	private final RecordRepository recordRepository;
	private final TastingProfileService tastingProfileService;
	private final ElasticsearchClient elasticsearchClient;

	// 위스키 세부 조회
	public WhiskyDetailResponseDto getWhiskyById(Long whiskyId) {
		Whisky whisky = whiskyRepository.findById(whiskyId)
			.orElseThrow(() -> new NotFoundException(ErrorMessage.WHISKY_NOT_FOUND));

		List<String> nosingList = tastingProfileService.extractTopFeatures(whisky.getNosing());
		List<String> tastingList = tastingProfileService.extractTopFeatures(whisky.getTasting());
		List<String> finishList = tastingProfileService.extractTopFeatures(whisky.getFinish());

		RecordStats stats = recordRepository.findStatsByWhiskyId(whiskyId)
			.orElseThrow(() -> new NotFoundException(ErrorMessage.RECORD_NOT_FOUND));

		return WhiskyDetailResponseDto.builder()
			.whiskyId(whisky.getWhiskyId())
			.whiskyImg(whisky.getWhiskyImg())
			.koName(whisky.getKoName())
			.enName(whisky.getEnName())
			.distillery(whisky.getDistillery())
			.country(whisky.getCountry())
			.abv(whisky.getAbv())
			.type(whisky.getType())
			.tastingNotes(WhiskyDetailResponseDto.TastingNotesDto
				.builder()
				.nosing(nosingList)
				.tasting(tastingList)
				.finish(finishList)
				.build())
			.description(whisky.getDescription()).recordInfo(WhiskyDetailResponseDto.RecordInfo
				.builder()
				.ratingAvg(stats.avgRating())
				.recordCnt(stats.count())
				.build())
			.build();
	}

	// 위스키 맛 프로필 별 점수 조회하기
	public WhiskyScoreResponseDto getWhiskyScore(Long whiskyId) {
		Whisky whisky = whiskyRepository.findById(whiskyId)
			.orElseThrow(() -> new NotFoundException(ErrorMessage.WHISKY_NOT_FOUND));

		if (whisky.getNosing() == null || whisky.getTasting() == null || whisky.getFinish() == null) {
			throw new NotFoundException(ErrorMessage.PROFILE_NOT_FOUND);
		}

		return WhiskyScoreResponseDto.from(
			whisky.getWhiskyId(),
			whisky.getNosing(),
			whisky.getTasting(),
			whisky.getFinish()
		);
	}

	public WhiskySearchResponseDto searchWhiskies(WhiskySearchRequestDto request) throws IOException {
		SearchRequest.Builder builder = new SearchRequest.Builder()
			.index("whisky")
			.size(request.pageSize())
			.source(new SourceConfig.Builder().fetch(true).build());

		if (hasKeyword(request)) {
			builder.query(buildKeywordQuery(request));
		} else {
			builder.query(buildMatchAllQuery(request));
			builder.sort(s -> s.field(f -> f.field(getSortField(request)).order(getSortOrder(request))));
			builder.sort(s -> s.field(f -> f.field("whiskyId").order(SortOrder.Asc)));
		}

		// search_after 적용 (무한 스크롤)
		applySearchAfter(builder, request);

		// 실제 검색 실행
		SearchResponse<WhiskyDocument> response = elasticsearchClient.search(
			builder.build(), WhiskyDocument.class
		);

		// 응답 매핑
		List<WhiskySearchResult> results = response.hits().hits().stream()
			.map(Hit::source).filter(Objects::nonNull)
			.map(WhiskySearchResult::of)
			.toList();

		// 다음 페이지 요청을 위한 search_after 값 추출
		List<Object> nextSearchAfter = response.hits().hits().isEmpty()
			? Collections.emptyList()
			: response.hits().hits().getLast().sort().stream()
			.map(this::extractFieldValue)
			.collect(Collectors.toList());

		boolean hasNext = results.size() == request.pageSize();
		return new WhiskySearchResponseDto(results, nextSearchAfter, hasNext);
	}

	private Query buildKeywordQuery(WhiskySearchRequestDto request) {
		return Query.of(q -> q.functionScore(fs -> fs
			.query(innerQ -> innerQ.bool(b -> {
				b.must(m -> m.multiMatch(mm -> mm
					.fields("enName", "koName")
					.query(request.keyword())
					.fuzziness("AUTO")
				));
				applyFiltersIfExist(b, request);
				return b;
			}))
			.functions(fn -> fn.fieldValueFactor(fvf -> fvf
				.field(getSortField(request))
				.factor(1.0)
				.modifier(FieldValueFactorModifier.Ln1p)
				.missing(0.0)
			))
			.scoreMode(FunctionScoreMode.Sum)
			.boostMode(FunctionBoostMode.Sum)
		));
	}

	private Query buildMatchAllQuery(WhiskySearchRequestDto request) {
		return Query.of(q -> q.bool(b -> {
			b.must(m -> m.matchAll(ma -> ma));
			applyFiltersIfExist(b, request);
			return b;
		}));
	}

	private void applySearchAfter(SearchRequest.Builder builder, WhiskySearchRequestDto request) {
		if (request.searchAfter() != null && !request.searchAfter().isEmpty()) {
			builder.searchAfter(
				request.searchAfter().stream()
					.map(FieldValue::of)
					.toList()
			);
		}
	}

	private void applyFiltersIfExist(BoolQuery.Builder bb, WhiskySearchRequestDto request) {
		if (request.age() != null) {
			applyAgeFilter(bb, request.age());
		}

		if (request.type() != null && !request.type().isBlank()) {
			WhiskyType type = WhiskyType.fromName(request.type());
			List<FieldValue> dbTypeValues = type.getDbValues().stream()
				.map(FieldValue::of)
				.toList();

			if (!dbTypeValues.isEmpty()) {
				bb.filter(f -> f.terms(t -> t
					.field("type")
					.terms(ts -> ts.value(dbTypeValues))
				));
			}
		}
	}

	private void applyAgeFilter(BoolQuery.Builder bb, Integer age) {
		AgeRange ageRange = AgeRange.from(age);
		if (ageRange == null) {
			return;
		}

		RangeQuery rangeQuery = RangeQuery.of(rq ->
			rq.number(nrq -> {
				nrq.field("age");
				if (ageRange.getLower() != null) {
					nrq.from(ageRange.getLower().doubleValue());
				}
				if (ageRange.getUpper() != null) {
					nrq.to(ageRange.getUpper().doubleValue());
				}
				return nrq;
			})
		);
		bb.filter(f -> f.range(rangeQuery));
	}

	private String getSortField(WhiskySearchRequestDto request) {
		return request.sortField() != null ? request.sortField() : "recordCounts";
	}

	private SortOrder getSortOrder(WhiskySearchRequestDto request) {
		return request.desc() ? SortOrder.Desc : SortOrder.Asc;
	}

	private boolean hasKeyword(WhiskySearchRequestDto request) {
		return request.keyword() != null && !request.keyword().isEmpty();
	}

	private Object extractFieldValue(FieldValue fieldValue) {
		return switch (fieldValue._kind()) {
			case String -> fieldValue.stringValue();
			case Long -> fieldValue.longValue();
			case Double -> fieldValue.doubleValue();
			case Boolean -> fieldValue.booleanValue();
			default -> fieldValue.toString();
		};
	}

	// 위스키명으로 위스키 조회하기
	@Transactional(readOnly = true)
	public List<Whisky> getWhiskiesByEnName(String enName) {
		return whiskyRepository.findAllByEnName(enName);
	}
}
