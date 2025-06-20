const { ApolloServer } = require("apollo-server-express");
const { gql } = require("apollo-server-express");
const models = require("../models");
const typeDefs = require("../graphql/schema");
const resolvers = require("../graphql/resolvers");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({
    models,
    user: req.user,
  }),
});

async function testNotificationQuery() {
  try {
    console.log("🧪 GraphQL 알림 쿼리 테스트...\n");

    // 먼저 데이터베이스에서 직접 확인
    const allNotifications = await models.Notification.findAll({
      attributes: ["id", "title", "recipient", "status"],
      limit: 5,
      order: [["id", "DESC"]],
    });

    console.log("📋 데이터베이스 직접 조회:");
    allNotifications.forEach((n) => {
      console.log(
        `ID: ${n.id}, Recipient: ${n.recipient}, Status: ${n.status}`,
      );
    });

    // GraphQL 쿼리 테스트
    const GET_NOTIFICATIONS_PAGINATED = gql`
      query GetNotificationsPaginated(
        $userId: String!
        $first: Int
        $after: String
        $filter: String
      ) {
        getNotificationsPaginated(
          userId: $userId
          first: $first
          after: $after
          filter: $filter
        ) {
          notifications {
            id
            title
            message
            status
            type
            priority
            recipient
            createdAt
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

    // 여러 userId로 테스트
    const testUserIds = ["1", "2", "admin", "user1"];

    for (const userId of testUserIds) {
      console.log(`\n🔍 userId="${userId}"로 테스트:`);

      try {
        const result = await server.executeOperation({
          query: GET_NOTIFICATIONS_PAGINATED,
          variables: {
            userId: userId,
            first: 10,
            filter: null,
          },
        });

        if (result.errors) {
          console.log("❌ GraphQL 오류:", result.errors);
        } else {
          const data = result.data.getNotificationsPaginated;
          console.log(
            `✅ 결과: ${data.notifications.length}개 알림, 총 ${data.totalCount}개`,
          );
          if (data.notifications.length > 0) {
            console.log(`   첫 번째 알림: ${data.notifications[0].title}`);
          }
        }
      } catch (error) {
        console.log(`❌ userId="${userId}" 테스트 실패:`, error.message);
      }
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ 테스트 오류:", error);
    process.exit(1);
  }
}

testNotificationQuery();
