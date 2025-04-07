package com.whiskeep.api.member.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.whiskeep.api.member.domain.Member;
import com.whiskeep.api.member.domain.MemberPreference;

public interface MemberPreferenceRepository extends JpaRepository<MemberPreference, Long> {

	Boolean existsByMember(Member member);

	Optional<MemberPreference> findByMember(Member member);

	void deleteByMember(Member member);
}
