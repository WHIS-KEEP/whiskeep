package com.whiskeep.api.whisky.dto.response;

import static com.whiskeep.common.formatter.ScoreFormatter.round;

import com.whiskeep.common.exception.ErrorMessage;
import com.whiskeep.common.exception.NotFoundException;
import com.whiskeep.common.model.TastingProfile;

public record WhiskyScoreResponseDto(
	Long whiskyId,
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
		public static TasteScore from(TastingProfile<?> profile) {
			return new TasteScore(
				round(getScore(profile.getFruity())),
				round(getScore(profile.getSweet())),
				round(getScore(profile.getSpicy())),
				round(getScore(profile.getOaky())),
				round(getScore(profile.getHerbal())),
				round(getScore(profile.getBriny()))
			);
		}

		private static Double getScore(com.whiskeep.common.model.TastingComponent<?> component) {
			return component != null ? component.getScore() : null;
		}
	}

	public static WhiskyScoreResponseDto from(Long whiskyId, TastingProfile<?> nosing, TastingProfile<?> tasting,
		TastingProfile<?> finish) {
		return new WhiskyScoreResponseDto(
			whiskyId,
			TasteScore.from(nosing),
			TasteScore.from(tasting),
			TasteScore.from(finish)
		);
	}

}
