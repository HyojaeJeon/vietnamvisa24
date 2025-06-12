const { gql } = require("graphql-tag");

const priceSchema = gql`
  extend type Query {
    # E-Visa 가격표 조회
    getEVisaPrices(isActive: Boolean): [EVisaPrice!]!
    getEVisaPrice(id: ID!): EVisaPrice
    getEVisaPriceByTypeAndTime(type: EVisaType!, processingTime: ProcessingTime!): EVisaPrice

    # Visa Run 가격표 조회
    getVisaRunPrices(isActive: Boolean): [VisaRunPrice!]!
    getVisaRunPrice(id: ID!): VisaRunPrice
    getVisaRunPriceByTypeAndCount(visaType: VisaRunType!, peopleCount: Int!): VisaRunPrice

    # Fast Track 가격표 조회
    getFastTrackPrices(isActive: Boolean): [FastTrackPrice!]!
    getFastTrackPrice(id: ID!): FastTrackPrice
    getFastTrackPriceByServiceAndAirport(serviceType: FastTrackServiceType!, airport: AirportCode!): FastTrackPrice

    # 모든 가격표 조회 (관리자용)
    getAllPrices: AllPricesResponse!
  }

  extend type Mutation {
    # E-Visa 가격표 관리
    createEVisaPrice(input: EVisaPriceInput!): EVisaPrice!
    updateEVisaPrice(id: ID!, input: EVisaPriceUpdateInput!): EVisaPrice!
    deleteEVisaPrice(id: ID!): SuccessResponse!
    toggleEVisaPriceStatus(id: ID!): EVisaPrice!

    # Visa Run 가격표 관리
    createVisaRunPrice(input: VisaRunPriceInput!): VisaRunPrice!
    updateVisaRunPrice(id: ID!, input: VisaRunPriceUpdateInput!): VisaRunPrice!
    deleteVisaRunPrice(id: ID!): SuccessResponse!
    toggleVisaRunPriceStatus(id: ID!): VisaRunPrice!

    # Fast Track 가격표 관리
    createFastTrackPrice(input: FastTrackPriceInput!): FastTrackPrice!
    updateFastTrackPrice(id: ID!, input: FastTrackPriceUpdateInput!): FastTrackPrice!
    deleteFastTrackPrice(id: ID!): SuccessResponse!
    toggleFastTrackPriceStatus(id: ID!): FastTrackPrice!

    # 일괄 가격 업데이트
    bulkUpdatePrices(updates: BulkPriceUpdateInput!): BulkUpdateResponse!
  }

  # 일괄 업데이트 관련 타입들
  input BulkPriceUpdateInput {
    eVisaPrices: [EVisaPriceBulkUpdate!]
    visaRunPrices: [VisaRunPriceBulkUpdate!]
    fastTrackPrices: [FastTrackPriceBulkUpdate!]
  }

  input EVisaPriceBulkUpdate {
    id: ID!
    input: EVisaPriceUpdateInput!
  }

  input VisaRunPriceBulkUpdate {
    id: ID!
    input: VisaRunPriceUpdateInput!
  }

  input FastTrackPriceBulkUpdate {
    id: ID!
    input: FastTrackPriceUpdateInput!
  }

  type BulkUpdateResponse {
    success: Boolean!
    message: String!
    updatedCount: Int!
    errors: [String!]
  }

  type AllPricesResponse {
    eVisaPrices: [EVisaPrice!]!
    visaRunPrices: [VisaRunPrice!]!
    fastTrackPrices: [FastTrackPrice!]!
    totalCount: Int!
  }
`;

module.exports = priceSchema;
