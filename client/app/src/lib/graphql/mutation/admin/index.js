import { gql } from '@apollo/client';

export const CREATE_ADMIN_MUTATION = gql`
  mutation CreateAdmin($input: AdminInput!) {
    createAdmin(input: $input) {
      id
      email
      name
      role
      created_at
      is_active
    }
  }
`;

export const UPDATE_ADMIN_ROLE_MUTATION = gql`
  mutation UpdateAdminRole($id: ID!, $role: AdminRole!) {
    updateAdminRole(id: $id, role: $role) {
      id
      role
    }
  }
`;

export const DEACTIVATE_ADMIN_MUTATION = gql`
  mutation DeactivateAdmin($id: ID!) {
    deactivateAdmin(id: $id) {
      id
      is_active
    }
  }
`;