package com.whiskeep.api.member.domain;

import org.hibernate.annotations.Type;

import com.whiskeep.common.entity.TastingProfile;

import io.hypersistence.utils.hibernate.type.json.JsonBinaryType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

@Entity
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class MemberPreference {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long memberPreferenceId;

	@OneToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "member_id", nullable = false, unique = true)
	private Member member;

	@Type(JsonBinaryType.class)
	@Column(columnDefinition = "jsonb")
	private TastingProfile<Void> nosing;

	@Type(JsonBinaryType.class)
	@Column(columnDefinition = "jsonb")
	private TastingProfile<Void> tasting;

	@Type(JsonBinaryType.class)
	@Column(columnDefinition = "jsonb")
	private TastingProfile<Void> finish;
}
