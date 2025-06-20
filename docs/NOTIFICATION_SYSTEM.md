# 베트남 비자 신청 플랫폼 알림 시스템

## 📋 개요

이 문서는 베트남 비자 신청 플랫폼의 종합 알림 시스템 구현을 설명합니다. 알림 시스템은 사용자와 관리자 모두에게 실시간으로 중요한 정보를 전달하는 핵심 기능입니다.

## 🎯 주요 기능

### 1. 알림 종류

- **상태 변경 알림**: 비자 신청 상태 변경 시 자동 알림
- **새 신청서 알림**: 새로운 비자 신청 접수 시 관리자에게 알림
- **서류 요청 알림**: 추가 서류가 필요할 때 사용자에게 알림
- **시스템 알림**: 점검, 공지사항 등 시스템 관련 알림
- **부가 서비스 알림**: 부가 서비스 신청 관련 알림

### 2. 사용자 인터페이스

- **실시간 알림**: 헤더의 벨 아이콘으로 실시간 알림 확인
- **읽지 않은 알림 카운트**: 숫자 배지로 읽지 않은 알림 개수 표시
- **클릭 네비게이션**: 알림 클릭 시 관련 페이지로 자동 이동
- **시간 표시**: 분/초 단위까지 정확한 시간 표시
- **일괄 작업**: 모든 알림 읽음 처리, 모든 알림 삭제 등

### 3. 관리 기능

- **개별 알림 관리**: 단일 알림 읽음/삭제 처리
- **일괄 작업**: 모든 알림 읽음 처리, 모든 알림 삭제
- **필터링**: 상태별, 타입별 알림 필터링
- **자동 정리**: 오래된 알림 자동 정리 (향후 구현 예정)

## 🏗️ 시스템 아키텍처

### 데이터베이스 모델

```javascript
// server/models/notification.js
Notification {
  id: INTEGER (PK)
  type: ENUM (알림 종류)
  title: STRING (제목)
  message: TEXT (내용)
  recipient: STRING (받는 사람 이메일)
  status: ENUM (읽음/안읽음)
  priority: ENUM (우선순위)
  relatedId: STRING (관련 엔티티 ID)
  targetUrl: STRING (클릭 시 이동할 URL)
  createdAt: DATE
  updatedAt: DATE
}
```

### GraphQL 스키마

```graphql
# server/graphql/schema/types.js
type Notification {
  id: ID!
  type: NotificationType!
  title: String!
  message: String!
  recipient: String!
  status: NotificationStatus!
  priority: NotificationPriority!
  isRead: Boolean!
  relatedId: String
  targetUrl: String
  createdAt: String!
  updatedAt: String!
}

# 쿼리
- getAllNotifications: 모든 알림 조회
- getNotificationsByUser: 사용자별 알림 조회
- getNotificationsByStatus: 상태별 알림 조회
- getUnreadNotificationsCount: 읽지 않은 알림 개수

# 뮤테이션
- sendNotification: 알림 생성
- markNotificationAsRead: 알림 읽음 처리
- deleteNotification: 알림 삭제
- bulkNotificationAction: 일괄 작업
- markAllNotificationsAsRead: 모든 알림 읽음 처리
- deleteAllNotifications: 모든 알림 삭제
```

### 클라이언트 컴포넌트

```javascript
// client/app/src/components/header.js
- 메인 헤더에 알림 기능 통합
- 벨 아이콘과 읽지 않은 알림 카운트 배지
- 드롭다운 알림 목록
- 클릭 네비게이션 및 일괄 작업
```

## 🔧 구현 세부사항

### 1. 서버 사이드

#### 알림 헬퍼 함수

```javascript
// server/utils/notificationHelpers.js

// 상태 변경 알림
createApplicationStatusNotification(applicationId, recipientEmail, oldStatus, newStatus);

// 새 신청서 알림 (관리자용)
createNewApplicationNotification(applicationId, applicantName, visaType);

// 서류 요청 알림
createDocumentRequestNotification(applicationId, recipientEmail, documentType);

// 시스템 알림
createSystemNotification(title, message, recipientEmail, priority, targetUrl);

// 테스트 알림 생성
createTestNotifications(recipientEmail);
```

#### GraphQL 리졸버

```javascript
// server/graphql/resolvers/notifications/index.js
- 완전한 CRUD 작업 지원
- 에러 처리 및 트랜잭션 지원
- 일괄 작업 지원
```

#### 자동 통합

- **신청서 생성**: 새 신청서 생성 시 관리자에게 자동 알림
- **상태 변경**: 신청서 상태 변경 시 사용자에게 자동 알림

### 2. 클라이언트 사이드

#### GraphQL 쿼리/뮤테이션

```javascript
// client/app/src/lib/graphql/query/notifications/index.js
// client/app/src/lib/graphql/mutation/notifications/index.js
- Apollo Client를 사용한 GraphQL 통신
- 실시간 폴링 (30초 간격)
- 낙관적 업데이트 지원
```

#### UI 컴포넌트

```javascript
// 메인 헤더 통합
- 반응형 디자인
- 실시간 업데이트
- 사용자 친화적 인터페이스
- 모바일 대응
```

## 📱 사용자 경험

### 알림 수신 플로우

1. **알림 생성**: 서버에서 특정 이벤트 발생 시 알림 생성
2. **실시간 업데이트**: 클라이언트에서 30초마다 새 알림 확인
3. **시각적 표시**: 헤더의 벨 아이콘에 읽지 않은 알림 개수 표시
4. **알림 확인**: 사용자가 벨 아이콘 클릭 시 알림 목록 표시
5. **네비게이션**: 특정 알림 클릭 시 관련 페이지로 이동
6. **상태 업데이트**: 알림 읽음 처리 및 UI 업데이트

### 시간 표시 형식

- **1분 미만**: "방금 전"
- **1시간 미만**: "N분 전"
- **24시간 미만**: "N시간 전"
- **그 이상**: "M월 D일 HH:MM" 형식

## 🧪 테스트

### 테스트 스크립트

```bash
# 알림 시스템 테스트 실행
node server/scripts/test-notifications.js
```

### 테스트 범위

- 모든 알림 타입 생성 테스트
- GraphQL 쿼리/뮤테이션 테스트
- UI 컴포넌트 상호작용 테스트
- 일괄 작업 테스트

## 🔒 보안 고려사항

- **인증 검증**: 모든 알림 관련 작업에서 사용자 인증 확인
- **권한 제어**: 사용자는 본인의 알림만 조회/관리 가능
- **데이터 검증**: 입력 데이터 유효성 검사 및 SQL 인젝션 방지
- **에러 처리**: 적절한 에러 메시지와 로깅

## 🚀 성능 최적화

- **인덱싱**: recipient, status, createdAt 필드에 데이터베이스 인덱스
- **페이지네이션**: 대량 알림 처리를 위한 페이지네이션
- **캐싱**: 읽지 않은 알림 개수 캐싱 (향후 구현 예정)
- **일괄 처리**: 여러 알림을 한 번에 처리하는 일괄 작업

## 📈 향후 개선사항

### 단기 계획

- [ ] 푸시 알림 지원 (PWA)
- [ ] 이메일 알림 템플릿 시스템
- [ ] 알림 설정 페이지 (사용자별 알림 선호도)
- [ ] 알림 통계 및 분석

### 장기 계획

- [ ] 실시간 WebSocket 연결
- [ ] SMS 알림 지원
- [ ] 다국어 알림 메시지
- [ ] AI 기반 개인화 알림

## 🛠️ 개발 가이드

### 새로운 알림 타입 추가

1. **데이터베이스 모델 업데이트**: `notification.js`의 type enum에 새 타입 추가
2. **GraphQL 스키마 업데이트**: `types.js`의 NotificationType에 새 타입 추가
3. **헬퍼 함수 생성**: `notificationHelpers.js`에 새 알림 생성 함수 추가
4. **통합**: 관련 리졸버에서 새 헬퍼 함수 호출
5. **UI 업데이트**: 필요시 클라이언트 UI 컴포넌트 업데이트

### 디버깅

- 서버 로그에서 알림 관련 로그 확인
- GraphQL Playground에서 쿼리/뮤테이션 테스트
- 브라우저 개발자 도구에서 네트워크 요청 확인

## 🤝 기여하기

알림 시스템 개선에 기여하려면:

1. 이슈 생성 및 논의
2. 기능 브랜치 생성
3. 테스트 코드 작성
4. 문서 업데이트
5. Pull Request 제출

---

**마지막 업데이트**: 2024년 1월
**작성자**: 개발팀
**버전**: 1.0.0
