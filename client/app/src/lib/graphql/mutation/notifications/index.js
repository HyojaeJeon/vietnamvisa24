import { gql } from '@apollo/client';

export const MARK_NOTIFICATION_AS_READ_MUTATION = gql`
  mutation MarkNotificationAsRead($id: ID!) {
    adminMarkNotificationAsRead(id: $id) {
      id
      is_read
    }
  }
`;

export const MARK_ALL_NOTIFICATIONS_AS_READ = gql`
  mutation MarkAllNotificationsAsRead {
    markAllNotificationsAsRead {
      success
      message
    }
  }
`;

export const SEND_NOTIFICATION_MUTATION = gql`
  mutation SendNotification($input: NotificationInput!) {
    sendNotification(input: $input) {
      id
      type
      title
      message
      recipient
      status
      priority
      created_at
    }
  }
`;

export const MARK_NOTIFICATION_AS_READ = gql`
  mutation MarkNotificationAsRead($id: ID!) {
    markNotificationAsRead(id: $id) {
      id
      status
    }
  }
`;

export const CREATE_NOTIFICATION = gql`
  mutation CreateNotification($input: NotificationInput!) {
    createNotification(input: $input) {
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