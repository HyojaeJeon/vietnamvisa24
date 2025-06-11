
import { gql } from '@apollo/client';

export const GET_CONSULTATIONS = gql`
  query GetConsultations {
    consultations {
      id
      customer_name
      phone
      email
      service_type
      status
      created_at
      notes
    }
  }
`;
