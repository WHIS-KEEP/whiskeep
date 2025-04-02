package com.whiskeep.common.model;

import com.whiskeep.common.enumclass.TastingCategory;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class TastingProfile<T> {

	private TastingComponent<T> fruity;
	private TastingComponent<T> sweet;
	private TastingComponent<T> spicy;
	private TastingComponent<T> oaky;
	private TastingComponent<T> herbal;
	private TastingComponent<T> briny;

	public TastingComponent<T> getComponent(TastingCategory category) {
		return switch (category) {
			case FRUITY -> fruity;
			case SWEET -> sweet;
			case SPICY -> spicy;
			case OAKY -> oaky;
			case HERBAL -> herbal;
			case BRINY -> briny;
			default -> null;
		};
	}
}
