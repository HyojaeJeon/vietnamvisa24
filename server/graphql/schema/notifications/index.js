
const { gql } = require("graphql-tag");

const notificationsTypeDefs = gql`
  extend type Query {
    getAllNotifications: [Notification!]!
    getNotificationsByUser(userId: String!): [Notification!]!
    getNotificationsByStatus(status: NotificationStatus!): [Notification!]!
  }

  extend type Mutation {
    sendNotification(input: NotificationInput!): Notification!
    adminMarkNotificationAsRead(id: ID!): Notification!
    deleteNotification(id: ID!): SuccessResponse!
  }
`;

module.exports = notificationsTypeDefs;
