# ✅ 정적 파일 서빙만 담당하는 간단한 Nginx 베이스 Dockerfile

FROM nginx:alpine

# Vite에서 빌드된 정적 파일을 nginx 기본 루트로 복사
COPY ./dist /usr/share/nginx/html

# 포트 노출
EXPOSE 80

# Nginx 실행
CMD ["nginx", "-g", "daemon off;"]