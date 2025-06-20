const { ApolloServer } = require("apollo-server-express");
const { ApolloClient, InMemoryCache, gql } = require("@apollo/client/core");
const { HttpLink } = require("@apollo/client/link/http");
const fetch = require("node-fetch");

// GraphQL 페이지네이션 테스트
const TEST_PAGINATION_QUERY = gql`
  query TestPagination($userId: String!, $first: Int, $after: String) {
    getNotificationsPaginated(userId: $userId, first: $first, after: $after) {
      notifications {
        id
        type
        title
        message
        status
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

async function testGraphQLPagination() {
  console.log("🔥 GraphQL 페이지네이션 테스트 시작...\n");

  // Apollo Client 설정
  const client = new ApolloClient({
    link: new HttpLink({
      uri: "http://localhost:4000/graphql",
      fetch: fetch,
    }),
    cache: new InMemoryCache(),
  });

  try {
    // 1️⃣ 첫 번째 페이지 조회 (5개 제한)
    console.log("1️⃣ 첫 번째 페이지 조회 (5개 제한)");
    const firstPageResult = await client.query({
      query: TEST_PAGINATION_QUERY,
      variables: {
        userId: "admin@example.com",
        first: 5,
      },
    });

    const firstPage = firstPageResult.data.getNotificationsPaginated;
    console.log(`✅ 첫 번째 페이지: ${firstPage.notifications.length}개 조회`);
    console.log(`   총 개수: ${firstPage.totalCount}`);
    console.log(`   다음 페이지 있음: ${firstPage.hasNextPage}`);
    console.log(`   EndCursor: ${firstPage.pageInfo.endCursor}\n`);

    if (firstPage.hasNextPage) {
      // 2️⃣ 두 번째 페이지 조회
      console.log("2️⃣ 두 번째 페이지 조회");
      const secondPageResult = await client.query({
        query: TEST_PAGINATION_QUERY,
        variables: {
          userId: "admin@example.com",
          first: 3,
          after: firstPage.pageInfo.endCursor,
        },
      });

      const secondPage = secondPageResult.data.getNotificationsPaginated;
      console.log(`✅ 두 번째 페이지: ${secondPage.notifications.length}개 조회`);
      console.log(`   다음 페이지 있음: ${secondPage.hasNextPage}`);
      console.log(`   EndCursor: ${secondPage.pageInfo.endCursor}\n`);
    }

    // 3️⃣ 필터링 테스트 (읽지 않은 알림만)
    console.log("3️⃣ 필터링 테스트 (읽지 않은 알림만)");
    const unreadResult = await client.query({
      query: gql`
        query TestUnreadFilter($userId: String!, $first: Int, $filter: String) {
          getNotificationsPaginated(userId: $userId, first: $first, filter: $filter) {
            notifications {
              id
              title
              status
            }
            totalCount
            hasNextPage
          }
        }
      `,
      variables: {
        userId: "admin@example.com",
        first: 10,
        filter: "unread",
      },
    });

    const unreadPage = unreadResult.data.getNotificationsPaginated;
    console.log(`✅ 읽지 않은 알림: ${unreadPage.notifications.length}개`);
    console.log(`   총 읽지 않은 알림: ${unreadPage.totalCount}개\n`);

    console.log("🎉 GraphQL 페이지네이션 테스트 완료!");

  } catch (error) {
    console.error("❌ GraphQL 테스트 실패:", error.message);
    if (error.networkError) {
      console.error("   네트워크 오류:", error.networkError.message);
    }
    if (error.graphQLErrors) {
      console.error("   GraphQL 오류:", error.graphQLErrors);
    }
  }
}

// 서버가 실행 중인지 확인 후 테스트 실행
async function checkServerAndTest() {
  try {
    const response = await fetch("http://localhost:4000/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: "query { __typename }" }),
    });

    if (response.ok) {
      await testGraphQLPagination();
    } else {
      console.log("❌ GraphQL 서버가 실행되지 않았습니다.");
      console.log("   서버를 먼저 시작해주세요: npm run dev");
    }
  } catch (error) {
    console.log("❌ GraphQL 서버에 연결할 수 없습니다.");
    console.log("   서버를 먼저 시작해주세요: npm run dev");
  }
}

checkServerAndTest();
