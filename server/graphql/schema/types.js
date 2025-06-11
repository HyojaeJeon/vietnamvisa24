const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    id: ID!
    email: String!
    name: String!
    phone: String
    created_at: String!
  }

  type VisaApplication {
    id: ID!
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
    created_at: String!
    updated_at: String!
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
  }

  type DashboardStats {
    totalApplications: Int!
    newApplicationsToday: Int!
    completedToday: Int!
    pendingReview: Int!
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

  type ReportsData {
    overviewStats: OverviewStats
    visaTypeStats: [VisaTypeStat!]!
    monthlyTrends: [MonthlyTrend!]!
  }

  type OverviewStats {
    totalApplications: Int
    approvalRate: Float
    averageProcessingTime: Float
    totalRevenue: Int
  }

  type VisaTypeStat {
    type: String
    count: Int
    percentage: Float
    revenue: String
  }

  type MonthlyTrend {
    month: String!
    applications: Int!
    revenue: Int!
  }`;

  type MonthlyTrend {
    month: String
    applications: Int
    approvals: Int
    revenue: Int
  }
`;

module.exports = typeDefs;
