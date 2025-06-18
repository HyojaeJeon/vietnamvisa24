const bcrypt = require("bcryptjs");
const { models } = require("../../../models");
const { requireAuth } = require("../../../utils/requireAuth");

const resolvers = {
  Query: {
    getMe: async (_, __, context) => {
      const user = await requireAuth(context);
      return user;
    },
    getAllApplications: async (_, __, context) => {
      await requireAuth(context, ["SUPER_ADMIN", "ADMIN", "MANAGER"]);

      return await models.VisaApplication.findAll({
        include: [
          { model: models.User, as: "applicant" },
          { model: models.Document, as: "documents" },
          { model: models.Payment, as: "payments" },
        ],
        order: [["created_at", "DESC"]],
      });
    },
    getApplicationById: async (_, { id }, context) => {
      await requireAuth(context, ["SUPER_ADMIN", "ADMIN", "MANAGER", "STAFF"]);

      return await models.VisaApplication.findByPk(id, {
        include: [
          { model: models.User, as: "applicant" },
          { model: models.Document, as: "documents" },
          { model: models.Payment, as: "payments" },
          { model: models.ApplicationStatusHistory, as: "statusHistory" },
        ],
      });
    },
    getDashboardStats: async (_, __, context) => {
      await requireAuth(context, ["SUPER_ADMIN", "ADMIN", "MANAGER"]);

      try {
        const totalApplications = await models.VisaApplication.count();

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const newApplicationsToday = await models.VisaApplication.count({
          where: {
            created_at: {
              [models.Sequelize.Op.gte]: today,
            },
          },
        });

        const completedToday = await models.VisaApplication.count({
          where: {
            status: "APPROVED",
            updated_at: {
              [models.Sequelize.Op.gte]: today,
            },
          },
        });

        const pendingReview = await models.VisaApplication.count({
          where: {
            status: "PENDING_REVIEW",
          },
        });

        return {
          totalApplications,
          newApplicationsToday,
          completedToday,
          pendingReview,
        };
      } catch (error) {
        console.error("Dashboard stats error:", error);
        return {
          totalApplications: 0,
          newApplicationsToday: 0,
          completedToday: 0,
          pendingReview: 0,
        };
      }
    }, // 추가된 쿼리들
    getAllUsers: async (_, __, context) => {
      await requireAuth(context, ["SUPER_ADMIN", "ADMIN", "MANAGER"]);
      return await models.User.findAll({
        order: [["created_at", "DESC"]],
      });
    },

    getUserById: async (_, { id }, context) => {
      await requireAuth(context, ["SUPER_ADMIN", "ADMIN", "MANAGER", "STAFF"]);
      return await models.User.findByPk(id);
    },
    getVisaApplications: async (_, __, context) => {
      await requireAuth(context, ["SUPER_ADMIN", "ADMIN", "MANAGER", "STAFF"]);
      return await models.VisaApplication.findAll({
        include: [{ model: models.User, as: "applicant" }],
        order: [["created_at", "DESC"]],
      });
    },
    getVisaApplicationById: async (_, { id }, context) => {
      await requireAuth(context, ["SUPER_ADMIN", "ADMIN", "MANAGER", "STAFF"]);
      return await models.VisaApplication.findByPk(id, {
        include: [
          { model: models.User, as: "applicant" },
          { model: models.Document, as: "documents" },
        ],
      });
    },
  },

  Mutation: {
    // admin 관련 뮤테이션 제거
  },
};

module.exports = resolvers;
