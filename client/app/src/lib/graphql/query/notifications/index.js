
import { gql } from '@apollo/client';

export const GET_NOTIFICATIONS = gql`
  query GetNotifications {
    getNotifications {
      id
      type
      title
      message
      recipient
      status
      priority
      created_at
      related_id
    }
  }
`;

export const GET_UNREAD_NOTIFICATIONS = gql`
  query GetUnreadNotifications {
    getUnreadNotifications {
      id
      type
      title
      message
      recipient
      status
      priority
      created_at
      related_id
    }
  }
`;

export const GET_ALL_NOTIFICATIONS_QUERY = gql`
  query GetAllNotifications {
    getAllNotifications {
      id
      type
      title
      message
      recipient
      status
      priority
      created_at
      related_id
    }
  }
`;
