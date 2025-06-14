const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// 업로드 디렉토리 확인 및 생성
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `${req.body.document_type}_${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('지원하지 않는 파일 형식입니다.'));
    }
  }
});

// 문서 업로드 API
router.post('/upload', upload.single('document'), async (req, res) => {
  // JSON 응답 헤더 설정
  res.setHeader('Content-Type', 'application/json');

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: '파일이 업로드되지 않았습니다.'
      });
    }

    const { document_type, application_id } = req.body;

    if (!document_type || !application_id) {
      return res.status(400).json({
        success: false,
        message: '문서 타입과 신청서 ID가 필요합니다.'
      });
    }

    // 파일 정보를 데이터베이스에 저장 (실제 구현시 DB 로직 추가)
    const documentData = {
      id: Date.now().toString(),
      document_type: document_type,
      document_name: req.file.originalname,
      file_path: req.file.path,
      file_size: req.file.size,
      application_id: application_id,
      uploaded_at: new Date()
    };

    return res.status(200).json({
      success: true,
      message: '파일 업로드가 완료되었습니다.',
      document: documentData
    });

  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || '파일 업로드 중 오류가 발생했습니다.'
    });
  }
});

// 에러 핸들링 미들웨어
router.use((error, req, res, next) => {
  res.setHeader('Content-Type', 'application/json');

  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: '파일 크기가 10MB를 초과했습니다.'
      });
    }
  }

  return res.status(500).json({
    success: false,
    message: error.message || '서버 오류가 발생했습니다.'
  });
});

module.exports = router;