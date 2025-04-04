package com.whiskeep.scheduler;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.whiskeep.api.record.dto.RecordStats;
import com.whiskeep.api.record.repository.RecordRepository;
import com.whiskeep.api.whisky.domain.Whisky;
import com.whiskeep.api.whisky.domain.document.WhiskyDocument;
import com.whiskeep.api.whisky.repository.WhiskyRepository;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch.core.BulkRequest;
import co.elastic.clients.elasticsearch.core.BulkResponse;
import co.elastic.clients.elasticsearch.core.bulk.BulkOperation;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class WhiskyBulkScheduler {

	private final ElasticsearchClient elasticsearchClient;
	private final WhiskyRepository whiskyRepository;
	private final RecordRepository recordRepository;

	// ✅ 서버 시작 시 1회 실행
	@PostConstruct
	public void indexOnceAtStartup() throws IOException {
		indexWhiskies();
	}

	// ✅ 매일 새벽 2시에 실행
	@Scheduled(cron = "0 0 2 * * *")
	public void indexDailyAtTwoAM() throws IOException {
		indexWhiskies();
	}

	private void indexWhiskies() throws IOException {
		List<WhiskyDocument> docs = buildWhiskyDocuments();
		sendBulkIndexRequest(docs);
		System.out.printf("✅ [Elasticsearch 색인 완료] 문서 개수: %d%n", docs.size());
	}

	private List<WhiskyDocument> buildWhiskyDocuments() {
		List<Whisky> whiskies = whiskyRepository.findAll();
		Map<Long, RecordStats> statsMap = recordRepository.findAllWhiskyStats();

		return whiskies.stream()
			.map(w -> {
				RecordStats stats = statsMap.getOrDefault(w.getWhiskyId(), new RecordStats(0.0, 0));
				return WhiskyDocument.builder()
					.whiskyId(w.getWhiskyId())
					.enName(w.getEnName())
					.koName(w.getKoName())
					.type(w.getType())
					.age(w.getAge())
					.avgRating(stats.avgRating())
					.recordCounts(stats.count())
					.whiskyImg(w.getWhiskyImg())
					.build();
			})
			.collect(Collectors.toList());
	}

	private void sendBulkIndexRequest(List<WhiskyDocument> docs) throws IOException {
		List<BulkOperation> operations = docs.stream()
			.map(doc -> BulkOperation.of(op -> op
				.index(idx -> idx
					.index("whisky")
					.id(doc.getWhiskyId().toString())
					.document(doc)
				)
			))
			.collect(Collectors.toList());

		BulkRequest request = BulkRequest.of(b -> b.operations(operations));
		BulkResponse response = elasticsearchClient.bulk(request);

		if (response.errors()) {
			System.err.println("⚠️ 일부 문서 색인 중 오류 발생!");
		} else {
			System.out.println("✅ Elasticsearch Bulk 색인 성공");
		}
	}
}
