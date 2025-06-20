const fs = require("fs").promises;
const path = require("path");
const crypto = require("crypto");

// 업로드 디렉토리 생성
const createUploadDir = async (applicationId) => {
  const uploadDir = path.join(__dirname, "..", "uploads", applicationId);
  try {
    await fs.mkdir(uploadDir, { recursive: true });
    return uploadDir;
  } catch (error) {
    console.error("Error creating upload directory:", error);
    throw error;
  }
};

// Base64 파일을 디스크에 저장
const saveBase64File = async (
  base64Data,
  fileName,
  applicationId,
  applicantName = null,
  documentType = null,
) => {
  try {
    // Base64 데이터에서 메타데이터 제거
    const base64Content = base64Data.replace(/^data:[^;]+;base64,/, "");

    // 파일 확장자 추출
    const fileExtension = path.extname(fileName);

    // 현재 날짜와 시간을 형식화 (분/초까지)
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hour = String(now.getHours()).padStart(2, "0");
    const minute = String(now.getMinutes()).padStart(2, "0");
    const second = String(now.getSeconds()).padStart(2, "0");
    const timeString = `${year}${month}${day}_${hour}${minute}${second}`;

    // 신청자명_image type_업로드 시간 형식으로 파일명 생성
    let safeFileName;
    if (applicantName && documentType) {
      // 한글 이름은 그대로 사용, 특수문자만 제거
      const cleanApplicantName = applicantName.replace(/[/\\:*?"<>|]/g, "");
      const cleanDocumentType = documentType.replace(/[/\\:*?"<>|]/g, "");
      safeFileName = `${cleanApplicantName}_${cleanDocumentType}_${timeString}${fileExtension}`;
    } else {
      // 기존 방식 (후방 호환성)
      const timestamp = Date.now();
      const randomHash = crypto.randomBytes(8).toString("hex");
      safeFileName = `${timestamp}_${randomHash}${fileExtension}`;
    }

    // 업로드 디렉토리 생성
    const uploadDir = await createUploadDir(applicationId);
    const filePath = path.join(uploadDir, safeFileName);

    // Base64를 버퍼로 변환하여 파일 저장
    const buffer = Buffer.from(base64Content, "base64");
    await fs.writeFile(filePath, buffer);

    // 상대 경로 반환 (웹에서 접근 가능한 URL)
    const relativePath = `/uploads/${applicationId}/${safeFileName}`;

    console.log(`✅ File saved: ${fileName} -> ${relativePath}`);

    return {
      filePath: relativePath,
      originalFileName: fileName,
      savedFileName: safeFileName,
      fileSize: buffer.length,
    };
  } catch (error) {
    console.error("Error saving file:", error);
    throw new Error(`파일 저장 실패: ${error.message}`);
  }
};

// Base64 데이터에서 MIME 타입 추출
const getMimeTypeFromBase64 = (base64Data) => {
  const match = base64Data.match(/^data:([^;]+);base64,/);
  return match ? match[1] : "application/octet-stream";
};

// 파일 타입 검증
const validateFileType = (
  fileName,
  allowedTypes = ["jpg", "jpeg", "png", "pdf"],
) => {
  const fileExtension = path.extname(fileName).toLowerCase().substring(1);
  return allowedTypes.includes(fileExtension);
};

// 파일 크기 검증 (바이트 단위)
const validateFileSize = (base64Data, maxSizeInBytes = 10 * 1024 * 1024) => {
  // 기본 10MB
  const base64Content = base64Data.replace(/^data:[^;]+;base64,/, "");
  const buffer = Buffer.from(base64Content, "base64");
  return buffer.length <= maxSizeInBytes;
};

module.exports = {
  createUploadDir,
  saveBase64File,
  validateFileType,
  validateFileSize,
  getMimeTypeFromBase64,
};
