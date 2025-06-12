const { gql } = require("graphql-tag");

const pricingTypeDefs = gql`
  # ====================
  # PRICING TYPES
  # ====================

  type EVisaPrice {
    id: ID!
    type: String!
    processingTime: String!
    sellingPriceUSD: Float!
    marginUSD: Float!
    sellingPriceVND: Float!
    marginVND: Float!
    sellingPriceKRW: Float!
    marginKRW: Float!
    isActive: Boolean!
    createdBy: ID
    updatedBy: ID
    createdAt: String!
    updatedAt: String!
    creator: Admin
    updater: Admin
  }

  type VisaRunPrice {
    id: ID!
    visaType: String!
    peopleCount: Int!
    sellingPriceUSD: Float!
    marginUSD: Float!
    sellingPriceVND: Float!
    marginVND: Float!
    sellingPriceKRW: Float!
    marginKRW: Float!
    isActive: Boolean!
    createdBy: ID
    updatedBy: ID
    createdAt: String!
    updatedAt: String!
    creator: Admin
    updater: Admin
  }

  type FastTrackPrice {
    id: ID!
    serviceType: String!
    airport: String!
    sellingPriceUSD: Float!
    marginUSD: Float!
    sellingPriceVND: Float!
    marginVND: Float!
    sellingPriceKRW: Float!
    marginKRW: Float!
    isActive: Boolean!
    createdBy: ID
    updatedBy: ID
    createdAt: String!
    updatedAt: String!
    creator: Admin
    updater: Admin
  }

  # ====================
  # INPUT TYPES
  # ====================

  input EVisaPriceInput {
    type: String!
    processingTime: String!
    sellingPriceUSD: Float!
    marginUSD: Float!
    sellingPriceVND: Float!
    marginVND: Float!
    sellingPriceKRW: Float!
    marginKRW: Float!
    isActive: Boolean
  }

  input EVisaPriceUpdateInput {
    type: String
    processingTime: String
    sellingPriceUSD: Float
    marginUSD: Float
    sellingPriceVND: Float
    marginVND: Float
    sellingPriceKRW: Float
    marginKRW: Float
    isActive: Boolean
  }

  input VisaRunPriceInput {
    visaType: String!
    peopleCount: Int!
    sellingPriceUSD: Float!
    marginUSD: Float!
    sellingPriceVND: Float!
    marginVND: Float!
    sellingPriceKRW: Float!
    marginKRW: Float!
    isActive: Boolean
  }

  input VisaRunPriceUpdateInput {
    visaType: String
    peopleCount: Int
    sellingPriceUSD: Float
    marginUSD: Float
    sellingPriceVND: Float
    marginVND: Float
    sellingPriceKRW: Float
    marginKRW: Float
    isActive: Boolean
  }

  input FastTrackPriceInput {
    serviceType: String!
    airport: String!
    sellingPriceUSD: Float!
    marginUSD: Float!
    sellingPriceVND: Float!
    marginVND: Float!
    sellingPriceKRW: Float!
    marginKRW: Float!
    isActive: Boolean
  }

  input FastTrackPriceUpdateInput {
    serviceType: String
    airport: String
    sellingPriceUSD: Float
    marginUSD: Float
    sellingPriceVND: Float
    marginVND: Float
    sellingPriceKRW: Float
    marginKRW: Float
    isActive: Boolean
  }

  # ====================
  # QUERY EXTENSIONS
  # ====================

  extend type Query {
    # E-VISA 가격표 조회
    getEVisaPrices: [EVisaPrice!]!
    getEVisaPrice(id: ID!): EVisaPrice
    getEVisaPriceByType(type: String!, processingTime: String!): EVisaPrice

    # Visa Run 가격표 조회
    getVisaRunPrices: [VisaRunPrice!]!
    getVisaRunPrice(id: ID!): VisaRunPrice
    getVisaRunPriceByTypeAndCount(visaType: String!, peopleCount: Int!): VisaRunPrice

    # Fast Track 가격표 조회
    getFastTrackPrices: [FastTrackPrice!]!
    getFastTrackPrice(id: ID!): FastTrackPrice
    getFastTrackPriceByService(serviceType: String!, airport: String!): FastTrackPrice
  }

  # ====================
  # MUTATION EXTENSIONS
  # ====================

  extend type Mutation {
    # E-VISA 가격표 관리
    createEVisaPrice(input: EVisaPriceInput!): EVisaPrice!
    updateEVisaPrice(id: ID!, input: EVisaPriceUpdateInput!): EVisaPrice!
    deleteEVisaPrice(id: ID!): Boolean!

    # Visa Run 가격표 관리
    createVisaRunPrice(input: VisaRunPriceInput!): VisaRunPrice!
    updateVisaRunPrice(id: ID!, input: VisaRunPriceUpdateInput!): VisaRunPrice!
    deleteVisaRunPrice(id: ID!): Boolean!

    # Fast Track 가격표 관리
    createFastTrackPrice(input: FastTrackPriceInput!): FastTrackPrice!
    updateFastTrackPrice(id: ID!, input: FastTrackPriceUpdateInput!): FastTrackPrice!
    deleteFastTrackPrice(id: ID!): Boolean!
  }
`;

module.exports = pricingTypeDefs;
