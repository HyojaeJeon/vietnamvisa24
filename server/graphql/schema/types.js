const { gql } = require("graphql-tag");

const typeDefs = gql`
  scalar Date
  scalar JSON

  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }

  type User {
    id: ID!
    email: String!
    name: String!
    phone: String
    created_at: String
    tokenVersion: Int
  }

  type Admin {
    id: ID!
    email: String!
    name: String!
    role: AdminRole!
    created_at: String!
    is_active: Boolean!
  }

  type VisaApplication {
    id: ID!
    application_number: String
    user_id: ID
    full_name: String!
    passport_number: String!
    nationality: String!
    birth_date: String
    phone: String!
    email: String!
    visa_type: String!
    arrival_date: String!
    departure_date: String!
    purpose: String
    status: ApplicationStatus!
    priority: String
    created_at: String!
    updated_at: String!
    user: User
    assignedAdmin: Admin
    documents: [Document!]!
  }

  type Document {
    id: ID!
    application_id: String!
    customer_name: String!
    document_type: String!
    document_name: String!
    file_size: String!
    status: DocumentStatus!
    uploaded_at: String!
    reviewed_at: String
    reviewer: String
    notes: String
    application: VisaApplication
  }

  type Consultation {
    id: ID!
    customer_name: String!
    phone: String!
    email: String!
    service_type: String!
    status: String!
    notes: String
    created_at: String!
    updated_at: String!
  }

  type ApplicationStatusHistory {
    id: ID!
    application_id: ID!
    previous_status: ApplicationStatus
    new_status: ApplicationStatus!
    changed_by: ID
    change_reason: String
    created_at: String!
    application: VisaApplication
    changedBy: Admin
  }

  type Notification {
    id: ID!
    type: NotificationType!
    title: String!
    message: String!
    recipient: String!
    status: NotificationStatus!
    priority: NotificationPriority!
    created_at: String!
    related_id: String
    is_read: Boolean!
  }

  type Payment {
    id: ID!
    application_id: ID!
    amount: Float!
    currency: String!
    status: PaymentStatus!
    payment_method: String
    transaction_id: String
    paid_at: String
    created_at: String!
    application: VisaApplication
  }

  type WorkflowTemplate {
    id: ID!
    name: String!
    description: String
    steps: String!
    is_active: Boolean!
    created_at: String!
  }

  enum AdminRole {
    SUPER_ADMIN
    MANAGER
    STAFF
  }

  enum ApplicationStatus {
    PENDING
    PROCESSING
    APPROVED
    REJECTED
    CONSULTATION
  }

  enum DocumentStatus {
    UPLOADED
    PENDING_REVIEW
    APPROVED
    REJECTED
  }

  enum NotificationType {
    SYSTEM
    EMAIL
    SMS
  }

  enum NotificationStatus {
    SENT
    DELIVERED
    READ
    FAILED
  }

  enum NotificationPriority {
    HIGH
    MEDIUM
    LOW
  }

  enum PaymentStatus {
    PENDING
    COMPLETED
    FAILED
    REFUNDED
  }

  type SuccessResponse {
    success: Boolean!
    message: String
  }

  type DashboardStats {
    totalApplications: Int!
    newApplicationsToday: Int!
    completedToday: Int!
    pendingReview: Int!
  }

  input AdminInput {
    email: String!
    password: String!
    name: String!
    role: AdminRole!
  }

  input RegisterInput {
    email: String!
    password: String!
    name: String!
    phone: String
  }

  input LoginInput {
    email: String!
    password: String!
    rememberMe: Boolean
    autoLogin: Boolean
  }

  input AdminLoginInput {
    email: String!
    password: String!
  }

  input VisaApplicationInput {
    visa_type: String!
    full_name: String!
    passport_number: String!
    nationality: String!
    birth_date: String
    phone: String!
    email: String!
    arrival_date: String!
    departure_date: String!
    purpose: String
  }

  input NotificationInput {
    type: NotificationType!
    title: String!
    message: String!
    recipient: String!
    priority: NotificationPriority
    related_id: String
  }

  input DocumentInput {
    application_id: String!
    customer_name: String!
    document_type: String!
    document_name: String!
    file_size: String!
  }

  input ConsultationInput {
    customer_name: String!
    phone: String!
    email: String!
    service_type: String!
    notes: String
  }

  type AuthResponse {
    token: String!
    refreshToken: String
    user: User!
  }

  type AdminAuthResponse {
    token: String!
    admin: Admin!
  }

  type RefreshTokenResponse {
    token: String!
    refreshToken: String!
  }

  type ReportsData {
    overviewStats: OverviewStats!
    visaTypeStats: [VisaTypeStats!]!
    monthlyTrends: [MonthlyTrends!]!
  }

  type OverviewStats {
    totalApplications: Int!
    approvalRate: Float!
    averageProcessingTime: Float!
    totalRevenue: Float!
  }

  type VisaTypeStats {
    type: String!
    count: Int!
    percentage: Float!
    revenue: Float!
  }

  type MonthlyTrends {
    month: String!
    applications: Int!
    revenue: Float!
  }
`;

module.exports = typeDefs;