package com.whiskeep.common.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;

@Configuration
public class S3Config {

	@Value("${CLOUD_AWS_CREDENTIALS_ACCESS_KEY}")
	private String accessKey;

	@Value("${CLOUD_AWS_CREDENTIALS_SECRET_KEY}")
	private String secretKey;

	@Value("${CLOUD_AWS_REGION_STATIC}")
	private String region;

	@Bean
	public S3Client s3Client() {
		AwsBasicCredentials awsCredentials = AwsBasicCredentials.create(accessKey, secretKey);

		return S3Client.builder()
			.region(Region.of(region))
			.credentialsProvider(StaticCredentialsProvider.create(awsCredentials))
			.build();
	}
}
