"use client";

import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import imageCompression from "browser-image-compression";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../src/components/ui/card";
import { Button } from "../../src/components/ui/button";
import { Progress } from "../../src/components/ui/progress";
import { Alert, AlertDescription } from "../../src/components/ui/alert";
import {
  FileText,
  Upload,
  CheckCircle,
  AlertCircle,
  Camera,
  ArrowRight,
  ArrowLeft,
  X,
  Eye,
  Loader2,
  Sparkles,
  Info,
  RefreshCw,
} from "lucide-react";
import { validateStep } from "./utils";

const DocumentUploadStep = ({ formData, onUpdate, onNext, onPrevious }) => {
  const [uploadingFiles, setUploadingFiles] = useState({});
  const [previewFile, setPreviewFile] = useState(null);
  const [extractedPassportInfo, setExtractedPassportInfo] = useState(null);
  const [editingPassportInfo, setEditingPassportInfo] = useState(null);
  const [ocrProcessing, setOcrProcessing] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [ocrStatus, setOcrStatus] = useState("");
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState("success");
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  // 파일을 base64로 변환하는 함수
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const extractPassportInfoRest = async (formData) => {
    const res = await fetch("/api/extract_passport", {
      method: "POST",
      body: formData, // 브라우저가 multipart boundary를 자동 설정합니다.
    });
    if (!res.ok) {
      throw new Error(`OCR 요청 실패: ${res.status}`);
    }
    return res.json();
  };

  // 프로필 이미지 적합성 검사 API 함수
  const validateProfileImageRest = async (formData) => {
    const res = await fetch("/api/upload_profile_image", {
      method: "POST",
      body: formData,
    });
    if (!res.ok) {
      throw new Error(`프로필 이미지 검증 실패: ${res.status}`);
    }
    return res.json();
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
      description:
        "여권 정보면(사진이 있는 페이지) 전체가 선명하게 보여야 합니다",
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
      description:
        "여권 규격의 증명사진 (4cm x 6cm, 최근 6개월 이내) / 또는 배경이 깔끔한 셀카도 가능합니다",
      required: true,
      icon: <Camera className="w-6 h-6" />,
      maxSize: "5MB",
      formats: ["JPG", "PNG"],
      guidelines: [
        "흰색 배경 (다른 색상 불가)",
        "안경, 모자, 액세서리 착용 금지",
        "정면을 향한 자연스러운 표정",
        "크기: 4cm × 6cm",
        "최근 6개월 이내 촬영",
        "고해상도 (최소 300dpi)",
      ],
    },
  ];
  const mapPassportDataToPersonalInfo = (ocrResult) => {
    const info = {};
    if (!ocrResult) return info;

    // 날짜 포맷팅 함수 개선 (OCR 응답의 다양한 날짜 형식 지원)
    const formatDate = (dateStr) => {
      if (!dateStr) return "";

      // 이미 YYYY-MM-DD 형식인 경우 그대로 반환
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        return dateStr;
      }

      // "04 AUG 1991" 형식 처리
      const monthMap = {
        JAN: "01",
        FEB: "02",
        MAR: "03",
        APR: "04",
        MAY: "05",
        JUN: "06",
        JUL: "07",
        AUG: "08",
        SEP: "09",
        OCT: "10",
        NOV: "11",
        DEC: "12",
      };

      const match = dateStr.match(/(\d{1,2})\s+([A-Z]{3})\s+(\d{4})/);
      if (match) {
        const [, day, month, year] = match;
        const monthNum = monthMap[month];
        if (monthNum) {
          return `${year}-${monthNum}-${day.padStart(2, "0")}`;
        }
      }

      // YYYYMMDD 형식 처리
      if (/^\d{8}$/.test(dateStr)) {
        return `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`;
      }

      // YYMMDD 형식 처리
      if (/^\d{6}$/.test(dateStr)) {
        const yy = dateStr.slice(0, 2);
        const mm = dateStr.slice(2, 4);
        const dd = dateStr.slice(4, 6);
        const year = parseInt(yy, 10) >= 90 ? `19${yy}` : `20${yy}`;
        return `${year}-${mm}-${dd}`;
      }

      return dateStr;
    }; // 성별 처리 - 원본 영어 값을 우선으로 저장
    const formatGender = (s) => {
      if (!s) return "";
      return s.toUpperCase(); // 영어 원본 그대로 반환 (M, F)
    };

    // 국적 처리 - 원본 영어 값 우선
    const formatNationality = (nationality) => {
      if (!nationality) return "";
      return nationality; // 영어 원본 그대로 반환
    };

    // 이름 처리 - 영어 이름을 우선으로 저장
    if (ocrResult.surname) info.lastName = ocrResult.surname.trim();
    if (ocrResult.given_names) info.firstName = ocrResult.given_names.trim();

    // 날짜 필드 처리
    if (ocrResult.date_of_birth)
      info.birthDate = formatDate(ocrResult.date_of_birth);
    if (ocrResult.date_of_issue)
      info.passportIssueDate = formatDate(ocrResult.date_of_issue);
    if (ocrResult.date_of_expiry)
      info.passportExpiryDate = formatDate(ocrResult.date_of_expiry);

    // 기타 필드 처리
    if (ocrResult.sex) {
      info.gender = formatGender(ocrResult.sex);
      info.genderCode = ocrResult.sex.toUpperCase(); // 원본 영어 코드도 저장
    }

    if (ocrResult.type) info.passportType = ocrResult.type.trim();
    if (ocrResult.authority) info.authority = ocrResult.authority.trim();

    if (ocrResult.nationality) {
      info.nationality = formatNationality(ocrResult.nationality);
      info.nationalityCode = ocrResult.nationality; // 원본 영어 코드도 저장
    }

    if (ocrResult.passport_no)
      info.passportNo = ocrResult.passport_no.trim();
    if (ocrResult.issuing_country) {
      info.issuingCountry = ocrResult.issuing_country; // 영어 원본 그대로 저장
      info.issuingCountryCode = ocrResult.issuing_country; // 원본 코드도 저장
    }

    // 한글 이름이 있는 경우 별도 필드로 저장 (덮어쓰지 않음)
    if (ocrResult.korean_name) {
      const kn = ocrResult.korean_name.trim();
      info.koreanName = kn; // 한글 이름 전체를 별도 필드로 저장

      // 한글 이름이 있고 영어 이름이 없는 경우에만 한글 이름을 분리해서 사용
      if (!info.lastName && !info.firstName && kn.length > 1) {
        info.lastName = kn[0];
        info.firstName = kn.slice(1);
      }
    }

    return info;
  };

  const handleSavePassportInfo = useCallback(() => {
    if (!extractedPassportInfo?.mapped) return;
    const finalInfo = editingPassportInfo || extractedPassportInfo.mapped;
    const current = { ...(formData.personalInfo || {}) };
    Object.entries(finalInfo).forEach(([k, v]) => {
      if (v) current[k] = v;
    });
    onUpdate({ personalInfo: current });
    const fields = Object.keys(finalInfo).length;
    if (fields)
      showToast(`정보가 개인정보 입력 단계에 적용되었습니다`, "success");
    setEditingPassportInfo(null);
  }, [
    editingPassportInfo,
    extractedPassportInfo,
    formData.personalInfo,
    onUpdate,
    showToast,
  ]);

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
          const compressionRatio = (
            ((file.size - compressedFile.size) / file.size) *
            100
          ).toFixed(1);
          showToast(
            `이미지 압축 완료 (${compressionRatio}% 크기 감소)`,
            "success",
          );
          return compressedFile;
        } catch (error) {
          console.error("이미지 압축 실패:", error);
          showToast(
            "이미지 압축에 실패했습니다. 원본 파일을 사용합니다.",
            "error",
          );
          return file;
        }
      }

      return file;
    },
    [showToast],
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
        const base64Data = await fileToBase64(processedFile);

        // 업로드 진행 상태 시작
        setUploadingFiles((p) => ({ ...p, [documentType]: 0 }));

        let apiResult = null;

        if (documentType === "passport") {
          // 여권 OCR 처리
          setShowLoadingModal(true);
          setLoadingMessage("AI가 여권에서 필요한 정보를 추출하는 중입니다..");
          setOcrProcessing(true);
          setOcrProgress(20);
          setOcrStatus("전처리 중...");

          const form = new FormData();
          form.append("image", processedFile);
          apiResult = await extractPassportInfoRest(form);

          setOcrProgress(100);
          setOcrStatus("완료!");
        } else if (documentType === "photo") {
          // 증명사진 적합성 검사
          setShowLoadingModal(true);
          setLoadingMessage("AI가 증명사진의 적합성을 검사하는 중입니다..");
          showToast("증명사진 적합성 검사 중...", "info");

          const form = new FormData();
          form.append("image", processedFile);
          apiResult = await validateProfileImageRest(form);
        }

        setUploadingFiles((p) => ({ ...p, [documentType]: 100 }));

        setTimeout(() => {
          setUploadingFiles((p) => {
            const q = { ...p };
            delete q[documentType];
            return q;
          });
          if (documentType === "passport") {
            setOcrProcessing(false);
            setOcrProgress(0);
            setOcrStatus("");
          }
          setShowLoadingModal(false);
          setLoadingMessage("");
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
          compressionRatio:
            file.size > 0
              ? (((file.size - processedFile.size) / file.size) * 100).toFixed(
                  1,
                )
              : 0,
          file: base64Data, // base64 인코딩된 파일 데이터 저장
          ...(documentType === "passport" && {
            ocrResult: apiResult,
            extractedInfo: (() => {
              const converted = convertOcrDataToCamelCase(apiResult);
              console.log("🔍 OCR conversion in documentUploadStep:", {
                original: apiResult,
                converted: converted,
                originalKeys: apiResult ? Object.keys(apiResult) : [],
                convertedKeys: converted ? Object.keys(converted) : [],
              });
              return converted;
            })(), // GraphQL 전송용 camelCase 데이터
          }),
          ...(documentType === "photo" && { validationResult: apiResult }),
        };

        const update = { documents: docs };

        // 여권 OCR 결과 처리
        if (documentType === "passport" && apiResult && !apiResult.error) {
          const mapped = mapPassportDataToPersonalInfo(apiResult);
          setExtractedPassportInfo({ raw: apiResult, mapped });
          Object.assign(update, {
            personalInfo: { ...(formData.personalInfo || {}), ...mapped },
          });
          showToast(
            `여권에서 ${Object.keys(mapped).length}개 정보 추출`,
            "success",
          );
        } else if (
          documentType === "passport" &&
          apiResult &&
          apiResult.error
        ) {
          showToast("OCR 오류, 수동입력 필요", "error");
        }

        // 증명사진 검증 결과 처리
        if (documentType === "photo" && apiResult) {
          const result = apiResult.result || apiResult;
          if (result === "SUITABLE") {
            showToast("증명사진이 규정에 적합합니다!", "success");
          } else {
            showToast(
              "증명사진이 여권 규정에 부적합합니다. 다른 사진을 업로드해주세요.",
              "error",
            );
          }
        }

        onUpdate(update);
      } catch (e) {
        console.error(e);
        if (documentType === "passport") {
          setOcrProcessing(false);
          setOcrProgress(0);
          setOcrStatus("");
        }
        setUploadingFiles((p) => {
          const q = { ...p };
          delete q[documentType];
          return q;
        });
        setShowLoadingModal(false);
        setLoadingMessage("");

        if (documentType === "photo") {
          showToast("증명사진 검증 중 오류가 발생했습니다", "error");
        } else {
          showToast("업로드 또는 OCR 오류", "error");
        }
      }
    },
    [
      formData.documents,
      formData.personalInfo,
      extractPassportInfoRest,
      validateProfileImageRest,
      onUpdate,
      showToast,
      compressImage,
    ],
  );

  const handleFileRemove = useCallback(
    (type) => {
      const docs = { ...formData.documents };
      delete docs[type];
      onUpdate({ documents: docs });
    },
    [formData.documents, onUpdate],
  );

  const handlePreview = useCallback(
    (type) => {
      const doc = formData.documents?.[type];
      if (doc) setPreviewFile({ type, ...doc });
    },
    [formData.documents],
  );

  const isValid = validateStep(4, formData);
  const uploaded = formData.documents || {};
  const required = documentRequirements.filter((d) => d.required);
  const done = required.filter((d) => uploaded[d.type]).length;
  const completionRate = Math.round((done / required.length) * 100);

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

  return (
    <Card className="overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-white via-slate-50 to-blue-50/30">
      <CardHeader className="relative pb-8 text-white bg-gradient-to-r from-amber-600 via-orange-600 to-red-600">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 flex items-center gap-4">
          <div className="flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl">
            <Upload className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <CardTitle className="mb-2 text-3xl font-bold">
              서류 업로드
            </CardTitle>
            <p className="text-lg text-amber-100">
              필요한 서류들을 업로드해주세요
            </p>
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
      <CardContent className="p-4 md:p-8 space-y-6 md:space-y-8">
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
              <Card
                className={`border-2 transition-all duration-300 ${isUploaded ? "border-green-500 bg-green-50" : doc.required ? "border-orange-300 bg-orange-50" : "border-gray-200 bg-white"}`}
              >
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        isUploaded
                          ? "bg-green-500 text-white"
                          : doc.required
                            ? "bg-orange-500 text-white"
                            : "bg-gray-400 text-white"
                      }`}
                    >
                      {isUploaded ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        doc.icon
                      )}
                    </div>

                    <div className="flex-1 space-y-3">
                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                        <div>
                          <h3 className="flex items-center gap-2 text-lg font-bold text-gray-800">
                            {doc.title}
                            {doc.required && (
                              <span className="text-sm text-red-500">
                                *필수
                              </span>
                            )}
                          </h3>
                          <p className="mt-1 text-sm text-gray-600">
                            {doc.description}
                          </p>
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
                          <div
                            key={index}
                            className="flex items-start gap-2 text-xs text-gray-600"
                          >
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
                          <Progress
                            value={uploadingFiles[doc.type]}
                            className="h-2"
                          />
                        </div>
                      ) : isUploaded ? (
                        <div className="flex flex-col md:flex-row items-center justify-between p-3 bg-white border rounded-lg">
                          <div className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-800">
                                {uploadedDocuments[doc.type].fileName}
                              </p>
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="text-xs text-gray-500">
                                  {Math.round(
                                    uploadedDocuments[doc.type].fileSize / 1024,
                                  )}{" "}
                                  KB
                                </p>
                                {uploadedDocuments[doc.type].compressionRatio &&
                                  parseFloat(
                                    uploadedDocuments[doc.type]
                                      .compressionRatio,
                                  ) > 0 && (
                                    <span className="px-2 py-1 text-xs text-purple-700 bg-purple-100 rounded-full">
                                      {
                                        uploadedDocuments[doc.type]
                                          .compressionRatio
                                      }
                                      % 압축
                                    </span>
                                  )}
                                {uploadedDocuments[doc.type].isTemporary && (
                                  <span className="px-2 py-1 text-xs text-blue-700 bg-blue-100 rounded-full">
                                    임시저장됨
                                  </span>
                                )}
                                {/* 여권 OCR 결과가 있는 경우 추가 정보 표시 */}
                                {doc.type === "passport" &&
                                  uploadedDocuments[doc.type].ocrResult &&
                                  !uploadedDocuments[doc.type].ocrResult
                                    .error && (
                                    <span className="px-2 py-1 text-xs text-green-700 bg-green-100 rounded-full">
                                      정보 자동추출됨
                                    </span>
                                  )}
                                {doc.type === "passport" &&
                                  uploadedDocuments[doc.type].ocrResult &&
                                  uploadedDocuments[doc.type].ocrResult
                                    .error && (
                                    <span className="px-2 py-1 text-xs text-orange-700 bg-orange-100 rounded-full">
                                      수동입력 필요
                                    </span>
                                  )}
                              </div>
                              {/* OCR 추출 정보 미리보기 */}
                              {doc.type === "passport" &&
                                uploadedDocuments[doc.type].ocrResult &&
                                !uploadedDocuments[doc.type].ocrResult
                                  .error && (
                                  <div className="mt-1 text-xs text-gray-600">
                                    {uploadedDocuments[doc.type].ocrResult
                                      .given_names &&
                                      uploadedDocuments[doc.type].ocrResult
                                        .surname && (
                                        <span>
                                          이름:{" "}
                                          {
                                            uploadedDocuments[doc.type]
                                              .ocrResult.surname
                                          }{" "}
                                          {
                                            uploadedDocuments[doc.type]
                                              .ocrResult.given_names
                                          }{" "}
                                          |
                                        </span>
                                      )}
                                    {uploadedDocuments[doc.type].ocrResult
                                      .korean_name && (
                                      <span>
                                        한글명:{" "}
                                        {
                                          uploadedDocuments[doc.type].ocrResult
                                            .korean_name
                                        }{" "}
                                        |{" "}
                                      </span>
                                    )}
                                    {uploadedDocuments[doc.type].ocrResult
                                      .passport_no && (
                                      <span>
                                        여권번호:{" "}
                                        {
                                          uploadedDocuments[doc.type].ocrResult
                                            .passport_no
                                        }
                                      </span>
                                    )}
                                  </div>
                                )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mt-3 md:mt-0">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePreview(doc.type)}
                              className="px-3 py-1"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleFileRemove(doc.type)}
                              className="px-3 py-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
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
                              <p className="mb-2 text-sm text-gray-500 text-center">
                                <span className="font-semibold">
                                  클릭하여 업로드
                                </span>{" "}
                                또는 드래그 앤 드롭
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
          })()}
          {/* 여권 정보 편집 섹션 */}
          {extractedPassportInfo && (
            <Card className="border-2 shadow-lg border-emerald-200 bg-gradient-to-br from-emerald-50 to-blue-50/30">
              <CardHeader className="pb-4 text-white rounded-t-lg bg-gradient-to-r from-emerald-500 to-blue-500">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xl font-bold">
                      추출된 여권 정보 확인 및 수정
                    </div>
                    <div className="mt-1 text-sm font-normal text-emerald-100">
                      AI가 자동으로 추출한 정보입니다
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6">
                {/* 안내 메시지 */}
                <div className="p-4 mb-6 border border-blue-200 rounded-lg bg-blue-100/70">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-800">
                      <p className="mb-1 font-medium">
                        자동 추출된 정보를 확인해주세요
                      </p>
                      <p>
                        정보가 정확하지 않은 경우 직접 수정할 수 있습니다.
                        수정된 내용은 개인정보 입력 단계에 자동으로 반영됩니다.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {" "}
                  {/* 여권 타입 */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <span>여권 타입 (Passport Type)</span>
                      {extractedPassportInfo.raw?.type && (
                        <span className="px-2 py-1 text-xs text-green-700 bg-green-100 rounded-full">
                          자동추출
                        </span>
                      )}
                    </label>
                    <input
                      type="text"
                      title="여권타입(Passport Type)"
                      value={
                        editingPassportInfo?.passportType ??
                        extractedPassportInfo.raw?.type ??
                        ""
                      }
                      onChange={(e) =>
                        setEditingPassportInfo((prev) => ({
                          ...(prev || extractedPassportInfo.mapped || {}),
                          passportType: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 transition-all duration-200 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="여권 타입을 입력하세요"
                    />
                  </div>
                  {/* 발급국가 코드 */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <span>발급국가 코드 (Issuing Country Code)</span>
                      {extractedPassportInfo.raw?.issuing_country && (
                        <span className="px-2 py-1 text-xs text-green-700 bg-green-100 rounded-full">
                          자동추출
                        </span>
                      )}
                    </label>
                    <input
                      type="text"
                      title="발급국가코드(Issuing Country Code)"
                      value={
                        editingPassportInfo?.issuingCountryCode ??
                        extractedPassportInfo.raw?.issuing_country ??
                        ""
                      }
                      onChange={(e) =>
                        setEditingPassportInfo((prev) => ({
                          ...(prev || extractedPassportInfo.mapped || {}),
                          issuingCountryCode: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 transition-all duration-200 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="발급국가 코드를 입력하세요"
                    />
                  </div>
                  {/* 성 */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <span>성 (Surname)</span>
                      {extractedPassportInfo.mapped?.lastName && (
                        <span className="px-2 py-1 text-xs text-green-700 bg-green-100 rounded-full">
                          자동추출
                        </span>
                      )}
                    </label>
                    <input
                      type="text"
                      title="성(Surname)"
                      value={
                        editingPassportInfo?.lastName ??
                        extractedPassportInfo.mapped?.lastName ??
                        ""
                      }
                      onChange={(e) =>
                        setEditingPassportInfo((prev) => ({
                          ...(prev || extractedPassportInfo.mapped || {}),
                          lastName: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 transition-all duration-200 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="성을 입력하세요"
                    />
                  </div>
                  {/* 이름 */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <span>이름 (Given Names)</span>
                      {extractedPassportInfo.mapped?.firstName && (
                        <span className="px-2 py-1 text-xs text-green-700 bg-green-100 rounded-full">
                          자동추출
                        </span>
                      )}
                    </label>
                    <input
                      type="text"
                      title="이름(Given Names)"
                      value={
                        editingPassportInfo?.firstName ??
                        extractedPassportInfo.mapped?.firstName ??
                        ""
                      }
                      onChange={(e) =>
                        setEditingPassportInfo((prev) => ({
                          ...(prev || extractedPassportInfo.mapped || {}),
                          firstName: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 transition-all duration-200 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="이름을 입력하세요"
                    />
                  </div>
                  {/* 한글 이름 */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <span>한글 이름 (Korean Name)</span>
                      {extractedPassportInfo.mapped?.koreanName && (
                        <span className="px-2 py-1 text-xs text-green-700 bg-green-100 rounded-full">
                          자동추출
                        </span>
                      )}
                    </label>
                    <input
                      type="text"
                      title="한글성명(Korean Name)"
                      value={
                        editingPassportInfo?.koreanName ??
                        extractedPassportInfo.mapped?.koreanName ??
                        (extractedPassportInfo.raw?.korean_name &&
                        extractedPassportInfo.raw?.surname &&
                        extractedPassportInfo.raw?.given_names
                          ? `${extractedPassportInfo.raw.surname} ${extractedPassportInfo.raw.given_names}(${extractedPassportInfo.raw.korean_name})`
                          : (extractedPassportInfo.raw?.korean_name ?? ""))
                      }
                      onChange={(e) =>
                        setEditingPassportInfo((prev) => ({
                          ...(prev || extractedPassportInfo.mapped || {}),
                          koreanName: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 transition-all duration-200 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="한글 이름을 입력하세요"
                    />
                  </div>
                  {/* 생년월일 */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <span>생년월일 (Date of Birth)</span>
                      {extractedPassportInfo.mapped?.birthDate && (
                        <span className="px-2 py-1 text-xs text-green-700 bg-green-100 rounded-full">
                          자동추출
                        </span>
                      )}
                    </label>
                    <input
                      type="date"
                      title="생년월일(Date of Birth)"
                      value={
                        editingPassportInfo?.birthDate ??
                        extractedPassportInfo.mapped?.birthDate ??
                        ""
                      }
                      onChange={(e) =>
                        setEditingPassportInfo((prev) => ({
                          ...(prev || extractedPassportInfo.mapped || {}),
                          birthDate: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 transition-all duration-200 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  {/* 성별 */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <span>성별 (Sex)</span>
                      {extractedPassportInfo.mapped?.gender && (
                        <span className="px-2 py-1 text-xs text-green-700 bg-green-100 rounded-full">
                          자동추출
                        </span>
                      )}
                    </label>
                    <input
                      type="text"
                      title="성별(Sex)"
                      value={
                        editingPassportInfo?.gender ??
                        extractedPassportInfo.mapped?.gender ??
                        (extractedPassportInfo.raw?.sex
                          ? extractedPassportInfo.raw.sex
                          : "")
                      }
                      onChange={(e) =>
                        setEditingPassportInfo((prev) => ({
                          ...(prev || extractedPassportInfo.mapped || {}),
                          gender: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 transition-all duration-200 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="성별을 입력하세요"
                    />
                  </div>
                  {/* 국적 */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <span>국적 (Nationality)</span>
                      {extractedPassportInfo.mapped?.nationality && (
                        <span className="px-2 py-1 text-xs text-green-700 bg-green-100 rounded-full">
                          자동추출
                        </span>
                      )}
                    </label>
                    <input
                      type="text"
                      title="국적(Nationality)"
                      value={
                        editingPassportInfo?.nationality ??
                        extractedPassportInfo.mapped?.nationality ??
                        (extractedPassportInfo.raw?.nationality
                          ? extractedPassportInfo.raw.nationality
                          : "")
                      }
                      onChange={(e) =>
                        setEditingPassportInfo((prev) => ({
                          ...(prev || extractedPassportInfo.mapped || {}),
                          nationality: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 transition-all duration-200 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="국적을 입력하세요"
                    />
                  </div>
                  {/* 여권번호 */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <span>여권번호 (Passport Number)</span>
                      {extractedPassportInfo.mapped?.passportNo && (
                        <span className="px-2 py-1 text-xs text-green-700 bg-green-100 rounded-full">
                          자동추출
                        </span>
                      )}
                    </label>
                    <input
                      type="text"
                      title="여권번호(Passport Number)"
                      value={
                        editingPassportInfo?.passportNo ??
                        extractedPassportInfo.mapped?.passportNo ??
                        ""
                      }
                      onChange={(e) =>
                        setEditingPassportInfo((prev) => ({
                          ...(prev || extractedPassportInfo.mapped || {}),
                          passportNo: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 transition-all duration-200 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="여권번호를 입력하세요"
                    />
                  </div>
                  {/* 개인번호 */}
                  {/* <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <span>개인번호 (Personal Number)</span>
                      {extractedPassportInfo.raw?.personal_no && <span className="px-2 py-1 text-xs text-green-700 bg-green-100 rounded-full">자동추출</span>}
                    </label>
                    <input
                      type="text"
                      title="개인번호(Personal Number)"
                      value={editingPassportInfo?.personalNumber ?? extractedPassportInfo.raw?.personal_no ?? ""}
                      onChange={(e) =>
                        setEditingPassportInfo((prev) => ({
                          ...(prev || extractedPassportInfo.mapped || {}),
                          personalNumber: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 transition-all duration-200 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="개인번호를 입력하세요"
                    />
                  </div> */}
                  {/* 여권 발급국가 */}
                  {/* <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <span>여권 발급국가 (Issuing Country)</span>
                      {extractedPassportInfo.mapped?.issuingCountry && <span className="px-2 py-1 text-xs text-green-700 bg-green-100 rounded-full">자동추출</span>}
                    </label>
                    <input
                      type="text"
                      title="여권발급국가(Issuing Country)"
                      value={
                        editingPassportInfo?.issuingCountry ??
                        extractedPassportInfo.mapped?.issuingCountry ??
                        (extractedPassportInfo.raw?.issuing_country ? extractedPassportInfo.raw.issuing_country : "")
                      }
                      onChange={(e) =>
                        setEditingPassportInfo((prev) => ({
                          ...(prev || extractedPassportInfo.mapped || {}),
                          issuingCountry: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 transition-all duration-200 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="여권 발급국가를 입력하세요"
                    />
                  </div> */}
                  {/* 여권 발급일 */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <span>여권 발급일 (Date of Issue)</span>
                      {extractedPassportInfo.mapped?.passportIssueDate && (
                        <span className="px-2 py-1 text-xs text-green-700 bg-green-100 rounded-full">
                          자동추출
                        </span>
                      )}
                    </label>
                    <input
                      type="date"
                      title="여권발급일(Date of Issue)"
                      value={
                        editingPassportInfo?.passportIssueDate ??
                        extractedPassportInfo.mapped?.passportIssueDate ??
                        ""
                      }
                      onChange={(e) =>
                        setEditingPassportInfo((prev) => ({
                          ...(prev || extractedPassportInfo.mapped || {}),
                          passportIssueDate: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 transition-all duration-200 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  {/* 여권 만료일 */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <span>여권 만료일 (Date of Expiry)</span>
                      {extractedPassportInfo.mapped?.passportExpiryDate && (
                        <span className="px-2 py-1 text-xs text-green-700 bg-green-100 rounded-full">
                          자동추출
                        </span>
                      )}
                    </label>
                    <input
                      type="date"
                      title="여권만료일(Date of Expiry)"
                      value={
                        editingPassportInfo?.passportExpiryDate ??
                        extractedPassportInfo.mapped?.passportExpiryDate ??
                        ""
                      }
                      onChange={(e) =>
                        setEditingPassportInfo((prev) => ({
                          ...(prev || extractedPassportInfo.mapped || {}),
                          passportExpiryDate: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 transition-all duration-200 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  {/* 발급기관 */}
                  {/* <div className="space-y-2 md:col-span-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <span>발급기관 (Issuing Authority)</span>
                      {extractedPassportInfo.raw?.authority && <span className="px-2 py-1 text-xs text-green-700 bg-green-100 rounded-full">자동추출</span>}
                    </label>
                    <input
                      type="text"
                      title="발급기관(Issuing Authority)"
                      value={editingPassportInfo?.authority ?? extractedPassportInfo.raw?.authority ?? ""}
                      onChange={(e) =>
                        setEditingPassportInfo((prev) => ({
                          ...(prev || extractedPassportInfo.mapped || {}),
                          authority: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 transition-all duration-200 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="발급기관을 입력하세요"
                    />
                  </div> */}
                </div>
                {/* 저장 버튼 */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 mt-6 border-t border-emerald-200">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">수정사항이 있나요?</span>{" "}
                    저장하시면 개인정보 입력 단계에 반영됩니다.
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditingPassportInfo(null);
                        setExtractedPassportInfo(null);
                      }}
                      className="px-6 py-3 text-gray-700 transition-all duration-200 border-2 border-gray-300 hover:bg-gray-50"
                    >
                      <X className="w-4 h-4 mr-2" />
                      취소
                    </Button>
                    <Button
                      onClick={handleSavePassportInfo}
                      className="px-8 py-3 font-semibold text-white transition-all duration-200 transform shadow-lg bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 hover:shadow-xl hover:scale-105"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      정보 저장 및 적용
                    </Button>
                  </div>
                </div>
                {/* 원본 OCR 데이터 미리보기 (개발자용) */}
                {process.env.NODE_ENV === "development" && (
                  <details className="mt-4">
                    <summary className="text-xs text-gray-500 cursor-pointer">
                      원본 OCR 데이터 보기 (개발용)
                    </summary>
                    <pre className="p-2 mt-2 overflow-auto text-xs bg-gray-100 rounded">
                      {JSON.stringify(extractedPassportInfo.raw, null, 2)}
                    </pre>
                  </details>
                )}
              </CardContent>
            </Card>
          )}

          {/* 증명사진 업로드 */}
          {(() => {
            const doc = documentRequirements.find((d) => d.type === "photo");
            const isUploaded = uploadedDocuments[doc.type];
            const isUploading = uploadingFiles[doc.type] !== undefined;

            return (
              <Card
                className={`border-2 transition-all duration-300 ${isUploaded ? "border-green-500 bg-green-50" : doc.required ? "border-orange-300 bg-orange-50" : "border-gray-200 bg-white"}`}
              >
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        isUploaded
                          ? "bg-green-500 text-white"
                          : doc.required
                            ? "bg-orange-500 text-white"
                            : "bg-gray-400 text-white"
                      }`}
                    >
                      {isUploaded ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        doc.icon
                      )}
                    </div>

                    <div className="flex-1 space-y-3">
                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                        <div>
                          <h3 className="flex items-center gap-2 text-lg font-bold text-gray-800">
                            {doc.title}
                            {doc.required && (
                              <span className="text-sm text-red-500">
                                *필수
                              </span>
                            )}
                          </h3>
                          <p className="mt-1 text-sm text-gray-600">
                            {doc.description}
                          </p>
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
                          <div
                            key={index}
                            className="flex items-start gap-2 text-xs text-gray-600"
                          >
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
                          <Progress
                            value={uploadingFiles[doc.type]}
                            className="h-2"
                          />
                        </div>
                      ) : isUploaded ? (
                        <div className="space-y-3">
                          {/* 증명사진 검증 결과 표시 */}
                          {uploadedDocuments[doc.type].validationResult && (
                            <div
                              className={`p-3 rounded-lg border-2 ${
                                (uploadedDocuments[doc.type].validationResult
                                  .result ||
                                  uploadedDocuments[doc.type]
                                    .validationResult) === "SUITABLE"
                                  ? "bg-green-50 border-green-200"
                                  : "bg-red-50 border-red-200"
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                {(uploadedDocuments[doc.type].validationResult
                                  .result ||
                                  uploadedDocuments[doc.type]
                                    .validationResult) === "SUITABLE" ? (
                                  <>
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                    <span className="text-sm font-medium text-green-800">
                                      여권 규정에 적합한 증명사진입니다
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <AlertCircle className="w-5 h-5 text-red-600" />
                                    <span className="text-sm font-medium text-red-800">
                                      여권 규정에 부적합한 증명사진입니다
                                    </span>
                                  </>
                                )}
                              </div>
                              {(uploadedDocuments[doc.type].validationResult
                                .result ||
                                uploadedDocuments[doc.type]
                                  .validationResult) !== "SUITABLE" && (
                                <div className="mt-2 text-xs text-red-700">
                                  <p>다음 사항을 확인해주세요:</p>
                                  <ul className="mt-1 ml-4 list-disc">
                                    <li>정면을 바라보고 있는지</li>
                                    <li>중립적인 표정인지 (웃지 않기)</li>
                                    <li>모자나 액세서리를 착용하지 않았는지</li>
                                    <li>배경이 깔끔한지</li>
                                  </ul>
                                </div>
                              )}
                            </div>
                          )}

                          <div className="flex flex-col md:flex-row items-center justify-between p-3 bg-white border rounded-lg">
                            <div className="flex items-center gap-3">
                              <CheckCircle className="w-5 h-5 text-green-500" />
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-800">
                                  {uploadedDocuments[doc.type].fileName}
                                </p>
                                <div className="flex flex-wrap items-center gap-2">
                                  <p className="text-xs text-gray-500">
                                    {Math.round(
                                      uploadedDocuments[doc.type].fileSize /
                                        1024,
                                    )}{" "}
                                    KB
                                  </p>
                                  {uploadedDocuments[doc.type]
                                    .compressionRatio &&
                                    parseFloat(
                                      uploadedDocuments[doc.type]
                                        .compressionRatio,
                                    ) > 0 && (
                                      <span className="px-2 py-1 text-xs text-purple-700 bg-purple-100 rounded-full">
                                        {
                                          uploadedDocuments[doc.type]
                                            .compressionRatio
                                        }
                                        % 압축
                                      </span>
                                    )}
                                  {uploadedDocuments[doc.type].isTemporary && (
                                    <span className="px-2 py-1 text-xs text-blue-700 bg-blue-100 rounded-full">
                                      임시저장됨
                                    </span>
                                  )}
                                  {/* 검증 결과 배지 */}
                                  {(uploadedDocuments[doc.type].validationResult
                                    ?.result ||
                                    uploadedDocuments[doc.type]
                                      .validationResult) === "SUITABLE" ? (
                                    <span className="px-2 py-1 text-xs text-green-700 bg-green-100 rounded-full">
                                      규정 적합
                                    </span>
                                  ) : uploadedDocuments[doc.type]
                                      .validationResult ? (
                                    <span className="px-2 py-1 text-xs text-red-700 bg-red-100 rounded-full">
                                      규정 부적합
                                    </span>
                                  ) : null}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 mt-3 md:mt-0">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePreview(doc.type)}
                                className="px-3 py-1"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleFileRemove(doc.type)}
                                className="px-3 py-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>

                          {/* 부적합한 경우 재업로드 버튼 표시 */}
                          {uploadedDocuments[doc.type].validationResult &&
                            (uploadedDocuments[doc.type].validationResult
                              ?.result ||
                              uploadedDocuments[doc.type].validationResult) !==
                              "SUITABLE" && (
                              <div className="mt-3">
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
                                  id={`file-retry-${doc.type}`}
                                />
                                <label
                                  htmlFor={`file-retry-${doc.type}`}
                                  className="flex items-center justify-center w-full p-3 text-sm font-medium text-orange-700 transition-all duration-200 border-2 border-orange-300 rounded-lg cursor-pointer bg-orange-50 hover:bg-orange-100"
                                >
                                  <Upload className="w-4 h-4 mr-2" />
                                  다른 증명사진 업로드
                                </label>
                              </div>
                            )}
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
                              <p className="mb-2 text-sm text-gray-500 text-center">
                                <span className="font-semibold">
                                  클릭하여 업로드
                                </span>{" "}
                                또는 드래그 앤 드롭
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
        {/* OCR 진행 상태 표시 */}
        {ocrProcessing && (
          <Card className="border-2 border-amber-200 bg-amber-50/50">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-amber-100">
                  <Loader2 className="w-6 h-6 text-amber-600 animate-spin" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-amber-800">
                    여권 정보 자동 추출 중
                  </h3>
                  <p className="mb-3 text-sm text-amber-600">{ocrStatus}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-amber-600">
                      <span>진행률</span>
                      <span>{ocrProgress}%</span>
                    </div>
                    <Progress
                      value={ocrProgress}
                      className="h-2 bg-amber-200"
                    />
                  </div>
                </div>
              </div>
              <div className="p-3 mt-4 rounded-lg bg-amber-100/50">
                <div className="flex items-center gap-2 text-sm text-amber-700">
                  <Sparkles className="w-4 h-4" />
                  <span>
                    AI가 여권에서 개인정보를 자동으로 추출하고 있습니다. 잠시만
                    기다려주세요.
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        {/* 네비게이션 버튼 */}
        <div className="flex justify-between pt-6 md:pt-8 border-t border-gray-200">
          <Button
            onClick={onPrevious}
            variant="outline"
            className="px-6 py-3 md:px-8 md:py-4 text-base md:text-lg font-bold text-gray-700 transition-all duration-300 border-2 border-gray-300 hover:border-gray-400 rounded-xl md:rounded-2xl"
          >
            <ArrowLeft className="w-5 h-5 md:w-6 md:h-6 mr-2" />
            <span>이전</span>
          </Button>

          <Button
            onClick={onNext}
            disabled={!isValid}
            className="px-8 py-3 md:px-12 md:py-4 text-base md:text-lg font-bold text-white transition-all duration-300 transform shadow-2xl bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 hover:from-amber-700 hover:via-orange-700 hover:to-red-700 rounded-xl md:rounded-2xl hover:shadow-3xl disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
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
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPreviewFile(null)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="p-4">
              {previewFile.fileType === "application/pdf" ? (
                <div className="py-8 text-center">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="mb-4 text-gray-600">PDF 파일</p>
                  <p className="text-sm text-gray-500">
                    {previewFile.fileName}
                  </p>
                </div>
              ) : (
                <img
                  src={previewFile.file}
                  alt="미리보기"
                  className="max-w-full mx-auto max-h-96"
                />
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
                {toastType === "success" && (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                )}
                {toastType === "error" && (
                  <AlertCircle className="w-5 h-5 text-red-600" />
                )}
                {toastType === "info" && (
                  <Info className="w-5 h-5 text-blue-600" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{toastMessage}</p>
              </div>
              <button
                onClick={() => setToastMessage(null)}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 전체 화면 로딩 모달 */}
      {showLoadingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* 블러 백그라운드 */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

          {/* 모달 컨텐츠 */}
          <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-4 md:p-8 max-w-md w-full mx-4">
            <div className="text-center">
              {/* 로딩 스피너 */}
              <div className="flex justify-center mb-4 md:mb-6">
                <div className="relative">
                  <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-blue-600 animate-pulse" />
                  </div>
                </div>
              </div>

              {/* 로딩 메시지 */}
              <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2">
                처리 중입니다
              </h3>
              <p className="text-gray-600 mb-4 md:mb-6">{loadingMessage}</p>

              {/* 프로그레스 바 (여권의 경우) */}
              {ocrProcessing && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>진행률</span>
                    <span>{ocrProgress}%</span>
                  </div>
                  <Progress value={ocrProgress} className="h-2 bg-gray-200" />
                  <p className="text-sm text-gray-500 mt-2">{ocrStatus}</p>
                </div>
              )}

              {/* 안내 메시지 */}
              <div className="mt-4 md:mt-6 p-3 md:p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-center gap-2 text-sm text-blue-700">
                  <Info className="w-4 h-4" />
                  <span>
                    잠시만 기다려주세요. 처리가 완료되면 자동으로 닫힙니다.
                  </span>
                </div>
              </div>
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