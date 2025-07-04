package com.whiskeep.api.member.domain;

import com.whiskeep.common.entity.BaseTimeEntity;
import com.whiskeep.common.enumclass.Provider;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class Member extends BaseTimeEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long memberId;

	@Column(nullable = false, length = 45, unique = true)
	private String email;

	@Column(nullable = false, length = 20)
	private String name;

	@Column(length = 50, unique = true)
	private String nickname;

	@Column(length = 500)
	private String profileImg;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 6)
	private Provider provider;

	@Column(nullable = false, unique = true)
	private String providerId;

	// 닉네임 업데이트
	public void updateNickname(String nickname) {
		this.nickname = nickname;
	}

	// 프로필 이미지 URL 업데이트
	public void updateProfileImg(String profileImg) {
		this.profileImg = profileImg;
	}
}
