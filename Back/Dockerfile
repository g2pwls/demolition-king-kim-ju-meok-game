# 1단계: 빌드 스테이지
FROM gradle:8.4.0-jdk17 AS builder
WORKDIR /app

# 의존성 캐싱 최적화
COPY build.gradle settings.gradle ./
RUN gradle build -x test || return 0

COPY build/libs/app.jar app.jar

# 전체 소스 복사 및 빌드
COPY . .
RUN gradle build -x test

# 2단계: 실행 스테이지
FROM openjdk:17-jdk-slim
WORKDIR /app

# jar 복사
COPY --from=builder /app/build/libs/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]