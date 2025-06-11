
import { gql } from '@apollo/client';

export const GET_REPORTS_DATA = gql`
  query GetReportsData($dateRange: String!) {
    reportsData(dateRange: $dateRange) {
      overviewStats {
        totalApplications
        approvalRate
        averageProcessingTime
        totalRevenue
      }
      visaTypeStats {
        type
        count
        percentage
        revenue
      }
      monthlyTrends {
        month
        applications
        revenue
      }
    }
  }
`;
