import { gql } from "@apollo/client";

// 사용자 알림 조회
export const GET_USER_NOTIFICATIONS = gql`
  query GetUserNotifications($userId: String!) {
    getNotificationsByUser(userId: $userId) {
      id
      type
      title
      message
      recipient
      status
      priority
      relatedId
      targetUrl
      isRead
      createdAt
      updatedAt
    }
  }
`;

// 읽지 않은 알림 개수 조회
export const GET_UNREAD_NOTIFICATIONS_COUNT = gql`
  query GetUnreadNotificationsCount($userId: String!) {
    getUnreadNotificationsCount(userId: $userId)
  }
`;

// 모든 알림 조회 (관리자용)
export const GET_ALL_NOTIFICATIONS = gql`
  query GetAllNotifications {
    getAllNotifications {
      id
      type
      title
      message
      recipient
      status
      priority
      relatedId
      targetUrl
      isRead
      createdAt
      updatedAt
    }
  }
`;

// 상태별 알림 조회
export const GET_NOTIFICATIONS_BY_STATUS = gql`
  query GetNotificationsByStatus($status: NotificationStatus!) {
    getNotificationsByStatus(status: $status) {
      id
      type
      title
      message
      recipient
      status
      priority
      relatedId
      targetUrl
      isRead
      createdAt
      updatedAt
    }
  }
`;

// 페이지네이션을 지원하는 알림 조회 (NotificationCenterEnhanced에서 사용)
export const GET_NOTIFICATIONS = gql`
  query GetNotifications($userId: String!, $limit: Int, $offset: Int) {
    getNotificationsByUser(userId: $userId) {
      id
      type
      title
      message
      recipient
      status
      priority
      relatedId
      targetUrl
      isRead
      createdAt
      updatedAt
    }
  }
`;

// 페이지네이션을 지원하는 새로운 알림 조회
export const GET_NOTIFICATIONS_PAGINATED = gql`
  query GetNotificationsPaginated($userId: String!, $first: Int = 10, $after: String, $filter: String) {
    getNotificationsPaginated(userId: $userId, first: $first, after: $after, filter: $filter) {
      notifications {
        id
        type
        title
        message
        recipient
        status
        priority
        relatedId
        targetUrl
        isRead
        createdAt
        updatedAt
      }
      hasNextPage
      hasPreviousPage
      totalCount
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;
