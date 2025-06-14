"use client";

import React, { memo } from "react";

// Memoized step components for better performance
export const MemoizedPersonalInfoStep = memo(function PersonalInfoStep(props) {
  const { default: PersonalInfoStep } = require("./personalInfoStep");
  return <PersonalInfoStep {...props} />;
});

export const MemoizedContactInfoStep = memo(function ContactInfoStep(props) {
  const { default: ContactInfoStep } = require("./contactInfoStep");
  return <ContactInfoStep {...props} />;
});

export const MemoizedTravelInfoStep = memo(function TravelInfoStep(props) {
  const { default: TravelInfoStep } = require("./travelInfoStep");
  return <TravelInfoStep {...props} />;
});

export const MemoizedDocumentUploadStep = memo(function DocumentUploadStep(props) {
  const { default: DocumentUploadStep } = require("./documentUploadStep");
  return <DocumentUploadStep {...props} />;
});

export const MemoizedReviewStep = memo(function ReviewStep(props) {
  const { default: ReviewStep } = require("./reviewStep");
  return <ReviewStep {...props} />;
});

export const MemoizedPaymentStep = memo(function PaymentStep(props) {
  const { default: PaymentStep } = require("./paymentStep");
  return <PaymentStep {...props} />;
});

export const MemoizedConfirmationStep = memo(function ConfirmationStep(props) {
  const { default: ConfirmationStep } = require("./confirmationStep");
  return <ConfirmationStep {...props} />;
});

// Progress indicator memo
export const MemoizedProgressIndicator = memo(function ProgressIndicator(props) {
  const { default: ProgressIndicator } = require("./progressIndicator");
  return <ProgressIndicator {...props} />;
});
