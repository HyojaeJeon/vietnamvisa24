
const { gql } = require("graphql-tag");

const consultationsTypeDefs = gql`
  extend type Query {
    getConsultations: [Consultation!]!
    getConsultation(id: ID!): Consultation
  }

  extend type Mutation {
    createConsultation(input: ConsultationInput!): Consultation!
    updateConsultationStatusById(id: ID!, status: String!, notes: String): Consultation!
    deleteConsultation(id: ID!): SuccessResponse!
  }
`;

module.exports = consultationsTypeDefs;
