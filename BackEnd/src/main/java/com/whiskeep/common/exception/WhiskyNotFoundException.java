package com.whiskeep.common.exception;

public class WhiskyNotFoundException extends  RuntimeException{

	public WhiskyNotFoundException(String koName) {
		super( koName + "을 찾을 수 없습니다");
	}
}
