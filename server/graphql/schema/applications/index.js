const { gql } = require("graphql-tag");

const typeDefs = gql`
  type EmailResponse {
    success: Boolean!
    message: String!
  }
  type MemoResponse {
    id: ID!
    content: String!
    created_at: String!
    updated_at: String
    created_by: String!
  }

  type DeleteResponse {
    success: Boolean!
    message: String!
  }

  type DownloadResponse {
    downloadUrl: String!
    fileName: String!
  }

  input UpdateApplicationInput {
    full_name: String
    email: String
    phone: String
    arrival_date: String
    departure_date: String
    visa_type: String
    nationality: String
    passport_number: String
    purpose: String
  }
  input VisaApplicationInput {
    visa_type: String!
    full_name: String!
    passport_number: String
    nationality: String!
    birth_date: String!
    phone: String!
    email: String!
    gender: String
    processing_speed: String
    visa_subtype: String
    documents: String
    additional_services: String
    payment_method: String
    payment_skipped: Boolean
    base_price: Float
    total_price: Float
  }

  extend type Query {
    getVisaApplications: [VisaApplication!]!
    getVisaApplication(id: ID!): VisaApplication
    getApplicationHistory(id: ID!): [ApplicationStatusHistory!]!
    getApplicationMemos(applicationId: ID!): [MemoResponse!]!
  }
  extend type Mutation {
    createVisaApplication(input: VisaApplicationInput!): VisaApplication!
    updateApplicationStatus(id: ID!, status: ApplicationStatus!): VisaApplication!
    updateApplicationInfo(id: ID!, input: UpdateApplicationInput!): VisaApplication!
    sendEmailToCustomer(applicationId: ID!, emailType: String!, content: String): EmailResponse!
    addApplicationMemo(applicationId: ID!, content: String!): MemoResponse!
    updateApplicationMemo(id: ID!, content: String!): MemoResponse!
    deleteApplicationMemo(id: ID!): DeleteResponse!
    downloadApplicationDocuments(applicationId: ID!): DownloadResponse!
    deleteApplication(id: ID!): Boolean!
  }
`;

module.exports = typeDefs;
