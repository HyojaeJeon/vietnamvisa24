
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

    updateConsultationStatusById: async (_, { id, status, notes }) => {
      const consultation = await models.Consultation.findByPk(id);
      
      if (!consultation) {
        throw new NotFoundError('Consultation not found');
      }

      const updateData = { 
        status,
        updated_at: new Date()
      };
      
      if (notes) {
        updateData.notes = notes;
      }

      await consultation.update(updateData);
      
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
