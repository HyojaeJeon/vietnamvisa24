import { gql } from "@apollo/client";

// User queries
export const GET_ME_QUERY = gql`
  query GetMe {
    getMe {
      id
      email
      name
      phone
      created_at
    }
  }
`;

export const GET_USER_ME_QUERY = gql`
  query GetUserMe {
    getMe {
      id
      email
      name
      phone
      created_at
    }
  }
`;

export const GET_DASHBOARD_STATS = gql`
  query GetDashboardStats {
    getDashboardStats {
      totalApplications
      pendingApplications
      approvedApplications
      rejectedApplications
      totalRevenue
      monthlyRevenue
    }
  }
`;
