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
  EXPRESS_3DAY: "3일",
};

// 비자 가격 정보 (원화 기준)
export const VISA_PRICES = {
  // E-VISA 단수 입국
  E_VISA_SINGLE: {
    GENERAL: 67500, // $50 * 1350 (4-5일 일반)
    EXPRESS_3DAY: 94500, // $70 * 1350 (3일)
    EXPRESS_2DAY: 121500, // $90 * 1350 (2일)
    EXPRESS_1DAY: 135000, // $100 * 1350 (1일)
    EXPRESS_4HOUR: 148500, // $110 * 1350 (4시간)
    EXPRESS_2HOUR: 189000, // $140 * 1350 (2시간)
    EXPRESS_1HOUR: 270000, // $200 * 1350 (1시간)
  },
  // E-VISA 복수 입국
  E_VISA_MULTIPLE: {
    GENERAL: 108000, // $80 * 1350 (4-5일 일반)
    EXPRESS_3DAY: 135000, // $100 * 1350 (3일)
    EXPRESS_2DAY: 162000, // $120 * 1350 (2일)
    EXPRESS_1DAY: 175500, // $130 * 1350 (1일)
    EXPRESS_4HOUR: 189000, // $140 * 1350 (4시간)
    EXPRESS_2HOUR: 229500, // $170 * 1350 (2시간)
    EXPRESS_1HOUR: 310500, // $230 * 1350 (1시간)
  }, // 목바이 비자런 (90일 단수)
  E_VISA_TRANSIT_SINGLE: {
    1: 6900000, // 1인 VND
    2: 12900000, // 2인 VND
    3: 18900000, // 3인 VND
  },
  // 목바이 비자런 (90일 복수)
  E_VISA_TRANSIT_MULTIPLE: {
    1: 8900000, // 1인 VND (단수 대비 +2,000,000 VND)
    2: 16900000, // 2인 VND (단수 대비 +4,000,000 VND)
    3: 24900000, // 3인 VND (단수 대비 +6,000,000 VND)
  },
};

export const DOCUMENT_TYPES = {
  PASSPORT: "PASSPORT",
  PHOTO: "PHOTO",
  INVITATION: "INVITATION",
  HOTEL_BOOKING: "HOTEL_BOOKING",
  FLIGHT_TICKET: "FLIGHT_TICKET",
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
  E_VISA: "E_VISA",
  ARRIVAL_VISA: "ARRIVAL_VISA",
  VISA_RUN: "VISA_RUN",
};

export const VISA_DURATION_TYPES = {
  SINGLE_90: "SINGLE_90",
  MULTIPLE_90: "MULTIPLE_90",
};

export const VISA_DURATION_LABELS = {
  SINGLE_90: "단수 입국 (90일)",
  MULTIPLE_90: "복수 입국 (90일)",
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

export const TRANSIT_PEOPLE_COUNT = [
  { value: 1, label: "1인" },
  { value: 2, label: "2인" },
  { value: 3, label: "3인" },
];

export const TRANSIT_VEHICLE_TYPES = [
  {
    id: "INNOVA",
    name: "이노바",
    description: "7인승 SUV",
    capacity: "최대 3인",
    price: 0, // 이노바는 기본 가격에 포함
  },
  {
    id: "CARNIVAL",
    name: "카니발",
    description: "11인승 밴",
    capacity: "최대 3인",
    price: 500000, // 이노바 대비 +50만 VND
  },
];

export const ADDITIONAL_SERVICES = [
  {
    id: "FAST_TRACK_ARRIVAL",
    name: "공항 패스트트랙 - 입국",
    description: "입국 시 빠른 통과 서비스",
    price: 27000, // $20 * 1350
    category: "AIRPORT",
    icon: "Plane",
    available: ["E_VISA_GENERAL", "E_VISA_URGENT"],
  },
  {
    id: "FAST_TRACK_ARRIVAL_PREMIUM",
    name: "공항 패스트트랙 - 프리미엄 입국",
    description: "프리미엄 입국 빠른 통과 서비스",
    price: 40500, // $30 * 1350
    category: "AIRPORT",
    icon: "Crown",
    available: ["E_VISA_GENERAL", "E_VISA_URGENT"],
  },
  {
    id: "AIRPORT_PICKUP_SEDAN_DISTRICT1",
    name: "공항 픽업 서비스 - 4인승 세단 (1,3,푸년군)",
    description: "공항에서 호텔까지 픽업 서비스 (1~3인 탑승)",
    price: 33750, // $25 * 1350
    category: "TRANSPORT",
    icon: "Car",
    available: ["E_VISA_GENERAL", "E_VISA_URGENT"],
  },
  {
    id: "AIRPORT_PICKUP_SEDAN_DISTRICT2",
    name: "공항 픽업 서비스 - 4인승 세단 (2,7,빈탄군)",
    description: "공항에서 호텔까지 픽업 서비스 (1~3인 탑승)",
    price: 40500, // $30 * 1350
    category: "TRANSPORT",
    icon: "Car",
    available: ["E_VISA_GENERAL", "E_VISA_URGENT"],
  },
  {
    id: "AIRPORT_PICKUP_SUV_DISTRICT1",
    name: "공항 픽업 서비스 - 7인승 SUV (1,3,푸년군)",
    description: "공항에서 호텔까지 픽업 서비스 (4~5인 탑승)",
    price: 47250, // $35 * 1350
    category: "TRANSPORT",
    icon: "Truck",
    available: ["E_VISA_GENERAL", "E_VISA_URGENT"],
  },
  {
    id: "AIRPORT_PICKUP_SUV_DISTRICT2",
    name: "공항 픽업 서비스 - 7인승 SUV (2,7,빈탄군)",
    description: "공항에서 호텔까지 픽업 서비스 (4~5인 탑승)",
    price: 54000, // $40 * 1350
    category: "TRANSPORT",
    icon: "Truck",
    available: ["E_VISA_GENERAL", "E_VISA_URGENT"],
  },
];

export const initialFormData = {
  // Service Selection
  visaType: "", // 기본값은 빈 문자열로 사용자가 선택하도록
  visaDurationType: "",
  processingType: "",

  // Transit visa specific fields
  transitPeopleCount: 1,
  transitVehicleType: "",

  // Documents
  documents: [],

  // Additional Services
  additionalServices: [],

  // Payment
  agreementAccepted: false,
};
