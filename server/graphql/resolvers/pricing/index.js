const { AuthenticationError, ForbiddenError, UserInputError } = require("apollo-server-express");
const { models } = require("../../../models");
const { Op } = require("sequelize");

const pricingResolvers = {
  Query: {
    // ====================
    // E-VISA 가격표 조회
    // ====================
    getEVisaPrices: async () => {
      try {
        return await models.EVisaPrice.findAll({
          include: [
            {
              model: models.Admin,
              as: "creator",
              attributes: ["id", "name", "email"],
            },
            {
              model: models.Admin,
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
        throw new Error(`E-VISA 가격표 조회 실패: ${error.message}`);
      }
    },

    getEVisaPrice: async (_, { id }) => {
      try {
        const price = await models.EVisaPrice.findByPk(id, {
          include: [
            {
              model: models.Admin,
              as: "creator",
              attributes: ["id", "name", "email"],
            },
            {
              model: models.Admin,
              as: "updater",
              attributes: ["id", "name", "email"],
            },
          ],
        });

        if (!price) {
          throw new UserInputError("E-VISA 가격표를 찾을 수 없습니다.");
        }

        return price;
      } catch (error) {
        throw new Error(`E-VISA 가격표 조회 실패: ${error.message}`);
      }
    },

    getEVisaPriceByType: async (_, { type, processingTime }) => {
      try {
        return await models.EVisaPrice.findOne({
          where: { type, processingTime },
          include: [
            {
              model: models.Admin,
              as: "creator",
              attributes: ["id", "name", "email"],
            },
            {
              model: models.Admin,
              as: "updater",
              attributes: ["id", "name", "email"],
            },
          ],
        });
      } catch (error) {
        throw new Error(`E-VISA 가격표 조회 실패: ${error.message}`);
      }
    },

    // ====================
    // Visa Run 가격표 조회
    // ====================
    getVisaRunPrices: async () => {
      try {
        return await models.VisaRunPrice.findAll({
          include: [
            {
              model: models.Admin,
              as: "creator",
              attributes: ["id", "name", "email"],
            },
            {
              model: models.Admin,
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
        throw new Error(`Visa Run 가격표 조회 실패: ${error.message}`);
      }
    },

    getVisaRunPrice: async (_, { id }) => {
      try {
        const price = await models.VisaRunPrice.findByPk(id, {
          include: [
            {
              model: models.Admin,
              as: "creator",
              attributes: ["id", "name", "email"],
            },
            {
              model: models.Admin,
              as: "updater",
              attributes: ["id", "name", "email"],
            },
          ],
        });

        if (!price) {
          throw new UserInputError("Visa Run 가격표를 찾을 수 없습니다.");
        }

        return price;
      } catch (error) {
        throw new Error(`Visa Run 가격표 조회 실패: ${error.message}`);
      }
    },

    getVisaRunPriceByTypeAndCount: async (_, { visaType, peopleCount }) => {
      try {
        return await models.VisaRunPrice.findOne({
          where: { visaType, peopleCount },
          include: [
            {
              model: models.Admin,
              as: "creator",
              attributes: ["id", "name", "email"],
            },
            {
              model: models.Admin,
              as: "updater",
              attributes: ["id", "name", "email"],
            },
          ],
        });
      } catch (error) {
        throw new Error(`Visa Run 가격표 조회 실패: ${error.message}`);
      }
    },

    // ====================
    // Fast Track 가격표 조회
    // ====================
    getFastTrackPrices: async () => {
      try {
        return await models.FastTrackPrice.findAll({
          include: [
            {
              model: models.Admin,
              as: "creator",
              attributes: ["id", "name", "email"],
            },
            {
              model: models.Admin,
              as: "updater",
              attributes: ["id", "name", "email"],
            },
          ],
          order: [
            ["serviceType", "ASC"],
            ["airport", "ASC"],
          ],
        });
      } catch (error) {
        throw new Error(`Fast Track 가격표 조회 실패: ${error.message}`);
      }
    },

    getFastTrackPrice: async (_, { id }) => {
      try {
        const price = await models.FastTrackPrice.findByPk(id, {
          include: [
            {
              model: models.Admin,
              as: "creator",
              attributes: ["id", "name", "email"],
            },
            {
              model: models.Admin,
              as: "updater",
              attributes: ["id", "name", "email"],
            },
          ],
        });

        if (!price) {
          throw new UserInputError("Fast Track 가격표를 찾을 수 없습니다.");
        }

        return price;
      } catch (error) {
        throw new Error(`Fast Track 가격표 조회 실패: ${error.message}`);
      }
    },

    getFastTrackPriceByService: async (_, { serviceType, airport }) => {
      try {
        return await models.FastTrackPrice.findOne({
          where: { serviceType, airport },
          include: [
            {
              model: models.Admin,
              as: "creator",
              attributes: ["id", "name", "email"],
            },
            {
              model: models.Admin,
              as: "updater",
              attributes: ["id", "name", "email"],
            },
          ],
        });
      } catch (error) {
        throw new Error(`Fast Track 가격표 조회 실패: ${error.message}`);
      }
    },
  },

  Mutation: {
    // ====================
    // E-VISA 가격표 관리
    // ====================
    createEVisaPrice: async (_, { input }, { user }) => {
      if (!user || !user.role || !["superadmin", "manager"].includes(user.role)) {
        throw new ForbiddenError("가격표 생성 권한이 없습니다.");
      }

      try {
        // 중복 체크
        const existingPrice = await models.EVisaPrice.findOne({
          where: { type: input.type, processingTime: input.processingTime },
        });

        if (existingPrice) {
          throw new UserInputError("해당 타입과 처리시간의 가격표가 이미 존재합니다.");
        }

        const newPrice = await models.EVisaPrice.create({
          ...input,
          createdBy: user.id,
          updatedBy: user.id,
        });

        return await models.EVisaPrice.findByPk(newPrice.id, {
          include: [
            {
              model: models.Admin,
              as: "creator",
              attributes: ["id", "name", "email"],
            },
            {
              model: models.Admin,
              as: "updater",
              attributes: ["id", "name", "email"],
            },
          ],
        });
      } catch (error) {
        throw new Error(`E-VISA 가격표 생성 실패: ${error.message}`);
      }
    },

    updateEVisaPrice: async (_, { id, input }, { user }) => {
      if (!user || !user.role || !["superadmin", "manager"].includes(user.role)) {
        throw new ForbiddenError("가격표 수정 권한이 없습니다.");
      }

      try {
        const price = await models.EVisaPrice.findByPk(id);
        if (!price) {
          throw new UserInputError("E-VISA 가격표를 찾을 수 없습니다.");
        }

        // 타입과 처리시간이 변경되는 경우 중복 체크
        if ((input.type && input.type !== price.type) || (input.processingTime && input.processingTime !== price.processingTime)) {
          const existingPrice = await models.EVisaPrice.findOne({
            where: {
              type: input.type || price.type,
              processingTime: input.processingTime || price.processingTime,
              id: { [Op.ne]: id },
            },
          });

          if (existingPrice) {
            throw new UserInputError("해당 타입과 처리시간의 가격표가 이미 존재합니다.");
          }
        }

        await price.update({
          ...input,
          updatedBy: user.id,
        });

        return await models.EVisaPrice.findByPk(id, {
          include: [
            {
              model: models.Admin,
              as: "creator",
              attributes: ["id", "name", "email"],
            },
            {
              model: models.Admin,
              as: "updater",
              attributes: ["id", "name", "email"],
            },
          ],
        });
      } catch (error) {
        throw new Error(`E-VISA 가격표 수정 실패: ${error.message}`);
      }
    },

    deleteEVisaPrice: async (_, { id }, { user }) => {
      if (!user || !user.role || user.role !== "superadmin") {
        throw new ForbiddenError("가격표 삭제는 최고관리자만 가능합니다.");
      }

      try {
        const price = await models.EVisaPrice.findByPk(id);
        if (!price) {
          throw new UserInputError("E-VISA 가격표를 찾을 수 없습니다.");
        }

        await price.destroy();
        return true;
      } catch (error) {
        throw new Error(`E-VISA 가격표 삭제 실패: ${error.message}`);
      }
    },

    // ====================
    // Visa Run 가격표 관리
    // ====================
    createVisaRunPrice: async (_, { input }, { user }) => {
      if (!user || !user.role || !["superadmin", "manager"].includes(user.role)) {
        throw new ForbiddenError("가격표 생성 권한이 없습니다.");
      }

      try {
        // 중복 체크
        const existingPrice = await models.VisaRunPrice.findOne({
          where: { visaType: input.visaType, peopleCount: input.peopleCount },
        });

        if (existingPrice) {
          throw new UserInputError("해당 비자 타입과 인원수의 가격표가 이미 존재합니다.");
        }

        const newPrice = await models.VisaRunPrice.create({
          ...input,
          createdBy: user.id,
          updatedBy: user.id,
        });

        return await models.VisaRunPrice.findByPk(newPrice.id, {
          include: [
            {
              model: models.Admin,
              as: "creator",
              attributes: ["id", "name", "email"],
            },
            {
              model: models.Admin,
              as: "updater",
              attributes: ["id", "name", "email"],
            },
          ],
        });
      } catch (error) {
        throw new Error(`Visa Run 가격표 생성 실패: ${error.message}`);
      }
    },

    updateVisaRunPrice: async (_, { id, input }, { user }) => {
      if (!user || !user.role || !["superadmin", "manager"].includes(user.role)) {
        throw new ForbiddenError("가격표 수정 권한이 없습니다.");
      }

      try {
        const price = await models.VisaRunPrice.findByPk(id);
        if (!price) {
          throw new UserInputError("Visa Run 가격표를 찾을 수 없습니다.");
        }

        // 비자 타입과 인원수가 변경되는 경우 중복 체크
        if ((input.visaType && input.visaType !== price.visaType) || (input.peopleCount && input.peopleCount !== price.peopleCount)) {
          const existingPrice = await models.VisaRunPrice.findOne({
            where: {
              visaType: input.visaType || price.visaType,
              peopleCount: input.peopleCount || price.peopleCount,
              id: { [Op.ne]: id },
            },
          });

          if (existingPrice) {
            throw new UserInputError("해당 비자 타입과 인원수의 가격표가 이미 존재합니다.");
          }
        }

        await price.update({
          ...input,
          updatedBy: user.id,
        });

        return await models.VisaRunPrice.findByPk(id, {
          include: [
            {
              model: models.Admin,
              as: "creator",
              attributes: ["id", "name", "email"],
            },
            {
              model: models.Admin,
              as: "updater",
              attributes: ["id", "name", "email"],
            },
          ],
        });
      } catch (error) {
        throw new Error(`Visa Run 가격표 수정 실패: ${error.message}`);
      }
    },

    deleteVisaRunPrice: async (_, { id }, { user }) => {
      if (!user || !user.role || user.role !== "superadmin") {
        throw new ForbiddenError("가격표 삭제는 최고관리자만 가능합니다.");
      }

      try {
        const price = await models.VisaRunPrice.findByPk(id);
        if (!price) {
          throw new UserInputError("Visa Run 가격표를 찾을 수 없습니다.");
        }

        await price.destroy();
        return true;
      } catch (error) {
        throw new Error(`Visa Run 가격표 삭제 실패: ${error.message}`);
      }
    },

    // ====================
    // Fast Track 가격표 관리
    // ====================
    createFastTrackPrice: async (_, { input }, { user }) => {
      if (!user || !user.role || !["superadmin", "manager"].includes(user.role)) {
        throw new ForbiddenError("가격표 생성 권한이 없습니다.");
      }

      try {
        // 중복 체크
        const existingPrice = await models.FastTrackPrice.findOne({
          where: { serviceType: input.serviceType, airport: input.airport },
        });

        if (existingPrice) {
          throw new UserInputError("해당 서비스 타입과 공항의 가격표가 이미 존재합니다.");
        }

        const newPrice = await models.FastTrackPrice.create({
          ...input,
          createdBy: user.id,
          updatedBy: user.id,
        });

        return await models.FastTrackPrice.findByPk(newPrice.id, {
          include: [
            {
              model: models.Admin,
              as: "creator",
              attributes: ["id", "name", "email"],
            },
            {
              model: models.Admin,
              as: "updater",
              attributes: ["id", "name", "email"],
            },
          ],
        });
      } catch (error) {
        throw new Error(`Fast Track 가격표 생성 실패: ${error.message}`);
      }
    },

    updateFastTrackPrice: async (_, { id, input }, { user }) => {
      if (!user || !user.role || !["superadmin", "manager"].includes(user.role)) {
        throw new ForbiddenError("가격표 수정 권한이 없습니다.");
      }

      try {
        const price = await models.FastTrackPrice.findByPk(id);
        if (!price) {
          throw new UserInputError("Fast Track 가격표를 찾을 수 없습니다.");
        }

        // 서비스 타입과 공항이 변경되는 경우 중복 체크
        if ((input.serviceType && input.serviceType !== price.serviceType) || (input.airport && input.airport !== price.airport)) {
          const existingPrice = await models.FastTrackPrice.findOne({
            where: {
              serviceType: input.serviceType || price.serviceType,
              airport: input.airport || price.airport,
              id: { [Op.ne]: id },
            },
          });

          if (existingPrice) {
            throw new UserInputError("해당 서비스 타입과 공항의 가격표가 이미 존재합니다.");
          }
        }

        await price.update({
          ...input,
          updatedBy: user.id,
        });

        return await models.FastTrackPrice.findByPk(id, {
          include: [
            {
              model: models.Admin,
              as: "creator",
              attributes: ["id", "name", "email"],
            },
            {
              model: models.Admin,
              as: "updater",
              attributes: ["id", "name", "email"],
            },
          ],
        });
      } catch (error) {
        throw new Error(`Fast Track 가격표 수정 실패: ${error.message}`);
      }
    },

    deleteFastTrackPrice: async (_, { id }, { user }) => {
      if (!user || !user.role || user.role !== "superadmin") {
        throw new ForbiddenError("가격표 삭제는 최고관리자만 가능합니다.");
      }

      try {
        const price = await models.FastTrackPrice.findByPk(id);
        if (!price) {
          throw new UserInputError("Fast Track 가격표를 찾을 수 없습니다.");
        }

        await price.destroy();
        return true;
      } catch (error) {
        throw new Error(`Fast Track 가격표 삭제 실패: ${error.message}`);
      }
    },
  },
};

module.exports = pricingResolvers;
