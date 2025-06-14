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
    1: "개인정보 입력",
    2: "연락처 정보",
    3: "여행 정보",
    4: "서류 업로드",
    5: "신청 내용 확인",
    6: "결제",
    7: "신청 완료",
  };
  return titles[step] || "";
};

export const getStepDescription = (step) => {
  const descriptions = {
    1: "여권 정보와 동일하게 입력해주세요",
    2: "연락 가능한 정보를 입력해주세요",
    3: "베트남 방문 계획을 입력해주세요",
    4: "필요한 서류를 업로드해주세요",
    5: "입력하신 정보를 확인해주세요",
    6: "결제 방법을 선택해주세요",
    7: "신청이 완료되었습니다",
  };
  return descriptions[step] || "";
};

export const validateStep = (step, formData) => {
  switch (step) {
    case 1:
      return formData.firstName && formData.lastName && formData.birthDate && formData.nationality && formData.passportNumber && formData.passportExpiry && formData.gender;
    case 2:
      return formData.email && formData.phone && formData.address && validateEmail(formData.email) && validatePhone(formData.phone);
    case 3:
      return formData.visaType && formData.processingType && formData.entryDate && formData.purpose;
    case 4:
      return formData.documents && formData.documents.length >= 2; // passport + photo minimum
    case 5:
      return true; // Review step doesn't need validation
    case 6:
      return formData.paymentMethod && formData.agreementAccepted;
    default:
      return false;
  }
};
