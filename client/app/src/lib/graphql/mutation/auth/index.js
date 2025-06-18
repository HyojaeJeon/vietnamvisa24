import { gql } from "@apollo/client";

// Token refresh mutations
export const REFRESH_TOKEN_MUTATION = gql`
  mutation RefreshToken($refreshToken: String) {
    refreshToken(refreshToken: $refreshToken) {
      accessToken
      refreshToken
    }
  }
`;

// User authentication mutations (updated to include refresh accessTokens)
export const USER_REGISTER_MUTATION = gql`
  mutation UserRegister($input: RegisterInput!) {
    userRegister(input: $input) {
      accessToken
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

// Logout mutations (clear accessToken)
export const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout {
      success
      message
    }
  }
`;
