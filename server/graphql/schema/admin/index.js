
const { gql } = require("graphql-tag");

const adminTypeDefs = gql`
  extend type Query {
    getApplicationById(id: ID!): VisaApplication
    getAllUsers: [User!]!
    getUser(id: ID!): User
    getVisaApplications: [VisaApplication!]!
    getVisaApplication(id: ID!): VisaApplication
    getAdminMe: Admin
  }

  extend type Mutation {
    createAdmin(input: AdminInput!): Admin!
    updateAdminRole(id: ID!, role: AdminRole!): Admin!
    deactivateAdmin(id: ID!): Admin!
    adminUpdateApplicationStatus(id: ID!, status: ApplicationStatus!, reason: String): VisaApplication!
    createVisaApplication(input: VisaApplicationInput!): VisaApplication!
    updateApplicationStatus(id: ID!, status: ApplicationStatus!): VisaApplication!
  }
`;

module.exports = adminTypeDefs;
