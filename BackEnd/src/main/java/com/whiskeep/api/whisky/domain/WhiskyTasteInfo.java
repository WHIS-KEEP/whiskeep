package com.whiskeep.api.whisky.domain;

import com.whiskeep.api.whisky.domain.Whisky;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "whisky_taste_info")
public class WhiskyTasteInfo {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long whiskyTasteId;

	@JoinColumn(name = "whisky_id", nullable = false)
    private Whisky whisky;

	private int smoky;
	private int peaty;
	private int spicy;
	private int herbal;
	private int fullBodied;
	private int rich;
	private int oily;
	private int sweet;
	private int vanilla;
	private int fruity;
	private int tart;
	private int floral;
	private int salty;
	private int briny;