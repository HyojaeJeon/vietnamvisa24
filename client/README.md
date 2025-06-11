
# Vietnam Visa Service - Frontend Client

베트남 비자 서비스의 프론트엔드 클라이언트입니다.

## 기술 스택
- Next.js 14
- React 18
- Apollo Client (GraphQL)
- Tailwind CSS
- Redux Toolkit

## 설치 및 실행

1. 의존성 설치:
```bash
cd client
npm install
```

2. 환경변수 설정:
```bash
cp .env.example .env.local
```

3. 개발 서버 실행:
```bash
npm run dev
```

4. 빌드:
```bash
npm run build
```

## 개발 시 주의사항
- 백엔드 서버가 먼저 실행되어 있어야 합니다 (http://localhost:5000)
- GraphQL 스키마 변경 시 Apollo Client 캐시를 클리어해야 할 수 있습니다
