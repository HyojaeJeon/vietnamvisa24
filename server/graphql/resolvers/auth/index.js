const bcrypt = require("bcryptjs");
const { GraphQLError } = require("graphql");
const models = require("../../../models");
const {
  getUserFromToken,
  generateTokens,
  refreshTokens,
} = require("../../../utils/auth");
const { requireAuth } = require("../../../utils/requireAuth");

const resolvers = {
  Query: {
    getMe: async (_, __, context) => {
      try {
        console.log("getMe called with context:", context);
        const user = await requireAuth(context);
        return user;
      } catch (error) {
        console.error("getMe error:", error);
        // 이미 GraphQLError인 경우 그대로 던짐 (requireAuth에서 변환됨)
        if (error.extensions?.code) {
          throw error;
        }
        // 그 외의 경우에만 INTERNAL_SERVER_ERROR로 래핑
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

        // GraphQLError인 경우 (requireAuth에서 던진 인증 에러 포함) 그대로 re-throw
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

    getDocumentsByApplication: async (_, { applicationId }, context) => {
      try {
        const user = await requireAuth(context);
        const application = await models.VisaApplication.findOne({
          where: { id: applicationId, user_id: user.id },
        });
        if (!application) {
          throw new GraphQLError("신청을 찾을 수 없습니다.", {
            extensions: { code: "NOT_FOUND" },
          });
        }
        return await models.Document.findAll({
          where: { application_id: applicationId },
          order: [["uploaded_at", "DESC"]],
        });
      } catch (error) {
        console.error("getDocumentsByApplication error:", error);
        throw new GraphQLError("신청 서류를 가져오는데 실패했습니다.", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
            details: error.message,
          },
        });
      }
    },

    getNotifications: async (_, __, context) => {
      try {
        const user = await requireAuth(context);
        return await models.Notification.findAll({
          where: { recipient: user.email },
          order: [["created_at", "DESC"]],
        });
      } catch (error) {
        console.error("getNotifications error:", error);
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
        return await models.Notification.findAll({
          where: { recipient: user.email, read: false },
          order: [["created_at", "DESC"]],
        });
      } catch (error) {
        console.error("getUnreadNotifications error:", error);
        throw new GraphQLError("읽지 않은 알림을 가져오는데 실패했습니다.", {
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
          throw new GraphQLError("사용자를 찾을 수 없습니다.", {
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

        // accessToken은 응답으로만 반환, refreshToken만 HttpOnly 쿠키로 저장
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7일
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

        // accessToken은 응답으로만 반환, refreshToken만 HttpOnly 쿠키로 저장
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7일
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

        // accessToken은 쿠키에 저장하지 않고 응답으로만 반환
        // refreshToken만 HttpOnly 쿠키로 저장
        res.cookie("refreshToken", tokens.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7일
        });

        console.log("✅ RefreshToken cookie updated");

        return {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        };
      } catch (error) {
        console.error("❌ refreshToken error:", error);

        // 기존 refresh token 쿠키 삭제
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
        // 권한 체크: admin은 모든 문서의 상태를 업데이트 할 수 있음
        if (user.role === "admin") {
          return await document.update({
            status,
            notes,
            reviewed_at: new Date(),
            reviewer: user.name,
          });
        }
        // 일반 사용자는 자신의 문서에 대해서만 상태를 업데이트 할 수 있음
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
        // admin만 알림 생성 가능
        if (user.role !== "admin") {
          throw new GraphQLError("알림 생성 권한이 없습니다.", {
            extensions: { code: "FORBIDDEN" },
          });
        }
        return await models.Notification.create({
          ...input,
          read: false,
          created_at: new Date(),
        });
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
        return await notification.update({ read: true });
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
          { read: true },
          { where: { recipient: user.email, read: false } },
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
