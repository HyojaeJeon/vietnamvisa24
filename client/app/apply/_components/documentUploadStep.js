"use client";

import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import imageCompression from "browser-image-compression";
import { Card, CardContent, CardHeader, CardTitle } from "../../src/components/ui/card";
import { Button } from "../../src/components/ui/button";
import { Progress } from "../../src/components/ui/progress";
import { Alert, AlertDescription } from "../../src/components/ui/alert";
import { FileText, Upload, CheckCircle, AlertCircle, Camera, ArrowRight, ArrowLeft, X, Eye, RefreshCw, Info } from "lucide-react";
import { validateStep } from "./utils";

const DocumentUploadStep = ({ formData, onUpdate, onNext, onPrevious }) => {
  const [uploadingFiles, setUploadingFiles] = useState({});
  const [previewFile, setPreviewFile] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState("success");
  // 파일을 base64로 변환하는 함수
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const uploadedDocuments = formData.documents || {};

  const showToast = useCallback((message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 5000);
  }, []);

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
  ];

  // 이미지 압축 함수
  const compressImage = useCallback(
    async (file, documentType) => {
      // PDF 파일은 압축하지 않음
      if (file.type === "application/pdf") {
        return file;
      }

      // 이미지 파일만 압축
      if (file.type.startsWith("image/")) {
        const options = {
          maxSizeMB: documentType === "passport" ? 2 : 1, // 여권은 2MB, 증명사진은 1MB로 압축
          maxWidthOrHeight: documentType === "passport" ? 1920 : 1024, // 여권은 더 큰 해상도 유지
          useWebWorker: true,
          fileType: file.type, // 원본 파일 타입 유지
          initialQuality: 0.8, // 초기 품질 80%
        };

        try {
          showToast("이미지 압축 중...", "info");
          const compressedFile = await imageCompression(file, options);
          const compressionRatio = (((file.size - compressedFile.size) / file.size) * 100).toFixed(1);
          showToast(`이미지 압축 완료 (${compressionRatio}% 크기 감소)`, "success");
          return compressedFile;
        } catch (error) {
          console.error("이미지 압축 실패:", error);
          showToast("이미지 압축에 실패했습니다. 원본 파일을 사용합니다.", "error");
          return file;
        }
      }

      return file;
    },
    [showToast]
  );

  const handleFileUpload = useCallback(
    async (documentType, file) => {
      if (!file) return;
      const maxSize = { passport: 10, photo: 5 }[documentType] * 1024 * 1024;
      if (file.size > maxSize) {
        alert(`파일 크기는 ${maxSize / 1024 / 1024}MB 초과 불가`);
        return;
      }
      if (!["image/jpeg", "image/png", "application/pdf"].includes(file.type)) {
        alert("JPG, PNG, PDF만 업로드 가능");
        return;
      }
      try {
        // 이미지 압축 처리
        const processedFile = await compressImage(file, documentType);

        // 파일을 base64로 변환
        const base64Data = await fileToBase64(processedFile); // 업로드 진행 상태 시작
        setUploadingFiles((p) => ({ ...p, [documentType]: 0 }));

        // 파일 업로드 완료 메시지
        if (documentType === "passport") {
          showToast("여권 사본이 업로드되었습니다", "success");
        } else if (documentType === "photo") {
          showToast("증명사진이 업로드되었습니다", "success");
        }

        setUploadingFiles((p) => ({ ...p, [documentType]: 100 }));
        setTimeout(() => {
          setUploadingFiles((p) => {
            const q = { ...p };
            delete q[documentType];
            return q;
          });
        }, 300);

        // 문서 정보 저장
        const docs = { ...(formData.documents || {}) };
        docs[documentType] = {
          fileName: processedFile.name || file.name,
          fileSize: processedFile.size,
          fileType: processedFile.type,
          uploadedAt: new Date().toISOString(),
          isTemporary: true,
          originalSize: file.size,
          compressionRatio: file.size > 0 ? (((file.size - processedFile.size) / file.size) * 100).toFixed(1) : 0,
          file: base64Data, // base64 인코딩된 파일 데이터 저장
        };

        onUpdate({ documents: docs });
      } catch (e) {
        console.error(e);
        setUploadingFiles((p) => {
          const q = { ...p };
          delete q[documentType];
          return q;
        });
        showToast("파일 업로드 중 오류가 발생했습니다", "error");
      }
    },
    [formData.documents, onUpdate, showToast, compressImage]
  );

  const handleFileRemove = useCallback(
    (type) => {
      const docs = { ...formData.documents };
      delete docs[type];
      onUpdate({ documents: docs });
    },
    [formData.documents, onUpdate]
  );

  const handlePreview = useCallback(
    (type) => {
      const doc = formData.documents?.[type];
      if (doc) setPreviewFile({ type, ...doc });
    },
    [formData.documents]
  );
  const isValid = validateStep(4, formData);
  const uploaded = formData.documents || {};
  const required = documentRequirements.filter((d) => d.required);
  const done = required.filter((d) => uploaded[d.type]).length;
  const completionRate = Math.round((done / required.length) * 100);

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
      <CardContent className="p-4 space-y-6 md:p-8 md:space-y-8">
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
            • 이미지는 자동으로 압축되어 업로드 속도가 향상됩니다
            <br />
            • 업로드된 파일은 임시저장되며, 최종 제출 시 서버에 저장됩니다
            <br />• 개인정보가 포함된 서류이므로 안전하게 관리됩니다
          </AlertDescription>
        </Alert>{" "}
        {/* 서류 업로드 섹션 */}
        <div className="space-y-6">
          {/* 여권 사본 업로드 */}
          {(() => {
            const doc = documentRequirements.find((d) => d.type === "passport");
            const isUploaded = uploadedDocuments[doc.type];
            const isUploading = uploadingFiles[doc.type] !== undefined;

            return (
              <Card className={`border-2 transition-all duration-300 ${isUploaded ? "border-green-500 bg-green-50" : doc.required ? "border-orange-300 bg-orange-50" : "border-gray-200 bg-white"}`}>
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        isUploaded ? "bg-green-500 text-white" : doc.required ? "bg-orange-500 text-white" : "bg-gray-400 text-white"
                      }`}
                    >
                      {isUploaded ? <CheckCircle className="w-6 h-6" /> : doc.icon}
                    </div>

                    <div className="flex-1 space-y-3">
                      <div className="flex flex-col items-start justify-between md:flex-row md:items-center">
                        <div>
                          <h3 className="flex items-center gap-2 text-lg font-bold text-gray-800">
                            {doc.title}
                            {doc.required && <span className="text-sm text-red-500">*필수</span>}
                          </h3>
                          <p className="mt-1 text-sm text-gray-600">{doc.description}</p>
                        </div>

                        <div className="flex items-center gap-2 mt-2 md:mt-0">
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
                        <div className="flex flex-col items-center justify-between p-3 bg-white border rounded-lg md:flex-row">
                          <div className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-800">{uploadedDocuments[doc.type].fileName}</p>
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="text-xs text-gray-500">{Math.round(uploadedDocuments[doc.type].fileSize / 1024)} KB</p>
                                {uploadedDocuments[doc.type].compressionRatio && parseFloat(uploadedDocuments[doc.type].compressionRatio) > 0 && (
                                  <span className="px-2 py-1 text-xs text-purple-700 bg-purple-100 rounded-full">{uploadedDocuments[doc.type].compressionRatio}% 압축</span>
                                )}{" "}
                                {uploadedDocuments[doc.type].isTemporary && <span className="px-2 py-1 text-xs text-blue-700 bg-blue-100 rounded-full">임시저장됨</span>}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mt-3 md:mt-0">
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
                              <p className="mb-2 text-sm text-center text-gray-500">
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
                </CardContent>{" "}
              </Card>
            );
          })()}{" "}
          {/* 증명사진 업로드 */}
          {(() => {
            const doc = documentRequirements.find((d) => d.type === "photo");
            const isUploaded = uploadedDocuments[doc.type];
            const isUploading = uploadingFiles[doc.type] !== undefined;

            return (
              <Card className={`border-2 transition-all duration-300 ${isUploaded ? "border-green-500 bg-green-50" : doc.required ? "border-orange-300 bg-orange-50" : "border-gray-200 bg-white"}`}>
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        isUploaded ? "bg-green-500 text-white" : doc.required ? "bg-orange-500 text-white" : "bg-gray-400 text-white"
                      }`}
                    >
                      {isUploaded ? <CheckCircle className="w-6 h-6" /> : doc.icon}
                    </div>

                    <div className="flex-1 space-y-3">
                      <div className="flex flex-col items-start justify-between md:flex-row md:items-center">
                        <div>
                          <h3 className="flex items-center gap-2 text-lg font-bold text-gray-800">
                            {doc.title}
                            {doc.required && <span className="text-sm text-red-500">*필수</span>}
                          </h3>
                          <p className="mt-1 text-sm text-gray-600">{doc.description}</p>
                        </div>

                        <div className="flex items-center gap-2 mt-2 md:mt-0">
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
                        <div className="flex flex-col items-center justify-between p-3 bg-white border rounded-lg md:flex-row">
                          <div className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-800">{uploadedDocuments[doc.type].fileName}</p>
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="text-xs text-gray-500">{Math.round(uploadedDocuments[doc.type].fileSize / 1024)} KB</p>
                                {uploadedDocuments[doc.type].compressionRatio && parseFloat(uploadedDocuments[doc.type].compressionRatio) > 0 && (
                                  <span className="px-2 py-1 text-xs text-purple-700 bg-purple-100 rounded-full">{uploadedDocuments[doc.type].compressionRatio}% 압축</span>
                                )}
                                {uploadedDocuments[doc.type].isTemporary && <span className="px-2 py-1 text-xs text-blue-700 bg-blue-100 rounded-full">임시저장됨</span>}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mt-3 md:mt-0">
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
                            accept=".jpg,.jpeg,.png"
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
                              <p className="mb-2 text-sm text-center text-gray-500">
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
          })()}
        </div>
        {/* 네비게이션 버튼 */}
        <div className="flex justify-between pt-6 border-t border-gray-200 md:pt-8">
          <Button
            onClick={onPrevious}
            variant="outline"
            className="px-6 py-3 text-base font-bold text-gray-700 transition-all duration-300 border-2 border-gray-300 md:px-8 md:py-4 md:text-lg hover:border-gray-400 rounded-xl md:rounded-2xl"
          >
            <ArrowLeft className="w-5 h-5 mr-2 md:w-6 md:h-6" />
            <span>이전</span>
          </Button>

          <Button
            onClick={onNext}
            disabled={!isValid}
            className="px-8 py-3 text-base font-bold text-white transition-all duration-300 transform shadow-2xl md:px-12 md:py-4 md:text-lg bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 hover:from-amber-700 hover:via-orange-700 hover:to-red-700 rounded-xl md:rounded-2xl hover:shadow-3xl disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
          >
            <span className="mr-2">다음</span>
            <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
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
      {/* 토스트 알림 */}
      {toastMessage && (
        <div className="fixed z-50 duration-300 top-4 right-4 animate-in slide-in-from-right-full">
          <div
            className={`
            max-w-md p-4 rounded-lg shadow-lg border-l-4
            ${toastType === "success" ? "bg-green-50 border-green-400 text-green-800" : toastType === "error" ? "bg-red-50 border-red-400 text-red-800" : "bg-blue-50 border-blue-400 text-blue-800"}
          `}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                {toastType === "success" && <CheckCircle className="w-5 h-5 text-green-600" />}
                {toastType === "error" && <AlertCircle className="w-5 h-5 text-red-600" />}
                {toastType === "info" && <Info className="w-5 h-5 text-blue-600" />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{toastMessage}</p>
              </div>
              <button onClick={() => setToastMessage(null)} className="flex-shrink-0 text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>{" "}
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
