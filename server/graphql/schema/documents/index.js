
const { gql } = require("graphql-tag");

const documentsTypeDefs = gql`
  extend type Query {
    getDocuments: [Document!]!
    getDocumentsByApplication(applicationId: String!): [Document!]!
    getDocument(id: ID!): Document
  }

  extend type Mutation {
    createDocument(input: DocumentInput!): Document!
    updateDocumentStatus(id: ID!, status: DocumentStatus!, notes: String): Document!
    deleteDocumentById(id: ID!): SuccessResponse!
  }
`;

module.exports = documentsTypeDefs;
