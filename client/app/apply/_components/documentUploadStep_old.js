"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../src/components/ui/card";
import { Button } from "../../src/components/ui/button";
import { FileText, Upload, CheckCircle, AlertCircle, Camera, ArrowRight, ArrowLeft } from "lucide-react";
import { validateStep } from "./utils";
import { DOCUMENT_TYPES } from "./types";

const DocumentUploadStep = ({ formData, onUpdate, onNext, onPrev }) => {
  const [uploadingFiles, setUploadingFiles] = useState({});

  const documentRequirements = [
    {
      type: DOCUMENT_TYPES.PASSPORT,
      title: "여권 사본",
      description: "정보가 있는 면 전체가 빛 번짐 없이 선명하게 보여야 합니다",
      required: true,
      icon: <FileText className="w-6 h-6" />,
      guidelines: ["여권 정보면 전체가 한 장에 나와야 합니다", "글자가 선명하고 읽기 쉬워야 합니다", "빛 번짐이나 그림자가 없어야 합니다", "여권 모서리가 모두 보여야 합니다"],
    },
    {
      type: DOCUMENT_TYPES.PHOTO,
      title: "증명사진",
      description: "흰색 배경, 안경/모자 착용 금지 등의 규격을 준수해야 합니다",
      required: true,
      icon: <Camera className="w-6 h-6" />,
      guidelines: ["흰색 배경 (다른 색상 불가)", "안경, 모자, 액세서리 착용 금지", "정면을 향한 자연스러운 표정", "크기: 4cm × 6cm (최근 6개월 이내)", "고해상도 (최소 300dpi)"],
    },
    {
      type: DOCUMENT_TYPES.INVITATION,
      title: "초청장 (해당시)",
      description: "비즈니스 목적일 경우 베트남 회사의 초청장",
      required: false,
      icon: <FileText className="w-6 h-6" />,
      guidelines: ["베트남 회사 정식 서한지 사용", "회사 직인 필수", "방문 목적과 기간 명시", "PDF 또는 이미지 파일"],
    },
  ];

  const handleFileUpload = async (documentType, file) => {
    if (!file) return;

    // 파일 유효성 검사
    if (file.size > 10 * 1024 * 1024) {
      alert("파일 크기는 10MB를 초과할 수 없습니다.");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      alert("JPG, PNG, PDF 파일만 업로드 가능합니다.");
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

        const currentDocuments = formData.documents || [];
        const filteredDocuments = currentDocuments.filter((doc) => doc.document_type !== documentType);
        const newDocuments = [...filteredDocuments, documentData];

        onUpdate({ documents: newDocuments });
        setUploadingFiles((prev) => ({ ...prev, [documentType]: false }));
      };

      reader.onerror = () => {
        alert("파일 읽기에 실패했습니다.");
        setUploadingFiles((prev) => ({ ...prev, [documentType]: false }));
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Upload error:", error);
      alert("파일 업로드에 실패했습니다.");
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
    return (formData.documents || []).some((doc) => doc.document_type === documentType);
  };

  const getUploadedDocument = (documentType) => {
    return (formData.documents || []).find((doc) => doc.document_type === documentType);
  };

  const isValid = validateStep(4, formData);

  return (
    <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-orange-50/30">
      <CardHeader className="pb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center">
            <Upload className="w-6 h-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">서류 업로드</CardTitle>
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
                <div className={`p-2 rounded-lg ${isUploaded ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600"}`}>{requirement.icon}</div>
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
                  className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer transition-all duration-300 hover:border-orange-400 hover:bg-orange-50"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleFileDrop(requirement.type, e)}
                  onClick={() => document.getElementById(`file-${requirement.type}`).click()}
                >
                  {isUploading ? (
                    <div className="flex flex-col items-center gap-3">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
                      <p className="text-orange-600 font-medium">업로드 중...</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <Upload className="w-12 h-12 text-gray-400" />
                      <div>
                        <p className="text-lg font-medium text-gray-700 mb-1">파일을 드래그하거나 클릭하여 업로드</p>
                        <p className="text-sm text-gray-500">JPG, PNG, PDF 파일 (최대 10MB)</p>
                      </div>
                    </div>
                  )}
                  <input id={`file-${requirement.type}`} type="file" accept="image/*,.pdf" className="hidden" onChange={(e) => handleFileSelect(requirement.type, e)} />
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
                    <Button variant="outline" size="sm" onClick={() => document.getElementById(`file-${requirement.type}`).click()} className="border-green-300 text-green-700 hover:bg-green-100">
                      다시 업로드
                    </Button>
                  </div>
                  <input id={`file-${requirement.type}`} type="file" accept="image/*,.pdf" className="hidden" onChange={(e) => handleFileSelect(requirement.type, e)} />
                </div>
              )}
            </div>
          );
        })}

        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={onPrev} className="px-6 py-3 border-2 border-gray-300 hover:border-gray-400 rounded-xl font-semibold transition-all duration-300">
            <ArrowLeft className="w-5 h-5 mr-2" />
            이전
          </Button>
          <Button
            onClick={onNext}
            disabled={!isValid || Object.values(uploadingFiles).some(Boolean)}
            className="px-8 py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="mr-2">다음</span>
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentUploadStep;
