const { models } = require("../../../models");
const { AuthenticationError, NotFoundError } = require("../../../utils/errorTypes");
const { deleteFile } = require("../../../middleware/upload");
const path = require("path");
const fs = require("fs");

const documentsResolvers = {
  Query: {
    getDocuments: async (_, __, { adminToken }) => {
      // 관리자 권한 확인 (옵션)
      // const admin = await getAdminFromToken(adminToken);
      // if (!admin) throw new AuthenticationError('Authentication required');

      return await models.Document.findAll({
        include: [
          {
            model: models.VisaApplication,
            as: "application",
            attributes: ["id", "application_number", "full_name", "visa_type"],
          },
          {
            model: models.Admin,
            as: "reviewer",
            attributes: ["id", "name", "email"],
          },
        ],
        order: [["created_at", "DESC"]],
      });
    },

    getDocumentsByApplication: async (_, { applicationId }) => {
      const application = await models.VisaApplication.findByPk(applicationId);
      if (!application) {
        throw new NotFoundError("Visa application not found");
      }

      return await models.Document.findAll({
        where: { application_id: applicationId },
        include: [
          {
            model: models.VisaApplication,
            as: "application",
            attributes: ["id", "application_number", "full_name"],
          },
          {
            model: models.Admin,
            as: "reviewer",
            attributes: ["id", "name", "email"],
          },
        ],
        order: [["created_at", "DESC"]],
      });
    },

    getDocument: async (_, { id }) => {
      const document = await models.Document.findByPk(id, {
        include: [
          {
            model: models.VisaApplication,
            as: "application",
            attributes: ["id", "application_number", "full_name", "visa_type"],
          },
          {
            model: models.Admin,
            as: "reviewer",
            attributes: ["id", "name", "email"],
          },
        ],
      });

      if (!document) {
        throw new NotFoundError("Document not found");
      }

      return document;
    },

    getDocumentTypes: async () => {
      // 문서 타입 목록 반환
      return [
        { value: "passport", label: "여권 사본", required: true },
        { value: "photo", label: "증명사진", required: true },
        { value: "invitation", label: "초청장", required: false },
        { value: "health_certificate", label: "건강증명서", required: false },
        { value: "criminal_record", label: "무범죄증명서", required: false },
        { value: "financial_proof", label: "재정증명서", required: false },
        { value: "employment_certificate", label: "재직증명서", required: false },
        { value: "business_license", label: "사업자등록증", required: false },
        { value: "other", label: "기타 서류", required: false },
      ];
    },

    getDocumentStatistics: async (_, { applicationId }) => {
      const whereClause = applicationId ? { application_id: applicationId } : {};

      const [total, pending, approved, rejected] = await Promise.all([
        models.Document.count({ where: whereClause }),
        models.Document.count({ where: { ...whereClause, status: "pending" } }),
        models.Document.count({ where: { ...whereClause, status: "approved" } }),
        models.Document.count({ where: { ...whereClause, status: "revision_required" } }),
      ]);

      return {
        total,
        pending,
        approved,
        rejected: rejected,
        review_rate: total > 0 ? Math.round(((approved + rejected) / total) * 100) : 0,
      };
    },
  },
  Mutation: {
    createDocument: async (_, { input }) => {
      const application = await models.VisaApplication.findByPk(input.application_id);
      if (!application) {
        throw new NotFoundError("Visa application not found");
      }

      return await models.Document.create({
        ...input,
        status: "pending",
        uploaded_at: new Date(),
      });
    },

    updateDocumentStatus: async (_, { id, status, notes }, { adminToken }) => {
      // 관리자 권한 확인 로직 (필요시 활성화)
      // const admin = await getAdminFromToken(adminToken);
      // if (!admin) throw new AuthenticationError('Authentication required');

      const document = await models.Document.findByPk(id);

      if (!document) {
        throw new NotFoundError("Document not found");
      }

      const updateData = {
        status,
        reviewed_at: new Date(),
      };

      if (notes !== undefined) {
        updateData.notes = notes;
      }

      // 관리자 정보가 있는 경우 reviewer 설정
      // if (admin) {
      //   updateData.reviewed_by = admin.id;
      // }

      await document.update(updateData);

      return await models.Document.findByPk(id, {
        include: [
          {
            model: models.VisaApplication,
            as: "application",
            attributes: ["id", "application_number", "full_name"],
          },
          {
            model: models.Admin,
            as: "reviewer",
            attributes: ["id", "name", "email"],
          },
        ],
      });
    },

    bulkUpdateDocumentStatus: async (_, { ids, status, notes }, { adminToken }) => {
      // 관리자 권한 확인
      // const admin = await getAdminFromToken(adminToken);
      // if (!admin) throw new AuthenticationError('Authentication required');

      const updateData = {
        status,
        reviewed_at: new Date(),
      };

      if (notes !== undefined) {
        updateData.notes = notes;
      }

      const [updatedCount] = await models.Document.update(updateData, {
        where: { id: ids },
      });

      return {
        success: updatedCount > 0,
        message: updatedCount > 0 ? `${updatedCount}개의 문서 상태가 업데이트되었습니다.` : "업데이트된 문서가 없습니다.",
        updatedCount,
      };
    },

    deleteDocument: async (_, { id }, { adminToken }) => {
      // 관리자 권한 확인
      // const admin = await getAdminFromToken(adminToken);
      // if (!admin) throw new AuthenticationError('Authentication required');

      const document = await models.Document.findByPk(id);

      if (!document) {
        throw new NotFoundError("Document not found");
      }

      // 파일 시스템에서 파일 삭제
      if (document.file_path && fs.existsSync(document.file_path)) {
        deleteFile(document.file_path);
      }

      await document.destroy();

      return {
        success: true,
        message: "Document deleted successfully",
      };
    },

    deleteDocumentsByApplication: async (_, { applicationId }, { adminToken }) => {
      // 관리자 권한 확인
      // const admin = await getAdminFromToken(adminToken);
      // if (!admin) throw new AuthenticationError('Authentication required');

      const documents = await models.Document.findAll({
        where: { application_id: applicationId },
      });

      // 각 문서의 파일 삭제
      for (const document of documents) {
        if (document.file_path && fs.existsSync(document.file_path)) {
          deleteFile(document.file_path);
        }
      }

      const deletedCount = await models.Document.destroy({
        where: { application_id: applicationId },
      });

      return {
        success: deletedCount > 0,
        message: deletedCount > 0 ? `${deletedCount}개의 문서가 삭제되었습니다.` : "삭제된 문서가 없습니다.",
        deletedCount,
      };
    },
  },

  // Document 타입 리졸버
  Document: {
    application: async (document) => {
      return await models.VisaApplication.findByPk(document.application_id);
    },

    reviewer: async (document) => {
      if (!document.reviewed_by) return null;
      return await models.Admin.findByPk(document.reviewed_by);
    },

    // 파일 다운로드 URL 생성
    downloadUrl: (document) => {
      return `/api/documents/download/${document.id}`;
    },

    // 파일 미리보기 URL 생성 (이미지용)
    previewUrl: (document) => {
      const imageExtensions = [".jpg", ".jpeg", ".png", ".gif"];
      const ext = path.extname(document.document_name).toLowerCase();

      if (imageExtensions.includes(ext)) {
        return `/api/documents/preview/${document.id}`;
      }
      return null;
    },

    // 파일 크기를 읽기 쉬운 형태로 변환
    formattedFileSize: (document) => {
      const bytes = document.file_size;
      if (bytes === 0) return "0 Bytes";

      const k = 1024;
      const sizes = ["Bytes", "KB", "MB", "GB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));

      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    },
  },
};

module.exports = documentsResolvers;
