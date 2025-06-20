const models = require("../../../models");
const { GraphQLError } = require("graphql");

// 데이터베이스의 소문자 enum 값을 GraphQL 스키마의 대문자 형태로 변환
const normalizeEnumValues = (notification) => {
  if (!notification) return notification;

  return {
    ...(notification.dataValues || notification),
    status: (notification.status || "").toUpperCase(),
    priority: (notification.priority || "").toUpperCase(),
    type: (notification.type || "").toUpperCase(),
  };
};

// 배열의 각 알림에 대해 enum 값 정규화
const normalizeNotifications = (notifications) => {
  if (!Array.isArray(notifications)) return [];
  return notifications.map(normalizeEnumValues);
};

const notificationResolvers = {
  Query: {
    // 모든 알림 조회
    getAllNotifications: async () => {
      try {
        const notifications = await models.Notification.findAll({
          order: [["createdAt", "DESC"]],
        });
        return normalizeNotifications(notifications);
      } catch (error) {
        console.error("❌ Error fetching all notifications:", error);
        throw new GraphQLError("알림 조회에 실패했습니다.", {
          extensions: { code: "INTERNAL_ERROR" },
        });
      }
    },

    // 특정 사용자의 알림 조회
    getNotificationsByUser: async (_, { userId }) => {
      try {
        const notifications = await models.Notification.findAll({
          //   where: { recipient: userId },
          order: [["createdAt", "DESC"]],
        });
        return normalizeNotifications(notifications);
      } catch (error) {
        console.error("❌ Error fetching user notifications:", error);
        throw new GraphQLError("사용자 알림 조회에 실패했습니다.", {
          extensions: { code: "INTERNAL_ERROR" },
        });
      }
    },

    // 상태별 알림 조회
    getNotificationsByStatus: async (_, { status }) => {
      try {
        const notifications = await models.Notification.findAll({
          where: { status: status.toUpperCase() }, // 데이터베이스에서도 대문자로 검색
          order: [["createdAt", "DESC"]],
        });
        return normalizeNotifications(notifications);
      } catch (error) {
        console.error("❌ Error fetching notifications by status:", error);
        throw new GraphQLError("상태별 알림 조회에 실패했습니다.", {
          extensions: { code: "INTERNAL_ERROR" },
        });
      }
    },

    // 읽지 않은 알림 개수 조회
    getUnreadNotificationsCount: async (_, { userId }) => {
      try {
        const count = await models.Notification.count({
          where: {
            // recipient: userId,
            status: "UNREAD", // 데이터베이스에서도 대문자로 검색
          },
        });
        return count;
      } catch (error) {
        console.error("❌ Error fetching unread notifications count:", error);
        throw new GraphQLError("읽지 않은 알림 개수 조회에 실패했습니다.", {
          extensions: { code: "INTERNAL_ERROR" },
        });
      }
    },

    // 페이지네이션을 지원하는 알림 조회
    getNotificationsPaginated: async (
      _,
      { userId, first = 10, after, filter },
    ) => {
      try {
        const limit = Math.min(first, 50); // 최대 50개로 제한
        let offset = 0;

        // after 커서가 있으면 offset 계산
        if (after) {
          const cursorData = Buffer.from(after, "base64").toString("ascii");
          offset = parseInt(cursorData, 10) || 0;
        } // 필터 조건 설정
        const whereCondition = {
          //   recipient: userId, // userId로 필터링 비활성화
        };

        if (filter && filter !== "all") {
          if (filter === "UNREAD") {
            whereCondition.status = "UNREAD"; // 데이터베이스에서도 대문자로 검색
          } else if (filter === "READ") {
            whereCondition.status = "READ"; // 데이터베이스에서도 대문자로 검색
          }
        }

        // 총 개수 조회
        const totalCount = await models.Notification.count({
          where: whereCondition,
        });

        // 페이지네이션된 알림 조회
        const notifications = await models.Notification.findAll({
          where: whereCondition,
          order: [["createdAt", "DESC"]],
          limit: limit + 1, // 다음 페이지 존재 여부 확인을 위해 +1
          offset: offset,
        });

        // 다음 페이지 존재 여부 확인
        const hasNextPage = notifications.length > limit;
        if (hasNextPage) {
          notifications.pop(); // 마지막 항목 제거
        }

        // 커서 생성
        const startCursor =
          notifications.length > 0
            ? Buffer.from(offset.toString()).toString("base64")
            : null;
        const endCursor =
          notifications.length > 0
            ? Buffer.from(
                (offset + notifications.length - 1).toString(),
              ).toString("base64")
            : null;

        return {
          notifications: normalizeNotifications(notifications),
          hasNextPage,
          hasPreviousPage: offset > 0,
          totalCount,
          pageInfo: {
            startCursor,
            endCursor,
            hasNextPage,
            hasPreviousPage: offset > 0,
          },
        };
      } catch (error) {
        console.error("❌ Error fetching paginated notifications:", error);
        throw new GraphQLError("페이지네이션 알림 조회에 실패했습니다.", {
          extensions: { code: "INTERNAL_ERROR" },
        });
      }
    },
  },

  Mutation: {
    // 알림 전송 생성
    sendNotification: async (_, { input }) => {
      try {
        const notification = await models.Notification.create({
          type: (input.type || "").toUpperCase(), // 데이터베이스에도 대문자로 저장
          title: input.title,
          message: input.message,
          recipient: input.recipient,
          priority: (input.priority || "NORMAL").toUpperCase(), // 데이터베이스에도 대문자로 저장
          relatedId: input.relatedId,
          targetUrl: input.targetUrl,
          status: "UNREAD", // 데이터베이스에도 대문자로 저장
        });

        console.log("✅ Notification created:", notification.id);
        return normalizeEnumValues(notification);
      } catch (error) {
        console.error("❌ Error creating notification:", error);
        throw new GraphQLError("알림 생성에 실패했습니다.", {
          extensions: { code: "INTERNAL_ERROR" },
        });
      }
    },

    // 알림을 읽음으로 표시
    markNotificationAsRead: async (_, { input }) => {
      try {
        const notification = await models.Notification.findByPk(
          input.notificationId,
        );

        if (!notification) {
          throw new GraphQLError("알림을 찾을 수 없습니다.", {
            extensions: { code: "NOT_FOUND" },
          });
        }
        await notification.update({
          status: "READ", // 데이터베이스에도 대문자로 저장
          updatedAt: new Date(),
        });

        console.log("✅ Notification marked as read:", notification.id);
        return {
          success: true,
          message: "알림이 읽음으로 표시되었습니다.",
          notification: normalizeEnumValues(notification),
        };
      } catch (error) {
        console.error("❌ Error marking notification as read:", error);
        if (error instanceof GraphQLError) throw error;
        throw new GraphQLError("알림 읽음 처리에 실패했습니다.", {
          extensions: { code: "INTERNAL_ERROR" },
        });
      }
    },

    // 알림 삭제
    deleteNotification: async (_, { id }) => {
      try {
        const notification = await models.Notification.findByPk(id);

        if (!notification) {
          throw new GraphQLError("알림을 찾을 수 없습니다.", {
            extensions: { code: "NOT_FOUND" },
          });
        }

        await notification.destroy();

        console.log("✅ Notification deleted:", id);
        return {
          success: true,
          message: "알림이 삭제되었습니다.",
          notification: null,
        };
      } catch (error) {
        console.error("❌ Error deleting notification:", error);
        if (error instanceof GraphQLError) throw error;
        throw new GraphQLError("알림 삭제에 실패했습니다.", {
          extensions: { code: "INTERNAL_ERROR" },
        });
      }
    },

    // 대량 알림 작업 (읽음 처리/삭제)
    bulkNotificationAction: async (_, { input }) => {
      try {
        const { notificationIds, action } = input;
        let affectedCount = 0;
        if (action === "MARK_ALL_READ") {
          const [updatedCount] = await models.Notification.update(
            { status: "READ", updatedAt: new Date() }, // 데이터베이스에도 대문자로 저장
            { where: { id: notificationIds } },
          );
          affectedCount = updatedCount;
        } else if (action === "DELETE_ALL") {
          affectedCount = await models.Notification.destroy({
            where: { id: notificationIds },
          });
        }

        console.log(
          `✅ Bulk notification action ${action} completed:`,
          affectedCount,
        );
        return {
          success: true,
          message: `${affectedCount}개의 알림이 처리되었습니다.`,
          affectedCount,
        };
      } catch (error) {
        console.error("❌ Error in bulk notification action:", error);
        throw new GraphQLError("대량 알림 처리에 실패했습니다.", {
          extensions: { code: "INTERNAL_ERROR" },
        });
      }
    },

    // 사용자의 모든 알림을 읽음으로 표시
    markAllNotificationsAsRead: async (_, { userId }) => {
      try {
        const [updatedCount] = await models.Notification.update(
          { status: "READ", updatedAt: new Date() }, // 데이터베이스에도 대문자로 저장
          {
            where: {
              //   recipient: userId,
              status: "UNREAD", // 데이터베이스에서도 대문자로 검색
            },
          },
        );

        console.log(
          "✅ All notifications marked as read for user:",
          userId,
          "Count:",
          updatedCount,
        );
        return {
          success: true,
          message: `${updatedCount}개의 알림이 읽음으로 표시되었습니다.`,
          affectedCount: updatedCount,
        };
      } catch (error) {
        console.error("❌ Error marking all notifications as read:", error);
        throw new GraphQLError("모든 알림 읽음 처리에 실패했습니다.", {
          extensions: { code: "INTERNAL_ERROR" },
        });
      }
    },

    // 사용자의 모든 알림 삭제
    deleteAllNotifications: async (_, { userId }) => {
      try {
        const deletedCount = await models.Notification.destroy({
          //   where: { recipient: userId },
        });

        console.log(
          "✅ All notifications deleted for user:",
          userId,
          "Count:",
          deletedCount,
        );
        return {
          success: true,
          message: `${deletedCount}개의 알림이 삭제되었습니다.`,
          affectedCount: deletedCount,
        };
      } catch (error) {
        console.error("❌ Error deleting all notifications:", error);
        throw new GraphQLError("모든 알림 삭제에 실패했습니다.", {
          extensions: { code: "INTERNAL_ERROR" },
        });
      }
    },
  },

  // Notification 필드 resolver
  Notification: {
    isRead: (notification) => notification.status === "READ",
    createdAt: (notification) => notification.createdAt?.toISOString(),
    updatedAt: (notification) => notification.updatedAt?.toISOString(),
  },
};

module.exports = notificationResolvers;
