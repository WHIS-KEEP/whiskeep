package com.whiskeep.api.member.dto;

import static com.whiskeep.common.formatter.ScoreFormatter.round;

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
	}

	public static MemberScoreResponseDto from(MemberPreference preference) {
		return new MemberScoreResponseDto(
			TasteScore.from(preference.getNosing()),
			TasteScore.from(preference.getTasting()),
			TasteScore.from(preference.getFinish())
		);
	}
}
