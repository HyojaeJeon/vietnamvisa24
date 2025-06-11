const { models } = require('../../../models');
const { AuthenticationError, NotFoundError } = require('../../../utils/errorTypes');

const documentsResolvers = {
  Query: {
    getDocuments: async () => {
      return await models.Document.findAll({
        include: [
          {
            model: models.VisaApplication,
            as: 'application'
          }
        ],
        order: [['created_at', 'DESC']]
      });
    },

    getDocumentsByApplication: async (_, { applicationId }) => {
      return await models.Document.findAll({
        where: { application_id: applicationId },
        include: [
          {
            model: models.VisaApplication,
            as: 'application'
          }
        ],
        order: [['created_at', 'DESC']]
      });
    },

    getDocument: async (_, { id }) => {
      const document = await models.Document.findByPk(id, {
        include: [
          {
            model: models.VisaApplication,
            as: 'application'
          }
        ]
      });

      if (!document) {
        throw new NotFoundError('Document not found');
      }

      return document;
    }
  },

  Mutation: {
    createDocument: async (_, { input }) => {
      return await models.Document.create({
        ...input,
        status: 'UPLOADED',
        uploaded_at: new Date()
      });
    },

    updateDocumentStatus: async (_, { id, status, notes }) => {
      const document = await models.Document.findByPk(id);

      if (!document) {
        throw new NotFoundError('Document not found');
      }

      const updateData = { 
        status,
        reviewed_at: new Date()
      };

      if (notes) {
        updateData.notes = notes;
      }

      await document.update(updateData);

      return await models.Document.findByPk(id, {
        include: [
          {
            model: models.VisaApplication,
            as: 'application'
          }
        ]
      });
    },

    deleteDocument: async (_, { id }) => {
      const document = await models.Document.findByPk(id);

      if (!document) {
        throw new NotFoundError('Document not found');
      }

      await document.destroy();

      return {
        success: true,
        message: 'Document deleted successfully'
      };
    }
  }
};

module.exports = documentsResolvers;