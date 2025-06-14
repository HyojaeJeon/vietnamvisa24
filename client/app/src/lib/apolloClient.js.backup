// apolloClient.js

import { ApolloClient, InMemoryCache, createHttpLink, from } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import errorLink from "../apollo/errorLink"; // 에러 처리 링크는 그대로 유지

// ----------------------------------------------------------------------
// 개발 환경에서는 직접 서버 URL 사용 (CORS 문제 해결을 위해)
const GRAPHQL_ENDPOINT = "http://localhost:5002/graphql";

console.log("🔧 Apollo Client - GraphQL Endpoint:", GRAPHQL_ENDPOINT);

const httpLink = createHttpLink({
  uri: GRAPHQL_ENDPOINT,
  credentials: "include",
  fetch: (uri, options) => {
    console.log("🚀 GraphQL Request:", uri, options);
    return fetch(uri, options);
  },
});
// ----------------------------------------------------------------------

// 현재 토큰을 가져오는 함수 (이전과 동일)
const getCurrentToken = () => {
  if (typeof window === "undefined") return null;

  let token = localStorage.getItem("token");

  try {
    if (window.__REDUX_STORE__) {
      const state = window.__REDUX_STORE__.getState();
      if (state.auth?.token && !token) {
        token = state.auth.token;
      }
    }
  } catch (error) {
    console.error("Error reading Redux state:", error);
  }

  return token;
};

// 인증 링크 (이전과 동일)
const authLink = setContext((_, { headers }) => {
  const token = getCurrentToken();
  const adminToken = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
      "admin-token": adminToken ? adminToken : "",
    },
  };
});

const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: "all",
    },
    query: {
      errorPolicy: "all",
    },
  },
  ssrMode: typeof window === "undefined",
});

// Apollo Client를 전역에서 접근할 수 있도록 설정 (이전과 동일)
if (typeof window !== "undefined") {
  window.__APOLLO_CLIENT__ = apolloClient;
}

export { apolloClient };
export default apolloClient;
