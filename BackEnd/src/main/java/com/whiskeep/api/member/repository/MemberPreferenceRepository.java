package com.whiskeep.api.member.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.whiskeep.api.member.domain.Member;
import com.whiskeep.api.member.domain.MemberPreference;

public interface MemberPreferenceRepository extends JpaRepository<MemberPreference, Long> {

	Boolean existsByMember(Member member);
}
