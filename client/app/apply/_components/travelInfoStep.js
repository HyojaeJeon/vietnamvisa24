"use client";

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Card, CardContent, CardHeader, CardTitle } from "../../src/components/ui/card";
import { Button } from "../../src/components/ui/button";
import { Input } from "../../src/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../src/components/ui/select";
import { ArrowRight, ArrowLeft, Calendar, MapPin, Plane, AlertCircle, CheckCircle } from "lucide-react";
import { validateStep } from "./utils";

const TravelInfoStep = ({ formData, onUpdate, onNext, onPrevious }) => {
  const [fieldErrors, setFieldErrors] = useState({});
  const [fieldTouched, setFieldTouched] = useState({});

  const handleInputChange = (field, value) => {
    onUpdate({
      travelInfo: {
        ...formData.travelInfo,
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
      case "entryDate":
        if (!value) {
          errors.entryDate = "입국 예정일을 선택해주세요.";
        } else {
          const selectedDate = new Date(value);
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          if (selectedDate < today) {
            errors.entryDate = "입국 예정일은 오늘 이후여야 합니다.";
          } else {
            delete errors.entryDate;
          }
        }
        break;

      case "entryPort":
        if (!value) {
          errors.entryPort = "입국 공항을 선택해주세요.";
        } else {
          delete errors.entryPort;
        }
        break;

      default:
        break;
    }

    setFieldErrors(errors);
  };

  const isValid = validateStep(3, formData) && Object.keys(fieldErrors).length === 0;

  const getFieldValidationState = (field) => {
    const value = formData.travelInfo?.[field] || "";
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
        return `${baseClasses} border-gray-200 focus:border-purple-500 focus:ring-purple-200`;
    }
  };

  // 베트남 주요 공항 목록
  const vietnamAirports = [
    { code: "SGN", name: "호치민시 (탄손낫 국제공항)", city: "호치민시" },
    { code: "HAN", name: "하노이 (노이바이 국제공항)", city: "하노이" },
    { code: "DAD", name: "다낭 (다낭 국제공항)", city: "다낭" },
    { code: "CXR", name: "캄란 (캄란 국제공항)", city: "나트랑" },
    { code: "PQC", name: "푸꾸옥 (푸꾸옥 국제공항)", city: "푸꾸옥" },
    { code: "VCA", name: "깐터 (깐터 국제공항)", city: "깐터" },
    { code: "UIH", name: "꽈이논 (푸바이 국제공항)", city: "후에" },
    { code: "HPH", name: "하이퐁 (깟비 국제공항)", city: "하이퐁" },
  ];

  return (
    <Card className="overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-white via-slate-50 to-blue-50/30">
      <CardHeader className="relative pb-4 md:pb-8 text-white bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 text-center">
          <div className="flex items-center justify-center w-12 h-12 md:w-20 md:h-20 mx-auto mb-2 md:mb-4 bg-white/20 backdrop-blur-sm rounded-2xl md:rounded-3xl">
            <Plane className="w-6 h-6 md:w-10 md:h-10 text-white" />
          </div>
          <CardTitle className="mb-2 md:mb-3 text-2xl md:text-4xl font-bold">여행 정보</CardTitle>
          <p className="text-sm md:text-xl text-purple-100">베트남 방문 계획을 알려주세요</p>
        </div>
      </CardHeader>

      <CardContent className="p-4 md:p-8 space-y-4 md:space-y-8">
        {/* 입국 정보 섹션 */}
        <div className="space-y-3 md:space-y-6">
          <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-6">
            <div className="flex items-center justify-center w-8 h-8 md:w-12 md:h-12 bg-blue-100 rounded-xl md:rounded-2xl">
              <Calendar className="w-4 h-4 md:w-6 md:h-6 text-blue-600" />
            </div>
            <h3 className="text-lg md:text-2xl font-bold text-gray-800">입국 정보</h3>
          </div>

          <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-2">
            {/* 입국 예정일 */}
            <div className="space-y-2 md:space-y-3">
              <label htmlFor="entryDate" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm font-bold tracking-wide text-gray-800 uppercase">
                <Calendar className="w-3 h-3 md:w-4 md:h-4 text-blue-500" />
                입국 예정일 
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute w-4 h-4 md:w-5 md:h-5 text-gray-400 transform -translate-y-1/2 left-2 md:left-3 top-1/2" />
                <Input
                  id="entryDate"
                  type="date"
                  value={formData.travelInfo?.entryDate || ""}
                  onChange={(e) => handleInputChange("entryDate", e.target.value)}
                  onBlur={() => setFieldTouched({ ...fieldTouched, entryDate: true })}
                  className={`${getInputClassName("entryDate")} pl-8 md:pl-10 h-10 md:h-12 text-sm md:text-lg`}
                  min={new Date().toISOString().split('T')[0]}
                  aria-invalid={!!fieldErrors.entryDate}
                  aria-describedby={fieldErrors.entryDate ? "entryDate-error" : undefined}
                />
                {getFieldValidationState("entryDate") === "success" && (
                  <CheckCircle className="absolute w-4 h-4 md:w-5 md:h-5 text-green-500 transform -translate-y-1/2 right-2 md:right-3 top-1/2" />
                )}
                {getFieldValidationState("entryDate") === "error" && (
                  <AlertCircle className="absolute w-4 h-4 md:w-5 md:h-5 text-red-500 transform -translate-y-1/2 right-2 md:right-3 top-1/2" />
                )}
              </div>
              <p className="text-xs text-gray-500">비자 신청 후 최소 3일 이후 날짜를 선택해주세요</p>
              {fieldErrors.entryDate && fieldTouched.entryDate && (
                <p id="entryDate-error" className="flex items-center gap-1 mt-1 text-xs md:text-sm text-red-500">
                  <AlertCircle className="w-3 h-3 md:w-4 md:h-4" />
                  {fieldErrors.entryDate}
                </p>
              )}
            </div>

            {/* 입국 공항 */}
            <div className="space-y-2 md:space-y-3">
              <label htmlFor="entryPort" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm font-bold tracking-wide text-gray-800 uppercase">
                <MapPin className="w-3 h-3 md:w-4 md:h-4 text-purple-500" />
                입국 공항 
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="absolute w-4 h-4 md:w-5 md:h-5 text-gray-400 transform -translate-y-1/2 left-2 md:left-3 top-1/2 z-10" />
                <Select
                  value={formData.travelInfo?.entryPort || ""}
                  onValueChange={(value) => handleInputChange("entryPort", value)}
                >
                  <SelectTrigger 
                    className={`${getInputClassName("entryPort")} pl-8 md:pl-10 h-10 md:h-12 text-sm md:text-lg`}
                    aria-invalid={!!fieldErrors.entryPort}
                    aria-describedby={fieldErrors.entryPort ? "entryPort-error" : undefined}
                  >
                    <SelectValue placeholder="입국할 공항을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {vietnamAirports.map((airport) => (
                      <SelectItem key={airport.code} value={airport.code}>
                        <div className="flex flex-col">
                          <span className="font-medium">{airport.name}</span>
                          <span className="text-sm text-gray-500">{airport.city}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {getFieldValidationState("entryPort") === "success" && (
                  <CheckCircle className="absolute w-4 h-4 md:w-5 md:h-5 text-green-500 transform -translate-y-1/2 right-8 md:right-10 top-1/2 z-10" />
                )}
                {getFieldValidationState("entryPort") === "error" && (
                  <AlertCircle className="absolute w-4 h-4 md:w-5 md:h-5 text-red-500 transform -translate-y-1/2 right-8 md:right-10 top-1/2 z-10" />
                )}
              </div>
              <p className="text-xs text-gray-500">e-Visa는 모든 베트남 국제공항에서 사용 가능합니다</p>
              {fieldErrors.entryPort && fieldTouched.entryPort && (
                <p id="entryPort-error" className="flex items-center gap-1 mt-1 text-xs md:text-sm text-red-500">
                  <AlertCircle className="w-3 h-3 md:w-4 md:h-4" />
                  {fieldErrors.entryPort}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 안내 메시지 */}
        <div className="p-4 md:p-6 border-l-4 border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
          <div className="flex items-start gap-2 md:gap-3">
            <div className="flex items-center justify-center w-6 h-6 md:w-8 md:h-8 bg-blue-100 rounded-full flex-shrink-0">
              <AlertCircle className="w-3 h-3 md:w-5 md:h-5 text-blue-600" />
            </div>
            <div>
              <h4 className="mb-1 md:mb-2 text-sm md:text-base font-bold text-blue-900">중요 안내사항</h4>
              <ul className="space-y-1 text-xs md:text-sm text-blue-800">
                <li>• e-Visa는 입국일로부터 30일간 유효합니다</li>
                <li>• 여권 유효기간이 입국일로부터 최소 6개월 이상 남아있어야 합니다</li>
                <li>• 입국 시 여권과 e-Visa 승인서를 함께 지참해주세요</li>
                <li>• 선택하신 공항에서만 입국이 가능합니다</li>
              </ul>
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
            className="px-8 md:px-12 py-3 md:py-4 text-sm md:text-lg font-bold text-white transition-all duration-300 transform shadow-2xl bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 hover:from-purple-700 hover:via-violet-700 hover:to-indigo-700 rounded-xl md:rounded-2xl hover:shadow-3xl disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 order-1 sm:order-2"
          >
            <span className="mr-2 md:mr-3">다음</span>
            <ArrowRight className="w-4 h-4 md:w-6 md:h-6" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};