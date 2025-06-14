const jwt = require("jsonwebtoken");
const { models } = require("../database");
const { AuthenticationError, TokenExpiredError } = require("./errorTypes");

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "your-refresh-secret-key";

/**
 * JWT 토큰 생성 (사용자용)
 */
const generateTokens = (user) => {
  const accessToken = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: "30s" }); // 테스트용으로 30초

  const refreshToken = jwt.sign({ userId: user.id, email: user.email, tokenVersion: user.tokenVersion || 0 }, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

  return { accessToken, refreshToken };
};

/**
 * JWT 토큰 생성 (관리자용)
 */
const generateAdminTokens = (admin) => {
  const accessToken = jwt.sign({ adminId: admin.id, email: admin.email, role: admin.role }, JWT_SECRET, { expiresIn: "30s" }); // 테스트용으로 30초

  const refreshToken = jwt.sign({ adminId: admin.id, email: admin.email, role: admin.role, tokenVersion: admin.tokenVersion || 0 }, REFRESH_TOKEN_SECRET, { expiresIn: "24h" });

  return { accessToken, refreshToken };
};

/**
 * 토큰에서 사용자 정보 추출
 */
const getUserFromToken = async (token) => {
  if (!token) {
    throw new AuthenticationError();
  }

  try {
    const cleanToken = token.replace("Bearer ", "");
    const decoded = jwt.verify(cleanToken, JWT_SECRET);

    const user = await models.User.findByPk(decoded.userId);
    if (!user) {
      throw new AuthenticationError("User not found");
    }

    return user;
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new TokenExpiredError();
    }
    if (error.name === "JsonWebTokenError") {
      throw new AuthenticationError("Invalid token");
    }
    throw error;
  }
};

/**
 * 관리자 토큰에서 사용자 정보 추출
 */
const getAdminFromToken = async (token) => {
  if (!token) {
    throw new AuthenticationError();
  }

  try {
    const cleanToken = token.replace("Bearer ", "");
    const decoded = jwt.verify(cleanToken, JWT_SECRET);

    const admin = await models.Admin.findOne({
      where: { id: decoded.adminId, is_active: true },
    });

    if (!admin) {
      throw new AuthenticationError("Admin not found");
    }

    return admin;
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new TokenExpiredError();
    }
    if (error.name === "JsonWebTokenError") {
      throw new AuthenticationError("Invalid token");
    }
    throw error;
  }
};

/**
 * 토큰 갱신 (사용자용)
 */
const refreshTokens = async (refreshToken) => {
  if (!refreshToken) {
    throw new AuthenticationError("Refresh token required");
  }

  try {
    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
    const user = await models.User.findByPk(decoded.userId);

    if (!user) {
      throw new AuthenticationError("User not found");
    }

    // Check token version (optional security feature)
    if (decoded.tokenVersion !== (user.tokenVersion || 0)) {
      throw new AuthenticationError("Invalid refresh token");
    }

    return generateTokens(user);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new AuthenticationError("Refresh token expired");
    }
    if (error.name === "JsonWebTokenError") {
      throw new AuthenticationError("Invalid refresh token");
    }
    throw error;
  }
};

/**
 * 관리자 토큰 갱신
 */
const refreshAdminTokens = async (refreshToken) => {
  if (!refreshToken) {
    throw new AuthenticationError("Refresh token required");
  }

  try {
    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
    const admin = await models.Admin.findOne({
      where: { id: decoded.adminId, is_active: true },
    });

    if (!admin) {
      throw new AuthenticationError("Admin not found");
    }

    // Check token version (optional security feature)
    if (decoded.tokenVersion !== (admin.tokenVersion || 0)) {
      throw new AuthenticationError("Invalid refresh token");
    }

    return generateAdminTokens(admin);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new AuthenticationError("Refresh token expired");
    }
    if (error.name === "JsonWebTokenError") {
      throw new AuthenticationError("Invalid refresh token");
    }
    throw error;
  }
};

module.exports = {
  generateTokens,
  generateAdminTokens,
  getUserFromToken,
  getAdminFromToken,
  refreshTokens,
  refreshAdminTokens,
};
