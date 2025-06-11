
import { gql } from '@apollo/client';

// User queries
export const GET_ME_QUERY = gql`
  query GetMe {
    me {
      id
      email
      name
      phone
      created_at
    }
  }
`;

export const GET_ADMIN_ME_QUERY = gql`
  query GetAdminMe {
    adminMe {
      id
      email
      name
      role
      created_at
      is_active
    }
  }
`;

export const GET_USER_ME_QUERY = gql`
  query GetUserMe {
    userMe {
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
