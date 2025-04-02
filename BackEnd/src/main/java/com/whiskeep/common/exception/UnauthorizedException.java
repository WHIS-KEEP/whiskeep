package com.whiskeep.common.exception;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.AuthenticationException;

public class UnauthorizedException extends AuthenticationException {
	public UnauthorizedException(ErrorMessage errorMessage) {
		super(errorMessage.getMessage());
	}
}
