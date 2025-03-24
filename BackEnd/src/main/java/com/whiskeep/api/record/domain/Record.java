package com.whiskeep.api.record.domain;

import java.time.LocalDateTime;

import com.whiskeep.api.member.domain.Member;
import com.whiskeep.api.whisky.domain.Whisky;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Record {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long recordId;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "member_id", nullable = false)
	private Member member;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "whisky_id", nullable = false)
	private Whisky whisky;

	@Column(nullable = false)
	private Integer rating;

	@Column(length = 1000)
	private String content;

	@Column(length = 500)
	private String recordImg;

	@Column(nullable = false)
	private Boolean isPublic;

	@Column(nullable = false, updatable = false)
	private LocalDateTime createdAt;
}
