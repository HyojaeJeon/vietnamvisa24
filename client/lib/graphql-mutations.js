// lib/graphql-mutations.js
// 이 파일을 lib 폴더에 생성하고 lib/graphql.js 파일 끝에서 export 하거나
// 직접 lib/graphql.js 파일에 추가하세요

import { gql } from '@apollo/client';

// Admin Management Mutations
export const CREATE_ADMIN_MUTATION = gql`
  mutation CreateAdmin($input: CreateAdminInput!) {
    createAdmin(input: $input) {
      id
      email
      name
      role
      is_active
      created_at
    }
  }
`;

export const UPDATE_ADMIN_ROLE_MUTATION = gql`
  mutation UpdateAdminRole($id: ID!, $role: String!) {
    updateAdminRole(id: $id, role: $role) {
      id
      email
      name
      role
      is_active
      updated_at
    }
  }
`;

export const DEACTIVATE_ADMIN_MUTATION = gql`
  mutation DeactivateAdmin($id: ID!) {
    deactivateAdmin(id: $id) {
      id
      email
      name
      role
      is_active
      updated_at
    }
  }
`;

export const REACTIVATE_ADMIN_MUTATION = gql`
  mutation ReactivateAdmin($id: ID!) {
    reactivateAdmin(id: $id) {
      id
      email
      name
      role
      is_active
      updated_at
    }
  }
`;

// lib/graphql.js 파일 끝에 다음을 추가하세요:
// export * from './graphql-mutations';