const express = require("express");
const router = express.Router();
const { models } = require("../models");
const { uploadSingle, uploadMultiple, handleUploadError, downloadFile, deleteFile } = require("../middleware/upload");
const path = require("path");
const fs = require("fs");
const archiver = require("archiver");
const multer = require('multer');

// 업로드 디렉토리 생성
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// 단일 파일 업로드
router.post('/upload', uploadSingle, async (req, res) => {
  console.log(`📤 File upload request received at /upload`);
  console.log(`📤 Request body:`, req.body);
  console.log(`📤 Request file:`, req.file ? 'File present' : 'No file');
  
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: '파일이 업로드되지 않았습니다.'
      });
    }

    const { application_id, document_type } = req.body;

    if (!application_id || !document_type) {
      return res.status(400).json({
        success: false,
        message: '필수 정보가 누락되었습니다.'
      });
    }

    // 임시 application_id인 경우 비자 신청을 먼저 생성
    let actualApplicationId = application_id;
    if (application_id.startsWith('temp_')) {
      const visaApplication = await models.VisaApplication.create({
        application_number: `APP-${Date.now()}`,
        visa_type: 'tourist',
        full_name: '임시 신청자',
        passport_number: 'TEMP',
        nationality: 'KR',
        birth_date: '1990-01-01',
        phone: '010-0000-0000',
        email: 'temp@example.com',
        arrival_date: new Date(),
        departure_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30일 후
        status: 'pending'
      });
      actualApplicationId = visaApplication.id;
    }

    // 파일 정보로 문서 레코드 생성
    const document = await models.Document.create({
      application_id: actualApplicationId,
      document_type: document_type,
      document_name: req.file.originalname,
      file_path: req.file.path,
      file_size: req.file.size,
      status: 'pending'
    });

    res.json({
      success: true,
      message: '파일이 성공적으로 업로드되었습니다.',
      document: {
        id: document.id,
        document_type: document.document_type,
        document_name: document.document_name,
        file_size: document.file_size,
        status: document.status,
        uploaded_at: document.created_at
      }
    });

  } catch (error) {
    console.error('File upload error:', error);

    // 업로드된 파일이 있다면 삭제
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: '파일 업로드 중 오류가 발생했습니다.',
      error: error.message
    });
  }
});

// 문서 업로드 - 다중 파일
router.post("/upload-multiple", uploadMultiple, async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "파일이 업로드되지 않았습니다.",
      });
    }

    const { application_id, document_types, notes } = req.body;

    if (!application_id) {
      return res.status(400).json({
        success: false,
        message: "신청 ID가 필요합니다.",
      });
    }

    // 비자 신청이 존재하는지 확인
    const application = await models.VisaApplication.findByPk(application_id);
    if (!application) {
      // 업로드된 파일들 삭제
      req.files.forEach((file) => deleteFile(file.path));
      return res.status(404).json({
        success: false,
        message: "비자 신청을 찾을 수 없습니다.",
      });
    }

    const documents = [];
    const documentTypesArray = typeof document_types === "string" ? JSON.parse(document_types) : document_types;

    // 각 파일에 대해 문서 레코드 생성
    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      const documentType = documentTypesArray?.[i] || "other";

      const document = await models.Document.create({
        application_id: parseInt(application_id),
        document_type: documentType,
        document_name: file.originalname,
        file_path: file.path,
        file_size: file.size,
        status: "pending",
        notes: notes || null,
      });

      documents.push({
        id: document.id,
        document_name: document.document_name,
        document_type: document.document_type,
        file_size: document.file_size,
        status: document.status,
        uploaded_at: document.created_at,
      });
    }

    res.json({
      success: true,
      message: `${documents.length}개의 파일이 성공적으로 업로드되었습니다.`,
      documents,
    });
  } catch (error) {
    console.error("다중 문서 업로드 오류:", error);

    // 업로드된 파일들이 있다면 삭제
    if (req.files) {
      req.files.forEach((file) => deleteFile(file.path));
    }

    res.status(500).json({
      success: false,
      message: "문서 업로드 중 오류가 발생했습니다.",
    });
  }
});

// 문서 다운로드
router.get("/download/:id", async (req, res) => {
  try {
    const documentId = req.params.id;

    const document = await models.Document.findByPk(documentId);
    if (!document) {
      return res.status(404).json({
        success: false,
        message: "문서를 찾을 수 없습니다.",
      });
    }

    downloadFile(document.file_path, res);
  } catch (error) {
    console.error("문서 다운로드 오류:", error);
    res.status(500).json({
      success: false,
      message: "문서 다운로드 중 오류가 발생했습니다.",
    });
  }
});

// 문서 미리보기 (이미지용)
router.get("/preview/:id", async (req, res) => {
  try {
    const documentId = req.params.id;

    const document = await models.Document.findByPk(documentId);
    if (!document) {
      return res.status(404).json({
        success: false,
        message: "문서를 찾을 수 없습니다.",
      });
    }

    const filePath = path.resolve(document.file_path);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "파일을 찾을 수 없습니다.",
      });
    }

    // 파일 확장자 확인
    const ext = path.extname(document.document_name).toLowerCase();
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif"];

    if (imageExtensions.includes(ext)) {
      res.sendFile(filePath);
    } else {
      res.status(400).json({
        success: false,
        message: "미리보기를 지원하지 않는 파일 형식입니다.",
      });
    }
  } catch (error) {
    console.error("문서 미리보기 오류:", error);
    res.status(500).json({
      success: false,
      message: "문서 미리보기 중 오류가 발생했습니다.",
    });
  }
});

// 문서 삭제
router.delete("/:id", async (req, res) => {
  try {
    const documentId = req.params.id;

    const document = await models.Document.findByPk(documentId);
    if (!document) {
      return res.status(404).json({
        success: false,
        message: "문서를 찾을 수 없습니다.",
      });
    }

    // 파일 시스템에서 파일 삭제
    const fileDeleted = deleteFile(document.file_path);

    // 데이터베이스에서 레코드 삭제
    await document.destroy();

    res.json({
      success: true,
      message: "문서가 성공적으로 삭제되었습니다.",
      fileDeleted,
    });
  } catch (error) {
    console.error("문서 삭제 오류:", error);
    res.status(500).json({
      success: false,
      message: "문서 삭제 중 오류가 발생했습니다.",
    });
  }
});

// 신청별 문서 목록 조회
router.get("/application/:applicationId", async (req, res) => {
  try {
    const applicationId = req.params.applicationId;

    const documents = await models.Document.findAll({
      where: { application_id: applicationId },
      include: [
        {
          model: models.Admin,
          as: "reviewer",
          attributes: ["id", "name", "email"],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    res.json({
      success: true,
      documents: documents.map((doc) => ({
        id: doc.id,
        document_type: doc.document_type,
        document_name: doc.document_name,
        file_size: doc.file_size,
        status: doc.status,
        uploaded_at: doc.created_at,
        reviewed_at: doc.reviewed_at,
        reviewer: doc.reviewer ? doc.reviewer.name : null,
        notes: doc.notes,
      })),
    });
  } catch (error) {
    console.error("문서 목록 조회 오류:", error);
    res.status(500).json({
      success: false,
      message: "문서 목록 조회 중 오류가 발생했습니다.",
    });
  }
});

// 애플리케이션별 문서 일괄 다운로드 (ZIP)
router.get("/application/:applicationId/download-zip", async (req, res) => {
  try {
    const applicationId = req.params.applicationId;

    // 해당 애플리케이션의 모든 문서 조회
    const documents = await models.Document.findAll({
      where: { application_id: applicationId },
      include: [
        {
          model: models.VisaApplication,
          as: "application",
          attributes: ["application_number", "full_name"],
        },
      ],
    });

    if (documents.length === 0) {
      return res.status(404).json({
        success: false,
        message: "다운로드할 문서가 없습니다.",
      });
    }

    const application = documents[0].application;
    const applicationNumber = application.application_number || `app_${applicationId}`;
    const zipFileName = `${applicationNumber}_documents.zip`;

    // ZIP 스트림 설정
    const archive = archiver("zip", {
      zlib: { level: 9 }, // 압축 레벨 설정
    });

    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", `attachment; filename="${zipFileName}"`);

    archive.pipe(res);

    // 각 문서를 ZIP에 추가
    let addedFiles = 0;
    for (const document of documents) {
      if (fs.existsSync(document.file_path)) {
        // 파일명에 문서 타입 접두사 추가
        const fileExt = path.extname(document.document_name);
        const baseName = path.basename(document.document_name, fileExt);
        const zipEntryName = `${document.document_type}_${baseName}${fileExt}`;

        archive.file(document.file_path, { name: zipEntryName });
        addedFiles++;
      }
    }

    if (addedFiles === 0) {
      return res.status(404).json({
        success: false,
        message: "다운로드 가능한 파일이 없습니다.",
      });
    }

    // ZIP 파일 완료 및 전송
    archive.finalize();
  } catch (error) {
    console.error("ZIP 다운로드 오류:", error);
    res.status(500).json({
      success: false,
      message: "ZIP 파일 생성 중 오류가 발생했습니다.",
    });
  }
});

// 문서 상태 일괄 업데이트
router.patch("/bulk-update", async (req, res) => {
  try {
    const { documentIds, status, notes, reviewerId } = req.body;

    if (!documentIds || !Array.isArray(documentIds) || documentIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "문서 ID 목록이 필요합니다.",
      });
    }

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "업데이트할 상태가 필요합니다.",
      });
    }

    const updateData = {
      status,
      reviewed_at: new Date(),
    };

    if (notes) {
      updateData.notes = notes;
    }

    if (reviewerId) {
      updateData.reviewed_by = reviewerId;
    }

    const [updatedCount] = await models.Document.update(updateData, {
      where: {
        id: documentIds,
      },
    });

    res.json({
      success: true,
      message: `${updatedCount}개의 문서가 업데이트되었습니다.`,
      updatedCount,
    });
  } catch (error) {
    console.error("일괄 업데이트 오류:", error);
    res.status(500).json({
      success: false,
      message: "문서 일괄 업데이트 중 오류가 발생했습니다.",
    });
  }
});

// 에러 핸들링 미들웨어 적용
router.use(handleUploadError);

module.exports = router;