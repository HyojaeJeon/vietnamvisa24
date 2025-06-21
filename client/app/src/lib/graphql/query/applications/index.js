import { gql } from "@apollo/client";

export const GET_APPLICATIONS = gql`
  query GetApplications($page: Int, $limit: Int, $searchTerm: String, $statusFilter: String, $visaTypeFilter: String, $processingTypeFilter: String) {
    applications(page: $page, limit: $limit, searchTerm: $searchTerm, statusFilter: $statusFilter, visaTypeFilter: $visaTypeFilter, processingTypeFilter: $processingTypeFilter) {
      applications {
        id
        applicationId
        processingType
        totalPrice {
          totalPrice
          currency
          formatted {
            totalPrice
          }
        }
        status
        createdAt
        personalInfo {
          id
          fullName
          email
          phone
        }
        travelInfo {
          id
          entryDate
          entryPort
          visaType
        }
        # 목록에서는 문서와 추가 서비스는 제외하여 성능 최적화
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

export const GET_APPLICATION = gql`
  query GetApplication($id: ID!) {
    application(id: $id) {
      id
      applicationId
      processingType
      totalPrice {
        visa {
          basePrice
          vehiclePrice
          totalPrice
        }
        additionalServices {
          services {
            id
            name
            price
          }
          totalPrice
        }
        totalPrice
        currency
        formatted {
          visaBasePrice
          visaVehiclePrice
          visaTotalPrice
          additionalServicesPrice
          totalPrice
        }
      }
      status
      createdAt
      updatedAt
      # Transit visa specific fields
      transitPeopleCount
      transitVehicleType
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
        fileUrl
        fileData
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

// Status counts query for dashboard
export const GET_APPLICATION_STATUS_COUNTS = gql`
  query GetApplicationStatusCounts {
    applicationStatusCounts {
      pending
      processing
      document_review
      submitted_to_authority
      approved
      completed
      total
    }
  }
`;

// GraphQL subscriptions for real-time updates
export const APPLICATION_CREATED_SUBSCRIPTION = gql`
  subscription ApplicationCreated {
    applicationCreated {
      id
      applicationId
      processingType
      totalPrice {
        totalPrice
        currency
        formatted {
          totalPrice
        }
      }
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
        fileUrl
      }
    }
  }
`;

export const APPLICATION_UPDATED_SUBSCRIPTION = gql`
  subscription ApplicationUpdated {
    applicationUpdated {
      id
      applicationId
      processingType
      totalPrice {
        totalPrice
        currency
        formatted {
          totalPrice
        }
      }
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
        fileUrl
      }
    }
  }
`;

export const APPLICATION_STATUS_COUNTS_UPDATED_SUBSCRIPTION = gql`
  subscription ApplicationStatusCountsUpdated {
    applicationStatusCountsUpdated {
      pending
      processing
      document_review
      submitted_to_authority
      approved
      completed
      total
    }
  }
`;
