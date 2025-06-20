const bcrypt = require("bcryptjs");
const { GraphQLError } = require("graphql");
const models = require("../../../models");
const {
  getUserFromToken,
  generateTokens,
  refreshTokens,
} = require("../../../utils/auth");
const { requireAuth } = require("../../../utils/requireAuth");

// ENUM 변환 도우미 함수들
const mapNotificationTypeToGraphQL = (dbType) => {
  if (!dbType) return null;
  return dbType.toUpperCase().replace(/_/g, "_");
};

const mapNotificationTypeToDatabase = (graphqlType) => {
  if (!graphqlType) return null;
  return graphqlType.toLowerCase().replace(/_/g, "_");
};

const mapNotificationPriorityToGraphQL = (dbPriority) => {
  if (!dbPriority) return "NORMAL";
  return dbPriority.toUpperCase();
};

const mapNotificationPriorityToDatabase = (graphqlPriority) => {
  if (!graphqlPriority) return "normal";
  return graphqlPriority.toLowerCase();
};

const mapNotificationStatusToGraphQL = (dbStatus) => {
  if (dbStatus === "unread") return "UNREAD";
  if (dbStatus === "read") return "READ";
  return "UNREAD";
};

const resolvers = {
  Query: {
    getMe: async (_, __, context) => {
      try {
        console.log("getMe called with context:", context);
        const user = await requireAuth(context);
        return user;
      } catch (error) {
        console.error("getMe error:", error);
        if (error.extensions?.code) {
          throw error;
        }
        throw new GraphQLError("사용자 정보를 가져오는데 실패했습니다.", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
            details: error.message,
          },
        });
      }
    },

    getDocuments: async (_, __, context) => {
      try {
        const user = await requireAuth(context);
        return await models.Document.findAll({
          where: { application_id: user.id },
          order: [["uploaded_at", "DESC"]],
        });
      } catch (error) {
        console.error("getDocuments error:", error);
        if (error instanceof GraphQLError) {
          throw error;
        }
        throw new GraphQLError("문서 목록을 가져오는데 실패했습니다.", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
            details: error.message,
          },
        });
      }
    },
    getNotifications: async (_, { limit = 10, offset = 0 }, context) => {
      try {
        console.log("getNotifications called with:", {
          limit,
          offset,
          context: !!context,
        });

        // const user = await requireAuth(context);
        // console.log("User authenticated:", user.email);

        // Get total count first
        const totalCount = await models.Notification.count({
          where: { recipient: "system" },
        });
        console.log("Total notifications count:", totalCount); // Get notifications with limit and offset
        const notifications = await models.Notification.findAll({
          where: { recipient: "system" },
          order: [["createdAt", "DESC"]], // Use camelCase column name
          limit,
          offset,
        });
        console.log("Raw notifications from DB:", notifications.length);

        const mappedNotifications = notifications.map((notification) => {
          const mapped = {
            id: notification.id,
            type: mapNotificationTypeToGraphQL(notification.type),
            title: notification.title,
            message: notification.message,
            priority: mapNotificationPriorityToGraphQL(notification.priority),
            status: mapNotificationStatusToGraphQL(notification.status),
            recipient: notification.recipient,
            relatedId: notification.relatedId, // Use camelCase property
            isRead: notification.status === "read",
            createdAt: notification.createdAt, // Use camelCase property
          };
          console.log("Mapped notification:", mapped);
          return mapped;
        });

        // Calculate if there's a next page
        const hasNextPage = offset + limit < totalCount;

        // Create cursor for pagination (using the last notification's ID)
        const cursor =
          notifications.length > 0
            ? notifications[notifications.length - 1].id.toString()
            : null;

        const result = {
          notifications: mappedNotifications,
          totalCount,
          hasNextPage,
          cursor,
        };

        console.log("getNotifications returning:", result);
        return result;
      } catch (error) {
        console.error("getNotifications error:", error);
        console.error("Error stack:", error.stack);
        // if (error instanceof GraphQLError) {
        //   throw error;
        // }
        throw new GraphQLError("알림 목록을 가져오는데 실패했습니다.", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
            details: error.message,
          },
        });
      }
    },
    getUnreadNotifications: async (_, __, context) => {
      try {
        const user = await requireAuth(context);

        const notifications = await models.Notification.findAll({
          where: {
            recipient: user.email,
            status: "unread",
          },
          order: [["created_at", "DESC"]],
        });

        return notifications.map((notification) => ({
          id: notification.id,
          type: mapNotificationTypeToGraphQL(notification.type),
          title: notification.title,
          message: notification.message,
          priority: mapNotificationPriorityToGraphQL(notification.priority),
          status: mapNotificationStatusToGraphQL(notification.status),
          recipient: notification.recipient,
          relatedId: notification.related_id,
          isRead: notification.status === "read",
          createdAt: notification.created_at,
        }));
      } catch (error) {
        console.error("getUnreadNotifications error:", error);
        if (error instanceof GraphQLError) {
          throw error;
        }
        throw new GraphQLError("읽지 않은 알림을 가져오는데 실패했습니다.", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
            details: error.message,
          },
        });
      }
    },

    getAllNotifications: async (_, { limit = 10, offset = 0 }, context) => {
      try {
        const user = await requireAuth(context);

        if (user.role !== "admin") {
          throw new GraphQLError("모든 알림 조회 권한이 없습니다.", {
            extensions: { code: "FORBIDDEN" },
          });
        }

        const notifications = await models.Notification.findAll({
          order: [["created_at", "DESC"]],
          limit,
          offset,
        });

        return notifications.map((notification) => ({
          id: notification.id,
          type: mapNotificationTypeToGraphQL(notification.type),
          title: notification.title,
          message: notification.message,
          priority: mapNotificationPriorityToGraphQL(notification.priority),
          status: mapNotificationStatusToGraphQL(notification.status),
          recipient: notification.recipient,
          relatedId: notification.related_id,
          isRead: notification.status === "read",
          createdAt: notification.created_at,
        }));
      } catch (error) {
        console.error("getAllNotifications error:", error);
        if (error instanceof GraphQLError) {
          throw error;
        }
        throw new GraphQLError("모든 알림을 가져오는데 실패했습니다.", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
            details: error.message,
          },
        });
      }
    },

    userLogin: async (_, { input }, { res }) => {
      try {
        const { email, password } = input;

        const user = await models.User.findOne({ where: { email } });
        if (!user) {
          throw new GraphQLError("존재하지 않는 이메일입니다.", {
            extensions: { code: "UNAUTHENTICATED" },
          });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
          throw new GraphQLError("비밀번호가 올바르지 않습니다.", {
            extensions: { code: "UNAUTHENTICATED" },
          });
        }

        const { accessToken, refreshToken } = await generateTokens(user);

        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 7 * 24 * 60 * 60 * 1000,
          path: "/",
        });

        return {
          accessToken: accessToken,
          refreshToken,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            phone: user.phone,
            created_at: user.created_at,
          },
        };
      } catch (error) {
        console.error("userLogin error:", error);
        throw new GraphQLError("로그인에 실패했습니다.", {
          extensions: {
            code: "UNAUTHENTICATED",
            details: error.message,
          },
        });
      }
    },
  },

  Mutation: {
    userRegister: async (_, { input }, { res }) => {
      try {
        const { email, password, name, phone } = input;
        const existingUser = await models.User.findOne({ where: { email } });
        if (existingUser) {
          throw new GraphQLError("이미 존재하는 이메일입니다.", {
            extensions: { code: "DUPLICATE_ERROR" },
          });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await models.User.create({
          email,
          password: hashedPassword,
          name,
          phone,
          tokenVersion: 0,
        });
        const { accessToken, refreshToken } = await generateTokens(user);

        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 7 * 24 * 60 * 60 * 1000,
          path: "/",
        });
        return {
          accessToken: accessToken,
          refreshToken,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            phone: user.phone,
            created_at: user.created_at,
          },
        };
      } catch (error) {
        console.error("userRegister error:", error);
        throw new GraphQLError("회원가입에 실패했습니다.", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
            details: error.message,
          },
        });
      }
    },

    refreshToken: async (
      _,
      { refreshToken },
      { res, refreshToken: ctxRefreshToken },
    ) => {
      try {
        console.log("🔄 RefreshToken mutation called");
        console.log(
          "🔍 Input refreshToken:",
          refreshToken ? "provided" : "not provided",
        );
        console.log(
          "🔍 Context refreshToken:",
          ctxRefreshToken ? "provided" : "not provided",
        );

        const usedToken = refreshToken || ctxRefreshToken;

        if (!usedToken) {
          console.log("❌ No refresh token provided");
          throw new GraphQLError("Refresh token이 필요합니다.", {
            extensions: {
              code: "UNAUTHENTICATED",
              details: "No refresh token provided",
            },
          });
        }

        console.log("🔄 Attempting to refresh tokens...");
        const tokens = await refreshTokens(usedToken);
        console.log("✅ Tokens refreshed successfully");

        res.cookie("refreshToken", tokens.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        console.log("✅ RefreshToken cookie updated");

        return {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        };
      } catch (error) {
        console.error("❌ refreshToken error:", error);
        res.clearCookie("refreshToken");
        throw new GraphQLError("토큰 갱신에 실패했습니다.", {
          extensions: {
            code: "TOKEN_EXPIRED",
            details: error.message,
          },
        });
      }
    },

    createDocument: async (_, { input }, context) => {
      try {
        const user = await requireAuth(context);
        return await models.Document.create({
          ...input,
          status: "UPLOADED",
          uploaded_at: new Date(),
        });
      } catch (error) {
        console.error("createDocument error:", error);
        throw new GraphQLError("문서 생성에 실패했습니다.", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
            details: error.message,
          },
        });
      }
    },

    updateDocumentStatus: async (_, { id, status, notes }, context) => {
      try {
        const user = await requireAuth(context);
        const document = await models.Document.findByPk(id);
        if (!document) {
          throw new GraphQLError("문서를 찾을 수 없습니다.", {
            extensions: { code: "NOT_FOUND" },
          });
        }

        if (user.role === "admin") {
          return await document.update({
            status,
            notes,
            reviewed_at: new Date(),
            reviewer: user.name,
          });
        }

        if (document.application_id !== user.id) {
          throw new GraphQLError("문서 수정 권한이 없습니다.", {
            extensions: { code: "FORBIDDEN" },
          });
        }
        return await document.update({
          status,
          notes,
          reviewed_at: new Date(),
        });
      } catch (error) {
        console.error("updateDocumentStatus error:", error);
        throw new GraphQLError("문서 상태 업데이트에 실패했습니다.", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
            details: error.message,
          },
        });
      }
    },
    createNotification: async (_, { input }, context) => {
      try {
        const user = await requireAuth(context);
        if (user.role !== "admin") {
          throw new GraphQLError("알림 생성 권한이 없습니다.", {
            extensions: { code: "FORBIDDEN" },
          });
        }

        const dbInput = {
          ...input,
          type: mapNotificationTypeToDatabase(input.type),
          priority: mapNotificationPriorityToDatabase(input.priority),
          status: "unread",
          createdAt: new Date(), // Use camelCase
        };

        return await models.Notification.create(dbInput);
      } catch (error) {
        console.error("createNotification error:", error);
        throw new GraphQLError("알림 생성에 실패했습니다.", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
            details: error.message,
          },
        });
      }
    },

    markNotificationAsRead: async (_, { id }, context) => {
      try {
        const user = await requireAuth(context);
        const notification = await models.Notification.findOne({
          where: { id, recipient: user.email },
        });
        if (!notification) {
          throw new GraphQLError("알림을 찾을 수 없습니다.", {
            extensions: { code: "NOT_FOUND" },
          });
        }
        return await notification.update({ status: "read" });
      } catch (error) {
        console.error("markNotificationAsRead error:", error);
        throw new GraphQLError("알림 읽음 처리에 실패했습니다.", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
            details: error.message,
          },
        });
      }
    },

    markAllNotificationsAsRead: async (_, { userId }, context) => {
      try {
        const user = await requireAuth(context);
        await models.Notification.update(
          { status: "read" },
          { where: { recipient: user.email, status: "unread" } },
        );
        return { success: true, message: "모든 알림을 읽음 처리했습니다." };
      } catch (error) {
        console.error("markAllNotificationsAsRead error:", error);
        throw new GraphQLError("전체 알림 읽음 처리에 실패했습니다.", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
            details: error.message,
          },
        });
      }
    },
  },
};

module.exports = resolvers;
