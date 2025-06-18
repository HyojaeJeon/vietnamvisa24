"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useMutation } from "@apollo/client";
import Header from "../src/components/header";
import Footer from "../src/components/footer";

// Import GraphQL mutation
import { CREATE_APPLICATION_MUTATION } from "../src/lib/graphql/mutation/applications";

// Import utilities and types
import { initialFormData } from "./_components/types";
import { validateStep, safeLocalStorage, generateApplicationId, calculateTotalPrice } from "./_components/utils";

// Import token refresh test (development only)
if (process.env.NODE_ENV === "development") {
  import("../src/lib/tokenRefreshTest");
  import("../src/lib/tokenDebugger");
}

// Import components
import ProgressIndicator from "./_components/progressIndicator";
import ServiceSelectionStep from "./_components/serviceSelectionStep";
import PersonalInfoStep from "./_components/personalInfoStep";
import TravelInfoStep from "./_components/travelInfoStep";
import DocumentUploadStep from "./_components/documentUploadStep";
import ReviewStep from "./_components/reviewStep";
import ConfirmationStep from "./_components/confirmationStep";

const TOTAL_STEPS = 6;

// OCR 데이터를 snake_case에서 camelCase로 변환하는 함수
const convertOcrDataToCamelCase = (ocrData) => {
  if (!ocrData) return null;

  const camelCaseData = {};

  // snake_case -> camelCase 매핑
  const fieldMapping = {
    type: "type",
    issuing_country: "issuingCountry",
    passport_no: "passportNo",
    surname: "surname",
    given_names: "givenNames",
    date_of_birth: "dateOfBirth",
    date_of_issue: "dateOfIssue",
    date_of_expiry: "dateOfExpiry",
    sex: "sex",
    nationality: "nationality",
    personal_no: "personalNo",
    authority: "authority",
    korean_name: "koreanName",
  };

  // 필드 변환
  Object.entries(ocrData).forEach(([key, value]) => {
    const camelCaseKey = fieldMapping[key] || key;
    if (value !== null && value !== undefined) {
      camelCaseData[camelCaseKey] = value;
    }
  });

  return camelCaseData;
};

const STEP_NAMES = {
  1: "서비스 선택",
  2: "개인 정보",
  3: "여행 정보",
  4: "서류 업로드",
  5: "정보 확인",
  6: "신청 완료",
};

export default function ApplyPageContent() {
  console.log("ApplyPageContent rendering...");

  // State management
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationId, setApplicationId] = useState("");

  // 개발 모드에서만 토큰 테스트 기능 추가
  const [showTokenTest, setShowTokenTest] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      setShowTokenTest(true);
    }
  }, []); // GraphQL mutation hook
  const [createApplication] = useMutation(CREATE_APPLICATION_MUTATION, {
    onCompleted: (data) => {
      console.log("✅ Application created successfully:", data);
      console.log("🔄 Starting navigation to confirmation step...");

      // Update form data with submission info
      updateFormData({
        applicationId: data.createApplication.applicationId,
        submittedAt: new Date().toISOString(),
        status: "SUBMITTED",
      });

      setApplicationId(data.createApplication.applicationId);
      console.log("🔄 Setting current step to 6...");
      setCurrentStep(6); // Move to confirmation step
      console.log("✅ Navigation to confirmation step completed");

      // Clear saved form data after successful submission
      safeLocalStorage.removeItem("visa-application-form");
      setIsSubmitting(false);
      console.log("✅ Form submission completed successfully");
    },
    onError: (error) => {
      console.error("❌ Application submission error:", error);

      // GraphQL 에러 메시지 파싱
      let errorMessage = "신청서 제출 중 오류가 발생했습니다.";
      if (error.graphQLErrors && error.graphQLErrors.length > 0) {
        errorMessage = error.graphQLErrors[0].message;
      } else if (error.networkError) {
        errorMessage = "네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.";
      }

      alert(`${errorMessage} 다시 시도해주세요.`);
      setIsSubmitting(false);
    },
  });

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
      if (currentStep < 6) {
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
  // Handle application submission
  const handleApplicationSubmit = async () => {
    console.log("🚀 handleApplicationSubmit called");
    setIsSubmitting(true);
    try {
      // Generate application ID if not exists
      const newApplicationId = applicationId || generateApplicationId();
      setApplicationId(newApplicationId); // Debug logging
      console.log("🔍 Original formData:", formData);
      console.log("🔍 travelInfo:", formData.travelInfo);
      console.log("🔍 documents:", formData.documents); // Prepare documents data
      const documentsData = {};
      if (formData.documents) {
        Object.entries(formData.documents).forEach(([docType, docData]) => {
          if (docData && (docData.file || docData.fileName)) {
            // OCR 결과 처리 - passport의 경우 변환된 camelCase 데이터 사용
            let extractedInfo = null;
            if (docType === "passport") {
              // 이미 camelCase로 변환된 extractedInfo 사용 (우선순위)
              if (docData.extractedInfo) {
                extractedInfo = docData.extractedInfo;
                console.log(`🔍 Using camelCase extractedInfo for ${docType}:`, extractedInfo);
              } else if (docData.ocrResult && !docData.ocrResult.error) {
                // fallback: ocrResult가 있지만 extractedInfo가 없는 경우 - snake_case를 camelCase로 변환
                extractedInfo = convertOcrDataToCamelCase(docData.ocrResult);
                console.log(`🔍 Fallback: converted snake_case OCR Result to camelCase for ${docType}:`, extractedInfo);
              }
            } else if (docData.extractedInfo) {
              extractedInfo = docData.extractedInfo;
            }

            // 파일 데이터 처리 - Base64 문자열인지 확인
            let fileDataToSend = docData.file;
            if (typeof docData.file === "string" && docData.file.startsWith("data:")) {
              // 이미 Base64 형태인 경우 그대로 사용
              fileDataToSend = docData.file;
            } else if (docData.file && typeof docData.file === "object") {
              // File 객체인 경우 - 실제로는 이미 Base64로 변환되어 저장되어야 함
              console.warn(`File object found for ${docType}, should be Base64 string`);
              fileDataToSend = null;
            }

            documentsData[docType] = {
              fileName: docData.fileName || docData.file?.name || `${docType}.jpg`,
              fileSize: docData.fileSize || docData.file?.size || 0,
              fileType: docData.fileType || docData.file?.type || "image/jpeg",
              fileData: fileDataToSend,
              extractedInfo: extractedInfo,
            };
            console.log(`🔍 Processing ${docType}:`, {
              fileName: documentsData[docType].fileName,
              fileSize: documentsData[docType].fileSize,
              fileType: documentsData[docType].fileType,
              hasFileData: !!documentsData[docType].fileData,
              fileDataType: typeof documentsData[docType].fileData,
              hasExtractedInfo: !!documentsData[docType].extractedInfo,
              extractedInfoKeys: extractedInfo ? Object.keys(extractedInfo) : [],
              extractedInfoSample: extractedInfo ? JSON.stringify(extractedInfo).substring(0, 200) + "..." : "none",
            });
          }
        });
      }

      // Prepare simplified application data for GraphQL mutation
      const applicationData = {
        applicationId: newApplicationId,
        processingType: formData.processingType,
        totalPrice: calculateTotalPrice(formData),
        personalInfo: {
          firstName: formData.personalInfo?.firstName || "",
          lastName: formData.personalInfo?.lastName || "",
          email: formData.personalInfo?.email || "",
          phone: formData.personalInfo?.phone || "",
          address: formData.personalInfo?.address || "",
          phoneOfFriend: formData.personalInfo?.phoneOfFriend || "",
        },
        travelInfo: {
          entryDate: formData.travelInfo?.entryDate || "",
          entryPort: formData.travelInfo?.entryPort || "",
          visaType: formData.visaType || "",
        },
        additionalServiceIds: formData.additionalServices || [],
        documents: Object.keys(documentsData).length > 0 ? documentsData : undefined,
      };
      console.log("🔍 Simplified applicationData:", JSON.stringify(applicationData, null, 2));

      // 🔍 Debug: Check documents data before GraphQL submission
      if (applicationData.documents) {
        Object.entries(applicationData.documents).forEach(([docType, docData]) => {
          if (docData.extractedInfo) {
            console.log(`🔍 ${docType} extractedInfo being sent to GraphQL:`, docData.extractedInfo);
            console.log(`🔍 ${docType} extractedInfo keys:`, Object.keys(docData.extractedInfo));
          }
        });
      } // Submit via Apollo Client mutation
      console.log("🔄 Calling createApplication mutation...");
      await createApplication({
        variables: {
          input: applicationData,
        },
      });
      console.log("✅ createApplication mutation completed successfully");
    } catch (error) {
      console.error("❌ Application submission error:", error);
      alert("신청서 제출 중 오류가 발생했습니다. 다시 시도해주세요.");
      setIsSubmitting(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Prevent accidental page refresh/back button
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (currentStep > 1 && currentStep < 6) {
        e.preventDefault();
        e.returnValue = "작성 중인 신청서가 있습니다. 정말 페이지를 나가시겠습니까?";
        return e.returnValue;
      }
    };

    const handlePopState = (e) => {
      if (currentStep > 1 && currentStep < 6) {
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
    if (currentStep === 6) {
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
        return <ReviewStep formData={formData} onNext={handleApplicationSubmit} onPrevious={handlePrevious} onEdit={handleEdit} isSubmitting={isSubmitting} />;
      case 6:
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
