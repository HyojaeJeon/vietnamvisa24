import { gql } from '@apollo/client';

// ====================
// AUTH MUTATIONS
// ====================
export * from './mutation/auth';

// ====================
// APPLICATION QUERIES & MUTATIONS
// ====================
export * from './query/applications';
export * from './mutation/applications';

// ====================
// ADMIN QUERIES & MUTATIONS
// ====================
export * from './query/admin';
export * from './mutation/admin';

// ====================
// DOCUMENT QUERIES & MUTATIONS
// ====================
export * from './query/documents';
export * from './mutation/documents';

// Document queries and mutations are imported from their respective files above

export const UPDATE_DOCUMENT_STATUS_MUTATION = gql`
  mutation UpdateDocumentStatus(
    $id: ID!
    $status: DocumentStatus!
    $notes: String
  ) {
    updateDocumentStatus(id: $id, status: $status, notes: $notes) {
      id
      status
      reviewed_at
      notes
    }
  }
`;

// ====================
// CONSULTATION QUERIES & MUTATIONS
// ====================
export * from './query/consultations';

export const CREATE_CONSULTATION_MUTATION = gql`
  mutation CreateConsultation($input: ConsultationInput!) {
    createConsultation(input: $input) {
      id
      customer_name
      phone
      email
      service_type
      status
      created_at
    }
  }
`;

// ====================
// NOTIFICATION QUERIES & MUTATIONS
// ====================
export * from './query/notifications';
export * from './mutation/notifications';

// ====================
// PAYMENT QUERIES & MUTATIONS
// ====================
export * from './query/payments';
export * from './mutation/payments';

// ====================
// WORKFLOW QUERIES & MUTATIONS
// ====================
export * from './query/workflows';
export * from './mutation/workflows';

// ====================
// REPORT QUERIES
// ====================
export * from "./query/reports";