const { models } = require('../../../models');
const { AuthenticationError, NotFoundError } = require('../../../utils/errorTypes');

const consultationsResolvers = {
  Query: {
    getConsultations: async () => {
      return await models.Consultation.findAll({
        order: [['created_at', 'DESC']]
      });
    },

    getConsultation: async (_, { id }) => {
      const consultation = await models.Consultation.findByPk(id);

      if (!consultation) {
        throw new NotFoundError('Consultation not found');
      }

      return consultation;
    }
  },

  Mutation: {
    createConsultation: async (_, { input }) => {
      return await models.Consultation.create({
        ...input,
        status: 'PENDING'
      });
    },

    updateConsultationStatus: async (_, { id, status, notes }) => {
      const consultation = await models.Consultation.findByPk(id);

      if (!consultation) {
        throw new NotFoundError('Consultation not found');
      }

      await consultation.update({
        status,
        notes: notes || consultation.notes,
        updated_at: new Date()
      });

      return consultation;
    },

    deleteConsultation: async (_, { id }) => {
      const consultation = await models.Consultation.findByPk(id);

      if (!consultation) {
        throw new NotFoundError('Consultation not found');
      }

      await consultation.destroy();

      return {
        success: true,
        message: 'Consultation deleted successfully'
      };
    }
  }
};

module.exports = consultationsResolvers;