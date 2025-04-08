package com.whiskeep.api.record.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.whiskeep.api.member.domain.Member;
import com.whiskeep.api.member.repository.MemberRepository;
import com.whiskeep.api.member.service.PreferenceService;
import com.whiskeep.api.record.domain.Record;
import com.whiskeep.api.record.dto.RecordImageResponseDto;
import com.whiskeep.api.record.dto.RecordStats;
import com.whiskeep.api.record.dto.request.RecordCreateRequestDto;
import com.whiskeep.api.record.dto.request.RecordUpdateRequestDto;
import com.whiskeep.api.record.dto.response.MyRecordResponseDto;
import com.whiskeep.api.record.dto.response.RecordDetailResponseDto;
import com.whiskeep.api.record.repository.RecordRepository;
import com.whiskeep.api.whisky.document.WhiskyDocument;
import com.whiskeep.api.whisky.domain.Whisky;
import com.whiskeep.api.whisky.dto.response.RecordListResponseDto;
import com.whiskeep.api.whisky.dto.response.WhiskyRecordResponseDto;
import com.whiskeep.api.whisky.repository.WhiskyRepository;
import com.whiskeep.common.exception.BadRequestException;
import com.whiskeep.common.exception.ErrorMessage;
import com.whiskeep.common.exception.ForbiddenException;
import com.whiskeep.common.exception.NotFoundException;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;


@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RecordService {

	private final RecordRepository recordRepository;
	private final MemberRepository memberRepository;
	private final WhiskyRepository whiskyRepository;
	private final S3Client s3Client;
	private final PreferenceService preferenceService;
	private final ElasticsearchClient elasticsearchClient;

	@Value("${cloud.aws.region.static}")
	private String region;
	@Value("${cloud.aws.s3.bucket}")
	private String bucket;

	@Transactional
	public void addRecord(Long memberId, RecordCreateRequestDto recordCreateRequestDto) {

		// 1. 유효성 검사
		Whisky whisky = findWhisky(recordCreateRequestDto.whiskyId());
		Member member = findMember(memberId);

		// 2. 기록 저장
		Record record = Record.builder()
			.member(member)
			.whisky(whisky)
			.rating(recordCreateRequestDto.rating())
			.content(recordCreateRequestDto.content())
			.isPublic(recordCreateRequestDto.isPublic())
			.recordImg(recordCreateRequestDto.recordImg())
			.build();

		recordRepository.save(record);
		updateWhiskyStats(whisky.getWhiskyId());

		// 3. 기록한 위스키가 3병 이상일 경우, 사용자 점수 갱신
		Set<Long> distinctWhiskyIds = recordRepository.findDistinctWhiskyIdsByMember(member);
		log.info("위스키 아이디 리스트 : {}", distinctWhiskyIds);

		if (distinctWhiskyIds.size() >= 3) {
			List<Whisky> whiskyList = whiskyRepository.findAllById(distinctWhiskyIds);
			List<Double> ratingList = whiskyList.stream()
				.map(w -> recordRepository.findAverageRatingByWhiskyId(w.getWhiskyId()).orElse(5.0))
				.toList();

			preferenceService.updateMemberPreference(member, whiskyList, ratingList);
		}
	}

	public RecordListResponseDto getRecordByWhiskyId(Long whiskyId, int page, int size) {
		Pageable pageable = PageRequest.of(page, size);
		Page<Record> recordPage = recordRepository.findByWhiskyWhiskyIdAndIsPublicTrueOrderByCreatedAtDesc(whiskyId,
			pageable);

		List<RecordListResponseDto.RecordResponseDto> records = recordPage.getContent()
			.stream()
			.map(record -> RecordListResponseDto.RecordResponseDto.builder()
				.recordId(record.getRecordId())
				.nickname(record.getMember().getNickname())
				.profileImage(record.getMember().getProfileImg())
				.content(record.getContent())
				.recordImg(record.getRecordImg())
				.rating(record.getRating())
				.createdAt(record.getCreatedAt())
				.build())
			.collect(Collectors.toList());

		RecordListResponseDto.PageInfo pageInfo = RecordListResponseDto.PageInfo.builder()
			.page(recordPage.getNumber())
			.size(recordPage.getSize())
			.totalPages(recordPage.getTotalPages())
			.build();

		return RecordListResponseDto.builder().records(records).pageInfo(pageInfo).build();
	}

	public List<WhiskyRecordResponseDto> getWhiskyRecordsByMember(Long memberId) {
		Member member = findMember(memberId);

		//login 한 유저의 모든 record 를 map 으로 수집 후, list 로 반환하여 중복 제거
		return new ArrayList<>(recordRepository.findAllByMember(member).stream().collect(Collectors.toMap(record -> {
			return Optional.ofNullable(record)
				.map(Record::getWhisky)
				.map(Whisky::getWhiskyId)
				.orElseThrow(() -> new NotFoundException(ErrorMessage.RECORD_NOT_FOUND));
		}, record -> {
			Whisky whisky = record.getWhisky();
			return new WhiskyRecordResponseDto(whisky.getWhiskyId(), whisky.getWhiskyImg());
		}, (existing, replacement) -> existing)).values());
	}

	public MyRecordResponseDto getRecordByWhiskyIdAndMember(Long whiskyId, Long memberId) {
		Member member = findMember(memberId);
		Whisky whisky = findWhisky(whiskyId);

		Sort sort = Sort.by(Sort.Direction.DESC, "createdAt");

		List<MyRecordResponseDto.RecordSummaryDto> recordDtos = recordRepository.findAllByMemberAndWhisky(member,
				whisky, sort)
			.stream()
			.map(record -> new MyRecordResponseDto.RecordSummaryDto(record.recordId(), record.recordImg()))
			.collect(Collectors.toList());

		return new MyRecordResponseDto(whisky.getWhiskyId(), whisky.getWhiskyImg(), whisky.getKoName(),
			whisky.getEnName(), recordDtos);
	}

	public RecordDetailResponseDto getRecordDetail(Long memberId, Long recordId) {
		Member member = findMember(memberId);
		Record record = findRecord(recordId);

		validateOwnership(member, record);

		return new RecordDetailResponseDto(record.getRecordImg(), record.getRating(), record.getContent(),
			record.getCreatedAt());
	}

	@Transactional
	public void updateRecord(Long memberId, Long whiskyId, Long recordId,
		RecordUpdateRequestDto recordUpdateRequestDto) {
		Member member = findMember(memberId);
		Record record = findRecord(recordId);

		validateOwnership(member, record);

		record.updateRating(recordUpdateRequestDto.rating());
		record.updateContent(recordUpdateRequestDto.content());
		record.updateIsPublic(recordUpdateRequestDto.isPublic());
		record.updateRecordImg(recordUpdateRequestDto.recordImg());

		recordRepository.save(record);
		updateWhiskyStats(whiskyId);
	}

	@Transactional
	public void deleteRecord(Long memberId, Long whiskyId, Long recordId) {
		Member member = findMember(memberId);
		Record record = findRecord(recordId);

		validateOwnership(member, record);

		recordRepository.delete(record);
		updateWhiskyStats(whiskyId);
	}

	@Transactional
	public RecordImageResponseDto uploadImage(MultipartFile multipartFile) {
		String dirName = "record/images/";

		if (multipartFile == null || multipartFile.isEmpty()) {
			throw new BadRequestException(ErrorMessage.FILE_NOT_INCLUDED);
		}

		// 파일 타입 검증 추가
		String contentType = multipartFile.getContentType();
		if (contentType == null || !contentType.startsWith("image/")) {
			// HEIC 파일 특별 처리
			String originalFileName = multipartFile.getOriginalFilename();
			if (originalFileName != null
				&& (originalFileName.toLowerCase().endsWith(".heic") || originalFileName.toLowerCase().endsWith(
				".heif"))) {
				contentType = "image/heic";  // HEIC 파일은 그대로 업로드
			} else {
				throw new BadRequestException(ErrorMessage.INVALID_FILE_FORMAT);
			}
		}

		String fileName = createFileName(multipartFile.getOriginalFilename(), dirName);

		try {
			PutObjectRequest putObjectRequest = PutObjectRequest.builder()
				.bucket(bucket)
				.key(fileName)
				.contentType(contentType)
				.build();

			s3Client.putObject(putObjectRequest,
				RequestBody.fromInputStream(multipartFile.getInputStream(), multipartFile.getSize()));

			String fileUrl = "https://" + bucket + ".s3." + region + ".amazonaws.com/" + fileName;

			return new RecordImageResponseDto(fileUrl);
		} catch (Exception e) {
			log.error("파일 업로드 실패: ", e);  // 로그 추가
			throw new BadRequestException(ErrorMessage.FILE_UPLOAD_FAIL);
		}
	}

	public String createFileName(String fileName, String dirName) {
		String uuid = UUID.randomUUID().toString().replace("-", "");
		String extension = getFileExtension(fileName);
		return dirName + uuid + extension;
	}

	public String getFileExtension(String fileName) {
		if (fileName == null || !fileName.contains(".")) {
			throw new BadRequestException(ErrorMessage.INVALID_FILE_FORMAT);
		}
		return fileName.substring(fileName.lastIndexOf("."));
	}

	private void updateWhiskyStats(Long whiskyId) {
		RecordStats newStats = recordRepository.findStatsByWhiskyId(whiskyId)
			.orElseThrow(() -> new NotFoundException(ErrorMessage.RECORD_NOT_FOUND));
		try {
			elasticsearchClient.update(u -> u.index("whisky")
					.id(whiskyId.toString())
					.doc(Map.of("avgRating", newStats.avgRating(), "recordCounts", newStats.count())),
				WhiskyDocument.class);
		} catch (IOException e) {
			throw new BadRequestException(ErrorMessage.ELASTICSEARCH_UPDATE_FAIL);
		}
	}

	private Member findMember(Long memberId) {
		return memberRepository.findById(memberId)
			.orElseThrow(() -> new NotFoundException(ErrorMessage.MEMBER_NOT_FOUND));
	}

	private Whisky findWhisky(Long whiskyId) {
		return whiskyRepository.findById(whiskyId)
			.orElseThrow(() -> new NotFoundException(ErrorMessage.WHISKY_NOT_FOUND));
	}

	private Record findRecord(Long recordId) {
		return recordRepository.findById(recordId)
			.orElseThrow(() -> new NotFoundException(ErrorMessage.RECORD_NOT_FOUND));
	}

	private void validateOwnership(Member member, Record record) {
		if (!record.getMember().getMemberId().equals(member.getMemberId())) {
			throw new ForbiddenException(ErrorMessage.FORBIDDEN);
		}
	}
}
