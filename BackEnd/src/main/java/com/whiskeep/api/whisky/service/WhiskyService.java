package com.whiskeep.api.whisky.service;

import java.io.IOException;
import java.util.Collections;
import java.util.List;
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
import com.whiskeep.common.enumclass.WhiskyType;
import com.whiskeep.common.exception.ErrorMessage;
import com.whiskeep.common.exception.NotFoundException;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch._types.FieldValue;
import co.elastic.clients.elasticsearch._types.SortOrder;
import co.elastic.clients.elasticsearch._types.query_dsl.BoolQuery;
import co.elastic.clients.elasticsearch._types.query_dsl.RangeQuery;
import co.elastic.clients.elasticsearch.core.SearchRequest;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import co.elastic.clients.elasticsearch.core.search.Hit;
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

	public WhiskySearchResponseDto searchWithFuzziness(WhiskySearchRequestDto request) throws IOException {
		SortOrder sortOrder = request.desc() ? SortOrder.Desc : SortOrder.Asc;
		String sortField = request.sortField() != null ? request.sortField() : "recordCounts";

		SearchRequest.Builder searchRequestBuilder = new SearchRequest.Builder()
			.index("whisky")
			.size(request.pageSize())
			.query(q -> q.bool(b -> {
				if (request.keyword() != null && !request.keyword().isEmpty()) {
					// enName, koName 필드에 대해 multi-match
					b.must(m -> m.multiMatch(mm -> mm
						.fields("enName", "koName")
						.query(request.keyword())
						.fuzziness("AUTO")
					));
				} else {
					// keyword 없을 경우 모든 문서를 대상으로 match_all 쿼리 적용
					b.must(m -> m.matchAll(ma -> ma));
				}

				// age 필터: 요청에 따라 5개의 범위로 적용
				if (request.age() != null) {
					applyAgeFilter(b, request.age());
				}

				// type 필터: enum 값("SINGLE_MALT" 등)이 전달됨
				if (request.type() != null) {
					List<String> dbTypeValues = WhiskyType.valueOf(request.type().toUpperCase()).getDbValues();
					b.filter(f -> f.terms(t -> t.field("type").terms(ts -> ts.value(
						dbTypeValues.stream().map(FieldValue::of).toList()
					))));
				}

				return b;
			}))
			.sort(s -> s.field(f -> f.field(sortField).order(sortOrder)))
			.sort(s -> s.field(f -> f.field("whiskyId"))) // tie breaker
			.source(src -> src.filter(f -> f
				.includes("whiskyId", "enName", "koName", "type", "age", "avgRating", "recordCounts", "whiskyImg")));

		// searchAfter 값이 있을 경우 FieldValue 리스트로 변환하여 설정
		if (request.searchAfter() != null && !request.searchAfter().isEmpty()) {
			List<FieldValue> searchAfterValues = request.searchAfter().stream()
				.map(FieldValue::of)
				.toList();
			searchRequestBuilder.searchAfter(searchAfterValues);
		}

		SearchResponse<WhiskyDocument> response = elasticsearchClient.search(
			searchRequestBuilder.build(), WhiskyDocument.class);

		// 검색 결과 매핑: DB의 type 문자열을 enum으로 변환하여 클라이언트에 전달
		List<WhiskySearchResult> results = response.hits().hits().stream()
			.map(Hit::source)
			.map(doc -> new WhiskySearchResult(
				doc.getWhiskyId(),
				doc.getEnName(),
				doc.getKoName(),
				// enum 변환 후 enum 이름(SINGLE_MALT 등)으로 반환
				WhiskyType.fromDbValue(doc.getType()).name(),
				doc.getAge(),
				doc.getAvgRating(),
				doc.getRecordCounts(),
				doc.getWhiskyImg()))
			.toList();

		// 마지막 hit의 sort 값을 다음 페이지 조회에 사용
		List<Object> nextSearchAfter = response.hits().hits().isEmpty()
			? Collections.emptyList()
			: response.hits().hits().getLast().sort().stream()
			.map(this::extractFieldValue)
			.collect(Collectors.toList());

		boolean hasNext = results.size() == request.pageSize();

		return new WhiskySearchResponseDto(results, nextSearchAfter, hasNext);
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

	private void applyAgeFilter(BoolQuery.Builder boolBuilder, int age) {
		final Integer lower = (age <= 10) ? null
			: (age <= 12) ? 10
			: (age <= 15) ? 12
			: (age <= 18) ? 15 : 18;
		final Integer upper = (age <= 10) ? 10
			: (age <= 12) ? 12
			: (age <= 15) ? 15
			: (age <= 18) ? 18 : null;

		RangeQuery rangeQuery = RangeQuery.of(rq ->
			rq.number(nrq -> {
				nrq.field("age");
				if (lower != null) {
					nrq.from(lower.doubleValue());
				}
				if (upper != null) {
					nrq.to(upper.doubleValue());
				}
				return nrq;
			})
		);

		boolBuilder.filter(f -> f.range(rangeQuery));
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
}
