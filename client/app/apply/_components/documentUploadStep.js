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
  const [extractedPassportInfo, setExtractedPassportInfo] = useState(null);
  const [editingPassportInfo, setEditingPassportInfo] = useState(null);

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
  // );  // 여권 정보를 formData.personalInfo로 매핑하는 함수 (개선된 버전)
  const mapPassportDataToPersonalInfo = (ocrResult) => {
    if (!ocrResult) return {};

    console.log("OCR 결과 매핑 시작:", ocrResult);

    // 생년월일 형식 변환 (YYMMDD -> YYYY-MM-DD)
    const formatBirthDate = (dateStr) => {
      if (!dateStr) return "";

      // 6자리 숫자인 경우 (YYMMDD)
      if (dateStr.length === 6 && /^\d{6}$/.test(dateStr)) {
        const yy = dateStr.substring(0, 2);
        const mm = dateStr.substring(2, 4);
        const dd = dateStr.substring(4, 6);

        // 2000년대/1900년대 판단 (90-99는 1900년대, 00-89는 2000년대)
        const year = parseInt(yy) >= 90 ? `19${yy}` : `20${yy}`;
        return `${year}-${mm}-${dd}`;
      }

      // 이미 YYYY-MM-DD 형식인 경우
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        return dateStr;
      }

      return "";
    };

    // 성별 변환 (M/F를 남성/여성으로)
    const formatGender = (sex) => {
      if (!sex) return "";
      const sexUpper = sex.toUpperCase();
      if (sexUpper === "M" || sexUpper === "MALE") return "남성";
      if (sexUpper === "F" || sexUpper === "FEMALE") return "여성";
      return sex; // 원본 그대로 반환
    };

    // 국적 코드를 한국어로 변환
    const formatNationality = (nationality) => {
      if (!nationality) return "";
      const nationalityMap = {
        KOR: "대한민국",
        USA: "미국",
        CHN: "중국",
        JPN: "일본",
        GBR: "영국",
        FRA: "프랑스",
        DEU: "독일",
        AUS: "호주",
        CAN: "캐나다",
        VNM: "베트남",
      };
      return nationalityMap[nationality.toUpperCase()] || nationality;
    };

    const personalInfo = {};

    // 이름 매핑
    if (ocrResult["Surname"]) {
      personalInfo.lastName = ocrResult["Surname"].trim();
    }
    if (ocrResult["Given names"]) {
      personalInfo.firstName = ocrResult["Given names"].trim();
    }

    // 생년월일 매핑
    if (ocrResult["Date of birth"]) {
      const formattedDate = formatBirthDate(ocrResult["Date of birth"]);
      if (formattedDate) {
        personalInfo.birthDate = formattedDate;
      }
    }

    // 성별 매핑
    if (ocrResult["Sex"]) {
      personalInfo.gender = formatGender(ocrResult["Sex"]);
    }

    // 국적 매핑
    if (ocrResult["Nationality"]) {
      personalInfo.nationality = formatNationality(ocrResult["Nationality"]);
    } // 여권번호 매핑
    if (ocrResult["Passport No."]) {
      personalInfo.passportNumber = ocrResult["Passport No."].trim();
    }

    // 발급일 매핑 (추가)
    if (ocrResult["Issuing date"]) {
      // 발급일 형식 변환 (필요한 경우)
      personalInfo.passportIssueDate = ocrResult["Issuing date"].trim();
    }

    // 만료일 매핑 (추가)
    if (ocrResult["Date of expiry"]) {
      personalInfo.passportExpiryDate = ocrResult["Date of expiry"].trim();
    }

    // 한글성명이 있는 경우 이름 필드에 우선 적용
    if (ocrResult["한글성명"]) {
      const koreanName = ocrResult["한글성명"].trim();
      // 한글성명을 성과 이름으로 분리 (첫 글자는 성, 나머지는 이름)
      if (koreanName.length >= 2) {
        personalInfo.lastName = koreanName.charAt(0);
        personalInfo.firstName = koreanName.substring(1);
      }
    }

    console.log("매핑된 개인정보:", personalInfo);
    return personalInfo;
  };

  // 편집된 여권 정보를 저장하고 formData에 적용하는 함수
  const handleSavePassportInfo = useCallback(() => {
    if (!extractedPassportInfo || !extractedPassportInfo.mapped) {
      console.warn("저장할 여권 정보가 없습니다.");
      return;
    }

    // 편집된 정보가 있으면 편집된 정보를, 없으면 원본 추출 정보를 사용
    const finalPassportInfo = editingPassportInfo || extractedPassportInfo.mapped;

    // 기존 personalInfo와 병합 (빈 값이 아닌 경우에만 업데이트)
    const currentPersonalInfo = { ...(formData.personalInfo || {}) };

    Object.keys(finalPassportInfo).forEach((key) => {
      const value = finalPassportInfo[key];
      if (value && value.toString().trim() !== "") {
        currentPersonalInfo[key] = value;
      }
    });

    console.log("저장할 여권 정보:", finalPassportInfo);
    console.log("업데이트된 개인정보:", currentPersonalInfo);

    // formData 업데이트
    onUpdate({ personalInfo: currentPersonalInfo });

    // 성공 메시지 표시
    const updatedFields = [];
    if (finalPassportInfo.firstName) updatedFields.push("이름");
    if (finalPassportInfo.lastName) updatedFields.push("성");
    if (finalPassportInfo.birthDate) updatedFields.push("생년월일");
    if (finalPassportInfo.gender) updatedFields.push("성별");
    if (finalPassportInfo.nationality) updatedFields.push("국적");
    if (finalPassportInfo.passportNumber) updatedFields.push("여권번호");
    if (finalPassportInfo.passportIssueDate) updatedFields.push("여권발급일");
    if (finalPassportInfo.passportExpiryDate) updatedFields.push("여권만료일");

    if (updatedFields.length > 0) {
      alert(`다음 정보가 개인정보 입력 단계에 적용되었습니다:\n\n${updatedFields.join(", ")}\n\n개인정보 입력 단계에서 최종 확인해주세요.`);
    }

    // 편집 모드 종료
    setEditingPassportInfo(null);
  }, [extractedPassportInfo, editingPassportInfo, formData.personalInfo, onUpdate]);

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
        console.log("업로드할 파일:", file);
        const res = await fetch("http://localhost:5002/api/extract_passport", {
          method: "POST",
          body: form,
        });

        if (!res.ok) {
          throw new Error(`서버 오류: ${res.status}`);
        } // 4) 서버에서 리턴된 OCR/MRZ 결과
        const ocrResult = await res.json();
        console.log("여권 추출 결과:", ocrResult);

        // OCR 결과를 더 자세히 로깅
        console.log("OCR 결과 상세:", {
          "발급일(Issuing date)": ocrResult["Issuing date"],
          "만료일(Date of expiry)": ocrResult["Date of expiry"],
          여권번호: ocrResult["Passport No."],
          성: ocrResult["Surname"],
          이름: ocrResult["Given names"],
          생년월일: ocrResult["Date of birth"],
          성별: ocrResult["Sex"],
          국적: ocrResult["Nationality"],
        });

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
        }; // 7) 여권 정보인 경우 personalInfo에도 자동 매핑
        const updateData = { documents: docs };
        if (documentType === "passport" && ocrResult && !ocrResult.error) {
          const extractedPersonalInfo = mapPassportDataToPersonalInfo(ocrResult);

          // 추출된 여권 정보를 상태에 저장
          setExtractedPassportInfo({
            raw: ocrResult,
            mapped: extractedPersonalInfo,
          });

          // 유효한 정보가 추출된 경우에만 업데이트
          if (Object.keys(extractedPersonalInfo).length > 0) {
            // 기존 personalInfo 복사 및 새 데이터 병합 (빈 값이 아닌 경우에만)
            const currentPersonalInfo = { ...(formData.personalInfo || {}) };

            // 추출된 데이터 중 실제 값이 있는 것만 병합
            Object.keys(extractedPersonalInfo).forEach((key) => {
              const value = extractedPersonalInfo[key];
              if (value && value.trim && value.trim() !== "") {
                currentPersonalInfo[key] = value;
              } else if (value && typeof value !== "string") {
                currentPersonalInfo[key] = value;
              }
            });

            updateData.personalInfo = currentPersonalInfo;

            console.log("기존 개인정보:", formData.personalInfo);
            console.log("추출된 개인정보:", extractedPersonalInfo);
            console.log("병합된 개인정보:", currentPersonalInfo); // 추출된 정보 요약 생성
            const extractedFields = [];
            if (extractedPersonalInfo.firstName && extractedPersonalInfo.firstName.trim()) extractedFields.push("이름");
            if (extractedPersonalInfo.lastName && extractedPersonalInfo.lastName.trim()) extractedFields.push("성");
            if (extractedPersonalInfo.birthDate && extractedPersonalInfo.birthDate.trim()) extractedFields.push("생년월일");
            if (extractedPersonalInfo.gender && extractedPersonalInfo.gender.trim()) extractedFields.push("성별");
            if (extractedPersonalInfo.nationality && extractedPersonalInfo.nationality.trim()) extractedFields.push("국적");
            if (extractedPersonalInfo.passportNumber && extractedPersonalInfo.passportNumber.trim()) extractedFields.push("여권번호");
            if (extractedPersonalInfo.passportIssueDate && extractedPersonalInfo.passportIssueDate.trim()) extractedFields.push("여권발급일");
            if (extractedPersonalInfo.passportExpiryDate && extractedPersonalInfo.passportExpiryDate.trim()) extractedFields.push("여권만료일");

            // 사용자에게 자동 입력 알림
            if (extractedFields.length > 0) {
              alert(`여권에서 다음 정보가 자동으로 추출되어 입력되었습니다:\n\n${extractedFields.join(", ")}\n\n개인정보 입력 단계에서 내용을 확인하고 수정할 수 있습니다.`);
            }
          } else {
            console.warn("여권에서 유효한 개인정보를 추출하지 못했습니다.");
          }
        } else if (documentType === "passport" && ocrResult && ocrResult.error) {
          console.warn("여권 OCR 처리 중 오류:", ocrResult.error);
          alert("여권 정보를 자동으로 읽는 중 문제가 발생했습니다. 개인정보는 수동으로 입력해주세요.");
        }

        onUpdate(updateData);
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
    [formData.documents, formData.personalInfo, onUpdate]
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
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-800">{uploadedDocuments[doc.type].fileName}</p>
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="text-xs text-gray-500">{Math.round(uploadedDocuments[doc.type].fileSize / 1024)} KB</p>
                                {uploadedDocuments[doc.type].isTemporary && <span className="px-2 py-1 text-xs text-blue-700 bg-blue-100 rounded-full">임시저장됨</span>}
                                {/* 여권 OCR 결과가 있는 경우 추가 정보 표시 */}
                                {doc.type === "passport" && uploadedDocuments[doc.type].ocrResult && !uploadedDocuments[doc.type].ocrResult.error && (
                                  <span className="px-2 py-1 text-xs text-green-700 bg-green-100 rounded-full">정보 자동추출됨</span>
                                )}
                                {doc.type === "passport" && uploadedDocuments[doc.type].ocrResult && uploadedDocuments[doc.type].ocrResult.error && (
                                  <span className="px-2 py-1 text-xs text-orange-700 bg-orange-100 rounded-full">수동입력 필요</span>
                                )}
                              </div>
                              {/* OCR 추출 정보 미리보기 */}
                              {doc.type === "passport" && uploadedDocuments[doc.type].ocrResult && !uploadedDocuments[doc.type].ocrResult.error && (
                                <div className="mt-1 text-xs text-gray-600">
                                  {uploadedDocuments[doc.type].ocrResult["Given names"] && uploadedDocuments[doc.type].ocrResult["Surname"] && (
                                    <span>
                                      이름: {uploadedDocuments[doc.type].ocrResult["Surname"]} {uploadedDocuments[doc.type].ocrResult["Given names"]} |{" "}
                                    </span>
                                  )}
                                  {uploadedDocuments[doc.type].ocrResult["Passport No."] && <span>여권번호: {uploadedDocuments[doc.type].ocrResult["Passport No."]}</span>}
                                </div>
                              )}
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
          })}{" "}
        </div>
        {/* 여권 정보 편집 섹션 */}
        {extractedPassportInfo && (
          <Card className="border-2 border-blue-200 bg-blue-50/50">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg text-blue-800">
                <FileText className="w-5 h-5" />
                추출된 여권 정보 확인 및 수정
              </CardTitle>
              <p className="text-sm text-blue-600">자동으로 추출된 정보를 확인하고 필요시 수정해주세요. 수정된 내용은 개인정보 입력 단계에 반영됩니다.</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* 성 */}
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">성 (Surname)</label>
                  <input
                    type="text"
                    value={editingPassportInfo?.lastName || extractedPassportInfo.mapped?.lastName || ""}
                    onChange={(e) =>
                      setEditingPassportInfo((prev) => ({
                        ...prev,
                        lastName: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="성을 입력하세요"
                  />
                </div>

                {/* 이름 */}
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">이름 (Given Names)</label>
                  <input
                    type="text"
                    value={editingPassportInfo?.firstName || extractedPassportInfo.mapped?.firstName || ""}
                    onChange={(e) =>
                      setEditingPassportInfo((prev) => ({
                        ...prev,
                        firstName: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="이름을 입력하세요"
                  />
                </div>

                {/* 생년월일 */}
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">생년월일</label>
                  <input
                    type="date"
                    value={editingPassportInfo?.birthDate || extractedPassportInfo.mapped?.birthDate || ""}
                    onChange={(e) =>
                      setEditingPassportInfo((prev) => ({
                        ...prev,
                        birthDate: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* 성별 */}
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">성별</label>
                  <select
                    value={editingPassportInfo?.gender || extractedPassportInfo.mapped?.gender || ""}
                    onChange={(e) =>
                      setEditingPassportInfo((prev) => ({
                        ...prev,
                        gender: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">선택하세요</option>
                    <option value="남성">남성</option>
                    <option value="여성">여성</option>
                  </select>
                </div>

                {/* 국적 */}
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">국적</label>
                  <input
                    type="text"
                    value={editingPassportInfo?.nationality || extractedPassportInfo.mapped?.nationality || ""}
                    onChange={(e) =>
                      setEditingPassportInfo((prev) => ({
                        ...prev,
                        nationality: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="국적을 입력하세요"
                  />
                </div>

                {/* 여권번호 */}
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">여권번호</label>
                  <input
                    type="text"
                    value={editingPassportInfo?.passportNumber || extractedPassportInfo.mapped?.passportNumber || ""}
                    onChange={(e) =>
                      setEditingPassportInfo((prev) => ({
                        ...prev,
                        passportNumber: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="여권번호를 입력하세요"
                  />
                </div>

                {/* 여권 발급일 */}
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">여권 발급일</label>
                  <input
                    type="date"
                    value={editingPassportInfo?.passportIssueDate || extractedPassportInfo.mapped?.passportIssueDate || ""}
                    onChange={(e) =>
                      setEditingPassportInfo((prev) => ({
                        ...prev,
                        passportIssueDate: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* 여권 만료일 */}
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">여권 만료일</label>
                  <input
                    type="date"
                    value={editingPassportInfo?.passportExpiryDate || extractedPassportInfo.mapped?.passportExpiryDate || ""}
                    onChange={(e) =>
                      setEditingPassportInfo((prev) => ({
                        ...prev,
                        passportExpiryDate: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* 저장 버튼 */}
              <div className="flex justify-end gap-3 pt-4 border-t border-blue-200">
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingPassportInfo(null);
                    setExtractedPassportInfo(null);
                  }}
                  className="px-4 py-2"
                >
                  취소
                </Button>
                <Button onClick={handleSavePassportInfo} className="px-6 py-2 text-white bg-blue-600 hover:bg-blue-700">
                  정보 저장 및 적용
                </Button>
              </div>

              {/* 원본 OCR 데이터 미리보기 (개발자용) */}
              {process.env.NODE_ENV === "development" && (
                <details className="mt-4">
                  <summary className="text-xs text-gray-500 cursor-pointer">원본 OCR 데이터 보기 (개발용)</summary>
                  <pre className="p-2 mt-2 overflow-auto text-xs bg-gray-100 rounded">{JSON.stringify(extractedPassportInfo.raw, null, 2)}</pre>
                </details>
              )}
            </CardContent>
          </Card>
        )}
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
