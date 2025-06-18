const { models } = require("../../../models");
const { GraphQLError } = require("graphql");
const { requireAuth } = require("../../../utils/requireAuth");
const { deleteFile } = require("../../../middleware/upload");
const path = require("path");
const fs = require("fs");

const documentsResolvers = {
  Query: {
    getDocuments: async (_, __, context) => {
      try {
        // 관리자와 스태프만 모든 문서 목록 조회 가능
        await requireAuth(context, [
          "SUPER_ADMIN",
          "ADMIN",
          "MANAGER",
          "STAFF",
        ]);

        return await models.Document.findAll({
          include: [
            {
              model: models.VisaApplication,
              as: "application",
              attributes: ["id", "applicationNumber", "fullName", "visaType"],
            },
            {
              model: models.Admin,
              as: "reviewer",
              attributes: ["id", "name", "email"],
            },
          ],
          order: [["createdAt", "DESC"]],
        });
      } catch (error) {
        console.error("Error fetching documents:", error);

        // GraphQLError인 경우 (requireAuth에서 던진 인증 에러 포함) 그대로 re-throw
        if (error instanceof GraphQLError) {
          throw error;
        }

        throw new GraphQLError("문서 목록을 가져오는 중 오류가 발생했습니다.", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },

    getDocumentsByApplication: async (_, { applicationId }, context) => {
      try {
        // 관리자, 스태프 또는 본인만 해당 신청서의 문서 조회 가능
        const user = await requireAuth(context, [
          "SUPER_ADMIN",
          "ADMIN",
          "MANAGER",
          "STAFF",
          "USER",
        ]);

        const application =
          await models.VisaApplication.findByPk(applicationId);
        if (!application) {
          throw new GraphQLError("비자 신청서를 찾을 수 없습니다.", {
            extensions: { code: "NOT_FOUND" },
          });
        }

        // 일반 사용자는 본인 신청서만 조회 가능
        if (user.role === "USER" && application.userId !== user.id) {
          throw new GraphQLError("권한이 없습니다.", {
            extensions: { code: "FORBIDDEN" },
          });
        }

        return await models.Document.findAll({
          where: { applicationId: applicationId },
          include: [
            {
              model: models.VisaApplication,
              as: "application",
              attributes: ["id", "applicationNumber", "fullName"],
            },
            {
              model: models.Admin,
              as: "reviewer",
              attributes: ["id", "name", "email"],
            },
          ],
          order: [["createdAt", "DESC"]],
        });
      } catch (error) {
        console.error("Error fetching documents by application:", error);

        // GraphQLError인 경우 (requireAuth에서 던진 인증 에러 포함) 그대로 re-throw
        if (error instanceof GraphQLError) {
          throw error;
        }

        throw new GraphQLError(
          "신청서별 문서를 가져오는 중 오류가 발생했습니다.",
          {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          },
        );
      }
    },

    getDocument: async (_, { id }) => {
      try {
        const document = await models.Document.findByPk(id, {
          include: [
            {
              model: models.VisaApplication,
              as: "application",
              attributes: ["id", "applicationNumber", "fullName", "visaType"],
            },
            {
              model: models.Admin,
              as: "reviewer",
              attributes: ["id", "name", "email"],
            },
          ],
        });

        if (!document) {
          throw new GraphQLError("문서를 찾을 수 없습니다.", {
            extensions: { code: "NOT_FOUND" },
          });
        }

        return document;
      } catch (error) {
        console.error("Error fetching document:", error);
        if (error.extensions?.code) throw error;
        throw new GraphQLError("문서를 가져오는 중 오류가 발생했습니다.", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },

    getDocumentTypes: async () => {
      try {
        // 문서 타입 목록 반환
        return [
          { value: "passport", label: "여권 사본", required: true },
          { value: "photo", label: "증명사진", required: true },
          { value: "invitation", label: "초청장", required: false },
          { value: "hotel", label: "숙박 예약 확인서", required: false },
          { value: "flight", label: "항공편 예약 확인서", required: false },
          {
            value: "bankStatement",
            label: "은행 잔고 증명서",
            required: false,
          },
          { value: "employment", label: "재직 증명서", required: false },
          { value: "marriage", label: "혼인 관계 증명서", required: false },
          { value: "birth", label: "출생 증명서", required: false },
          { value: "other", label: "기타 서류", required: false },
        ];
      } catch (error) {
        console.error("Error fetching document types:", error);
        throw new GraphQLError("문서 타입을 가져오는 중 오류가 발생했습니다.", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },

    getDocumentsByStatus: async (_, { status }) => {
      try {
        return await models.Document.findAll({
          where: { status },
          include: [
            {
              model: models.VisaApplication,
              as: "application",
              attributes: ["id", "applicationNumber", "fullName", "visaType"],
            },
            {
              model: models.Admin,
              as: "reviewer",
              attributes: ["id", "name", "email"],
            },
          ],
          order: [["createdAt", "DESC"]],
        });
      } catch (error) {
        console.error("Error fetching documents by status:", error);
        throw new GraphQLError(
          "상태별 문서를 가져오는 중 오류가 발생했습니다.",
          {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          },
        );
      }
    },
  },

  Mutation: {
    createDocument: async (_, { input }) => {
      try {
        const application = await models.VisaApplication.findByPk(
          input.applicationId,
        );
        if (!application) {
          throw new GraphQLError("비자 신청서를 찾을 수 없습니다.", {
            extensions: { code: "NOT_FOUND" },
          });
        }

        const document = await models.Document.create({
          applicationId: input.applicationId,
          customerName: input.customerName,
          documentType: input.documentType,
          documentName: input.documentName,
          filePath: input.filePath,
          fileSize: input.fileSize,
          fileType: input.fileType,
          status: "uploaded",
        });

        return await models.Document.findByPk(document.id, {
          include: [
            {
              model: models.VisaApplication,
              as: "application",
              attributes: ["id", "applicationNumber", "fullName", "visaType"],
            },
          ],
        });
      } catch (error) {
        console.error("Error creating document:", error);
        if (error.extensions?.code) throw error;
        throw new GraphQLError("문서 생성 중 오류가 발생했습니다.", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },

    updateDocument: async (_, { id, input }) => {
      try {
        const document = await models.Document.findByPk(id);
        if (!document) {
          throw new GraphQLError("문서를 찾을 수 없습니다.", {
            extensions: { code: "NOT_FOUND" },
          });
        }

        await document.update({
          documentType: input.documentType || document.documentType,
          documentName: input.documentName || document.documentName,
          status: input.status || document.status,
          reviewedBy: input.reviewedBy || document.reviewedBy,
          reviewedAt: input.reviewedAt || document.reviewedAt,
          extractedInfo: input.extractedInfo || document.extractedInfo,
        });

        return await models.Document.findByPk(id, {
          include: [
            {
              model: models.VisaApplication,
              as: "application",
              attributes: ["id", "applicationNumber", "fullName", "visaType"],
            },
            {
              model: models.Admin,
              as: "reviewer",
              attributes: ["id", "name", "email"],
            },
          ],
        });
      } catch (error) {
        console.error("Error updating document:", error);
        if (error.extensions?.code) throw error;
        throw new GraphQLError("문서 수정 중 오류가 발생했습니다.", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },

    updateDocumentOcrData: async (_, { id, ocrData }) => {
      try {
        const document = await models.Document.findByPk(id);
        if (!document) {
          throw new GraphQLError("문서를 찾을 수 없습니다.", {
            extensions: { code: "NOT_FOUND" },
          });
        }

        // OCR 데이터를 기반으로 비자 신청서 정보 업데이트
        if (document.applicationId && ocrData) {
          const application = await models.VisaApplication.findByPk(
            document.applicationId,
          );
          if (application) {
            const updateData = {};

            // OCR 데이터에서 관련 정보 추출하여 camelCase로 매핑
            if (ocrData.fullName) updateData.fullName = ocrData.fullName;
            if (ocrData.passportNumber)
              updateData.passportNumber = ocrData.passportNumber;
            if (ocrData.birthDate) updateData.birthDate = ocrData.birthDate;
            if (ocrData.nationality)
              updateData.nationality = ocrData.nationality;
            if (ocrData.gender) updateData.gender = ocrData.gender;

            await application.update(updateData);
          }
        }

        // 문서의 추출된 정보 업데이트
        await document.update({
          extractedInfo: ocrData,
          status: "processed",
        });

        return await models.Document.findByPk(id, {
          include: [
            {
              model: models.VisaApplication,
              as: "application",
              attributes: ["id", "applicationNumber", "fullName", "visaType"],
            },
          ],
        });
      } catch (error) {
        console.error("Error updating document OCR data:", error);
        if (error.extensions?.code) throw error;
        throw new GraphQLError("OCR 데이터 업데이트 중 오류가 발생했습니다.", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },

    bulkUpdateDocumentStatus: async (
      _,
      { documentIds, status, reviewedBy },
    ) => {
      try {
        await models.Document.update(
          {
            status,
            reviewedBy,
            reviewedAt: new Date(),
          },
          {
            where: {
              id: documentIds,
            },
          },
        );

        return await models.Document.findAll({
          where: { id: documentIds },
          include: [
            {
              model: models.VisaApplication,
              as: "application",
              attributes: ["id", "applicationNumber", "fullName", "visaType"],
            },
            {
              model: models.Admin,
              as: "reviewer",
              attributes: ["id", "name", "email"],
            },
          ],
        });
      } catch (error) {
        console.error("Error bulk updating document status:", error);
        throw new GraphQLError(
          "문서 상태 일괄 업데이트 중 오류가 발생했습니다.",
          {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          },
        );
      }
    },
    deleteDocument: async (_, { id }, context) => {
      try {
        // 관리자와 스태프만 문서 삭제 가능
        await requireAuth(context, [
          "SUPER_ADMIN",
          "ADMIN",
          "MANAGER",
          "STAFF",
        ]);

        const document = await models.Document.findByPk(id);
        if (!document) {
          throw new GraphQLError("문서를 찾을 수 없습니다.", {
            extensions: { code: "NOT_FOUND" },
          });
        }

        // 파일 시스템에서 파일 삭제
        if (document.filePath) {
          try {
            await deleteFile(document.filePath);
          } catch (fileError) {
            console.error("Error deleting file:", fileError);
            // 파일 삭제 실패해도 DB 레코드는 삭제 진행
          }
        }

        await document.destroy();

        return {
          success: true,
          message: "문서가 성공적으로 삭제되었습니다.",
        };
      } catch (error) {
        console.error("Error deleting document:", error);
        if (error.extensions?.code) throw error;
        throw new GraphQLError("문서 삭제 중 오류가 발생했습니다.", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },
    deleteDocumentsByApplication: async (_, { applicationId }, context) => {
      try {
        // 관리자와 스태프만 문서 삭제 가능
        await requireAuth(context, [
          "SUPER_ADMIN",
          "ADMIN",
          "MANAGER",
          "STAFF",
        ]);

        const documents = await models.Document.findAll({
          where: { applicationId },
        });

        // 각 문서의 파일 삭제
        for (const document of documents) {
          if (document.filePath) {
            try {
              await deleteFile(document.filePath);
            } catch (fileError) {
              console.error("Error deleting file:", fileError);
              // 파일 삭제 실패해도 계속 진행
            }
          }
        }

        // 모든 문서 DB에서 삭제
        await models.Document.destroy({
          where: { applicationId },
        });

        return {
          success: true,
          message: "신청서의 모든 문서가 성공적으로 삭제되었습니다.",
        };
      } catch (error) {
        console.error("Error deleting documents by application:", error);
        if (error.extensions?.code) throw error;
        throw new GraphQLError("신청서 문서 삭제 중 오류가 발생했습니다.", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },
  },

  Document: {
    application: async (document) => {
      if (document.application) {
        return document.application;
      }
      return await models.VisaApplication.findByPk(document.applicationId);
    },

    reviewer: async (document) => {
      if (document.reviewer) {
        return document.reviewer;
      }
      if (document.reviewedBy) {
        return await models.Admin.findByPk(document.reviewedBy);
      }
      return null;
    },

    // 파일 다운로드 URL 생성
    downloadUrl: (document) => {
      if (!document.filePath) return null;
      return `/api/documents/${document.id}/download`;
    },

    // 파일 미리보기 URL 생성 (이미지용)
    previewUrl: (document) => {
      if (!document.filePath) return null;
      const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp"];
      const ext = path.extname(document.filePath).toLowerCase();
      if (imageExtensions.includes(ext)) {
        return `/api/documents/${document.id}/preview`;
      }
      return null;
    },

    // 파일 크기를 읽기 쉬운 형태로 변환
    formattedFileSize: (document) => {
      if (!document.fileSize) return "0 B";
      const bytes = document.fileSize;
      const sizes = ["B", "KB", "MB", "GB"];
      if (bytes === 0) return "0 B";
      const i = Math.floor(Math.log(bytes) / Math.log(1024));
      return (
        parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + " " + sizes[i]
      );
    },
  },
};

module.exports = documentsResolvers;
