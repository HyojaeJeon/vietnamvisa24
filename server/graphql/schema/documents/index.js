const { gql } = require("graphql-tag");

const documentsTypeDefs = gql`
  type DocumentType {
    value: String!
    label: String!
    required: Boolean!
  }

  type DocumentStatistics {
    total: Int!
    pending: Int!
    approved: Int!
    rejected: Int!
    review_rate: Int!
  }

  type BulkUpdateResponse {
    success: Boolean!
    message: String!
    updatedCount: Int!
  }

  type DeleteResponse {
    success: Boolean!
    message: String!
    deletedCount: Int
  }

  input BulkDocumentUpdateInput {
    ids: [ID!]!
    status: DocumentStatus!
    notes: String
  }

  extend type Document {
    downloadUrl: String
    previewUrl: String
    formattedFileSize: String
  }

  extend type Query {
    getDocuments: [Document!]!
    getDocumentsByApplication(applicationId: String!): [Document!]!
    getDocument(id: ID!): Document
    getDocumentTypes: [DocumentType!]!
    getDocumentStatistics(applicationId: String): DocumentStatistics!
  }

  extend type Mutation {
    createDocument(input: DocumentInput!): Document!
    updateDocumentStatus(id: ID!, status: DocumentStatus!, notes: String): Document!
    bulkUpdateDocumentStatus(ids: [ID!]!, status: DocumentStatus!, notes: String): BulkUpdateResponse!
    deleteDocument(id: ID!): SuccessResponse!
    deleteDocumentsByApplication(applicationId: String!): DeleteResponse!
  }
`;

module.exports = documentsTypeDefs;
