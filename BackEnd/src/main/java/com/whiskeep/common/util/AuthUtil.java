package com.whiskeep.common.util;

import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import com.whiskeep.common.exception.ErrorMessage;
import com.whiskeep.common.exception.UnauthorizedException;

public class AuthUtil {

	public static Long getCurrentMemberId() {
		if (!isAuthenticated()) {
			throw new UnauthorizedException(ErrorMessage.UNAUTHORIZED);
		}

		Object principal = getAuthentication().getPrincipal();
		if (!(principal instanceof Long)) {
			throw new UnauthorizedException(ErrorMessage.UNAUTHORIZED);
		}

		return (Long) principal;
	}

	public static String getCurrentAccessToken() {
		if (!isAuthenticated()) {
			throw new UnauthorizedException(ErrorMessage.UNAUTHORIZED);
		}

		Object credentials = getAuthentication().getCredentials();
		if (!(credentials instanceof String)) {
			throw new UnauthorizedException(ErrorMessage.UNAUTHORIZED);
		}

		return (String) credentials;
	}

	private static Authentication getAuthentication() {
		return SecurityContextHolder.getContext().getAuthentication();
	}

	public static boolean isAuthenticated() {
		Authentication authentication = getAuthentication();
		return authentication != null
			&& authentication.isAuthenticated()
			&& !(authentication instanceof AnonymousAuthenticationToken);
	}
}
