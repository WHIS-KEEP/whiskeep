package com.whiskeep.api.recommend.dto;

import static com.whiskeep.common.formatter.ScoreFormatter.round;

import com.whiskeep.common.model.TastingComponent;
import com.whiskeep.common.model.TastingProfile;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class RecommendResponseDto {

	private Long whiskyId;
	private String koName;
	private String whiskyImg;
	private Double abv; //도수
	private Double similarity;
	private CategoryScore tastingScore;

	@Getter
	@Builder
	public static class CategoryScore {

		private Double fruityScore;
		private Double sweetScore;
		private Double spicyScore;
		private Double oakyScore;
		private Double herbalScore;
		private Double brinyScore;

		public static CategoryScore from(TastingProfile<?> tastingProfile) {
			return CategoryScore.builder()
				.fruityScore(round(getScore(tastingProfile.getFruity())))
				.sweetScore(round(getScore(tastingProfile.getSweet())))
				.spicyScore(round(getScore(tastingProfile.getSpicy())))
				.oakyScore(round(getScore(tastingProfile.getOaky())))
				.herbalScore(round(getScore(tastingProfile.getHerbal())))
				.brinyScore(round(getScore(tastingProfile.getBriny())))
				.build();
		}

		private static Double getScore(TastingComponent<?> component) {
			return component != null ? component.getScore() : null;
		}
	}
}
