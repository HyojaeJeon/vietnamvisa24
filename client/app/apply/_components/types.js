// Types and interfaces for the apply form

export const VISA_TYPES = {
  E_VISA_GENERAL: "E_VISA_GENERAL",
  E_VISA_URGENT: "E_VISA_URGENT",
  E_VISA_TRANSIT: "E_VISA_TRANSIT",
};

export const PROCESSING_TYPES = {
  EXPRESS_1HOUR: "1시간",
  EXPRESS_2HOUR: "2시간",
  EXPRESS_4HOUR: "4시간",
  EXPRESS_1DAY: "1일",
  EXPRESS_2DAY: "2일",
  STANDARD: "STANDARD",
};

export const DOCUMENT_TYPES = {
  PASSPORT: "passport",
  PHOTO: "photo",
  INVITATION: "invitation",
  HOTEL_BOOKING: "hotel_booking",
  FLIGHT_TICKET: "flight_ticket",
};

export const STEPS = {
  SERVICE_SELECTION: 1,
  PERSONAL_INFO: 2,
  CONTACT_INFO: 3,
  TRAVEL_INFO: 4,
  DOCUMENT_UPLOAD: 5,
  REVIEW: 6,
  PAYMENT: 7,
  CONFIRMATION: 8,
};

export const SERVICE_TYPES = {
  E_VISA: "e_visa",
  ARRIVAL_VISA: "arrival_visa",
  VISA_RUN: "visa_run",
};

export const VISA_DURATION_TYPES = {
  SINGLE_90: "single_90",
  MULTIPLE_90: "multiple_90",
};

export const VISA_DURATION_LABELS = {
  single_90: "단수 입국 (90일)",
  multiple_90: "복수 입국 (90일)",
};

export const VISIT_PURPOSES = [
  { value: "tourist", label: "관광/여행", description: "관광, 레저, 개인 여행 목적" },
  { value: "business", label: "상용/출장", description: "비즈니스 미팅, 컨퍼런스, 업무 목적" },
  { value: "family", label: "가족 방문", description: "가족, 친척 방문 목적" },
  { value: "friend", label: "친구 방문", description: "친구, 지인 방문 목적" },
  { value: "medical", label: "의료/치료", description: "의료 서비스, 치료 목적" },
  { value: "education", label: "교육/연수", description: "교육, 연수, 워크샵 참석" },
  { value: "transit", label: "경유/환승", description: "다른 국가로의 경유 목적" },
  { value: "other", label: "기타", description: "기타 목적" },
];

export const ADDITIONAL_SERVICES = [
  {
    id: "fast_track_arrival",
    name: "공항 패스트트랙 - 입국",
    description: "입국 시 빠른 통과 서비스",
    price: 20 * 1350, // $20 USD
    category: "airport",
  },
  {
    id: "fast_track_arrival_premium",
    name: "공항 패스트트랙 - 프리미엄 입국",
    description: "프리미엄 입국 빠른 통과 서비스",
    price: 30 * 1350, // $30 USD
    category: "airport",
  },
  // {
  //   id: "fast_track_departure",
  //   name: "공항 패스트트랙 - 출국",
  //   description: "출국 시 빠른 통과 서비스",
  //   price: 25 * 1350, // $25 USD
  //   category: "airport",
  // },
  {
    id: "airport_pickup_sedan_district1",
    name: "공항 픽업 서비스 - 4인승 세단 (1,3,푸년군)",
    description: "공항에서 호텔까지 픽업 서비스 (1~3인 탑승)",
    price: 25 * 1350, // $25 USD
    category: "transport",
  },
  {
    id: "airport_pickup_sedan_district2",
    name: "공항 픽업 서비스 - 4인승 세단 (2,7,빈탄군)",
    description: "공항에서 호텔까지 픽업 서비스 (1~3인 탑승)",
    price: 30 * 1350, // $30 USD
    category: "transport",
  },
  {
    id: "airport_pickup_suv_district1",
    name: "공항 픽업 서비스 - 7인승 SUV (1,3,푸년군)",
    description: "공항에서 호텔까지 픽업 서비스 (4~5인 탑승)",
    price: 35 * 1350, // $35 USD
    category: "transport",
  },
  {
    id: "airport_pickup_suv_district2",
    name: "공항 픽업 서비스 - 7인승 SUV (2,7,빈탄군)",
    description: "공항에서 호텔까지 픽업 서비스 (4~5인 탑승)",
    price: 40 * 1350, // $40 USD
    category: "transport",
  },
  // {
  //   id: "hotel_booking",
  //   name: "호텔 예약 대행",
  //   description: "베트남 현지 호텔 예약 서비스",
  //   price: 30000,
  //   category: "accommodation",
  // },
  // {
  //   id: "sim_card",
  //   name: "현지 SIM 카드",
  //   description: "베트남 현지 데이터 SIM 카드",
  //   price: 25000,
  //   category: "communication",
  // },
  // {
  //   id: "currency_exchange",
  //   name: "환전 서비스",
  //   description: "우대 환율로 베트남 동 환전",
  //   price: 15000,
  //   category: "finance",
  // },
  // {
  //   id: "travel_insurance",
  //   name: "여행자 보험",
  //   description: "베트남 여행 전용 보험",
  //   price: 40000,
  //   category: "insurance",
  // },
];

export const initialFormData = {
  // Service Selection
  visaType: "", // 기본값은 빈 문자열로 사용자가 선택하도록
  visaDurationType: "",
  processingType: "",

  // Personal Information
  firstName: "",
  lastName: "",
  birthDate: "",
  nationality: "",
  passportNumber: "",
  passportExpiry: "",
  gender: "",

  // Contact Information
  email: "",
  phone: "",
  address: "",
  city: "",
  country: "",
  // Travel Information
  entryDate: "",
  exitDate: "",
  purpose: "",
  previousVisit: false,

  // Documents
  documents: [],

  // Additional Services
  additionalServices: [],

  // Payment
  paymentMethod: "",
  agreementAccepted: false,
};
