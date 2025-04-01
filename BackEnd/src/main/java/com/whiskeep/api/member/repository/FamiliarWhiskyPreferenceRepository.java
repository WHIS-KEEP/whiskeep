package com.whiskeep.api.member.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.whiskeep.api.member.domain.FamiliarWhiskyPreference;
import com.whiskeep.api.member.domain.Member;

public interface FamiliarWhiskyPreferenceRepository extends JpaRepository<FamiliarWhiskyPreference, Long> {

	Optional<FamiliarWhiskyPreference> findByMember(Member member);

	Boolean existsByMember(Member member);

}
