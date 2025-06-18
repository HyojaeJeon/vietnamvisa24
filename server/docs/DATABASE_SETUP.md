# 데이터베이스 설정 가이드

이 프로젝트는 환경에 따라 다른 데이터베이스를 사용합니다:

- **Replit 환경**: SQLite (자동)
- **로컬 환경**: MySQL (기본값)

## 자동 환경 감지

프로젝트는 다음 환경 변수를 통해 자동으로 환경을 감지합니다:

- `REPLIT`, `REPL_ID`, `REPL_SLUG`: Replit 환경
- `DB_FORCE_SQLITE=true`: 강제로 SQLite 사용
- `DB_FORCE_MYSQL=true`: 강제로 MySQL 사용

## 로컬 환경 설정 (MySQL)

### 1. MySQL 설치

**Windows:**

- [MySQL Community Server 다운로드](https://dev.mysql.com/downloads/mysql/)
- 또는 XAMPP/WAMP 사용

**macOS:**

```bash
brew install mysql
brew services start mysql
```

**Ubuntu/Debian:**

```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
```

### 2. 데이터베이스 생성

#### 자동 설정 (권장)

```bash
# Windows
npm run db:setup:win

# macOS/Linux
npm run db:setup
```

#### 수동 설정

```bash
# MySQL에 접속
mysql -u root -p

# 또는 npm 스크립트 사용
npm run mysql:create
```

### 3. 환경 변수 설정

`.env` 파일에서 MySQL 설정:

```env
DB_FORCE_MYSQL=true
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=vietnamvisa24_db
```

## Replit 환경 설정 (SQLite)

Replit에서는 자동으로 SQLite를 사용합니다. 별도 설정이 필요 없습니다.

SQLite 파일 위치: `./vietnam_visa.db`

## 강제 데이터베이스 선택

### 로컬에서 SQLite 사용

```env
DB_FORCE_SQLITE=true
```

### Replit에서 MySQL 사용 (비권장)

```env
DB_FORCE_MYSQL=true
# MySQL 연결 정보 추가 필요
```

## 서버 시작

```bash
npm start
```

## 문제 해결

### MySQL 연결 오류

1. MySQL 서비스가 실행 중인지 확인
2. `.env` 파일의 데이터베이스 설정 확인
3. 데이터베이스가 존재하는지 확인

### SQLite 권한 오류

1. 프로젝트 디렉토리에 쓰기 권한이 있는지 확인
2. SQLite 파일이 생성될 수 있는지 확인

## 환경별 특징

| 환경     | 데이터베이스 | 파일 위치           | 설정 복잡도 |
| -------- | ------------ | ------------------- | ----------- |
| Replit   | SQLite       | `./vietnam_visa.db` | 낮음        |
| 로컬     | MySQL        | MySQL 서버          | 중간        |
| 프로덕션 | MySQL        | 외부 서버           | 높음        |

## 개발 팁

1. **로컬에서 SQLite 테스트**: `DB_FORCE_SQLITE=true` 설정으로 빠른 테스트 가능
2. **데이터 초기화**: 개발 중 `{ force: true }` 옵션으로 테이블 재생성
3. **마이그레이션**: Sequelize CLI를 사용한 스키마 버전 관리
