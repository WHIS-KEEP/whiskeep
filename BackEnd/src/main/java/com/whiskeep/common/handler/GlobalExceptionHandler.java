package com.whiskeep.common.handler;

import java.util.List;

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

import com.whiskeep.common.exception.BaseException;
import com.whiskeep.common.exception.ErrorMessage;
import com.whiskeep.common.exception.FailResponse;
import com.whiskeep.common.exception.FieldErrorDetail;
import com.whiskeep.common.exception.UnauthorizedException;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

	@Override
	protected ResponseEntity<Object> handleMethodArgumentNotValid(
		MethodArgumentNotValidException ex,
		HttpHeaders headers,
		HttpStatusCode status,
		WebRequest request) {

		List<FieldErrorDetail> errors = ex.getBindingResult()
			.getFieldErrors()
			.stream()
			.map(FieldErrorDetail::of)
			.toList();

		return ResponseEntity.status(HttpStatus.BAD_REQUEST)
			.body(FailResponse.failWithFieldErrors(
				HttpStatus.BAD_REQUEST.value(),
				ErrorMessage.VALIDATION_FAILED.getMessage(),
				errors
			));
	}

	@Override
	protected ResponseEntity<Object> handleMissingServletRequestParameter(
		MissingServletRequestParameterException ex,
		HttpHeaders headers,
		HttpStatusCode status,
		WebRequest request) {

		String errorMessage = String.format(
			"%s: '%s'",
			ErrorMessage.MISSING_PARAMETER.getMessage(),
			ex.getParameterName()
		);

		return ResponseEntity.status(HttpStatus.BAD_REQUEST)
			.body(FailResponse.fail(
				HttpStatus.BAD_REQUEST.value(),
				errorMessage
			));
	}

	@ExceptionHandler(BaseException.class)
	public ResponseEntity<FailResponse> handleBaseException(BaseException ex) {
		return ResponseEntity
			.status(ex.getStatus())
			.body(FailResponse.fail(ex.getStatus().value(), ex.getMessage()));
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<FailResponse> handleUnexpectedException(Exception ex) {
		log.error(ex.getMessage(), ex);
		return ResponseEntity
			.status(HttpStatus.INTERNAL_SERVER_ERROR)
			.body(FailResponse.fail(
				HttpStatus.INTERNAL_SERVER_ERROR.value(),
				ErrorMessage.INTERNAL_SERVER_ERROR.getMessage()
			));
	}

	@ExceptionHandler(UnauthorizedException.class)
	public ResponseEntity<FailResponse> handleUnauthorizedException(UnauthorizedException ex) {
		return ResponseEntity
			.status(HttpStatus.UNAUTHORIZED)
			.body(FailResponse.fail(
				HttpStatus.UNAUTHORIZED.value(),
				ex.getMessage()
			));
	}

}
