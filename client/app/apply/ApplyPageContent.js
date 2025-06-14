"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Header from "../src/components/header";
import Footer from "../src/components/footer";

// Import utilities and types
import { initialFormData, STEPS } from "./_components/types";
import { validateStep, getStepDescription, getStepTitle } from "./_components/utils";

// Import components
import ProgressIndicator from "./_components/progressIndicator";
import PersonalInfoStep from "./_components/personalInfoStep";
import ContactInfoStep from "./_components/contactInfoStep";
import TravelInfoStep from "./_components/travelInfoStep";
import DocumentUploadStep from "./_components/documentUploadStep";
import ReviewStep from "./_components/reviewStep";
import PaymentStep from "./_components/paymentStep";
import ConfirmationStep from "./_components/confirmationStep";

export default function ApplyPageContent() {
  console.log("ApplyPageContent rendering...");

  // State management
  const [currentStep, setCurrentStep] = useState(STEPS.PERSONAL_INFO);
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationId, setApplicationId] = useState("");

  const searchParams = useSearchParams();

  // Initialize step from URL parameter if present
  useEffect(() => {
    const stepParam = searchParams.get("step");
    if (stepParam) {
      const stepNumber = parseInt(stepParam);
      if (stepNumber >= 1 && stepNumber <= 7) {
        setCurrentStep(stepNumber);
      }
    }
  }, [searchParams]);

  // Update form data
  const updateFormData = (updates) => {
    setFormData((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  // Navigation handlers
  const handleNext = () => {
    if (currentStep < 7 && validateStep(currentStep, formData)) {
      setCurrentStep((prev) => prev + 1);
      // Smooth scroll to top with better mobile handling
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }, 100);
    } else {
      // Show validation errors if step is not valid
      const stepName = getStepTitle(currentStep);
      console.log(`${stepName} 단계를 완료해주세요.`);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      // Smooth scroll to top
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }, 100);
    }
  };

  // Handle final submission
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const newApplicationId = "VN-" + Date.now().toString().slice(-8);
      setApplicationId(newApplicationId);
      setCurrentStep(STEPS.CONFIRMATION);
    } catch (error) {
      console.error("Submission error:", error);
      alert("신청 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Auto-save form data to localStorage
  useEffect(() => {
    const savedData = localStorage.getItem("visa-application-form");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData((prev) => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error("Error loading saved form data:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (currentStep < STEPS.CONFIRMATION) {
      localStorage.setItem("visa-application-form", JSON.stringify(formData));
    }
  }, [formData, currentStep]);

  // Clear saved data when application is completed
  useEffect(() => {
    if (currentStep === STEPS.CONFIRMATION) {
      localStorage.removeItem("visa-application-form");
    }
  }, [currentStep]);

  // Prevent accidental page refresh/back button
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (currentStep > 1 && currentStep < STEPS.CONFIRMATION) {
        e.preventDefault();
        e.returnValue = "작성 중인 신청서가 있습니다. 정말 페이지를 나가시겠습니까?";
        return e.returnValue;
      }
    };

    const handlePopState = (e) => {
      if (currentStep > 1 && currentStep < STEPS.CONFIRMATION) {
        const userConfirmed = window.confirm("작성 중인 신청서가 있습니다. 정말 뒤로 가시겠습니까? 작성된 내용은 자동 저장됩니다.");
        if (!userConfirmed) {
          window.history.pushState(null, null, window.location.pathname);
        }
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);

    // Keyboard navigation
    const handleKeyDown = (e) => {
      // ESC key to show help
      if (e.key === "Escape" && currentStep < STEPS.CONFIRMATION) {
        const helpSection = document.querySelector("[data-help-section]");
        if (helpSection) {
          helpSection.scrollIntoView({ behavior: "smooth" });
          helpSection.focus();
        }
      }

      // F1 for help
      if (e.key === "F1") {
        e.preventDefault();
        window.open("tel:02-1234-5678");
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Push state to prevent back button
    if (currentStep > 1) {
      window.history.pushState(null, null, window.location.pathname);
    }

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentStep]);

  // Render current step
  const renderStep = () => {
    switch (currentStep) {
      case STEPS.PERSONAL_INFO:
        return <PersonalInfoStep formData={formData} onUpdate={updateFormData} onNext={handleNext} />;
      case STEPS.CONTACT_INFO:
        return <ContactInfoStep formData={formData} onUpdate={updateFormData} onNext={handleNext} onPrev={handlePrev} />;
      case STEPS.TRAVEL_INFO:
        return <TravelInfoStep formData={formData} onUpdate={updateFormData} onNext={handleNext} onPrev={handlePrev} />;
      case STEPS.DOCUMENT_UPLOAD:
        return <DocumentUploadStep formData={formData} onUpdate={updateFormData} onNext={handleNext} onPrev={handlePrev} />;
      case STEPS.REVIEW:
        return <ReviewStep formData={formData} onNext={handleNext} onPrev={handlePrev} />;
      case STEPS.PAYMENT:
        return <PaymentStep formData={formData} onUpdate={updateFormData} onNext={handleSubmit} onPrev={handlePrev} isSubmitting={isSubmitting} />;
      case STEPS.CONFIRMATION:
        return <ConfirmationStep formData={formData} applicationId={applicationId} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">베트남 비자 신청</h1>
            <p className="text-gray-600 text-lg">{getStepDescription(currentStep)}</p>
          </div>

          {/* Progress Indicator */}
          {currentStep < STEPS.CONFIRMATION && <ProgressIndicator currentStep={currentStep} totalSteps={6} />}

          {/* Loading overlay for submission */}
          {isSubmitting && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-8 max-w-sm mx-4 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <h3 className="text-lg font-semibold mb-2">신청서 제출 중...</h3>
                <p className="text-gray-600">잠시만 기다려주세요</p>
              </div>
            </div>
          )}

          {/* Step Content */}
          <div className="mb-8">{renderStep()}</div>

          {/* Help Section */}
          {currentStep < STEPS.CONFIRMATION && (
            <div className="mt-12 bg-gray-50 rounded-lg p-6" data-help-section tabIndex="-1">
              <h3 className="font-semibold text-gray-800 mb-3">📞 도움이 필요하신가요?</h3>
              <div className="text-xs text-gray-500 mb-4">💡 ESC 키를 누르면 이 도움말로 이동하며, F1 키로 바로 전화연결이 가능합니다</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="font-medium">전화 문의</div>
                  <div className="text-blue-600">02-1234-5678</div>
                  <div className="text-gray-500">평일 9:00-18:00</div>
                </div>
                <div>
                  <div className="font-medium">이메일 문의</div>
                  <div className="text-green-600">support@vietnamvisa24.com</div>
                  <div className="text-gray-500">24시간 접수</div>
                </div>
                <div>
                  <div className="font-medium">카카오톡 문의</div>
                  <div className="text-yellow-600">@vietnamvisa24</div>
                  <div className="text-gray-500">실시간 상담</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
