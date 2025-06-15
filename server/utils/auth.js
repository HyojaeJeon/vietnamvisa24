const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { models } = require('../database');
const { AuthenticationError, TokenExpiredError } = require('./errorTypes');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'your-refresh-secret-key';
const ACCESS_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN || '15m';
const REFRESH_EXPIRES_DAYS = parseInt(process.env.REFRESH_TOKEN_EXPIRES_DAYS || '7', 10);

const createRefreshRecord = async (payload, isAdmin = false) => {
  const expiresAt = new Date(Date.now() + REFRESH_EXPIRES_DAYS * 24 * 60 * 60 * 1000);
  const tokenId = uuidv4();
  await models.RefreshToken.create({
    token: tokenId,
    user_id: isAdmin ? null : payload.id,
    admin_id: isAdmin ? payload.id : null,
    expires_at: expiresAt,
  });
  const refreshToken = jwt.sign({ jti: tokenId, id: payload.id, admin: isAdmin }, REFRESH_TOKEN_SECRET, { expiresIn: `${REFRESH_EXPIRES_DAYS}d` });
  return { refreshToken, expiresAt };
};

const generateTokens = async (user) => {
  const accessToken = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: ACCESS_EXPIRES_IN });
  const { refreshToken } = await createRefreshRecord({ id: user.id }, false);
  return { accessToken, refreshToken };
};

const generateAdminTokens = async (admin) => {
  const accessToken = jwt.sign({ adminId: admin.id, role: admin.role }, JWT_SECRET, { expiresIn: ACCESS_EXPIRES_IN });
  const { refreshToken } = await createRefreshRecord({ id: admin.id }, true);
  return { accessToken, refreshToken };
};

const getUserFromToken = async (token) => {
  if (!token) throw new AuthenticationError();
  try {
    const clean = token.replace('Bearer ', '');
    const decoded = jwt.verify(clean, JWT_SECRET);
    const user = await models.User.findByPk(decoded.userId);
    if (!user) throw new AuthenticationError('User not found');
    return user;
  } catch (err) {
    if (err.name === 'TokenExpiredError') throw new TokenExpiredError();
    throw new AuthenticationError('Invalid token');
  }
};

const getAdminFromToken = async (token) => {
  if (!token) throw new AuthenticationError();
  try {
    const clean = token.replace('Bearer ', '');
    const decoded = jwt.verify(clean, JWT_SECRET);
    const admin = await models.Admin.findOne({ where: { id: decoded.adminId, is_active: true } });
    if (!admin) throw new AuthenticationError('Admin not found');
    return admin;
  } catch (err) {
    if (err.name === 'TokenExpiredError') throw new TokenExpiredError();
    throw new AuthenticationError('Invalid token');
  }
};

const rotateToken = async (token, isAdmin = false) => {
  if (!token) throw new AuthenticationError('Refresh token required');
  try {
    const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET);
    const record = await models.RefreshToken.findOne({ where: { token: decoded.jti, revoked: false } });
    if (!record || record.expires_at < new Date()) throw new AuthenticationError('Invalid refresh token');
    await record.update({ revoked: true });
    const target = isAdmin ? await models.Admin.findByPk(decoded.id) : await models.User.findByPk(decoded.id);
    if (!target) throw new AuthenticationError('User not found');
    return isAdmin ? generateAdminTokens(target) : generateTokens(target);
  } catch (err) {
    if (err.name === 'TokenExpiredError') throw new AuthenticationError('Refresh token expired');
    throw new AuthenticationError('Invalid refresh token');
  }
};

const refreshTokens = async (refreshToken) => rotateToken(refreshToken, false);
const refreshAdminTokens = async (refreshToken) => rotateToken(refreshToken, true);

module.exports = {
  generateTokens,
  generateAdminTokens,
  getUserFromToken,
  getAdminFromToken,
  refreshTokens,
  refreshAdminTokens,
};
