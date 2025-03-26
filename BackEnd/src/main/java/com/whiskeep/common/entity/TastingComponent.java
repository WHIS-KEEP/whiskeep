package com.whiskeep.common.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class TastingComponent<T> {

	private Double score;
	private T data;
}
