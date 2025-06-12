const { GraphQLError } = require("graphql");
const { models } = require("../../models");
const { getAdminFromToken } = require("../../utils/auth");

const pricingResolvers = {
  Query: {
    // E-Visa 가격표 조회
    getEVisaPrices: async (_, { isActive }, { adminToken }) => {
      try {
        const where = {};
        if (isActive !== undefined) {
          where.isActive = isActive;
        }

        return await models.EVisaPrice.findAll({
          where,
          include: [
            { model: models.Admin, as: "creator", attributes: ["id", "name", "email"] },
            { model: models.Admin, as: "updater", attributes: ["id", "name", "email"] },
          ],
          order: [
            ["type", "ASC"],
            ["processingTime", "ASC"],
          ],
        });
      } catch (error) {
        throw new GraphQLError(`가격표 조회 실패: ${error.message}`);
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
            { model: models.Admin, as: "creator", attributes: ["id", "name", "email"] },
            { model: models.Admin, as: "updater", attributes: ["id", "name", "email"] },
          ],
          order: [
            ["visaType", "ASC"],
            ["peopleCount", "ASC"],
          ],
        });
      } catch (error) {
        throw new GraphQLError(`가격표 조회 실패: ${error.message}`);
      }
    },

    // Fast Track 가격표 조회
    getFastTrackPrices: async (_, { isActive }, context) => {
      try {
        const where = {};
        if (isActive !== undefined) {
          where.isActive = isActive;
        }

        return await models.FastTrackPrice.findAll({
          where,
          include: [
            { model: models.Admin, as: "creator", attributes: ["id", "name", "email"] },
            { model: models.Admin, as: "updater", attributes: ["id", "name", "email"] },
          ],
          order: [
            ["serviceType", "ASC"],
            ["airport", "ASC"],
          ],
        });
      } catch (error) {
        throw new GraphQLError(`가격표 조회 실패: ${error.message}`);
      }
    },

    // 모든 가격표 조회 (관리자용)
    getAllPrices: async (_, __, { adminToken }) => {
      const admin = await getAdminFromToken(adminToken);
      if (!admin) throw new GraphQLError("관리자 인증이 필요합니다.");

      try {
        const [eVisaPrices, visaRunPrices, fastTrackPrices] = await Promise.all([
          models.EVisaPrice.findAll({
            include: [
              { model: models.Admin, as: "creator", attributes: ["id", "name", "email"] },
              { model: models.Admin, as: "updater", attributes: ["id", "name", "email"] },
            ],
            order: [
              ["type", "ASC"],
              ["processingTime", "ASC"],
            ],
          }),
          models.VisaRunPrice.findAll({
            include: [
              { model: models.Admin, as: "creator", attributes: ["id", "name", "email"] },
              { model: models.Admin, as: "updater", attributes: ["id", "name", "email"] },
            ],
            order: [
              ["visaType", "ASC"],
              ["peopleCount", "ASC"],
            ],
          }),
          models.FastTrackPrice.findAll({
            include: [
              { model: models.Admin, as: "creator", attributes: ["id", "name", "email"] },
              { model: models.Admin, as: "updater", attributes: ["id", "name", "email"] },
            ],
            order: [
              ["serviceType", "ASC"],
              ["airport", "ASC"],
            ],
          }),
        ]);

        return {
          eVisaPrices,
          visaRunPrices,
          fastTrackPrices,
          totalCount: eVisaPrices.length + visaRunPrices.length + fastTrackPrices.length,
        };
      } catch (error) {
        throw new GraphQLError(`가격표 조회 실패: ${error.message}`);
      }
    },
  },

  Mutation: {
    // E-Visa 가격표 관리
    createEVisaPrice: async (_, { input }, { adminToken }) => {
      const admin = await getAdminFromToken(adminToken);
      if (!admin) throw new GraphQLError("관리자 인증이 필요합니다.");
      if (!["SUPER_ADMIN", "MANAGER"].includes(admin.role)) {
        throw new GraphQLError("권한이 부족합니다.");
      }

      try {
        // 중복 체크
        const existingPrice = await models.EVisaPrice.findOne({
          where: { type: input.type, processingTime: input.processingTime },
        });

        if (existingPrice) {
          throw new GraphQLError("이미 해당 타입과 처리시간의 가격표가 존재합니다.");
        }

        const price = await models.EVisaPrice.create({
          ...input,
          createdBy: admin.id,
          updatedBy: admin.id,
        });

        return await models.EVisaPrice.findByPk(price.id, {
          include: [
            { model: models.Admin, as: "creator", attributes: ["id", "name", "email"] },
            { model: models.Admin, as: "updater", attributes: ["id", "name", "email"] },
          ],
        });
      } catch (error) {
        throw new GraphQLError(`가격표 생성 실패: ${error.message}`);
      }
    },

    updateEVisaPrice: async (_, { id, input }, { adminToken }) => {
      const admin = await getAdminFromToken(adminToken);
      if (!admin) throw new GraphQLError("관리자 인증이 필요합니다.");
      if (!["SUPER_ADMIN", "MANAGER"].includes(admin.role)) {
        throw new GraphQLError("권한이 부족합니다.");
      }

      try {
        const price = await models.EVisaPrice.findByPk(id);
        if (!price) {
          throw new GraphQLError("가격표를 찾을 수 없습니다.");
        }

        await price.update({
          ...input,
          updatedBy: admin.id,
        });

        return await models.EVisaPrice.findByPk(id, {
          include: [
            { model: models.Admin, as: "creator", attributes: ["id", "name", "email"] },
            { model: models.Admin, as: "updater", attributes: ["id", "name", "email"] },
          ],
        });
      } catch (error) {
        throw new GraphQLError(`가격표 수정 실패: ${error.message}`);
      }
    },
    deleteEVisaPrice: async (_, { id }, { adminToken }) => {
      const admin = await getAdminFromToken(adminToken);
      if (!admin) throw new GraphQLError("관리자 인증이 필요합니다.");
      if (admin.role !== "SUPER_ADMIN") {
        throw new GraphQLError("슈퍼 관리자 권한이 필요합니다.");
      }

      try {
        const price = await models.EVisaPrice.findByPk(id);
        if (!price) {
          throw new GraphQLError("가격표를 찾을 수 없습니다.");
        }

        await price.destroy();
        return { success: true, message: "가격표가 성공적으로 삭제되었습니다." };
      } catch (error) {
        throw new GraphQLError(`가격표 삭제 실패: ${error.message}`);
      }
    },

    // Visa Run 가격표 관리
    createVisaRunPrice: async (_, { input }, { adminToken }) => {
      const admin = await getAdminFromToken(adminToken);
      if (!admin) throw new GraphQLError("관리자 인증이 필요합니다.");
      if (!["SUPER_ADMIN", "MANAGER"].includes(admin.role)) {
        throw new GraphQLError("권한이 부족합니다.");
      }

      try {
        const existingPrice = await models.VisaRunPrice.findOne({
          where: { visaType: input.visaType, peopleCount: input.peopleCount },
        });

        if (existingPrice) {
          throw new GraphQLError("이미 해당 비자타입과 인원수의 가격표가 존재합니다.");
        }

        const price = await models.VisaRunPrice.create({
          ...input,
          createdBy: admin.id,
          updatedBy: admin.id,
        });

        return await models.VisaRunPrice.findByPk(price.id, {
          include: [
            { model: models.Admin, as: "creator", attributes: ["id", "name", "email"] },
            { model: models.Admin, as: "updater", attributes: ["id", "name", "email"] },
          ],
        });
      } catch (error) {
        throw new GraphQLError(`가격표 생성 실패: ${error.message}`);
      }
    },

    updateVisaRunPrice: async (_, { id, input }, { adminToken }) => {
      const admin = await getAdminFromToken(adminToken);
      if (!admin) throw new GraphQLError("관리자 인증이 필요합니다.");
      if (!["SUPER_ADMIN", "MANAGER"].includes(admin.role)) {
        throw new GraphQLError("권한이 부족합니다.");
      }

      try {
        const price = await models.VisaRunPrice.findByPk(id);
        if (!price) {
          throw new GraphQLError("가격표를 찾을 수 없습니다.");
        }

        await price.update({
          ...input,
          updatedBy: admin.id,
        });

        return await models.VisaRunPrice.findByPk(id, {
          include: [
            { model: models.Admin, as: "creator", attributes: ["id", "name", "email"] },
            { model: models.Admin, as: "updater", attributes: ["id", "name", "email"] },
          ],
        });
      } catch (error) {
        throw new GraphQLError(`가격표 수정 실패: ${error.message}`);
      }
    },

    deleteVisaRunPrice: async (_, { id }, { adminToken }) => {
      const admin = await getAdminFromToken(adminToken);
      if (!admin) throw new GraphQLError("관리자 인증이 필요합니다.");
      if (admin.role !== "SUPER_ADMIN") {
        throw new GraphQLError("슈퍼 관리자 권한이 필요합니다.");
      }

      try {
        const price = await models.VisaRunPrice.findByPk(id);
        if (!price) {
          throw new GraphQLError("가격표를 찾을 수 없습니다.");
        }

        await price.destroy();
        return { success: true, message: "가격표가 성공적으로 삭제되었습니다." };
      } catch (error) {
        throw new GraphQLError(`가격표 삭제 실패: ${error.message}`);
      }
    },

    // Fast Track 가격표 관리
    createFastTrackPrice: async (_, { input }, { adminToken }) => {
      const admin = await getAdminFromToken(adminToken);
      if (!admin) throw new GraphQLError("관리자 인증이 필요합니다.");
      if (!["SUPER_ADMIN", "MANAGER"].includes(admin.role)) {
        throw new GraphQLError("권한이 부족합니다.");
      }

      try {
        const existingPrice = await models.FastTrackPrice.findOne({
          where: { serviceType: input.serviceType, airport: input.airport },
        });

        if (existingPrice) {
          throw new GraphQLError("이미 해당 서비스타입과 공항의 가격표가 존재합니다.");
        }

        const price = await models.FastTrackPrice.create({
          ...input,
          createdBy: admin.id,
          updatedBy: admin.id,
        });

        return await models.FastTrackPrice.findByPk(price.id, {
          include: [
            { model: models.Admin, as: "creator", attributes: ["id", "name", "email"] },
            { model: models.Admin, as: "updater", attributes: ["id", "name", "email"] },
          ],
        });
      } catch (error) {
        throw new GraphQLError(`가격표 생성 실패: ${error.message}`);
      }
    },

    updateFastTrackPrice: async (_, { id, input }, { adminToken }) => {
      const admin = await getAdminFromToken(adminToken);
      if (!admin) throw new GraphQLError("관리자 인증이 필요합니다.");
      if (!["SUPER_ADMIN", "MANAGER"].includes(admin.role)) {
        throw new GraphQLError("권한이 부족합니다.");
      }

      try {
        const price = await models.FastTrackPrice.findByPk(id);
        if (!price) {
          throw new GraphQLError("가격표를 찾을 수 없습니다.");
        }

        await price.update({
          ...input,
          updatedBy: admin.id,
        });

        return await models.FastTrackPrice.findByPk(id, {
          include: [
            { model: models.Admin, as: "creator", attributes: ["id", "name", "email"] },
            { model: models.Admin, as: "updater", attributes: ["id", "name", "email"] },
          ],
        });
      } catch (error) {
        throw new GraphQLError(`가격표 수정 실패: ${error.message}`);
      }
    },

    deleteFastTrackPrice: async (_, { id }, { adminToken }) => {
      const admin = await getAdminFromToken(adminToken);
      if (!admin) throw new GraphQLError("관리자 인증이 필요합니다.");
      if (admin.role !== "SUPER_ADMIN") {
        throw new GraphQLError("슈퍼 관리자 권한이 필요합니다.");
      }

      try {
        const price = await models.FastTrackPrice.findByPk(id);
        if (!price) {
          throw new GraphQLError("가격표를 찾을 수 없습니다.");
        }

        await price.destroy();
        return { success: true, message: "가격표가 성공적으로 삭제되었습니다." };
      } catch (error) {
        throw new GraphQLError(`가격표 삭제 실패: ${error.message}`);
      }
    },
  },
};

module.exports = pricingResolvers;
