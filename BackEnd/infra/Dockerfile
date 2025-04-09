### 1️⃣ Builder Stage: Gradle로 JAR 빌드
FROM gradle:8.13-jdk21-alpine AS build

WORKDIR /app

# 종속성 캐싱 최적화: 먼저 build 설정 복사
COPY ../build.gradle ../settings.gradle ./
COPY ../gradle ./gradle
COPY ../gradlew ./
RUN chmod +x gradlew

# 의존성만 먼저 다운로드 (캐시 활용)
RUN ./gradlew dependencies --no-daemon

# 소스 코드 복사
COPY ../src ./src

# bootJar 생성 (Checkstyle 생략)
RUN ./gradlew clean bootJar -x checkstyleMain -x checkstyleTest --no-daemon

### 2️⃣ Runtime Stage: JRE Slim
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# JAR 파일만 복사
COPY --from=build /app/build/libs/*.jar app.jar

# 실행
ENTRYPOINT ["java", "-Duser.timezone=Asia/Seoul", "-jar", "app.jar", "--server.port=8081"]
