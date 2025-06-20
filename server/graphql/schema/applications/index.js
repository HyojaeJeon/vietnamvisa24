const { gql } = require("graphql-tag");

const typeDefs = gql`
  scalar Date
  scalar DateTime

  enum ApplicationStatus {
    PENDING
    PROCESSING
    DOCUMENT_REVIEW
    SUBMITTED_TO_AUTHORITY
    APPROVED
    REJECTED
    COMPLETED
  }
  type Application {
    id: ID
    applicationId: String
    processingType: String
    totalPrice: Float
    status: ApplicationStatus
    createdAt: DateTime
    documents: [Document]
    personalInfo: PersonalInfo
    travelInfo: TravelInfo
    additionalServices: [AdditionalService]
    extractedInfo: ExtractedInfo
  }

  extend type Document {
    extractedInfo: ExtractedInfo
  }

  type ExtractedInfo {
    type: String
    issuingCountry: String
    passportNo: String
    surname: String
    givenNames: String
    dateOfBirth: String
    dateOfIssue: String
    dateOfExpiry: String
    sex: String
    nationality: String
    personalNo: String
    authority: String
    koreanName: String
    # Legacy snake_case fields for backward compatibility
    issuing_country: String
    passport_no: String
    given_names: String
    date_of_birth: String
    date_of_issue: String
    date_of_expiry: String
    personal_no: String
    korean_name: String
  }
  type PersonalInfo {
    id: ID
    firstName: String
    lastName: String
    fullName: String
    email: String
    phone: String
    address: String
    phoneOfFriend: String
  }

  type TravelInfo {
    id: ID
    entryDate: Date
    entryPort: String
    visaType: String
  }

  type AdditionalService {
    id: ID
    name: String
  }

  type ApplicationsResponse {
    applications: [Application]!
    totalCount: Int!
    totalPages: Int!
    currentPage: Int!
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
  }
  type ApplicationStatistics {
    pending: Int!
    processing: Int!
    completed: Int!
    total: Int!
  }

  type ApplicationStatusCounts {
    pending: Int!
    processing: Int!
    document_review: Int!
    submitted_to_authority: Int!
    approved: Int!
    completed: Int!
    total: Int!
  }
  type Query {
    application(id: ID): Application
    applications(
      page: Int
      limit: Int
      searchTerm: String
      statusFilter: String
      visaTypeFilter: String
      processingTypeFilter: String
    ): ApplicationsResponse
    applicationStatistics: ApplicationStatistics
    applicationStatusCounts: ApplicationStatusCounts
    documents(applicationId: ID): [Document]
    services: [AdditionalService]
  }

  type Mutation {
    createApplication(input: CreateApplicationInput): Application
    updateApplication(id: ID, input: UpdateApplicationInput): Application
  }
  input CreateApplicationInput {
    applicationId: String
    processingType: String
    totalPrice: Float
    personalInfo: PersonalInfoInput
    travelInfo: TravelInfoInput
    additionalServiceIds: [ID]
    documents: DocumentsInput
  }

  input UpdateApplicationInput {
    personalInfo: PersonalInfoInput
    travelInfo: TravelInfoInput
    processingType: String
    totalPrice: Float
    extractedInfo: ExtractedInfoInput
  }

  input ExtractedInfoInput {
    type: String
    issuingCountry: String
    passportNo: String
    surname: String
    givenNames: String
    dateOfBirth: String
    dateOfIssue: String
    dateOfExpiry: String
    sex: String
    nationality: String
    personalNo: String
    authority: String
    koreanName: String
  }

  input DocumentsInput {
    passport: DocumentFileInput
    photo: DocumentFileInput
    flightTicket: DocumentFileInput
    bankStatement: DocumentFileInput
    invitationLetter: DocumentFileInput
    businessRegistration: DocumentFileInput
  }

  input DocumentFileInput {
    fileName: String
    fileSize: Int
    fileType: String
    fileData: String # Base64 encoded file data
    extractedInfo: PassportInfoInput # For passport OCR data
  }
  input PassportInfoInput {
    type: String
    issuing_country: String
    issuingCountry: String # camelCase alias for backward compatibility
    passport_no: String
    passportNo: String # camelCase alias for backward compatibility
    surname: String
    given_names: String
    givenNames: String # camelCase alias for backward compatibility
    date_of_birth: String
    dateOfBirth: String # camelCase alias for backward compatibility
    date_of_issue: String
    dateOfIssue: String # camelCase alias for backward compatibility
    date_of_expiry: String
    dateOfExpiry: String # camelCase alias for backward compatibility
    sex: String
    nationality: String
    personal_no: String
    personalNo: String # camelCase alias for backward compatibility
    authority: String
    korean_name: String
    koreanName: String # camelCase alias for backward compatibility
  }
  input PersonalInfoInput {
    firstName: String
    lastName: String
    fullName: String
    email: String
    phone: String
    address: String
    phoneOfFriend: String
  }
  input TravelInfoInput {
    entryDate: Date
    entryPort: String
    visaType: String
  }

  type Subscription {
    applicationCreated: Application
    applicationUpdated: Application
    applicationStatusCountsUpdated: ApplicationStatusCounts
  }
`;

module.exports = typeDefs;
