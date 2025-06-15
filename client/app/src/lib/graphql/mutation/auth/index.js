import { gql } from "@apollo/client";

// Token refresh mutations
export const REFRESH_TOKEN_MUTATION = gql`
  mutation RefreshToken($refreshToken: String) {
    refreshToken(refreshToken: $refreshToken) {
      token
      refreshToken
    }
  }
`;

export const REFRESH_ADMIN_TOKEN_MUTATION = gql`
  mutation RefreshAdminToken($refreshToken: String) {
    refreshAdminToken(refreshToken: $refreshToken) {
      token
      refreshToken
    }
  }
`;

// User authentication mutations (updated to include refresh tokens)
export const USER_REGISTER_MUTATION = gql`
  mutation UserRegister($input: RegisterInput!) {
    userRegister(input: $input) {
      token
      refreshToken
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
      refreshToken
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
      refreshToken
      admin {
        id
        email
        name
        role
        created_at
        is_active
      }
    }
  }
`;

// Logout mutations (clear tokens)
export const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout {
      success
      message
    }
  }
`;
