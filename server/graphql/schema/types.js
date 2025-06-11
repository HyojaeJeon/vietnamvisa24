
const { gql } = require("graphql-tag");

const typeDefs = gql`
  # Enums
  enum ApplicationStatus {
    DRAFT
    PENDING_REVIEW
    DOCUMENT_REQUIRED
    SUBMITTED_TO_AUTHORITY
    APPROVED
    REJECTED
    CANCELLED
  }

  enum AdminRole {
    SUPER_ADMIN
    MANAGER
    STAFF
  }

  enum DocumentStatus {
    PENDING
    APPROVED
    REJECTED
    NEEDS_REVISION
  }

  enum NotificationType {
    APPLICATION_UPDATE
    DOCUMENT_REQUEST
    PAYMENT_REMINDER
    SYSTEM_ALERT
  }

  enum NotificationStatus {
    UNREAD
    READ
    ARCHIVED
  }

  enum NotificationPriority {
    LOW
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

  enum WorkflowStatus {
    PENDING
    IN_PROGRESS
    COMPLETED
    CANCELLED
  }

  # Main Types
  type User {
    id: ID!
    email: String!
    name: String!
    phone: String
    created_at: String!
  }

  type VisaApplication {
    id: ID!
    application_number: String
    user_id: ID
    visa_type: String!
    full_name: String!
    passport_number: String!
    nationality: String!
    birth_date: String!
    phone: String!
    email: String!
    arrival_date: String!
    departure_date: String!
    purpose: String
    status: ApplicationStatus!
    priority: String
    created_at: String!
    updated_at: String!
    user: User
    documents: [Document]
    payments: [Payment]
    statusHistory: [ApplicationStatusHistory]
  }

  type Admin {
    id: ID!
    email: String!
    name: String!
    role: AdminRole!
    created_at: String!
    is_active: Boolean!
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

  type ApplicationWorkflow {
    id: ID!
    application_id: ID!
    template_id: ID!
    current_step: Int!
    status: WorkflowStatus!
    assigned_to: ID
    started_at: String
    completed_at: String
    created_at: String!
    application: VisaApplication
    template: WorkflowTemplate
    assignedTo: Admin
  }

  type Consultation {
    id: ID!
    customer_name: String!
    phone: String!
    email: String!
    service_type: String!
    status: String!
    created_at: String!
    notes: String
  }

  type DashboardStats {
    totalApplications: Int!
    newApplicationsToday: Int!
    completedToday: Int!
    pendingReview: Int!
    approvalRate: Float
    averageProcessingTime: Float
    totalRevenue: Float
    monthlyRevenue: Float
    revenueGrowth: Float
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

  type ReportsData {
    overviewStats: DashboardStats
    visaTypeStats: [VisaTypeStats]
    monthlyTrends: [MonthlyTrends]
  }

  # Input Types
  input RegisterInput {
    email: String!
    password: String!
    name: String!
    phone: String
  }

  input LoginInput {
    email: String!
    password: String!
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
    birth_date: String!
    phone: String!
    email: String!
    arrival_date: String!
    departure_date: String!
    purpose: String
  }

  input DocumentInput {
    application_id: String!
    customer_name: String!
    document_type: String!
    document_name: String!
    file_size: String!
  }

  input NotificationInput {
    type: NotificationType!
    title: String!
    message: String!
    recipient: String!
    priority: NotificationPriority
    related_id: String
  }

  input ConsultationInput {
    customer_name: String!
    phone: String!
    email: String!
    service_type: String!
    notes: String
  }

  input PaymentInput {
    application_id: ID!
    amount: Float!
    currency: String!
    payment_method: String!
  }

  input WorkflowTemplateInput {
    name: String!
    description: String
    steps: String!
  }

  input AdminInput {
    email: String!
    password: String!
    name: String!
    role: AdminRole!
  }

  # Response Types
  type AuthResponse {
    token: String!
    user: User!
  }

  type AdminAuthResponse {
    token: String!
    admin: Admin!
  }

  type SuccessResponse {
    success: Boolean!
    message: String
  }

  # Root Types
  type Query {
    # Placeholder - individual schemas will extend this
    _empty: String
  }

  type Mutation {
    # Placeholder - individual schemas will extend this
    _empty: String
  }
`;

module.exports = typeDefs;
