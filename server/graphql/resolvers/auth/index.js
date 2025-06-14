const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { models } = require("../../../models");
const { getUserFromToken, getAdminFromToken, generateTokens, generateAdminTokens, refreshTokens, refreshAdminTokens } = require("../../../utils/auth");
const { asyncHandler } = require("../../../utils/errorHandler");
const { TokenExpiredError } = require("../../../utils/errorTypes");

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

const resolvers = {
  Query: {
    getMe: asyncHandler(async (_, __, { token }) => {
      const user = await getUserFromToken(token);
      return user;
    }),
    getVisaTypes: () => {
      return ["E-visa", "Tourist Visa", "Business Visa", "Transit Visa"];
    },

    getDocuments: async (_, __, { token }) => {
      const user = await getUserFromToken(token);
      if (!user) throw new Error("Authentication required");

      return await models.Document.findAll({
        where: { application_id: user.id },
        order: [["uploaded_at", "DESC"]],
      });
    },

    getDocumentsByApplication: async (_, { applicationId }, { token }) => {
      const user = await getUserFromToken(token);
      if (!user) throw new Error("Authentication required");

      const application = await models.VisaApplication.findOne({
        where: { id: applicationId, user_id: user.id },
      });

      if (!application) throw new Error("Application not found");

      return await models.Document.findAll({
        where: { application_id: applicationId },
        order: [["uploaded_at", "DESC"]],
      });
    },

    getNotifications: async (_, __, { token }) => {
      const user = await getUserFromToken(token);
      if (!user) throw new Error("Authentication required");

      return await models.Notification.findAll({
        where: { recipient: user.email },
        order: [["created_at", "DESC"]],
      });
    },

    getUnreadNotifications: async (_, __, { token }) => {
      const user = await getUserFromToken(token);
      if (!user) throw new Error("Authentication required");

      return await models.Notification.findAll({
        where: {
          recipient: user.email,
          read: false,
        },
        order: [["created_at", "DESC"]],
      });
    },
  },

  Mutation: {
    userRegister: async (_, { input }) => {
      const { email, password, name, phone } = input;
      const existingUser = await models.User.findOne({ where: { email } });
      if (existingUser) {
        throw new Error("User already exists with this email");
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await models.User.create({
        email,
        password: hashedPassword,
        name,
        phone,
        tokenVersion: 0,
      });

      const { accessToken, refreshToken } = generateTokens(user);

      return {
        token: accessToken,
        refreshToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          phone: user.phone,
          created_at: user.created_at,
        },
      };
    },

    userLogin: async (_, { input }) => {
      const { email, password } = input;

      const user = await models.User.findOne({ where: { email } });
      if (!user) {
        throw new Error("Invalid credentials");
      }
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new Error("Invalid credentials");
      }

      const { accessToken, refreshToken } = generateTokens(user);

      return {
        token: accessToken,
        refreshToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          phone: user.phone,
          created_at: user.created_at,
        },
      };
    },
    adminLogin: async (_, { input }) => {
      const { email, password } = input;

      const admin = await models.Admin.findOne({ where: { email } });
      if (!admin) {
        throw new Error("Invalid credentials");
      }

      const isValidPassword = await bcrypt.compare(password, admin.password);
      if (!isValidPassword) {
        throw new Error("Invalid credentials");
      }

      const { accessToken, refreshToken } = generateAdminTokens(admin);

      return {
        token: accessToken,
        refreshToken,
        admin: {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: admin.role,
          created_at: admin.created_at,
          is_active: admin.is_active,
        },
      };
    },
    refreshToken: async (_, { refreshToken }) => {
      try {
        const tokens = await refreshTokens(refreshToken);
        return {
          token: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        };
      } catch (error) {
        throw new Error(error.message || "Invalid refresh token");
      }
    },

    refreshAdminToken: async (_, { refreshToken }) => {
      try {
        const tokens = await refreshAdminTokens(refreshToken);
        return {
          token: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        };
      } catch (error) {
        throw new Error(error.message || "Invalid admin refresh token");
      }
    },

    createDocument: async (_, { input }, { token }) => {
      const user = await getUserFromToken(token);
      if (!user) throw new Error("Authentication required");

      return await models.Document.create({
        ...input,
        status: "UPLOADED",
        uploaded_at: new Date(),
      });
    },

    updateDocumentStatus: async (_, { id, status, notes }, { adminToken }) => {
      const admin = await getAdminFromToken(adminToken);
      if (!admin) throw new Error("Authentication required");

      const document = await models.Document.findByPk(id);
      if (!document) throw new Error("Document not found");

      return await document.update({
        status,
        notes,
        reviewed_at: new Date(),
        reviewer: admin.name,
      });
    },

    createNotification: async (_, { input }, { adminToken }) => {
      const admin = await getAdminFromToken(adminToken);
      if (!admin) throw new Error("Authentication required");

      return await models.Notification.create({
        ...input,
        read: false,
        created_at: new Date(),
      });
    },

    markNotificationAsRead: async (_, { id }, { token }) => {
      const user = await getUserFromToken(token);
      if (!user) throw new Error("Authentication required");

      const notification = await models.Notification.findOne({
        where: { id, recipient: user.email },
      });

      if (!notification) throw new Error("Notification not found");

      return await notification.update({ read: true });
    },

    markAllNotificationsAsRead: async (_, { userId }, { token }) => {
      const user = await getUserFromToken(token);
      if (!user) throw new Error("Authentication required");

      await models.Notification.update({ read: true }, { where: { recipient: user.email, read: false } });

      return { success: true, message: "All notifications marked as read" };
    },
  },
};

module.exports = resolvers;
