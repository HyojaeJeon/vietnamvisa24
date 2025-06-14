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
  PERSONAL_INFO: 1,
  CONTACT_INFO: 2,
  TRAVEL_INFO: 3,
  DOCUMENT_UPLOAD: 4,
  REVIEW: 5,
  PAYMENT: 6,
  CONFIRMATION: 7,
};

export const initialFormData = {
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
  processingType: "standard",
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
