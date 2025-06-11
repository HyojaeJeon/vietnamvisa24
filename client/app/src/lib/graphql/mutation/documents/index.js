
import { gql } from '@apollo/client';

export const UPDATE_DOCUMENT_STATUS = gql`
  mutation UpdateDocumentStatus($id: ID!, $status: DocumentStatus!, $notes: String) {
    updateDocumentStatus(id: $id, status: $status, notes: $notes) {
      id
      status
      notes
      reviewed_at
    }
  }
`;

export const DELETE_DOCUMENT = gql`
  mutation DeleteDocument($id: ID!) {
    deleteDocument(id: $id)
  }
`;
