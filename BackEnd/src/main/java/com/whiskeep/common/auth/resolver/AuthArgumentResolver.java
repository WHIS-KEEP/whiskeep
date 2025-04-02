package com.whiskeep.common.auth.resolver;

import org.springframework.core.MethodParameter;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

import com.whiskeep.common.auth.annotation.Auth;
import com.whiskeep.common.exception.ErrorMessage;
import com.whiskeep.common.exception.UnauthorizedException;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class AuthArgumentResolver implements HandlerMethodArgumentResolver {

	@Override
	public boolean supportsParameter(MethodParameter parameter) {
		// 1. 파라미터에 @Auth 어노테이션이 있는지 확인
		boolean hasAuthAnnotation = parameter.hasParameterAnnotation(Auth.class);

		// 2. 파라미터 타입으로 Long 타입이 들어왔는지 확인
		boolean hasMemberType = Long.class.isAssignableFrom(parameter.getParameterType());

		// 3. 둘 다 true 인 경우에만 해당 Resolver가 동작
		return hasAuthAnnotation && hasMemberType;

	}

	@Override
	public Object resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer,
		NativeWebRequest webRequest, WebDataBinderFactory binderFactory) {

		// @Auth annotation 정보 가져오기
		Auth authAnnotation = parameter.getParameterAnnotation(Auth.class);

		// SecurityContext에서 인증된 사용자 정보 가져오기
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

		// 인증된 사용자가 없으면 예외 처리
		if (authentication == null || authentication.getPrincipal() == null) {
			// @Auth(required = false) 인 경우
			if (authAnnotation != null && !authAnnotation.required()) {
				return null; // 인증 없이 처리 가능
			} else {
				throw new UnauthorizedException(ErrorMessage.UNAUTHORIZED);
			}
		}

		return (Long) authentication.getPrincipal();
	}

}
