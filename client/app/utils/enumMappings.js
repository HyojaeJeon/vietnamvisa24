/**
 * ENUM 값들의 다국어 매핑 유틸리티
 * 서버에서는 모든 ENUM 값을 영문 대문자로 저장하고,
 * 클라이언트에서는 언어별로 적절한 라벨을 표시합니다.
 */

// 상태 매핑
export const STATUS_MAPPINGS = {
  ko: {
    PENDING: "접수 완료",
    PROCESSING: "처리 중",
    DOCUMENT_REVIEW: "서류 검토",
    SUBMITTED_TO_AUTHORITY: "기관 제출",
    APPROVED: "승인 완료",
    REJECTED: "승인 거부",
    COMPLETED: "발급 완료",
  },
  en: {
    PENDING: "Application Received",
    PROCESSING: "Processing",
    DOCUMENT_REVIEW: "Document Review",
    SUBMITTED_TO_AUTHORITY: "Submitted to Authority",
    APPROVED: "Approved",
    REJECTED: "Rejected",
    COMPLETED: "Completed",
  },
  vi: {
    PENDING: "Đã tiếp nhận",
    PROCESSING: "Đang xử lý",
    DOCUMENT_REVIEW: "Xem xét hồ sơ",
    SUBMITTED_TO_AUTHORITY: "Đã nộp cho cơ quan",
    APPROVED: "Đã phê duyệt",
    REJECTED: "Từ chối",
    COMPLETED: "Hoàn thành",
  },
};

// 비자 타입 매핑
export const VISA_TYPE_MAPPINGS = {
  ko: {
    E_VISA_GENERAL: "E-VISA 일반",
    E_VISA_URGENT: "E-VISA 긴급",
    E_VISA_TRANSIT: "E-VISA 경유",
    TOURIST: "관광 비자",
    BUSINESS: "사업 비자",
    WORK: "취업 비자",
    STUDENT: "학생 비자",
  },
  en: {
    E_VISA_GENERAL: "E-VISA General",
    E_VISA_URGENT: "E-VISA Urgent",
    E_VISA_TRANSIT: "E-VISA Transit",
    TOURIST: "Tourist Visa",
    BUSINESS: "Business Visa",
    WORK: "Work Visa",
    STUDENT: "Student Visa",
  },
  vi: {
    E_VISA_GENERAL: "E-VISA Thông thường",
    E_VISA_URGENT: "E-VISA Khẩn cấp",
    E_VISA_TRANSIT: "E-VISA Quá cảnh",
    TOURIST: "Visa du lịch",
    BUSINESS: "Visa kinh doanh",
    WORK: "Visa lao động",
    STUDENT: "Visa du học",
  },
};

// 처리 유형 매핑
export const PROCESSING_TYPE_MAPPINGS = {
  ko: {
    STANDARD: "일반 처리 (3-4일)",
    EXPRESS: "급행 처리",
    URGENT: "긴급 처리",
    "1시간": "1시간 특급",
    "2시간": "2시간 특급",
    "4시간": "4시간 특급",
    "1일": "1일 특급",
    "2일": "2일 특급",
  },
  en: {
    STANDARD: "Standard Processing (3-4 days)",
    EXPRESS: "Express Processing",
    URGENT: "Urgent Processing",
    "1시간": "1 Hour Express",
    "2시간": "2 Hour Express",
    "4시간": "4 Hour Express",
    "1일": "1 Day Express",
    "2일": "2 Day Express",
  },
  vi: {
    STANDARD: "Xử lý tiêu chuẩn (3-4 ngày)",
    EXPRESS: "Xử lý nhanh",
    URGENT: "Xử lý khẩn cấp",
    "1시간": "Siêu tốc 1 giờ",
    "2시간": "Siêu tốc 2 giờ",
    "4시간": "Siêu tốc 4 giờ",
    "1일": "Siêu tốc 1 ngày",
    "2일": "Siêu tốc 2 ngày",
  },
};

/**
 * 상태 라벨을 가져오는 함수
 * @param {string} status - 영문 대문자 상태값
 * @param {string} language - 언어 코드 (ko, en, vi)
 * @returns {string} 현지화된 라벨
 */
export const getStatusLabel = (status, language = "ko") => {
  return STATUS_MAPPINGS[language]?.[status] || status;
};

/**
 * 비자 타입 라벨을 가져오는 함수
 * @param {string} visaType - 영문 대문자 비자 타입값
 * @param {string} language - 언어 코드 (ko, en, vi)
 * @returns {string} 현지화된 라벨
 */
export const getVisaTypeLabel = (visaType, language = "ko") => {
  return VISA_TYPE_MAPPINGS[language]?.[visaType] || visaType;
};

/**
 * 처리 유형 라벨을 가져오는 함수
 * @param {string} processingType - 처리 유형값
 * @param {string} language - 언어 코드 (ko, en, vi)
 * @returns {string} 현지화된 라벨
 */
export const getProcessingTypeLabel = (processingType, language = "ko") => {
  return PROCESSING_TYPE_MAPPINGS[language]?.[processingType] || processingType;
};

/**
 * 클라이언트에서 서버로 전송할 때 ENUM 값을 대문자로 변환
 * @param {string} value - 변환할 값
 * @returns {string} 대문자로 변환된 값
 */
export const normalizeEnumValue = (value) => {
  if (!value) return value;
  return value.toUpperCase().replace(/\s+/g, "_");
};

/**
 * 기존 한국어 매핑 함수들 (호환성 유지)
 */
export const getStatusBadgeText = (status) => getStatusLabel(status, "ko");
export const getVisaTypeBadgeText = (visaType) => getVisaTypeLabel(visaType, "ko");
export const getProcessingTypeBadgeText = (processingType) => getProcessingTypeLabel(processingType, "ko");
