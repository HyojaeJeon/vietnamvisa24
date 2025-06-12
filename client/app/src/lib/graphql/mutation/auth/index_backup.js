import { gql } from "@apollo/client";

// Authentication mutations
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

// Admin authentication
export const USER_LOGIN_MUTATION = gql`
  mutation UserLogin($email: String!, $password: String!) {
    userLogin(email: $email, password: $password) {
      token
      user {
        id
        email
        name
      }
    }
  }
`;

export const ADMIN_LOGIN_MUTATION = gql`
  mutation AdminLogin($input: AdminLoginInput!) {
    adminLogin(input: $input) {
      token
      admin {
        id
        name
        email
        role
      }
    }
  }
`;
