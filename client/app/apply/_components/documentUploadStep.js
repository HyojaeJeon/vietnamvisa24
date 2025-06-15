"use client";

import React, { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../src/components/ui/card";
import { Button } from "../../src/components/ui/button";
import { Progress } from "../../src/components/ui/progress";
import { Alert, AlertDescription } from "../../src/components/ui/alert";
import { FileText, Upload, CheckCircle, AlertCircle, Camera, ArrowRight, ArrowLeft, X, Eye, Download, RefreshCw } from "lucide-react";
import { validateStep } from "./utils";

const DocumentUploadStep = ({ formData, onUpdate, onNext, onPrevious }) => {
  const [uploadingFiles, setUploadingFiles] = useState({});
  const [previewFile, setPreviewFile] = useState(null);

  const documentRequirements = [
    {
      type: "passport",
      title: "여권 사본",
      description: "여권 정보면(사진이 있는 페이지) 전체가 선명하게 보여야 합니다",
      required: true,
      icon: <FileText className="w-6 h-6" />,
      maxSize: "10MB",
      formats: ["JPG", "PNG", "PDF"],
      guidelines: [
        "여권 정보면 전체가 한 장에 나와야 합니다",
        "글자가 선명하고 읽기 쉬워야 합니다",
        "빛 번짐이나 그림자가 없어야 합니다",
        "여권 모서리가 모두 보여야 합니다",
        "유효기간이 6개월 이상 남아있어야 합니다",
      ],
    },
    {
      type: "photo",
      title: "증명사진",
      description: "여권 규격의 증명사진 (4cm x 6cm, 최근 6개월 이내)",
      required: true,
      icon: <Camera className="w-6 h-6" />,
      maxSize: "5MB",
      formats: ["JPG", "PNG"],
      guidelines: ["흰색 배경 (다른 색상 불가)", "안경, 모자, 액세서리 착용 금지", "정면을 향한 자연스러운 표정", "크기: 4cm × 6cm", "최근 6개월 이내 촬영", "고해상도 (최소 300dpi)"],
    },
    {
      type: "flight_ticket",
      title: "항공권 예약 확인서",
      description: "왕복 항공권 또는 출국 항공권 예약 확인서",
      required: true,
      icon: <FileText className="w-6 h-6" />,
      maxSize: "10MB",
      formats: ["JPG", "PNG", "PDF"],
      guidelines: ["항공사 정식 예약 확인서", "여행자 이름이 여권과 동일해야 함", "베트남 입국 및 출국 일정 포함", "예약 번호(PNR) 확인 가능해야 함"],
    },
    {
      type: "bank_statement",
      title: "은행 잔고 증명서",
      description: "최근 3개월 은행 거래 내역서 또는 잔고 증명서",
      required: false,
      icon: <FileText className="w-6 h-6" />,
      maxSize: "10MB",
      formats: ["JPG", "PNG", "PDF"],
      guidelines: ["최근 3개월 이내 발급", "은행 공식 도장 또는 인증 필요", "충분한 잔고 확인 가능해야 함", "신청자 이름과 일치해야 함"],
    },
    {
      type: "invitation_letter",
      title: "초청장",
      description: "베트남 현지 초청인의 초청장 (해당시)",
      required: false,
      icon: <FileText className="w-6 h-6" />,
      maxSize: "10MB",
      formats: ["JPG", "PNG", "PDF"],
      guidelines: ["베트남 현지인 또는 회사 발행", "초청인 신분증 사본 첨부", "방문 목적과 기간 명시", "초청인 연락처 정보 포함"],
    },
    {
      type: "business_registration",
      title: "사업자등록증",
      description: "비즈니스 목적일 경우 사업자등록증 (해당시)",
      required: false,
      icon: <FileText className="w-6 h-6" />,
      maxSize: "10MB",
      formats: ["JPG", "PNG", "PDF"],
      guidelines: ["유효한 사업자등록증", "최신 정보로 업데이트된 것", "신청자가 대표자이거나 임직원임을 증명", "회사 도장 또는 인증 필요"],
    },
  ];

  const handleFileUpload = useCallback(
    async (documentType, file) => {
      if (!file) return;

      // 파일 유효성 검사
      const maxSizeMap = {
        passport: 10 * 1024 * 1024,
        photo: 5 * 1024 * 1024,
        flight_ticket: 10 * 1024 * 1024,
        bank_statement: 10 * 1024 * 1024,
        invitation_letter: 10 * 1024 * 1024,
        business_registration: 10 * 1024 * 1024,
      };

      if (file.size > maxSizeMap[documentType]) {
        alert(`파일 크기는 ${Math.round(maxSizeMap[documentType] / (1024 * 1024))}MB를 초과할 수 없습니다.`);
        return;
      }

      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
      if (!allowedTypes.includes(file.type)) {
        alert("JPG, PNG, PDF 파일만 업로드 가능합니다.");
        return;
      }

      setUploadingFiles((prev) => ({ ...prev, [documentType]: 0 }));

      try {
        // 파일을 base64로 변환하여 임시 저장
        const reader = new FileReader();
        reader.onload = (e) => {
          const documents = formData.documents || {};
          documents[documentType] = {
            file: e.target.result,
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type,
            uploadedAt: new Date().toISOString(),
          };

          onUpdate({ documents });
          setUploadingFiles((prev) => {
            const updated = { ...prev };
            delete updated[documentType];
            return updated;
          });
        };

        reader.onerror = () => {
          alert("파일 업로드 중 오류가 발생했습니다.");
          setUploadingFiles((prev) => {
            const updated = { ...prev };
            delete updated[documentType];
            return updated;
          });
        };

        // 업로드 진행률 시뮬레이션
        const progressInterval = setInterval(() => {
          setUploadingFiles((prev) => {
            const current = prev[documentType] || 0;
            if (current >= 95) {
              clearInterval(progressInterval);
              return prev;
            }
            return { ...prev, [documentType]: current + 5 };
          });
        }, 100);

        reader.readAsDataURL(file);
      } catch (error) {
        console.error("파일 업로드 오류:", error);
        alert("파일 업로드 중 오류가 발생했습니다.");
        setUploadingFiles((prev) => {
          const updated = { ...prev };
          delete updated[documentType];
          return updated;
        });
      }
    },
    [formData.documents, onUpdate]
  );

  const handleFileRemove = useCallback(
    (documentType) => {
      const documents = { ...formData.documents };
      delete documents[documentType];
      onUpdate({ documents });
    },
    [formData.documents, onUpdate]
  );

  const handlePreview = useCallback(
    (documentType) => {
      const document = formData.documents?.[documentType];
      if (document) {
        setPreviewFile({ type: documentType, ...document });
      }
    },
    [formData.documents]
  );

  const isValid = validateStep(4, formData);
  const uploadedDocuments = formData.documents || {};

  // 필수 서류 체크
  const requiredDocs = documentRequirements.filter((doc) => doc.required);
  const uploadedRequiredDocs = requiredDocs.filter((doc) => uploadedDocuments[doc.type]);
  const completionRate = Math.round((uploadedRequiredDocs.length / requiredDocs.length) * 100);

  return (
    <Card className="border-0 shadow-2xl bg-gradient-to-br from-white via-slate-50 to-blue-50/30 overflow-hidden">
      <CardHeader className="pb-8 bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white relative">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <Upload className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-3xl font-bold mb-2">서류 업로드</CardTitle>
            <p className="text-amber-100 text-lg">필요한 서류들을 업로드해주세요</p>
            <div className="mt-3">
              <div className="flex items-center justify-between text-sm mb-1">
                <span>완료율</span>
                <span>{completionRate}%</span>
              </div>
              <Progress value={completionRate} className="h-2 bg-white/20" />
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-8 space-y-8">
        {/* 업로드 안내 */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>업로드 시 주의사항:</strong>
            <br />
            • 파일은 선명하고 전체가 보이도록 촬영해주세요
            <br />
            • 빛 번짐이나 그림자가 없도록 해주세요
            <br />• 개인정보가 포함된 서류이므로 안전하게 관리됩니다
          </AlertDescription>
        </Alert>

        {/* 서류 업로드 섹션 */}
        <div className="space-y-6">
          {documentRequirements.map((doc) => {
            const isUploaded = uploadedDocuments[doc.type];
            const isUploading = uploadingFiles[doc.type] !== undefined;

            return (
              <Card
                key={doc.type}
                className={`border-2 transition-all duration-300 ${isUploaded ? "border-green-500 bg-green-50" : doc.required ? "border-orange-300 bg-orange-50" : "border-gray-200 bg-white"}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        isUploaded ? "bg-green-500 text-white" : doc.required ? "bg-orange-500 text-white" : "bg-gray-400 text-white"
                      }`}
                    >
                      {isUploaded ? <CheckCircle className="w-6 h-6" /> : doc.icon}
                    </div>

                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            {doc.title}
                            {doc.required && <span className="text-red-500 text-sm">*필수</span>}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">{doc.description}</p>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">
                            최대 {doc.maxSize} | {doc.formats.join(", ")}
                          </span>
                        </div>
                      </div>

                      {/* 가이드라인 */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {doc.guidelines.map((guideline, index) => (
                          <div key={index} className="flex items-start gap-2 text-xs text-gray-600">
                            <div className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                            <span>{guideline}</span>
                          </div>
                        ))}
                      </div>

                      {/* 업로드 상태 */}
                      {isUploading ? (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-blue-600">
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>업로드 중...</span>
                          </div>
                          <Progress value={uploadingFiles[doc.type]} className="h-2" />
                        </div>
                      ) : isUploaded ? (
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                          <div className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <div>
                              <p className="text-sm font-medium text-gray-800">{uploadedDocuments[doc.type].fileName}</p>
                              <p className="text-xs text-gray-500">{Math.round(uploadedDocuments[doc.type].fileSize / 1024)} KB</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={() => handlePreview(doc.type)} className="px-3 py-1">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleFileRemove(doc.type)} className="px-3 py-1 text-red-600 hover:text-red-700 hover:bg-red-50">
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <input
                            type="file"
                            accept=".jpg,.jpeg,.png,.pdf"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleFileUpload(doc.type, file);
                              }
                            }}
                            className="hidden"
                            id={`file-${doc.type}`}
                          />
                          <label
                            htmlFor={`file-${doc.type}`}
                            className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all duration-200"
                          >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <Upload className="w-8 h-8 mb-2 text-gray-400" />
                              <p className="mb-2 text-sm text-gray-500">
                                <span className="font-semibold">클릭하여 업로드</span> 또는 드래그 앤 드롭
                              </p>
                              <p className="text-xs text-gray-500">
                                {doc.formats.join(", ")} (최대 {doc.maxSize})
                              </p>
                            </div>
                          </label>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* 네비게이션 버튼 */}
        <div className="flex justify-between pt-8 border-t border-gray-200">
          <Button onClick={onPrevious} variant="outline" className="px-8 py-4 border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-bold text-lg rounded-2xl transition-all duration-300">
            <ArrowLeft className="w-6 h-6 mr-3" />
            <span>이전</span>
          </Button>

          <Button
            onClick={onNext}
            disabled={!isValid}
            className="px-12 py-4 bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 hover:from-amber-700 hover:via-orange-700 hover:to-red-700 text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
          >
            <span className="mr-3">다음</span>
            <ArrowRight className="w-6 h-6" />
          </Button>
        </div>
      </CardContent>

      {/* 파일 미리보기 모달 */}
      {previewFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl max-h-screen overflow-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-bold">파일 미리보기</h3>
              <Button variant="outline" size="sm" onClick={() => setPreviewFile(null)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="p-4">
              {previewFile.fileType === "application/pdf" ? (
                <div className="text-center py-8">
                  <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-4">PDF 파일</p>
                  <p className="text-sm text-gray-500">{previewFile.fileName}</p>
                </div>
              ) : (
                <img src={previewFile.file} alt="미리보기" className="max-w-full max-h-96 mx-auto" />
              )}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default DocumentUploadStep;
