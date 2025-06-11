
const bcrypt = require("bcryptjs");
const { models } = require("../../../models");
const { getAdminFromToken } = require("../../../utils/auth");

const resolvers = {
  Query: {
    getAllApplications: async (_, __, { adminToken }) => {
      const admin = await getAdminFromToken(adminToken);
      if (!admin) throw new Error('Authentication required');

      return await models.VisaApplication.findAll({
        include: [
          { model: models.User, as: 'user' },
          { model: models.Document, as: 'documents' },
          { model: models.Payment, as: 'payments' }
        ],
        order: [['created_at', 'DESC']]
      });
    },

    getApplicationById: async (_, { id }, { adminToken }) => {
      const admin = await getAdminFromToken(adminToken);
      if (!admin) throw new Error('Authentication required');

      return await models.VisaApplication.findByPk(id, {
        include: [
          { model: models.User, as: 'user' },
          { model: models.Document, as: 'documents' },
          { model: models.Payment, as: 'payments' },
          { model: models.ApplicationStatusHistory, as: 'statusHistory' }
        ]
      });
    },

    getDashboardStats: async (_, __, { adminToken }) => {
      const admin = await getAdminFromToken(adminToken);
      if (!admin) throw new Error('Authentication required');

      try {
        const totalApplications = await models.VisaApplication.count();
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const newApplicationsToday = await models.VisaApplication.count({
          where: {
            created_at: {
              [models.Sequelize.Op.gte]: today
            }
          }
        });

        const completedToday = await models.VisaApplication.count({
          where: {
            status: 'APPROVED',
            updated_at: {
              [models.Sequelize.Op.gte]: today
            }
          }
        });

        const pendingReview = await models.VisaApplication.count({
          where: {
            status: 'PENDING_REVIEW'
          }
        });

        return {
          totalApplications,
          newApplicationsToday,
          completedToday,
          pendingReview
        };
      } catch (error) {
        console.error('Dashboard stats error:', error);
        return {
          totalApplications: 0,
          newApplicationsToday: 0,
          completedToday: 0,
          pendingReview: 0
        };
      }
    }
  },

  Mutation: {
    createAdmin: async (_, { input }, { adminToken }) => {
      const admin = await getAdminFromToken(adminToken);
      if (!admin || admin.role !== 'SUPER_ADMIN') {
        throw new Error('Permission denied');
      }

      const existingAdmin = await models.Admin.findOne({ where: { email: input.email } });
      if (existingAdmin) {
        throw new Error('Admin already exists');
      }

      const hashedPassword = await bcrypt.hash(input.password, 10);
      
      return await models.Admin.create({
        ...input,
        password: hashedPassword,
        is_active: true
      });
    },

    updateAdminRole: async (_, { id, role }, { adminToken }) => {
      const admin = await getAdminFromToken(adminToken);
      if (!admin || admin.role !== 'SUPER_ADMIN') {
        throw new Error('Permission denied');
      }

      const targetAdmin = await models.Admin.findByPk(id);
      if (!targetAdmin) {
        throw new Error('Admin not found');
      }

      await targetAdmin.update({ role });
      return targetAdmin;
    },

    deactivateAdmin: async (_, { id }, { adminToken }) => {
      const admin = await getAdminFromToken(adminToken);
      if (!admin || admin.role !== 'SUPER_ADMIN') {
        throw new Error('Permission denied');
      }

      const targetAdmin = await models.Admin.findByPk(id);
      if (!targetAdmin) {
        throw new Error('Admin not found');
      }

      await targetAdmin.update({ is_active: false });
      return targetAdmin;
    }
  }
};

module.exports = resolvers;
