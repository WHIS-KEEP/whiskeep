package com.whiskeep.api.member.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.whiskeep.api.member.domain.Member;
import com.whiskeep.api.member.dto.MemberResponseDto;
import com.whiskeep.api.member.dto.MemberUpdateRequestDto;
import com.whiskeep.api.member.repository.MemberRepository;
import com.whiskeep.api.record.service.RecordService;
import com.whiskeep.common.exception.BadRequestException;
import com.whiskeep.common.exception.ErrorMessage;
import com.whiskeep.common.exception.NotFoundException;

import lombok.RequiredArgsConstructor;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

@Service
@RequiredArgsConstructor
public class MemberService {

	private final MemberRepository memberRepository;
	private final RecordService recordService;
	private final S3Client s3Client;

	@Value("${CLOUD_AWS_REGION_STATIC}")
	private String region;
	@Value("${CLOUD_AWS_S3_BUCKET}")
	private String bucket;

	// 사용자 정보 조회
	public Member getCurrentMember(Long memberId) {

		return memberRepository.findById(memberId)
			.orElseThrow(() -> new NotFoundException(ErrorMessage.MEMBER_NOT_FOUND));
	}

	// 사용자 정보 수정
	@Transactional
	public MemberResponseDto updateMember(Long memberId, MemberUpdateRequestDto request, MultipartFile profileImg) {

		// 1. 회원 조회
		Member member = getCurrentMember(memberId);

		// 2. 닉네임 업데이트
		if (request.nickname() != null && !request.nickname().isBlank()) {
			member.updateNickname(request.nickname());
		}

		// 3. 프로필 이미지가 존재하면 S3에 업로드하고 경로 저장
		if (profileImg != null && !profileImg.isEmpty()) {
			String dirName = "member/images/";

			String fileName = recordService.createFileName(profileImg.getOriginalFilename(), dirName);

			try {

				PutObjectRequest putObjectRequest = PutObjectRequest.builder()
					.bucket(bucket)
					.key(fileName)
					.contentType(profileImg.getContentType())
					.build();

				s3Client.putObject(putObjectRequest,
					RequestBody.fromInputStream(profileImg.getInputStream(), profileImg.getSize()));

				String imgUrl = "https://" + bucket + ".s3." + region + ".amazonaws.com/" + fileName;

				member.updateProfileImg(imgUrl);
			} catch (Exception e) {
				throw new BadRequestException(ErrorMessage.FILE_UPLOAD_FAIL);
			}
		}

		// 4. 업데이트된 회원 정보 응답으로 변환
		return MemberResponseDto.from(member);
	}

	// 닉네임 중복 여부 확인
	public boolean isNicknameAvailable(String nickname) {
		return !memberRepository.existsByNickname(nickname);
	}

	// 회원 탈퇴
	@Transactional
	public void deleteMember(Long memberId) {
		if (!memberRepository.existsById(memberId)) {
			throw new NotFoundException(ErrorMessage.MEMBER_NOT_FOUND);
		}

		memberRepository.deleteById(memberId);
	}
}
