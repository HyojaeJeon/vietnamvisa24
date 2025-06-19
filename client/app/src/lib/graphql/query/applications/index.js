import { gql } from "@apollo/client";

// 신청서 단건 조회
export const GET_APPLICATION = gql`
  query GetApplication($id: ID!) {
    application(id: $id) {
      id
      applicationId
      processingType
      totalPrice
      createdAt
      status
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
        extractedInfo
      }
    }
  }
`;

export const GET_APPLICATIONS = gql`
  query GetApplications(
    $page: Int
    $limit: Int
    $searchTerm: String
    $statusFilter: String
    $visaTypeFilter: String
    $processingTypeFilter: String
  ) {
    applications(
      page: $page
      limit: $limit
      searchTerm: $searchTerm
      statusFilter: $statusFilter
      visaTypeFilter: $visaTypeFilter
      processingTypeFilter: $processingTypeFilter
    ) {
      applications {
        id
        applicationId
        processingType
        totalPrice
        createdAt
        status
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
          extractedInfo
        }
      }
      totalCount
      totalPages
      currentPage
      hasNextPage
      hasPreviousPage
    }
  }
`;

export const GET_APPLICATION_STATISTICS = gql`
  query GetApplicationStatistics {
    applicationStatistics {
      pending
      processing
      completed
      total
    }
  }
`;

// 부가서비스 목록
export const GET_SERVICES = gql`
  query GetServices {
    services {
      id
      name
    }
  }
`;

// 구버전 호환용 비자 신청서 목록
export const GET_VISA_APPLICATIONS = gql`
  query GetVisaApplications {
    getVisaApplications {
      id
      applicationNumber
      fullName
      email
      phone
      nationality
      passportNumber
      visaType
      status
      createdAt
      updatedAt
      arrivalDate
      departureDate
      priority
      purpose
      accommodation
      processingFee
      serviceFee
      totalAmount
      paymentStatus
      paymentMethod
      paymentReference
      notes
    }
  }
`;

// 신청서 메모 목록
export const GET_APPLICATION_MEMOS = gql`
  query GetApplicationMemos($applicationId: ID!) {
    getApplicationMemos(applicationId: $applicationId) {
      id
      content
      createdAt
      createdBy
      updatedAt
    }
  }
`;

// 비자 타입 목록
export const GET_VISA_TYPES = gql`
  query GetVisaTypes {
    getVisaTypes {
      id
      name
      description
      processingTime
      price
      requiredDocuments
    }
  }
`;