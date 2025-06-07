const { gql } = require('apollo-server-express');

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

  enum ApplicationStatus {
    pending
    processing
    approved
    rejected
  }

  input VisaApplicationInput {
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
  }

  input UserRegistrationInput {
    email: String!
    password: String!
    name: String!
    phone: String
  }

  input UserLoginInput {
    email: String!
    password: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    # User queries
    me: User

    # Visa application queries
    getVisaApplications: [VisaApplication!]!
    getVisaApplication(id: ID!): VisaApplication

    # Public queries
    getVisaTypes: [String!]!
  }

  type Mutation {
    # Authentication
    register(input: UserRegistrationInput!): AuthPayload!
    login(input: UserLoginInput!): AuthPayload!

    # Visa applications
    submitVisaApplication(input: VisaApplicationInput!): VisaApplication!
    updateVisaApplicationStatus(id: ID!, status: ApplicationStatus!): VisaApplication!
  }
`;

module.exports = typeDefs;