# 환경별 데이터베이스 설정 완료

## ✅ 완료된 작업

### 1. 환경 감지 시스템

- **Replit 환경**: 자동으로 SQLite 사용
- **로컬 환경**: MySQL 사용 (기본값)
- **강제 설정**: 환경 변수로 데이터베이스 강제 선택 가능

### 2. 설정 파일 구조

```
server/
├── config/
│   └── config.js           # 환경별 데이터베이스 설정
├── models/
│   ├── index.js           # 모델 로더 (Admin 모델 추가)
│   └── admin.js           # 새로 생성된 Admin 모델
├── scripts/
│   ├── setup-db.sh        # Unix/Linux용 설정 스크립트
│   ├── setup-db.bat       # Windows용 설정 스크립트
│   └── create-mysql-db.sql # MySQL 데이터베이스 생성 스크립트
├── docs/
│   └── DATABASE_SETUP.md  # 상세 설정 가이드
├── .env                   # 환경 변수 설정
└── database.js           # 연결 및 오류 처리 개선
```

### 3. 환경 변수 설정

#### 로컬 환경 (MySQL)

```env
DB_FORCE_MYSQL=true
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=vietnamvisa24_db
```

#### 로컬 환경 (SQLite - 테스트용)

```env
DB_FORCE_SQLITE=true
```

#### Replit 환경

- 자동으로 SQLite 사용
- 별도 설정 불필요

### 4. NPM 스크립트 추가

```json
{
  "scripts": {
    "db:setup": "bash scripts/setup-db.sh",
    "db:setup:win": "scripts\\setup-db.bat",
    "mysql:create": "mysql -u root -p < scripts/create-mysql-db.sql"
  }
}
```

## 🔧 사용 방법

### 자동 설정 (권장)

```bash
# Windows
npm run db:setup:win

# macOS/Linux
npm run db:setup
```

### 수동 MySQL 설정

```bash
# 1. MySQL 데이터베이스 생성
npm run mysql:create

# 2. .env에서 DB_FORCE_MYSQL=true 설정

# 3. 서버 시작
npm start
```

### SQLite로 빠른 테스트

```bash
# .env에서 DB_FORCE_SQLITE=true 설정
npm start
```

## 📊 환경 감지 결과

서버 시작 시 다음과 같은 로그가 출력됩니다:

```
🔧 Config - Environment: Local/Replit
🔧 Config - Database: MySQL/SQLite
🔧 Config - Force SQLite: true/false
🔧 Config - Force MySQL: true/false
🔧 Config - Selected config: MySQL/SQLite
✅ Connected to MYSQL/SQLITE database: database_name
```

## 🚨 문제 해결

### MySQL 연결 오류

1. MySQL 서비스 실행 확인
2. `.env` 파일의 비밀번호 확인
3. 데이터베이스 존재 여부 확인

### SQLite 권한 오류

1. 프로젝트 디렉토리 쓰기 권한 확인
2. 디스크 공간 확인

## 🎯 다음 단계

1. **프로덕션 환경**: 외부 MySQL 서버 설정
2. **마이그레이션**: Sequelize CLI로 스키마 버전 관리
3. **백업**: 정기적인 데이터베이스 백업 스크립트
4. **모니터링**: 데이터베이스 성능 모니터링 추가
