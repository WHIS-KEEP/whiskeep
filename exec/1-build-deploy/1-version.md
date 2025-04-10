## [IDE]

## [BE]

📌 핵심 프레임워크

| 구분 | 라이브러리/도구 | 버전 |
| --- | --- | --- |
| Java | Liberica JDK | 21 |
| Spring Boot | Spring Boot, Spring Data JPA, Spring Security | 3.4.3 |

---

⚒️ 개발 도구 및 품질 관리

| 구분 | 라이브러리/도구 | 버전 |
| --- | --- | --- |
| Checkstyle | naver-checkstyle-rules |  |
| Logger | Slf4j |  |
| DB Logging | p6spy | 1.9.2 |
| QueryDSL | querydsl-jpa / apt | 5.0.0 (jakarta) |
---

🗄️ DB 및 검색

| 구분 | 라이브러리/도구 | 버전 |
| --- | --- | --- |
| AWS RDS | postgresql |  |
| PostgreSQL Driver | postgresql | 42.5.0 |
| Elasticsearch | spring-data-elasticsearch | 5.4.4 |
| Redis | spring-boot-starter-data-redis |  |

---

## [FE]

위에 처럼 나눠도 조아용~~~

## [INFRA]

| 구분 | 도구/서비스 | 역할 |
| --- | --- | --- |
| CI | GitLab CI | checkstyle → build → test |
| CI/CD | Jenkins | 빌드 및 배포 자동화 |
| Web Server | Nginx | 리버스 프록시, 정적 리소스 서빙 |
| Container, Orchestration | Docker, Docker Compose | 서비스 컨테이너화, 환경 관리 |
| AWS | EC2 | prod 서버 호스팅 |
| AWS | RDS (PostgreSQL) | prod RDB |
| AWS | S3 | 정적 파일 저장 |
| 도메인 | Cloudflare | DNS 관리, 트래픽 보호 |
| SSL 인증서 | Let's Encrypt | 무료 SSL 인증서 발급 및 갱신 자동화 |
