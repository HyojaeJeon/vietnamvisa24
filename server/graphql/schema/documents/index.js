
const { gql } = require("graphql-tag");

const documentsTypeDefs = gql`
  extend type Query {
    getAllDocuments: [Document!]!
    getDocumentsByApplication(applicationId: ID!): [Document!]!
  }

  extend type Mutation {
    createDocument(input: DocumentInput!): Document!
    updateDocumentStatus(id: ID!, status: DocumentStatus!, notes: String): Document!
    deleteDocument(id: ID!): SuccessResponse!
  }
`;

module.exports = documentsTypeDefs;
