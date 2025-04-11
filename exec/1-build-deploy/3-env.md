## 각 .env 파일은 환경에 따라 달라집니다.  
(local, dev, prod 각각 관리)

<details> <summary><code>BackEnd/infra/.env</code></summary>

```yaml
# RDS Postgresql DataSource
SPRING_DATASOURCE_URL=jdbc:postgresql://<HOST>:<PORT>/<DB_NAME>
SPRING_DATASOURCE_USERNAME=<USER_NAME>
SPRING_DATASOURCE_PASSWORD=
SPRING_DATASOURCE_DRIVER_CLASS_NAME=org.postgresql.Driver

# Redis 설정
SPRING_DATA_REDIS_HOST=redis
SPRING_DATA_REDIS_PORT=6379
SPRING_DATA_REDIS_SSL_ENABLED=false

# 로그 설정
DECORATOR_DATASOURCE_P6SPY_ENABLE_LOGGING=false

# JWT 비밀키 및 유효기간 설정
JWT_SECRET=
JWT_EXPIRATION=86400000

# KAKAO 소셜 로그인 환경변수
KAKAO_CLIENT_ID=
KAKAO_CLIENT_SECRET=
KAKAO_REDIRECT_URI=https://www.whiskeep.com/login/success
KAKAO_AUTHORIZATION_URI=https://kauth.kakao.com/oauth/authorize
KAKAO_TOKEN_URI=https://kauth.kakao.com/oauth/token
KAKAO_USER_INFO_URI=https://kapi.kakao.com/v2/user/me

# GOOGLE 소셜 로그인 환경변수
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=https://www.whiskeep.com/login/success
GOOGLE_AUTHORIZATION_URI=https://accounts.google.com/o/oauth2/auth
GOOGLE_TOKEN_URI=https://oauth2.googleapis.com/token
GOOGLE_USER_INFO_URI=https://www.googleapis.com/oauth2/v2/userinfo

# AWS 설정
CLOUD_AWS_CREDENTIALS_ACCESS_KEY=
CLOUD_AWS_CREDENTIALS_SECRET_KEY=
CLOUD_AWS_REGION_STATIC=us-east-2
CLOUD_AWS_S3_BUCKET=whiskeep-bucket
CLOUD_AWS_STACK_AUTO=false

# open ai 설정
OPEN_AI_API_KEY=

# python api 설정
FAST_API_URL=https://j12a409.p.ssafy.io/ocr/

# Elasticsearch 설정
SPRING_DATA_ES_URIS=
```

</details> <details> <summary><code>FrontEnd/infra/.env</code></summary>

```yaml
VITE_API_URL=https://www.whiskeep.com/api
```
