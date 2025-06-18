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

  scalar Upload

  type PassportInfo {
    Type: String
    Issuing_country: String
    Passport_No: String
    Surname: String
    Given_names: String
    Date_of_birth: String
    Sex: String
    Nationality: String
    Personal_No: String
    Date_of_issue: String
    Date_of_expiry: String
    Authority: String
    korean_name: String
  }

  type Query {
    _empty: String
  }

  extend type Query {
    getDocument(id: ID!): Document
    getDocuments: [Document!]!
    getDocumentsByApplication(applicationId: String!): [Document!]!
    getDocumentTypes: [DocumentType!]!
    getDocumentStatistics(applicationId: String): DocumentStatistics!
  }
  input CreateDocumentInput {
    applicationId: ID!
    customerName: String!
    documentType: String!
    documentName: String
    filePath: String!
    fileSize: Int
    fileType: String
  }

  input UpdateDocumentInput {
    customerName: String
    documentType: String
    documentName: String
    status: DocumentStatus
    notes: String
  }

  extend type Query {
    getDocuments: [Document]
    getDocumentsByStatus(status: DocumentStatus!): [Document]
    getDocumentsByApplication(applicationId: ID!): [Document]
    getDocumentStatistics: DocumentStatistics
  }
  extend type Mutation {
    createDocument(input: CreateDocumentInput!): Document!
    updateDocument(id: ID!, input: UpdateDocumentInput!): Document!
    updateDocumentOcrData(id: ID!, ocrData: JSON!): Document!
    updateDocumentStatus(
      id: ID!
      status: DocumentStatus!
      notes: String
    ): Document!
    bulkUpdateDocumentStatus(
      ids: [ID!]!
      status: DocumentStatus!
      notes: String
    ): BulkUpdateResponse!
    deleteDocument(id: ID!): SuccessResponse!
    deleteDocumentsByApplication(applicationId: String!): DeleteResponse!
  }
`;

module.exports = documentsTypeDefs;
