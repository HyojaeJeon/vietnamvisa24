
import { gql } from '@apollo/client';

export const GET_DOCUMENTS = gql`
  query GetDocuments {
    getDocuments {
      id
      application_id
      customer_name
      document_type
      document_name
      file_size
      status
      uploaded_at
      reviewed_at
      reviewer
      notes
    }
  }
`;

export const GET_DOCUMENTS_BY_APPLICATION = gql`
  query GetDocumentsByApplication($applicationId: ID!) {
    getDocumentsByApplication(applicationId: $applicationId) {
      id
      application_id
      customer_name
      document_type
      document_name
      file_size
      status
      uploaded_at
      reviewed_at
      reviewer
      notes
    }
  }
`;
