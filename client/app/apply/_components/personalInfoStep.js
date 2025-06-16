"use client";

import React from "react";
import PropTypes from "prop-types";
import { Card, CardContent, CardHeader, CardTitle } from "../../src/components/ui/card";
import { Button } from "../../src/components/ui/button";
import { Input } from "../../src/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../src/components/ui/select";
import { RadioGroup, RadioGroupItem } from "../../src/components/ui/radio-group";
import { Label } from "../../src/components/ui/label";
import { User, ArrowRight, ArrowLeft, MapPin, Phone, Mail } from "lucide-react";
import { validateStep, getFieldErrors } from "./utils"; // getFieldErrors 추가

const PersonalInfoStep = ({ formData, onUpdate, onNext, onPrevious, errors }) => {
  // errors prop 추가
  const handleInputChange = (field, value) => {
    onUpdate({ [field]: value });
  };

  const isValid = validateStep(2, formData);

  // 각 필드에 대한 오류를 가져오는 헬퍼 함수
  const getError = (fieldName) => errors && getFieldErrors(errors, fieldName);

  const nationalities = [
    { value: "KR", label: "대한민국" },
    { value: "US", label: "미국" },
    { value: "JP", label: "일본" },
    { value: "CN", label: "중국" },
    { value: "GB", label: "영국" },
    { value: "DE", label: "독일" },
    { value: "FR", label: "프랑스" },
    { value: "CA", label: "캐나다" },
    { value: "AU", label: "호주" },
    { value: "SG", label: "싱가포르" },
    { value: "TH", label: "태국" },
    { value: "MY", label: "말레이시아" },
    { value: "ID", label: "인도네시아" },
    { value: "PH", label: "필리핀" },
    { value: "VN", label: "베트남" },
    { value: "OTHER", label: "기타" },
  ];

  const genderOptions = [
    { value: "M", label: "남성" },
    { value: "F", label: "여성" },
  ];

  return (
    <Card className="overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-white via-slate-50 to-blue-50/30">
      <CardHeader className="relative pb-8 text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 flex items-center gap-4">
          <div className="flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl">
            <User className="w-8 h-8 text-white" />
          </div>
          <div>
            <CardTitle className="mb-2 text-3xl font-bold">신청자 기본 정보</CardTitle>
            <p className="text-lg text-emerald-100">여권 정보와 동일하게 정확히 입력해주세요</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-8 space-y-8">
        {/* 연락처 정보 섹션 */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg">
              <Phone className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">연락처 정보</h3>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* 이메일 */}
            <div className="space-y-3">
              <label htmlFor="email" className="block text-sm font-bold tracking-wide text-gray-800 uppercase">
                이메일 주소 *
              </label>
              <div className="relative">
                <Mail className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                <Input
                  id="email"
                  type="email"
                  value={formData.personalInfo?.email || ""}
                  onChange={(e) =>
                    handleInputChange("personalInfo", {
                      ...formData.personalInfo,
                      email: e.target.value,
                    })
                  }
                  placeholder="example@email.com"
                  className={`h-12 text-lg font-medium border-2 ${
                    getError("personalInfo.email") ? "border-red-500 focus:border-red-500 ring-red-200" : "border-gray-200 focus:border-emerald-500 focus:ring-emerald-200"
                  } pl-10`}
                  aria-invalid={!!getError("personalInfo.email")}
                  aria-describedby={getError("personalInfo.email") ? "email-error" : undefined}
                />
              </div>
              <p className="text-xs text-gray-500">비자 승인서를 받을 이메일 주소</p>
              {getError("personalInfo.email") && (
                <p id="email-error" className="mt-1 text-xs text-red-500">
                  {getError("personalInfo.email")}
                </p>
              )}
            </div>

            {/* 휴대폰 번호 */}
            <div className="space-y-3">
              <label htmlFor="phone" className="block text-sm font-bold tracking-wide text-gray-800 uppercase">
                휴대폰 번호 *
              </label>
              <div className="relative">
                <Phone className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                <Input
                  id="phone"
                  type="tel"
                  value={formData.personalInfo?.phone || ""}
                  onChange={(e) =>
                    handleInputChange("personalInfo", {
                      ...formData.personalInfo,
                      phone: e.target.value,
                    })
                  }
                  placeholder="+82-10-1234-5678"
                  className={`h-12 text-lg font-medium border-2 ${
                    getError("personalInfo.phone") ? "border-red-500 focus:border-red-500 ring-red-200" : "border-gray-200 focus:border-emerald-500 focus:ring-emerald-200"
                  } pl-10`}
                  aria-invalid={!!getError("personalInfo.phone")}
                  aria-describedby={getError("personalInfo.phone") ? "phone-error" : undefined}
                />
              </div>
              <p className="text-xs text-gray-500">국가코드를 포함한 전체 번호</p>
              {getError("personalInfo.phone") && (
                <p id="phone-error" className="mt-1 text-xs text-red-500">
                  {getError("personalInfo.phone")}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 주소 정보 섹션 */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-lg">
              <MapPin className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">한국 주소 (영문)</h3>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {/* 현재 거주 주소 */}
            <div className="space-y-3">
              <label htmlFor="address" className="block text-sm font-bold tracking-wide text-gray-800 uppercase">
                현재 거주 주소 *
              </label>
              <Input
                id="address"
                value={formData.personalInfo?.address || ""}
                onChange={(e) =>
                  handleInputChange("personalInfo", {
                    ...formData.personalInfo,
                    address: e.target.value,
                  })
                }
                placeholder="예) 서울시 강남구 서초동 -> SEOUL GANGNAM SEOCHO"
                className={`h-12 text-lg font-medium border-2 ${
                  getError("personalInfo.address") ? "border-red-500 focus:border-red-500 ring-red-200" : "border-gray-200 focus:border-emerald-500 focus:ring-emerald-200"
                }`}
                aria-invalid={!!getError("personalInfo.address")}
                aria-describedby={getError("personalInfo.address") ? "address-error" : undefined}
              />
              <p className="text-xs text-gray-500">시, 도, 동까지만 기재하셔도 됩니다</p>
              {getError("personalInfo.address") && (
                <p id="address-error" className="mt-1 text-xs text-red-500">
                  {getError("personalInfo.address")}
                </p>
              )}
            </div>

            {/* 현지 지인이나 가족 전화번호 */}
            <div className="space-y-3">
              <label htmlFor="phoneOfFriend" className="block text-sm font-bold tracking-wide text-gray-800 uppercase">
                베트남 현지 지인 또는 가족의 연락처
              </label>
              <Input
                id="phoneOfFriend"
                value={formData.personalInfo?.phoneOfFriend || ""}
                onChange={(e) =>
                  handleInputChange("personalInfo", {
                    ...formData.personalInfo,
                    phoneOfFriend: e.target.value,
                  })
                }
                placeholder="예) 093-711-1234"
                className={`h-12 text-lg font-medium border-2 ${
                  getError("personalInfo.phoneOfFriend") ? "border-red-500 focus:border-red-500 ring-red-200" : "border-gray-200 focus:border-emerald-500 focus:ring-emerald-200"
                }`}
                aria-invalid={!!getError("personalInfo.phoneOfFriend")}
                aria-describedby={getError("personalInfo.phoneOfFriend") ? "phoneOfFriend-error" : undefined}
              />
              <p className="text-xs text-gray-500">→ 정확하지 않아도 괜찮으며 대략적인 번호로 기입 가능합니다.</p>
              {getError("personalInfo.phoneOfFriend") && (
                <p id="phoneOfFriend-error" className="mt-1 text-xs text-red-500">
                  {getError("personalInfo.phoneOfFriend")}
                </p>
              )}
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
            disabled={!isValid}
            className="px-12 py-4 text-lg font-bold text-white transition-all duration-300 transform shadow-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:via-teal-700 hover:to-cyan-700 rounded-2xl hover:shadow-3xl disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
          >
            <span className="mr-3">다음</span>
            <ArrowRight className="w-6 h-6" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

PersonalInfoStep.propTypes = {
  formData: PropTypes.shape({
    personalInfo: PropTypes.shape({
      lastName: PropTypes.string,
      firstName: PropTypes.string,
      birthDate: PropTypes.string,
      gender: PropTypes.string,
      nationality: PropTypes.string,
      birthPlace: PropTypes.string,
      email: PropTypes.string,
      phone: PropTypes.string,
      address: PropTypes.string,
      occupation: PropTypes.string,
    }),
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  onPrevious: PropTypes.func.isRequired,
  errors: PropTypes.object, // errors prop 타입 추가
};

PersonalInfoStep.defaultProps = {
  // 기본값 추가
  errors: {},
};

export default PersonalInfoStep;
