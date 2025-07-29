# 1단계: 빌드용 Node 이미지
FROM node:18-alpine as build

WORKDIR /app

# 의존성 먼저 복사 및 설치
COPY package*.json ./
RUN npm install && chmod +x ./node_modules/.bin/vite

# 소스 복사 후 빌드
COPY . .
RUN npm run build

# 2단계: Nginx로 정적 파일 서빙
FROM nginx:alpine

# Vite의 기본 build 폴더는 dist
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]