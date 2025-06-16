"use client";

import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { Card, CardContent, CardHeader, CardTitle } from "../../src/components/ui/card";
import { Button } from "../../src/components/ui/button";
import { Progress } from "../../src/components/ui/progress";
import { Alert, AlertDescription } from "../../src/components/ui/alert";
import { FileText, Upload, CheckCircle, AlertCircle, Camera, ArrowRight, ArrowLeft, X, Eye, RefreshCw } from "lucide-react";
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
      description: "여권 규격의 증명사진 (4cm x 6cm, 최근 6개월 이내) / 또는 배경이 깔끔한 셀카도 가능합니다",
      required: true,
      icon: <Camera className="w-6 h-6" />,
      maxSize: "5MB",
      formats: ["JPG", "PNG"],
      guidelines: ["흰색 배경 (다른 색상 불가)", "안경, 모자, 액세서리 착용 금지", "정면을 향한 자연스러운 표정", "크기: 4cm × 6cm", "최근 6개월 이내 촬영", "고해상도 (최소 300dpi)"],
    },
    // {
    //   type: "flight_ticket",
    //   title: "항공권 예약 확인서",
    //   description: "왕복 항공권 또는 출국 항공권 예약 확인서",
    //   required: true,
    //   icon: <FileText className="w-6 h-6" />,
    //   maxSize: "10MB",
    //   formats: ["JPG", "PNG", "PDF"],
    //   guidelines: ["항공사 정식 예약 확인서", "여행자 이름이 여권과 동일해야 함", "베트남 입국 및 출국 일정 포함", "예약 번호(PNR) 확인 가능해야 함"],
    // },
    // {
    //   type: "bank_statement",
    //   title: "은행 잔고 증명서",
    //   description: "최근 3개월 은행 거래 내역서 또는 잔고 증명서",
    //   required: false,
    //   icon: <FileText className="w-6 h-6" />,
    //   maxSize: "10MB",
    //   formats: ["JPG", "PNG", "PDF"],
    //   guidelines: ["최근 3개월 이내 발급", "은행 공식 도장 또는 인증 필요", "충분한 잔고 확인 가능해야 함", "신청자 이름과 일치해야 함"],
    // },
    // {
    //   type: "invitation_letter",
    //   title: "초청장",
    //   description: "베트남 현지 초청인의 초청장 (해당시)",
    //   required: false,
    //   icon: <FileText className="w-6 h-6" />,
    //   maxSize: "10MB",
    //   formats: ["JPG", "PNG", "PDF"],
    //   guidelines: ["베트남 현지인 또는 회사 발행", "초청인 신분증 사본 첨부", "방문 목적과 기간 명시", "초청인 연락처 정보 포함"],
    // },
    // {
    //   type: "business_registration",
    //   title: "사업자등록증",
    //   description: "비즈니스 목적일 경우 사업자등록증 (해당시)",
    //   required: false,
    //   icon: <FileText className="w-6 h-6" />,
    //   maxSize: "10MB",
    //   formats: ["JPG", "PNG", "PDF"],
    //   guidelines: ["유효한 사업자등록증", "최신 정보로 업데이트된 것", "신청자가 대표자이거나 임직원임을 증명", "회사 도장 또는 인증 필요"],
    // },
  ];
  // const handleFileUpload = useCallback(
  //   async (documentType, file) => {
  //     if (!file) return;

  //     // 파일 유효성 검사
  //     const maxSizeMap = {
  //       passport: 10 * 1024 * 1024,
  //       photo: 5 * 1024 * 1024,
  //       flight_ticket: 10 * 1024 * 1024,
  //       bank_statement: 10 * 1024 * 1024,
  //       invitation_letter: 10 * 1024 * 1024,
  //       business_registration: 10 * 1024 * 1024,
  //     };

  //     if (file.size > maxSizeMap[documentType]) {
  //       alert(`파일 크기는 ${Math.round(maxSizeMap[documentType] / (1024 * 1024))}MB를 초과할 수 없습니다.`);
  //       return;
  //     }

  //     const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
  //     if (!allowedTypes.includes(file.type)) {
  //       alert("JPG, PNG, PDF 파일만 업로드 가능합니다.");
  //       return;
  //     }

  //     // 업로드 시작
  //     setUploadingFiles((prev) => ({ ...prev, [documentType]: 10 }));

  //     try {
  //       // 업로드 진행률 시뮬레이션 시작
  //       const progressInterval = setInterval(() => {
  //         setUploadingFiles((prev) => {
  //           const current = prev[documentType] || 0;
  //           if (current >= 90) {
  //             clearInterval(progressInterval);
  //             return prev;
  //           }
  //           return { ...prev, [documentType]: current + 10 };
  //         });
  //       }, 100);

  //       // 파일을 base64로 변환하여 임시 저장 (최종 제출 시 서버 업로드 예정)
  //       const reader = new FileReader();

  //       reader.onload = (e) => {
  //         // 진행률을 100%로 설정
  //         setUploadingFiles((prev) => ({ ...prev, [documentType]: 100 }));

  //         // 짧은 딜레이 후 완료 처리
  //         setTimeout(() => {
  //           const documents = { ...formData.documents } || {};
  //           documents[documentType] = {
  //             file: e.target.result, // base64 데이터 (임시 저장)
  //             fileName: file.name,
  //             fileSize: file.size,
  //             fileType: file.type,
  //             uploadedAt: new Date().toISOString(),
  //             // 서버 업로드는 최종 제출 시 진행
  //             isTemporary: true,
  //           };

  //           onUpdate({ documents });

  //           // 업로드 상태 제거
  //           setUploadingFiles((prev) => {
  //             const updated = { ...prev };
  //             delete updated[documentType];
  //             return updated;
  //           });

  //           clearInterval(progressInterval);
  //         }, 500);
  //       };

  //       reader.onerror = () => {
  //         clearInterval(progressInterval);
  //         alert("파일 업로드 중 오류가 발생했습니다.");
  //         setUploadingFiles((prev) => {
  //           const updated = { ...prev };
  //           delete updated[documentType];
  //           return updated;
  //         });
  //       };

  //       reader.readAsDataURL(file);
  //     } catch (error) {
  //       console.error("파일 업로드 오류:", error);
  //       alert("파일 업로드 중 오류가 발생했습니다.");
  //       setUploadingFiles((prev) => {
  //         const updated = { ...prev };
  //         delete updated[documentType];
  //         return updated;
  //       });
  //     }
  //   },
  //   [formData.documents, onUpdate]
  // );

  const handleFileUpload = useCallback(
    async (documentType, file) => {
      if (!file) return;

      // 1) 유효성 검사
      const maxSizeMap = {
        passport: 10 * 1024 * 1024,
        photo: 5 * 1024 * 1024,
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

      // 2) 업로드 시작 표시
      setUploadingFiles((prev) => ({ ...prev, [documentType]: 10 }));

      try {
        // 3) 실제 서버 업로드
        const form = new FormData();
        form.append("image", file);

        const res = await fetch("http://localhost:5002/api/extract_passport", {
          method: "POST",
          body: form,
        });

        if (!res.ok) {
          throw new Error(`서버 오류: ${res.status}`);
        }

        // 4) 서버에서 리턴된 OCR/MRZ 결과
        const ocrResult = await res.json();

        // 5) 업로드 진행률 마무리
        setUploadingFiles((prev) => ({ ...prev, [documentType]: 100 }));
        setTimeout(() => {
          setUploadingFiles((prev) => {
            const next = { ...prev };
            delete next[documentType];
            return next;
          });
        }, 300);

        // 6) formData에 저장
        const docs = { ...(formData.documents || {}) };
        docs[documentType] = {
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          uploadedAt: new Date().toISOString(),
          isTemporary: true,
          ocrResult, // ← 여기에 Python 스크립트 결과를 붙여 둡니다
        };
        onUpdate({ documents: docs });
      } catch (err) {
        console.error("추출 오류:", err);
        alert("서버에 업로드하거나 OCR을 수행하는 중 오류가 발생했습니다.");
        setUploadingFiles((prev) => {
          const next = { ...prev };
          delete next[documentType];
          return next;
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
    <Card className="overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-white via-slate-50 to-blue-50/30">
      <CardHeader className="relative pb-8 text-white bg-gradient-to-r from-amber-600 via-orange-600 to-red-600">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 flex items-center gap-4">
          <div className="flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl">
            <Upload className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <CardTitle className="mb-2 text-3xl font-bold">서류 업로드</CardTitle>
            <p className="text-lg text-amber-100">필요한 서류들을 업로드해주세요</p>
            <div className="mt-3">
              <div className="flex items-center justify-between mb-1 text-sm">
                <span>완료율</span>
                <span>{completionRate}%</span>
              </div>
              <Progress value={completionRate} className="h-2 bg-white/20" />
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-8 space-y-8">
        {" "}
        {/* 업로드 안내 */}
        <Alert>
          <AlertCircle className="w-4 h-4" />
          <AlertDescription>
            <strong>업로드 시 주의사항:</strong>
            <br />
            • 파일은 선명하고 전체가 보이도록 촬영해주세요
            <br />
            • 빛 번짐이나 그림자가 없도록 해주세요
            <br />
            • 업로드된 파일은 임시저장되며, 최종 제출 시 서버에 저장됩니다
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
                          <h3 className="flex items-center gap-2 text-lg font-bold text-gray-800">
                            {doc.title}
                            {doc.required && <span className="text-sm text-red-500">*필수</span>}
                          </h3>
                          <p className="mt-1 text-sm text-gray-600">{doc.description}</p>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">
                            최대 {doc.maxSize} | {doc.formats.join(", ")}
                          </span>
                        </div>
                      </div>

                      {/* 가이드라인 */}
                      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                        {doc.guidelines.map((guideline, index) => (
                          <div key={index} className="flex items-start gap-2 text-xs text-gray-600">
                            <div className="flex-shrink-0 w-1 h-1 mt-2 bg-gray-400 rounded-full"></div>
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
                        <div className="flex items-center justify-between p-3 bg-white border rounded-lg">
                          <div className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <div>
                              <p className="text-sm font-medium text-gray-800">{uploadedDocuments[doc.type].fileName}</p>
                              <div className="flex items-center gap-2">
                                <p className="text-xs text-gray-500">{Math.round(uploadedDocuments[doc.type].fileSize / 1024)} KB</p>
                                {uploadedDocuments[doc.type].isTemporary && <span className="px-2 py-1 text-xs text-blue-700 bg-blue-100 rounded-full">임시저장됨</span>}
                              </div>
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
                            className="flex flex-col items-center justify-center w-full h-32 transition-all duration-200 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
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
          <Button onClick={onPrevious} variant="outline" className="px-8 py-4 text-lg font-bold text-gray-700 transition-all duration-300 border-2 border-gray-300 hover:border-gray-400 rounded-2xl">
            <ArrowLeft className="w-6 h-6 mr-3" />
            <span>이전</span>
          </Button>

          <Button
            onClick={onNext}
            disabled={!isValid}
            className="px-12 py-4 text-lg font-bold text-white transition-all duration-300 transform shadow-2xl bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 hover:from-amber-700 hover:via-orange-700 hover:to-red-700 rounded-2xl hover:shadow-3xl disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
          >
            <span className="mr-3">다음</span>
            <ArrowRight className="w-6 h-6" />
          </Button>
        </div>
      </CardContent>

      {/* 파일 미리보기 모달 */}
      {previewFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="max-w-4xl max-h-screen overflow-auto bg-white rounded-lg">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-bold">파일 미리보기</h3>
              <Button variant="outline" size="sm" onClick={() => setPreviewFile(null)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="p-4">
              {previewFile.fileType === "application/pdf" ? (
                <div className="py-8 text-center">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="mb-4 text-gray-600">PDF 파일</p>
                  <p className="text-sm text-gray-500">{previewFile.fileName}</p>
                </div>
              ) : (
                <img src={previewFile.file} alt="미리보기" className="max-w-full mx-auto max-h-96" />
              )}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

DocumentUploadStep.propTypes = {
  formData: PropTypes.object.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  onPrevious: PropTypes.func.isRequired,
};

export default DocumentUploadStep;
