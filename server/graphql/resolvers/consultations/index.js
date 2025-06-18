const { models } = require("../../../models");
const { GraphQLError } = require("graphql");
const { requireAuth } = require("../../../utils/requireAuth");

const consultationsResolvers = {
  Query: {
    getConsultations: async (_, __, context) => {
      try {
        // 관리자와 스태프만 상담 목록 조회 가능
        await requireAuth(context, [
          "SUPER_ADMIN",
          "ADMIN",
          "MANAGER",
          "STAFF",
        ]);
        return await models.Consultation.findAll({
          order: [["createdAt", "DESC"]],
        });
      } catch (error) {
        console.error("Error fetching consultations:", error);
        if (error.extensions?.code) throw error;
        throw new GraphQLError("상담 목록을 가져오는 중 오류가 발생했습니다.", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },

    getConsultation: async (_, { id }, context) => {
      try {
        // 관리자와 스태프만 상담 상세 조회 가능
        await requireAuth(context, [
          "SUPER_ADMIN",
          "ADMIN",
          "MANAGER",
          "STAFF",
        ]);
        const consultation = await models.Consultation.findByPk(id);
        if (!consultation) {
          throw new GraphQLError("상담을 찾을 수 없습니다.", {
            extensions: { code: "NOT_FOUND" },
          });
        }
        return consultation;
      } catch (error) {
        console.error("Error fetching consultation:", error);
        if (error.extensions?.code) throw error;
        throw new GraphQLError("상담 정보를 가져오는 중 오류가 발생했습니다.", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },
  },
  Mutation: {
    createConsultation: async (_, { input }, context) => {
      try {
        // 일반 사용자도 상담 생성 가능
        await requireAuth(context);
        return await models.Consultation.create({
          ...input,
          status: "PENDING",
        });
      } catch (error) {
        console.error("Error creating consultation:", error);
        if (error.extensions?.code) throw error;
        throw new GraphQLError("상담 생성 중 오류가 발생했습니다.", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },

    deleteConsultation: async (_, { id }, context) => {
      try {
        await requireAuth(context);
        const consultation = await models.Consultation.findByPk(id);
        if (!consultation) {
          throw new GraphQLError("상담을 찾을 수 없습니다.", {
            extensions: { code: "NOT_FOUND" },
          });
        }

        await consultation.destroy();
        return {
          success: true,
          message: "상담이 성공적으로 삭제되었습니다.",
        };
      } catch (error) {
        console.error("Error deleting consultation:", error);
        if (error.extensions?.code) throw error;
        throw new GraphQLError("상담 삭제 중 오류가 발생했습니다.", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },

    updateConsultationStatus: async (_, { id, status }, context) => {
      try {
        await requireAuth(context);
        const consultation = await models.Consultation.findByPk(id);
        if (!consultation) {
          throw new GraphQLError("상담을 찾을 수 없습니다.", {
            extensions: { code: "NOT_FOUND" },
          });
        }

        await consultation.update({ status });
        return consultation;
      } catch (error) {
        console.error("Error updating consultation status:", error);
        if (error.extensions?.code) throw error;
        throw new GraphQLError("상담 상태 변경 중 오류가 발생했습니다.", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },
  },
  Consultation: {
    application: async (consultation) => {
      if (consultation.application) {
        return consultation.application;
      }
      if (consultation.applicationId) {
        return await models.VisaApplication.findByPk(
          consultation.applicationId,
        );
      }
      return null;
    },

    assignedUser: async (consultation) => {
      if (consultation.assignedUser) {
        return consultation.assignedUser;
      }
      if (consultation.assignedTo) {
        return await models.User.findByPk(consultation.assignedTo);
      }
      return null;
    },

    applicant: async (consultation) => {
      if (consultation.applicant) {
        return consultation.applicant;
      }
      if (consultation.userId) {
        return await models.User.findByPk(consultation.userId);
      }
      return null;
    },
  },
};

module.exports = consultationsResolvers;
