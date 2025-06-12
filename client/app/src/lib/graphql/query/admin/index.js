import { gql } from "@apollo/client";

export const GET_ALL_ADMINS_QUERY = gql`
  query GetAllAdmins {
    getAllAdmins {
      id
      email
      name
      role
      created_at
      is_active
    }
  }
`;

export const GET_ALL_USERS_QUERY = gql`
  query GetAllUsers {
    getAllUsers {
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
    getAdminMe {
      id
      name
      email
      role
      is_active
      created_at
    }
  }
`;

export const GET_USER_BY_ID_QUERY = gql`
  query GetUserById($id: ID!) {
    getUserById(id: $id) {
      id
      name
      email
      phone
      created_at
    }
  }
`;

export const GET_DASHBOARD_STATS_QUERY = gql`
  query GetDashboardStats {
    getDashboardStats {
      totalApplications
      newApplicationsToday
      completedToday
      pendingReview
    }
  }
`;

export const GET_VISA_APPLICATIONS_QUERY = gql`
  query GetVisaApplications {
    getVisaApplications {
      id
      application_number
      visa_type
      full_name
      passport_number
      nationality
      phone
      email
      status
      created_at
      updated_at
    }
  }
`;

export const GET_APPLICATION_BY_ID_QUERY = gql`
  query GetApplicationById($id: ID!) {
    getApplicationById(id: $id) {
      id
      application_number
      visa_type
      full_name
      passport_number
      nationality
      birth_date
      phone
      email
      arrival_date
      departure_date
      purpose
      status
      priority
      created_at
      updated_at
    }
  }
`;
