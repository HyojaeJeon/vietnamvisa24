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
    <Card className="border-0 shadow-2xl bg-gradient-to-br from-white via-slate-50 to-blue-50/30 overflow-hidden">
      <CardHeader className="pb-8 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white relative">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-3xl font-bold mb-2">신청자 기본 정보</CardTitle>
            <p className="text-emerald-100 text-lg">여권 정보와 동일하게 정확히 입력해주세요</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-8 space-y-8">
        {/* 기본 정보 섹션 */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">기본 정보</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 영문 성 */}
            <div className="space-y-3">
              <label htmlFor="lastName" className="block text-sm font-bold text-gray-800 uppercase tracking-wide">
                영문 성 (SURNAME) *
              </label>
              <Input
                id="lastName"
                value={formData.personalInfo?.lastName || ""}
                onChange={(e) =>
                  handleInputChange("personalInfo", {
                    ...formData.personalInfo,
                    lastName: e.target.value.toUpperCase(),
                  })
                }
                placeholder="KIM"
                className={`h-12 text-lg font-medium border-2 ${
                  getError("personalInfo.lastName") ? "border-red-500 focus:border-red-500 ring-red-200" : "border-gray-200 focus:border-emerald-500 focus:ring-emerald-200"
                }`}
                aria-invalid={!!getError("personalInfo.lastName")}
                aria-describedby={getError("personalInfo.lastName") ? "lastName-error" : undefined}
              />
              <p className="text-xs text-gray-500">여권에 표기된 영문 성을 대문자로 입력</p>
              {getError("personalInfo.lastName") && (
                <p id="lastName-error" className="text-xs text-red-500 mt-1">
                  {getError("personalInfo.lastName")}
                </p>
              )}
            </div>

            {/* 영문 이름 */}
            <div className="space-y-3">
              <label htmlFor="firstName" className="block text-sm font-bold text-gray-800 uppercase tracking-wide">
                영문 이름 (GIVEN NAME) *
              </label>
              <Input
                id="firstName"
                value={formData.personalInfo?.firstName || ""}
                onChange={(e) =>
                  handleInputChange("personalInfo", {
                    ...formData.personalInfo,
                    firstName: e.target.value.toUpperCase(),
                  })
                }
                placeholder="HONG GIL DONG"
                className={`h-12 text-lg font-medium border-2 ${
                  getError("personalInfo.firstName") ? "border-red-500 focus:border-red-500 ring-red-200" : "border-gray-200 focus:border-emerald-500 focus:ring-emerald-200"
                }`}
                aria-invalid={!!getError("personalInfo.firstName")}
                aria-describedby={getError("personalInfo.firstName") ? "firstName-error" : undefined}
              />
              <p className="text-xs text-gray-500">여권에 표기된 영문 이름을 대문자로 입력</p>
              {getError("personalInfo.firstName") && (
                <p id="firstName-error" className="text-xs text-red-500 mt-1">
                  {getError("personalInfo.firstName")}
                </p>
              )}
            </div>

            {/* 생년월일 */}
            <div className="space-y-3">
              <label htmlFor="birthDate" className="block text-sm font-bold text-gray-800 uppercase tracking-wide">
                생년월일 *
              </label>
              <Input
                id="birthDate"
                type="date"
                value={formData.personalInfo?.birthDate || ""}
                onChange={(e) =>
                  handleInputChange("personalInfo", {
                    ...formData.personalInfo,
                    birthDate: e.target.value,
                  })
                }
                className={`h-12 text-lg font-medium border-2 ${
                  getError("personalInfo.birthDate") ? "border-red-500 focus:border-red-500 ring-red-200" : "border-gray-200 focus:border-emerald-500 focus:ring-emerald-200"
                }`}
                max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split("T")[0]}
                aria-invalid={!!getError("personalInfo.birthDate")}
                aria-describedby={getError("personalInfo.birthDate") ? "birthDate-error" : undefined}
              />
              <p className="text-xs text-gray-500">만 18세 이상만 신청 가능</p>
              {getError("personalInfo.birthDate") && (
                <p id="birthDate-error" className="text-xs text-red-500 mt-1">
                  {getError("personalInfo.birthDate")}
                </p>
              )}
            </div>

            {/* 성별 */}
            <div className="space-y-3">
              <label id="genderLabel" className="block text-sm font-bold text-gray-800 uppercase tracking-wide">
                성별 *
              </label>
              <RadioGroup
                aria-labelledby="genderLabel"
                value={formData.personalInfo?.gender || ""}
                onValueChange={(value) =>
                  handleInputChange("personalInfo", {
                    ...formData.personalInfo,
                    gender: value,
                  })
                }
                className="flex space-x-6"
                // RadioGroup 자체에 aria-invalid를 설정하기보다는 개별 RadioGroupItem에 적용하거나,
                // 그룹 전체에 대한 오류 메시지를 별도로 표시할 수 있습니다.
                // 여기서는 RadioGroup 다음에 오류 메시지를 표시합니다.
                aria-describedby={getError("personalInfo.gender") ? "gender-error" : undefined}
              >
                {genderOptions.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value} id={`gender-${option.value}`} />
                    <Label htmlFor={`gender-${option.value}`} className="text-lg font-medium cursor-pointer">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              {getError("personalInfo.gender") && (
                <p id="gender-error" className="text-xs text-red-500 mt-1">
                  {getError("personalInfo.gender")}
                </p>
              )}
            </div>

            {/* 국적 */}
            <div className="space-y-3">
              <label htmlFor="nationality-trigger" id="nationalityLabel" className="block text-sm font-bold text-gray-800 uppercase tracking-wide">
                국적 *
              </label>
              <Select
                value={formData.personalInfo?.nationality || ""}
                onValueChange={(value) =>
                  handleInputChange("personalInfo", {
                    ...formData.personalInfo,
                    nationality: value,
                  })
                }
                aria-invalid={!!getError("personalInfo.nationality")}
                aria-describedby={getError("personalInfo.nationality") ? "nationality-error" : undefined}
              >
                <SelectTrigger
                  id="nationality-trigger"
                  className={`h-12 text-lg border-2 ${getError("personalInfo.nationality") ? "border-red-500 focus:border-red-500 ring-red-200" : "border-gray-200 focus:border-emerald-500"}`}
                  aria-labelledby="nationalityLabel"
                >
                  <SelectValue placeholder="국적을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {nationalities.map((country) => (
                    <SelectItem key={country.value} value={country.value}>
                      {country.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {getError("personalInfo.nationality") && (
                <p id="nationality-error" className="text-xs text-red-500 mt-1">
                  {getError("personalInfo.nationality")}
                </p>
              )}
            </div>

            {/* 출생지 */}
            <div className="space-y-3">
              <label htmlFor="birthPlace" className="block text-sm font-bold text-gray-800 uppercase tracking-wide">
                출생지 *
              </label>
              <Input
                id="birthPlace"
                value={formData.personalInfo?.birthPlace || ""}
                onChange={(e) =>
                  handleInputChange("personalInfo", {
                    ...formData.personalInfo,
                    birthPlace: e.target.value,
                  })
                }
                placeholder="Seoul, South Korea"
                className={`h-12 text-lg font-medium border-2 ${
                  getError("personalInfo.birthPlace") ? "border-red-500 focus:border-red-500 ring-red-200" : "border-gray-200 focus:border-emerald-500 focus:ring-emerald-200"
                }`}
                aria-invalid={!!getError("personalInfo.birthPlace")}
                aria-describedby={getError("personalInfo.birthPlace") ? "birthPlace-error" : undefined}
              />
              {getError("personalInfo.birthPlace") && (
                <p id="birthPlace-error" className="text-xs text-red-500 mt-1">
                  {getError("personalInfo.birthPlace")}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 연락처 정보 섹션 */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Phone className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">연락처 정보</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 이메일 */}
            <div className="space-y-3">
              <label htmlFor="email" className="block text-sm font-bold text-gray-800 uppercase tracking-wide">
                이메일 주소 *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
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
                <p id="email-error" className="text-xs text-red-500 mt-1">
                  {getError("personalInfo.email")}
                </p>
              )}
            </div>

            {/* 휴대폰 번호 */}
            <div className="space-y-3">
              <label htmlFor="phone" className="block text-sm font-bold text-gray-800 uppercase tracking-wide">
                휴대폰 번호 *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
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
                <p id="phone-error" className="text-xs text-red-500 mt-1">
                  {getError("personalInfo.phone")}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 주소 정보 섹션 */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">주소 정보</h3>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {/* 현재 거주 주소 */}
            <div className="space-y-3">
              <label htmlFor="address" className="block text-sm font-bold text-gray-800 uppercase tracking-wide">
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
                placeholder="123 Main Street, City, State/Province, Country"
                className={`h-12 text-lg font-medium border-2 ${
                  getError("personalInfo.address") ? "border-red-500 focus:border-red-500 ring-red-200" : "border-gray-200 focus:border-emerald-500 focus:ring-emerald-200"
                }`}
                aria-invalid={!!getError("personalInfo.address")}
                aria-describedby={getError("personalInfo.address") ? "address-error" : undefined}
              />
              <p className="text-xs text-gray-500">영문으로 상세 주소를 입력해주세요</p>
              {getError("personalInfo.address") && (
                <p id="address-error" className="text-xs text-red-500 mt-1">
                  {getError("personalInfo.address")}
                </p>
              )}
            </div>

            {/* 직업 */}
            <div className="space-y-3">
              <label htmlFor="occupation" className="block text-sm font-bold text-gray-800 uppercase tracking-wide">
                직업 *
              </label>
              <Input
                id="occupation"
                value={formData.personalInfo?.occupation || ""}
                onChange={(e) =>
                  handleInputChange("personalInfo", {
                    ...formData.personalInfo,
                    occupation: e.target.value,
                  })
                }
                placeholder="Software Engineer"
                className={`h-12 text-lg font-medium border-2 ${
                  getError("personalInfo.occupation") ? "border-red-500 focus:border-red-500 ring-red-200" : "border-gray-200 focus:border-emerald-500 focus:ring-emerald-200"
                }`}
                aria-invalid={!!getError("personalInfo.occupation")}
                aria-describedby={getError("personalInfo.occupation") ? "occupation-error" : undefined}
              />
              <p className="text-xs text-gray-500">현재 직업을 영문으로 입력</p>
              {getError("personalInfo.occupation") && (
                <p id="occupation-error" className="text-xs text-red-500 mt-1">
                  {getError("personalInfo.occupation")}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 네비게이션 버튼 */}
        <div className="flex justify-between pt-8 border-t border-gray-200">
          <Button onClick={onPrevious} variant="outline" className="px-8 py-4 border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-bold text-lg rounded-2xl transition-all duration-300">
            <ArrowLeft className="w-6 h-6 mr-3" />
            <span>이전</span>
          </Button>

          <Button
            onClick={onNext}
            disabled={!isValid}
            className="px-12 py-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:via-teal-700 hover:to-cyan-700 text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
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
