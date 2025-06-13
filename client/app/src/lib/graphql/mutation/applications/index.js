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

export const SEND_EMAIL_MUTATION = gql`
  mutation SendEmailToCustomer($applicationId: ID!, $emailType: String!, $content: String) {
    sendEmailToCustomer(applicationId: $applicationId, emailType: $emailType, content: $content) {
      success
      message
    }
  }
`;

export const ADD_MEMO_MUTATION = gql`
  mutation AddApplicationMemo($applicationId: ID!, $content: String!) {
    addApplicationMemo(applicationId: $applicationId, content: $content) {
      id
      content
      created_at
      created_by
    }
  }
`;

export const UPDATE_APPLICATION_INFO_MUTATION = gql`
  mutation UpdateApplicationInfo($id: ID!, $input: UpdateApplicationInput!) {
    updateApplicationInfo(id: $id, input: $input) {
      id
      full_name
      email
      phone
      arrival_date
      departure_date
      updated_at
    }
  }
`;

export const DOWNLOAD_DOCUMENTS_MUTATION = gql`
  mutation DownloadApplicationDocuments($applicationId: ID!) {
    downloadApplicationDocuments(applicationId: $applicationId) {
      downloadUrl
      fileName
    }
  }
`;

export const UPDATE_MEMO_MUTATION = gql`
  mutation UpdateApplicationMemo($id: ID!, $content: String!) {
    updateApplicationMemo(id: $id, content: $content) {
      id
      content
      updated_at
      created_by
    }
  }
`;

export const DELETE_MEMO_MUTATION = gql`
  mutation DeleteApplicationMemo($id: ID!) {
    deleteApplicationMemo(id: $id) {
      success
      message
    }
  }
`;
