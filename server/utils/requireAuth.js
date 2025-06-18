const { GraphQLError } = require("graphql");
const { getUserFromToken } = require("./auth");

/**
 * 인증 유틸 함수 - context에서 토큰을 추출해 사용자 인증 및 권한 체크
 * @param {Object} context - GraphQL context 객체
 * @param {string|Array<string>} requiredRoles - 필요한 권한(들). 배열로 전달하면 OR 조건
 * @returns {Object} 인증된 사용자 객체
 */
const requireAuth = async (context, requiredRoles = null) => {
  const accessToken =
    context?.token ||
    context?.accessToken ||
    context?.authorization ||
    context?.headers?.authorization;

  console.log("🔍 requireAuth - checking token:", {
    hasToken: !!accessToken,
    tokenPrefix: accessToken ? accessToken.substring(0, 20) + "..." : "null",
    contextKeys: Object.keys(context || {}),
    requiredRoles,
    hasRefreshToken: !!context?.refreshToken,
  });

  try {
    const user = await getUserFromToken(accessToken);
    if (!user) {
      console.log("❌ requireAuth - user not found from token");
      throw new GraphQLError("인증이 필요합니다.", {
        extensions: { code: "UNAUTHENTICATED" },
      });
    }

    // 권한 체크
    if (requiredRoles) {
      const rolesArray = Array.isArray(requiredRoles)
        ? requiredRoles
        : [requiredRoles];
      const userRole = user.role || "USER";

      if (!rolesArray.includes(userRole)) {
        console.log(
          `❌ Access denied - User role: ${userRole}, Required: ${rolesArray.join(", ")}`,
        );
        throw new GraphQLError("권한이 없습니다.", {
          extensions: { code: "FORBIDDEN" },
        });
      }

      console.log(`✅ Role check passed - User role: ${userRole}`);
    }

    console.log(
      "✅ requireAuth - user authenticated:",
      user.email,
      "ID:",
      user.id,
    );
    return user;
  } catch (error) {
    console.log(
      "❌ requireAuth error:",
      error.constructor.name,
      error.errorCode,
      error.message,
    );

    // GraphQLError는 그대로 전달
    if (error instanceof GraphQLError) {
      throw error;
    }

    // TokenExpiredError를 GraphQL 에러로 변환
    if (
      error.errorCode === "TOKEN_EXPIRED" ||
      error.constructor.name === "TokenExpiredError"
    ) {
      throw new GraphQLError("토큰이 만료되었습니다.", {
        extensions: { code: "TOKEN_EXPIRED" },
      });
    }
    // AuthenticationError를 GraphQL 에러로 변환
    if (
      error.errorCode === "UNAUTHENTICATED" ||
      error.constructor.name === "AuthenticationError"
    ) {
      throw new GraphQLError("인증이 필요합니다.", {
        extensions: { code: "UNAUTHENTICATED" },
      });
    }
    // 기타 에러
    console.log("Unhandled auth error:", error);
    throw new GraphQLError("인증 처리 중 오류가 발생했습니다.", {
      extensions: { code: "INTERNAL_SERVER_ERROR" },
    });
  }
};

module.exports = { requireAuth };
