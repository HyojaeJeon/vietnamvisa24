
import { gql } from '@apollo/client';

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
      is_active
    }
  }
`;
import { gql } from '@apollo/client';

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

export const GET_ALL_USERS_QUERY = gql`
  query GetAllUsers {
    getAllUsers {
      id
      name
      email
      phone
      created_at
    }
  }
`;

export const GET_USER_QUERY = gql`
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      name
      email
      phone
      created_at
    }
  }
`;
