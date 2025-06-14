// Types and interfaces for the apply form

export const VISA_TYPES = {
  GENERAL: "general",
  BUSINESS: "business",
  TOURIST: "tourist",
  TRANSIT: "transit",
};

export const PROCESSING_TYPES = {
  STANDARD: "standard",
  EXPRESS: "express",
  URGENT: "urgent",
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

export const initialFormData = {
  // Service Selection
  serviceType: "e_visa",
  visaDurationType: "single_90",
  processingType: "standard",
  
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
  visaType: "general",
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
