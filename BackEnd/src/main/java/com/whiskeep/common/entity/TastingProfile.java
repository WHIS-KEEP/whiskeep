package com.whiskeep.common.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

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
}
