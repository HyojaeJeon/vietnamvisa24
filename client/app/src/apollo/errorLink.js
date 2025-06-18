import { onError } from "@apollo/client/link/error";
import { fromPromise } from "@apollo/client/link/utils";
import { handleGraphQLErrors, isAuthError } from "./handlers/graphqlErrorHandler";
import { handleNetworkError } from "./handlers/networkErrorHandler";

// 토큰 갱신 함수
const refreshTokens = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  try {
    const response = await fetch("/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          mutation RefreshToken($refreshToken: String!) {
            refreshToken(refreshToken: $refreshToken) {
              token
              refreshToken
            }
          }
        `,
        variables: { refreshToken },
      }),
    });

    const result = await response.json();

    if (result.errors) {
      throw new Error(result.errors[0].message);
    }
    const { accessToken, refreshToken: newRefreshToken } = result.data.refreshToken;

    // 새 토큰 저장
    localStorage.setItem("accessToken", accessToken);
    if (newRefreshToken) {
      localStorage.setItem("refreshToken", newRefreshToken);
    }

    // Redux store 업데이트
    if (typeof window !== "undefined" && window.__REDUX_STORE__) {
      window.__REDUX_STORE__.dispatch({
        type: "auth/updateTokens",
        payload: { accessToken, refreshToken: newRefreshToken },
      });
    }

    return accessToken;
  } catch (error) {
    // Refresh 실패 시 로그아웃 처리
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("token"); // 기존 키도 제거
    localStorage.removeItem("user");
    localStorage.removeItem("autoLoginEmail");
    localStorage.removeItem("autoLoginPassword");
    localStorage.removeItem("autoLoginEnabled");

    if (typeof window !== "undefined" && window.__REDUX_STORE__) {
      window.__REDUX_STORE__.dispatch({ type: "auth/logout" });
    }

    // 로그인 페이지로 리디렉션
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }

    throw error;
  }
};

const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  // GraphQL 에러 처리
  if (graphQLErrors) {
    // 인증 에러인 경우 토큰 갱신 시도
    if (isAuthError(graphQLErrors)) {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        return fromPromise(
          refreshTokens().catch((error) => {
            console.error("Token refresh failed:", error);
            return Promise.reject(error);
          })
        )
          .filter((value) => Boolean(value))
          .flatMap((newToken) => {
            // 새 토큰으로 헤더 업데이트
            const oldHeaders = operation.getContext().headers;
            operation.setContext({
              headers: {
                ...oldHeaders,
                authorization: `Bearer ${newToken}`,
              },
            });
            // 원래 요청 재시도
            return forward(operation);
          });
      } else {
        // refresh token이 없으면 로그아웃
        handleGraphQLErrors(graphQLErrors);
        return;
      }
    } else {
      // 일반적인 GraphQL 에러 처리
      handleGraphQLErrors(graphQLErrors);
    }
  }

  // 네트워크 에러 처리
  if (networkError) {
    handleNetworkError(networkError);
  }
});

export default errorLink;
