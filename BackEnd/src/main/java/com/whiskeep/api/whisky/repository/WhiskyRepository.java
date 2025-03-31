package com.whiskeep.api.whisky.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.whiskeep.api.whisky.domain.Whisky;

public interface WhiskyRepository extends JpaRepository<Whisky,Long> {
}
