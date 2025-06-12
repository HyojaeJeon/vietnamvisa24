import { gql } from '@apollo/client';

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

export const GET_E_VISA_PRICE = gql`
  query GetEVisaPrice($id: ID!) {
    getEVisaPrice(id: $id) {
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

export const GET_E_VISA_PRICE_BY_TYPE_AND_TIME = gql`
  query GetEVisaPriceByTypeAndTime($type: EVisaType!, $processingTime: ProcessingTime!) {
    getEVisaPriceByTypeAndTime(type: $type, processingTime: $processingTime) {
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

export const GET_VISA_RUN_PRICE = gql`
  query GetVisaRunPrice($id: ID!) {
    getVisaRunPrice(id: $id) {
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

export const GET_VISA_RUN_PRICE_BY_TYPE_AND_COUNT = gql`
  query GetVisaRunPriceByTypeAndCount($visaType: VisaRunType!, $peopleCount: Int!) {
    getVisaRunPriceByTypeAndCount(visaType: $visaType, peopleCount: $peopleCount) {
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

export const GET_FAST_TRACK_PRICE = gql`
  query GetFastTrackPrice($id: ID!) {
    getFastTrackPrice(id: $id) {
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

export const GET_FAST_TRACK_PRICE_BY_SERVICE_AND_AIRPORT = gql`
  query GetFastTrackPriceByServiceAndAirport($serviceType: FastTrackServiceType!, $airport: AirportCode!) {
    getFastTrackPriceByServiceAndAirport(serviceType: $serviceType, airport: $airport) {
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
    }
  }
`;

// 모든 가격표 조회 (관리자용)
export const GET_ALL_PRICING_DATA = gql`
  query GetAllPrices {
    getAllPrices {
      eVisaPrices {
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
      visaRunPrices {
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
      fastTrackPrices {
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
      totalCount
    }
  }
`;
