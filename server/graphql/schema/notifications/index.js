const { gql } = require("graphql-tag");

const notificationsTypeDefs = gql`
  extend type Query {
    getAllNotifications: [Notification!]!
    getNotificationsByUser(userId: String!): [Notification!]!
    getNotificationsByStatus(status: NotificationStatus!): [Notification!]!
    getUnreadNotificationsCount(userId: String!): Int!
    getNotificationsPaginated(
      userId: String!
      first: Int = 10
      after: String
      filter: String
    ): NotificationConnection!
  }

  extend type Mutation {
    sendNotification(input: NotificationInput!): Notification!
    markNotificationAsRead(
      input: MarkNotificationReadInput!
    ): NotificationResponse!
    deleteNotification(id: ID!): NotificationResponse!
    bulkNotificationAction(
      input: BulkNotificationActionInput!
    ): BulkNotificationResponse!
    markAllNotificationsAsRead(userId: String!): BulkNotificationResponse!
    deleteAllNotifications(userId: String!): BulkNotificationResponse!
  }
`;

module.exports = notificationsTypeDefs;
