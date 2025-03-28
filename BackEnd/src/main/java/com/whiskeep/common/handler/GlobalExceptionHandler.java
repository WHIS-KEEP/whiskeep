package com.whiskeep.common.handler;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.util.stream.Collectors;

import com.whiskeep.common.enumclass.ErrorMessage;
import com.whiskeep.common.exception.FailResponse;
import com.whiskeep.common.exception.WhiskyNotFoundException;

@RestControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

	// Bean Validation 실패 처리
	@Override
	protected ResponseEntity<Object> handleMethodArgumentNotValid(
		MethodArgumentNotValidException ex,
		HttpHeaders headers,
		HttpStatusCode status,
		WebRequest request) {

		String errorMessage = ex.getBindingResult().getFieldErrors().stream()
			.map(error -> error.getField() + ": " + error.getDefaultMessage())
			.collect(Collectors.joining(", "));

		return new ResponseEntity<>(
			FailResponse.fail(status.value(), ErrorMessage.VALIDATION_FAILED.getMessage() + " - " + errorMessage),
			headers,
			status);
	}

	// 필수 파라미터 누락 처리
	@Override
	protected ResponseEntity<Object> handleMissingServletRequestParameter(
		MissingServletRequestParameterException ex,
		HttpHeaders headers,
		HttpStatusCode status,
		WebRequest request) {

		String errorMessage = "필수 파라미터 '" + ex.getParameterName() + "'이(가) 누락되었습니다";

		return new ResponseEntity<>(
			FailResponse.fail(status.value(), errorMessage),
			headers,
			status);
	}

	// 위스키 찾을 수 없음 예외 처리
	@ExceptionHandler(WhiskyNotFoundException.class)
	public ResponseEntity<FailResponse> handleWhiskyNotFoundException(WhiskyNotFoundException ex) {
		return ResponseEntity
			.status(HttpStatus.NOT_FOUND)
			.body(FailResponse.fail(HttpStatus.NOT_FOUND.value(), ex.getMessage()));
	}

	// 잘못된 인자 예외 처리
	@ExceptionHandler(IllegalArgumentException.class)
	public ResponseEntity<FailResponse> handleIllegalArgumentException(IllegalArgumentException ex) {
		return ResponseEntity
			.status(HttpStatus.BAD_REQUEST)
			.body(FailResponse.fail(HttpStatus.BAD_REQUEST.value(), ex.getMessage()));
	}

	// 기타 모든 예외 처리
	@ExceptionHandler(Exception.class)
	public ResponseEntity<FailResponse> handleAllUncaughtExceptions(Exception ex) {
		return ResponseEntity
			.status(HttpStatus.INTERNAL_SERVER_ERROR)
			.body(FailResponse.fail(
				HttpStatus.INTERNAL_SERVER_ERROR.value(),
				ErrorMessage.INTERNAL_SERVER_ERROR.getMessage()));
	}
}