
"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../src/components/ui/card";
import { Button } from "../src/components/ui/button";
import { Input } from "../src/components/ui/input";
import Header from "../src/components/header";
import { t as baseT, translations } from "../src/lib/translations";
import { useLanguage } from "../src/hooks/useLanguage";
import { CheckCircle, Star, Clock, Shield, ArrowRight, ArrowLeft, Globe, CreditCard, FileText, User, Phone, Calendar, Upload } from "lucide-react";

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
              <p className="text-gray-600 mt-1">원하시는 서비스를 선택해주세요</p>
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
                { value: "evisa", label: "E-Visa", desc: "온라인 비자 신청", icon: "🌐" },
                { value: "arrival", label: "도착 비자", desc: "공항에서 발급", icon: "✈️" },
                { value: "visarun", label: "비자런", desc: "국경 통과 서비스", icon: "🚗" }
              ].map((service) => (
                <div 
                  key={service.value}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                    data.serviceType === service.value 
                      ? 'border-blue-500 bg-blue-50 shadow-lg transform scale-105' 
                      : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                  }`}
                  onClick={() => onChange({ target: { name: 'serviceType', value: service.value } })}
                >
                  <div className="text-center">
                    <div className="text-3xl mb-2">{service.icon}</div>
                    <div className="font-semibold text-gray-800">{service.label}</div>
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
                { value: "single", label: "90일 단수", desc: "1회 입국 가능", badge: "인기" },
                { value: "multiple", label: "90일 복수", desc: "여러 번 입국 가능", badge: "추천" }
              ].map((visa) => (
                <div 
                  key={visa.value}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 relative ${
                    data.visaType === visa.value 
                      ? 'border-green-500 bg-green-50 shadow-lg' 
                      : 'border-gray-200 hover:border-green-300 hover:shadow-md'
                  }`}
                  onClick={() => onChange({ target: { name: 'visaType', value: visa.value } })}
                >
                  {visa.badge && (
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-400 to-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {visa.badge}
                    </div>
                  )}
                  <div className="font-semibold text-gray-800">{visa.label}</div>
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
                { value: "standard", label: "일반", time: "3-5일", icon: <Clock className="w-5 h-5" />, color: "blue" },
                { value: "express", label: "급행", time: "1-2일", icon: <Star className="w-5 h-5" />, color: "purple" },
                { value: "urgent", label: "초급행", time: "당일", icon: <Shield className="w-5 h-5" />, color: "red" }
              ].map((processing) => (
                <div 
                  key={processing.value}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                    data.processing === processing.value 
                      ? `border-${processing.color}-500 bg-${processing.color}-50 shadow-lg` 
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
                  onClick={() => onChange({ target: { name: 'processing', value: processing.value } })}
                >
                  <div className="flex items-center gap-3">
                    <div className={`text-${processing.color}-600`}>{processing.icon}</div>
                    <div>
                      <div className="font-semibold text-gray-800">{processing.label}</div>
                      <div className="text-sm text-gray-600">{processing.time}</div>
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
                <span className="text-lg font-semibold">{t("apply.priceSummary", language) || "예상 결제 금액"}</span>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">{price.toLocaleString()}₩</div>
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
              <span className="mr-2">{t("apply.next", language) || "다음"}</span>
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
                {t("apply.step2.fullNameLabel", language) || "성명(여권과 동일)"} *
              </label>
              <Input 
                name="fullName" 
                value={data.fullName || ""} 
                onChange={onChange} 
                placeholder={t("apply.step2.fullNamePlaceholder", language) || "예: HONG GILDONG"}
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
                <option value="">{t("apply.step2.selectGender", language) || "선택"}</option>
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
              disabled={!data.fullName || !data.gender || !data.birth || !data.nationality || !data.email}
              className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="mr-2">{t("apply.next", language) || "다음"}</span>
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Step3DocumentUpload({ data, onChange, onNext, onPrev, language, applicationId }) {
  const [uploadedDocuments, setUploadedDocuments] = useState(data.documents || []);
  const [uploadingFiles, setUploadingFiles] = useState({});

  const documentRequirements = [
    {
      type: 'passport',
      title: '여권 사본',
      description: '정보가 있는 면 전체가 빛 번짐 없이 선명하게 보여야 합니다',
      required: true,
      icon: <FileText className="w-6 h-6" />,
      guidelines: [
        '여권 정보면 전체가 한 장에 나와야 합니다',
        '글자가 선명하고 읽기 쉬워야 합니다',
        '빛 번짐이나 그림자가 없어야 합니다',
        '여권 모서리가 모두 보여야 합니다'
      ]
    },
    {
      type: 'photo',
      title: '증명사진',
      description: '흰색 배경, 안경/모자 착용 금지 등의 규격을 준수해야 합니다',
      required: true,
      icon: <User className="w-6 h-6" />,
      guidelines: [
        '흰색 배경 (다른 색상 불가)',
        '안경, 모자, 액세서리 착용 금지',
        '정면을 향한 자연스러운 표정',
        '크기: 4cm × 6cm (최근 6개월 이내)',
        '고해상도 (최소 300dpi)'
      ]
    }
  ];

  const handleFileUpload = async (documentType, file) => {
    if (!applicationId) {
      alert('신청서를 먼저 생성해주세요.');
      return;
    }

    setUploadingFiles(prev => ({ ...prev, [documentType]: true }));

    try {
      const formData = new FormData();
      formData.append('document', file);
      formData.append('document_type', documentType);
      formData.append('application_id', applicationId);

      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        const newDocument = result.document;
        setUploadedDocuments(prev => {
          const filtered = prev.filter(doc => doc.document_type !== documentType);
          return [...filtered, newDocument];
        });
        
        onChange({
          target: {
            name: 'documents',
            value: [...uploadedDocuments.filter(doc => doc.document_type !== documentType), newDocument]
          }
        });
      } else {
        throw new Error(result.message || '업로드 실패');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert(`업로드 오류: ${error.message}`);
    } finally {
      setUploadingFiles(prev => ({ ...prev, [documentType]: false }));
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
    return uploadedDocuments.some(doc => doc.document_type === documentType);
  };

  const getUploadedDocument = (documentType) => {
    return uploadedDocuments.find(doc => doc.document_type === documentType);
  };

  const requiredDocumentsUploaded = documentRequirements
    .filter(req => req.required)
    .every(req => isDocumentUploaded(req.type));

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
                  <div className={`p-2 rounded-lg ${isUploaded ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                    {requirement.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-gray-900">{requirement.title}</h3>
                      {requirement.required && <span className="text-red-500 text-sm">*필수</span>}
                      {isUploaded && <CheckCircle className="w-5 h-5 text-green-500" />}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{requirement.description}</p>
                  </div>
                </div>

                {/* 가이드라인 */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-blue-800 mb-2">📋 업로드 가이드라인</h4>
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
                    onClick={() => document.getElementById(`file-${requirement.type}`).click()}
                  >
                    {isUploading ? (
                      <div className="flex flex-col items-center gap-3">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                        <p className="text-purple-600 font-medium">업로드 중...</p>
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
                          <p className="font-semibold text-green-800">{uploadedDoc.document_name}</p>
                          <p className="text-sm text-green-600">업로드 완료</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById(`file-${requirement.type}`).click()}
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
              disabled={!requiredDocumentsUploaded || Object.values(uploadingFiles).some(Boolean)}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="mr-2">{t("apply.next", language) || "다음"}</span>
              <ArrowRight className="w-5 h-5" />
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
                <div className={`flex items-center justify-center w-12 h-12 rounded-full font-bold text-sm transition-all duration-500 ${
                  idx < step 
                    ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg" 
                    : idx === step 
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg ring-4 ring-blue-200" 
                    : "bg-gray-200 text-gray-500"
                }`}>
                  {idx < step ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <span>{idx + 1}</span>
                  )}
                </div>
                <div className="ml-3 hidden sm:block">
                  <div className={`font-semibold text-sm ${
                    idx <= step ? "text-gray-800" : "text-gray-400"
                  }`}>
                    {t(key, language)}
                  </div>
                </div>
              </div>
              {idx < steps.length - 1 && (
                <div className={`w-16 h-1 rounded-full transition-all duration-500 ${
                  idx < step ? "bg-gradient-to-r from-green-500 to-emerald-600" : "bg-gray-200"
                }`} />
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
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    step1: {},
    step2: {},
    step3: {},
    // step4~6은 이후 추가
  });
  const [price, setPrice] = useState(0);
  const [applicationId, setApplicationId] = useState(null);
  const steps = ["apply.step1.title", "apply.step2.title", "apply.step3.title", "apply.step4.title", "apply.step5.title", "apply.step6.title"];

  useEffect(() => {
    setMounted(true);
  }, []);

  // localStorage 연동
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = window.localStorage.getItem("applyVisaForm");
      if (saved) {
        try {
          setForm(JSON.parse(saved));
        } catch {}
      }
    }
  }, []);
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("applyVisaForm", JSON.stringify(form));
    }
  }, [form]);

  // 가격 계산 (샘플: 실제로는 서비스/옵션에 따라 계산)
  useEffect(() => {
    let base = 89000;
    if (form.step1?.serviceType === "arrival") base += 20000;
    if (form.step1?.processing === "express") base += 30000;
    if (form.step1?.processing === "urgent") base += 60000;
    setPrice(base);
  }, [form.step1]);

  // 단계별 데이터 핸들러
  const handleStep1Change = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, step1: { ...prev.step1, [name]: value } }));
  };
  const handleStep2Change = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, step2: { ...prev.step2, [name]: value } }));
  };
  const handleStep3Change = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, step3: { ...prev.step3, [name]: value } }));
  };

  // 신청서 생성 및 다음 단계로 이동
  const createApplicationAndNext = async () => {
    try {
      // 임시 신청서 생성 (실제로는 GraphQL mutation 사용)
      const tempApplicationId = `temp_${Date.now()}`;
      setApplicationId(tempApplicationId);
      
      // 실제 구현시에는 여기서 GraphQL CREATE_APPLICATION mutation을 호출
      console.log('Creating application with data:', {
        ...form.step1,
        ...form.step2
      });
      
      next();
    } catch (error) {
      console.error('Application creation failed:', error);
      alert('신청서 생성에 실패했습니다. 다시 시도해주세요.');
    }
  };

  // 단계 이동
  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  if (!mounted) {
    // SSR과 hydration mismatch 방지: 클라이언트 마운트 전에는 렌더링하지 않음
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

          <ProgressBar step={step} steps={steps} language={currentLanguage} />
          
          <div className="relative">
            {step === 0 && <Step1ServiceSelection data={form.step1} onChange={handleStep1Change} price={price} onNext={next} language={currentLanguage} />}
            {step === 1 && <Step2ApplicantInfo data={form.step2} onChange={handleStep2Change} onNext={createApplicationAndNext} onPrev={prev} language={currentLanguage} />}
            {step === 2 && <Step3DocumentUpload data={form.step3} onChange={handleStep3Change} onNext={next} onPrev={prev} language={currentLanguage} applicationId={applicationId} />}
            {/* 4~6단계는 이후 구현 */}
          </div>
        </div>
      </div>
    </div>
  );
}
