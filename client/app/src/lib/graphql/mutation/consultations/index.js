import { gql } from "@apollo/client";

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

export const UPDATE_CONSULTATION_STATUS_MUTATION = gql`
  mutation UpdateConsultationStatus($id: ID!, $status: String!, $notes: String) {
    updateConsultationStatus(id: $id, status: $status, notes: $notes) {
      id
      status
      notes
      updated_at
    }
  }
`;

export const DELETE_CONSULTATION_MUTATION = gql`
  mutation DeleteConsultation($id: ID!) {
    deleteConsultation(id: $id) {
      success
      message
    }
  }
`;
