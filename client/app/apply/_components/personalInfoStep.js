"use client";

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Card, CardContent, CardHeader, CardTitle } from "../../src/components/ui/card";
import { Button } from "../../src/components/ui/button";
import { Input } from "../../src/components/ui/input";
import { ArrowRight, ArrowLeft, MapPin, Phone, Mail, AlertCircle, CheckCircle } from "lucide-react";
import { validateStep, validateEmail, validatePhone } from "./utils";

const PersonalInfoStep = ({ formData, onUpdate, onNext, onPrevious }) => {
  const [fieldErrors, setFieldErrors] = useState({});
  const [fieldTouched, setFieldTouched] = useState({});

  const handleInputChange = (field, value) => {
    onUpdate({
      personalInfo: {
        ...formData.personalInfo,
        [field]: value,
      },
    });

    // 실시간 유효성 검사
    validateField(field, value);
    setFieldTouched({ ...fieldTouched, [field]: true });
  };

  const validateField = (field, value) => {
    const errors = { ...fieldErrors };

    switch (field) {
      case "email":
        if (!value) {
          errors.email = "이메일 주소를 입력해주세요.";
        } else if (!validateEmail(value)) {
          errors.email = "올바른 이메일 형식이 아닙니다.";
        } else {
          delete errors.email;
        }
        break;

      case "phone":
        if (!value) {
          errors.phone = "휴대폰 번호를 입력해주세요.";
        } else if (!validatePhone(value)) {
          errors.phone = "올바른 전화번호 형식이 아닙니다. (예: +82-10-1234-5678)";
        } else {
          delete errors.phone;
        }
        break;

      case "address":
        if (!value) {
          errors.address = "주소를 입력해주세요.";
        } else if (value.length < 5) {
          errors.address = "주소를 정확히 입력해주세요.";
        } else {
          delete errors.address;
        }
        break;
      case "phoneOfFriend":
        if (!value) {
          errors.phoneOfFriend = "베트남 현지 연락처를 입력해주세요.";
        } else if (value.length < 8) {
          errors.phoneOfFriend = "올바른 전화번호를 입력해주세요.";
        } else {
          delete errors.phoneOfFriend;
        }
        break;

      case "fullName":
        if (!value) {
          errors.fullName = "한글성명을 입력해주세요.";
        } else if (value.length < 2) {
          errors.fullName = "올바른 성명을 입력해주세요.";
        } else {
          delete errors.fullName;
        }
        break;

      default:
        break;
    }

    setFieldErrors(errors);
  };

  const isValid = validateStep(2, formData) && Object.keys(fieldErrors).length === 0;

  const getFieldValidationState = (field) => {
    const value = formData.personalInfo?.[field] || "";
    const hasError = fieldErrors[field];
    const isTouched = fieldTouched[field];
    const hasValue = value.length > 0;

    if (hasError && isTouched) return "error";
    if (!hasError && hasValue && isTouched) return "success";
    return "default";
  };

  const getInputClassName = (field) => {
    const state = getFieldValidationState(field);
    const baseClasses = "font-medium border-2 transition-all duration-200";

    switch (state) {
      case "error":
        return `${baseClasses} border-red-500 focus:border-red-500 focus:ring-red-200 bg-red-50`;
      case "success":
        return `${baseClasses} border-green-500 focus:border-green-500 focus:ring-green-200 bg-green-50`;
      default:
        return `${baseClasses} border-gray-200 focus:border-emerald-500 focus:ring-emerald-200`;
    }
  };

  return (
    <Card className="overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-white via-slate-50 to-blue-50/30">
      <CardHeader className="relative pb-4 md:pb-8 text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 text-center">
          <div className="flex items-center justify-center w-12 h-12 md:w-20 md:h-20 mx-auto mb-2 md:mb-4 bg-white/20 backdrop-blur-sm rounded-2xl md:rounded-3xl">
            <Mail className="w-6 h-6 md:w-10 md:h-10 text-white" />
          </div>
          <CardTitle className="mb-2 md:mb-3 text-2xl md:text-4xl font-bold">신청자 기본 정보</CardTitle>
          <p className="text-sm md:text-xl text-emerald-100">정확한 연락처 정보를 입력해주세요</p>
        </div>
      </CardHeader>

      <CardContent className="p-4 md:p-8 space-y-4 md:space-y-8">
        {/* 연락처 정보 섹션 */}
        <div className="space-y-3 md:space-y-6">
          <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-6">
            <div className="flex items-center justify-center w-8 h-8 md:w-12 md:h-12 bg-blue-100 rounded-xl md:rounded-2xl">
              <Phone className="w-4 h-4 md:w-6 md:h-6 text-blue-600" />
            </div>
            <h3 className="text-lg md:text-2xl font-bold text-gray-800">연락처 정보</h3>
          </div>{" "}
          <div className="grid grid-cols-1 gap-4 md:gap-6 sm:grid-cols-1 lg:grid-cols-2">
            {/* 한글성명 */}
            <div className="space-y-2 md:space-y-3 lg:col-span-2">
              <label htmlFor="fullName" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm font-bold tracking-wide text-gray-800 uppercase">
                <Mail className="w-3 h-3 md:w-4 md:h-4 text-indigo-500" />
                한글성명
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute w-4 h-4 md:w-5 md:h-5 text-gray-400 transform -translate-y-1/2 left-2 md:left-3 top-1/2" />
                <Input
                  id="fullName"
                  type="text"
                  value={formData.personalInfo?.fullName || ""}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  onBlur={() => setFieldTouched({ ...fieldTouched, fullName: true })}
                  placeholder="홍길동"
                  className={`${getInputClassName("fullName")} pl-8 md:pl-10 h-10 md:h-12 text-sm md:text-lg`}
                  aria-invalid={!!fieldErrors.fullName}
                  aria-describedby={fieldErrors.fullName ? "fullName-error" : undefined}
                />
                {getFieldValidationState("fullName") === "success" && <CheckCircle className="absolute w-4 h-4 md:w-5 md:h-5 text-green-500 transform -translate-y-1/2 right-2 md:right-3 top-1/2" />}
                {getFieldValidationState("fullName") === "error" && <AlertCircle className="absolute w-4 h-4 md:w-5 md:h-5 text-red-500 transform -translate-y-1/2 right-2 md:right-3 top-1/2" />}
              </div>
              <p className="text-xs text-gray-500">여권상의 한글이름을 정확히 입력해주세요</p>
              {fieldErrors.fullName && fieldTouched.fullName && (
                <p id="fullName-error" className="flex items-center gap-1 mt-1 text-xs md:text-sm text-red-500">
                  <AlertCircle className="w-3 h-3 md:w-4 md:h-4" />
                  {fieldErrors.fullName}
                </p>
              )}
            </div>

            {/* 이메일 */}
            <div className="space-y-2 md:space-y-3">
              <label htmlFor="email" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm font-bold tracking-wide text-gray-800 uppercase">
                <Mail className="w-3 h-3 md:w-4 md:h-4 text-blue-500" />
                이메일 주소
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute w-4 h-4 md:w-5 md:h-5 text-gray-400 transform -translate-y-1/2 left-2 md:left-3 top-1/2" />
                <Input
                  id="email"
                  type="email"
                  value={formData.personalInfo?.email || ""}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  onBlur={() => setFieldTouched({ ...fieldTouched, email: true })}
                  placeholder="example@email.com"
                  className={`${getInputClassName("email")} pl-8 md:pl-10 h-10 md:h-12 text-sm md:text-lg`}
                  aria-invalid={!!fieldErrors.email}
                  aria-describedby={fieldErrors.email ? "email-error" : undefined}
                />
                {getFieldValidationState("email") === "success" && <CheckCircle className="absolute w-4 h-4 md:w-5 md:h-5 text-green-500 transform -translate-y-1/2 right-2 md:right-3 top-1/2" />}
                {getFieldValidationState("email") === "error" && <AlertCircle className="absolute w-4 h-4 md:w-5 md:h-5 text-red-500 transform -translate-y-1/2 right-2 md:right-3 top-1/2" />}
              </div>
              <p className="text-xs text-gray-500">비자 승인서를 받을 이메일 주소</p>
              {fieldErrors.email && fieldTouched.email && (
                <p id="email-error" className="flex items-center gap-1 mt-1 text-xs md:text-sm text-red-500">
                  <AlertCircle className="w-3 h-3 md:w-4 md:h-4" />
                  {fieldErrors.email}
                </p>
              )}
            </div>

            {/* 휴대폰 번호 */}
            <div className="space-y-2 md:space-y-3">
              <label htmlFor="phone" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm font-bold tracking-wide text-gray-800 uppercase">
                <Phone className="w-3 h-3 md:w-4 md:h-4 text-green-500" />
                휴대폰 번호
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute w-4 h-4 md:w-5 md:h-5 text-gray-400 transform -translate-y-1/2 left-2 md:left-3 top-1/2" />
                <Input
                  id="phone"
                  type="tel"
                  value={formData.personalInfo?.phone || ""}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  onBlur={() => setFieldTouched({ ...fieldTouched, phone: true })}
                  placeholder="+82-10-1234-5678"
                  className={`${getInputClassName("phone")} pl-8 md:pl-10 h-10 md:h-12 text-sm md:text-lg`}
                  aria-invalid={!!fieldErrors.phone}
                  aria-describedby={fieldErrors.phone ? "phone-error" : undefined}
                />
                {getFieldValidationState("phone") === "success" && <CheckCircle className="absolute w-4 h-4 md:w-5 md:h-5 text-green-500 transform -translate-y-1/2 right-2 md:right-3 top-1/2" />}
                {getFieldValidationState("phone") === "error" && <AlertCircle className="absolute w-4 h-4 md:w-5 md:h-5 text-red-500 transform -translate-y-1/2 right-2 md:right-3 top-1/2" />}
              </div>
              <p className="text-xs text-gray-500">국가코드를 포함한 전체 번호</p>
              {fieldErrors.phone && fieldTouched.phone && (
                <p id="phone-error" className="flex items-center gap-1 mt-1 text-xs md:text-sm text-red-500">
                  <AlertCircle className="w-3 h-3 md:w-4 md:h-4" />
                  {fieldErrors.phone}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 주소 정보 섹션 */}
        <div className="space-y-3 md:space-y-6">
          <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-6">
            <div className="flex items-center justify-center w-8 h-8 md:w-12 md:h-12 bg-purple-100 rounded-xl md:rounded-2xl">
              <MapPin className="w-4 h-4 md:w-6 md:h-6 text-purple-600" />
            </div>
            <h3 className="text-lg md:text-2xl font-bold text-gray-800">주소 정보</h3>
          </div>

          <div className="grid grid-cols-1 gap-4 md:gap-6">
            {/* 현재 거주 주소 */}
            <div className="space-y-2 md:space-y-3">
              <label htmlFor="address" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm font-bold tracking-wide text-gray-800 uppercase">
                <MapPin className="w-3 h-3 md:w-4 md:h-4 text-purple-500" />
                한국 주소 (영문)
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="absolute w-4 h-4 md:w-5 md:h-5 text-gray-400 transform -translate-y-1/2 left-2 md:left-3 top-1/2" />
                <Input
                  id="address"
                  value={formData.personalInfo?.address || ""}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  onBlur={() => setFieldTouched({ ...fieldTouched, address: true })}
                  placeholder="예) SEOUL GANGNAM SEOCHO"
                  className={`${getInputClassName("address")} pl-8 md:pl-10 h-10 md:h-12 text-sm md:text-lg`}
                  aria-invalid={!!fieldErrors.address}
                  aria-describedby={fieldErrors.address ? "address-error" : undefined}
                />
                {getFieldValidationState("address") === "success" && <CheckCircle className="absolute w-4 h-4 md:w-5 md:h-5 text-green-500 transform -translate-y-1/2 right-2 md:right-3 top-1/2" />}
                {getFieldValidationState("address") === "error" && <AlertCircle className="absolute w-4 h-4 md:w-5 md:h-5 text-red-500 transform -translate-y-1/2 right-2 md:right-3 top-1/2" />}
              </div>
              <p className="text-xs text-gray-500">시, 도, 동까지만 기재하셔도 됩니다</p>
              {fieldErrors.address && fieldTouched.address && (
                <p id="address-error" className="flex items-center gap-1 mt-1 text-xs md:text-sm text-red-500">
                  <AlertCircle className="w-3 h-3 md:w-4 md:h-4" />
                  {fieldErrors.address}
                </p>
              )}
            </div>

            {/* 현지 지인이나 가족 전화번호 */}
            <div className="space-y-2 md:space-y-3">
              <label htmlFor="phoneOfFriend" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm font-bold tracking-wide text-gray-800 uppercase">
                <Phone className="w-3 h-3 md:w-4 md:h-4 text-orange-500" />
                베트남 현지 연락처
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute w-4 h-4 md:w-5 md:h-5 text-gray-400 transform -translate-y-1/2 left-2 md:left-3 top-1/2" />
                <Input
                  id="phoneOfFriend"
                  value={formData.personalInfo?.phoneOfFriend || ""}
                  onChange={(e) => handleInputChange("phoneOfFriend", e.target.value)}
                  onBlur={() => setFieldTouched({ ...fieldTouched, phoneOfFriend: true })}
                  placeholder="예) 093-711-1234"
                  className={`${getInputClassName("phoneOfFriend")} pl-8 md:pl-10 h-10 md:h-12 text-sm md:text-lg`}
                  aria-invalid={!!fieldErrors.phoneOfFriend}
                  aria-describedby={fieldErrors.phoneOfFriend ? "phoneOfFriend-error" : undefined}
                />
                {getFieldValidationState("phoneOfFriend") === "success" && (
                  <CheckCircle className="absolute w-4 h-4 md:w-5 md:h-5 text-green-500 transform -translate-y-1/2 right-2 md:right-3 top-1/2" />
                )}
                {getFieldValidationState("phoneOfFriend") === "error" && <AlertCircle className="absolute w-4 h-4 md:w-5 md:h-5 text-red-500 transform -translate-y-1/2 right-2 md:right-3 top-1/2" />}
              </div>
              <p className="text-xs text-gray-500">정확하지 않아도 괜찮으며 대략적인 번호로 기입 가능합니다</p>
              {fieldErrors.phoneOfFriend && fieldTouched.phoneOfFriend && (
                <p id="phoneOfFriend-error" className="flex items-center gap-1 mt-1 text-xs md:text-sm text-red-500">
                  <AlertCircle className="w-3 h-3 md:w-4 md:h-4" />
                  {fieldErrors.phoneOfFriend}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 네비게이션 버튼 */}
        <div className="flex flex-col gap-3 md:gap-4 pt-4 md:pt-8 border-t border-gray-200 sm:flex-row sm:justify-between">
          <Button
            onClick={onPrevious}
            variant="outline"
            className="px-6 md:px-8 py-3 md:py-4 text-sm md:text-lg font-bold text-gray-700 transition-all duration-300 border-2 border-gray-300 hover:border-gray-400 rounded-xl md:rounded-2xl order-2 sm:order-1"
          >
            <ArrowLeft className="w-4 h-4 md:w-6 md:h-6 mr-2 md:mr-3" />
            <span>이전</span>
          </Button>

          <Button
            onClick={onNext}
            disabled={!isValid}
            className="px-8 md:px-12 py-3 md:py-4 text-sm md:text-lg font-bold text-white transition-all duration-300 transform shadow-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:via-teal-700 hover:to-cyan-700 rounded-xl md:rounded-2xl hover:shadow-3xl disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 order-1 sm:order-2"
          >
            <span className="mr-2 md:mr-3">다음</span>
            <ArrowRight className="w-4 h-4 md:w-6 md:h-6" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

PersonalInfoStep.propTypes = {
  formData: PropTypes.shape({
    personalInfo: PropTypes.shape({
      fullName: PropTypes.string,
      email: PropTypes.string,
      phone: PropTypes.string,
      address: PropTypes.string,
      phoneOfFriend: PropTypes.string,
    }),
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  onPrevious: PropTypes.func.isRequired,
};

export default PersonalInfoStep;
