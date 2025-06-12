const { gql } = require("graphql-tag");

const adminTypeDefs = gql`
  extend type Query {
    # Admin 전용 쿼리들
    getAdminMe: Admin
    getAllAdmins: [Admin!]!
    getAdminById(id: ID!): Admin
    getApplicationById(id: ID!): VisaApplication
    getAllUsers: [User!]!
    getUserById(id: ID!): User
    getVisaApplications: [VisaApplication!]!
    getVisaApplicationById(id: ID!): VisaApplication
    getAllApplications: [VisaApplication!]!
    getDashboardStats: DashboardStats!
  }

  extend type Mutation {
    # Admin 관리
    createAdmin(input: AdminInput!): Admin!
    updateAdminRole(id: ID!, role: AdminRole!): Admin!
    deactivateAdmin(id: ID!): Admin!

    # Application 관리
    createVisaApplication(input: VisaApplicationInput!): VisaApplication!
    updateApplicationStatus(id: ID!, status: ApplicationStatus!): VisaApplication!
    adminUpdateApplicationStatus(id: ID!, status: ApplicationStatus!, reason: String): VisaApplication!
  }
`;

module.exports = adminTypeDefs;
