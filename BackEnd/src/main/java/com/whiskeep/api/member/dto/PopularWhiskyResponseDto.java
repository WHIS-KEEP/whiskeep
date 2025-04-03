package com.whiskeep.api.member.dto;

public record PopularWhiskyResponseDto(
	Long whiskyId,
	String koName,
	String whiskyImg
) {
}
