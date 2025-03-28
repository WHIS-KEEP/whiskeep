package com.whiskeep.common.enumclass;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ErrorMessage {

	// 회원 관련 오류
	MEMBER_NOT_FOUND("회원을 찾을 수 없습니다."),
	MEMBER_ALREADY_EXISTS("이미 존재하는 회원입니다"),
	INVALID_MEMBER_ID("유효하지 않은 회원 ID입니다"),

	// 인증 관련 오류
	UNAUTHORIZED("인증에 실패했습니다"),
	FORBIDDEN("접근 권한이 없습니다"),

	// 일반 오류
	INVALID_INPUT("입력값이 유효하지 않습니다"),
	METHOD_NOT_ALLOWED("지원하지 않는 HTTP 메소드입니다"),
	MEDIA_TYPE_NOT_SUPPORTED("지원하지 않는 미디어 타입입니다"),
	MISSING_PARAMETER("필수 파라미터가 누락되었습니다"),
	VALIDATION_FAILED("유효성 검증에 실패했습니다"),
	INTERNAL_SERVER_ERROR("서버 내부 오류가 발생했습니다");
	private final String message;
}



