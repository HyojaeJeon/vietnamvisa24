
# Vietnam Visa Service

베트남 비자 서비스 - 프론트엔드와 백엔드가 분리된 풀스택 애플리케이션

## 프로젝트 구조

```
├── server/          # 백엔드 서버 (Express + GraphQL + MySQL)
├── client/          # 프론트엔드 클라이언트 (Next.js + React)
└── app/            # 기존 통합 프로젝트 (레거시)
```

## 시작하기

### 1. 백엔드 서버 실행
```bash
cd server
npm install
cp .env.example .env
# .env 파일에서 MySQL 설정 후
npm run dev
```

### 2. 프론트엔드 클라이언트 실행
```bash
cd client
npm install
cp .env.example .env.local
npm run dev
```

### 3. 개발 환경 접속
- 프론트엔드: http://localhost:3000
- 백엔드 API: http://localhost:5000
- GraphQL Playground: http://localhost:5000/api/graphql

## 기술 스택

### Backend
- Express.js
- Apollo Server (GraphQL)
- MySQL
- Session Management

### Frontend
- Next.js 14
- React 18
- Apollo Client
- Tailwind CSS
- Redux Toolkit

## 배포
각 프로젝트는 독립적으로 배포 가능합니다.
