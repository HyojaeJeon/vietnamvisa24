
import { gql } from "@apollo/client";

export const CREATE_VISA_APPLICATION_MUTATION = gql`
  mutation CreateVisaApplication($input: VisaApplicationInput!) {
    createVisaApplication(input: $input) {
      id
      visa_type
      full_name
      status
      created_at
    }
  }
`;

export const UPDATE_APPLICATION_STATUS_MUTATION = gql`
  mutation UpdateApplicationStatus($id: ID!, $status: ApplicationStatus!) {
    updateApplicationStatus(id: $id, status: $status) {
      id
      status
      updated_at
      application_number
      full_name
    }
  }
`;
