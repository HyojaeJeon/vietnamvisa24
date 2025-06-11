const { Payment, VisaApplication } = require('../../../models');
const { generateInvoice } = require('../../../utils/invoiceGenerator');

const paymentResolvers = {
  Query: {
    getPayments: async () => {
      return await Payment.findAll({
        include: [{ 
          model: VisaApplication, 
          as: 'application',
          attributes: ['id', 'full_name', 'email', 'visa_type']
        }],
        order: [['created_at', 'DESC']]
      });
    },

    getPayment: async (_, { id }) => {
      return await Payment.findByPk(id, {
        include: [{ 
          model: VisaApplication, 
          as: 'application' 
        }]
      });
    },

    getPaymentsByApplication: async (_, { applicationId }) => {
      return await Payment.findAll({
        where: { application_id: applicationId },
        order: [['created_at', 'DESC']]
      });
    }
  },

  Mutation: {
    createPayment: async (_, { input }) => {
      const payment = await Payment.create({
        ...input,
        invoice_number: `INV-${Date.now()}`,
        created_at: new Date(),
        updated_at: new Date()
      });

      return await Payment.findByPk(payment.id, {
        include: [{ 
          model: VisaApplication, 
          as: 'application' 
        }]
      });
    },

    updatePayment: async (_, { id, input }) => {
      await Payment.update({
        ...input,
        updated_at: new Date()
      }, { 
        where: { id } 
      });

      return await Payment.findByPk(id, {
        include: [{ 
          model: VisaApplication, 
          as: 'application' 
        }]
      });
    },

    generateInvoice: async (_, { applicationId, input }) => {
      try {
        // 청구서 생성 로직
        const invoiceData = await generateInvoice(applicationId, input);

        const payment = await Payment.create({
          application_id: applicationId,
          invoice_number: invoiceData.invoice_number,
          amount: input.amount,
          currency: input.currency || 'KRW',
          status: 'pending',
          due_date: input.due_date,
          created_at: new Date(),
          updated_at: new Date()
        });

        return await Payment.findByPk(payment.id, {
          include: [{ 
            model: VisaApplication, 
            as: 'application' 
          }]
        });
      } catch (error) {
        throw new Error(`Invoice generation failed: ${error.message}`);
      }
    },

    recordPayment: async (_, { paymentId, input }) => {
      const payment = await Payment.findByPk(paymentId);
      if (!payment) {
        throw new Error('Payment not found');
      }

      const newPaidAmount = parseFloat(payment.paid_amount || 0) + parseFloat(input.amount);
      const totalAmount = parseFloat(payment.amount);

      let newStatus = 'partial';
      if (newPaidAmount >= totalAmount) {
        newStatus = 'paid';
      }

      await Payment.update({
        paid_amount: newPaidAmount,
        status: newStatus,
        paid_at: newStatus === 'paid' ? new Date() : payment.paid_at,
        payment_method: input.payment_method,
        updated_at: new Date()
      }, { 
        where: { id: paymentId } 
      });

      return await Payment.findByPk(paymentId, {
        include: [{ 
          model: VisaApplication, 
          as: 'application' 
        }]
      });
    }
  }
};

module.exports = paymentResolvers;