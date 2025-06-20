const { gql } = require("graphql-tag");

const authTypeDefs = gql`
  type User {
    id: ID!
    email: String!
    name: String!
    phone: String
    created_at: String
    tokenVersion: Int
    role: UserRole!
    is_active: Boolean
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
    assignedUser: User
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
    APPLICATION_UPDATE
    STATUS_CHANGE
    CONSULTATION
    SYSTEM
    DOCUMENT_REQUIRED
    DASHBOARD_NEW_APPLICATION
    NEW_APPLICATION
    APPLICATION_STATUS_CHANGE
    NOTIFICATION
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
  type Notification {
    id: ID!
    type: NotificationType!
    title: String!
    message: String!
    recipient: String!
    status: NotificationStatus!
    priority: NotificationPriority
    isRead: Boolean!
    relatedId: String
    createdAt: String!
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
  input VisaApplicationInput {
    visaType: String!
    fullName: String!
    passportNumber: String!
    nationality: String!
    birthDate: String
    phone: String!
    email: String!
    arrivalDate: String!
    departureDate: String!
    purpose: String
  }
  input NotificationInput {
    type: NotificationType!
    title: String!
    message: String!
    recipient: String!
    priority: NotificationPriority
    relatedId: String
  }
  input DocumentInput {
    applicationId: String!
    customerName: String!
    documentType: String!
    documentName: String!
    fileSize: String!
  }
  type AuthResponse {
    accessToken: String!
    refreshToken: String
    user: User!
  }

  type RefreshTokenResponse {
    accessToken: String!
    refreshToken: String!
  }

  enum UserRole {
    ADMIN
    USER
    STAFF
    MANAGER
    SUPER_ADMIN
  }
  type NotificationConnection {
    notifications: [Notification]
    totalCount: Int!
    hasNextPage: Boolean!
    cursor: String
  }

  extend type Query {
    getMe: User
    getDocuments: [Document!]!
    getDocumentsByApplication(applicationId: String!): [Document!]!
    getNotifications(limit: Int = 10, offset: Int = 0): NotificationConnection
    getUnreadNotifications: [Notification!]!
    userLogin(input: LoginInput!): AuthResponse!
  }
  extend type Mutation {
    userRegister(input: RegisterInput!): AuthResponse!
    refreshToken(refreshToken: String): RefreshTokenResponse!
    createDocument(input: DocumentInput!): Document!
    updateDocumentStatus(
      id: ID!
      status: DocumentStatus!
      notes: String
    ): Document!
    createNotification(input: NotificationInput!): Notification!
  }
`;

module.exports = authTypeDefs;
