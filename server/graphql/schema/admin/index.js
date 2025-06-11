
const { gql } = require("graphql-tag");

const adminTypeDefs = gql`
  extend type Query {
    getAllApplications: [VisaApplication!]!
    getApplicationById(id: ID!): VisaApplication
    getDashboardStats: DashboardStats!
  }

  extend type Mutation {
    createAdmin(input: AdminInput!): Admin!
    updateAdminRole(id: ID!, role: AdminRole!): Admin!
    deactivateAdmin(id: ID!): Admin!
  }
`;

module.exports = adminTypeDefs;
