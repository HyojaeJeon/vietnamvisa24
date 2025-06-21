// Utility functions for the apply form

import { ADDITIONAL_SERVICES, VISA_PRICES, VISA_TYPES, TRANSIT_VEHICLE_TYPES, PROCESSING_TYPES } from "./types.js";

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
  const cleanPhone = phone.replace(/[\s\-()]/g, "");

  // 최소 8자리, 최대 15자리 (국제표준)
  return phoneRegex.test(phone) && cleanPhone.length >= 8 && cleanPhone.length <= 15;
};

export const validatePassport = (passport) => {
  return passport.length >= 6 && passport.length <= 12;
};

/**
 * 비자 기본 가격 계산
 * @param {string} visaType - 비자 타입
 * @param {string} visaDurationType - 비자 기간 타입 (SINGLE, MULTIPLE)
 * @param {string} processingType - 처리 타입 (GENERAL, EXPRESS_1HOUR, etc.)
 * @param {number} transitPeopleCount - 목바이 경유 시 인원 수
 * @param {string} transitVehicleType - 목바이 경유 시 차량 타입
 * @returns {object} { basePrice, vehiclePrice, totalVisaPrice }
 */
export const calculateVisaPrice = (visaType, visaDurationType, processingType, transitPeopleCount, transitVehicleType) => {
  let basePrice = 0;
  let vehiclePrice = 0;
  if (visaType === VISA_TYPES.E_VISA_TRANSIT) {
    // 목바이 경유 비자
    const peopleCount = Math.min(Math.max(transitPeopleCount || 1, 1), 3);
    const priceCategory = visaDurationType === "MULTIPLE_90" ? "E_VISA_TRANSIT_MULTIPLE" : "E_VISA_TRANSIT_SINGLE";
    basePrice = VISA_PRICES[priceCategory][peopleCount] || 0;

    // 차량 추가 비용
    if (transitVehicleType) {
      const vehicleInfo = TRANSIT_VEHICLE_TYPES.find((v) => v.id === transitVehicleType);
      vehiclePrice = vehicleInfo?.price || 0;
    }
  } else {
    // 일반 E-VISA
    const priceCategory = visaDurationType === "MULTIPLE_90" || visaDurationType === "MULTIPLE" ? "E_VISA_MULTIPLE" : "E_VISA_SINGLE";
    const priceKey =
      processingType === ""
        ? "GENERAL"
        : processingType.replace(/\d+시간|\d+일/g, (match) => {
            switch (match) {
              case "1시간":
                return "EXPRESS_1HOUR";
              case "2시간":
                return "EXPRESS_2HOUR";
              case "4시간":
                return "EXPRESS_4HOUR";
              case "1일":
                return "EXPRESS_1DAY";
              case "2일":
                return "EXPRESS_2DAY";
              case "3일":
                return "EXPRESS_3DAY";
              default:
                return "GENERAL";
            }
          });

    basePrice = VISA_PRICES[priceCategory]?.[priceKey] || VISA_PRICES[priceCategory]?.GENERAL || 0;
  }

  return {
    basePrice,
    vehiclePrice,
    totalVisaPrice: basePrice + vehiclePrice,
  };
};

/**
 * 추가 서비스 가격 계산
 * @param {string[]} additionalServices - 선택된 추가 서비스 ID 배열
 * @returns {object} { services: [{id, name, price}], totalPrice }
 */
export const calculateAdditionalServicesPrice = (additionalServices = []) => {
  const services = additionalServices
    .map((serviceId) => {
      const service = ADDITIONAL_SERVICES.find((s) => s.id === serviceId);
      return service
        ? {
            id: serviceId,
            name: service.name,
            price: service.price,
          }
        : null;
    })
    .filter(Boolean);

  const totalPrice = services.reduce((sum, service) => sum + service.price, 0);

  return {
    services,
    totalPrice,
  };
};

/**
 * 가격을 통화별로 포맷팅
 * @param {number} price - 가격
 * @param {string} visaType - 비자 타입 (통화 결정용)
 * @returns {string} 포맷된 가격 문자열
 */
export const formatPrice = (price, visaType) => {
  if (visaType === VISA_TYPES.E_VISA_TRANSIT) {
    // 목바이 경유는 베트남 동화(VND)
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(price);
  } else {
    // 일반 E-VISA는 한국 원화(KRW)
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
      minimumFractionDigits: 0,
    }).format(price);
  }
};

export const calculateOldVisaPrice = (visaType, processingType) => {
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
      // Step 1에서는 visaType, visaDurationType, processingType(긴급 비자인 경우)이 필요
      if (!formData.visaType) return false;
      if (!formData.visaDurationType) return false; // 긴급 비자의 경우에만 processingType이 필요
      if (formData.visaType === "E_VISA_URGENT" && !formData.processingType) return false;
      return true;
    case 2:
      return (
        formData?.personalInfo?.fullName &&
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

      // Transit E-VISA의 경우 여러 인원 확인
      const totalPeople = formData.visaType === "E_VISA_TRANSIT" && formData.transitPeopleCount ? formData.transitPeopleCount : 1;
      if (totalPeople === 1) {
        // 단일 인원
        const hasPassport = documents.passport;
        const hasPhoto = documents.photo;
        const photoValidation = documents.photo?.validationResult;
        const isPhotoSuitable = !photoValidation || (photoValidation?.result || photoValidation) === "SUITABLE";

        return hasPassport && hasPhoto && isPhotoSuitable;
      } else {
        // 다중 인원 - 모든 인원의 서류 확인 (camelCase 형식)
        for (let i = 0; i < totalPeople; i++) {
          const passportKey = `passportPerson${i}`;
          const photoKey = `photoPerson${i}`;

          const hasPassport = documents[passportKey];
          const hasPhoto = documents[photoKey];
          const photoValidation = documents[photoKey]?.validationResult;
          const isPhotoSuitable = !photoValidation || (photoValidation?.result || photoValidation) === "SUITABLE";

          if (!hasPassport || !hasPhoto || !isPhotoSuitable) {
            return false;
          }
        }
        return true;
      }
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
  if (typeof amount !== "number") {
    return "₩0";
  }
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
  }).format(amount);
};

// Calculate total price including base price and additional services
export const calculateTotalPrice = (formData) => {
  const { visaType, visaDurationType, processingType, transitPeopleCount, transitVehicleType, additionalServices } = formData;

  // 비자 기본 가격 계산
  const visaPricing = calculateVisaPrice(visaType, visaDurationType, processingType, transitPeopleCount, transitVehicleType);

  // 추가 서비스 가격 계산
  const additionalServicesPricing = calculateAdditionalServicesPrice(additionalServices);

  // 전체 가격
  const totalPrice = visaPricing.totalVisaPrice + additionalServicesPricing.totalPrice;

  // Transit E-VISA인지 확인 (VND 가격인지 KRW 가격인지)
  const isTransitVisa = visaType === VISA_TYPES.E_VISA_TRANSIT;

  return {
    visa: {
      basePrice: visaPricing.basePrice,
      vehiclePrice: visaPricing.vehiclePrice,
      totalPrice: visaPricing.totalVisaPrice,
    },
    additionalServices: additionalServicesPricing,
    totalPrice,
    currency: isTransitVisa ? "VND" : "KRW", // 기본 통화 정보 추가
    // 가격 표시를 위한 포맷된 문자열
    formatted: {
      visaBasePrice: formatPrice(visaPricing.basePrice, visaType),
      visaVehiclePrice: formatPrice(visaPricing.vehiclePrice, visaType),
      visaTotalPrice: formatPrice(visaPricing.totalVisaPrice, visaType),
      additionalServicesPrice: formatPrice(additionalServicesPricing.totalPrice, visaType),
      totalPrice: formatPrice(totalPrice, visaType),
    },
  };
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

/**
 * 비자 서비스 세부 정보 반환
 * @param {object} formData - 폼 데이터
 * @returns {object} 비자 서비스 세부 정보
 */
export const getVisaServiceDetails = (formData) => {
  const { visaType, visaDurationType, processingType, transitPeopleCount, transitVehicleType } = formData;

  const details = {
    visaTypeInfo: {},
    durationInfo: {},
    processingInfo: {},
    transitInfo: {},
  };

  // 비자 타입 정보
  switch (visaType) {
    case VISA_TYPES.E_VISA_GENERAL:
      details.visaTypeInfo = {
        name: "E-VISA(전자비자) - 일반",
        description: "표준 처리 속도로 안정적인 발급",
        processingTime: "4-5일 소요",
      };
      break;
    case VISA_TYPES.E_VISA_URGENT:
      details.visaTypeInfo = {
        name: "E-VISA(전자비자) - 급행",
        description: "빠른 처리가 필요한 경우",
        processingTime: "선택한 처리 속도에 따름",
      };
      break;
    case VISA_TYPES.E_VISA_TRANSIT:
      details.visaTypeInfo = {
        name: "목바이 경유 E-VISA(전자비자)",
        description: "목바이 경유를 통한 당일 발급",
        processingTime: "당일 발급",
      };
      break;
  }

  // 기간 정보
  switch (visaDurationType) {
    case "SINGLE_90":
      details.durationInfo = {
        name: "단수 입국 (90일)",
        description: "90일간 1회 입국 후 재입국 불가",
      };
      break;
    case "MULTIPLE_90":
      details.durationInfo = {
        name: "복수 입국 (90일)",
        description: "90일간 자유로운 출입국 가능",
      };
      break;
  }

  // 처리 속도 정보 (급행 비자만)
  if (visaType === VISA_TYPES.E_VISA_URGENT && processingType) {
    const processingOptions = {
      [PROCESSING_TYPES.EXPRESS_1HOUR]: { name: "1시간 처리", description: "최우선 처리" },
      [PROCESSING_TYPES.EXPRESS_2HOUR]: { name: "2시간 처리", description: "우선 처리" },
      [PROCESSING_TYPES.EXPRESS_4HOUR]: { name: "4시간 처리", description: "빠른 처리" },
      [PROCESSING_TYPES.EXPRESS_1DAY]: { name: "1일 처리", description: "당일 처리" },
      [PROCESSING_TYPES.EXPRESS_2DAY]: { name: "2일 처리", description: "2일 처리" },
      [PROCESSING_TYPES.EXPRESS_3DAY]: { name: "3일 처리", description: "3일 처리" },
    };
    details.processingInfo = processingOptions[processingType] || {};
  }

  // 목바이 경유 정보
  if (visaType === VISA_TYPES.E_VISA_TRANSIT) {
    details.transitInfo = {
      peopleCount: transitPeopleCount,
      vehicleType: transitVehicleType ? TRANSIT_VEHICLE_TYPES.find((v) => v.id === transitVehicleType) : null,
    };
  }

  return details;
};
