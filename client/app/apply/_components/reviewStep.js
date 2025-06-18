"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../src/components/ui/card";
import { Button } from "../../src/components/ui/button";
import { Badge } from "../../src/components/ui/badge";
import { CheckCircle, FileText, User, Mail, Globe, Calendar, ArrowRight, ArrowLeft, Phone, MapPin, Plane, Hotel, Send, Edit, Loader2 } from "lucide-react";
import { formatCurrency, calculateTotalPrice, formatDate } from "./utils";
import { VISA_TYPES, PROCESSING_TYPES, ADDITIONAL_SERVICES } from "./types";

const ReviewStep = ({ formData, onNext, onPrevious, onEdit, isSubmitting }) => {
  const currentPrice = calculateTotalPrice(formData);

  const getVisaTypeLabel = (type) => {
    const labels = {
      [VISA_TYPES.E_VISA_GENERAL]: "E-VISA (전자비자) / 일반 (3-4일 소요)",
      [VISA_TYPES.E_VISA_URGENT]: "E-VISA (전자비자) / 긴급 (선택 옵션에 따라 1시간 ~ 2일 소요)",
      [VISA_TYPES.E_VISA_TRANSIT]: "E-VISA (전자비자) / 목바이 경유 (당일 발급)",
    };
    return labels[type] || type;
  };

  const getProcessingTypeLabel = (type) => {
    const labels = {
      [PROCESSING_TYPES.NORMAL]: "일반 처리 (4-5일)",
      [PROCESSING_TYPES.URGENT_1HOUR]: "1시간",
      [PROCESSING_TYPES.URGENT_2HOUR]: "2시간",
      [PROCESSING_TYPES.URGENT_4HOUR]: "4시간",
      [PROCESSING_TYPES.URGENT_1DAY]: "1일",
      [PROCESSING_TYPES.URGENT_2DAY]: "2일",
    };
    return labels[type] || type;
  };

  const getPurposeLabel = (purpose) => {
    const labels = {
      TOURISM: "관광",
      BUSINESS: "비즈니스",
      VISIT_RELATIVES: "친척 방문",
      CONFERENCE: "회의/컨퍼런스",
      MEDICAL: "의료",
      EDUCATION: "교육",
      TRANSIT: "경유",
      OTHER: "기타",
    };
    return labels[purpose] || purpose;
  };

  const getNationalityLabel = (code) => {
    const countries = {
      KR: "대한민국",
      US: "미국",
      JP: "일본",
      CN: "중국",
      GB: "영국",
      DE: "독일",
      FR: "프랑스",
      CA: "캐나다",
      AU: "호주",
      SG: "싱가포르",
      TH: "태국",
      MY: "말레이시아",
      ID: "인도네시아",
      PH: "필리핀",
      VN: "베트남",
      OTHER: "기타",
    };
    return countries[code] || code;
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

  const getAdditionalServiceLabel = (service) => {
    const labels = {
      [ADDITIONAL_SERVICES.FAST_TRACK]: "패스트트랙",
      [ADDITIONAL_SERVICES.AIRPORT_PICKUP]: "공항픽업",
      [ADDITIONAL_SERVICES.HOTEL_DELIVERY]: "호텔배송",
    };
    return labels[service] || service;
  };

  const accommodationTypeLabels = {
    HOTEL: "호텔",
    RESORT: "리조트",
    HOMESTAY: "홈스테이",
    AIRBNB: "에어비앤비",
    RELATIVES_HOUSE: "친척/지인 집",
    COMPANY_ACCOMMODATION: "회사 숙소",
    OTHER: "기타",
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
    <Card className="overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-white via-slate-50 to-blue-50/30">
      <CardHeader className="relative pb-8 text-white bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 flex items-center gap-4">
          <div className="flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <div>
            <CardTitle className="mb-2 text-3xl font-bold">신청 정보 확인</CardTitle>
            <p className="text-lg text-green-100">입력하신 정보를 최종 확인해주세요</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-8 space-y-8">
        {/* 서비스 선택 정보 */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg">
                <Globe className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">선택한 서비스</h3>
            </div>
            <Button variant="outline" size="sm" onClick={() => onEdit(1)} className="text-blue-600 hover:text-blue-700">
              <Edit className="w-4 h-4 mr-2" />
              수정
            </Button>
          </div>

          <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <p className="mb-1 text-sm font-medium text-gray-600">비자 유형</p>
                  <p className="text-lg font-bold text-gray-800">{getVisaTypeLabel(formData.visaType)}</p>
                </div>
                <div>
                  <p className="mb-1 text-sm font-medium text-gray-600">처리 속도</p>
                  <p className="text-lg font-bold text-gray-800">{getProcessingTypeLabel(formData.processingType)}</p>
                </div>
                {formData.additionalServices && formData.additionalServices.length > 0 && (
                  <div className="md:col-span-2">
                    <p className="mb-2 text-sm font-medium text-gray-600">추가 서비스</p>
                    <div className="flex flex-wrap gap-2">
                      {formData.additionalServices.map((service) => (
                        <Badge key={service} variant="secondary">
                          {getAdditionalServiceLabel(service)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 개인 정보 */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100">
                <User className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">개인 정보</h3>
            </div>
            <Button variant="outline" size="sm" onClick={() => onEdit(2)} className="text-emerald-600 hover:text-emerald-700">
              <Edit className="w-4 h-4 mr-2" />
              수정
            </Button>
          </div>

          <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <p className="mb-1 text-sm font-medium text-gray-600">영문 성명</p>
                  <p className="text-lg font-bold text-gray-800">
                    {formData.personalInfo?.lastName} {formData.personalInfo?.firstName}
                  </p>
                </div>
                <div>
                  <p className="mb-1 text-sm font-medium text-gray-600">생년월일</p>
                  <p className="text-lg font-bold text-gray-800">{formData.personalInfo?.birthDate ? formatDate(formData.personalInfo.birthDate) : "-"}</p>
                </div>
                <div>
                  <p className="mb-1 text-sm font-medium text-gray-600">성별</p>
                  <p className="text-lg font-bold text-gray-800">{formData.personalInfo?.gender === "M" ? "남성" : formData.personalInfo?.gender === "F" ? "여성" : "-"}</p>
                </div>
                <div>
                  <p className="mb-1 text-sm font-medium text-gray-600">국적</p>
                  <p className="text-lg font-bold text-gray-800">{getNationalityLabel(formData.personalInfo?.nationality)}</p>
                </div>
                <div>
                  <p className="mb-1 text-sm font-medium text-gray-600">이메일</p>
                  <p className="text-lg font-bold text-gray-800">{formData.personalInfo?.email || "-"}</p>
                </div>
                <div>
                  <p className="mb-1 text-sm font-medium text-gray-600">휴대폰</p>
                  <p className="text-lg font-bold text-gray-800">{formData.personalInfo?.phone || "-"}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="mb-1 text-sm font-medium text-gray-600">주소</p>
                  <p className="text-lg font-bold text-gray-800">{formData.personalInfo?.address || "-"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 여행 정보 */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-lg">
                <Plane className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">여행 정보</h3>
            </div>
            <Button variant="outline" size="sm" onClick={() => onEdit(3)} className="text-purple-600 hover:text-purple-700">
              <Edit className="w-4 h-4 mr-2" />
              수정
            </Button>
          </div>

          <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <p className="mb-1 text-sm font-medium text-gray-600">입국 예정일</p>
                  <p className="text-lg font-bold text-gray-800">{formData.travelInfo?.entryDate ? formatDate(formData.travelInfo.entryDate) : "-"}</p>
                </div>
                {/* <div>
                  <p className="mb-1 text-sm font-medium text-gray-600">출국 예정일</p>
                  <p className="text-lg font-bold text-gray-800">{formData.travelInfo?.exitDate ? formatDate(formData.travelInfo.exitDate) : "-"}</p>
                </div> */}
                {/* <div>
                  <p className="mb-1 text-sm font-medium text-gray-600">방문 목적</p>
                  <p className="text-lg font-bold text-gray-800">{getPurposeLabel(formData.travelInfo?.purpose)}</p>
                </div> */}
                <div>
                  <p className="mb-1 text-sm font-medium text-gray-600">입국 공항</p>
                  <p className="text-lg font-bold text-gray-800">{getEntryPortLabel(formData.travelInfo?.entryPort)}</p>
                </div>
                {/* <div>
                  <p className="mb-1 text-sm font-medium text-gray-600">숙박 유형</p>
                  <p className="text-lg font-bold text-gray-800">{accommodationTypeLabels[formData.travelInfo?.accommodationType] || "-"}</p>
                </div> */}
                {/* <div>
                  <p className="mb-1 text-sm font-medium text-gray-600">숙박 장소</p>
                  <p className="text-lg font-bold text-gray-800">{formData.travelInfo?.accommodationName || "-"}</p>
                </div> */}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 업로드된 서류 */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 bg-orange-100 rounded-lg">
                <FileText className="w-5 h-5 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">업로드된 서류</h3>
            </div>
            <Button variant="outline" size="sm" onClick={() => onEdit(4)} className="text-orange-600 hover:text-orange-700">
              <Edit className="w-4 h-4 mr-2" />
              수정
            </Button>
          </div>

          <Card className="border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {Object.entries(uploadedDocuments).map(([docType, document]) => (
                  <div key={docType} className="flex items-center gap-3 p-3 bg-white border rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">{documentLabels[docType] || docType}</p>
                      <p className="text-xs text-gray-500">{document.fileName}</p>
                    </div>
                  </div>
                ))}
              </div>
              {Object.keys(uploadedDocuments).length === 0 && <p className="py-4 text-center text-gray-500">업로드된 서류가 없습니다.</p>}
            </CardContent>
          </Card>
        </div>

        {/* 결제 금액 요약 */}
        <div className="relative p-8 overflow-hidden text-white bg-gradient-to-r from-slate-800 via-gray-900 to-slate-800 rounded-3xl">
          <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-teal-600/20"></div>
          <div className="relative z-10">
            <h3 className="mb-6 text-2xl font-bold text-center">결제 금액 요약</h3>
            <div className="mb-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-lg">기본 비자 요금</span>
                <span className="text-lg font-medium">{formatCurrency(30)}</span>
              </div>
              {formData.processingType !== PROCESSING_TYPES.NORMAL && (
                <div className="flex items-center justify-between">
                  <span className="text-lg">급행 처리 요금</span>
                  <span className="text-lg font-medium">{formatCurrency(20)}</span>
                </div>
              )}
              {formData.additionalServices && formData.additionalServices.length > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-lg">추가 서비스</span>
                  <span className="text-lg font-medium">{formatCurrency(25)}</span>
                </div>
              )}
            </div>
            <div className="pt-4 border-t border-white/20">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">총 결제 금액</span>
                <span className="text-3xl font-bold text-green-400">{formatCurrency(currentPrice)}</span>
              </div>
              <p className="mt-2 text-center text-gray-300">부가세 포함</p>
            </div>
          </div>
        </div>

        {/* 네비게이션 버튼 */}
        <div className="flex justify-between pt-8 border-t border-gray-200">
          <Button onClick={onPrevious} variant="outline" className="px-8 py-4 text-lg font-bold text-gray-700 transition-all duration-300 border-2 border-gray-300 hover:border-gray-400 rounded-2xl">
            <ArrowLeft className="w-6 h-6 mr-3" />
            <span>이전</span>
          </Button>{" "}
          <Button
            onClick={onNext}
            disabled={isSubmitting}
            className="px-12 py-4 text-lg font-bold text-white transition-all duration-300 transform shadow-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 rounded-2xl hover:shadow-3xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                <span>신청서 제출 중...</span>
              </>
            ) : (
              <>
                <span className="mr-3">신청서 제출</span>
                <Send className="w-6 h-6" />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewStep;
