const { getUserFromToken } = require("../utils/auth");

/**
 * 인증 미들웨어 - Express 라우트에서 사용
 * Authorization 헤더에서 토큰을 추출하고 사용자 인증
 */
const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        error: "인증이 필요합니다.",
        code: "UNAUTHENTICATED",
      });
    }

    const token = authHeader.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({
        error: "토큰이 제공되지 않았습니다.",
        code: "UNAUTHENTICATED",
      });
    }

    // 토큰에서 사용자 정보 추출
    const user = await getUserFromToken(token);
    if (!user) {
      return res.status(401).json({
        error: "유효하지 않은 토큰입니다.",
        code: "UNAUTHENTICATED",
      });
    }

    // req 객체에 사용자 정보 추가
    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        error: "토큰이 만료되었습니다.",
        code: "TOKEN_EXPIRED",
      });
    }

    return res.status(401).json({
      error: "인증 실패",
      code: "UNAUTHENTICATED",
    });
  }
};

/**
 * 선택적 인증 미들웨어 - 토큰이 있으면 인증하고, 없으면 req.user를 null로 설정
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      req.user = null;
      return next();
    }

    const token = authHeader.replace("Bearer ", "");
    if (!token) {
      req.user = null;
      return next();
    }

    // 토큰에서 사용자 정보 추출
    const user = await getUserFromToken(token);
    req.user = user || null;
    next();
  } catch (error) {
    console.error("Optional auth middleware error:", error);
    req.user = null;
    next();
  }
};

module.exports = {
  requireAuth,
  optionalAuth,
};
