import { gql } from '@apollo/client';

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

export const DELETE_E_VISA_PRICE = gql`
  mutation DeleteEVisaPrice($id: ID!) {
    deleteEVisaPrice(id: $id) {
      success
      message
    }
  }
`;

export const TOGGLE_E_VISA_PRICE_STATUS = gql`
  mutation ToggleEVisaPriceStatus($id: ID!) {
    toggleEVisaPriceStatus(id: $id) {
      id
      type
      processingTime
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

export const DELETE_VISA_RUN_PRICE = gql`
  mutation DeleteVisaRunPrice($id: ID!) {
    deleteVisaRunPrice(id: $id) {
      success
      message
    }
  }
`;

export const TOGGLE_VISA_RUN_PRICE_STATUS = gql`
  mutation ToggleVisaRunPriceStatus($id: ID!) {
    toggleVisaRunPriceStatus(id: $id) {
      id
      visaType
      peopleCount
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

export const DELETE_FAST_TRACK_PRICE = gql`
  mutation DeleteFastTrackPrice($id: ID!) {
    deleteFastTrackPrice(id: $id) {
      success
      message
    }
  }
`;

export const TOGGLE_FAST_TRACK_PRICE_STATUS = gql`
  mutation ToggleFastTrackPriceStatus($id: ID!) {
    toggleFastTrackPriceStatus(id: $id) {
      id
      serviceType
      airport
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

// 일괄 가격 업데이트 뮤테이션
export const BULK_UPDATE_PRICES = gql`
  mutation BulkUpdatePrices($updates: BulkPriceUpdateInput!) {
    bulkUpdatePrices(updates: $updates) {
      success
      message
      updatedCount
      errors
    }
  }
`;
