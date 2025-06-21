"use client";

import React, { useState } from "react";
import PropTypes from "prop-types";
import { Card, CardContent, CardHeader, CardTitle } from "../../src/components/ui/card";
import { Button } from "../../src/components/ui/button";
import { Badge } from "../../src/components/ui/badge";
import { Checkbox } from "../../src/components/ui/checkbox";
import { Eye, Edit, ArrowLeft, CheckCircle, User, Mail, Phone, Home, Calendar, MapPin, FileText, CreditCard, AlertCircle, Globe, Plane, Clock, Shield, X, Users, Car } from "lucide-react";
import { calculateTotalPrice, getVisaServiceDetails } from "./utils";
import { VISA_TYPES, PROCESSING_TYPES } from "./types";

const ReviewStep = ({ formData, onNext, onPrevious, onEdit, isSubmitting, updateFormData }) => {
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(null);

  // 비자 타입에 따라 기본 통화 설정
  const defaultCurrency = formData.visaType === VISA_TYPES.E_VISA_TRANSIT ? "VND" : "KRW";
  const [selectedCurrency, setSelectedCurrency] = useState(defaultCurrency);

  const currentPrice = calculateTotalPrice(formData);
  const serviceDetails = getVisaServiceDetails(formData);
  // 통화별 환율 (2024년 기준 대략적인 환율)
  const exchangeRates = {
    KRW: 1, // 기준 통화
    VND: 18.5, // 1 KRW = 18.5 VND
    USD: 0.00074, // 1 KRW = 0.00074 USD
  };

  // 가격을 선택된 통화로 변환
  const convertPrice = (price) => {
    // 현재 가격의 원본 통화 확인 (Transit E-VISA는 VND, 나머지는 KRW)
    const sourceCurrency = currentPrice.currency || "KRW";

    if (sourceCurrency === selectedCurrency) {
      // 같은 통화면 변환 없이 반환
      return price;
    }

    if (sourceCurrency === "VND" && selectedCurrency === "KRW") {
      // VND에서 KRW로 변환
      return Math.round(price / exchangeRates.VND);
    } else if (sourceCurrency === "VND" && selectedCurrency === "USD") {
      // VND에서 USD로 변환 (VND -> KRW -> USD)
      const krwPrice = price / exchangeRates.VND;
      return Math.round(krwPrice * exchangeRates.USD * 100) / 100; // USD는 소수점 2자리
    } else if (sourceCurrency === "KRW" && selectedCurrency === "VND") {
      // KRW에서 VND로 변환
      return Math.round(price * exchangeRates.VND);
    } else if (sourceCurrency === "KRW" && selectedCurrency === "USD") {
      // KRW에서 USD로 변환
      return Math.round(price * exchangeRates.USD * 100) / 100; // USD는 소수점 2자리
    }

    return price;
  };

  // 통화별 포맷팅
  const formatCurrencyPrice = (price) => {
    const convertedPrice = convertPrice(price);
    switch (selectedCurrency) {
      case "VND":
        return new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
          minimumFractionDigits: 0,
        }).format(convertedPrice);
      case "USD":
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 2,
        }).format(convertedPrice);
      default: // KRW
        return new Intl.NumberFormat("ko-KR", {
          style: "currency",
          currency: "KRW",
          minimumFractionDigits: 0,
        }).format(convertedPrice);
    }
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
        name: "E-VISA (전자비자) / 일반 (4-5일 소요)",
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
    // Transit E-VISA의 경우 항상 당일발급
    if (formData.visaType === VISA_TYPES.E_VISA_TRANSIT) {
      return {
        id: "SAME_DAY",
        name: "당일발급",
      };
    }

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
  }; // 업로드된 서류 라벨 매핑
  const documentLabels = {
    passport: "여권 정보면",
    photo: "증명사진",
    passportPerson0: "여권 정보면 (1인)",
    photoPerson0: "증명사진 (1인)",
    passportPerson1: "여권 정보면 (2인)",
    photoPerson1: "증명사진 (2인)",
    passportPerson2: "여권 정보면 (3인)",
    photoPerson2: "증명사진 (3인)",
    flight_ticket: "항공권 예약 확인서",
    bank_statement: "은행 잔고 증명서",
    invitation_letter: "초청장",
    business_registration: "사업자등록증",
  };

  return (
    <div className="space-y-4 md:space-y-8">
      {/* 헤더 카드 */}
      <Card className="overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-white via-slate-50 to-purple-50/30">
        <CardHeader className="relative pb-4 text-white md:pb-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 text-center">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 md:w-20 md:h-20 md:mb-4 bg-white/20 backdrop-blur-sm rounded-2xl md:rounded-3xl">
              <CheckCircle className="w-6 h-6 text-white md:w-10 md:h-10" />
            </div>
            <CardTitle className="mb-2 text-2xl font-bold md:mb-3 md:text-4xl">신청 내용 확인</CardTitle>
            <p className="text-sm text-purple-100 md:text-xl">제출하기 전에 모든 정보를 다시 한번 확인해주세요</p>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 md:gap-8">
        {/* 메인 컨텐츠 */}
        <div className="space-y-4 lg:col-span-2 md:space-y-6">
          {/* 개인 정보 섹션 */}
          <Card className="transition-colors border-2 border-blue-100 hover:border-blue-200">
            <CardHeader className="pb-3 bg-gradient-to-r from-blue-50 to-indigo-50 md:pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 md:gap-3">
                  <User className="w-5 h-5 text-blue-600 md:w-6 md:h-6" />
                  <CardTitle className="text-lg text-blue-700 md:text-xl">개인 정보</CardTitle>
                </div>
                <Button variant="outline" size="sm" onClick={() => onEdit(2)} className="px-2 text-xs h-7 md:h-8 md:px-3 md:text-sm">
                  <Edit className="w-3 h-3 mr-1 md:w-4 md:h-4" />
                  수정
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-3 md:pt-4">
              <div className="grid grid-cols-1 gap-3 text-sm md:grid-cols-2 md:gap-4">
                {" "}
                <div className="flex items-center gap-2 p-2 rounded-lg md:gap-3 md:p-3 bg-gray-50">
                  <User className="flex-shrink-0 w-4 h-4 text-gray-500 md:w-5 md:h-5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500">신청자명</p>
                    <p className="font-semibold text-gray-900 truncate">
                      {formData.personalInfo?.fullName || `${formData.personalInfo?.firstName || ""} ${formData.personalInfo?.lastName || ""}`.trim()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg md:gap-3 md:p-3 bg-gray-50">
                  <Mail className="flex-shrink-0 w-4 h-4 text-gray-500 md:w-5 md:h-5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500">이메일</p>
                    <p className="font-semibold text-gray-900 truncate">{formData.personalInfo?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg md:gap-3 md:p-3 bg-gray-50">
                  <Phone className="flex-shrink-0 w-4 h-4 text-gray-500 md:w-5 md:h-5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500">연락처</p>
                    <p className="font-semibold text-gray-900">{formData.personalInfo?.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg md:gap-3 md:p-3 bg-gray-50">
                  <Home className="flex-shrink-0 w-4 h-4 text-gray-500 md:w-5 md:h-5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500">주소</p>
                    <p className="text-xs font-semibold leading-tight text-gray-900">{formData.personalInfo?.address}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 여행 정보 섹션 */}
          <Card className="transition-colors border-2 border-green-100 hover:border-green-200">
            <CardHeader className="pb-3 bg-gradient-to-r from-green-50 to-emerald-50 md:pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 md:gap-3">
                  <Plane className="w-5 h-5 text-green-600 md:w-6 md:h-6" />
                  <CardTitle className="text-lg text-green-700 md:text-xl">여행 정보</CardTitle>
                </div>
                <Button variant="outline" size="sm" onClick={() => onEdit(3)} className="px-2 text-xs h-7 md:h-8 md:px-3 md:text-sm">
                  <Edit className="w-3 h-3 mr-1 md:w-4 md:h-4" />
                  수정
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-3 md:pt-4">
              <div className="grid grid-cols-1 gap-3 text-sm md:grid-cols-2 md:gap-4">
                <div className="flex items-center gap-2 p-2 rounded-lg md:gap-3 md:p-3 bg-gray-50">
                  <Calendar className="flex-shrink-0 w-4 h-4 text-gray-500 md:w-5 md:h-5" />
                  <div>
                    <p className="text-xs text-gray-500">입국 예정일</p>
                    <p className="font-semibold text-gray-900">{formatDate(formData.travelInfo?.entryDate)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg md:gap-3 md:p-3 bg-gray-50">
                  <MapPin className="flex-shrink-0 w-4 h-4 text-gray-500 md:w-5 md:h-5" />
                  <div>
                    <p className="text-xs text-gray-500">입국 공항</p>
                    <p className="font-semibold text-gray-900">{getEntryPortLabel(formData.travelInfo?.entryPort)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 비자 정보 섹션 */}
          <Card className="transition-colors border-2 border-purple-100 hover:border-purple-200">
            <CardHeader className="pb-3 bg-gradient-to-r from-purple-50 to-pink-50 md:pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 md:gap-3">
                  <Globe className="w-5 h-5 text-purple-600 md:w-6 md:h-6" />
                  <CardTitle className="text-lg text-purple-700 md:text-xl">비자 정보</CardTitle>
                </div>
                <Button variant="outline" size="sm" onClick={() => onEdit(1)} className="px-2 text-xs h-7 md:h-8 md:px-3 md:text-sm">
                  <Edit className="w-3 h-3 mr-1 md:w-4 md:h-4" />
                  수정
                </Button>
              </div>
            </CardHeader>{" "}
            <CardContent className="pt-3 md:pt-4">
              <div className="grid grid-cols-1 gap-3 text-sm md:grid-cols-2 md:gap-4">
                <div className="p-2 rounded-lg md:p3 bg-gray-50">
                  <p className="mb-1 text-xs text-gray-500">비자 유형</p>
                  <div className="flex items-center gap-2">
                    <Badge className="text-blue-800 bg-blue-100 hover:bg-blue-100">{getVisaTypeInfo().name}</Badge>
                  </div>
                </div>
                <div className="p-2 rounded-lg md:p-3 bg-gray-50">
                  <p className="mb-1 text-xs text-gray-500">처리 속도</p>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <Badge className="text-green-800 bg-green-100 hover:bg-green-100">{getProcessingTypeInfo().name}</Badge>
                  </div>
                </div>

                {/* Transit E-VISA 추가 정보 */}
                {formData.visaType === VISA_TYPES.E_VISA_TRANSIT && (
                  <>
                    <div className="p-2 rounded-lg md:p-3 bg-orange-50">
                      <p className="mb-1 text-xs text-gray-500">경유 인원수</p>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-orange-500" />
                        <Badge className="text-orange-800 bg-orange-100 hover:bg-orange-100">{formData.transitPeopleCount || 1}명</Badge>
                      </div>
                    </div>
                    <div className="p-2 rounded-lg md:p-3 bg-purple-50">
                      <p className="mb-1 text-xs text-gray-500">차량 유형</p>{" "}
                      <div className="flex items-center gap-2">
                        <Car className="w-4 h-4 text-purple-500" />
                        <Badge className="text-purple-800 bg-purple-100 hover:bg-purple-100">
                          {(() => {
                            if (!formData.transitVehicleType) return "미선택";
                            if (formData.transitVehicleType === "INNOVA") return "이노바 (7인승)";
                            if (formData.transitVehicleType === "CARNIVAL") return "카니발 (11인승)";
                            return formData.transitVehicleType;
                          })()}
                        </Badge>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>{" "}
          </Card>

          {/* 추가 서비스 섹션 */}
          {formData.additionalServices && formData.additionalServices.length > 0 && (
            <Card className="transition-colors border-2 border-green-100 hover:border-green-200">
              <CardHeader className="pb-3 bg-gradient-to-r from-green-50 to-emerald-50 md:pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 md:gap-3">
                    <CreditCard className="w-5 h-5 text-green-600 md:w-6 md:h-6" />
                    <CardTitle className="text-lg text-green-700 md:text-xl">추가 서비스</CardTitle>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => onEdit(1)} className="px-2 text-xs h-7 md:h-8 md:px-3 md:text-sm">
                    <Edit className="w-3 h-3 mr-1 md:w-4 md:h-4" />
                    수정
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-3 md:pt-4">
                <div className="space-y-2 md:space-y-3">
                  {formData.additionalServices.map((serviceId) => {
                    // 서비스 이름 매핑
                    const getServiceName = (id) => {
                      const serviceMap = {
                        FAST_TRACK_ARRIVAL: "공항 패스트트랙 - 입국",
                        FAST_TRACK_ARRIVAL_PREMIUM: "공항 패스트트랙 - 프리미엄 입국",
                        AIRPORT_PICKUP_SEDAN_DISTRICT1: "공항 픽업 서비스 - 4인승 세단 (1,3,푸년군)",
                        AIRPORT_PICKUP_SEDAN_DISTRICT2: "공항 픽업 서비스 - 4인승 세단 (2,7,빈탄군)",
                        AIRPORT_PICKUP_SUV_DISTRICT1: "공항 픽업 서비스 - 7인승 SUV (1,3,푸년군)",
                        AIRPORT_PICKUP_SUV_DISTRICT2: "공항 픽업 서비스 - 7인승 SUV (2,7,빈탄군)",
                        FAST_TRACK: "공항 패스트트랙",
                        TRANSLATION: "번역 서비스",
                        HOTEL_BOOKING: "호텔 예약 서비스",
                      };
                      return serviceMap[id] || id;
                    };

                    return (
                      <div key={serviceId} className="flex items-center gap-2 p-2 rounded-lg md:gap-3 md:p-3 bg-gray-50">
                        <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full"></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 md:text-base">{getServiceName(serviceId)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* 업로드된 서류 섹션 */}
          <Card className="transition-colors border-2 border-orange-100 hover:border-orange-200">
            <CardHeader className="pb-3 bg-gradient-to-r from-orange-50 to-red-50 md:pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 md:gap-3">
                  <FileText className="w-5 h-5 text-orange-600 md:w-6 md:h-6" />
                  <CardTitle className="text-lg text-orange-700 md:text-xl">업로드된 서류</CardTitle>
                </div>
                <Button variant="outline" size="sm" onClick={() => onEdit(4)} className="px-2 text-xs h-7 md:h-8 md:px-3 md:text-sm">
                  <Edit className="w-3 h-3 mr-1 md:w-4 md:h-4" />
                  수정
                </Button>
              </div>
            </CardHeader>{" "}
            <CardContent className="pt-3 md:pt-4">
              {" "}
              <div className="space-y-2 md:space-y-3">
                {formData.documents && Object.keys(formData.documents).length > 0 ? (
                  Object.entries(formData.documents)
                    .filter(([docType, docData]) => {
                      // 유효한 문서만 필터링 - 더 안전한 검증
                      return docData && docData.fileName && (docData.file || docData.fileData) && docData.fileSize > 0;
                    })
                    .map(([docType, docData], index) => {
                      // 서류 타입별 라벨 결정
                      const getDocumentLabel = (type) => {
                        // 다중 인원용 키 처리 (예: passportPerson0, photoPerson1)
                        if (type.includes("Person")) {
                          const baseType = type.replace(/Person\d+/, "");
                          const personNumber = type.match(/Person(\d+)/)?.[1];
                          if (baseType === "passport") return `여권 정보면 (${parseInt(personNumber) + 1}인)`;
                          if (baseType === "photo") return `증명사진 (${parseInt(personNumber) + 1}인)`;
                        }

                        // 기본 타입 처리
                        if (type === "passport") return "여권 정보면";
                        if (type === "photo") return "증명사진";

                        // documentLabels에서 찾기
                        return documentLabels[type] || type;
                      };

                      const label = getDocumentLabel(docType);
                      const displayFile = docData.file || docData.fileData;
                      const fileSize = docData.fileSize || 0;
                      const fileSizeMB = (fileSize / 1024 / 1024).toFixed(2);

                      return (
                        <div key={`${docType}-${index}`} className="flex items-center justify-between p-2 rounded-lg md:p-3 bg-gray-50">
                          <div className="flex items-center flex-1 min-w-0 gap-2 md:gap-3">
                            <FileText className="flex-shrink-0 w-4 h-4 text-gray-500 md:w-5 md:h-5" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-gray-900 md:text-sm">{label}</p>
                              <p className="text-xs text-gray-500 truncate">
                                {docData.fileName} ({fileSizeMB}MB)
                              </p>
                            </div>
                          </div>
                          {displayFile && (
                            <Button variant="outline" size="sm" onClick={() => handleImagePreview(displayFile, label)} className="flex-shrink-0 px-2 h-7 md:h-8 md:px-3">
                              <Eye className="w-3 h-3 md:w-4 md:h-4" />
                            </Button>
                          )}
                        </div>
                      );
                    })
                ) : (
                  <p className="text-sm text-gray-500">업로드된 서류가 없습니다.</p>
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
                <CreditCard className="w-5 h-5 text-green-600 md:w-6 md:h-6" />
                <CardTitle className="text-lg text-green-700 md:text-xl">결제 정보</CardTitle>
              </div>
            </CardHeader>{" "}
            <CardContent className="space-y-3 md:space-y-4">
              {/* 통화 선택 */}
              <div className="p-3 mb-4 rounded-lg bg-gray-50">
                <h4 className="mb-2 text-sm font-semibold text-gray-800">결제 통화 선택</h4>
                <div className="flex gap-2">
                  {[
                    { code: "KRW", name: "원화", symbol: "₩" },
                    { code: "VND", name: "베트남 동", symbol: "₫" },
                    { code: "USD", name: "미국 달러", symbol: "$" },
                  ].map((currency) => (
                    <button
                      key={currency.code}
                      onClick={() => setSelectedCurrency(currency.code)}
                      className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                        selectedCurrency === currency.code ? "bg-blue-100 border-blue-300 text-blue-700" : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {currency.symbol} {currency.name}
                    </button>
                  ))}
                </div>
              </div>
              {/* 선택한 서비스 세부 정보 */}
              <div className="p-3 mb-4 rounded-lg bg-blue-50">
                <h4 className="mb-2 text-sm font-semibold text-blue-800">선택한 서비스</h4>
                <div className="space-y-1 text-xs text-blue-700">
                  <div>• {serviceDetails.visaTypeInfo.name}</div>
                  <div>• {serviceDetails.durationInfo.name}</div>
                  {serviceDetails.processingInfo.name && <div>• 처리 속도: {serviceDetails.processingInfo.name}</div>}
                  {formData.visaType === VISA_TYPES.E_VISA_TRANSIT && (
                    <>
                      <div>• 인원수: {formData.transitPeopleCount}명</div>
                      {serviceDetails.transitInfo.vehicleType && <div>• 차량: {serviceDetails.transitInfo.vehicleType.name}</div>}
                    </>
                  )}
                </div>
              </div>{" "}
              <div className="space-y-2">
                {/* 비자 기본 가격 */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    {formData.visaType === VISA_TYPES.E_VISA_TRANSIT ? `비자료 (${formData.transitPeopleCount}명)` : `비자료 (${serviceDetails.durationInfo.name})`}
                  </span>
                  <span className="font-semibold">{formatCurrencyPrice(currentPrice.visa.basePrice)}</span>
                </div>

                {/* 차량 추가 비용 (목바이 경유 시) */}
                {formData.visaType === VISA_TYPES.E_VISA_TRANSIT && currentPrice.visa.vehiclePrice > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">차량 추가료 ({serviceDetails.transitInfo.vehicleType?.name})</span>
                    <span className="font-semibold text-purple-600">{formatCurrencyPrice(currentPrice.visa.vehiclePrice)}</span>
                  </div>
                )}

                {/* 추가 서비스 */}
                {currentPrice.additionalServices.services.length > 0 && (
                  <>
                    {currentPrice.additionalServices.services.map((service) => (
                      <div key={service.id} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">{service.name}</span>
                        <span className="font-semibold text-blue-600">{formatCurrencyPrice(service.price)}</span>
                      </div>
                    ))}
                  </>
                )}
              </div>
              <div className="pt-2 border-t md:pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-gray-900 md:text-lg">총 결제금액</span>
                  <span className="text-xl font-bold text-green-600 md:text-2xl">{formatCurrencyPrice(currentPrice.totalPrice)}</span>
                </div>{" "}
                <p className="mt-1 text-xs text-gray-500">
                  {selectedCurrency === "KRW" && currentPrice.currency === "KRW" && "부가세 포함"}
                  {selectedCurrency === "VND" && currentPrice.currency === "VND" && "베트남 동화 원가"}
                  {selectedCurrency === "VND" && currentPrice.currency === "KRW" && "베트남 동화 기준 (환율 적용)"}
                  {selectedCurrency === "KRW" && currentPrice.currency === "VND" && "한국 원화 기준 (환율 적용)"}
                  {selectedCurrency === "USD" && "미국 달러 기준 (환율 적용)"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 약관 동의 카드 */}
          <Card className="border-2 border-gray-200">
            <CardHeader className="pb-3 md:pb-4">
              <div className="flex items-center gap-2 md:gap-3">
                <Shield className="w-5 h-5 text-gray-600 md:w-6 md:h-6" />
                <CardTitle className="text-lg text-gray-700 md:text-xl">약관 동의</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 md:space-y-4">
              <div className="space-y-3 md:space-y-4">
                <div className="flex items-start gap-2 md:gap-3">
                  <Checkbox id="terms" checked={agreedToTerms} onCheckedChange={setAgreedToTerms} className="mt-1" />
                  <label htmlFor="terms" className="text-xs leading-relaxed text-gray-700 cursor-pointer md:text-sm">
                    <span className="font-semibold">서비스 이용약관</span> 및 <span className="font-semibold">개인정보처리방침</span>에 동의합니다.
                    <br />
                    <span className="block mt-1 text-xs text-gray-500">비자 신청을 위해 필요한 개인정보 수집 및 이용에 동의합니다.</span>
                  </label>
                </div>
              </div>

              {!agreedToTerms && (
                <div className="flex items-start gap-2 p-2 border border-yellow-200 rounded-lg md:p-3 bg-yellow-50">
                  <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-yellow-800 md:text-sm">신청을 진행하려면 약관에 동의해주세요.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 제출 버튼 */}
          <div className="space-y-3 md:space-y-4">
            <Button
              onClick={onNext}
              disabled={!agreedToTerms || isSubmitting}
              className="w-full py-3 text-sm font-bold text-white transition-all duration-300 transform shadow-2xl md:py-4 md:text-lg bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 hover:from-purple-700 hover:via-pink-700 hover:to-red-700 rounded-xl md:rounded-2xl hover:shadow-3xl disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
            >
              {/* {isSubmitting ? ( */}
              {false ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white rounded-full md:w-5 md:h-5 border-t-transparent animate-spin"></div>
                  <span>제출 중...</span>
                </div>
              ) : (
                <span>비자 신청 제출하기</span>
              )}
            </Button>

            <Button
              onClick={onPrevious}
              variant="outline"
              className="w-full py-2 text-sm font-semibold text-gray-700 transition-all duration-300 border-2 border-gray-300 md:py-3 md:text-base hover:border-gray-400 rounded-xl"
            >
              <ArrowLeft className="w-4 h-4 mr-2 md:w-5 md:h-5" />
              이전 단계로
            </Button>
          </div>
        </div>
      </div>

      {/* 이미지 프리뷰 모달 */}
      {showImagePreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75">
          <div className="relative max-w-4xl max-h-full overflow-hidden bg-white rounded-lg">
            <div className="flex items-center justify-between p-3 border-b md:p-4">
              <h3 className="text-base font-semibold md:text-lg">{showImagePreview.title}</h3>
              <Button variant="outline" size="sm" onClick={closeImagePreview} className="w-8 h-8 p-0">
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="p-2 md:p-4">
              <img src={showImagePreview.imageData} alt={showImagePreview.title} className="max-w-full max-h-[70vh] object-contain mx-auto" />
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
