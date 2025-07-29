# 1단계: 빌드용 Node 이미지
FROM node:18-alpine as build

WORKDIR /app

# 의존성 먼저 복사 및 설치 (캐시 최적화)
COPY package*.json ./
RUN npm install

# vite 실행권한 부여
RUN chmod +x node_modules/.bin/vite

# 앱 소스 복사 후 빌드
COPY . .
RUN npm run build

# 2단계: 빌드된 정적 파일을 서빙할 Nginx
FROM nginx:alpine

# 빌드된 결과물(dist)을 Nginx 정적 파일 경로로 복사
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]