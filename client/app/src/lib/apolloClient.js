// apolloClient.js with token refresh capability

import { ApolloClient, InMemoryCache, from } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { RetryLink } from "@apollo/client/link/retry";
import { Observable } from "@apollo/client/utilities";
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";
import { store } from "../store";
import { logout, updateTokens } from "../store/authSlice";

const uploadLink = createUploadLink({
  uri: "/graphql",
  credentials: "include",
  headers: {
    "Apollo-Require-Preflight": "true",
  },
  fetch: (uri, options) => {
    if (options.headers) {
      options.headers["Apollo-Require-Preflight"] = "true";
    }
    console.log("🚀 GraphQL Request:", uri, options);
    return fetch(uri, options);
  },
});

// accessToken 갱신 함수: cookie에 담긴 HttpOnly refreshToken 이용
async function refreshTokensAsync() {
  try {
    console.log("🔄 Starting token refresh...");

    const response = await fetch("/graphql", {
      method: "POST",
      credentials: "include", // HttpOnly refreshToken 쿠키 전송
      headers: {
        "Content-Type": "application/json",
        "Apollo-Require-Preflight": "true",
      },
      body: JSON.stringify({
        query: `
          mutation RefreshToken {
            refreshToken {
              accessToken
              refreshToken
            }
          }
        `,
      }),
    });

    console.log("🔍 Refresh response status:", response.status);

    if (!response.ok) {
      console.log(
        "❌ Refresh response not ok:",
        response.status,
        response.statusText,
      );
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    console.log("🔍 Refresh response result:", result);

    if (result.errors && result.errors.length > 0) {
      console.log("❌ GraphQL errors in refresh:", result.errors);
      throw new Error(result.errors[0]?.message || "Token refresh failed");
    }

    if (!result.data || !result.data.refreshToken) {
      console.log("❌ No refresh token data in response");
      throw new Error("No token data in response");
    }

    const { accessToken } = result.data.refreshToken;

    if (!accessToken) {
      console.log("❌ No access token in response");
      throw new Error("No access token received");
    }

    console.log("✅ Token refresh successful");

    // Redux store에 새 accessToken만 저장 (refreshToken은 HttpOnly 쿠키로 관리)
    store.dispatch(updateTokens({ accessToken }));

    // localStorage에도 저장 (fallback용)
    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", accessToken);
    }

    return accessToken;
  } catch (err) {
    console.error("❌ Token refresh failed:", err);

    // refresh 실패 시 저장된 토큰들 정리
    store.dispatch(logout());

    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      // 로그인 페이지로 리다이렉트
      // window.location.replace("/login");
    }

    throw err;
  }
}

// Authorization 헤더 설정 (accessToken + admin-token)
const authLink = setContext((_, { headers }) => {
  const accessToken =
    store.getState().auth.accessToken ||
    (typeof window !== "undefined"
      ? localStorage.getItem("accessToken")
      : null);
  const adminToken =
    typeof window !== "undefined"
      ? localStorage.getItem("adminAccessToken")
      : null;

  console.log("🔐 Setting Authorization header with tokens:", {
    accessToken: accessToken ? "✅ Found" : "❌ Missing",
    adminToken: adminToken ? "✅ Found" : "❌ Missing",
    accessTokenPrefix: accessToken
      ? accessToken.substring(0, 20) + "..."
      : "none",
  });

  return {
    headers: {
      ...headers,
      Authorization: accessToken ? `Bearer ${accessToken}` : "",
      "admin-token": adminToken || "",
    },
  };
});

// 에러 처리 링크: 토큰 만료 시 refresh -> 재시도, 실패 시 로그아웃
const errorLink = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    console.log("🔍 Apollo Error Link triggered");
    console.log("🔍 GraphQL Errors:", graphQLErrors);
    console.log("🔍 Network Error:", networkError);
    // 토큰 만료 또는 인증 오류 확인
    // const isTokenError = graphQLErrors?.some((error) => {
    //   const errorCode = error.extensions?.code;
    //   const errorMessage = error.message?.toLowerCase() || "";

    //   console.log("🔍 Checking error:", {
    //     errorCode,
    //     errorMessage: error.message,
    //     extensions: error.extensions,
    //   });

    //   // 다양한 토큰 관련 에러 조건들
    //   const tokenErrorCodes = [
    //     "TOKEN_EXPIRED",
    //     "UNAUTHENTICATED",
    //     "UNAUTHORIZED",
    //   ];

    //   const tokenErrorMessages = [
    //     "token has expired",
    //     "토큰이 만료되었습니다",
    //     "token expired",
    //     "unauthorized",
    //     "인증이 필요합니다",
    //     "invalid token",
    //     "jwt expired",
    //     "authentication required",
    //   ];

    //   const hasTokenErrorCode = tokenErrorCodes.includes(errorCode);
    //   const hasTokenErrorMessage = tokenErrorMessages.some((msg) =>
    //     errorMessage.includes(msg.toLowerCase()),
    //   );

    //   const isTokenRelatedError = hasTokenErrorCode || hasTokenErrorMessage;

    //   console.log("🔍 Token error analysis:", {
    //     hasTokenErrorCode,
    //     hasTokenErrorMessage,
    //     isTokenRelatedError,
    //     matchedMessage: tokenErrorMessages.find((msg) =>
    //       errorMessage.includes(msg.toLowerCase()),
    //     ),
    //   });

    //   return isTokenRelatedError;
    // });
    // if (isTokenError) {
    //   console.log("🔄 Token error detected, attempting refresh...");

    //   return new Observable((observer) => {
    //     토큰 갱신 시도
    //     refreshTokensAsync()
    //       .then((newAccessToken) => {
    //         console.log(
    //           "✅ Token refreshed successfully, retrying operation...",
    //         );
    //         // 새 토큰으로 헤더 업데이트 후 요청 재전송
    //         operation.setContext(({ headers = {} }) => ({
    //           headers: {
    //             ...headers,
    //             Authorization: `Bearer ${newAccessToken}`,
    //           },
    //         }));
    //         // 재시도
    //         const subscription = forward(operation).subscribe({
    //           next: (result) => {
    //             console.log("✅ Retry operation successful");
    //             observer.next(result);
    //           },
    //           error: (error) => {
    //             console.log("❌ Retry operation failed:", error);
    //             // 재시도 후에도 토큰 에러가 발생하면 로그아웃 처리
    //             const retryIsTokenError = error.graphQLErrors?.some((err) => {
    //               const code = err.extensions?.code;
    //               return code === "TOKEN_EXPIRED" || code === "UNAUTHENTICATED";
    //             });
    //             if (retryIsTokenError) {
    //               console.log(
    //                 "❌ Token error persists after refresh, forcing logout",
    //               );
    //               store.dispatch(logout());
    //               if (typeof window !== "undefined") {
    //                 localStorage.removeItem("accessToken");
    //                 // window.location.replace("/login");
    //               }
    //             }
    //             observer.error(error);
    //           },
    //           complete: observer.complete.bind(observer),
    //         });
    //         return () => subscription.unsubscribe();
    //       })
    //       .catch((refreshError) => {
    //         console.error(
    //           "❌ Token refresh failed, redirecting to login:",
    //           refreshError,
    //         );
    //         // 토큰 재발급 실패 시 로그아웃 처리
    //         store.dispatch(logout());
    //         if (typeof window !== "undefined") {
    //           localStorage.removeItem("accessToken");
    //           // 사용자에게 알림 후 로그인 페이지로 이동
    //           setTimeout(() => {
    //             // alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
    //             // window.location.replace("/login");
    //           }, 100);
    //         }
    //         observer.error(refreshError);
    //       });
    //   });
    // }

    // 네트워크 오류 로깅
    if (networkError) {
      console.error("🌐 Network error:", networkError);
    }
  },
);

// 재시도 링크 (네트워크 오류 등)
const retryLink = new RetryLink({
  delay: { initial: 300, max: Infinity, jitter: true },
  attempts: { max: 3, retryIf: (error) => !!error },
});

// 최종 Apollo Client 인스턴스
export const apolloClient = new ApolloClient({
  link: from([errorLink, retryLink, authLink, uploadLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: { errorPolicy: "all" },
    query: { errorPolicy: "all" },
    mutate: { errorPolicy: "all" },
  },
  ssrMode: typeof window === "undefined",
});

if (typeof window !== "undefined") {
  window.__APOLLO_CLIENT__ = apolloClient;

  // 개발 모드에서 토큰 재발급 테스트 함수들을 전역에 노출
  if (process.env.NODE_ENV === "development") {
    window.__TEST_TOKEN_REFRESH__ = async () => {
      console.log("🔄 Testing token refresh manually...");
      try {
        const newToken = await refreshTokensAsync();
        console.log(
          "✅ Manual token refresh successful:",
          newToken.substring(0, 20) + "...",
        );
        return newToken;
      } catch (error) {
        console.error("❌ Manual token refresh failed:", error);
        throw error;
      }
    };

    window.__SIMULATE_TOKEN_EXPIRY__ = () => {
      console.log("🔄 Simulating token expiry...");
      const expiredToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTYwMDAwMDAwMCwiZXhwIjoxNjAwMDAwMDAwfQ.expired";
      store.dispatch(updateTokens({ accessToken: expiredToken }));
      localStorage.setItem("accessToken", expiredToken);
      console.log(
        "✅ Token set to expired. Next GraphQL request should trigger auto-refresh.",
      );
    };

    console.log("🔧 Token refresh test functions available:");
    console.log(
      "  - window.__TEST_TOKEN_REFRESH__() - manually test token refresh",
    );
    console.log(
      "  - window.__SIMULATE_TOKEN_EXPIRY__() - set expired token to trigger auto-refresh",
    );
  }
}

export default apolloClient;
