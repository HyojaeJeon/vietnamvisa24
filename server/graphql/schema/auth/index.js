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
    user: User
    assignedAdmin: Admin
  }

  type Document {
    id: ID!
    application_id: String!
    customer_name: String!
    document_type: String!
    document_name: String!
    file_size: String!
    status: String!
    uploaded_at: String!
    reviewed_at: String
    reviewer: String
    notes: String
  }

  type Notification {
    id: ID!
    type: String!
    title: String!
    message: String!
    recipient: String!
    status: String!
    priority: String!
    created_at: String!
    related_id: String
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

  input AdminInput {
    email: String!
    password: String!
    name: String!
    role: AdminRole!
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
    type: String!
    title: String!
    message: String!
    recipient: String!
    priority: String
    related_id: String
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

  type DashboardStats {
    totalApplications: Int!
    newApplicationsToday: Int!
    completedToday: Int!
    pendingReview: Int!
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
    dashboardStats: DashboardStats!
  }

  extend type Mutation {
    register(input: RegisterInput!): AuthResponse!
    login(input: LoginInput!): AuthResponse!
    refreshToken(refreshToken: String!): RefreshTokenResponse!
    adminLogin(input: AdminLoginInput!): AdminAuthResponse!
    createAdmin(input: AdminInput!): Admin!
    updateAdminRole(id: ID!, role: AdminRole!): Admin!
    deactivateAdmin(id: ID!): Admin!
    createVisaApplication(input: VisaApplicationInput!): VisaApplication!
    updateVisaApplicationStatus(id: ID!, status: ApplicationStatus!): VisaApplication!
    updateApplicationStatus(id: ID!, status: ApplicationStatus!): VisaApplication!
    updateConsultationStatus(id: ID!, status: String!, notes: String): VisaApplication!
    updateDocumentStatus(id: ID!, status: String!, notes: String): Document!
    deleteDocument(id: ID!): Boolean!
    markNotificationAsRead(id: ID!): Notification!
    markAllNotificationsAsRead: Boolean!
    createNotification(input: NotificationInput!): Notification!
  }
`;

module.exports = authTypeDefs;