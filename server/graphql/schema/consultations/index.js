
const { gql } = require("graphql-tag");

const consultationsTypeDefs = gql`
  extend type Query {
    getAllConsultations: [Consultation!]!
    getConsultationById(id: ID!): Consultation
  }

  extend type Mutation {
    createConsultation(input: ConsultationInput!): Consultation!
    updateConsultationStatus(id: ID!, status: String!, notes: String): Consultation!
    deleteConsultation(id: ID!): SuccessResponse!
  }
`;

module.exports = consultationsTypeDefs;
