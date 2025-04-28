FROM gradle:8.13-jdk21-alpine AS build

WORKDIR /app

COPY ../build.gradle ../settings.gradle ./
COPY ../gradle ./gradle
COPY ../gradlew ./
RUN chmod +x gradlew

RUN ./gradlew dependencies --no-daemon

COPY ../src ./src

RUN ./gradlew clean bootJar -x checkstyleMain -x checkstyleTest --no-daemon

FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

COPY --from=build /app/build/libs/*.jar app.jar

ENTRYPOINT ["java", "-Duser.timezone=Asia/Seoul", "-jar", "app.jar", "--server.port=8081"]
