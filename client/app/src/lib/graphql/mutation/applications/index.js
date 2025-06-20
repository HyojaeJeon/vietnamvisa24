import { gql } from "@apollo/client";

// New simplified mutation for creating applications
export const CREATE_APPLICATION_MUTATION = gql`
  mutation CreateApplication($input: CreateApplicationInput!) {
    createApplication(input: $input) {
      id
      applicationId
      processingType
      totalPrice
      createdAt
      personalInfo {
        id
        firstName
        lastName
        email
        phone
        address
        phoneOfFriend
      }
      travelInfo {
        id
        entryDate
        entryPort
        visaType
      }
      additionalServices {
        id
        name
      }
      documents {
        id
        type
        fileName
        fileSize
        fileType
        uploadedAt
        extractedInfo {
          type
          issuingCountry
          passportNo
          surname
          givenNames
          dateOfBirth
          dateOfIssue
          dateOfExpiry
          sex
          nationality
          personalNo
          authority
          koreanName
          # Legacy camelCase fields
          passportNo
          givenNames
        }
      }
    }
  }
`;

// Legacy mutation for backward compatibility
export const CREATE_VISA_APPLICATION_MUTATION = gql`
  mutation CreateVisaApplication($input: VisaApplicationInput!) {
    createVisaApplication(input: $input) {
      id
      visaType
      fullName
      status
      createdAt
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
      createdAt
      createdBy
    }
  }
`;

export const UPDATE_APPLICATION_INFO_MUTATION = gql`
  mutation UpdateApplicationInfo($id: ID!, $input: UpdateApplicationInput!) {
    updateApplicationInfo(id: $id, input: $input) {
      id
      fullName
      email
      phone
      arrivalDate
      departureDate
      updatedAt
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
      updatedAt
      createdBy
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

// 상태 업데이트 뮤테이션
export const UPDATE_STATUS_MUTATION = gql`
  mutation UpdateApplicationStatus($id: ID!, $status: ApplicationStatus!) {
    updateApplicationStatus(id: $id, status: $status) {
      id
      status
      message
    }
  }
`;

// 새로운 이메일 발송 뮤테이션
export const SEND_NOTIFICATION_EMAIL_MUTATION = gql`
  mutation SendNotificationEmail($applicationId: ID!, $emailType: String!, $customMessage: String) {
    sendNotificationEmail(applicationId: $applicationId, emailType: $emailType, customMessage: $customMessage) {
      success
      message
      emailType
      recipientEmail
    }
  }
`;

export const UPDATE_APPLICATION_MUTATION = gql`
  mutation UpdateApplication($id: ID!, $input: UpdateApplicationInput!) {
    updateApplication(id: $id, input: $input) {
      id
      applicationId
      processingType
      totalPrice
      status
      createdAt
      personalInfo {
        id
        firstName
        lastName
        fullName
        email
        phone
        address
        phoneOfFriend
      }
      travelInfo {
        id
        entryDate
        entryPort
        visaType
      }
      additionalServices {
        id
        name
      }
      documents {
        id
        type
        fileName
        fileSize
        fileType
        uploadedAt
        extractedInfo {
          type
          issuingCountry
          passportNo
          surname
          givenNames
          dateOfBirth
          dateOfIssue
          dateOfExpiry
          sex
          nationality
          personalNo
          authority
          koreanName
        }
      }
    }
  }
`;
