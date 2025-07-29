# 1단계: 빌드 스테이지
FROM gradle:8.4.0-jdk17 AS builder
WORKDIR /app

COPY . .
RUN gradle build -x test

# 2단계: 실행 스테이지
FROM openjdk:17-jdk-slim
WORKDIR /app

# JAR 복사
COPY --from=builder /app/build/libs/app.jar app.jar

# 📌 리소스 파일 복사 (builder가 아니라 현재 context 기준)
COPY ./src/main/resources ./src/main/resources

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]