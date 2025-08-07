# 1단계: Node.js 기반 빌드 환경
FROM node:20 AS build

# 작업 디렉토리 설정
WORKDIR /app

# 의존성 설치를 위해 package 파일 복사
COPY package*.json ./

# 불필요한 캐시 제거 후 깨끗한 설치
RUN rm -rf node_modules package-lock.json && npm install

# 전체 소스 복사
COPY . .

# 실행 권한 부여 (Vite, Rollup 관련)
RUN chmod -R +x node_modules/.bin

# 🔧 네이티브 모듈 관련 오류 방지
RUN npm rebuild

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