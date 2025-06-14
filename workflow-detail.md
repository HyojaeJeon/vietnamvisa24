'service-workflow.md' 를 바탕으로, 각 대시보드 메뉴를 실제로 개발하기 위한 구체적이고 상세한 구현 계획을 제안해 드리겠습니다.

UI 컴포넌트 구조, 필요한 GraphQL 스키마(쿼리/뮤테이션), 데이터 모델의 관계, 그리고 실제 파일 경로를 기반으로 한 구체적인 개발 단계를 포함하여 설명하겠습니다.

상세 워크플로우 및 기술 구현 제안

1. Applications (비자 신청 관리) - 상세 구현
   가장 중요한 메뉴인 만큼, 모든 정보가 집중되고 관리자가 가장 많은 시간을 보낼 화면입니다. 직관적이고 효율적인 UI/UX 설계가 필수적입니다.

세부 개발 계획:
UI 컴포넌트 설계 (client/app/dashboard/applications/page.js)

ApplicationTable.jsx: 전체 신청 목록을 표시하는 테이블 컴포넌트입니다.
컬럼: 신청번호, 신청자명, 비자종류, 상태, 결제상태, 신청일.
기능:
상태(신규, 검토중, 완료 등)별 필터링 기능.
신청자명 또는 신청번호로 검색 기능.
페이지네이션 (Pagination).
ApplicationDetails.jsx: 특정 신청 건을 클릭했을 때 표시될 상세 뷰 (페이지 또는 모달).
ApplicantInfo: 신청자 정보(User 모델) 표시 및 수정 기능.
DocumentManager: 신청에 필요한 서류 목록과 현재 상태를 관리합니다.
각 서류 항목마다 다운로드 링크, 상태(확인대기, 승인, 반려), 상태 변경 버튼 제공.
관리자가 최종 비자(PDF) 등을 직접 업로드할 수 있는 파일 업로드 기능 포함.
PaymentStatus: 결제 정보(Payment 모델)를 요약 표시하고, 클릭 시 상세 결제 내역으로 이동.
StatusControl: 전체 신청 건의 상태를 변경할 수 있는 드롭다운 메뉴. (예: 서류 검토 -> 처리 중)
HistoryLog: 해당 신청 건에 대한 모든 변경 이력(ApplicationStatusHistory 모델)을 시간순으로 표시. (예: "2025-06-15 10:30: 관리자 A가 상태를 '보완 필요'로 변경")
GraphQL 스키마 정의 (server/graphql/schema/applications/, resolvers/applications/)

Query getApplicationDetails(id: ID!):
단일 신청 건의 모든 정보를 가져옵니다. User, Document, Payment, ApplicationStatusHistory 모델을 JOIN하여 한 번의 요청으로 필요한 모든 데이터를 로드해야 합니다.
구현 위치: server/graphql/resolvers/applications/index.js 내에 상세 로직 구현.
Mutation updateApplicationStatus(id: ID!, status: String!):
신청 상태를 변경하고, ApplicationStatusHistory에 로그를 기록합니다.
Mutation requestDocumentCorrection(documentId: ID!, message: String):
특정 서류의 상태를 보완 필요로 변경하고, 사용자에게 알림(이메일, SMS 등)을 보내는 로직을 트리거합니다.
데이터 모델 관계 확인 (server/models/index.js)

아래 관계가 명확히 설정되었는지 반드시 확인해야 합니다. 이전 개발 과정에서 이 부분에 어려움이 있었던 것으로 보입니다.
VisaApplication.belongsTo(User)
VisaApplication.hasMany(Document)
VisaApplication.hasOne(Payment)
VisaApplication.hasMany(ApplicationStatusHistory) 2. Consultations (챗봇 및 상담 관리) - 상세 구현
고객 문의를 체계적으로 관리하고 응대 효율을 높이는 시스템을 구축합니다.

세부 개발 계획:
챗봇-대시보드 연동 (client/app/src/components/chatbot.js)
챗봇의 기존 로직에 '상담 전환(Escalate)' 시나리오를 추가합니다.
사용자가 "상담원 연결"을 요청하거나 챗봇이 더 이상 답변할 수 없을 때, 챗봇은 "상담을 접수하시겠습니까?" 와 같은 확인 메시지를 표시합니다.
사용자가 동의하면, 현재까지의 대화 내용(JSON 형식)과 사용자 정보(이름, 연락처 등)를 수집하여 아래의 Mutation을 호출합니다.
GraphQL Mutation 정의 (server/graphql/schema/consultations/, resolvers/consultations/)
Mutation createConsultationTicket(input: CreateConsultationInput!):
input 타입은 chatHistory: String!, customerName: String, contactInfo: String 등을 포함합니다.
이 Mutation은 Consultations 테이블에 신규(New) 상태의 레코드를 생성합니다.
구현 위치: server/graphql/resolvers/consultations/index.js
UI 컴포넌트 설계 (client/app/dashboard/consultations/page.js)
ConsultationList.jsx: 문의 목록을 이메일 클라이언트처럼 표시합니다.
ConsultationView.jsx: 문의 상세 보기.
ChatHistoryViewer: JSON으로 저장된 대화 기록을 채팅 앱처럼 가독성 좋게 렌더링합니다.
AdminNote: 관리자가 처리 내용을 기록할 수 있는 텍스트 영역.
문의 상태(신규, 처리중, 완료)를 변경하는 기능을 제공합니다. 3. Payments (결제 관리) - 상세 구현
결제 누락 방지를 위한 자동화와 예외 처리를 위한 수동 기능을 모두 구현합니다.

세부 개발 계획:
결제 게이트웨이(PG) 웹훅(Webhook) 연동 (핵심 자동화 기능)
server에 PG사(예: VNPay)가 결제 결과를 전송할 수 있는 전용 API 엔드포인트를 만듭니다. (이것은 GraphQL이 아닌 일반 REST API 엔드포인트입니다.)
파일 위치: server/routes/paymentWebhook.js (신규 생성)
로직:
PG사로부터 POST 요청을 받습니다.
요청의 유효성을 시크릿 키 등으로 검증합니다.
결제가 성공했다면, 요청에 포함된 주문 ID(orderId)를 사용하여 Payment 테이블에서 해당 레코드를 찾습니다.
해당 레코드의 status를 결제 완료(Paid)로 업데이트합니다.
연관된 VisaApplication의 상태 또한 다음 단계(예: 서류 검토)로 자동 변경해줍니다.
UI 컴포넌트 설계 (client/app/dashboard/payments/page.js)
PaymentTable.jsx: 모든 결제 기록을 리스트업. 상태별 필터링 기능 필수.
ManualPaymentModal.jsx: 무통장 입금 등 수동 확인이 필요한 경우, 관리자가 주문 ID를 입력하고 결제 완료로 상태를 직접 변경할 수 있는 모달 창. 4. Services & Pricing (서비스 및 가격 관리) - 상세 구현
변동이 잦은 서비스 내용과 가격을 비개발자도 쉽게 수정할 수 있도록 구현합니다.

세부 개발 계획:
UI 컴포넌트 설계 (client/app/dashboard/pricing/page.js)
PricingManagement.js 컴포넌트는 이미 존재하며, 이를 확장합니다.
EVisaPriceForm.jsx: E-Visa 가격 관리를 위한 전용 폼.
서비스 종류 (예: 90일 단수), 처리 속도 (예: Standard, Express), 국적 그룹 등의 조합으로 가격을 입력하고 수정할 수 있는 인터페이스를 제공합니다.
각 행은 데이터베이스의 eVisaPrices 테이블 레코드 하나와 1:1로 매칭됩니다.
'추가', '수정', '삭제' 버튼을 통해 createEVisaPrice, updateEVisaPrice, deleteEVisaPrice Mutation을 각각 호출합니다.
FastTrackPriceForm.jsx, VisaRunPriceForm.jsx 도 위와 동일한 구조로 만듭니다.
GraphQL 연동 (client/app/dashboard/pricing/PricingManagement.js)
페이지 로드 시, GET_EVISA_PRICES, GET_FASTTRACK_PRICES 등의 쿼리로 현재 설정된 가격 데이터를 모두 가져와 폼에 채웁니다.
관리자가 폼에서 값을 수정하고 '저장' 버튼을 누르면, 해당 데이터에 맞는 update... Mutation을 호출하여 서버에 변경 사항을 전송합니다.

- 다국어(베트남어(기준), 한국어, 영어) 확장 고려
