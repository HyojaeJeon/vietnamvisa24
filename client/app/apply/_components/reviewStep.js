
"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../src/components/ui/card";
import { Button } from "../../src/components/ui/button";
import { Badge } from "../../src/components/ui/badge";
import { CheckCircle, FileText, User, Edit2, Globe, Calendar, ArrowRight, ArrowLeft, Phone, MapPin, Plane, Hotel, Send, Edit, Loader2, CreditCard, IdCard } from "lucide-react";
import { formatCurrency, calculateTotalPrice, formatDate } from "./utils";
import { VISA_TYPES, PROCESSING_TYPES, ADDITIONAL_SERVICES } from "./types";

const ReviewStep = ({ formData, onNext, onPrevious, onEdit, isSubmitting, updateFormData }) => {
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
      nationality: formData.personalInfo?.nationality || "",
      issuingCountry: formData.personalInfo?.issuingCountry || "",
      sex: formData.personalInfo?.gender || "",
      dateOfBirth: formData.personalInfo?.birthDate || "",
      dateOfIssue: formData.personalInfo?.passportIssueDate || "",
      dateOfExpiry: formData.personalInfo?.passportExpiryDate || "",
      type: formData.personalInfo?.passportType || "",
      authority: formData.personalInfo?.authority || "",
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
      }
    });
    setIsEditingPassport(false);
    setEditedPassportInfo(null);
  };

  // 여권 정보 수정 취소
  const cancelEditingPassport = () => {
    setIsEditingPassport(false);
    setEditedPassportInfo(null);
  };

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Card className="mx-auto max-w-4xl overflow-hidden border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
        <CardHeader className="relative pb-8 text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 flex items-center gap-4">
            <div className="flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <div>
              <CardTitle className="mb-2 text-3xl font-bold">신청 정보 최종 확인</CardTitle>
              <p className="text-lg text-indigo-100">입력하신 정보를 확인하고 수정하세요</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-8 space-y-8">
          {/* 서비스 선택 정보 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl shadow-lg">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">선택한 서비스</h3>
              </div>
              <Button variant="outline" size="sm" onClick={() => onEdit(1)} className="text-blue-600 hover:text-blue-700 border-blue-200 hover:border-blue-300">
                <Edit className="w-4 h-4 mr-2" />
                수정
              </Button>
            </div>

            <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50 shadow-lg">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <p className="mb-2 text-sm font-semibold text-gray-600 uppercase tracking-wide">비자 유형</p>
                    <p className="text-lg font-bold text-gray-800">{getVisaTypeLabel(formData.visaType)}</p>
                  </div>
                  <div>
                    <p className="mb-2 text-sm font-semibold text-gray-600 uppercase tracking-wide">처리 속도</p>
                    <p className="text-lg font-bold text-gray-800">{getProcessingTypeLabel(formData.processingType)}</p>
                  </div>
                  {formData.additionalServices && formData.additionalServices.length > 0 && (
                    <div className="md:col-span-2">
                      <p className="mb-3 text-sm font-semibold text-gray-600 uppercase tracking-wide">추가 서비스</p>
                      <div className="flex flex-wrap gap-2">
                        {formData.additionalServices.map((service) => (
                          <Badge key={service} variant="secondary" className="px-3 py-1 text-sm bg-blue-100 text-blue-800">
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

          {/* 여권 정보 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl shadow-lg">
                  <IdCard className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">여권 정보</h3>
              </div>
              {!isEditingPassport && (
                <Button variant="outline" size="sm" onClick={startEditingPassport} className="text-emerald-600 hover:text-emerald-700 border-emerald-200 hover:border-emerald-300">
                  <Edit2 className="w-4 h-4 mr-2" />
                  수정
                </Button>
              )}
            </div>

            <Card className="border-2 border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 shadow-lg">
              <CardContent className="p-6">
                {isEditingPassport ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">여권번호</label>
                        <input
                          type="text"
                          value={editedPassportInfo.passportNo}
                          onChange={(e) => setEditedPassportInfo({...editedPassportInfo, passportNo: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">성 (Surname)</label>
                        <input
                          type="text"
                          value={editedPassportInfo.surname}
                          onChange={(e) => setEditedPassportInfo({...editedPassportInfo, surname: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">이름 (Given Names)</label>
                        <input
                          type="text"
                          value={editedPassportInfo.givenNames}
                          onChange={(e) => setEditedPassportInfo({...editedPassportInfo, givenNames: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">한글 이름</label>
                        <input
                          type="text"
                          value={editedPassportInfo.koreanName}
                          onChange={(e) => setEditedPassportInfo({...editedPassportInfo, koreanName: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">국적</label>
                        <input
                          type="text"
                          value={editedPassportInfo.nationality}
                          onChange={(e) => setEditedPassportInfo({...editedPassportInfo, nationality: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">발급 국가</label>
                        <input
                          type="text"
                          value={editedPassportInfo.issuingCountry}
                          onChange={(e) => setEditedPassportInfo({...editedPassportInfo, issuingCountry: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">성별</label>
                        <select
                          value={editedPassportInfo.sex}
                          onChange={(e) => setEditedPassportInfo({...editedPassportInfo, sex: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                          <option value="">선택하세요</option>
                          <option value="M">남성 (M)</option>
                          <option value="F">여성 (F)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">생년월일</label>
                        <input
                          type="date"
                          value={editedPassportInfo.dateOfBirth}
                          onChange={(e) => setEditedPassportInfo({...editedPassportInfo, dateOfBirth: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">발급일</label>
                        <input
                          type="date"
                          value={editedPassportInfo.dateOfIssue}
                          onChange={(e) => setEditedPassportInfo({...editedPassportInfo, dateOfIssue: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">만료일</label>
                        <input
                          type="date"
                          value={editedPassportInfo.dateOfExpiry}
                          onChange={(e) => setEditedPassportInfo({...editedPassportInfo, dateOfExpiry: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">여권 유형</label>
                        <input
                          type="text"
                          value={editedPassportInfo.type}
                          onChange={(e) => setEditedPassportInfo({...editedPassportInfo, type: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">발급 기관</label>
                        <input
                          type="text"
                          value={editedPassportInfo.authority}
                          onChange={(e) => setEditedPassportInfo({...editedPassportInfo, authority: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">개인번호</label>
                        <input
                          type="text"
                          value={editedPassportInfo.personalNo}
                          onChange={(e) => setEditedPassportInfo({...editedPassportInfo, personalNo: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    </div>
                    <div className="flex gap-3 pt-4 border-t">
                      <Button onClick={savePassportInfo} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                        저장
                      </Button>
                      <Button onClick={cancelEditingPassport} variant="outline">
                        취소
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <p className="mb-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">여권번호</p>
                      <p className="text-lg font-bold text-gray-800">{formData.personalInfo?.passportNo || "-"}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <p className="mb-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">성 (Surname)</p>
                      <p className="text-lg font-bold text-gray-800">{formData.personalInfo?.lastName || "-"}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <p className="mb-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">이름 (Given Names)</p>
                      <p className="text-lg font-bold text-gray-800">{formData.personalInfo?.firstName || "-"}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <p className="mb-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">한글 이름</p>
                      <p className="text-lg font-bold text-gray-800">{formData.personalInfo?.koreanName || "-"}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <p className="mb-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">국적</p>
                      <p className="text-lg font-bold text-gray-800">{formData.personalInfo?.nationality || "-"}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <p className="mb-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">발급 국가</p>
                      <p className="text-lg font-bold text-gray-800">{formData.personalInfo?.issuingCountry || "-"}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <p className="mb-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">성별</p>
                      <p className="text-lg font-bold text-gray-800">{formData.personalInfo?.gender === "M" ? "남성" : formData.personalInfo?.gender === "F" ? "여성" : "-"}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <p className="mb-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">생년월일</p>
                      <p className="text-lg font-bold text-gray-800">{formData.personalInfo?.birthDate ? formatDate(formData.personalInfo.birthDate) : "-"}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <p className="mb-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">발급일</p>
                      <p className="text-lg font-bold text-gray-800">{formData.personalInfo?.passportIssueDate ? formatDate(formData.personalInfo.passportIssueDate) : "-"}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <p className="mb-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">만료일</p>
                      <p className="text-lg font-bold text-gray-800">{formData.personalInfo?.passportExpiryDate ? formatDate(formData.personalInfo.passportExpiryDate) : "-"}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <p className="mb-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">여권 유형</p>
                      <p className="text-lg font-bold text-gray-800">{formData.personalInfo?.passportType || "-"}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <p className="mb-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">발급 기관</p>
                      <p className="text-lg font-bold text-gray-800">{formData.personalInfo?.authority || "-"}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <p className="mb-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">개인번호</p>
                      <p className="text-lg font-bold text-gray-800">{formData.personalInfo?.personalNo || "-"}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <p className="mb-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">이메일</p>
                      <p className="text-lg font-bold text-gray-800">{formData.personalInfo?.email || "-"}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <p className="mb-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">휴대폰</p>
                      <p className="text-lg font-bold text-gray-800">{formData.personalInfo?.phone || "-"}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm md:col-span-2">
                      <p className="mb-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">주소</p>
                      <p className="text-lg font-bold text-gray-800">{formData.personalInfo?.address || "-"}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* 여행 정보 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg">
                  <Plane className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">여행 정보</h3>
              </div>
              <Button variant="outline" size="sm" onClick={() => onEdit(3)} className="text-purple-600 hover:text-purple-700 border-purple-200 hover:border-purple-300">
                <Edit className="w-4 h-4 mr-2" />
                수정
              </Button>
            </div>

            <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 shadow-lg">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <p className="mb-2 text-sm font-semibold text-gray-600 uppercase tracking-wide">입국 예정일</p>
                    <p className="text-lg font-bold text-gray-800">{formData.travelInfo?.entryDate ? formatDate(formData.travelInfo.entryDate) : "-"}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <p className="mb-2 text-sm font-semibold text-gray-600 uppercase tracking-wide">입국 공항</p>
                    <p className="text-lg font-bold text-gray-800">{getEntryPortLabel(formData.travelInfo?.entryPort)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 업로드된 서류 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl shadow-lg">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">업로드된 서류</h3>
              </div>
              <Button variant="outline" size="sm" onClick={() => onEdit(4)} className="text-orange-600 hover:text-orange-700 border-orange-200 hover:border-orange-300">
                <Edit className="w-4 h-4 mr-2" />
                수정
              </Button>
            </div>

            <Card className="border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-red-50 shadow-lg">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {Object.entries(uploadedDocuments).map(([docType, document]) => (
                    <div key={docType} className="flex items-center gap-3 p-4 bg-white border rounded-lg shadow-sm">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{documentLabels[docType] || docType}</p>
                        <p className="text-xs text-gray-500">{document.fileName}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {Object.keys(uploadedDocuments).length === 0 && (
                  <p className="py-8 text-center text-gray-500">업로드된 서류가 없습니다.</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* 결제 금액 요약 */}
          <div className="relative p-8 overflow-hidden text-white bg-gradient-to-r from-gray-800 via-gray-900 to-black rounded-2xl shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-blue-600/20"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <CreditCard className="w-8 h-8 text-green-400" />
                <h3 className="text-2xl font-bold">결제 금액 요약</h3>
              </div>
              <div className="mb-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-lg">기본 비자 요금</span>
                  <span className="text-lg font-semibold">{formatCurrency(30)}</span>
                </div>
                {formData.processingType !== PROCESSING_TYPES.NORMAL && (
                  <div className="flex items-center justify-between">
                    <span className="text-lg">급행 처리 요금</span>
                    <span className="text-lg font-semibold">{formatCurrency(20)}</span>
                  </div>
                )}
                {formData.additionalServices && formData.additionalServices.length > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-lg">추가 서비스</span>
                    <span className="text-lg font-semibold">{formatCurrency(25)}</span>
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
            </Button>
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
    </div>
  );
};

export default ReviewStep;
