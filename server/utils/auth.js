const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { models } = require("../database");
const { AuthenticationError, TokenExpiredError } = require("./errorTypes");

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET || "your-refresh-secret-key";
const ACCESS_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN || "15m";
const REFRESH_EXPIRES_DAYS = parseInt(
  process.env.REFRESH_TOKEN_EXPIRES_DAYS || "7",
  10,
);

const createRefreshRecord = async (payload) => {
  const expiresAt = new Date(
    Date.now() + REFRESH_EXPIRES_DAYS * 24 * 60 * 60 * 1000,
  );
  const tokenId = uuidv4();
  const refreshToken = jwt.sign(
    { jti: tokenId, id: payload.id },
    REFRESH_TOKEN_SECRET,
    { expiresIn: `${REFRESH_EXPIRES_DAYS}d` },
  );
  // User 테이블에 refreshToken, refreshTokenExpires 저장
  await models.User.update(
    { refreshToken, refreshTokenExpires: expiresAt },
    { where: { id: payload.id } },
  );
  return { refreshToken, expiresAt };
};

const generateTokens = async (user) => {
  const accessToken = jwt.sign({ userId: user.id }, JWT_SECRET, {
    expiresIn: ACCESS_EXPIRES_IN,
  });
  const { refreshToken } = await createRefreshRecord({ id: user.id });
  return { accessToken, refreshToken };
};

const getUserFromToken = async (token) => {
  if (!token) {
    console.log("❌ No token provided");
    throw new AuthenticationError("토큰이 제공되지 않았습니다.");
  }

  try {
    const clean = token.replace("Bearer ", "");
    console.log("🔍 Verifying token:", clean.substring(0, 20) + "...");

    const decoded = jwt.verify(clean, JWT_SECRET);
    console.log("✅ Token verified, userId:", decoded.userId);

    const user = await models.User.findByPk(decoded.userId);
    if (!user) {
      console.log("❌ User not found for userId:", decoded.userId);
      throw new AuthenticationError("User not found");
    }

    console.log("✅ User found:", user.email);
    return user;
  } catch (err) {
    console.log("❌ Token verification failed:", err.name, err.message);

    if (err.name === "TokenExpiredError") {
      console.log("🔄 Token expired, should trigger refresh");
      throw new TokenExpiredError("토큰이 만료되었습니다.");
    }
    if (err.name === "JsonWebTokenError") {
      console.log("❌ Invalid token format");
      throw new AuthenticationError("잘못된 토큰 형식입니다.");
    }

    throw new AuthenticationError("Invalid token");
  }
};

const rotateToken = async (token) => {
  if (!token) {
    console.log("❌ No refresh token provided");
    throw new AuthenticationError("Refresh token required");
  }

  try {
    console.log("🔍 Verifying refresh token:", token.substring(0, 20) + "...");

    const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET);
    console.log("✅ Refresh token verified, userId:", decoded.id);

    const user = await models.User.findByPk(decoded.id);
    if (!user) {
      console.log("❌ User not found for refresh token userId:", decoded.id);
      throw new AuthenticationError("User not found");
    }

    console.log("✅ User found:", user.email);
    console.log(
      "🔍 Stored refresh token:",
      user.refreshToken?.substring(0, 20) + "...",
    );
    console.log("🔍 Provided refresh token:", token.substring(0, 20) + "...");
    console.log("🔍 Checking stored refresh token against provided token");

    // 저장된 refreshToken과 비교
    if (
      user.refreshToken !== token ||
      !user.refreshTokenExpires ||
      user.refreshTokenExpires < new Date()
    ) {
      console.log("❌ Refresh token validation failed:", {
        tokenMatch: user.refreshToken === token,
        hasExpiry: !!user.refreshTokenExpires,
        isExpired: user.refreshTokenExpires
          ? user.refreshTokenExpires < new Date()
          : "no expiry",
        storedTokenStart: user.refreshToken?.substring(0, 30) + "...",
        providedTokenStart: token.substring(0, 30) + "...",
      });
      throw new AuthenticationError("Invalid or expired refresh token");
    }

    console.log("✅ Refresh token validation passed, generating new tokens");

    // 새 토큰 발급 및 저장
    const newTokens = await generateTokens(user);

    console.log("✅ New tokens generated successfully");

    return newTokens;
  } catch (err) {
    console.log("❌ Refresh token rotation failed:", err.name, err.message);

    if (err.name === "TokenExpiredError") {
      throw new AuthenticationError("Refresh token expired");
    }
    if (err.name === "JsonWebTokenError") {
      throw new AuthenticationError("Invalid refresh token format");
    }

    // AuthenticationError는 그대로 전달
    if (err instanceof AuthenticationError) {
      throw err;
    }

    throw new AuthenticationError("Invalid refresh token");
  }
};

const refreshTokens = async (refreshToken) => rotateToken(refreshToken);

module.exports = {
  generateTokens,
  getUserFromToken,
  refreshTokens,
};
