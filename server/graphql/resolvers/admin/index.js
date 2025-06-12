const bcrypt = require("bcryptjs");
const { models } = require("../../../models");
const { getAdminFromToken } = require("../../../utils/auth");

const resolvers = {
  Query: {
    getAdminMe: async (_, __, { adminToken }) => {
      const admin = await getAdminFromToken(adminToken);
      if (!admin) throw new Error("Authentication required");
      return admin;
    },
    getAllApplications: async (_, __, { adminToken }) => {
      const admin = await getAdminFromToken(adminToken);
      if (!admin) throw new Error("Authentication required");

      return await models.VisaApplication.findAll({
        include: [
          { model: models.User, as: "applicant" },
          { model: models.Document, as: "documents" },
          { model: models.Payment, as: "payments" },
        ],
        order: [["created_at", "DESC"]],
      });
    },
    getApplicationById: async (_, { id }, { adminToken }) => {
      const admin = await getAdminFromToken(adminToken);
      if (!admin) throw new Error("Authentication required");

      return await models.VisaApplication.findByPk(id, {
        include: [
          { model: models.User, as: "applicant" },
          { model: models.Document, as: "documents" },
          { model: models.Payment, as: "payments" },
          { model: models.ApplicationStatusHistory, as: "statusHistory" },
        ],
      });
    },

    getDashboardStats: async (_, __, { adminToken }) => {
      const admin = await getAdminFromToken(adminToken);
      if (!admin) throw new Error("Authentication required");

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
    },

    // 추가된 쿼리들
    getAllAdmins: async (_, __, { adminToken }) => {
      const admin = await getAdminFromToken(adminToken);
      if (!admin || admin.role !== "SUPER_ADMIN") {
        throw new Error("Permission denied");
      }
      return await models.Admin.findAll({
        order: [["created_at", "DESC"]],
      });
    },

    getAdminById: async (_, { id }, { adminToken }) => {
      const admin = await getAdminFromToken(adminToken);
      if (!admin) throw new Error("Authentication required");
      return await models.Admin.findByPk(id);
    },

    getAllUsers: async (_, __, { adminToken }) => {
      const admin = await getAdminFromToken(adminToken);
      if (!admin) throw new Error("Authentication required");
      return await models.User.findAll({
        order: [["created_at", "DESC"]],
      });
    },

    getUserById: async (_, { id }, { adminToken }) => {
      const admin = await getAdminFromToken(adminToken);
      if (!admin) throw new Error("Authentication required");
      return await models.User.findByPk(id);
    },
    getVisaApplications: async (_, __, { adminToken }) => {
      const admin = await getAdminFromToken(adminToken);
      if (!admin) throw new Error("Authentication required");
      return await models.VisaApplication.findAll({
        include: [{ model: models.User, as: "applicant" }],
        order: [["created_at", "DESC"]],
      });
    },
    getVisaApplicationById: async (_, { id }, { adminToken }) => {
      const admin = await getAdminFromToken(adminToken);
      if (!admin) throw new Error("Authentication required");
      return await models.VisaApplication.findByPk(id, {
        include: [
          { model: models.User, as: "applicant" },
          { model: models.Document, as: "documents" },
        ],
      });
    },
  },

  Mutation: {
    createAdmin: async (_, { input }, { adminToken }) => {
      const admin = await getAdminFromToken(adminToken);
      if (!admin || admin.role !== "SUPER_ADMIN") {
        throw new Error("Permission denied");
      }

      const existingAdmin = await models.Admin.findOne({ where: { email: input.email } });
      if (existingAdmin) {
        throw new Error("Admin already exists");
      }

      const hashedPassword = await bcrypt.hash(input.password, 10);

      return await models.Admin.create({
        ...input,
        password: hashedPassword,
        is_active: true,
      });
    },

    updateAdminRole: async (_, { id, role }, { adminToken }) => {
      const admin = await getAdminFromToken(adminToken);
      if (!admin || admin.role !== "SUPER_ADMIN") {
        throw new Error("Permission denied");
      }

      const targetAdmin = await models.Admin.findByPk(id);
      if (!targetAdmin) {
        throw new Error("Admin not found");
      }

      await targetAdmin.update({ role });
      return targetAdmin;
    },

    deactivateAdmin: async (_, { id }, { adminToken }) => {
      const admin = await getAdminFromToken(adminToken);
      if (!admin || admin.role !== "SUPER_ADMIN") {
        throw new Error("Permission denied");
      }

      const targetAdmin = await models.Admin.findByPk(id);
      if (!targetAdmin) {
        throw new Error("Admin not found");
      }

      await targetAdmin.update({ is_active: false });
      return targetAdmin;
    },
  },
};

module.exports = resolvers;
