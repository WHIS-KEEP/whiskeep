package com.whiskeep.api.whisky.domain;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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
public class Whisky {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long whiskyId;

	@OneToOne(mappedBy = "whisky", cascade = CascadeType.ALL)
	private WhiskyTasteInfo whiskyTasteInfo;

	@Column(nullable = false, length = 200)
	private String enName;

	@Column(nullable = false, length = 200)
	private String koName;

	@Column(length = 500)
	private String whiskyImg;

	@Column(length = 50)
	private String type;

	@Column(length = 100)
	private String distillery;

	@Column(length = 50)
	private String country;

	private Integer abv;

	@Column(length = 1000)
	private String description;

	private Float ratingAvg;

	private Integer recordCnt;

	private Boolean isTaste;

	@Column(length = 100)
	private String caskType;
}
