const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { models } = require("../../../models");
const { getUserFromToken, getAdminFromToken } = require("../../../utils/auth");
const { asyncHandler } = require("../../../utils/errorHandler");

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

const resolvers = {
  Query: {
    me: asyncHandler(async (_, __, { token }) => {
      const user = await getUserFromToken(token);
      return user;
    }),

    adminMe: async (_, __, { adminToken }) => {
      const admin = await getAdminFromToken(adminToken);
      if (!admin) throw new Error('Authentication required');
      return admin;
    },

    getAllAdmins: async (_, __, { adminToken }) => {
      const admin = await getAdminFromToken(adminToken);
      if (!admin || (admin.role !== 'SUPER_ADMIN' && admin.role !== 'MANAGER')) {
        throw new Error('Permission denied');
      }

      return await models.Admin.findAll({
        order: [['created_at', 'DESC']]
      });
    },

    getVisaApplications: asyncHandler(async (_, __, context) => {
      const { token } = context;
      console.log('getVisaApplications - Received token:', token);

      const user = await getUserFromToken(token);
      console.log('getVisaApplications - Found user:', user?.id);

      return await models.VisaApplication.findAll({
        where: { user_id: user.id },
        order: [['created_at', 'DESC']]
      });
    }),

    getVisaApplication: async (_, { id }, { token }) => {
      const user = await getUserFromToken(token);
      if (!user) throw new Error('Authentication required');

      return await models.VisaApplication.findOne({
        where: { id, user_id: user.id }
      });
    },

    getVisaTypes: async () => {
      return [
        'E-visa',
        'Business Visa',
        'Tourist Visa',
        'Work Permit',
        'Residence Card',
        'Student Visa'
      ];
    }
  },

  Mutation: {
    register: async (_, { input }) => {
      const { email, password, name, phone } = input;

      const existingUser = await models.User.findOne({ where: { email } });
      if (existingUser) {
        throw new Error('User already exists');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await models.User.create({
        email,
        password: hashedPassword,
        name,
        phone
      });

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          phone: user.phone,
          created_at: user.created_at
        }
      };
    },

    login: async (_, { input }) => {
      const { email, password } = input;

      const user = await models.User.findOne({ where: { email } });
      if (!user) {
        throw new Error('Invalid credentials');
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new Error('Invalid credentials');
      }

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          phone: user.phone,
          created_at: user.created_at
        }
      };
    },

    adminLogin: async (_, { input }) => {
      const { email, password } = input;

      const admin = await models.Admin.findOne({ where: { email } });
      if (!admin) {
        throw new Error('Invalid credentials');
      }

      const isValidPassword = await bcrypt.compare(password, admin.password);
      if (!isValidPassword) {
        throw new Error('Invalid credentials');
      }

      const token = jwt.sign({ adminId: admin.id }, JWT_SECRET, { expiresIn: '7d' });

      return {
        token,
        admin: {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: admin.role,
          created_at: admin.created_at,
          is_active: admin.is_active
        }
      };
    },

    createVisaApplication: async (_, { input }, { token }) => {
      const user = await getUserFromToken(token);
      if (!user) throw new Error('Authentication required');

      // Generate application number
      const count = await models.VisaApplication.count();
      const applicationNumber = `VN-${new Date().getFullYear()}-${String(count + 1).padStart(3, '0')}`;

      const application = await models.VisaApplication.create({
        ...input,
        user_id: user.id,
        application_number: applicationNumber,
        status: 'PENDING_REVIEW'
      });

      return application;
    },

    updateApplicationStatus: async (_, { id, status }, { adminToken }) => {
      const admin = await getAdminFromToken(adminToken);
      if (!admin) throw new Error('Authentication required');

      const application = await models.VisaApplication.findByPk(id);
      if (!application) throw new Error('Application not found');

      const previousStatus = application.status;
      await application.update({ status });

      // Create status history
      await models.ApplicationStatusHistory.create({
        application_id: id,
        previous_status: previousStatus,
        new_status: status,
        changed_by: admin.id,
        change_reason: 'Status updated by admin'
      });

      return application;
    }
  }
};

module.exports = resolvers;