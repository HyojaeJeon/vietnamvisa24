const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 업로드 디렉토리 생성
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 파일 저장 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const subDir = path.join(uploadDir, req.body.application_id || 'temp');
    if (!fs.existsSync(subDir)) {
      fs.mkdirSync(subDir, { recursive: true });
    }
    cb(null, subDir);
  },
  filename: (req, file, cb) => {
    // 파일명: timestamp_originalname
    const timestamp = Date.now();
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, `${timestamp}_${sanitizedName}`);
  }
});

// 파일 필터 설정
const fileFilter = (req, file, cb) => {
  // 허용되는 파일 타입
  const allowedTypes = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('지원되지 않는 파일 형식입니다. (JPG, PNG, PDF, DOC, DOCX만 허용)'), false);
  }
};

// Multer 설정
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB 제한
    files: 5 // 한번에 최대 5개 파일
  }
});

// 단일 파일 업로드
const uploadSingle = upload.single('document');

// 다중 파일 업로드
const uploadMultiple = upload.array('documents', 5);

// 에러 핸들링 미들웨어
const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: '파일 크기가 10MB를 초과합니다.'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: '한번에 최대 5개 파일까지 업로드 가능합니다.'
      });
    }
  }

  if (error.message.includes('지원되지 않는 파일 형식')) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }

  next(error);
};

// 파일 다운로드 유틸리티
const downloadFile = (filePath, res) => {
  const absolutePath = path.resolve(filePath);
  
  if (!fs.existsSync(absolutePath)) {
    return res.status(404).json({
      success: false,
      message: '파일을 찾을 수 없습니다.'
    });
  }

  res.download(absolutePath, (err) => {
    if (err) {
      console.error('파일 다운로드 오류:', err);
      return res.status(500).json({
        success: false,
        message: '파일 다운로드 중 오류가 발생했습니다.'
      });
    }
  });
};

// 파일 삭제 유틸리티
const deleteFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('파일 삭제 오류:', error);
    return false;
  }
};

module.exports = {
  uploadSingle,
  uploadMultiple,
  handleUploadError,
  downloadFile,
  deleteFile
};
