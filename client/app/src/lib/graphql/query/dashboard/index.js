
import { gql } from '@apollo/client';

export const GET_DASHBOARD_STATS = gql`
  query GetDashboardStats {
    dashboardStats {
      totalApplications
      newApplicationsToday
      completedToday
      pendingReview
    }
  }
`;
