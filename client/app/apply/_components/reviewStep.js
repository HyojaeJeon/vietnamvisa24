"use client";

import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../src/components/ui/card";
import { Button } from "../../src/components/ui/button";
import { Badge } from "../../src/components/ui/badge";
import { Checkbox } from "../../src/components/ui/checkbox";
import {
  Eye,
  Edit,
  ArrowLeft,
  CheckCircle,
  User,
  Mail,
  Phone,
  Home,
  Calendar,
  MapPin,
  FileText,
  CreditCard,
  AlertCircle,
  Globe,
  Plane,
  Clock,
  Shield,
} from "lucide-react";
import { formatCurrency, calculateTotalPrice } from "./utils";
import { VISA_TYPES, PROCESSING_TYPES } from "./types";

const ReviewStep = ({
  formData,
  onNext,
  onPrevious,
  onEdit,
  isSubmitting,
  updateFormData,
}) => {
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(null);
  const [isEditingPassport, setIsEditingPassport] = useState(false);
  const [editedPassportInfo, setEditedPassportInfo] = useState(null);

  const currentPrice = calculateTotalPrice(formData);

  // 여권 정보 수정 시작
  const startEditingPassport = () => {
    setEditedPassportInfo({
      passportNo: formData.personalInfo?.passportNo || "",
      surname: formData.personalInfo?.lastName || "",
      givenNames: formData.personalInfo?.firstName || "",
      koreanName: formData.personalInfo?.koreanName || "",
      authority: formData.personalInfo?.authority || "",
      nationality: formData.personalInfo?.nationality || "",
      issuingCountry: formData.personalInfo?.issuingCountry || "",
      sex: formData.personalInfo?.gender || "",
      dateOfBirth: formData.personalInfo?.birthDate || "",
      dateOfIssue: formData.personalInfo?.passportIssueDate || "",
      dateOfExpiry: formData.personalInfo?.passportExpiryDate || "",
      type: formData.personalInfo?.passportType || "",
      personalNo: formData.personalInfo?.personalNo || "",
    });
    setIsEditingPassport(true);
  };

  // 여권 정보 수정 저장
  const savePassportInfo = () => {
    updateFormData({
      personalInfo: {
        ...formData.personalInfo,
        passportNo: editedPassportInfo.passportNo,
        lastName: editedPassportInfo.surname,
        firstName: editedPassportInfo.givenNames,
        koreanName: editedPassportInfo.koreanName,
        nationality: editedPassportInfo.nationality,
        issuingCountry: editedPassportInfo.issuingCountry,
        gender: editedPassportInfo.sex,
        birthDate: editedPassportInfo.dateOfBirth,
        passportIssueDate: editedPassportInfo.dateOfIssue,
        passportExpiryDate: editedPassportInfo.dateOfExpiry,
        passportType: editedPassportInfo.type,
        authority: editedPassportInfo.authority,
        personalNo: editedPassportInfo.personalNo,
      },
    });
    setIsEditingPassport(false);
    setEditedPassportInfo(null);
  };

  // 여권 정보 수정 취소
  const cancelEditingPassport = () => {
    setIsEditingPassport(false);
    setEditedPassportInfo(null);
  };

  // 서류 프리뷰 모달
  const handleImagePreview = (imageData, title) => {
    setShowImagePreview({ imageData, title });
  };

  const closeImagePreview = () => {
    setShowImagePreview(null);
  };

  // 비자 타입 정보
  const getVisaTypeInfo = () => {
    const visaTypes = {
      [VISA_TYPES.E_VISA_GENERAL]: {
        id: VISA_TYPES.E_VISA_GENERAL,
        name: "E-VISA (전자비자) / 일반 (3-4일 소요)",
      },
      [VISA_TYPES.E_VISA_URGENT]: {
        id: VISA_TYPES.E_VISA_URGENT,
        name: "E-VISA (전자비자) / 긴급 (선택 옵션에 따라 1시간 ~ 2일 소요)",
      },
      [VISA_TYPES.E_VISA_TRANSIT]: {
        id: VISA_TYPES.E_VISA_TRANSIT,
        name: "E-VISA (전자비자) / 목바이 경유 (당일 발급)",
      },
    };
    return (
      visaTypes[formData.visaType] || {
        id: formData.visaType,
        name: formData.visaType,
      }
    );
  };

  // 처리 속도 정보
  const getProcessingTypeInfo = () => {
    const processingTypes = {
      [PROCESSING_TYPES.NORMAL]: {
        id: PROCESSING_TYPES.NORMAL,
        name: "일반 처리 (4-5일)",
      },
      [PROCESSING_TYPES.URGENT_1HOUR]: {
        id: PROCESSING_TYPES.URGENT_1HOUR,
        name: "1시간",
      },
      [PROCESSING_TYPES.URGENT_2HOUR]: {
        id: PROCESSING_TYPES.URGENT_2HOUR,
        name: "2시간",
      },
      [PROCESSING_TYPES.URGENT_4HOUR]: {
        id: PROCESSING_TYPES.URGENT_4HOUR,
        name: "4시간",
      },
      [PROCESSING_TYPES.URGENT_1DAY]: {
        id: PROCESSING_TYPES.URGENT_1DAY,
        name: "1일",
      },
      [PROCESSING_TYPES.URGENT_2DAY]: {
        id: PROCESSING_TYPES.URGENT_2DAY,
        name: "2일",
      },
    };
    return (
      processingTypes[formData.processingType] || {
        id: formData.processingType,
        name: formData.processingType,
      }
    );
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const getEntryPortLabel = (code) => {
    const ports = {
      SGN: "호치민 (탄손녓 국제공항)",
      HAN: "하노이 (노이바이 국제공항)",
      DAD: "다낭 (다낭 국제공항)",
      CXR: "나트랑 (캄란 국제공항)",
      PQC: "푸꾸옥 (푸꾸옥 국제공항)",
      VDO: "반돈 (반돈 국제공항)",
      HPH: "하이퐁 (캣비 국제공항)",
      LAND_BORDER: "육로 국경",
      OTHER: "기타",
    };
    return ports[code] || code;
  };

  // 업로드된 서류 목록
  const uploadedDocuments = formData.documents || {};
  const documentLabels = {
    passport: "여권 사본",
    photo: "증명사진",
    flight_ticket: "항공권 예약 확인서",
    bank_statement: "은행 잔고 증명서",
    invitation_letter: "초청장",
    business_registration: "사업자등록증",
  };

  return (
    <div className="space-y-4 md:space-y-8">
      {/* 헤더 카드 */}
      <Card className="overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-white via-slate-50 to-purple-50/30">
        <CardHeader className="relative pb-4 md:pb-8 text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 text-center">
            <div className="flex items-center justify-center w-12 h-12 md:w-20 md:h-20 mx-auto mb-2 md:mb-4 bg-white/20 backdrop-blur-sm rounded-2xl md:rounded-3xl">
              <CheckCircle className="w-6 h-6 md:w-10 md:h-10 text-white" />
            </div>
            <CardTitle className="mb-2 md:mb-3 text-2xl md:text-4xl font-bold">
              신청 내용 확인
            </CardTitle>
            <p className="text-sm md:text-xl text-purple-100">
              제출하기 전에 모든 정보를 다시 한번 확인해주세요
            </p>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
        {/* 메인 컨텐츠 */}
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          {/* 개인 정보 섹션 */}
          <Card className="border-2 border-blue-100 hover:border-blue-200 transition-colors">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 pb-3 md:pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 md:gap-3">
                  <User className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                  <CardTitle className="text-lg md:text-xl text-blue-700">
                    개인 정보
                  </CardTitle>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(2)}
                  className="h-7 md:h-8 px-2 md:px-3 text-xs md:text-sm"
                >
                  <Edit className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                  수정
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-3 md:pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 text-sm">
                <div className="flex items-center gap-2 md:gap-3 p-2 md:p-3 bg-gray-50 rounded-lg">
                  <User className="w-4 h-4 md:w-5 md:h-5 text-gray-500 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-gray-500">신청자명</p>
                    <p className="font-semibold text-gray-900 truncate">
                      {formData.personalInfo?.firstName}{" "}
                      {formData.personalInfo?.lastName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 md:gap-3 p-2 md:p-3 bg-gray-50 rounded-lg">
                  <Mail className="w-4 h-4 md:w-5 md:h-5 text-gray-500 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-gray-500">이메일</p>
                    <p className="font-semibold text-gray-900 truncate">
                      {formData.personalInfo?.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 md:gap-3 p-2 md:p-3 bg-gray-50 rounded-lg">
                  <Phone className="w-4 h-4 md:w-5 md:h-5 text-gray-500 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-gray-500">연락처</p>
                    <p className="font-semibold text-gray-900">
                      {formData.personalInfo?.phone}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 md:gap-3 p-2 md:p-3 bg-gray-50 rounded-lg">
                  <Home className="w-4 h-4 md:w-5 md:h-5 text-gray-500 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-gray-500">주소</p>
                    <p className="font-semibold text-gray-900 text-xs leading-tight">
                      {formData.personalInfo?.address}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* 여권 정보 */}
          <Card className="border-2 border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 pb-3 md:pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 md:gap-3">
                  <User className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                  <CardTitle className="text-lg md:text-xl text-blue-700">
                    여권 정보
                  </CardTitle>
                </div>
                {!isEditingPassport && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={startEditingPassport}
                    className="h-7 md:h-8 px-2 md:px-3 text-xs md:text-sm"
                  >
                    <Edit className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                    수정
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-3 md:pt-4">
              {isEditingPassport ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        여권번호
                      </label>
                      <input
                        type="text"
                        value={editedPassportInfo.passportNo}
                        onChange={(e) =>
                          setEditedPassportInfo({
                            ...editedPassportInfo,
                            passportNo: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        성 (Surname)
                      </label>
                      <input
                        type="text"
                        value={editedPassportInfo.surname}
                        onChange={(e) =>
                          setEditedPassportInfo({
                            ...editedPassportInfo,
                            surname: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        이름 (Given Names)
                      </label>
                      <input
                        type="text"
                        value={editedPassportInfo.givenNames}
                        onChange={(e) =>
                          setEditedPassportInfo({
                            ...editedPassportInfo,
                            givenNames: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        한글 이름
                      </label>
                      <input
                        type="text"
                        value={editedPassportInfo.koreanName}
                        onChange={(e) =>
                          setEditedPassportInfo({
                            ...editedPassportInfo,
                            koreanName: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        국적
                      </label>
                      <input
                        type="text"
                        value={editedPassportInfo.nationality}
                        onChange={(e) =>
                          setEditedPassportInfo({
                            ...editedPassportInfo,
                            nationality: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        발급 국가
                      </label>
                      <input
                        type="text"
                        value={editedPassportInfo.issuingCountry}
                        onChange={(e) =>
                          setEditedPassportInfo({
                            ...editedPassportInfo,
                            issuingCountry: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        성별
                      </label>
                      <select
                        value={editedPassportInfo.sex}
                        onChange={(e) =>
                          setEditedPassportInfo({
                            ...editedPassportInfo,
                            sex: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="">선택하세요</option>
                        <option value="M">남성 (M)</option>
                        <option value="F">여성 (F)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        생년월일
                      </label>
                      <input
                        type="date"
                        value={editedPassportInfo.dateOfBirth}
                        onChange={(e) =>
                          setEditedPassportInfo({
                            ...editedPassportInfo,
                            dateOfBirth: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        발급일
                      </label>
                      <input
                        type="date"
                        value={editedPassportInfo.dateOfIssue}
                        onChange={(e) =>
                          setEditedPassportInfo({
                            ...editedPassportInfo,
                            dateOfIssue: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        만료일
                      </label>
                      <input
                        type="date"
                        value={editedPassportInfo.dateOfExpiry}
                        onChange={(e) =>
                          setEditedPassportInfo({
                            ...editedPassportInfo,
                            dateOfExpiry: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        여권 유형
                      </label>
                      <input
                        type="text"
                        value={editedPassportInfo.type}
                        onChange={(e) =>
                          setEditedPassportInfo({
                            ...editedPassportInfo,
                            type: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        발급 기관
                      </label>
                      <input
                        type="text"
                        value={editedPassportInfo.authority}
                        onChange={(e) =>
                          setEditedPassportInfo({
                            ...editedPassportInfo,
                            authority: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4 border-t">
                    <Button
                      onClick={savePassportInfo}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      저장
                    </Button>
                    <Button onClick={cancelEditingPassport} variant="outline">
                      취소
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 text-sm">
                  <div className="flex items-center gap-2 md:gap-3 p-2 md:p-3 bg-gray-50 rounded-lg">
                    <User className="w-4 h-4 md:w-5 md:h-5 text-gray-500 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-500">여권번호</p>
                      <p className="font-semibold text-gray-900 truncate">
                        {formData.personalInfo?.passportNo}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 md:gap-3 p-2 md:p-3 bg-gray-50 rounded-lg">
                    <Mail className="w-4 h-4 md:w-5 md:h-5 text-gray-500 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-500">성 (Surname)</p>
                      <p className="font-semibold text-gray-900 truncate">
                        {formData.personalInfo?.surname}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 md:gap-3 p-2 md:p-3 bg-gray-50 rounded-lg">
                    <Phone className="w-4 h-4 md:w-5 md:h-5 text-gray-500 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-500">
                        이름 (Given Names)
                      </p>
                      <p className="font-semibold text-gray-900">
                        {formData.personalInfo?.givenNames}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 md:gap-3 p-2 md:p-3 bg-gray-50 rounded-lg">
                    <Home className="w-4 h-4 md:w-5 md:h-5 text-gray-500 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-500">한글 이름</p>
                      <p className="font-semibold text-gray-900 text-xs leading-tight">
                        {formData.personalInfo?.koreanName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 md:gap-3 p-2 md:p-3 bg-gray-50 rounded-lg">
                    <Home className="w-4 h-4 md:w-5 md:h-5 text-gray-500 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-500">국적</p>
                      <p className="font-semibold text-gray-900 text-xs leading-tight">
                        {formData.personalInfo?.nationality}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 md:gap-3 p-2 md:p-3 bg-gray-50 rounded-lg">
                    <Home className="w-4 h-4 md:w-5 md:h-5 text-gray-500 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-500">발급 국가</p>
                      <p className="font-semibold text-gray-900 text-xs leading-tight">
                        {formData.personalInfo?.issuingCountry}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 md:gap-3 p-2 md:p-3 bg-gray-50 rounded-lg">
                    <Home className="w-4 h-4 md:w-5 md:h-5 text-gray-500 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-500">성별</p>
                      <p className="font-semibold text-gray-900 text-xs leading-tight">
                        {formData.personalInfo?.gender}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 md:gap-3 p-2 md:p-3 bg-gray-50 rounded-lg">
                    <Home className="w-4 h-4 md:w-5 md:h-5 text-gray-500 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-500">생년월일</p>
                      <p className="font-semibold text-gray-900 text-xs leading-tight">
                        {formData.personalInfo?.birthDate}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 md:gap-3 p-2 md:p-3 bg-gray-50 rounded-lg">
                    <Home className="w-4 h-4 md:w-5 md:h-5 text-gray-500 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-500">발급일</p>
                      <p className="font-semibold text-gray-900 text-xs leading-tight">
                        {formData.personalInfo?.passportIssueDate}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 md:gap-3 p-2 md:p-3 bg-gray-50 rounded-lg">
                    <Home className="w-4 h-4 md:w-5 md:h-5 text-gray-500 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-500">만료일</p>
                      <p className="font-semibold text-gray-900 text-xs leading-tight">
                        {formData.personalInfo?.passportExpiryDate}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 md:gap-3 p-2 md:p-3 bg-gray-50 rounded-lg">
                    <Home className="w-4 h-4 md:w-5 md:h-5 text-gray-500 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-500">여권 유형</p>
                      <p className="font-semibold text-gray-900 text-xs leading-tight">
                        {formData.personalInfo?.passportType}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 md:gap-3 p-2 md:p-3 bg-gray-50 rounded-lg">
                    <Home className="w-4 h-4 md:w-5 md:h-5 text-gray-500 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-500">발급 기관</p>
                      <p className="font-semibold text-gray-900 text-xs leading-tight">
                        {formData.personalInfo?.authority}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 여행 정보 섹션 */}
          <Card className="border-2 border-green-100 hover:border-green-200 transition-colors">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 pb-3 md:pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 md:gap-3">
                  <Plane className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
                  <CardTitle className="text-lg md:text-xl text-green-700">
                    여행 정보
                  </CardTitle>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(3)}
                  className="h-7 md:h-8 px-2 md:px-3 text-xs md:text-sm"
                >
                  <Edit className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                  수정
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-3 md:pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 text-sm">
                <div className="flex items-center gap-2 md:gap-3 p-2 md:p-3 bg-gray-50 rounded-lg">
                  <Calendar className="w-4 h-4 md:w-5 md:h-5 text-gray-500 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">입국 예정일</p>
                    <p className="font-semibold text-gray-900">
                      {formatDate(formData.travelInfo?.entryDate)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 md:gap-3 p-2 md:p-3 bg-gray-50 rounded-lg">
                  <MapPin className="w-4 h-4 md:w-5 md:h-5 text-gray-500 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">입국 공항</p>
                    <p className="font-semibold text-gray-900">
                      {getEntryPortLabel(formData.travelInfo?.entryPort)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 비자 정보 섹션 */}
          <Card className="border-2 border-purple-100 hover:border-purple-200 transition-colors">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 pb-3 md:pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 md:gap-3">
                  <Globe className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
                  <CardTitle className="text-lg md:text-xl text-purple-700">
                    비자 정보
                  </CardTitle>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(1)}
                  className="h-7 md:h-8 px-2 md:px-3 text-xs md:text-sm"
                >
                  <Edit className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                  수정
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-3 md:pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 text-sm">
                <div className="p-2 md:p3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">비자 유형</p>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                      {getVisaTypeInfo().name}
                    </Badge>
                  </div>
                </div>
                <div className="p-2 md:p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">처리 속도</p>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                      {getProcessingTypeInfo().name}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 업로드된 서류 섹션 */}
          <Card className="border-2 border-orange-100 hover:border-orange-200 transition-colors">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 pb-3 md:pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 md:gap-3">
                  <FileText className="w-5 h-5 md:w-6 md:h-6 text-orange-600" />
                  <CardTitle className="text-lg md:text-xl text-orange-700">
                    업로드된 서류
                  </CardTitle>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(4)}
                  className="h-7 md:h-8 px-2 md:px-3 text-xs md:text-sm"
                >
                  <Edit className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                  수정
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-3 md:pt-4">
              <div className="space-y-2 md:space-y-3">
                {formData.documents &&
                  Object.entries(formData.documents).map(
                    ([docType, docData]) => (
                      <div
                        key={docType}
                        className="flex items-center justify-between p-2 md:p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
                          <FileText className="w-4 h-4 md:w-5 md:h-5 text-gray-500 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-gray-900 text-xs md:text-sm">
                              {docType === "passport"
                                ? "여권 정보면"
                                : "증명사진"}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {docData.fileName} (
                              {(docData.fileSize / 1024 / 1024).toFixed(2)}MB)
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleImagePreview(
                              docData.file,
                              docType === "passport"
                                ? "여권 정보면"
                                : "증명사진",
                            )
                          }
                          className="h-7 md:h-8 px-2 md:px-3 flex-shrink-0"
                        >
                          <Eye className="w-3 h-3 md:w-4 md:h-4" />
                        </Button>
                      </div>
                    ),
                  )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 사이드바 - 결제 정보 및 약관 동의 */}
        <div className="space-y-4 md:space-y-6">
          {/* 결제 정보 카드 */}
          <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
            <CardHeader className="pb-3 md:pb-4">
              <div className="flex items-center gap-2 md:gap-3">
                <CreditCard className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
                <CardTitle className="text-lg md:text-xl text-green-700">
                  결제 정보
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 md:space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">기본 서비스</span>
                  <span className="font-semibold">{formatCurrency(25000)}</span>
                </div>
                {formData.processingType === "fast" && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">긴급 처리</span>
                    <span className="font-semibold text-orange-600">
                      +{formatCurrency(10000)}
                    </span>
                  </div>
                )}
              </div>
              <div className="border-t pt-2 md:pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-base md:text-lg font-bold text-gray-900">
                    총 결제금액
                  </span>
                  <span className="text-xl md:text-2xl font-bold text-green-600">
                    {formatCurrency(currentPrice)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 약관 동의 카드 */}
          <Card className="border-2 border-gray-200">
            <CardHeader className="pb-3 md:pb-4">
              <div className="flex items-center gap-2 md:gap-3">
                <Shield className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
                <CardTitle className="text-lg md:text-xl text-gray-700">
                  약관 동의
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 md:space-y-4">
              <div className="space-y-3 md:space-y-4">
                <div className="flex items-start gap-2 md:gap-3">
                  <Checkbox
                    id="terms"
                    checked={agreedToTerms}
                    onCheckedChange={setAgreedToTerms}
                    className="mt-1"
                  />
                  <label
                    htmlFor="terms"
                    className="text-xs md:text-sm text-gray-700 leading-relaxed cursor-pointer"
                  >
                    <span className="font-semibold">서비스 이용약관</span> 및{" "}
                    <span className="font-semibold">개인정보처리방침</span>에
                    동의합니다.
                    <br />
                    <span className="text-xs text-gray-500 mt-1 block">
                      비자 신청을 위해 필요한 개인정보 수집 및 이용에
                      동의합니다.
                    </span>
                  </label>
                </div>
              </div>

              {!agreedToTerms && (
                <div className="flex items-start gap-2 p-2 md:p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs md:text-sm text-yellow-800">
                    신청을 진행하려면 약관에 동의해주세요.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 제출 버튼 */}
          <div className="space-y-3 md:space-y-4">
            <Button
              onClick={onNext}
              disabled={!agreedToTerms || isSubmitting}
              className="w-full py-3 md:py-4 text-sm md:text-lg font-bold text-white transition-all duration-300 transform shadow-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 hover:from-purple-700 hover:via-pink-700 hover:to-red-700 rounded-xl md:rounded-2xl hover:shadow-3xl disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>제출 중...</span>
                </div>
              ) : (
                <span>비자 신청 제출하기</span>
              )}
            </Button>

            <Button
              onClick={onPrevious}
              variant="outline"
              className="w-full py-2 md:py-3 text-sm md:text-base font-semibold text-gray-700 transition-all duration-300 border-2 border-gray-300 hover:border-gray-400 rounded-xl"
            >
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 mr-2" />
              이전 단계로
            </Button>
          </div>
        </div>
      </div>

      {/* 이미지 프리뷰 모달 */}
      {showImagePreview && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full bg-white rounded-lg overflow-hidden">
            <div className="flex items-center justify-between p-3 md:p-4 border-b">
              <h3 className="text-base md:text-lg font-semibold">
                {showImagePreview.title}
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={closeImagePreview}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="p-2 md:p-4">
              <img
                src={showImagePreview.imageData}
                alt={showImagePreview.title}
                className="max-w-full max-h-[70vh] object-contain mx-auto"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

ReviewStep.propTypes = {
  formData: PropTypes.object.isRequired,
  onNext: PropTypes.func.isRequired,
  onPrevious: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool,
  updateFormData: PropTypes.func.isRequired,
};

export default ReviewStep;
