package com.whiskeep.api.record.service;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.whiskeep.api.member.domain.Member;
import com.whiskeep.api.member.repository.MemberRepository;
import com.whiskeep.api.member.service.PreferenceService;
import com.whiskeep.api.record.domain.Record;
import com.whiskeep.api.record.dto.RecordImageResponseDto;
import com.whiskeep.api.record.dto.request.RecordCreateRequestDto;
import com.whiskeep.api.record.dto.request.RecordUpdateRequestDto;
import com.whiskeep.api.record.dto.response.MyRecordResponseDto;
import com.whiskeep.api.record.dto.response.RecordDetailResponseDto;
import com.whiskeep.api.record.repository.RecordRepository;
import com.whiskeep.api.whisky.domain.Whisky;
import com.whiskeep.api.whisky.dto.response.RecordListResponseDto;
import com.whiskeep.api.whisky.dto.response.WhiskyRecordResponseDto;
import com.whiskeep.api.whisky.repository.WhiskyRepository;
import com.whiskeep.common.exception.BadRequestException;
import com.whiskeep.common.exception.ErrorMessage;
import com.whiskeep.common.exception.ForbiddenException;
import com.whiskeep.common.exception.NotFoundException;

import lombok.RequiredArgsConstructor;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RecordService {

	private final RecordRepository recordRepository;
	private final MemberRepository memberRepository;
	private final WhiskyRepository whiskyRepository;
	private final S3Client s3Client;
	private final PreferenceService preferenceService;

	@Value("${CLOUD_AWS_REGION_STATIC}")
	private String region;
	@Value("${CLOUD_AWS_S3_BUCKET}")
	private String bucket;

	@Transactional
	public void addRecord(Long memberId, RecordCreateRequestDto recordCreateRequestDto) {

		// 1. 유효성 검사
		Whisky whisky = whiskyRepository.findById(recordCreateRequestDto.whiskyId())
			.orElseThrow(() -> new NotFoundException(ErrorMessage.WHISKY_NOT_FOUND));

		Member member = memberRepository.findById(memberId)
			.orElseThrow(() -> new NotFoundException(ErrorMessage.MEMBER_NOT_FOUND));

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

		// 3. 기록한 위스키가 3병 이상일 경우, 사용자 점수 갱신
		Set<Long> distinctWhiskyIds = recordRepository.findDistinctWhiskyIdsByMember(member);
		System.out.println("위스키 아이디 리스트 : " + distinctWhiskyIds);

		if (distinctWhiskyIds.size() >= 3) {
			List<Whisky> whiskyList = whiskyRepository.findAllById(distinctWhiskyIds);
			List<Double> ratingList =
				whiskyList.stream()
					.map(w -> recordRepository.findAverageRatingByWhiskyId(w.getWhiskyId()).orElse(5.0))
					.toList();

			preferenceService.updateMemberPreference(member, whiskyList, ratingList);
		}

	}

	public Integer countRecord(Long whiskyId) {

		return recordRepository.countRecordsByWhisky_WhiskyId(whiskyId);
	}

	public Double getAverageRating(Long whiskyId) {

		return recordRepository.findAverageRatingByWhiskyId(whiskyId).orElse(0.0);

	}

	public RecordListResponseDto getRecordByWhiskyId(Long whiskyId, int page, int size) {

		Pageable pageable = PageRequest.of(page, size);
		Page<Record> recordPage = recordRepository.findByWhiskyWhiskyIdAndIsPublicTrueOrderByCreatedAtDesc(
			whiskyId, pageable);

		List<RecordListResponseDto.RecordResponseDto> records = recordPage.getContent().stream()
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

		return RecordListResponseDto.builder()
			.records(records)
			.pageInfo(pageInfo)
			.build();

	}

	public List<WhiskyRecordResponseDto> getWhiskyRecordsByMember(Long memberId) {

		Member member = memberRepository.findById(memberId)
			.orElseThrow(() -> new NotFoundException(ErrorMessage.MEMBER_NOT_FOUND));

		//login 한 유저의 모든 record 를 map 으로 수집 후, list 로 반환하여 중복 제거
		return recordRepository.findAllByMember(member)
			.stream()
			.collect(Collectors.toMap(
				record -> {
					return Optional.ofNullable(record)
						.map(r -> r.getWhisky())
						.map(w -> w.getWhiskyId())
						.orElseThrow(() -> new NotFoundException(ErrorMessage.RECORD_NOT_FOUND));
				},
				record -> {
					Whisky whisky = record.getWhisky();
					return new WhiskyRecordResponseDto(
						whisky.getWhiskyId(),
						whisky.getWhiskyImg()
					);
				},
				(existing, replacement) -> existing
			))
			.values()
			.stream()
			.collect(Collectors.toList());
	}

	public MyRecordResponseDto getRecordByWhiskyIdAndMember(Long whiskyId, Long memberId) {

		Member member = memberRepository.findById(memberId)
			.orElseThrow(() -> new NotFoundException(ErrorMessage.MEMBER_NOT_FOUND));

		Whisky whisky = whiskyRepository.findById(whiskyId)
			.orElseThrow(() -> new NotFoundException(ErrorMessage.WHISKY_NOT_FOUND));

		List<MyRecordResponseDto.RecordSummaryDto> recordDtos =
			recordRepository.findAllByMemberAndWhisky(member, whisky)
				.stream()
				.map(record -> new MyRecordResponseDto.RecordSummaryDto(
					record.recordId(),
					record.recordImg()
				))
				.collect(Collectors.toList());

		return new MyRecordResponseDto(
			whisky.getWhiskyId(),
			whisky.getWhiskyImg(),
			whisky.getKoName(),
			whisky.getEnName(),
			recordDtos
		);

	}

	public RecordDetailResponseDto getRecordDetail(Long memberId, Long recordId) {

		Member member = memberRepository.findById(memberId)
			.orElseThrow(() -> new NotFoundException(ErrorMessage.MEMBER_NOT_FOUND));

		Record record = recordRepository.findById(recordId)
			.orElseThrow(() -> new NotFoundException(ErrorMessage.RECORD_NOT_FOUND));

		//기록을 쓴 유저인지 확인
		if (!record.getMember().getMemberId().equals(member.getMemberId())) {
			throw new ForbiddenException(ErrorMessage.FORBIDDEN);
		}

		return new RecordDetailResponseDto(
			record.getRecordImg(),
			record.getRating(),
			record.getContent(),
			record.getCreatedAt()
		);

	}

	@Transactional
	public void updateRecord(Long memberId, Long recordId, RecordUpdateRequestDto recordUpdateRequestDto) {
		Member member = memberRepository.findById(memberId)
			.orElseThrow(() -> new NotFoundException(ErrorMessage.MEMBER_NOT_FOUND));

		// 기존 레코드 조회
		Record record = recordRepository.findById(recordId)
			.orElseThrow(() -> new NotFoundException(ErrorMessage.RECORD_NOT_FOUND));

		// 권한 확인 (자신의 기록만 수정 가능)
		if (!record.getMember().getMemberId().equals(member.getMemberId())) {
			throw new ForbiddenException(ErrorMessage.FORBIDDEN);
		}

		record.updateRating(recordUpdateRequestDto.rating());
		record.updateContent(recordUpdateRequestDto.content());
		record.updateIsPublic(recordUpdateRequestDto.isPublic());
		record.updateRecordImg(recordUpdateRequestDto.recordImg());

		recordRepository.save(record);
	}

	@Transactional
	public void deleteRecord(Long memberId, Long recordId) {

		Member member = memberRepository.findById(memberId)
			.orElseThrow(() -> new NotFoundException(ErrorMessage.MEMBER_NOT_FOUND));

		Record record = recordRepository.findById(recordId)
			.orElseThrow(() -> new NotFoundException(ErrorMessage.RECORD_NOT_FOUND));

		if (!record.getMember().getMemberId().equals(member.getMemberId())) {
			throw new ForbiddenException(ErrorMessage.FORBIDDEN);
		}

		recordRepository.delete(record);

	}

	@Transactional
	public RecordImageResponseDto uploadImage(MultipartFile multipartFile) {
		String dirName = "record/images/";

		if (multipartFile == null || multipartFile.isEmpty()) {
			throw new BadRequestException(ErrorMessage.FILE_NOT_INCLUDED);
		}

		String fileName = createFileName(multipartFile.getOriginalFilename(), dirName);

		try {

			PutObjectRequest putObjectRequest = PutObjectRequest.builder()
				.bucket(bucket)
				.key(fileName)
				.contentType(multipartFile.getContentType())
				.build();

			s3Client.putObject(putObjectRequest,
				RequestBody.fromInputStream(multipartFile.getInputStream(), multipartFile.getSize()));

			String fileUrl = "https://" + bucket + ".s3." + region + ".amazonaws.com/" + fileName;

			return new RecordImageResponseDto(fileUrl);
		} catch (Exception e) {
			throw new BadRequestException(ErrorMessage.FILE_UPLOAD_FAIL);
		}
	}

	private String createFileName(String fileName, String dirName) {
		String uuid = UUID.randomUUID().toString().replace("-", "");
		String extension = getFileExtension(fileName);
		return dirName + uuid + extension;
	}

	private String getFileExtension(String fileName) {
		if (fileName == null || !fileName.contains(".")) {
			throw new BadRequestException(ErrorMessage.INVALID_FILE_FORMAT);
		}
		return fileName.substring(fileName.lastIndexOf("."));
	}

}
