## 🥊 철거왕 김주먹

한때 챔피언을 꿈꾸던 복서, 이제는 철거 현장에서 주먹으로 세상을 부순다!  
싱글·멀티 모드, 모션 인식, 랭킹 시스템까지 갖춘 차세대 액션 게임 🎮

### 📜 게임 소개
**철거왕 김주먹**은 **카메라 기반 모션 인식 복싱 게임**으로, 운동을 재미있고 지속 가능하게 만드는 것을 목표로 합니다.  
사용자는 화면에 제시되는 콤보(잽, 어퍼 등)를 실제 자세로 수행해 불을 끄듯 완수하며, 모든 콤보를 성공하면 건물을 철거합니다!


---

## 📆 프로젝트 기간

**2025.07.14 ~ 2025.08.18 (7주)**

---

## 📔 프로젝트 개요

- 권투 액션과 철거 시뮬레이션을 결합한 신개념 체감형 게임
- OpenVidu + LiveKit 기반 멀티플레이 실시간 대전
- MediaPipe 기반 모션 인식으로 실제 복싱 동작을 게임 속 액션으로 반영
- 건물 파괴, 스테이지 클리어, 골드 획득, 랭킹 시스템 탑재
- 칼로리 소모량까지 측정하는 피트니스 요소 결합

---

## 💡 배경과 문제 정의
- **문제 인식**: 헬스장 이용의 시간/비용 부담, 혼자 하는 홈트의 지루함, 운동 습관 실패  
- **핵심 질문**: “운동을 게임처럼 즐겁게 만들 수 없을까?”  
- **해결 방향**:  
  - 🎲 Gamification(게임화) → 재미/보상/경쟁  
  - 📷 카메라만으로 접근 가능 (장비 無)  

---

## 🎮 서비스 개요와 사용자 가치
### 1. 모드 소개
| 모드 | 설명 | 사용자 가치 |
|------|------|-------------|
| **싱글** | 랜덤 건물 철거, 빠른 피드백 루프 | 성취감·반복 플레이 |
| **이벤트** | 지도 기반 지역 건물 철거 | 상상 체험·동기 강화 |
| **멀티** | 친구와 협동 철거 (OpenVidu) | 사회적 동기·유대감 |

### 2. 핵심 게임 룰
- 콤보 카드(잽→잽→어퍼)를 순서대로 수행  
- 성공 시 불이 꺼지고, 전부 성공하면 건물 철거  
- 🎁 보상 요소: 스코어, 칼로리, 랭킹, 스킨  

### 3. 사용자 가치
- 😆 재미: 건물 파괴 + 성취감  
- 🌍 접근성: 카메라만 있으면 가능  
- 🔄 지속성: 랭킹/스킨/이벤트로 동기 부여  
- 👥 사회성: 친구와 협력·경쟁  

---

## 👥 Team Members

<div align="center">

<table style="width:100%; border-collapse:collapse; text-align:center;">
  <tr>
    <td style="padding:20px; border:1px solid #e5e7eb; vertical-align:top;">
      <img src="https://github.com/user-attachments/assets/fc69f733-66e1-40f4-a6fd-829f7d5f3f7c" width="120" /><br>
      <b>박민준 (팀장)</b><br>
      <sub>FRONTEND</sub><br><br>
      <ul style="text-align:left;">
        <li>회원가입/로그인 페이지 구현 및 백엔드 연동</li>
        <li>메인 화면 / 게임 화면 UI 개발</li>
        <li>캐릭터, 건물, 이펙트 등 스프라이트 제작 및 적용</li>
        <li>게임 홍보 동영상 제작</li>
      </ul>
    </td>
    <td style="padding:20px; border:1px solid #e5e7eb; vertical-align:top;">
      <img src="https://github.com/user-attachments/assets/b727f7b2-eedb-4ebe-9608-2f5910ce6a7d" width="120" /><br>
      <b>윤혜진</b><br>
      <sub>FRONTEND</sub><br><br>
      <ul style="text-align:left;">
        <li>Figma 제작, Figma 기반 전반적인 UI/UX 설계 및 실제 화면 구현</li>
        <li>Axios 기반 API 통신 모듈 작성 및 연동</li>
        <li>PixiJS 활용 게임 화면 렌더링</li>
        <li>AudioContext, localStorage로 BGM 연속 재생</li>
        <li>모달·토스트 알림, 온라인 상태 시각화 구현</li>
        <li>캐릭터, 건물 등 에셋 제작 및 적용</li>
      </ul>
    </td>
    <td style="padding:20px; border:1px solid #e5e7eb; vertical-align:top;">
      <img src="https://github.com/user-attachments/assets/2b4d194b-5790-4823-8c7c-8c5431422074" width="120" /><br>
      <b>조창현</b><br>
      <sub>FRONTEND · BACKEND</sub><br><br>
      <ul style="text-align:left;">
        <li>WebRTC · OpenVidu 기반 실시간 통신 기능</li>
        <li>멀티 로비 페이지 설계 및 구현</li>
        <li>프로젝트 발표 자료(PPT) 제작</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td style="padding:20px; border:1px solid #e5e7eb; vertical-align:top;">
      <img src="https://github.com/user-attachments/assets/5bce73a4-d017-4114-b6ed-7cf010e90a18" width="120" /><br>
      <b>장준혁</b><br>
      <sub>BACKEND · AI</sub><br><br>
      <ul style="text-align:left;">
        <li>멀티로비 입장 및 OpenVidu 통신 구현</li>
        <li>멀티플레이 기능 구현</li>
        <li>Mediapipe 기반 모션 인식 개선</li>
        <li>Redis + SSE 기반 실시간 통신 로직</li>
        <li>친구 기능 및 리더보드 API 구현</li>
        <li>펀치모션 인식 AI 모델 (LSTM, GRU, Transformer)</li>
        <li>데이터 수집 및 정제</li>
      </ul>
    </td>
    <td style="padding:20px; border:1px solid #e5e7eb; vertical-align:top;">
      <img src="https://github.com/user-attachments/assets/55c1b9ad-4945-411b-9307-bd9b2087f4f1" width="120" /><br>
      <b>신유빈</b><br>
      <sub>BACKEND</sub><br><br>
      <ul style="text-align:left;">
        <li>소셜 로그인 (구글/카카오) 연동</li>
        <li>자동 로그인 및 토큰 갱신</li>
        <li>OAuth2 기반 소셜 로그인 API</li>
        <li>JWT 인증/인가 로직</li>
        <li>마이페이지 (칼로리, 플레이시간, 도감, 회원정보 변경)</li>
        <li>게임 콤보 및 이벤트맵 API</li>
        <li>MySQL 기반 DB 설계</li>
      </ul>
    </td>
    <td style="padding:20px; border:1px solid #e5e7eb; vertical-align:top;">
      <img src="https://github.com/user-attachments/assets/d0d39a87-9ada-440c-b39b-ae17d3524337" width="120" /><br>
      <b>홍지훈</b><br>
      <sub>BACKEND · Build</sub><br><br>
      <ul style="text-align:left;">
        <li>게임 코어 로직 구현</li>
        <li>WebRTC · OpenVidu · MediaPipe 프론트 배포환경 구성</li>
        <li>게임 관련 API (통계, 골드, 건물, 스킨)</li>
        <li>SMTP 기반 이메일 인증 API</li>
        <li>Spring Security + JWT 인증 구조</li>
        <li>AWS EC2 · Nginx · OpenVidu · Livekit 인프라</li>
        <li>Docker, Jenkins CI/CD 파이프라인 구성</li>
      </ul>
    </td>
  </tr>
</table>

</div>


---

## 🧰 기술 스택


## ⚙️ Backend
<!-- ===================== -->
<!-- Backend Stack Badges -->
<!-- ===================== -->
<p align="center">
  <img src="https://img.shields.io/badge/Java-17-007396?style=for-the-badge&logo=openjdk&logoColor=white" />
  <img src="https://img.shields.io/badge/Spring%20Boot-3.5.3-6DB33F?style=for-the-badge&logo=springboot&logoColor=white" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Spring%20Web-6DB33F?style=for-the-badge&logo=spring&logoColor=white" />
  <img src="https://img.shields.io/badge/WebSocket-010101?style=for-the-badge&logo=socketdotio&logoColor=white" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Spring%20Security-6DB33F?style=for-the-badge&logo=springsecurity&logoColor=white" />
  <img src="https://img.shields.io/badge/OAuth2-3C8FC6?style=for-the-badge&logo=openid&logoColor=white" />
  <img src="https://img.shields.io/badge/JWT-0.11.5-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/JPA-59666C?style=for-the-badge&logo=hibernate&logoColor=white" />
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" />
  <img src="https://img.shields.io/badge/Redis-D82C20?style=for-the-badge&logo=redis&logoColor=white" />
  <img src="https://img.shields.io/badge/Spring%20Session%20(Redis)-6DB33F?style=for-the-badge&logo=spring&logoColor=white" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Mail-SMTP-FFA500?style=for-the-badge&logo=gmail&logoColor=white" />
  <img src="https://img.shields.io/badge/OpenAPI-2.7.0-6BA539?style=for-the-badge&logo=swagger&logoColor=white" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Gradle-02303A?style=for-the-badge&logo=gradle&logoColor=white" />
  <img src="https://img.shields.io/badge/Spring%20Dependency%20Management-1.1.7-6DB33F?style=for-the-badge&logo=spring&logoColor=white" />
</p>

<!-- ===================== -->
<!-- Backend Stack Table -->
<!-- ===================== -->
<div align="center">

<table style="width:85%; border-collapse:collapse; margin-top:14px;">
  <thead>
    <tr>
      <th style="background:#16a34a;color:#fff;padding:10px 12px;text-align:center;border:1px solid #e5e7eb;">Category</th>
      <th style="background:#16a34a;color:#fff;padding:10px 12px;text-align:center;border:1px solid #e5e7eb;">Stack</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="background:#f8fafc;padding:10px 12px;border:1px solid #e5e7eb;"><strong>Language / JVM</strong></td>
      <td style="padding:10px 12px;border:1px solid #e5e7eb;">Java 17 (Toolchain)</td>
    </tr>
    <tr>
      <td style="background:#f8fafc;padding:10px 12px;border:1px solid #e5e7eb;"><strong>Framework</strong></td>
      <td style="padding:10px 12px;border:1px solid #e5e7eb;">Spring Boot 3.5.3</td>
    </tr>
    <tr>
      <td style="background:#f8fafc;padding:10px 12px;border:1px solid #e5e7eb;"><strong>Web</strong></td>
      <td style="padding:10px 12px;border:1px solid #e5e7eb;">Spring Web, WebSocket</td>
    </tr>
    <tr>
      <td style="background:#f8fafc;padding:10px 12px;border:1px solid #e5e7eb;"><strong>Security</strong></td>
      <td style="padding:10px 12px;border:1px solid #e5e7eb;">Spring Security, OAuth2 Client, JWT (jjwt 0.11.5)</td>
    </tr>
    <tr>
      <td style="background:#f8fafc;padding:10px 12px;border:1px solid #e5e7eb;"><strong>Data</strong></td>
      <td style="padding:10px 12px;border:1px solid #e5e7eb;">Spring Data JPA, MySQL Driver, Spring Data Redis, Spring Session (Redis)</td>
    </tr>
    <tr>
      <td style="background:#f8fafc;padding:10px 12px;border:1px solid #e5e7eb;"><strong>Mail / SMTP</strong></td>
      <td style="padding:10px 12px;border:1px solid #e5e7eb;">Spring Boot Starter Mail</td>
    </tr>
    <tr>
      <td style="background:#f8fafc;padding:10px 12px;border:1px solid #e5e7eb;"><strong>API Docs</strong></td>
      <td style="padding:10px 12px;border:1px solid #e5e7eb;">springdoc-openapi (Swagger UI) 2.7.0</td>
    </tr>
    <tr>
      <td style="background:#f8fafc;padding:10px 12px;border:1px solid #e5e7eb;"><strong>Build / Dependency Management</strong></td>
      <td style="padding:10px 12px;border:1px solid #e5e7eb;">Gradle, Spring Dependency Management 1.1.7</td>
    </tr>
  </tbody>
</table>

</div>

---

## 💻 Frontend

<!-- Centered badges -->
<p align="center">
  <img src="https://img.shields.io/badge/VISUAL%20STUDIO%20CODE-007ACC?style=for-the-badge&logo=visualstudiocode&logoColor=white" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=000" />
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=000" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/React%20Router-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Pixi.js-CC3E87?style=for-the-badge" />
  <img src="https://img.shields.io/badge/OpenVidu%20Browser-2.31.0-1F8ACB?style=for-the-badge" />
  <img src="https://img.shields.io/badge/MediaPipe_Tasks%20Vision-0.10.22--rc-0A66C2?style=for-the-badge" />
  <img src="https://img.shields.io/badge/LiveKit%20Client-2.15.4-111827?style=for-the-badge" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Zustand-5.0.7-4B5563?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Axios-1.11.0-5A29E4?style=for-the-badge" />
  <img src="https://img.shields.io/badge/jwt--decode-4.0.0-2E7D32?style=for-the-badge" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Framer%20Motion-12.23.12-000000?style=for-the-badge&logo=framer&logoColor=white" />
  <img src="https://img.shields.io/badge/GSAP-3.13.0-88CE02?style=for-the-badge&logo=greensock&logoColor=000" />
  <img src="https://img.shields.io/badge/Recharts-3.1.0-4F46E5?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Howler-2.2.4-0F766E?style=for-the-badge" />
</p>

<!-- Colored table (Centered) -->
<div align="center">

<table style="width:80%; border-collapse:collapse; margin-top:14px;">
  <thead>
    <tr>
      <th style="background:#0ea5e9;color:#fff;padding:10px 12px;text-align:center;border:1px solid #e5e7eb;">Category</th>
      <th style="background:#0ea5e9;color:#fff;padding:10px 12px;text-align:center;border:1px solid #e5e7eb;">Stack</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="background:#f8fafc;padding:10px 12px;border:1px solid #e5e7eb;"><strong>Language</strong></td>
      <td style="padding:10px 12px;border:1px solid #e5e7eb;">JavaScript</td>
    </tr>
    <tr>
      <td style="background:#f8fafc;padding:10px 12px;border:1px solid #e5e7eb;"><strong>Runtime Environment</strong></td>
      <td style="padding:10px 12px;border:1px solid #e5e7eb;">Node.js (LTS), Vite 5.4.19</td>
    </tr>
    <tr>
      <td style="background:#f8fafc;padding:10px 12px;border:1px solid #e5e7eb;"><strong>Framework / UI</strong></td>
      <td style="padding:10px 12px;border:1px solid #e5e7eb;">React 18.2.0, React Router 7.7.0</td>
    </tr>
    <tr>
      <td style="background:#f8fafc;padding:10px 12px;border:1px solid #e5e7eb;"><strong>Graphics / Game</strong></td>
      <td style="padding:10px 12px;border:1px solid #e5e7eb;">Pixi.js 7.4.3</td>
    </tr>
    <tr>
      <td style="background:#f8fafc;padding:10px 12px;border:1px solid #e5e7eb;"><strong>Media / Streaming</strong></td>
      <td style="padding:10px 12px;border:1px solid #e5e7eb;">OpenVidu Browser 2.31.0, LiveKit Client 2.15.4, MediaPipe Tasks Vision 0.10.22-rc</td>
    </tr>
    <tr>
      <td style="background:#f8fafc;padding:10px 12px;border:1px solid #e5e7eb;"><strong>State / Data</strong></td>
      <td style="padding:10px 12px;border:1px solid #e5e7eb;">Zustand 5.0.7, Axios 1.11.0, jwt-decode 4.0.0</td>
    </tr>
    <tr>
      <td style="background:#f8fafc;padding:10px 12px;border:1px solid #e5e7eb;"><strong>Animation</strong></td>
      <td style="padding:10px 12px;border:1px solid #e5e7eb;">Framer Motion 12.23.12, GSAP 3.13.0</td>
    </tr>
    <tr>
      <td style="background:#f8fafc;padding:10px 12px;border:1px solid #e5e7eb;"><strong>Charts / Audio</strong></td>
      <td style="padding:10px 12px;border:1px solid #e5e7eb;">Recharts 3.1.0, Howler 2.2.4</td>
    </tr>
    <tr>
      <td style="background:#f8fafc;padding:10px 12px;border:1px solid #e5e7eb;"><strong>IDE</strong></td>
      <td style="padding:10px 12px;border:1px solid #e5e7eb;">Visual Studio Code</td>
    </tr>
  </tbody>
</table>

</div>

---
## 🗄️ DB

<!-- ===================== -->
<!-- Database Badges -->
<!-- ===================== -->
<p align="center">
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" />
  <img src="https://img.shields.io/badge/Redis-D82C20?style=for-the-badge&logo=redis&logoColor=white" />
</p>

<!-- ===================== -->
<!-- Database Table -->
<!-- ===================== -->
<div align="center">

<table style="width:65%; border-collapse:collapse; margin-top:14px;">
  <thead>
    <tr>
      <th style="background:#2563eb;color:#fff;padding:10px 12px;text-align:center;border:1px solid #e5e7eb;">Category</th>
      <th style="background:#2563eb;color:#fff;padding:10px 12px;text-align:center;border:1px solid #e5e7eb;">Stack</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="background:#f8fafc;padding:10px 12px;border:1px solid #e5e7eb;"><strong>Database</strong></td>
      <td style="padding:10px 12px;border:1px solid #e5e7eb;">MySQL, Redis</td>
    </tr>
  </tbody>
</table>

</div>

---

## 🚀 DevOps
<!-- ===================== -->
<!-- DevOps Badges -->
<!-- ===================== -->
<p align="center">
  <img src="https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" />
  <img src="https://img.shields.io/badge/Docker--Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/AWS%20EC2-FF9900?style=for-the-badge&logo=amazonec2&logoColor=white" />
  <img src="https://img.shields.io/badge/Jenkins-D24939?style=for-the-badge&logo=jenkins&logoColor=white" />
  <img src="https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Jira-0052CC?style=for-the-badge&logo=jira&logoColor=white" />
  <img src="https://img.shields.io/badge/Notion-000000?style=for-the-badge&logo=notion&logoColor=white" />
  <img src="https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white" />
</p>

<!-- ===================== -->
<!-- DevOps Table -->
<!-- ===================== -->
<div align="center">

<table style="width:85%; border-collapse:collapse; margin-top:14px;">
  <thead>
    <tr>
      <th style="background:#f97316;color:#fff;padding:10px 12px;text-align:center;border:1px solid #e5e7eb;">Category</th>
      <th style="background:#f97316;color:#fff;padding:10px 12px;text-align:center;border:1px solid #e5e7eb;">Stack</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="background:#f8fafc;padding:10px 12px;border:1px solid #e5e7eb;"><strong>Version Control</strong></td>
      <td style="padding:10px 12px;border:1px solid #e5e7eb;">Git</td>
    </tr>
    <tr>
      <td style="background:#f8fafc;padding:10px 12px;border:1px solid #e5e7eb;"><strong>Containerization</strong></td>
      <td style="padding:10px 12px;border:1px solid #e5e7eb;">Docker, Docker-Compose</td>
    </tr>
    <tr>
      <td style="background:#f8fafc;padding:10px 12px;border:1px solid #e5e7eb;"><strong>Cloud / Infra</strong></td>
      <td style="padding:10px 12px;border:1px solid #e5e7eb;">AWS EC2</td>
    </tr>
    <tr>
      <td style="background:#f8fafc;padding:10px 12px;border:1px solid #e5e7eb;"><strong>CI / CD</strong></td>
      <td style="padding:10px 12px;border:1px solid #e5e7eb;">Jenkins</td>
    </tr>
    <tr>
      <td style="background:#f8fafc;padding:10px 12px;border:1px solid #e5e7eb;"><strong>Web Server / Proxy</strong></td>
      <td style="padding:10px 12px;border:1px solid #e5e7eb;">Nginx</td>
    </tr>
    <tr>
      <td style="background:#f8fafc;padding:10px 12px;border:1px solid #e5e7eb;"><strong>Collaboration / Project Management</strong></td>
      <td style="padding:10px 12px;border:1px solid #e5e7eb;">Jira, Notion, Figma</td>
    </tr>
  </tbody>
</table>

</div>



---


## 📁 문서

### 🛠 시스템 아키텍처
<img width="718" height="630" alt="시스템 아키텍처"
       src="https://github.com/user-attachments/assets/08291212-0a36-46f8-a68b-dbe9cdd069d0" />

### 🧩 ERD
<img width="1372" height="1358" alt="ERD"
       src="https://github.com/user-attachments/assets/f8d1006c-ab7e-4af6-91d7-021d4f494a89" />


---
## **🖥️ 주요 기능**

## 🏠**초기 화면(Web)**

| <p align="center"><img width="475" height="500" src="https://github.com/user-attachments/assets/76931d0a-564f-4e77-b463-4953ef50fcd7" /></p>|
| --- |
| **초기 화면** <br> 게임 첫 진입 페이지로, 사용자의 상호작용을 통해 로그인 페이지로 진입할수있습니다. |

### 🔐 **로그인 기능**

| <p align="center"><img width="475" height="500" src="https://github.com/user-attachments/assets/bef2ba73-ee61-432e-a16b-89a2eb16498e" /></p> | <p align="center"><img width="475" height="500" src="https://github.com/user-attachments/assets/13ea7111-9b73-4b0d-b412-f572355360d2" /></p>|
| --- | --- |
| **로그인 화면** <br> 로그인을 진행하며 메인 페이지로 이동 가능합니다. | **소셜로그인 화면** <br> 소셜계정을 통해 회원가입을 진행할 수 있습니다. |

| <p align="center"><img width="475" height="500" src="https://github.com/user-attachments/assets/d55a22f2-0709-4982-b4ea-070554a56a71" /></p> | <p align="center"><img width="475" height="500" src="https://github.com/user-attachments/assets/34734c60-e254-4514-b29f-60c2e8dbec54" /></p> |
| --- | --- |
| **비밀 번호 찾기** <br> 회원의 비밀번호 찾기 기능을 제공해줍니다. | **회원가입 기능** <br> 회원의 프로필을 선택하고 초기정보를 설정합니다. |

### 🏠 **메인 화면**

| <p align="center"><img width="473" height="500" src="https://github.com/user-attachments/assets/90e30f8c-11c0-4071-92a8-19951944d562" /></p> | <p align="center"><img width="473" height="500" src="https://github.com/user-attachments/assets/f96a6f7a-47f1-45e8-b9b4-19c61333031a" /></p> |
| --- | --- |
| **초기 화면** <br> 게임 첫 진입 페이지로, 사용자의 상호작용을 통해 로그인 페이지로 진입할수있습니다. | **캐릭터 구매, 선택 화면** <br> 게임 플레이로 얻은 골드로 스킨을 선택하고 구매할 수 있습니다. |

| <p align="center"><img width="475" height="500" src="https://github.com/user-attachments/assets/01befebf-930d-4aad-ab86-4521df93ac54" /></p> | <p align="center"><img width="475" height="500" src="https://github.com/user-attachments/assets/f7c385ae-ae74-48de-ab0d-4a787cbe1899" /></p> |
| --- | --- |
| **랭킹 상세 조회** <br> 유저들간의 랭킹을 상세 조회할수 있습니다. | **플레이 가이드** <br> 플레이 가이드를 사용자에게 제공해줍니다. |

| <p align="center"><img width="475" height="500" src="https://github.com/user-attachments/assets/09048d66-d57c-4f0d-b417-85e2328495ef" /></p> | <p align="center"><img width="475" height="500" src="https://github.com/user-attachments/assets/bcd710e3-fc4d-4a56-bf5c-7d231787b1c6" /></p> |
| --- | --- |
| **친구 초대 기능** <br> 닉네임으로 친구를 초대할수 있습니다. | **친구 수락 조회 기능** <br> 친구요청을 수락할수 있고 조회할수 있습니다. |

| <p align="center"><img width="475" height="500" src="https://github.com/user-attachments/assets/cd6f3850-5397-4db4-8c58-10776c47d3e5" /></p> | <p align="center"><img width="475" height="500" src="https://github.com/user-attachments/assets/90316644-68cb-4a80-ab31-7ad50aeeda5b" /></p> |
| --- | --- |
| **칼로리 조회 및 정보수정** <br> 일주일 단위로 소모 칼로리를 조회할 수 있습니다. | **건물 컬렉션 조회** <br> 게임 플레이를 하며 부순 건물을 조회할수 있습니다. |

### 🏠 **게임 화면**

| <p align="center"><img width="475" height="500" src="https://github.com/user-attachments/assets/2f5474a2-c39c-42a0-8775-275605807aa0" /></p> | <p align="center"><img width="475" height="500" src="https://github.com/user-attachments/assets/20cd1332-46f0-40e6-b4b4-6c91a67cd7a5" /></p> |
| --- | --- |
| **싱글 플레이 화면** <br> 싱글 플레이로 혼자서 게임을 즐길수 있습니다. | **이벤트 플레이 화면** <br> 각 지역 랜드마크 건물을 보유한 이벤트 맵을 즐길수 있습니다. |

| <p align="center"><img width="475" height="500" src="https://github.com/user-attachments/assets/42f7df29-d424-42d0-b6e6-da22af399816" /></p> |
| --- |
| **멀티 플레이 화면** <br> 멀티 플레이로 4인이서 게임을 즐길수 있습니다. |


---

## 📄자료

### 🎨 Figma
<details>
  <summary>자세히 (클릭해서 보기)</summary>

  <img width="1319" height="851" alt="Image" 
    src="https://github.com/user-attachments/assets/af2f61df-2f1d-4c5d-91be-0491ba6e70e0" />
</details>

### 🔄 플로우 차트
<details>
  <summary>자세히 (클릭해서 보기)</summary>

  <img width="1026" height="1024" alt="Image" 
      src="https://github.com/user-attachments/assets/3d510c8d-01ad-47d8-a976-77bb9d49cf3c" />
</details>

### 📝 기능 명세
<details>
  <summary>자세히 (클릭해서 보기)</summary>

  <img width="1583" height="2810" alt="Image" src="https://github.com/user-attachments/assets/25120eb3-aef8-4c3c-8610-940e6920bb35" />
</details>

### 📅 Jira
<details>
  <summary>자세히 (클릭해서 보기)</summary>

  <img width="1703" height="5712" alt="Image" src="https://github.com/user-attachments/assets/bded91bb-50a8-4071-be2e-c87e335c8ea8" />
</details>
