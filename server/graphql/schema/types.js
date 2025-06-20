const { gql } = require("graphql-tag");

const typeDefs = gql`
  scalar Date
  scalar JSON

  type Query {
    getVisaApplications: [VisaApplication]
    getVisaApplication(id: ID): VisaApplication
    _empty: String
  }
  type Mutation {
    updateApplicationStatus(
      id: ID!
      status: ApplicationStatus!
    ): StatusUpdateResponse
    sendEmailToCustomer(
      applicationId: ID
      emailType: String
      content: String
    ): SuccessResponse
    sendNotificationEmail(
      applicationId: ID!
      emailType: EmailType!
      customMessage: String
    ): EmailResponse
    generateApplicationPDF(applicationId: ID!): PDFResponse
    addApplicationMemo(applicationId: ID, content: String): Memo
    updateApplicationInfo(id: ID, input: VisaApplicationInput): VisaApplication
    downloadApplicationDocuments(applicationId: ID): DownloadResponse
    _empty: String
  }
  type User {
    id: ID
    email: String
    name: String
    phone: String
    createdAt: String
    tokenVersion: Int
    role: UserRole
    isActive: Boolean
  }
  type VisaApplication {
    id: ID
    applicationNumber: String
    userId: ID
    fullName: String
    passportNumber: String
    nationality: String
    birthDate: String
    phone: String
    email: String
    visaType: String
    arrivalDate: String
    departureDate: String
    purpose: String
    status: ApplicationStatus
    priority: String
    createdAt: String
    updatedAt: String
    user: User
    assignedUser: User
    documents: [Document]
    consultations: [Consultation]
  }
  type Document {
    id: ID
    applicationId: String
    customerName: String
    documentType: String
    documentName: String
    type: String
    fileName: String
    fileSize: Int
    fileType: String
    status: DocumentStatus
    uploadedAt: String
    reviewedAt: String
    reviewer: String
    notes: String
    application: VisaApplication
    fileUrl: String
    fileData: String
  }
  type ApplicationStatusHistory {
    id: ID
    applicationId: ID
    previousStatus: ApplicationStatus
    newStatus: ApplicationStatus
    changedBy: ID
    changeReason: String
    createdAt: String
    application: VisaApplication
    changedByUser: User
  }
  type Notification {
    id: ID
    type: NotificationType
    title: String
    message: String
    recipient: String
    status: NotificationStatus
    priority: NotificationPriority
    createdAt: String
    updatedAt: String
    relatedId: String
    targetUrl: String
    isRead: Boolean
  }
  type Payment {
    id: ID
    applicationId: ID
    amount: Float
    currency: String
    status: PaymentStatus
    paymentMethod: String
    transactionId: String
    paidAt: String
    createdAt: String
    application: VisaApplication
  }
  type WorkflowTemplate {
    id: ID
    name: String
    description: String
    steps: String
    isActive: Boolean
    createdAt: String
  }

  enum UserRole {
    SUPER_ADMIN
    MANAGER
    STAFF
    USER
  }
  enum ApplicationStatus {
    PENDING
    PROCESSING
    DOCUMENT_REVIEW
    SUBMITTED_TO_AUTHORITY
    APPROVED
    REJECTED
    COMPLETED
  }

  enum DocumentStatus {
    UPLOADED
    PENDING_REVIEW
    APPROVED
    REJECTED
  }
  enum NotificationType {
    APPLICATION_UPDATE
    STATUS_CHANGE
    CONSULTATION
    SYSTEM
    DOCUMENT_REQUIRED
    DASHBOARD_NEW_APPLICATION
    NEW_APPLICATION
    APPLICATION_STATUS_CHANGE
    NOTIFICATION
    WORKFLOW_PROGRESS
    DOCUMENT_REVIEWED
    PAYMENT_STATUS_CHANGE
    CONSULTATION_REPLY
    ADMIN_NOTIFICATION
    EMAIL_SENT
    PAYMENT_REQUEST
    DOCUMENT_REVIEW
    GOVERNMENT_SUBMISSION
    VISA_GENERATED
    VISA_EMAIL_SENT
    APPLICATION_COMPLETED
  }
  enum NotificationStatus {
    UNREAD
    READ
  }
  enum NotificationPriority {
    NORMAL
    HIGH
    URGENT
  }

  enum PaymentStatus {
    PENDING
    COMPLETED
    FAILED
    REFUNDED
  }

  type SuccessResponse {
    success: Boolean
    message: String
  }

  type DashboardStats {
    totalApplications: Int
    newApplicationsToday: Int
    completedToday: Int
    pendingReview: Int
  }

  input RegisterInput {
    email: String
    password: String
    name: String
    phone: String
    role: UserRole
  }

  input LoginInput {
    email: String
    password: String
    rememberMe: Boolean
    autoLogin: Boolean
  }

  input VisaApplicationInput {
    visaType: String
    fullName: String
    passportNumber: String
    nationality: String
    birthDate: String
    phone: String
    email: String
    arrivalDate: String
    departureDate: String
    purpose: String
  }

  input NotificationInput {
    type: NotificationType
    title: String
    message: String
    recipient: String
    priority: NotificationPriority
    relatedId: String
  }

  input DocumentInput {
    applicationId: String
    customerName: String
    documentType: String
    documentName: String
    fileSize: String
  }

  input ConsultationInput {
    customerName: String
    phone: String
    email: String
    serviceType: String
    notes: String
  }
  type AuthResponse {
    accessToken: String
    refreshToken: String
    user: User
  }

  type RefreshTokenResponse {
    accessToken: String
    refreshToken: String
  }

  type ReportsData {
    overviewStats: OverviewStats
    visaTypeStats: [VisaTypeStats]
    monthlyTrends: [MonthlyTrends]
  }

  type OverviewStats {
    totalApplications: Int
    approvalRate: Float
    averageProcessingTime: Float
    totalRevenue: Float
  }

  type VisaTypeStats {
    type: String
    count: Int
    percentage: Float
    revenue: Float
  }

  type MonthlyTrends {
    month: String
    applications: Int
    revenue: Float
  }

  # 가격표 관리 타입들
  type EVisaPrice {
    id: ID
    type: EVisaType
    processingTime: ProcessingTime
    sellingPriceUsd: Float
    sellingPriceVnd: Float
    sellingPriceKrw: Float
    marginUsd: Float
    marginVnd: Float
    marginKrw: Float
    isActive: Boolean
    createdAt: String
    updatedAt: String
    createdBy: ID
    updatedBy: ID
    creator: User
    updater: User
  }

  type VisaRunPrice {
    id: ID
    visaType: VisaRunType
    peopleCount: Int
    sellingPriceUsd: Float
    sellingPriceVnd: Float
    sellingPriceKrw: Float
    marginUsd: Float
    marginVnd: Float
    marginKrw: Float
    isActive: Boolean
    createdAt: String
    updatedAt: String
    createdBy: ID
    updatedBy: ID
    creator: User
    updater: User
  }

  type FastTrackPrice {
    id: ID
    serviceType: FastTrackServiceType
    airport: AirportCode
    sellingPriceUsd: Float
    sellingPriceVnd: Float
    sellingPriceKrw: Float
    marginUsd: Float
    marginVnd: Float
    marginKrw: Float
    isActive: Boolean
    createdAt: String
    updatedAt: String
    createdBy: ID
    updatedBy: ID
    creator: User
    updater: User
  }

  # 가격표 관련 Enum 타입들
  enum EVisaType {
    SINGLE
    MULTIPLE
  }

  enum ProcessingTime {
    NORMAL
    URGENT
    SUPER_URGENT
  }

  enum VisaRunType {
    TOURIST
    BUSINESS
  }

  enum FastTrackServiceType {
    ARRIVAL
    DEPARTURE
    BOTH
  }

  enum AirportCode {
    SGN # 호치민 탄손낫 공항
    HAN # 하노이 노이바이 공항
    DAD # 다낭 공항
    CXR # 깜란 공항
    VCA # 칸토 공항
  }

  # 가격표 입력 타입들
  input EVisaPriceInput {
    type: EVisaType
    processingTime: ProcessingTime
    sellingPriceUsd: Float
    sellingPriceVnd: Float
    sellingPriceKrw: Float
    marginUsd: Float
    marginVnd: Float
    marginKrw: Float
    isActive: Boolean
  }

  input VisaRunPriceInput {
    visaType: VisaRunType
    peopleCount: Int
    sellingPriceUsd: Float
    sellingPriceVnd: Float
    sellingPriceKrw: Float
    marginUsd: Float
    marginVnd: Float
    marginKrw: Float
    isActive: Boolean
  }

  input FastTrackPriceInput {
    serviceType: FastTrackServiceType
    airport: AirportCode
    sellingPriceUsd: Float
    sellingPriceVnd: Float
    sellingPriceKrw: Float
    marginUsd: Float
    marginVnd: Float
    marginKrw: Float
    isActive: Boolean
  }

  input EVisaPriceUpdateInput {
    sellingPriceUsd: Float
    sellingPriceVnd: Float
    sellingPriceKrw: Float
    marginUsd: Float
    marginVnd: Float
    marginKrw: Float
    isActive: Boolean
  }

  input VisaRunPriceUpdateInput {
    sellingPriceUsd: Float
    sellingPriceVnd: Float
    sellingPriceKrw: Float
    marginUsd: Float
    marginVnd: Float
    marginKrw: Float
    isActive: Boolean
  }

  input FastTrackPriceUpdateInput {
    sellingPriceUsd: Float
    sellingPriceVnd: Float
    sellingPriceKrw: Float
    marginUsd: Float
    marginVnd: Float
    marginKrw: Float
    isActive: Boolean
  }

  type Memo {
    id: ID
    content: String
    created_at: String
    created_by: String
  }
  type DownloadResponse {
    downloadUrl: String
    fileName: String
  }

  # 새로운 응답 타입들
  type StatusUpdateResponse {
    id: ID!
    status: ApplicationStatus!
    message: String!
  }

  type EmailResponse {
    success: Boolean!
    message: String!
    emailType: EmailType!
    recipientEmail: String!
  }

  type PDFResponse {
    success: Boolean!
    message: String!
    downloadUrl: String!
    fileName: String!
    generatedAt: String!
  }
  # 이메일 타입 열거형
  enum EmailType {
    STATUS_UPDATE
    DOCUMENT_REQUEST
    APPROVAL_NOTICE
  }

  # 알림 관련 입력 및 응답 타입
  input NotificationInput {
    type: NotificationType!
    title: String!
    message: String!
    recipient: String!
    priority: NotificationPriority
    relatedId: String
    targetUrl: String
  }

  input MarkNotificationReadInput {
    notificationId: ID!
  }

  input BulkNotificationActionInput {
    notificationIds: [ID!]!
    action: BulkNotificationAction!
  }

  enum BulkNotificationAction {
    MARK_ALL_READ
    DELETE_ALL
  }
  type NotificationResponse {
    success: Boolean!
    message: String!
    notification: Notification
  }

  type BulkNotificationResponse {
    success: Boolean!
    message: String!
    affectedCount: Int!
  }

  type NotificationConnection {
    notifications: [Notification!]!
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    totalCount: Int!
    pageInfo: PageInfo!
  }

  type PageInfo {
    startCursor: String
    endCursor: String
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
  }
`;

module.exports = typeDefs;
