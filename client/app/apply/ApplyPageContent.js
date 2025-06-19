
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateForm, nextStep, prevStep, setApplicationId } from "../src/store/applyFormSlice";
import { generateApplicationId } from "./_components/utils";

// Import step components
import ServiceSelectionStep from "./_components/serviceSelectionStep";
import PersonalInfoStep from "./_components/personalInfoStep";
import ContactInfoStep from "./_components/contactInfoStep";
import TravelInfoStep from "./_components/travelInfoStep";
import DocumentUploadStep from "./_components/documentUploadStep";
import ReviewStep from "./_components/reviewStep";
import PaymentStep from "./_components/paymentStep";
import ConfirmationStep from "./_components/confirmationStep";
import ProgressIndicator from "./_components/progressIndicator";
import { STEPS } from "./_components/types";

export default function ApplyPageContent() {
  const dispatch = useDispatch();
  const { currentStep, form, applicationId } = useSelector((state) => state.applyForm);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Initialize application ID
  useEffect(() => {
    if (!applicationId) {
      const newApplicationId = generateApplicationId();
      dispatch(setApplicationId(newApplicationId));
    }
  }, [applicationId, dispatch]);

  // Auto-save to localStorage
  useEffect(() => {
    if (Object.keys(form).length > 0) {
      localStorage.setItem("visaApplicationForm", JSON.stringify(form));
      localStorage.setItem("visaApplicationStep", currentStep.toString());
    }
  }, [form, currentStep]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedForm = localStorage.getItem("visaApplicationForm");
    const savedStep = localStorage.getItem("visaApplicationStep");
    
    if (savedForm) {
      try {
        const parsedForm = JSON.parse(savedForm);
        dispatch(updateForm(parsedForm));
      } catch (error) {
        console.error("Error loading saved form:", error);
      }
    }
    
    if (savedStep) {
      const stepNumber = parseInt(savedStep, 10);
      if (stepNumber >= 1 && stepNumber <= 8) {
        // Note: We would need to dispatch to set current step if we had that action
        // For now, we'll start from step 1
      }
    }
  }, [dispatch]);

  const handleNext = useCallback(async () => {
    setIsLoading(true);
    setErrors({});

    try {
      // Validate current step
      const isValid = await validateCurrentStep();
      if (!isValid) {
        setIsLoading(false);
        return;
      }

      // Special handling for payment step
      if (currentStep === STEPS.PAYMENT) {
        // Here you would handle payment processing
        // For now, we'll just proceed to confirmation
      }

      dispatch(nextStep());
    } catch (error) {
      console.error("Error proceeding to next step:", error);
      setErrors({ general: "오류가 발생했습니다. 다시 시도해주세요." });
    } finally {
      setIsLoading(false);
    }
  }, [currentStep, dispatch]);

  const handlePrev = useCallback(() => {
    dispatch(prevStep());
  }, [dispatch]);

  const handleFormUpdate = useCallback((stepData) => {
    dispatch(updateForm(stepData));
  }, [dispatch]);

  const validateCurrentStep = async () => {
    const currentStepData = form[`step${currentStep}`] || {};
    
    switch (currentStep) {
      case STEPS.SERVICE_SELECTION:
        return validateServiceSelection(currentStepData);
      case STEPS.PERSONAL_INFO:
        return validatePersonalInfo(currentStepData);
      case STEPS.CONTACT_INFO:
        return validateContactInfo(currentStepData);
      case STEPS.TRAVEL_INFO:
        return validateTravelInfo(currentStepData);
      case STEPS.DOCUMENT_UPLOAD:
        return validateDocuments(currentStepData);
      case STEPS.REVIEW:
        return true; // Review step doesn't need validation
      case STEPS.PAYMENT:
        return validatePayment(currentStepData);
      default:
        return true;
    }
  };

  const validateServiceSelection = (data) => {
    const newErrors = {};
    
    if (!data.serviceType) {
      newErrors.serviceType = "서비스 유형을 선택해주세요.";
    }
    if (!data.visaType) {
      newErrors.visaType = "비자 유형을 선택해주세요.";
    }
    if (!data.processingType) {
      newErrors.processingType = "처리 속도를 선택해주세요.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePersonalInfo = (data) => {
    const newErrors = {};
    
    if (!data.firstName) {
      newErrors.firstName = "이름을 입력해주세요.";
    }
    if (!data.lastName) {
      newErrors.lastName = "성을 입력해주세요.";
    }
    if (!data.passportNumber) {
      newErrors.passportNumber = "여권번호를 입력해주세요.";
    }
    if (!data.dateOfBirth) {
      newErrors.dateOfBirth = "생년월일을 입력해주세요.";
    }
    if (!data.nationality) {
      newErrors.nationality = "국적을 선택해주세요.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateContactInfo = (data) => {
    const newErrors = {};
    
    if (!data.email) {
      newErrors.email = "이메일을 입력해주세요.";
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      newErrors.email = "유효한 이메일 주소를 입력해주세요.";
    }
    
    if (!data.phone) {
      newErrors.phone = "전화번호를 입력해주세요.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateTravelInfo = (data) => {
    const newErrors = {};
    
    if (!data.entryDate) {
      newErrors.entryDate = "입국 예정일을 선택해주세요.";
    }
    if (!data.exitDate) {
      newErrors.exitDate = "출국 예정일을 선택해주세요.";
    }
    
    if (data.entryDate && data.exitDate) {
      const entry = new Date(data.entryDate);
      const exit = new Date(data.exitDate);
      
      if (entry >= exit) {
        newErrors.exitDate = "출국일은 입국일보다 늦어야 합니다.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateDocuments = (data) => {
    const newErrors = {};
    
    if (!data.passportImage) {
      newErrors.passportImage = "여권 사진을 업로드해주세요.";
    }
    if (!data.profileImage) {
      newErrors.profileImage = "증명사진을 업로드해주세요.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePayment = (data) => {
    // Payment validation would be handled by payment provider
    return true;
  };

  const renderStepComponent = () => {
    const commonProps = {
      formData: form,
      onFormUpdate: handleFormUpdate,
      errors: errors,
      isLoading: isLoading
    };

    switch (currentStep) {
      case STEPS.SERVICE_SELECTION:
        return <ServiceSelectionStep {...commonProps} />;
      case STEPS.PERSONAL_INFO:
        return <PersonalInfoStep {...commonProps} />;
      case STEPS.CONTACT_INFO:
        return <ContactInfoStep {...commonProps} />;
      case STEPS.TRAVEL_INFO:
        return <TravelInfoStep {...commonProps} />;
      case STEPS.DOCUMENT_UPLOAD:
        return <DocumentUploadStep {...commonProps} />;
      case STEPS.REVIEW:
        return <ReviewStep {...commonProps} />;
      case STEPS.PAYMENT:
        return <PaymentStep {...commonProps} />;
      case STEPS.CONFIRMATION:
        return <ConfirmationStep />;
      default:
        return <ServiceSelectionStep {...commonProps} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              베트남 비자 신청
            </h1>
            <p className="text-gray-600 text-lg">
              간편하고 빠른 온라인 비자 신청 서비스
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="mb-8">
            <ProgressIndicator currentStep={currentStep} />
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8">
              {renderStepComponent()}
            </div>

            {/* Navigation Buttons */}
            {currentStep !== STEPS.CONFIRMATION && (
              <div className="bg-gray-50 px-8 py-6 flex justify-between">
                <button
                  onClick={handlePrev}
                  disabled={currentStep === 1 || isLoading}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  이전
                </button>
                
                <button
                  onClick={handleNext}
                  disabled={isLoading}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  {isLoading && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  )}
                  {currentStep === STEPS.PAYMENT ? "결제하기" : "다음"}
                </button>
              </div>
            )}
          </div>

          {/* Help Section */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">
              도움이 필요하신가요?
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="tel:1588-1234"
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                📞 전화 상담: 1588-1234
              </a>
              <a
                href="#"
                className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition-colors"
              >
                💬 카카오톡 상담
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
