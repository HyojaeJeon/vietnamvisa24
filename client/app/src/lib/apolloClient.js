// apolloClient.js with token refresh capability

import { ApolloClient, InMemoryCache, createHttpLink, from } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { RetryLink } from "@apollo/client/link/retry";
import { Observable } from "@apollo/client/utilities";
import { store } from "../store";
import { logout, updateTokens } from "../store/authSlice";

// GraphQL mutations for token refresh
import { gql } from "@apollo/client";

const REFRESH_TOKEN_MUTATION = gql`
  mutation RefreshToken($refreshToken: String) {
    refreshToken(refreshToken: $refreshToken) {
      token
      refreshToken
    }
  }
`;

const REFRESH_ADMIN_TOKEN_MUTATION = gql`
  mutation RefreshAdminToken($refreshToken: String) {
    refreshAdminToken(refreshToken: $refreshToken) {
      token
      refreshToken
    }
  }
`;

// ----------------------------------------------------------------------
// 개발 환경에서는 직접 서버 URL 사용 (CORS 문제 해결을 위해)
const GRAPHQL_ENDPOINT = "http://localhost:5001/graphql";

console.log("🔧 Apollo Client - GraphQL Endpoint:", GRAPHQL_ENDPOINT);

// HTTP Link
const httpLink = createHttpLink({
  uri: GRAPHQL_ENDPOINT,
  credentials: "include",
  fetch: (uri, options) => {
    console.log("🚀 GraphQL Request:", uri, options);
    return fetch(uri, options);
  },
});

// 토큰 저장/조회 유틸리티
const tokenManager = {
  getToken: () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  },

  getRefreshToken: () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("refreshToken");
  },

  getAdminToken: () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("adminToken");
  },

  getAdminRefreshToken: () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("adminRefreshToken");
  },

  setTokens: (token, refreshToken) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }
    }
  },

  setAdminTokens: (token, refreshToken) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("adminToken", token);
      if (refreshToken) {
        localStorage.setItem("adminRefreshToken", refreshToken);
      }
    }
  },

  clearTokens: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
    }
  },

  clearAdminTokens: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminRefreshToken");
    }
  },
};

// Token refresh function
const refreshTokensAsync = async (isAdmin = false) => {
  const refreshToken = isAdmin
    ? tokenManager.getAdminRefreshToken()
    : tokenManager.getRefreshToken();

  const variables = refreshToken ? { refreshToken } : {};

  try {
    const mutation = isAdmin ? REFRESH_ADMIN_TOKEN_MUTATION : REFRESH_TOKEN_MUTATION;

    console.log(`🔄 Attempting to refresh ${isAdmin ? "admin" : "user"} token...`);

    // Use fetch instead of Apollo Client to avoid circular dependencies
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: mutation.loc.source.body,
        variables,
      }),
    });

    const result = await response.json();

    if (result.errors) {
      console.error("🚨 Refresh token mutation errors:", result.errors);
      throw new Error(result.errors[0]?.message || "Token refresh failed");
    }

    const data = result.data?.refreshToken || result.data?.refreshAdminToken;

    if (data?.token) {
      if (isAdmin) {
        tokenManager.setAdminTokens(data.token, data.refreshToken);
      } else {
        tokenManager.setTokens(data.token, data.refreshToken);
      }

      // Update Redux store
      store.dispatch(
        updateTokens({ token: data.token, refreshToken: data.refreshToken })
      );

      console.log(`✅ ${isAdmin ? "admin" : "user"} token refreshed successfully!`);
      return data.token;
    }

    throw new Error("Failed to refresh token - no token in response");
  } catch (error) {
    console.error(`❌ Token refresh failed:`, error);

    // Clear tokens and redirect to login
    if (isAdmin) {
      tokenManager.clearAdminTokens();
    } else {
      tokenManager.clearTokens();
    }

    store.dispatch(logout());

    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }

    throw error;
  }
};

// Auth Link with current token
const authLink = setContext((_, { headers }) => {
  const token = tokenManager.getToken();
  const adminToken = tokenManager.getAdminToken();

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
      "admin-token": adminToken ? adminToken : "",
    },
  };
});

// Error Link with token refresh logic
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    for (let err of graphQLErrors) {
      console.error("🚨 GraphQL error:", err);

      // Check for token expiration
      if (err.message === "Token has expired" || err.extensions?.code === "UNAUTHENTICATED" || err.extensions?.code === "TOKEN_EXPIRED") {
        console.log("🔄 Token expired, attempting refresh...");

        // Determine if this is an admin request
        const context = operation.getContext();
        const isAdminRequest = context.headers?.["admin-token"] || operation.operationName?.includes("Admin") || operation.operationName?.includes("getAdminMe");

        console.log(`🔍 Detected ${isAdminRequest ? "admin" : "user"} request: ${operation.operationName}`);

        // Return Observable that handles token refresh
        return new Observable((observer) => {
          refreshTokensAsync(isAdminRequest)
            .then((newToken) => {
              // Update the operation's context with new token
              const oldHeaders = operation.getContext().headers;
              operation.setContext({
                headers: {
                  ...oldHeaders,
                  ...(isAdminRequest ? { "admin-token": newToken } : { authorization: `Bearer ${newToken}` }),
                },
              });

              console.log("✅ Token refreshed, retrying original request");

              // Retry the operation and subscribe to it
              const subscription = forward(operation).subscribe({
                next: observer.next.bind(observer),
                error: observer.error.bind(observer),
                complete: observer.complete.bind(observer),
              });

              return () => subscription.unsubscribe();
            })
            .catch((refreshError) => {
              console.error("❌ Token refresh failed:", refreshError);
              observer.error(refreshError);
            });
        });
      }
    }
  }

  if (networkError) {
    console.error("🚨 Network error:", networkError);
  }
});

// Retry Link for network errors
const retryLink = new RetryLink({
  delay: {
    initial: 300,
    max: Infinity,
    jitter: true,
  },
  attempts: {
    max: 3,
    retryIf: (error, _operation) => !!error,
  },
});

// Create Apollo Client
export const apolloClient = new ApolloClient({
  link: from([errorLink, retryLink, authLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          // Add cache policies if needed
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      errorPolicy: "all",
    },
    query: {
      errorPolicy: "all",
    },
    mutate: {
      errorPolicy: "all",
    },
  },
  ssrMode: typeof window === "undefined",
});

// Apollo Client를 전역에서 접근할 수 있도록 설정
if (typeof window !== "undefined") {
  window.__APOLLO_CLIENT__ = apolloClient;
  window.__TOKEN_MANAGER__ = tokenManager;
}

// Export token manager for use in other components
export { tokenManager };
export default apolloClient;
