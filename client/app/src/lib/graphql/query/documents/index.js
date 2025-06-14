import { gql } from "@apollo/client";

export const GET_DOCUMENTS = gql`
  query GetDocuments {
    getDocuments {
      id
      application_id
      document_type
      document_name
      file_size
      formattedFileSize
      status
      uploaded_at
      reviewed_at
      notes
      downloadUrl
      previewUrl
      application {
        id
        application_number
        full_name
        visa_type
      }
      reviewer {
        id
        name
        email
      }
    }
  }
`;

export const GET_DOCUMENTS_BY_APPLICATION = gql`
  query GetDocumentsByApplication($applicationId: String!) {
    getDocumentsByApplication(applicationId: $applicationId) {
      id
      application_id
      document_type
      document_name
      file_size
      formattedFileSize
      status
      uploaded_at
      reviewed_at
      notes
      downloadUrl
      previewUrl
      application {
        id
        application_number
        full_name
      }
      reviewer {
        id
        name
        email
      }
    }
  }
`;

export const GET_DOCUMENT = gql`
  query GetDocument($id: ID!) {
    getDocument(id: $id) {
      id
      application_id
      document_type
      document_name
      file_size
      formattedFileSize
      status
      uploaded_at
      reviewed_at
      notes
      downloadUrl
      previewUrl
      application {
        id
        application_number
        full_name
        visa_type
        email
        phone
      }
      reviewer {
        id
        name
        email
      }
    }
  }
`;

export const GET_DOCUMENT_TYPES = gql`
  query GetDocumentTypes {
    getDocumentTypes {
      value
      label
      required
    }
  }
`;

export const GET_DOCUMENT_STATISTICS = gql`
  query GetDocumentStatistics($applicationId: String) {
    getDocumentStatistics(applicationId: $applicationId) {
      total
      pending
      approved
      rejected
      review_rate
    }
  }
`;
