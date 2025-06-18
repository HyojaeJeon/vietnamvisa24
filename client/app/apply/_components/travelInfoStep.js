
"use client";

import React, { useState } from "react";
import PropTypes from "prop-types";
import { Card, CardContent, CardHeader, CardTitle } from "../../src/components/ui/card";
import { Button } from "../../src/components/ui/button";
import { Input } from "../../src/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../src/components/ui/select";
import { Plane, Calendar, MapPin, ArrowRight, ArrowLeft, AlertCircle, CheckCircle } from "lucide-react";
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
          const entryDate = new Date(value);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          if (entryDate < today) {
            errors.entryDate = "입국 예정일은 오늘 이후 날짜여야 합니다.";
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
    const baseClasses = "h-12 text-lg font-medium border-2 transition-all duration-200";
    
    switch (state) {
      case "error":
        return `${baseClasses} border-red-500 focus:border-red-500 focus:ring-red-200 bg-red-50`;
      case "success":
        return `${baseClasses} border-green-500 focus:border-green-500 focus:ring-green-200 bg-green-50`;
      default:
        return `${baseClasses} border-gray-200 focus:border-indigo-500 focus:ring-indigo-200`;
    }
  };

  const entryPorts = [
    { value: "SGN", label: "호치민시 (탄손낫 국제공항)" },
    { value: "HAN", label: "하노이 (노이바이 국제공항)" },
    { value: "DAD", label: "다낭 (다낭 국제공항)" },
    { value: "CXR", label: "나트랑 (캄란 국제공항)" },
    { value: "PQC", label: "푸꾸옥 (푸꾸옥 국제공항)" },
    { value: "VDO", label: "반돈 (반돈 국제공항)" },
    { value: "HPH", label: "하이퐁 (캇비 국제공항)" },
    { value: "UIH", label: "꾸이년 (꾸이년 공항)" },
    { value: "CAH", label: "까마우 (까마우 공항)" },
  ];

  // 오늘 날짜를 YYYY-MM-DD 형식으로 가져오기
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <Card className="overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-white via-slate-50 to-blue-50/30">
      <CardHeader className="relative pb-8 text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 text-center">
          <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 bg-white/20 backdrop-blur-sm rounded-3xl">
            <Plane className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="mb-3 text-4xl font-bold">여행 정보</CardTitle>
          <p className="text-xl text-indigo-100">베트남 방문 계획을 알려주세요</p>
        </div>
      </CardHeader>

      <CardContent className="p-8 space-y-8">
        {/* 입국 정보 섹션 */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-2xl">
              <Calendar className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">입국 정보</h3>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* 입국 예정일 */}
            <div className="space-y-3">
              <label htmlFor="entryDate" className="block text-sm font-bold tracking-wide text-gray-800 uppercase">
                입국 예정일 *
              </label>
              <div className="relative">
                <Calendar className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                <Input
                  id="entryDate"
                  type="date"
                  value={formData.travelInfo?.entryDate || ""}
                  onChange={(e) => handleInputChange("entryDate", e.target.value)}
                  onBlur={() => setFieldTouched({ ...fieldTouched, entryDate: true })}
                  min={getTodayDate()}
                  className={`${getInputClassName("entryDate")} pl-10`}
                  aria-invalid={!!fieldErrors.entryDate}
                  aria-describedby={fieldErrors.entryDate ? "entryDate-error" : undefined}
                />
                {getFieldValidationState("entryDate") === "success" && (
                  <CheckCircle className="absolute w-5 h-5 text-green-500 transform -translate-y-1/2 right-3 top-1/2" />
                )}
                {getFieldValidationState("entryDate") === "error" && (
                  <AlertCircle className="absolute w-5 h-5 text-red-500 transform -translate-y-1/2 right-3 top-1/2" />
                )}
              </div>
              <p className="text-xs text-gray-500">베트남 입국 예정 날짜를 선택해주세요</p>
              {fieldErrors.entryDate && fieldTouched.entryDate && (
                <p id="entryDate-error" className="flex items-center gap-1 mt-1 text-sm text-red-500">
                  <AlertCircle className="w-4 h-4" />
                  {fieldErrors.entryDate}
                </p>
              )}
            </div>

            {/* 입국 공항 */}
            <div className="space-y-3">
              <label htmlFor="entryPort" className="block text-sm font-bold tracking-wide text-gray-800 uppercase">
                입국 공항 *
              </label>
              <div className="relative">
                <MapPin className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2 z-10" />
                <Select
                  value={formData.travelInfo?.entryPort || ""}
                  onValueChange={(value) => handleInputChange("entryPort", value)}
                >
                  <SelectTrigger 
                    className={`${getInputClassName("entryPort")} pl-10`}
                    onBlur={() => setFieldTouched({ ...fieldTouched, entryPort: true })}
                  >
                    <SelectValue placeholder="입국할 공항을 선택해주세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {entryPorts.map((port) => (
                      <SelectItem key={port.value} value={port.value}>
                        {port.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {getFieldValidationState("entryPort") === "success" && (
                  <CheckCircle className="absolute w-5 h-5 text-green-500 transform -translate-y-1/2 right-10 top-1/2 z-10" />
                )}
                {getFieldValidationState("entryPort") === "error" && (
                  <AlertCircle className="absolute w-5 h-5 text-red-500 transform -translate-y-1/2 right-10 top-1/2 z-10" />
                )}
              </div>
              <p className="text-xs text-gray-500">입국할 베트남 공항을 선택해주세요</p>
              {fieldErrors.entryPort && fieldTouched.entryPort && (
                <p id="entryPort-error" className="flex items-center gap-1 mt-1 text-sm text-red-500">
                  <AlertCircle className="w-4 h-4" />
                  {fieldErrors.entryPort}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 참고 정보 */}
        <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl">
          <h4 className="mb-3 text-lg font-bold text-gray-800">📋 참고 사항</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-blue-500">•</span>
              <span>E-비자는 모든 베트남 공항에서 사용 가능합니다</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500">•</span>
              <span>입국일 기준 최소 3일 전에 신청해주세요</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500">•</span>
              <span>여권 유효기간이 6개월 이상 남아있어야 합니다</span>
            </li>
          </ul>
        </div>

        {/* 네비게이션 버튼 */}
        <div className="flex flex-col gap-4 pt-8 border-t border-gray-200 sm:flex-row sm:justify-between">
          <Button 
            onClick={onPrevious} 
            variant="outline" 
            className="px-8 py-4 text-lg font-bold text-gray-700 transition-all duration-300 border-2 border-gray-300 hover:border-gray-400 rounded-2xl order-2 sm:order-1"
          >
            <ArrowLeft className="w-6 h-6 mr-3" />
            <span>이전</span>
          </Button>

          <Button
            onClick={onNext}
            disabled={!isValid}
            className="px-12 py-4 text-lg font-bold text-white transition-all duration-300 transform shadow-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 rounded-2xl hover:shadow-3xl disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 order-1 sm:order-2"
          >
            <span className="mr-3">다음</span>
            <ArrowRight className="w-6 h-6" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

TravelInfoStep.propTypes = {
  formData: PropTypes.shape({
    travelInfo: PropTypes.shape({
      entryDate: PropTypes.string,
      entryPort: PropTypes.string,
    }),
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  onPrevious: PropTypes.func.isRequired,
};

export default TravelInfoStep;
