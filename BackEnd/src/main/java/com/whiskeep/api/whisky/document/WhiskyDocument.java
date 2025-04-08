package com.whiskeep.api.whisky.document;

import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Document(indexName = "whisky")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WhiskyDocument {
	@Id
	private Long whiskyId;
	private String enName;
	private String koName;
	private String type;
	private Double abv;
	private Integer age;
	private Double avgRating;
	private Integer recordCounts;
	private String whiskyImg;
}
