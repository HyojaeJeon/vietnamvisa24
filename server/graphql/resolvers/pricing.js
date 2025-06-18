const { GraphQLError } = require("graphql");
const { models } = require("../../models");
const { requireAuth } = require("../../utils/requireAuth");

const pricingResolvers = {
  Query: {
    // E-Visa 가격표 조회
    getEVisaPrices: async (_, { isActive }, context) => {
      try {
        const where = {};
        if (isActive !== undefined) {
          where.isActive = isActive;
        }

        return await models.EVisaPrice.findAll({
          where,
          include: [
            {
              model: models.User,
              as: "creator",
              attributes: ["id", "name", "email"],
            },
            {
              model: models.User,
              as: "updater",
              attributes: ["id", "name", "email"],
            },
          ],
          order: [
            ["type", "ASC"],
            ["processingTime", "ASC"],
          ],
        });
      } catch (error) {
        console.error("getEVisaPrices error:", error);
        throw new GraphQLError("E-Visa 가격표 조회에 실패했습니다.", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
            details: error.message,
          },
        });
      }
    },

    // Visa Run 가격표 조회
    getVisaRunPrices: async (_, { isActive }, context) => {
      try {
        const where = {};
        if (isActive !== undefined) {
          where.isActive = isActive;
        }

        return await models.VisaRunPrice.findAll({
          where,
          include: [
            {
              model: models.User,
              as: "creator",
              attributes: ["id", "name", "email"],
            },
            {
              model: models.User,
              as: "updater",
              attributes: ["id", "name", "email"],
            },
          ],
          order: [
            ["visaType", "ASC"],
            ["peopleCount", "ASC"],
          ],
        });
      } catch (error) {
        console.error("getVisaRunPrices error:", error);
        throw new GraphQLError("Visa Run 가격표 조회에 실패했습니다.", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
            details: error.message,
          },
        });
      }
    },

    // 모든 가격표 조회
    getAllPrices: async (_, __, context) => {
      try {
        // 관리자와 매니저만 모든 가격표 조회 가능
        await requireAuth(context, ["SUPER_ADMIN", "ADMIN", "MANAGER"]);

        const [eVisaPrices, visaRunPrices, fastTrackPrices] = await Promise.all(
          [
            models.EVisaPrice.findAll({
              include: [
                {
                  model: models.User,
                  as: "creator",
                  attributes: ["id", "name", "email"],
                },
                {
                  model: models.User,
                  as: "updater",
                  attributes: ["id", "name", "email"],
                },
              ],
              order: [
                ["type", "ASC"],
                ["processingTime", "ASC"],
              ],
            }),
            models.VisaRunPrice.findAll({
              include: [
                {
                  model: models.User,
                  as: "creator",
                  attributes: ["id", "name", "email"],
                },
                {
                  model: models.User,
                  as: "updater",
                  attributes: ["id", "name", "email"],
                },
              ],
              order: [
                ["visaType", "ASC"],
                ["peopleCount", "ASC"],
              ],
            }),
            models.FastTrackPrice.findAll({
              include: [
                {
                  model: models.User,
                  as: "creator",
                  attributes: ["id", "name", "email"],
                },
                {
                  model: models.User,
                  as: "updater",
                  attributes: ["id", "name", "email"],
                },
              ],
              order: [
                ["serviceType", "ASC"],
                ["airport", "ASC"],
              ],
            }),
          ],
        );

        return {
          eVisaPrices,
          visaRunPrices,
          fastTrackPrices,
          totalCount:
            eVisaPrices.length + visaRunPrices.length + fastTrackPrices.length,
        };
      } catch (error) {
        console.error("getAllPrices error:", error);
        throw new GraphQLError("전체 가격표 조회에 실패했습니다.", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
            details: error.message,
          },
        });
      }
    },
  },

  Mutation: {
    // E-Visa 가격표 관리
    createEVisaPrice: async (_, { input }, context) => {
      try {
        // 관리자와 매니저만 가격 생성 가능
        const user = await requireAuth(context, [
          "SUPER_ADMIN",
          "ADMIN",
          "MANAGER",
        ]);

        // 중복 체크
        const existingPrice = await models.EVisaPrice.findOne({
          where: { type: input.type, processingTime: input.processingTime },
        });

        if (existingPrice) {
          throw new GraphQLError(
            "이미 해당 타입과 처리시간의 가격표가 존재합니다.",
          );
        }

        const price = await models.EVisaPrice.create({
          ...input,
          createdBy: user.id,
          updatedBy: user.id,
        });

        return await models.EVisaPrice.findByPk(price.id, {
          include: [
            {
              model: models.User,
              as: "creator",
              attributes: ["id", "name", "email"],
            },
            {
              model: models.User,
              as: "updater",
              attributes: ["id", "name", "email"],
            },
          ],
        });
      } catch (error) {
        console.error("createEVisaPrice error:", error);
        throw new GraphQLError("E-Visa 가격표 생성에 실패했습니다.", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
            details: error.message,
          },
        });
      }
    },

    updateEVisaPrice: async (_, { id, input }, context) => {
      try {
        // 관리자와 매니저만 가격 수정 가능
        const user = await requireAuth(context, [
          "SUPER_ADMIN",
          "ADMIN",
          "MANAGER",
        ]);

        const price = await models.EVisaPrice.findByPk(id);
        if (!price) {
          throw new GraphQLError("가격표를 찾을 수 없습니다.", {
            extensions: { code: "NOT_FOUND" },
          });
        }

        await price.update({
          ...input,
          updatedBy: user.id,
        });

        return price;
      } catch (error) {
        console.error("updateEVisaPrice error:", error);
        throw new GraphQLError("E-Visa 가격표 수정에 실패했습니다.", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
            details: error.message,
          },
        });
      }
    },

    deleteEVisaPrice: async (_, { id }, context) => {
      // 슈퍼 관리자만 가격 삭제 가능
      await requireAuth(context, ["SUPER_ADMIN"]);

      try {
        const price = await models.EVisaPrice.findByPk(id);
        if (!price) {
          throw new GraphQLError("가격표를 찾을 수 없습니다.");
        }

        await price.destroy();
        return {
          success: true,
          message: "가격표가 성공적으로 삭제되었습니다.",
        };
      } catch (error) {
        throw new GraphQLError(`가격표 삭제 실패: ${error.message}`);
      }
    },

    // Visa Run 가격표 관리
    createVisaRunPrice: async (_, { input }, context) => {
      // 관리자와 매니저만 가격 생성 가능
      const user = await requireAuth(context, [
        "SUPER_ADMIN",
        "ADMIN",
        "MANAGER",
      ]);

      try {
        const existingPrice = await models.VisaRunPrice.findOne({
          where: { visaType: input.visaType, peopleCount: input.peopleCount },
        });

        if (existingPrice) {
          throw new GraphQLError(
            "이미 해당 비자타입과 인원수의 가격표가 존재합니다.",
          );
        }

        const price = await models.VisaRunPrice.create({
          ...input,
          createdBy: user.id,
          updatedBy: user.id,
        });

        return await models.VisaRunPrice.findByPk(price.id, {
          include: [
            {
              model: models.User,
              as: "creator",
              attributes: ["id", "name", "email"],
            },
            {
              model: models.User,
              as: "updater",
              attributes: ["id", "name", "email"],
            },
          ],
        });
      } catch (error) {
        throw new GraphQLError(`가격표 생성 실패: ${error.message}`);
      }
    },

    updateVisaRunPrice: async (_, { id, input }, context) => {
      // 관리자와 매니저만 가격 수정 가능
      const user = await requireAuth(context, [
        "SUPER_ADMIN",
        "ADMIN",
        "MANAGER",
      ]);

      try {
        const price = await models.VisaRunPrice.findByPk(id);
        if (!price) {
          throw new GraphQLError("가격표를 찾을 수 없습니다.");
        }

        await price.update({
          ...input,
          updatedBy: user.id,
        });

        return await models.VisaRunPrice.findByPk(id, {
          include: [
            {
              model: models.User,
              as: "creator",
              attributes: ["id", "name", "email"],
            },
            {
              model: models.User,
              as: "updater",
              attributes: ["id", "name", "email"],
            },
          ],
        });
      } catch (error) {
        throw new GraphQLError(`가격표 수정 실패: ${error.message}`);
      }
    },

    deleteVisaRunPrice: async (_, { id }, context) => {
      // 슈퍼 관리자만 가격 삭제 가능
      await requireAuth(context, ["SUPER_ADMIN"]);

      try {
        const price = await models.VisaRunPrice.findByPk(id);
        if (!price) {
          throw new GraphQLError("가격표를 찾을 수 없습니다.");
        }

        await price.destroy();
        return {
          success: true,
          message: "가격표가 성공적으로 삭제되었습니다.",
        };
      } catch (error) {
        throw new GraphQLError(`가격표 삭제 실패: ${error.message}`);
      }
    },

    // Fast Track 가격표 관리
    createFastTrackPrice: async (_, { input }, context) => {
      // 관리자와 매니저만 가격 생성 가능
      const user = await requireAuth(context, [
        "SUPER_ADMIN",
        "ADMIN",
        "MANAGER",
      ]);

      try {
        const existingPrice = await models.FastTrackPrice.findOne({
          where: { serviceType: input.serviceType, airport: input.airport },
        });

        if (existingPrice) {
          throw new GraphQLError(
            "이미 해당 서비스타입과 공항의 가격표가 존재합니다.",
          );
        }

        const price = await models.FastTrackPrice.create({
          ...input,
          createdBy: user.id,
          updatedBy: user.id,
        });

        return await models.FastTrackPrice.findByPk(price.id, {
          include: [
            {
              model: models.User,
              as: "creator",
              attributes: ["id", "name", "email"],
            },
            {
              model: models.User,
              as: "updater",
              attributes: ["id", "name", "email"],
            },
          ],
        });
      } catch (error) {
        throw new GraphQLError(`가격표 생성 실패: ${error.message}`);
      }
    },

    updateFastTrackPrice: async (_, { id, input }, context) => {
      // 관리자와 매니저만 가격 수정 가능
      const user = await requireAuth(context, [
        "SUPER_ADMIN",
        "ADMIN",
        "MANAGER",
      ]);

      try {
        const price = await models.FastTrackPrice.findByPk(id);
        if (!price) {
          throw new GraphQLError("가격표를 찾을 수 없습니다.");
        }

        await price.update({
          ...input,
          updatedBy: user.id,
        });

        return await models.FastTrackPrice.findByPk(id, {
          include: [
            {
              model: models.User,
              as: "creator",
              attributes: ["id", "name", "email"],
            },
            {
              model: models.User,
              as: "updater",
              attributes: ["id", "name", "email"],
            },
          ],
        });
      } catch (error) {
        throw new GraphQLError(`가격표 수정 실패: ${error.message}`);
      }
    },

    deleteFastTrackPrice: async (_, { id }, context) => {
      // 슈퍼 관리자만 가격 삭제 가능
      await requireAuth(context, ["SUPER_ADMIN"]);

      try {
        const price = await models.FastTrackPrice.findByPk(id);
        if (!price) {
          throw new GraphQLError("가격표를 찾을 수 없습니다.");
        }

        await price.destroy();
        return {
          success: true,
          message: "가격표가 성공적으로 삭제되었습니다.",
        };
      } catch (error) {
        throw new GraphQLError(`가격표 삭제 실패: ${error.message}`);
      }
    },
  },
};

module.exports = pricingResolvers;
