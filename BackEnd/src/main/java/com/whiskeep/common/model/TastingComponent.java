package com.whiskeep.common.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class TastingComponent<T> {

	private Double score;
	private T data;

	public void setScore(double score) {
		this.score = score;
	}
}
