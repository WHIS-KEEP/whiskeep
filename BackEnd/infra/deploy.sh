FROM openjdk:21-slim AS build

RUN apt-get update && apt-get install -y bash

WORKDIR /app

COPY ../build.gradle .
COPY ../settings.gradle .
COPY ../gradle gradle/
COPY ../gradlew .
RUN chmod +x gradlew

RUN ./gradlew dependencies

COPY ../src src

RUN ./gradlew clean bootJar -x checkstyleMain -x checkstyleTest

# 실행 환경
FROM openjdk:21-slim

WORKDIR /app

COPY --from=build /app/build/libs/*.jar app.jar

ENTRYPOINT ["java", "-Duser.timezone=Asia/Seoul", "-jar", "app.jar", "--server.port=8081"]
