// Utility functions for the apply form

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
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^[\d\-\+\(\)\s]+$/;
  return phoneRegex.test(phone) && phone.length >= 10;
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
    8: "신청 완료"
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
    8: "신청이 완료되었습니다"
  };
  return descriptions[step] || "";
};

export const validateStep = (step, formData) => {
  switch (step) {
    case 1:
      return formData.firstName && formData.lastName && formData.birthDate && formData.nationality && formData.passportNumber && formData.passportExpiry && formData.gender;
    case 3:
      return formData.email && formData.phone && formData.address && validateEmail(formData.email) && validatePhone(formData.phone);
    case 4:
      return formData.visaType && formData.processingType && formData.entryDate && formData.purpose;
    case 5:
      return formData.documents && formData.documents.length >= 2; // passport + photo minimum
    case 6:
      return true; // Review step
    case 7:
      return formData.paymentMethod && formData.agreementAccepted;
    default:
      return false;
  }
};