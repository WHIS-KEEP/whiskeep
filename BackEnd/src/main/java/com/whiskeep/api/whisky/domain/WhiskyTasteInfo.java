package com.whiskeep.api.whisky.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class WhiskyTasteInfo {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long whiskyTasteId;

	@OneToOne
	@JoinColumn(name = "whisky_id", nullable = false)
	private Whisky whisky;

	private Integer smoky;
	private Integer peaty;
	private Integer spicy;
	private Integer herbal;
	private Integer fullBodied;
	private Integer rich;
	private Integer oily;
	private Integer sweet;
	private Integer vanilla;
	private Integer fruity;
	private Integer tart;
	private Integer floral;
	private Integer salty;
	private Integer briny;

}