package com.whiskeep.common.config;

import org.springframework.context.annotation.Configuration;

import com.p6spy.engine.spy.P6SpyOptions;
import com.whiskeep.common.formatter.P6SpyFormatter;

import jakarta.annotation.PostConstruct;

@Configuration
public class P6SpyConfig {

	@PostConstruct
	public void setLogMessageFormat() {
		P6SpyOptions.getActiveInstance().setLogMessageFormat(P6SpyFormatter.class.getName());
	}
}
