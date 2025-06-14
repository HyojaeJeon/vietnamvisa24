"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../src/components/ui/card";
import { Button } from "../../src/components/ui/button";
import { CheckCircle, FileText, User, Mail, Globe, Calendar, ArrowRight, ArrowLeft } from "lucide-react";
import { formatCurrency, calculateVisaPrice, formatDate } from "./utils";

const ReviewStep = ({ formData, onNext, onPrev }) => {
  const currentPrice = calculateVisaPrice(formData.visaType, formData.processingType);

  const getVisaTypeLabel = (type) => {
    const labels = {
      general: "일반 관광",
      business: "비즈니스",
      tourist: "단기 관광",
      transit: "경유",
    };
    return labels[type] || type;
  };

  const getProcessingTypeLabel = (type) => {
    const labels = {
      standard: "일반 (5-7일)",
      express: "급행 (2-3일)",
      urgent: "긴급 (1일)",
    };
    return labels[type] || type;
  };

  const getPurposeLabel = (purpose) => {
    const labels = {
      tourism: "관광",
      business: "출장",
      transit: "경유",
      family_visit: "가족 방문",
      conference: "회의 참석",
      other: "기타",
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
    };
    return countries[code] || code;
  };

  return (
    <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-blue-50/30">
      <CardHeader className="pb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">신청 내용 확인</CardTitle>
            <p className="text-gray-600 mt-1">입력하신 정보를 확인해주세요</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 개인정보 */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <User className="w-5 h-5" />
            개인정보
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">성명:</span>
              <span className="ml-2 font-medium">
                {formData.firstName} {formData.lastName}
              </span>
            </div>
            <div>
              <span className="text-gray-600">생년월일:</span>
              <span className="ml-2 font-medium">{formData.birthDate ? formatDate(formData.birthDate) : "-"}</span>
            </div>
            <div>
              <span className="text-gray-600">성별:</span>
              <span className="ml-2 font-medium">{formData.gender === "male" ? "남성" : formData.gender === "female" ? "여성" : "-"}</span>
            </div>
            <div>
              <span className="text-gray-600">국적:</span>
              <span className="ml-2 font-medium">{getNationalityLabel(formData.nationality)}</span>
            </div>
            <div>
              <span className="text-gray-600">여권번호:</span>
              <span className="ml-2 font-medium">{formData.passportNumber || "-"}</span>
            </div>
            <div>
              <span className="text-gray-600">여권 만료일:</span>
              <span className="ml-2 font-medium">{formData.passportExpiry ? formatDate(formData.passportExpiry) : "-"}</span>
            </div>
          </div>
        </div>

        {/* 연락처 정보 */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <Mail className="w-5 h-5" />
            연락처 정보
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">이메일:</span>
              <span className="ml-2 font-medium">{formData.email || "-"}</span>
            </div>
            <div>
              <span className="text-gray-600">전화번호:</span>
              <span className="ml-2 font-medium">{formData.phone || "-"}</span>
            </div>
            <div className="col-span-2">
              <span className="text-gray-600">주소:</span>
              <span className="ml-2 font-medium">
                {formData.address || "-"}
                {formData.city && `, ${formData.city}`}
                {formData.country && `, ${getNationalityLabel(formData.country)}`}
              </span>
            </div>
          </div>
        </div>

        {/* 여행 정보 */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <Globe className="w-5 h-5" />
            여행 정보
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">비자 종류:</span>
              <span className="ml-2 font-medium">{getVisaTypeLabel(formData.visaType)}</span>
            </div>
            <div>
              <span className="text-gray-600">처리 속도:</span>
              <span className="ml-2 font-medium">{getProcessingTypeLabel(formData.processingType)}</span>
            </div>
            <div>
              <span className="text-gray-600">입국 예정일:</span>
              <span className="ml-2 font-medium">{formData.entryDate ? formatDate(formData.entryDate) : "-"}</span>
            </div>
            <div>
              <span className="text-gray-600">출국 예정일:</span>
              <span className="ml-2 font-medium">{formData.exitDate ? formatDate(formData.exitDate) : "-"}</span>
            </div>
            <div>
              <span className="text-gray-600">방문 목적:</span>
              <span className="ml-2 font-medium">{getPurposeLabel(formData.purpose)}</span>
            </div>
            <div>
              <span className="text-gray-600">이전 방문:</span>
              <span className="ml-2 font-medium">{formData.previousVisit ? "있음" : "없음"}</span>
            </div>
          </div>
        </div>

        {/* 업로드된 서류 */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            업로드된 서류
          </h3>
          <div className="space-y-2">
            {(formData.documents || []).map((doc, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>{doc.document_name}</span>
                <span className="text-gray-500">
                  ({doc.document_type === "passport" ? "여권 사본" : doc.document_type === "photo" ? "증명사진" : doc.document_type === "invitation" ? "초청장" : doc.document_type})
                </span>
              </div>
            ))}
            {(!formData.documents || formData.documents.length === 0) && <p className="text-gray-500 text-sm">업로드된 서류가 없습니다</p>}
          </div>
        </div>

        {/* 총 비용 */}
        <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-semibold">총 비자 비용</div>
              <div className="text-blue-200 text-sm">부가세 포함</div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{formatCurrency(currentPrice)}</div>
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={onPrev} className="px-6 py-3 border-2 border-gray-300 hover:border-gray-400 rounded-xl font-semibold transition-all duration-300">
            <ArrowLeft className="w-5 h-5 mr-2" />
            이전
          </Button>
          <Button
            onClick={onNext}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <span className="mr-2">결제하기</span>
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewStep;
