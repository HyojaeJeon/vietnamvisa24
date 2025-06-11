const { gql } = require("graphql-tag");

const authTypeDefs = gql`
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
    created_at: String
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
    applicant: User
    assignedAdmin: Admin
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

  enum NotificationPriority {
      HIGH
      MEDIUM
      LOW
  }

  type Notification {
      id: ID!
      type: NotificationType!
      title: String!
      message: String!
      recipient: String!
      priority: NotificationPriority
      read: Boolean!
      related_id: String
      created_at: String!
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

  extend type Query {
    me: User
    adminMe: Admin
    getAllAdmins: [Admin!]!
    getVisaApplications: [VisaApplication!]!
    getVisaApplication(id: ID!): VisaApplication
    getVisaTypes: [String!]!
    getAllApplications: [VisaApplication!]!
    getDocuments: [Document!]!
    getDocumentsByApplication(applicationId: String!): [Document!]!
    getNotifications: [Notification!]!
    getUnreadNotifications: [Notification!]!
    getDashboardStats: DashboardStats!
  }

  extend type Mutation {
    register(input: RegisterInput!): AuthResponse!
    userRegister(input: RegisterInput!): AuthResponse!
    userLogin(input: LoginInput!): AuthResponse!
    login(input: LoginInput!): AuthResponse!
    adminLogin(input: AdminLoginInput!): AdminAuthResponse!
    refreshToken(refreshToken: String!): RefreshTokenResponse!
    createVisaApplication(input: VisaApplicationInput!): VisaApplication!
    updateApplicationStatus(id: ID!, status: ApplicationStatus!): VisaApplication!
    createDocument(input: DocumentInput!): Document!
    updateDocumentStatus(id: ID!, status: DocumentStatus!, notes: String): Document!
    createNotification(input: NotificationInput!): Notification!
    markNotificationAsRead(id: ID!): Notification!
    markAllNotificationsAsRead(userId: String!): SuccessResponse!
  }
`;

module.exports = authTypeDefs;