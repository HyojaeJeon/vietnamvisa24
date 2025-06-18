import { gql } from "@apollo/client";

export const USER_LOGIN_QUERY = gql`
  query UserLogin($input: LoginInput!) {
    userLogin(input: $input) {
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

export const GET_ME_QUERY = gql`
  query GetMe {
    getMe {
      id
      email
      name
      phone
      role
    }
  }
`;
