import { gql } from "@apollo/client";

export const CREATE_DOCUMENT = gql`
  mutation CreateDocument($input: DocumentInput!) {
    createDocument(input: $input) {
      id
      application_id
      document_type
      document_name
      file_size
      formattedFileSize
      status
      uploaded_at
      downloadUrl
      previewUrl
    }
  }
`;

export const UPDATE_DOCUMENT_STATUS = gql`
  mutation UpdateDocumentStatus($id: ID!, $status: DocumentStatus!, $notes: String) {
    updateDocumentStatus(id: $id, status: $status, notes: $notes) {
      id
      status
      notes
      reviewed_at
      reviewer {
        id
        name
        email
      }
    }
  }
`;

export const BULK_UPDATE_DOCUMENT_STATUS = gql`
  mutation BulkUpdateDocumentStatus($ids: [ID!]!, $status: DocumentStatus!, $notes: String) {
    bulkUpdateDocumentStatus(ids: $ids, status: $status, notes: $notes) {
      success
      message
      updatedCount
    }
  }
`;

export const DELETE_DOCUMENT = gql`
  mutation DeleteDocument($id: ID!) {
    deleteDocument(id: $id) {
      success
      message
    }
  }
`;

export const DELETE_DOCUMENTS_BY_APPLICATION = gql`
  mutation DeleteDocumentsByApplication($applicationId: String!) {
    deleteDocumentsByApplication(applicationId: $applicationId) {
      success
      message
      deletedCount
    }
  }
`;
