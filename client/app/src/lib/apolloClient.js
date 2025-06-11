import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  from,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import errorLink from "../apollo/errorLink";

// Next.js의 rewrites를 통해 /graphql 경로로 요청
const httpLink = createHttpLink({
  uri: typeof window === 'undefined' 
    ? 'http://0.0.0.0:5000/graphql'
    : process.env.NODE_ENV === 'production' 
      ? 'https://your-production-graphql-endpoint.com/graphql'
      : 'http://localhost:5000/graphql',
  credentials: "include",
});

// 현재 토큰을 가져오는 함수

// 현재 토큰을 가져오는 함수
const getCurrentToken = () => {
  if (typeof window === 'undefined') return null;

  let token = localStorage.getItem("token");

  // Redux store에서도 토큰 확인
  try {
    if (window.__REDUX_STORE__) {
      const state = window.__REDUX_STORE__.getState();
      if (state.auth?.token && !token) {
        token = state.auth.token;
      }
    }
  } catch (error) {
    console.error('Error reading Redux state:', error);
  }

  return token;
};

// 인증 링크
const authLink = setContext((_, { headers }) => {
  const token = getCurrentToken();
  const adminToken = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
      'admin-token': adminToken ? adminToken : "",
    },
  };
});

// 에러 처리는 별도 모듈에서 관리

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
  ssrMode: typeof window === 'undefined',
});

// Apollo Client를 전역에서 접근할 수 있도록 설정
if (typeof window !== 'undefined') {
  window.__APOLLO_CLIENT__ = apolloClient;
}

export { apolloClient };
export default apolloClient;