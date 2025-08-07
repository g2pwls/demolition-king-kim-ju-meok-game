# 1단계: Node.js 기반 빌드 이미지
FROM node:18-alpine as build

# 작업 디렉토리 설정
WORKDIR /app

# package.json과 lock 파일 복사 후 의존성 설치
COPY package*.json ./
RUN npm install
# 1
# 전체 앱 소스 복사
COPY . .

# Vite 권한 문제 해결: .bin 디렉토리 실행 권한 부여
RUN chmod -R +x node_modules/.bin

# --unsafe-perm: 루트 권한에서 npm 스크립트 제한 해제
RUN npm run build --unsafe-perm

# 2단계: 빌드된 정적 파일을 Nginx로 서빙
FROM nginx:alpine

# 빌드된 결과물을 Nginx html 루트로 복사
COPY --from=build /app/dist /usr/share/nginx/html

# 컨테이너 실행 시 사용할 포트
EXPOSE 80

# Nginx 실행
CMD ["nginx", "-g", "daemon off;"]