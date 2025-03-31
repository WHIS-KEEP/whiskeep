package com.whiskeep.api.member.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.whiskeep.api.member.domain.InitialWhiskyPreference;
import com.whiskeep.api.member.domain.Member;

public interface InitialWhiskyPreferenceRepository extends JpaRepository<InitialWhiskyPreference, Long> {

	Optional<InitialWhiskyPreference> findByMember(Member member);

	Boolean existsByMember(Member member);

}
