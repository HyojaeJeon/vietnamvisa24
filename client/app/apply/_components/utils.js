// Utility functions for the apply form

import { ADDITIONAL_SERVICES } from "./types.js";

export const formatCurrency = (amount, currency = "KRW") => {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: currency,
  }).format(amount);
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString("ko-KR");
};

export const validateEmail = (email) => {
  // 더 정확한 이메일 정규식
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email) && email.length <= 254;
};

export const validatePhone = (phone) => {
  // 국제 전화번호 형식 검증 (한국: +82, 베트남: +84 등)
  const phoneRegex = /^(\+\d{1,3}[-.\s]?)?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;
  const cleanPhone = phone.replace(/[\s\-()]/g, '');

  // 최소 8자리, 최대 15자리 (국제표준)
  return phoneRegex.test(phone) && cleanPhone.length >= 8 && cleanPhone.length <= 15;
};

export const validatePassport = (passport) => {
  return passport.length >= 6 && passport.length <= 12;
};

export const calculateVisaPrice = (visaType, processingType) => {
  const basePrices = {
    general: 25000,
    business: 35000,
    tourist: 20000,
    transit: 15000,
  };

  const processingMultipliers = {
    standard: 1,
    express: 1.5,
    urgent: 2,
  };

  const basePrice = basePrices[visaType] || basePrices.general;
  const multiplier = processingMultipliers[processingType] || 1;

  return Math.round(basePrice * multiplier);
};

export const getStepTitle = (step) => {
  const titles = {
    1: "서비스 선택",
    2: "개인정보 입력",
    3: "연락처 정보",
    4: "여행 정보",
    5: "서류 업로드",
    6: "신청 내용 확인",
    7: "결제",
    8: "신청 완료",
  };
  return titles[step] || `단계 ${step}`;
};

export const getStepDescription = (step) => {
  const descriptions = {
    1: "원하시는 서비스를 선택해주세요",
    2: "개인정보를 입력해주세요",
    3: "연락처 정보를 입력해주세요",
    4: "여행 정보를 입력해주세요",
    5: "필수 서류를 업로드해주세요",
    6: "입력하신 정보를 확인해주세요",
    7: "결제를 진행해주세요",
    8: "신청이 완료되었습니다",
  };
  return descriptions[step] || "";
};

export const validateStep = (step, formData) => {
  console.log("formData : ", formData);
  switch (step) {
    case 1:
      // Step 1에서는 serviceType, visaDurationType(E-visa인 경우), processingType이 필요
      if (!formData.serviceType) return false;
      if (formData.serviceType === "e_visa" && !formData.visaDurationType) return false;
      return formData.processingType;
    case 2:
      return (
        formData?.personalInfo?.email &&
        formData?.personalInfo?.phone &&
        formData?.personalInfo?.address &&
        validateEmail(formData?.personalInfo?.email) &&
        validatePhone(formData?.personalInfo?.phone) &&
        formData?.personalInfo?.phoneOfFriend
      );
    case 3:
      return formData?.travelInfo?.entryDate && formData?.travelInfo?.entryPort;
    case 4: {
      // 서류 업로드 단계: passport와 photo가 필수
      const documents = formData.documents || {};
      const hasPassport = documents.passport;
      const hasPhoto = documents.photo; // 증명사진이 있고 검증 결과가 있다면 적합한지 확인
      const photoValidation = documents.photo?.validationResult;
      const isPhotoSuitable = !photoValidation || (photoValidation?.result || photoValidation) === "SUITABLE";

      return hasPassport && hasPhoto && isPhotoSuitable;
    }
    case 5:
      return true; // Review step
    case 7:
      return formData.paymentMethod && formData.agreementAccepted;
    default:
      return false;
  }
};

// Safe localStorage wrapper for SSR compatibility
export const safeLocalStorage = {
  getItem: (key) => {
    if (typeof window !== "undefined") {
      try {
        return localStorage.getItem(key);
      } catch (error) {
        console.error("LocalStorage getItem error:", error);
        return null;
      }
    }
    return null;
  },
  setItem: (key, value) => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(key, value);
      } catch (error) {
        console.error("LocalStorage setItem error:", error);
      }
    }
  },
  removeItem: (key) => {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error("LocalStorage removeItem error:", error);
      }
    }
  },
};

// Generate random application ID with prefix
export const generateApplicationId = () => {
  const prefix = "VN";
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}${timestamp}${random}`;
};

// Format currency to Korean Won
export const formatCurrency = (amount) => {
  if (typeof amount !== 'number') {
    return '₩0';
  }
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW'
  }).format(amount);
};

// Calculate total price including base price and additional services
export const calculateTotalPrice = (formData) => {
  let basePrice = calculateVisaPrice(formData.visaType, formData.processingType);

  // Add additional services
  if (formData.additionalServices && formData.additionalServices.length > 0) {
    const additionalServicesPrice = formData.additionalServices.reduce((total, serviceId) => {
      // Find service price from ADDITIONAL_SERVICES
      const service = ADDITIONAL_SERVICES?.find((s) => s.id === serviceId);
      return total + (service?.price || 0);
    }, 0);
    basePrice += additionalServicesPrice;
  }

  return basePrice;
};

// Validation helper functions
const validateEmailField = (value) => {
  const errors = [];
  if (!validateEmail(value)) {
    errors.push("올바른 이메일 형식이 아닙니다.");
  }
  return errors;
};

const validatePhoneField = (value) => {
  const errors = [];
  if (!validatePhone(value)) {
    errors.push("올바른 전화번호 형식이 아닙니다.");
  }
  return errors;
};

const validatePassportField = (value) => {
  const errors = [];
  if (!validatePassport(value)) {
    errors.push("여권번호는 6-12자리여야 합니다.");
  }
  return errors;
};

const validatePassportExpiryField = (value) => {
  const errors = [];
  if (value) {
    const expiryDate = new Date(value);
    const sixMonthsFromNow = new Date();
    sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
    if (expiryDate < sixMonthsFromNow) {
      errors.push("여권 만료일이 6개월 이상 남아있어야 합니다.");
    }
  }
  return errors;
};

const validateBirthDateField = (value) => {
  const errors = [];
  if (value) {
    const birthDate = new Date(value);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    if (age < 0 || age > 120) {
      errors.push("올바른 생년월일을 입력해주세요.");
    }
  }
  return errors;
};

// Get field validation errors
export const getFieldErrors = (field, value, formData = {}) => {
  switch (field) {
    case "email":
      return validateEmailField(value);
    case "phone":
      return validatePhoneField(value);
    case "passportNumber":
      return validatePassportField(value);
    case "passportExpiry":
      return validatePassportExpiryField(value);
    case "birthDate":
      return validateBirthDateField(value);
    default:
      return [];
  }
};

// 파일 업로드 관련 유틸리티 함수들
export const convertBase64ToFile = (base64String, fileName, fileType) => {
  const arr = base64String.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], fileName, { type: fileType || mime });
};

// 서버에 파일 업로드하는 함수 (최종 제출 시 사용)
export const uploadFileToServer = async (file, documentType, applicationId) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("documentType", documentType);
  formData.append("applicationId", applicationId);

  try {
    const response = await fetch("/api/upload-document", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`업로드 실패: ${response.statusText}`);
    }

    const result = await response.json();
    return result.fileUrl; // 서버에서 반환하는 파일 URL
  } catch (error) {
    console.error("파일 업로드 오류:", error);
    throw error;
  }
};

// 모든 임시 문서를 서버에 업로드하는 함수
export const uploadAllDocuments = async (documents, applicationId) => {
  const uploadPromises = [];
  const documentUrls = {};

  for (const [documentType, documentData] of Object.entries(documents)) {
    if (documentData.isTemporary && documentData.file) {
      const file = convertBase64ToFile(documentData.file, documentData.fileName, documentData.fileType);

      const uploadPromise = uploadFileToServer(file, documentType, applicationId).then((fileUrl) => {
        documentUrls[documentType] = {
          ...documentData,
          fileUrl,
          isTemporary: false,
          uploadedToServer: true,
        };
      });

      uploadPromises.push(uploadPromise);
    } else {
      // 이미 서버에 업로드된 파일은 그대로 유지
      documentUrls[documentType] = documentData;
    }
  }

  await Promise.all(uploadPromises);
  return documentUrls;
};