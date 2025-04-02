package com.whiskeep.api.member.dto;

import java.math.BigDecimal;
import java.math.RoundingMode;

import com.whiskeep.api.member.domain.MemberPreference;
import com.whiskeep.common.model.TastingProfile;

public record MemberScoreResponseDto(
	TasteScore nosing,
	TasteScore tasting,
	TasteScore finish
) {
	public record TasteScore(
		Double fruityScore,
		Double sweetScore,
		Double spicyScore,
		Double oakyScore,
		Double herbalScore,
		Double brinyScore
	) {

		public static TasteScore from(TastingProfile<Double> profile) {
			return new TasteScore(
				round(profile.getFruity().getScore()),
				round(profile.getSweet().getScore()),
				round(profile.getSpicy().getScore()),
				round(profile.getOaky().getScore()),
				round(profile.getHerbal().getScore()),
				round(profile.getBriny().getScore())
			);
		}

		// 소수점 둘째 자리에서 반올림
		private static Double round(Double value) {
			if (value == null) {
				return null;
			}
			return BigDecimal.valueOf(value).setScale(1, RoundingMode.HALF_UP).doubleValue();
		}
	}

	public static MemberScoreResponseDto from(MemberPreference preference) {
		return new MemberScoreResponseDto(
			TasteScore.from(preference.getNosing()),
			TasteScore.from(preference.getTasting()),
			TasteScore.from(preference.getFinish())
		);
	}
}
