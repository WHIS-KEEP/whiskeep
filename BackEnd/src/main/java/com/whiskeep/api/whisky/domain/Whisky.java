package com.whiskeep.api.whisky.domain;

import java.util.Map;

import org.hibernate.annotations.Type;

import com.whiskeep.common.entity.TastingProfile;

import io.hypersistence.utils.hibernate.type.json.JsonBinaryType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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

	@Column(nullable = false, length = 200)
	private String enName;

	@Column(nullable = false, length = 200)
	private String koName;

	@Column(length = 1000)
	private String description;

	@Column(length = 500)
	private String whiskyImg;

	@Column(length = 50)
	private String type;

	@Column(length = 100)
	private String distillery;

	@Column(length = 50)
	private String country;

	private Double abv;

	private Integer age;

	@Type(JsonBinaryType.class)
	@Column(columnDefinition = "jsonb")
	private TastingProfile<Map<String, Double>> nosing;

	@Type(JsonBinaryType.class)
	@Column(columnDefinition = "jsonb")
	private TastingProfile<Map<String, Double>> tasting;

	@Type(JsonBinaryType.class)
	@Column(columnDefinition = "jsonb")
	private TastingProfile<Map<String, Double>> finish;



}
