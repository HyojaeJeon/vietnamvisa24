
import { gql } from '@apollo/client';

export const GET_VISA_APPLICATION = gql`
  query GetVisaApplication($id: ID!) {
    getVisaApplication(id: $id) {
      id
      visa_type
      full_name
      passport_number
      nationality
      birth_date
      phone
      email
      arrival_date
      departure_date
      purpose
      status
      created_at
      updated_at
    }
  }
`;

export const GET_VISA_TYPES = gql`
  query GetVisaTypes {
    getVisaTypes
  }
`;

export const GET_VISA_APPLICATIONS = gql`
  query GetVisaApplications {
    getVisaApplications {
      id
      application_number
      visa_type
      full_name
      passport_number
      nationality
      birth_date
      phone
      email
      arrival_date
      departure_date
      purpose
      status
      priority
      created_at
      updated_at
    }
  }
`;
