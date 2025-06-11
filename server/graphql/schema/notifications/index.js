
const { gql } = require("graphql-tag");

const notificationsTypeDefs = gql`
  extend type Query {
    getNotifications: [Notification!]!
    getUnreadNotifications: [Notification!]!
  }

  extend type Mutation {
    createNotification(input: NotificationInput!): Notification!
    markNotificationRead(id: ID!): Notification!
    markAllNotificationsRead: SuccessResponse!
    deleteNotification(id: ID!): SuccessResponse!
  }
`;

module.exports = notificationsTypeDefs;
