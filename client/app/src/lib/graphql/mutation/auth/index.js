import { gql } from "@apollo/client";

// User authentication mutations
export const USER_REGISTER_MUTATION = gql`
  mutation UserRegister($input: RegisterInput!) {
    userRegister(input: $input) {
      token
      user {
        id
        email
        name
        phone
      }
    }
  }
`;

export const USER_LOGIN_MUTATION = gql`
  mutation UserLogin($input: LoginInput!) {
    userLogin(input: $input) {
      token
      user {
        id
        email
        name
        phone
      }
    }
  }
`;

// Backward compatibility
export const LOGIN_MUTATION = USER_LOGIN_MUTATION;

// Admin authentication
export const ADMIN_LOGIN_MUTATION = gql`
  mutation AdminLogin($input: AdminLoginInput!) {
    adminLogin(input: $input) {
      token
      admin {
        id
        name
        email
        role
        is_active
      }
    }
  }
`;

// Token refresh
export const REFRESH_TOKEN_MUTATION = gql`
  mutation RefreshToken($refreshToken: String!) {
    refreshToken(refreshToken: $refreshToken) {
      token
      refreshToken
    }
  }
`;
