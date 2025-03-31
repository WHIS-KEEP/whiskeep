package com.whiskeep.common.auth.resolver;

import org.springframework.core.MethodParameter;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

import com.whiskeep.api.member.domain.Member;
import com.whiskeep.api.member.repository.MemberRepository;
import com.whiskeep.common.auth.annotation.Auth;
import com.whiskeep.common.exception.ErrorMessage;
import com.whiskeep.common.exception.NotFoundException;
import com.whiskeep.common.exception.UnauthorizedException;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class AuthArgumentResolver implements HandlerMethodArgumentResolver {

	private final MemberRepository memberRepository;

	@Override
	public boolean supportsParameter(MethodParameter parameter) {
		// 1. 파라미터에 @Auth 어노테이션이 있는지 확인
		boolean hasAuthAnnotation = parameter.hasParameterAnnotation(Auth.class);

		// 2. 파라미터 타입으로 Member 타입이 들어왔는지 확인
		boolean hasMemberType = Member.class.isAssignableFrom(parameter.getParameterType());

		// 3. 둘 다 true 인 경우에만 해당 Resolver가 동작
		return hasAuthAnnotation && hasMemberType;

	}

	@Override
	public Object resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer,
		NativeWebRequest webRequest, WebDataBinderFactory binderFactory) {

		// @Auth annotation 정보 가져오기
		Auth authAnnotation = parameter.getParameterAnnotation(Auth.class);

		// HttpServletRequest 객체를 통해 memberId 추출하기
		HttpServletRequest request = (HttpServletRequest)webRequest.getNativeRequest();
		Long memberId = (Long)request.getAttribute("memberId");

		// 인증 정보가 없는 경우(토큰 없음 또는 잘못된 정보가 들어오는 경우)
		if (memberId == null) {
			// @Auth(required = false) 인 경우
			if (authAnnotation != null && !authAnnotation.required()) {
				throw new UnauthorizedException(ErrorMessage.UNAUTHORIZED);
			} else {
				return null;
			}
		}

		// memberId가 있는 경우, DB에서 Member 조회
		return memberRepository.findById(memberId)
			.orElseThrow(() -> new NotFoundException(ErrorMessage.MEMBER_NOT_FOUND));
	}

}
