import { gql } from "@apollo/client";

// 알림 전송/생성
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
      relatedId
      targetUrl
      createdAt
    }
  }
`;

// 알림을 읽음으로 표시
export const MARK_NOTIFICATION_AS_READ = gql`
  mutation MarkNotificationAsRead($input: MarkNotificationReadInput!) {
    markNotificationAsRead(input: $input) {
      success
      message
      notification {
        id
        status
        isRead
        updatedAt
      }
    }
  }
`;

// 알림 삭제
export const DELETE_NOTIFICATION = gql`
  mutation DeleteNotification($id: ID!) {
    deleteNotification(id: $id) {
      success
      message
    }
  }
`;

// 대량 알림 작업 (읽음 처리/삭제)
export const BULK_NOTIFICATION_ACTION = gql`
  mutation BulkNotificationAction($input: BulkNotificationActionInput!) {
    bulkNotificationAction(input: $input) {
      success
      message
      affectedCount
    }
  }
`;

// 모든 알림을 읽음으로 표시
export const MARK_ALL_NOTIFICATIONS_AS_READ = gql`
  mutation MarkAllNotificationsAsRead($userId: String!) {
    markAllNotificationsAsRead(userId: $userId) {
      success
      message
      affectedCount
    }
  }
`;

// 모든 알림 삭제
export const DELETE_ALL_NOTIFICATIONS = gql`
  mutation DeleteAllNotifications($userId: String!) {
    deleteAllNotifications(userId: $userId) {
      success
      message
      affectedCount
    }
  }
`;
