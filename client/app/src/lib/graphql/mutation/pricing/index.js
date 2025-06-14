import { gql } from "@apollo/client";

// E-Visa 가격표 관리 뮤테이션
export const CREATE_E_VISA_PRICE = gql`
  mutation CreateEVisaPrice($input: EVisaPriceInput!) {
    createEVisaPrice(input: $input) {
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
    }
  }
`;

export const UPDATE_E_VISA_PRICE = gql`
  mutation UpdateEVisaPrice($id: ID!, $input: EVisaPriceUpdateInput!) {
    updateEVisaPrice(id: $id, input: $input) {
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
      updatedAt
      updater {
        id
        name
        email
      }
    }
  }
`;

export const DELETE_E_VISA_PRICE = gql`
  mutation DeleteEVisaPrice($id: ID!) {
    deleteEVisaPrice(id: $id) {
      id
      isActive
    }
  }
`;

// Visa Run 가격표 관리 뮤테이션
export const CREATE_VISA_RUN_PRICE = gql`
  mutation CreateVisaRunPrice($input: VisaRunPriceInput!) {
    createVisaRunPrice(input: $input) {
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
    }
  }
`;

export const UPDATE_VISA_RUN_PRICE = gql`
  mutation UpdateVisaRunPrice($id: ID!, $input: VisaRunPriceUpdateInput!) {
    updateVisaRunPrice(id: $id, input: $input) {
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
      updatedAt
      updater {
        id
        name
        email
      }
    }
  }
`;

export const DELETE_VISA_RUN_PRICE = gql`
  mutation DeleteVisaRunPrice($id: ID!) {
    deleteVisaRunPrice(id: $id) {
      id
      isActive
    }
  }
`;

// Fast Track 가격표 관리 뮤테이션
export const CREATE_FAST_TRACK_PRICE = gql`
  mutation CreateFastTrackPrice($input: FastTrackPriceInput!) {
    createFastTrackPrice(input: $input) {
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
    }
  }
`;

export const UPDATE_FAST_TRACK_PRICE = gql`
  mutation UpdateFastTrackPrice($id: ID!, $input: FastTrackPriceUpdateInput!) {
    updateFastTrackPrice(id: $id, input: $input) {
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
      updatedAt
      updater {
        id
        name
        email
      }
    }
  }
`;

export const DELETE_FAST_TRACK_PRICE = gql`
  mutation DeleteFastTrackPrice($id: ID!) {
    deleteFastTrackPrice(id: $id) {
      id
      isActive
    }
  }
`;

// 대량 가격 업데이트
export const BULK_UPDATE_PRICES = gql`
  mutation BulkUpdatePrices($updates: [PriceBulkUpdateInput!]!) {
    bulkUpdatePrices(updates: $updates) {
      successCount
      failureCount
      errors {
        id
        message
      }
      updatedPrices {
        id
        type
        sellingPriceUsd
        sellingPriceVnd
        sellingPriceKrw
      }
    }
  }
`;

// 가격 승인 요청
export const REQUEST_PRICE_APPROVAL = gql`
  mutation RequestPriceApproval($input: PriceApprovalRequestInput!) {
    requestPriceApproval(input: $input) {
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

// 가격 승인/거부
export const APPROVE_PRICE_CHANGE = gql`
  mutation ApprovePriceChange($approvalId: ID!, $decision: String!, $comment: String) {
    approvePriceChange(approvalId: $approvalId, decision: $decision, comment: $comment) {
      id
      approvalStatus
      approvedBy {
        id
        name
        email
      }
      approvedAt
      approvalComment
    }
  }
`;

// 환율 기반 자동 가격 조정
export const AUTO_ADJUST_PRICES_BY_EXCHANGE_RATE = gql`
  mutation AutoAdjustPricesByExchangeRate($exchangeRateData: ExchangeRateInput!) {
    autoAdjustPricesByExchangeRate(exchangeRateData: $exchangeRateData) {
      adjustedCount
      adjustedPrices {
        id
        type
        oldPriceVnd
        newPriceVnd
        oldPriceKrw
        newPriceKrw
        adjustmentPercentage
      }
      exchangeRateUsed {
        usdToVnd
        usdToKrw
        lastUpdated
      }
    }
  }
`;

// 가격 변경 이력 생성
export const CREATE_PRICE_HISTORY_LOG = gql`
  mutation CreatePriceHistoryLog($input: PriceHistoryLogInput!) {
    createPriceHistoryLog(input: $input) {
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
