# 1단계: 빌드 스테이지
FROM gradle:8.4.0-jdk17 AS builder
WORKDIR /app

COPY . .
RUN gradle build -x test       # 테스트 생략하고 빌드 수행

# 2단계: 실행 스테이지
FROM openjdk:17-jdk-slim
WORKDIR /app

# 빌드된 JAR을 app.jar로 복사
#COPY --from=builder /app/build/libs/demo-0.0.1-SNAPSHOT.jar app.jar
COPY --from=builder /app/build/libs/app.jar app.jar
COPY ./Back/src/main/resources ./app/src/main/resources

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]