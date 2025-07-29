# 1단계: 빌드용 Node 이미지
FROM node:18-alpine as build

WORKDIR /app
COPY . .
RUN npm install && npm run build

COPY . .
RUN npm run build

# 2단계: 빌드된 정적 파일을 서빙할 Nginx
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

# Nginx 기본 설정 사용 또는 필요 시 커스터마이징
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]