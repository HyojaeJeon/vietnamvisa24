const { gql } = require("graphql-tag");

const consultationsTypeDefs = gql`
  type Consultation {
    id: ID
    applicationId: ID
    customerName: String
    phone: String
    email: String
    serviceType: String
    status: String
    notes: String
    createdAt: String
    updatedAt: String
    application: VisaApplication
    applicant: User
    assignedUser: User
  }
  input ConsultationInput {
    customerName: String!
    phone: String!
    email: String!
    serviceType: String!
    message: String
    notes: String
  }

  extend type Query {
    getConsultations: [Consultation!]!
    getConsultation(id: ID!): Consultation
  }

  extend type Mutation {
    createConsultation(input: ConsultationInput!): Consultation!
    updateConsultationStatus(
      id: ID!
      status: String!
      notes: String
    ): Consultation!
    deleteConsultation(id: ID!): SuccessResponse!
  }
`;

module.exports = consultationsTypeDefs;
