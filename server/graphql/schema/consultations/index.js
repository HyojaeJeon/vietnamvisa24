const { gql } = require("graphql-tag");

const consultationsTypeDefs = gql`
  input ConsultationInput {
    customer_name: String!
    phone: String!
    email: String!
    service_type: String!
    notes: String
  }

  extend type Query {
    getConsultations: [Consultation!]!
    getConsultation(id: ID!): Consultation
  }

  extend type Mutation {
    createConsultation(input: ConsultationInput!): Consultation!
    updateConsultationStatus(id: ID!, status: String!, notes: String): Consultation!
    deleteConsultation(id: ID!): SuccessResponse!
  }
`;

module.exports = consultationsTypeDefs;