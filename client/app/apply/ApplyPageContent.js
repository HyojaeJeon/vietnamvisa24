"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Header from "../src/components/header";
import Footer from "../src/components/footer";

// Import utilities and types
import { initialFormData } from "./_components/types";
import { validateStep, safeLocalStorage, generateApplicationId } from "./_components/utils";

// Import components
import ProgressIndicator from "./_components/progressIndicator";
import ServiceSelectionStep from "./_components/serviceSelectionStep";
import PersonalInfoStep from "./_components/personalInfoStep";
import TravelInfoStep from "./_components/travelInfoStep";
import DocumentUploadStep from "./_components/documentUploadStep";
import ReviewStep from "./_components/reviewStep";
import PaymentStep from "./_components/paymentStep";
import ConfirmationStep from "./_components/confirmationStep";

const TOTAL_STEPS = 7;

const STEP_NAMES = {
  1: "서비스 선택",
  2: "개인 정보",
  3: "여행 정보",
  4: "서류 업로드",
  5: "정보 확인",
  6: "결제",
  7: "신청 완료",
};

export default function ApplyPageContent() {
  console.log("ApplyPageContent rendering...");

  // State management
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationId, setApplicationId] = useState("");

  console.log("formData:", formData);
  const searchParams = useSearchParams();

  // Initialize step from URL parameter if present
  useEffect(() => {
    const stepParam = searchParams.get("step");
    if (stepParam) {
      const stepNumber = parseInt(stepParam);
      if (stepNumber >= 1 && stepNumber <= TOTAL_STEPS) {
        setCurrentStep(stepNumber);
      }
    }

    // Load saved form data from localStorage
    const savedData = safeLocalStorage.getItem("visa-application-form");
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setFormData((prev) => ({ ...prev, ...parsedData }));
      } catch (error) {
        console.error("Error loading saved form data:", error);
      }
    }
  }, [searchParams]);

  // Update form data
  const updateFormData = (updates) => {
    setFormData((prev) => {
      const newData = { ...prev, ...updates };
      // Auto-save to localStorage
      if (currentStep < 7) {
        safeLocalStorage.setItem("visa-application-form", JSON.stringify(newData));
      }
      return newData;
    });
  };

  // Navigation handlers
  const handleNext = () => {
    if (currentStep < TOTAL_STEPS && validateStep(currentStep, formData)) {
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
      const stepName = STEP_NAMES[currentStep];
      console.log(`${stepName} 단계를 완료해주세요.`);
      // You could show a toast notification here
    }
  };

  const handlePrevious = () => {
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

  // Handle edit - go to specific step
  const handleEdit = (step) => {
    if (step >= 1 && step <= TOTAL_STEPS) {
      setCurrentStep(step);
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }, 100);
    }
  };

  // Handle payment completion
  const handlePaymentComplete = async (paymentData) => {
    setIsSubmitting(true);
    try {
      // Simulate payment processing and application submission
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const newApplicationId = generateApplicationId();
      setApplicationId(newApplicationId);

      // Update form data with payment information
      updateFormData({
        paymentInfo: paymentData,
        applicationId: newApplicationId,
        submittedAt: new Date().toISOString(),
        status: "SUBMITTED",
      });

      setCurrentStep(7); // Move to confirmation step

      // Clear saved form data after successful submission
      safeLocalStorage.removeItem("visa-application-form");
    } catch (error) {
      console.error("Payment/Submission error:", error);
      alert("결제 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Prevent accidental page refresh/back button
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (currentStep > 1 && currentStep < 7) {
        e.preventDefault();
        e.returnValue = "작성 중인 신청서가 있습니다. 정말 페이지를 나가시겠습니까?";
        return e.returnValue;
      }
    };

    const handlePopState = (e) => {
      if (currentStep > 1 && currentStep < 7) {
        const confirmLeave = window.confirm("작성 중인 신청서가 있습니다. 정말 페이지를 나가시겠습니까?");
        if (!confirmLeave) {
          window.history.pushState(null, "", window.location.href);
        }
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);

    // Push initial state to prevent accidental back navigation
    if (currentStep > 1) {
      window.history.pushState(null, "", window.location.href);
    }

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [currentStep]);

  // Clear saved data when application is completed
  useEffect(() => {
    if (currentStep === 7) {
      safeLocalStorage.removeItem("visa-application-form");
    }
  }, [currentStep]);

  // Render current step component
  const renderStepComponent = () => {
    switch (currentStep) {
      case 1:
        return <ServiceSelectionStep formData={formData} onUpdate={updateFormData} onNext={handleNext} />;
      case 2:
        return <PersonalInfoStep formData={formData} onUpdate={updateFormData} onNext={handleNext} onPrevious={handlePrevious} />;
      case 3:
        return <TravelInfoStep formData={formData} onUpdate={updateFormData} onNext={handleNext} onPrevious={handlePrevious} />;
      case 4:
        return <DocumentUploadStep formData={formData} onUpdate={updateFormData} onNext={handleNext} onPrevious={handlePrevious} />;
      case 5:
        return <ReviewStep formData={formData} onNext={handleNext} onPrevious={handlePrevious} onEdit={handleEdit} />;
      case 6:
        return <PaymentStep formData={formData} onUpdate={updateFormData} onPaymentComplete={handlePaymentComplete} onPrevious={handlePrevious} isSubmitting={isSubmitting} />;
      case 7:
        return <ConfirmationStep formData={formData} applicationId={applicationId} />;
      default:
        return <ServiceSelectionStep formData={formData} onUpdate={updateFormData} onNext={handleNext} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />

      <main className="container px-4 py-8 mx-auto">
        {/* Progress Indicator */}
        <div className="mb-8">
          <ProgressIndicator currentStep={currentStep} totalSteps={TOTAL_STEPS} stepNames={STEP_NAMES} />
        </div>

        {/* Step Content */}
        <div className="max-w-4xl mx-auto">{renderStepComponent()}</div>
      </main>

      <Footer />
    </div>
  );
}
