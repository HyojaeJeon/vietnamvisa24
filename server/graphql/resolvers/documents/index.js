
const { models } = require("../../../models");
const { getAdminFromToken } = require("../../../utils/auth");

const resolvers = {
  Query: {
    getAllDocuments: async (_, __, { adminToken }) => {
      const admin = await getAdminFromToken(adminToken);
      if (!admin) throw new Error('Authentication required');

      return await models.Document.findAll({
        include: [{ model: models.VisaApplication, as: 'application' }],
        order: [['uploaded_at', 'DESC']]
      });
    },

    getDocumentsByApplication: async (_, { applicationId }, { adminToken }) => {
      const admin = await getAdminFromToken(adminToken);
      if (!admin) throw new Error('Authentication required');

      return await models.Document.findAll({
        where: { application_id: applicationId },
        order: [['uploaded_at', 'DESC']]
      });
    }
  },

  Mutation: {
    createDocument: async (_, { input }, { adminToken }) => {
      const admin = await getAdminFromToken(adminToken);
      if (!admin) throw new Error('Authentication required');

      return await models.Document.create({
        ...input,
        status: 'PENDING',
        uploaded_at: new Date()
      });
    },

    updateDocumentStatus: async (_, { id, status, notes }, { adminToken }) => {
      const admin = await getAdminFromToken(adminToken);
      if (!admin) throw new Error('Authentication required');

      const document = await models.Document.findByPk(id);
      if (!document) throw new Error('Document not found');

      await document.update({
        status,
        notes,
        reviewed_at: new Date(),
        reviewer: admin.name
      });

      return document;
    },

    deleteDocument: async (_, { id }, { adminToken }) => {
      const admin = await getAdminFromToken(adminToken);
      if (!admin) throw new Error('Authentication required');

      const document = await models.Document.findByPk(id);
      if (!document) throw new Error('Document not found');

      await document.destroy();
      return { success: true, message: 'Document deleted successfully' };
    }
  }
};

module.exports = resolvers;
