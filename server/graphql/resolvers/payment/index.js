const { Payment, VisaApplication } = require("../../../models");
const { GraphQLError } = require("graphql");
const { requireAuth } = require("../../../utils/requireAuth");
const { generateInvoice } = require("../../../utils/invoiceGenerator");

const paymentResolvers = {
  Query: {
    getPayments: async (_, __, context) => {
      try {
        // 관리자와 스태프만 모든 결제 목록 조회 가능
        await requireAuth(context, [
          "SUPER_ADMIN",
          "ADMIN",
          "MANAGER",
          "STAFF",
        ]);

        return await Payment.findAll({
          include: [
            {
              model: VisaApplication,
              as: "application",
              attributes: ["id", "full_name", "email", "visa_type"],
            },
          ],
          order: [["created_at", "DESC"]],
        });
      } catch (error) {
        console.error("Error fetching payments:", error);
        if (error.extensions?.code) throw error;
        throw new GraphQLError("결제 목록을 가져오는 중 오류가 발생했습니다.", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },

    getPayment: async (_, { id }, context) => {
      try {
        // 관리자와 스태프만 결제 상세 조회 가능
        await requireAuth(context, [
          "SUPER_ADMIN",
          "ADMIN",
          "MANAGER",
          "STAFF",
        ]);

        const payment = await Payment.findByPk(id, {
          include: [
            {
              model: VisaApplication,
              as: "application",
            },
          ],
        });

        if (!payment) {
          throw new GraphQLError("결제 정보를 찾을 수 없습니다.", {
            extensions: { code: "NOT_FOUND" },
          });
        }

        return payment;
      } catch (error) {
        console.error("Error fetching payment:", error);
        if (error.extensions?.code) throw error;
        throw new GraphQLError("결제 정보를 가져오는 중 오류가 발생했습니다.", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },
    getPaymentsByApplication: async (_, { applicationId }, context) => {
      try {
        // 관리자, 스태프 또는 본인만 해당 신청서의 결제 조회 가능
        const user = await requireAuth(context, [
          "SUPER_ADMIN",
          "ADMIN",
          "MANAGER",
          "STAFF",
          "USER",
        ]);

        // 일반 사용자는 본인 신청서만 조회 가능
        if (user.role === "USER") {
          const application =
            await models.VisaApplication.findByPk(applicationId);
          if (!application || application.userId !== user.id) {
            throw new GraphQLError("권한이 없습니다.", {
              extensions: { code: "FORBIDDEN" },
            });
          }
        }

        return await Payment.findAll({
          where: { application_id: applicationId },
          order: [["created_at", "DESC"]],
        });
      } catch (error) {
        console.error("Error fetching payments by application:", error);
        if (error.extensions?.code) throw error;
        throw new GraphQLError(
          "신청서별 결제 목록을 가져오는 중 오류가 발생했습니다.",
          {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          },
        );
      }
    },
  },
  Mutation: {
    createPayment: async (_, { input }, context) => {
      try {
        // 관리자와 스태프만 결제 생성 가능
        await requireAuth(context, [
          "SUPER_ADMIN",
          "ADMIN",
          "MANAGER",
          "STAFF",
        ]);

        const payment = await Payment.create({
          ...input,
          invoice_number: `INV-${Date.now()}`,
          created_at: new Date(),
          updated_at: new Date(),
        });

        return await Payment.findByPk(payment.id, {
          include: [
            {
              model: VisaApplication,
              as: "application",
            },
          ],
        });
      } catch (error) {
        console.error("Error creating payment:", error);
        if (error.extensions?.code) throw error;
        throw new GraphQLError("결제 정보 생성 중 오류가 발생했습니다.", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },

    updatePayment: async (_, { id, input }, context) => {
      try {
        // 관리자와 스태프만 결제 수정 가능
        await requireAuth(context, [
          "SUPER_ADMIN",
          "ADMIN",
          "MANAGER",
          "STAFF",
        ]);

        const payment = await Payment.findByPk(id);
        if (!payment) {
          throw new GraphQLError("결제 정보를 찾을 수 없습니다.", {
            extensions: { code: "NOT_FOUND" },
          });
        }

        await Payment.update(
          {
            ...input,
            updated_at: new Date(),
          },
          {
            where: { id },
          },
        );

        return await Payment.findByPk(id, {
          include: [
            {
              model: VisaApplication,
              as: "application",
            },
          ],
        });
      } catch (error) {
        console.error("Error updating payment:", error);
        if (error.extensions?.code) throw error;
        throw new GraphQLError("결제 정보 업데이트 중 오류가 발생했습니다.", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },
    generateInvoice: async (_, { applicationId, input }, context) => {
      try {
        // 관리자와 스태프만 청구서 생성 가능
        await requireAuth(context, [
          "SUPER_ADMIN",
          "ADMIN",
          "MANAGER",
          "STAFF",
        ]);

        // 청구서 생성 로직
        const invoiceData = await generateInvoice(applicationId, input);

        const payment = await Payment.create({
          application_id: applicationId,
          invoice_number: invoiceData.invoice_number,
          amount: input.amount,
          currency: input.currency || "KRW",
          status: "pending",
          due_date: input.due_date,
          created_at: new Date(),
          updated_at: new Date(),
        });

        return await Payment.findByPk(payment.id, {
          include: [
            {
              model: VisaApplication,
              as: "application",
            },
          ],
        });
      } catch (error) {
        console.error("Error generating invoice:", error);
        if (error.extensions?.code) throw error;
        throw new GraphQLError("청구서 생성 중 오류가 발생했습니다.", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },

    recordPayment: async (_, { paymentId, input }, context) => {
      try {
        // 관리자와 스태프만 결제 기록 가능
        await requireAuth(context, [
          "SUPER_ADMIN",
          "ADMIN",
          "MANAGER",
          "STAFF",
        ]);

        const payment = await Payment.findByPk(paymentId);
        if (!payment) {
          throw new GraphQLError("결제 정보를 찾을 수 없습니다.", {
            extensions: { code: "NOT_FOUND" },
          });
        }

        const newPaidAmount =
          parseFloat(payment.paid_amount || 0) + parseFloat(input.amount);
        const totalAmount = parseFloat(payment.amount);

        let newStatus = "partial";
        if (newPaidAmount >= totalAmount) {
          newStatus = "paid";
        }

        await Payment.update(
          {
            paid_amount: newPaidAmount,
            status: newStatus,
            paid_at: newStatus === "paid" ? new Date() : payment.paid_at,
            payment_method: input.payment_method,
            updated_at: new Date(),
          },
          {
            where: { id: paymentId },
          },
        );

        return await Payment.findByPk(paymentId, {
          include: [
            {
              model: VisaApplication,
              as: "application",
            },
          ],
        });
      } catch (error) {
        console.error("Error recording payment:", error);
        if (error.extensions?.code) throw error;
        throw new GraphQLError("결제 기록 중 오류가 발생했습니다.", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },
  },
};

module.exports = paymentResolvers;
