import { gql } from "@apollo/client";

// E-Visa 가격표 조회
export const GET_E_VISA_PRICES = gql`
  query GetEVisaPrices($isActive: Boolean) {
    getEVisaPrices(isActive: $isActive) {
      id
      type
      processingTime
      sellingPriceUsd
      sellingPriceVnd
      sellingPriceKrw
      marginUsd
      marginVnd
      marginKrw
      isActive
      createdAt
      updatedAt
      creator {
        id
        name
        email
      }
      updater {
        id
        name
        email
      }
    }
  }
`;

// Visa Run 가격표 조회
export const GET_VISA_RUN_PRICES = gql`
  query GetVisaRunPrices($isActive: Boolean) {
    getVisaRunPrices(isActive: $isActive) {
      id
      visaType
      peopleCount
      sellingPriceUsd
      sellingPriceVnd
      sellingPriceKrw
      marginUsd
      marginVnd
      marginKrw
      isActive
      createdAt
      updatedAt
      creator {
        id
        name
        email
      }
      updater {
        id
        name
        email
      }
    }
  }
`;

// Fast Track 가격표 조회
export const GET_FAST_TRACK_PRICES = gql`
  query GetFastTrackPrices($isActive: Boolean) {
    getFastTrackPrices(isActive: $isActive) {
      id
      serviceType
      airport
      sellingPriceUsd
      sellingPriceVnd
      sellingPriceKrw
      marginUsd
      marginVnd
      marginKrw
      isActive
      createdAt
      updatedAt
      creator {
        id
        name
        email
      }
      updater {
        id
        name
        email
      }
    }
  }
`;

// 모든 가격표 조회 (통합)
export const GET_ALL_PRICING_DATA = gql`
  query GetAllPricingData {
    getEVisaPrices(isActive: true) {
      id
      type
      processingTime
      sellingPriceUsd
      sellingPriceVnd
      sellingPriceKrw
      marginUsd
      marginVnd
      marginKrw
      isActive
      createdAt
      updatedAt
      creator {
        id
        name
        email
      }
      updater {
        id
        name
        email
      }
    }
    getVisaRunPrices(isActive: true) {
      id
      visaType
      peopleCount
      sellingPriceUsd
      sellingPriceVnd
      sellingPriceKrw
      marginUsd
      marginVnd
      marginKrw
      isActive
      createdAt
      updatedAt
      creator {
        id
        name
        email
      }
      updater {
        id
        name
        email
      }
    }
    getFastTrackPrices(isActive: true) {
      id
      serviceType
      airport
      sellingPriceUsd
      sellingPriceVnd
      sellingPriceKrw
      marginUsd
      marginVnd
      marginKrw
      isActive
      createdAt
      updatedAt
      creator {
        id
        name
        email
      }
      updater {
        id
        name
        email
      }
    }
  }
`;

// 가격 변경 이력 조회
export const GET_PRICE_HISTORY = gql`
  query GetPriceHistory($priceId: ID!, $priceType: String!) {
    getPriceHistory(priceId: $priceId, priceType: $priceType) {
      id
      priceId
      priceType
      changeType
      oldValues
      newValues
      changeReason
      createdAt
      creator {
        id
        name
        email
      }
    }
  }
`;

// 통계 데이터 조회
export const GET_PRICING_STATISTICS = gql`
  query GetPricingStatistics {
    getPricingStatistics {
      totalEVisaPrices
      totalVisaRunPrices
      totalFastTrackPrices
      activePricesCount
      inactivePricesCount
      recentChangesCount
      averageMarginUsd
      averageMarginVnd
      averageMarginKrw
    }
  }
`;

// 지역별 가격 비교
export const GET_PRICE_COMPARISON_BY_REGION = gql`
  query GetPriceComparisonByRegion($serviceType: String!) {
    getPriceComparisonByRegion(serviceType: $serviceType) {
      region
      averagePriceUsd
      averagePriceVnd
      averagePriceKrw
      pricesCount
      competitorPriceUsd
      competitorPriceVnd
      competitorPriceKrw
    }
  }
`;

// 서비스별 수익률 분석
export const GET_PROFIT_ANALYSIS_BY_SERVICE = gql`
  query GetProfitAnalysisByService($startDate: String!, $endDate: String!) {
    getProfitAnalysisByService(startDate: $startDate, endDate: $endDate) {
      serviceType
      totalRevenue
      totalCost
      totalProfit
      profitMargin
      transactionCount
      averageOrderValue
    }
  }
`;

// 환율 기반 가격 조정 권장사항
export const GET_PRICE_ADJUSTMENT_RECOMMENDATIONS = gql`
  query GetPriceAdjustmentRecommendations {
    getPriceAdjustmentRecommendations {
      priceId
      priceType
      currentPriceUsd
      currentPriceVnd
      currentPriceKrw
      recommendedPriceUsd
      recommendedPriceVnd
      recommendedPriceKrw
      adjustmentReason
      expectedImpact
      urgencyLevel
    }
  }
`;

// 가격 승인 대기 목록
export const GET_PENDING_PRICE_APPROVALS = gql`
  query GetPendingPriceApprovals {
    getPendingPriceApprovals {
      id
      priceType
      changeType
      currentValues
      proposedValues
      changeReason
      requestedBy {
        id
        name
        email
      }
      requestedAt
      approvalStatus
      urgencyLevel
    }
  }
`;
