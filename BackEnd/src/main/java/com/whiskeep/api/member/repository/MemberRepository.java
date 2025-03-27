package com.whiskeep.api.member.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.whiskeep.api.member.domain.Member;

public interface MemberRepository extends JpaRepository<Member, Long> {

}
