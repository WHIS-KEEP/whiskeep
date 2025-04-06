package com.whiskeep.api.whiskylike.dto;

import com.whiskeep.api.whisky.domain.Whisky;

public record LikeResponseDto(
	Long whiskyId,
	String koName,
	String whiskyImg,
	Double abv
) {
	public static LikeResponseDto of(Whisky whisky) {
		return new LikeResponseDto(
			whisky.getWhiskyId(),
			whisky.getKoName(),
			whisky.getWhiskyImg(),
			whisky.getAbv()
		);
	}
}
