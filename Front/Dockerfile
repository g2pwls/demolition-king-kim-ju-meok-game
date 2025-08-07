# 1단계: Node.js 기반 빌드 환경
FROM node:18 as build

# 작업 디렉토리 설정
WORKDIR /app

# 의존성 설치를 위해 package 파일 복사
COPY package*.json ./

# 캐시 제거 및 안정적인 설치를 위해 npm ci 사용
RUN rm -rf node_modules && npm ci

# 전체 앱 소스 복사
COPY . .

# Vite 권한 문제 해결
RUN chmod -R +x node_modules/.bin

# 앱 빌드
RUN npm run build --unsafe-perm

# 2단계: Nginx 경량 이미지로 정적 파일 서빙
FROM nginx:alpine

# 빌드된 정적 파일 복사
COPY --from=build /app/dist /usr/share/nginx/html

# 포트 노출
EXPOSE 80

# Nginx 실행
CMD ["nginx", "-g", "daemon off;"]
