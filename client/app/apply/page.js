"use client";

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../src/components/ui/card";
import { Button } from "../src/components/ui/button";
import { Input } from "../src/components/ui/input";
import Header from "../src/components/header";
import { t as baseT, translations } from "../src/lib/translations";
import { useLanguage } from "../src/hooks/useLanguage";
import { useToast } from "../src/hooks/useToast";
import {
  setStep,
  updateStep1,
  updateStep2,
  updateStep3,
  updateStep4,
  updateStep5,
  updateStep6,
  setPrice,
  setApplicationId,
  addDocument,
  resetForm,
} from "../src/store/applyFormSlice";
import {
  CheckCircle,
  Star,
  Clock,
  Shield,
  ArrowRight,
  ArrowLeft,
  Globe,
  CreditCard,
  FileText,
  User,
  Phone,
  Calendar,
  Upload,
  Plus,
  Zap,
  Car,
  Plane,
  Send,
} from "lucide-react";

const REPLIT_BACK_END_URL =
  "https://7b04571c-0d62-4a51-9cd2-f2eca1d84482-00-1bagmmob6jow8.picard.replit.dev:5000";
const DEV_BACK_END_URL = "http://localhost:5000";

// t 함수 개선: 언어별로 우선 찾고, 없으면 ko로 fallback
function t(key, language) {
  const keys = key.split(".");
  let value = translations[language];
  for (const k of keys) {
    value = value?.[k];
  }
  if (typeof value === "string") return value;
  // fallback to ko
  value = translations.ko;
  for (const k of keys) {
    value = value?.[k];
  }
  if (typeof value === "string") return value;
  return key;
}

// 단계별 컴포넌트 (1~2단계만 우선 구현)
function Step1ServiceSelection({ data, onChange, price, onNext, language }) {
  return (
    <div className="space-y-8">
      <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-blue-50/30 backdrop-blur-sm">
        <CardHeader className="pb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {t("apply.step1.title", language) || "서비스 선택"}
              </CardTitle>
              <p className="text-gray-600 mt-1">
                원하시는 서비스를 선택해주세요
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 서비스 종류 */}
          <div className="space-y-3">
            <label className="block text-lg font-semibold text-gray-800">
              {t("apply.step1.serviceType", language) || "서비스 종류"}
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  value: "evisa",
                  label: "E-Visa",
                  desc: "온라인 비자 신청",
                  icon: "🌐",
                },
                {
                  value: "arrival",
                  label: "도착 비자",
                  desc: "공항에서 발급",
                  icon: "✈️",
                },
                {
                  value: "visarun",
                  label: "비자런",
                  desc: "국경 통과 서비스",
                  icon: "🚗",
                },
              ].map((service) => (
                <div
                  key={service.value}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                    data.serviceType === service.value
                      ? "border-blue-500 bg-blue-50 shadow-lg transform scale-105"
                      : "border-gray-200 hover:border-blue-300 hover:shadow-md"
                  }`}
                  onClick={() =>
                    onChange({
                      target: { name: "serviceType", value: service.value },
                    })
                  }
                >
                  <div className="text-center">
                    <div className="text-3xl mb-2">{service.icon}</div>
                    <div className="font-semibold text-gray-800">
                      {service.label}
                    </div>
                    <div className="text-sm text-gray-600">{service.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 비자 유형 */}
          <div className="space-y-3">
            <label className="block text-lg font-semibold text-gray-800">
              {t("apply.step1.visaType", language) || "비자 유형"}
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  value: "single",
                  label: "90일 단수",
                  desc: "1회 입국 가능",
                  badge: "인기",
                },
                {
                  value: "multiple",
                  label: "90일 복수",
                  desc: "여러 번 입국 가능",
                  badge: "추천",
                },
              ].map((visa) => (
                <div
                  key={visa.value}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 relative ${
                    data.visaType === visa.value
                      ? "border-green-500 bg-green-50 shadow-lg"
                      : "border-gray-200 hover:border-green-300 hover:shadow-md"
                  }`}
                  onClick={() =>
                    onChange({
                      target: { name: "visaType", value: visa.value },
                    })
                  }
                >
                  {visa.badge && (
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-400 to-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {visa.badge}
                    </div>
                  )}
                  <div className="font-semibold text-gray-800">
                    {visa.label}
                  </div>
                  <div className="text-sm text-gray-600">{visa.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 처리 속도 */}
          <div className="space-y-3">
            <label className="block text-lg font-semibold text-gray-800">
              {t("apply.step1.processing", language) || "처리 속도"}
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  value: "standard",
                  label: "일반",
                  time: "3-5일",
                  icon: <Clock className="w-5 h-5" />,
                  color: "blue",
                },
                {
                  value: "express",
                  label: "급행",
                  time: "1-2일",
                  icon: <Star className="w-5 h-5" />,
                  color: "purple",
                },
                {
                  value: "urgent",
                  label: "초급행",
                  time: "당일",
                  icon: <Shield className="w-5 h-5" />,
                  color: "red",
                },
              ].map((processing) => (
                <div
                  key={processing.value}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                    data.processing === processing.value
                      ? `border-${processing.color}-500 bg-${processing.color}-50 shadow-lg`
                      : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                  }`}
                  onClick={() =>
                    onChange({
                      target: { name: "processing", value: processing.value },
                    })
                  }
                >
                  <div className="flex items-center gap-3">
                    <div className={`text-${processing.color}-600`}>
                      {processing.icon}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">
                        {processing.label}
                      </div>
                      <div className="text-sm text-gray-600">
                        {processing.time}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 실시간 가격 요약 */}
          <div className="sticky bottom-0 mt-8 p-6 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-2xl">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <CreditCard className="w-6 h-6" />
                <span className="text-lg font-semibold">
                  {t("apply.priceSummary", language) || "예상 결제 금액"}
                </span>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">
                  {price.toLocaleString()}₩
                </div>
                <div className="text-blue-200 text-sm">부가세 포함</div>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-8">
            <Button
              onClick={onNext}
              disabled={!data.serviceType || !data.visaType || !data.processing}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="mr-2">
                {t("apply.next", language) || "다음"}
              </span>
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Step2ApplicantInfo({ data, onChange, onNext, onPrev, language }) {
  return (
    <div className="space-y-8">
      <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-green-50/30 backdrop-blur-sm">
        <CardHeader className="pb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {t("apply.step2.title", language) || "신청자 정보 입력"}
              </CardTitle>
              <p className="text-gray-600 mt-1">정확한 정보를 입력해주세요</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                {t("apply.step2.fullNameLabel", language) ||
                  "성명(여권과 동일)"}{" "}
                *
              </label>
              <Input
                name="fullName"
                value={data.fullName || ""}
                onChange={onChange}
                placeholder={
                  t("apply.step2.fullNamePlaceholder", language) ||
                  "예: HONG GILDONG"
                }
                className="border-2 border-gray-200 focus:border-green-500 rounded-xl px-4 py-3 text-lg transition-all duration-300"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                {t("apply.step2.gender", language) || "성별"} *
              </label>
              <select
                name="gender"
                value={data.gender || ""}
                onChange={onChange}
                className="w-full border-2 border-gray-200 focus:border-green-500 rounded-xl px-4 py-3 text-lg transition-all duration-300"
              >
                <option value="">
                  {t("apply.step2.selectGender", language) || "선택"}
                </option>
                <option value="male">남성</option>
                <option value="female">여성</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                {t("apply.step2.birth", language) || "생년월일"} *
              </label>
              <Input
                name="birth"
                type="date"
                value={data.birth || ""}
                onChange={onChange}
                className="border-2 border-gray-200 focus:border-green-500 rounded-xl px-4 py-3 text-lg transition-all duration-300"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                {t("apply.step2.nationality", language) || "국적"} *
              </label>
              <Input
                name="nationality"
                value={data.nationality || ""}
                onChange={onChange}
                placeholder="예: 대한민국"
                className="border-2 border-gray-200 focus:border-green-500 rounded-xl px-4 py-3 text-lg transition-all duration-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                {t("apply.step2.email", language) || "이메일"} *
              </label>
              <Input
                name="email"
                type="email"
                value={data.email || ""}
                onChange={onChange}
                placeholder="example@email.com"
                className="border-2 border-gray-200 focus:border-green-500 rounded-xl px-4 py-3 text-lg transition-all duration-300"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                {t("apply.step2.phone", language) || "베트남 내 연락처"} *
              </label>
              <Input
                name="phone"
                value={data.phone || ""}
                onChange={onChange}
                placeholder="010-1234-5678"
                className="border-2 border-gray-200 focus:border-green-500 rounded-xl px-4 py-3 text-lg transition-all duration-300"
              />
            </div>
          </div>

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={onPrev}
              className="px-6 py-3 border-2 border-gray-300 hover:border-gray-400 rounded-xl font-semibold transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              {t("apply.prev", language) || "이전"}
            </Button>
            <Button
              onClick={onNext}
              disabled={
                !data.fullName ||
                !data.gender ||
                !data.birth ||
                !data.nationality ||
                !data.email
              }
              className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="mr-2">
                {t("apply.next", language) || "다음"}
              </span>
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Step3DocumentUpload({
  data,
  onChange,
  onNext,
  onPrev,
  language,
  applicationId,
}) {
  const [uploadedDocuments, setUploadedDocuments] = useState(
    data.documents || [],
  );
  const [uploadingFiles, setUploadingFiles] = useState({});

  const documentRequirements = [
    {
      type: "passport",
      title: "여권 사본",
      description: "정보가 있는 면 전체가 빛 번짐 없이 선명하게 보여야 합니다",
      required: true,
      icon: <FileText className="w-6 h-6" />,
      guidelines: [
        "여권 정보면 전체가 한 장에 나와야 합니다",
        "글자가 선명하고 읽기 쉬워야 합니다",
        "빛 번짐이나 그림자가 없어야 합니다",
        "여권 모서리가 모두 보여야 합니다",
      ],
    },
    {
      type: "photo",
      title: "증명사진",
      description: "흰색 배경, 안경/모자 착용 금지 등의 규격을 준수해야 합니다",
      required: true,
      icon: <User className="w-6 h-6" />,
      guidelines: [
        "흰색 배경 (다른 색상 불가)",
        "안경, 모자, 액세서리 착용 금지",
        "정면을 향한 자연스러운 표정",
        "크기: 4cm × 6cm (최근 6개월 이내)",
        "고해상도 (최소 300dpi)",
      ],
    },
  ];

  const handleFileUpload = async (documentType, file) => {
    // 파일 유효성 검사
    if (!file) {
      toast({
        title: "오류",
        description: "파일을 선택해주세요.",
        variant: "destructive",
      });
      return;
    }

    // 파일 크기 검사 (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "오류",
        description: "파일 크기는 10MB를 초과할 수 없습니다.",
        variant: "destructive",
      });
      return;
    }

    // 파일 형식 검사
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "application/pdf",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "오류",
        description: "JPG, PNG, PDF 파일만 업로드 가능합니다.",
        variant: "destructive",
      });
      return;
    }

    setUploadingFiles((prev) => ({ ...prev, [documentType]: true }));

    try {
      // Base64로 변환
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64Data = e.target.result;
        
        const documentData = {
          document_type: documentType,
          document_name: file.name,
          file_data: base64Data,
          file_size: file.size,
          file_type: file.type,
          uploaded_at: new Date().toISOString(),
        };

        setUploadedDocuments((prev) => {
          const filtered = prev.filter(
            (doc) => doc.document_type !== documentType,
          );
          return [...filtered, documentData];
        });

        onChange({
          target: {
            name: "documents",
            value: [
              ...uploadedDocuments.filter(
                (doc) => doc.document_type !== documentType,
              ),
              documentData,
            ],
          },
        });

        toast({
          title: "성공",
          description: "파일이 성공적으로 업로드되었습니다.",
        });

        setUploadingFiles((prev) => ({ ...prev, [documentType]: false }));
      };

      reader.onerror = () => {
        toast({
          title: "오류",
          description: "파일 읽기에 실패했습니다.",
          variant: "destructive",
        });
        setUploadingFiles((prev) => ({ ...prev, [documentType]: false }));
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "오류",
        description: "파일 업로드에 실패했습니다.",
        variant: "destructive",
      });
      setUploadingFiles((prev) => ({ ...prev, [documentType]: false }));
    }
  };

  const handleFileDrop = (documentType, e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(documentType, files[0]);
    }
  };

  const handleFileSelect = (documentType, e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(documentType, file);
    }
  };

  const isDocumentUploaded = (documentType) => {
    return uploadedDocuments.some((doc) => doc.document_type === documentType);
  };

  const getUploadedDocument = (documentType) => {
    return uploadedDocuments.find((doc) => doc.document_type === documentType);
  };

  const requiredDocumentsUploaded = documentRequirements
    .filter((req) => req.required)
    .every((req) => isDocumentUploaded(req.type));

  return (
    <div className="space-y-8">
      <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-purple-50/30 backdrop-blur-sm">
        <CardHeader className="pb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {t("apply.step3.title", language) || "서류 업로드"}
              </CardTitle>
              <p className="text-gray-600 mt-1">필수 서류를 업로드해주세요</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          {documentRequirements.map((requirement) => {
            const isUploaded = isDocumentUploaded(requirement.type);
            const uploadedDoc = getUploadedDocument(requirement.type);
            const isUploading = uploadingFiles[requirement.type];

            return (
              <div key={requirement.type} className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`p-2 rounded-lg ${isUploaded ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600"}`}
                  >
                    {requirement.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {requirement.title}
                      </h3>
                      {requirement.required && (
                        <span className="text-red-500 text-sm">*필수</span>
                      )}
                      {isUploaded && (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {requirement.description}
                    </p>
                  </div>
                </div>

                {/* 가이드라인 */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-blue-800 mb-2">
                    📋 업로드 가이드라인
                  </h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    {requirement.guidelines.map((guideline, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>{guideline}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 업로드 영역 */}
                {!isUploaded ? (
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer transition-all duration-300 hover:border-purple-400 hover:bg-purple-50"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleFileDrop(requirement.type, e)}
                    onClick={() =>
                      document
                        .getElementById(`file-${requirement.type}`)
                        .click()
                    }
                  >
                    {isUploading ? (
                      <div className="flex flex-col items-center gap-3">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                        <p className="text-purple-600 font-medium">
                          업로드 중...
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-3">
                        <Upload className="w-12 h-12 text-gray-400" />
                        <div>
                          <p className="text-lg font-medium text-gray-700 mb-1">
                            파일을 드래그하거나 클릭하여 업로드
                          </p>
                          <p className="text-sm text-gray-500">
                            JPG, PNG, PDF 파일 (최대 10MB)
                          </p>
                        </div>
                      </div>
                    )}
                    <input
                      id={`file-${requirement.type}`}
                      type="file"
                      accept="image/*,.pdf"
                      className="hidden"
                      onChange={(e) => handleFileSelect(requirement.type, e)}
                    />
                  </div>
                ) : (
                  <div className="border-2 border-green-300 bg-green-50 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                        <div>
                          <p className="font-semibold text-green-800">
                            {uploadedDoc.document_name}
                          </p>
                          <p className="text-sm text-green-600">업로드 완료</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          document
                            .getElementById(`file-${requirement.type}`)
                            .click()
                        }
                        className="border-green-300 text-green-700 hover:bg-green-100"
                      >
                        다시 업로드
                      </Button>
                    </div>
                    <input
                      id={`file-${requirement.type}`}
                      type="file"
                      accept="image/*,.pdf"
                      className="hidden"
                      onChange={(e) => handleFileSelect(requirement.type, e)}
                    />
                  </div>
                )}
              </div>
            );
          })}

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={onPrev}
              className="px-6 py-3 border-2 border-gray-300 hover:border-gray-400 rounded-xl font-semibold transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              {t("apply.prev", language) || "이전"}
            </Button>
            <Button
              onClick={onNext}
              disabled={
                !requiredDocumentsUploaded ||
                Object.values(uploadingFiles).some(Boolean)
              }
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="mr-2">
                {t("apply.next", language) || "다음"}
              </span>
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// 4단계: 추가 서비스 선택
function Step4AdditionalServices({ data, onChange, onNext, onPrev, language, price }) {
  const additionalServices = [
    {
      id: "airport_pickup",
      title: "공항 픽업 서비스",
      description: "호치민/하노이 공항에서 호텔까지 픽업",
      price: 35000,
      icon: <Car className="w-6 h-6" />,
      popular: false,
    },
    {
      id: "fast_track",
      title: "공항 패스트트랙",
      description: "공항 입출국 대기시간 단축",
      price: 25000,
      icon: <Zap className="w-6 h-6" />,
      popular: true,
    },
    {
      id: "hotel_booking",
      title: "호텔 예약 대행",
      description: "베트남 현지 호텔 예약 서비스",
      price: 15000,
      icon: <Plane className="w-6 h-6" />,
      popular: false,
    },
    {
      id: "travel_insurance",
      title: "여행자 보험",
      description: "베트남 여행 중 의료비 보장",
      price: 20000,
      icon: <Shield className="w-6 h-6" />,
      popular: false,
    },
  ];

  const handleServiceToggle = (serviceId) => {
    const currentServices = data.selectedServices || [];
    const isSelected = currentServices.includes(serviceId);
    
    const newServices = isSelected
      ? currentServices.filter(id => id !== serviceId)
      : [...currentServices, serviceId];

    onChange({
      target: { name: "selectedServices", value: newServices },
    });
  };

  const calculateAdditionalPrice = () => {
    const selectedServices = data.selectedServices || [];
    return additionalServices
      .filter(service => selectedServices.includes(service.id))
      .reduce((total, service) => total + service.price, 0);
  };

  return (
    <div className="space-y-8">
      <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-orange-50/30 backdrop-blur-sm">
        <CardHeader className="pb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                추가 서비스 선택
              </CardTitle>
              <p className="text-gray-600 mt-1">필요한 서비스를 선택해주세요 (선택사항)</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {additionalServices.map((service) => {
              const isSelected = (data.selectedServices || []).includes(service.id);
              return (
                <div
                  key={service.id}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 relative ${
                    isSelected
                      ? "border-orange-500 bg-orange-50 shadow-lg"
                      : "border-gray-200 hover:border-orange-300 hover:shadow-md"
                  }`}
                  onClick={() => handleServiceToggle(service.id)}
                >
                  {service.popular && (
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-400 to-red-500 text-white text-xs px-2 py-1 rounded-full">
                      인기
                    </div>
                  )}
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${isSelected ? "bg-orange-100 text-orange-600" : "bg-gray-100 text-gray-600"}`}>
                      {service.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-800">{service.title}</h3>
                        <div className="text-right">
                          <div className="font-bold text-orange-600">
                            +{service.price.toLocaleString()}₩
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 추가 서비스 가격 요약 */}
          <div className="mt-6 p-4 bg-gradient-to-r from-orange-600 to-red-700 rounded-xl text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">추가 서비스 요금</div>
                <div className="text-sm text-orange-200">
                  {(data.selectedServices || []).length}개 서비스 선택됨
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">
                  +{calculateAdditionalPrice().toLocaleString()}₩
                </div>
                <div className="text-sm text-orange-200">부가세 포함</div>
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={onPrev}
              className="px-6 py-3 border-2 border-gray-300 hover:border-gray-400 rounded-xl font-semibold transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              이전
            </Button>
            <Button
              onClick={onNext}
              className="px-8 py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <span className="mr-2">다음</span>
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// 5단계: 최종 확인
function Step5FinalReview({ data, onNext, onPrev, language, price }) {
  const additionalServices = [
    { id: "airport_pickup", title: "공항 픽업 서비스", price: 35000 },
    { id: "fast_track", title: "공항 패스트트랙", price: 25000 },
    { id: "hotel_booking", title: "호텔 예약 대행", price: 15000 },
    { id: "travel_insurance", title: "여행자 보험", price: 20000 },
  ];

  const selectedServices = (data.step4?.selectedServices || [])
    .map(id => additionalServices.find(service => service.id === id))
    .filter(Boolean);

  const additionalPrice = selectedServices.reduce((total, service) => total + service.price, 0);
  const totalPrice = price + additionalPrice;

  return (
    <div className="space-y-8">
      <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-blue-50/30 backdrop-blur-sm">
        <CardHeader className="pb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                최종 확인
              </CardTitle>
              <p className="text-gray-600 mt-1">신청 정보를 확인해주세요</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 서비스 정보 */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-3">선택한 서비스</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">서비스 종류:</span>
                <span className="ml-2 font-medium">{data.step1?.serviceType || "-"}</span>
              </div>
              <div>
                <span className="text-gray-600">비자 유형:</span>
                <span className="ml-2 font-medium">{data.step1?.visaType || "-"}</span>
              </div>
              <div>
                <span className="text-gray-600">처리 속도:</span>
                <span className="ml-2 font-medium">{data.step1?.processing || "-"}</span>
              </div>
            </div>
          </div>

          {/* 신청자 정보 */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-3">신청자 정보</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">성명:</span>
                <span className="ml-2 font-medium">{data.step2?.fullName || "-"}</span>
              </div>
              <div>
                <span className="text-gray-600">성별:</span>
                <span className="ml-2 font-medium">{data.step2?.gender || "-"}</span>
              </div>
              <div>
                <span className="text-gray-600">생년월일:</span>
                <span className="ml-2 font-medium">{data.step2?.birth || "-"}</span>
              </div>
              <div>
                <span className="text-gray-600">국적:</span>
                <span className="ml-2 font-medium">{data.step2?.nationality || "-"}</span>
              </div>
              <div>
                <span className="text-gray-600">이메일:</span>
                <span className="ml-2 font-medium">{data.step2?.email || "-"}</span>
              </div>
              <div>
                <span className="text-gray-600">연락처:</span>
                <span className="ml-2 font-medium">{data.step2?.phone || "-"}</span>
              </div>
            </div>
          </div>

          {/* 업로드된 서류 */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-3">업로드된 서류</h3>
            <div className="space-y-2">
              {(data.step3?.documents || []).map((doc, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>{doc.document_name}</span>
                  <span className="text-gray-500">({doc.document_type})</span>
                </div>
              ))}
            </div>
          </div>

          {/* 추가 서비스 */}
          {selectedServices.length > 0 && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-3">추가 서비스</h3>
              <div className="space-y-2">
                {selectedServices.map((service, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span>{service.title}</span>
                    <span className="font-medium">+{service.price.toLocaleString()}₩</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 총 결제 금액 */}
          <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-semibold">총 결제 금액</div>
                <div className="text-blue-200 text-sm">부가세 포함</div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">{totalPrice.toLocaleString()}₩</div>
                {additionalPrice > 0 && (
                  <div className="text-sm text-blue-200">
                    (기본: {price.toLocaleString()}₩ + 추가: {additionalPrice.toLocaleString()}₩)
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={onPrev}
              className="px-6 py-3 border-2 border-gray-300 hover:border-gray-400 rounded-xl font-semibold transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              이전
            </Button>
            <Button
              onClick={onNext}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <span className="mr-2">다음</span>
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// 6단계: 결제 (건너뛰기 가능)
function Step6Payment({ data, onChange, onNext, onPrev, language, price }) {
  const additionalServices = [
    { id: "airport_pickup", title: "공항 픽업 서비스", price: 35000 },
    { id: "fast_track", title: "공항 패스트트랙", price: 25000 },
    { id: "hotel_booking", title: "호텔 예약 대행", price: 15000 },
    { id: "travel_insurance", title: "여행자 보험", price: 20000 },
  ];

  const selectedServices = (data.step4?.selectedServices || [])
    .map(id => additionalServices.find(service => service.id === id))
    .filter(Boolean);

  const additionalPrice = selectedServices.reduce((total, service) => total + service.price, 0);
  const totalPrice = price + additionalPrice;

  const handlePaymentMethodChange = (method) => {
    onChange({
      target: { name: "paymentMethod", value: method },
    });
  };

  const handleSkipPayment = () => {
    onChange({
      target: { name: "paymentSkipped", value: true },
    });
    onNext();
  };

  return (
    <div className="space-y-8">
      <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-green-50/30 backdrop-blur-sm">
        <CardHeader className="pb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                결제 방법 선택
              </CardTitle>
              <p className="text-gray-600 mt-1">결제하거나 나중에 결제할 수 있습니다</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 결제 금액 요약 */}
          <div className="p-6 bg-gradient-to-r from-green-600 to-emerald-700 rounded-xl text-white">
            <div className="text-center">
              <div className="text-sm text-green-200 mb-2">총 결제 금액</div>
              <div className="text-4xl font-bold mb-2">{totalPrice.toLocaleString()}₩</div>
              <div className="text-sm text-green-200">부가세 포함</div>
            </div>
          </div>

          {/* 결제 방법 선택 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">결제 방법</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { id: "card", name: "신용카드", icon: "💳" },
                { id: "bank", name: "계좌이체", icon: "🏦" },
                { id: "kakao", name: "카카오페이", icon: "💛" },
                { id: "naver", name: "네이버페이", icon: "💚" },
              ].map((method) => (
                <div
                  key={method.id}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                    data.paymentMethod === method.id
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-green-300"
                  }`}
                  onClick={() => handlePaymentMethodChange(method.id)}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{method.icon}</span>
                    <span className="font-medium">{method.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={onPrev}
              className="px-6 py-3 border-2 border-gray-300 hover:border-gray-400 rounded-xl font-semibold transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              이전
            </Button>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleSkipPayment}
                className="px-6 py-3 border-2 border-orange-300 hover:border-orange-400 text-orange-600 rounded-xl font-semibold transition-all duration-300"
              >
                나중에 결제
              </Button>
              <Button
                onClick={onNext}
                disabled={!data.paymentMethod}
                className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="mr-2">결제하기</span>
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// 7단계: 신청서 전송
function Step7Submit({ data, onSubmit, onPrev, language, isSubmitting }) {
  return (
    <div className="space-y-8">
      <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-purple-50/30 backdrop-blur-sm">
        <CardHeader className="pb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
              <Send className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                신청서 전송
              </CardTitle>
              <p className="text-gray-600 mt-1">모든 정보를 확인하고 신청서를 전송하세요</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center py-8">
            <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Send className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              신청서 전송 준비 완료
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              입력하신 모든 정보와 서류를 검토했습니다. 
              아래 버튼을 클릭하여 베트남 비자 신청서를 전송하세요.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
              <h4 className="font-semibold text-blue-800 mb-2">📋 전송 후 안내사항</h4>
              <ul className="text-sm text-blue-700 space-y-1 text-left">
                <li>• 신청서 전송 후 수정이 어려우니 신중히 검토해주세요</li>
                <li>• 처리 현황은 이메일 및 SMS로 안내드립니다</li>
                <li>• 추가 서류 요청 시 빠른 제출 부탁드립니다</li>
                <li>• 문의사항은 고객센터로 연락주세요</li>
              </ul>
            </div>
          </div>

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={onPrev}
              disabled={isSubmitting}
              className="px-6 py-3 border-2 border-gray-300 hover:border-gray-400 rounded-xl font-semibold transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              이전
            </Button>
            
            <Button
              onClick={onSubmit}
              disabled={isSubmitting}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>전송 중...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>신청서 전송</span>
                  <Send className="w-5 h-5" />
                </div>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ProgressBar({ step, steps, language }) {
  return (
    <div className="mb-12">
      <div className="flex items-center justify-center">
        <div className="flex items-center space-x-4">
          {steps.map((key, idx) => (
            <React.Fragment key={key}>
              <div className="flex items-center">
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-full font-bold text-sm transition-all duration-500 ${
                    idx < step
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg"
                      : idx === step
                        ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg ring-4 ring-blue-200"
                        : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {idx < step ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <span>{idx + 1}</span>
                  )}
                </div>
                <div className="ml-3 hidden sm:block">
                  <div
                    className={`font-semibold text-sm ${
                      idx <= step ? "text-gray-800" : "text-gray-400"
                    }`}
                  >
                    {t(key, language)}
                  </div>
                </div>
              </div>
              {idx < steps.length - 1 && (
                <div
                  className={`w-16 h-1 rounded-full transition-all duration-500 ${
                    idx < step
                      ? "bg-gradient-to-r from-green-500 to-emerald-600"
                      : "bg-gray-200"
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

// 메인 마법사 컴포넌트
export default function ApplyVisaWizard() {
  const { currentLanguage } = useLanguage();
  const { toast } = useToast();
  const dispatch = useDispatch();
  const applyForm = useSelector((state) => state.applyForm);
  
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const steps = [
    "apply.step1.title",
    "apply.step2.title", 
    "apply.step3.title",
    "apply.step4.title",
    "apply.step5.title",
    "apply.step6.title",
    "apply.step7.title",
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  // 가격 계산
  useEffect(() => {
    let base = 89000;
    if (applyForm.form.step1?.serviceType === "arrival") base += 20000;
    if (applyForm.form.step1?.processing === "express") base += 30000;
    if (applyForm.form.step1?.processing === "urgent") base += 60000;
    dispatch(setPrice(base));
  }, [applyForm.form.step1, dispatch]);

  // 단계별 데이터 핸들러
  const handleStep1Change = (e) => {
    const { name, value } = e.target;
    dispatch(updateStep1({ [name]: value }));
  };

  const handleStep2Change = (e) => {
    const { name, value } = e.target;
    dispatch(updateStep2({ [name]: value }));
  };

  const handleStep3Change = (e) => {
    const { name, value } = e.target;
    dispatch(updateStep3({ [name]: value }));
  };

  const handleStep4Change = (e) => {
    const { name, value } = e.target;
    dispatch(updateStep4({ [name]: value }));
  };

  const handleStep5Change = (e) => {
    const { name, value } = e.target;
    dispatch(updateStep5({ [name]: value }));
  };

  const handleStep6Change = (e) => {
    const { name, value } = e.target;
    dispatch(updateStep6({ [name]: value }));
  };

  // 단계 이동
  const next = () => {
    const newStep = Math.min(applyForm.step + 1, steps.length - 1);
    dispatch(setStep(newStep));
  };

  const prev = () => {
    const newStep = Math.max(applyForm.step - 1, 0);
    dispatch(setStep(newStep));
  };

  // 최종 신청서 전송
  const handleSubmitApplication = async () => {
    setIsSubmitting(true);
    
    try {
      // 신청서 데이터 준비
      const applicationData = {
        // 기본 정보
        visa_type: applyForm.form.step1.serviceType || "evisa",
        full_name: applyForm.form.step2.fullName,
        passport_number: `temp_${Date.now()}`, // 임시값
        nationality: applyForm.form.step2.nationality,
        birth_date: applyForm.form.step2.birth,
        phone: applyForm.form.step2.phone,
        email: applyForm.form.step2.email,
        
        // 추가 정보
        gender: applyForm.form.step2.gender,
        processing_speed: applyForm.form.step1.processing,
        visa_subtype: applyForm.form.step1.visaType,
        
        // 서류 정보 (base64 데이터 포함)
        documents: applyForm.form.step3.documents || [],
        
        // 추가 서비스
        additional_services: applyForm.form.step4?.selectedServices || [],
        
        // 결제 정보
        payment_method: applyForm.form.step6?.paymentMethod,
        payment_skipped: applyForm.form.step6?.paymentSkipped || false,
        
        // 가격 정보
        base_price: applyForm.price,
        total_price: applyForm.price + (applyForm.form.step4?.selectedServices?.length || 0) * 25000, // 임시 계산
      };

      console.log("Submitting application:", applicationData);

      // GraphQL mutation 호출 (임시로 fetch 사용)
      const response = await fetch('/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation CreateVisaApplication($input: VisaApplicationInput!) {
              createVisaApplication(input: $input) {
                id
                application_number
                full_name
                status
                created_at
              }
            }
          `,
          variables: {
            input: applicationData
          }
        })
      });

      const result = await response.json();

      if (result.data?.createVisaApplication) {
        const application = result.data.createVisaApplication;
        
        toast({
          title: "신청 완료!",
          description: `신청번호: ${application.application_number}`,
        });

        // Redux 상태 초기화
        dispatch(resetForm());
        
        // 성공 페이지로 리다이렉트 또는 다른 처리
        setTimeout(() => {
          window.location.href = '/dashboard/applications';
        }, 2000);
        
      } else {
        throw new Error(result.errors?.[0]?.message || "신청 처리 중 오류가 발생했습니다.");
      }

    } catch (error) {
      console.error("Application submission failed:", error);
      toast({
        title: "오류",
        description: error.message || "신청서 전송에 실패했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100">
        <Header />
      </div>

      <div className="relative">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-green-400/20 to-emerald-600/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl px-4 py-12 mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
              베트남 비자 신청
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              간편하고 안전한 온라인 비자 신청 서비스를 경험해보세요
            </p>
          </div>

          <ProgressBar step={applyForm.step} steps={steps} language={currentLanguage} />

          <div className="relative">
            {applyForm.step === 0 && (
              <Step1ServiceSelection
                data={applyForm.form.step1}
                onChange={handleStep1Change}
                price={applyForm.price}
                onNext={next}
                language={currentLanguage}
              />
            )}
            {applyForm.step === 1 && (
              <Step2ApplicantInfo
                data={applyForm.form.step2}
                onChange={handleStep2Change}
                onNext={next}
                onPrev={prev}
                language={currentLanguage}
              />
            )}
            {applyForm.step === 2 && (
              <Step3DocumentUpload
                data={applyForm.form.step3}
                onChange={handleStep3Change}
                onNext={next}
                onPrev={prev}
                language={currentLanguage}
                applicationId={applyForm.applicationId}
                toast={toast}
              />
            )}
            {applyForm.step === 3 && (
              <Step4AdditionalServices
                data={applyForm.form.step4}
                onChange={handleStep4Change}
                onNext={next}
                onPrev={prev}
                language={currentLanguage}
                price={applyForm.price}
              />
            )}
            {applyForm.step === 4 && (
              <Step5FinalReview
                data={applyForm.form}
                onNext={next}
                onPrev={prev}
                language={currentLanguage}
                price={applyForm.price}
              />
            )}
            {applyForm.step === 5 && (
              <Step6Payment
                data={applyForm.form.step6}
                onChange={handleStep6Change}
                onNext={next}
                onPrev={prev}
                language={currentLanguage}
                price={applyForm.price}
              />
            )}
            {applyForm.step === 6 && (
              <Step7Submit
                data={applyForm.form}
                onSubmit={handleSubmitApplication}
                onPrev={prev}
                language={currentLanguage}
                isSubmitting={isSubmitting}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}