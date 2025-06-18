"use client";

import React from "react";
import PropTypes from "prop-types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../src/components/ui/card";
import { Button } from "../../src/components/ui/button";
import {
  RadioGroup,
  RadioGroupItem,
} from "../../src/components/ui/radio-group";
import { Label } from "../../src/components/ui/label";
import {
  Globe,
  Clock,
  ArrowRight,
  CheckCircle,
  Star,
  Zap,
  Shield,
  Timer,
} from "lucide-react";
import { validateStep } from "./utils";
import { VISA_TYPES, PROCESSING_TYPES } from "./types";

const ServiceSelectionStep = ({ formData, onUpdate, onNext }) => {
  const handleVisaTypeChange = (value) => {
    onUpdate({ 
      visaType: value,
      processingType: "" // 비자 타입 변경 시 처리 유형 초기화
    });
  };

  const handleProcessingTypeChange = (value) => {
    onUpdate({ processingType: value });
  };

  const isValid = formData.visaType && 
    (formData.visaType !== VISA_TYPES.E_VISA_URGENT || formData.processingType);

  const visaTypeOptions = [
    {
      id: VISA_TYPES.E_VISA_GENERAL,
      icon: Globe,
      title: "E-VISA(전자비자)",
      subtitle: "일반(3~4일 소요)",
      description: "표준 처리 속도로 안정적인 발급",
      features: ["온라인 신청", "3-4일 처리", "안정적 발급"],
      recommended: true,
      gradient: "from-blue-500 to-indigo-600"
    },
    {
      id: VISA_TYPES.E_VISA_URGENT,
      icon: Zap,
      title: "E-VISA(전자비자)",
      subtitle: "급행",
      description: "빠른 처리가 필요한 경우",
      features: ["온라인 신청", "빠른 처리", "다양한 옵션"],
      recommended: false,
      gradient: "from-orange-500 to-red-600"
    },
    {
      id: VISA_TYPES.E_VISA_TRANSIT,
      icon: Timer,
      title: "목바이 경유 E-VISA(전자비자)",
      subtitle: "당일 발급",
      description: "목바이 경유를 통한 당일 발급",
      features: ["목바이 경유", "당일 발급", "최고 속도"],
      recommended: false,
      gradient: "from-purple-500 to-pink-600"
    },
  ];

  const urgentProcessingOptions = [
    {
      id: PROCESSING_TYPES.EXPRESS_1HOUR,
      title: "1시간",
      subtitle: "긴급 처리",
      description: "최우선 처리",
      icon: Shield,
      multiplier: "5x",
      gradient: "from-red-500 to-red-600"
    },
    {
      id: PROCESSING_TYPES.EXPRESS_2HOUR,
      title: "2시간", 
      subtitle: "긴급 처리",
      description: "우선 처리",
      icon: Zap,
      multiplier: "4x",
      gradient: "from-orange-500 to-red-500"
    },
    {
      id: PROCESSING_TYPES.EXPRESS_4HOUR,
      title: "4시간",
      subtitle: "긴급 처리", 
      description: "빠른 처리",
      icon: Timer,
      multiplier: "3x",
      gradient: "from-yellow-500 to-orange-500"
    },
    {
      id: PROCESSING_TYPES.EXPRESS_1DAY,
      title: "1일",
      subtitle: "급행",
      description: "당일 처리",
      icon: Clock,
      multiplier: "2.5x",
      gradient: "from-green-500 to-yellow-500"
    },
    {
      id: PROCESSING_TYPES.EXPRESS_2DAY,
      title: "2일",
      subtitle: "급행",
      description: "2일 처리", 
      icon: Clock,
      multiplier: "2x",
      gradient: "from-blue-500 to-green-500"
    },
    {
      id: PROCESSING_TYPES.STANDARD,
      title: "3~4일",
      subtitle: "일반 처리",
      description: "표준 처리",
      icon: Clock,
      multiplier: "1x",
      gradient: "from-gray-500 to-blue-500"
    },
  ];

  return (
    <div className="space-y-8">
      {/* 헤더 섹션 */}
      <Card className="overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-white via-slate-50 to-blue-50/30">
        <CardHeader className="relative pb-8 text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 text-center">
            <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 bg-white/20 backdrop-blur-sm rounded-3xl">
              <Globe className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="mb-3 text-4xl font-bold">
              베트남 비자 신청
            </CardTitle>
            <p className="text-xl text-blue-100">
              간편하고 안전한 온라인 비자 신청 서비스를 경험해보세요
            </p>
          </div>
        </CardHeader>

        <CardContent className="p-8 space-y-10">
          {/* 비자 종류 선택 */}
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="mb-2 text-2xl font-bold text-gray-800">
                비자 종류 선택
              </h3>
              <p className="text-lg text-gray-600">
                원하시는 비자 종류를 선택해주세요
              </p>
            </div>

            <RadioGroup
              value={formData.visaType || ""}
              onValueChange={handleVisaTypeChange}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              {visaTypeOptions.map((visa) => {
                const IconComponent = visa.icon;
                const isSelected = formData.visaType === visa.id;

                return (
                  <div key={visa.id} className="relative">
                    <RadioGroupItem
                      value={visa.id}
                      id={visa.id}
                      className="sr-only peer"
                    />
                    <Label
                      htmlFor={visa.id}
                      className={`
                        relative block p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 
                        ${
                          isSelected
                            ? "border-blue-500 bg-blue-50 shadow-lg ring-2 ring-blue-200"
                            : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-md"
                        }
                      `}
                    >
                      {visa.recommended && (
                        <div className="absolute -top-2 left-4">
                          <span className="inline-flex items-center px-3 py-1 text-xs font-semibold text-white bg-gradient-to-r from-orange-500 to-red-500 rounded-full">
                            <Star className="w-3 h-3 mr-1" />
                            추천
                          </span>
                        </div>
                      )}

                      <div className="flex flex-col items-center text-center space-y-3">
                        <div
                          className={`
                          flex items-center justify-center w-16 h-16 rounded-2xl transition-colors
                          ${isSelected ? `bg-gradient-to-r ${visa.gradient} text-white` : "bg-gray-100 text-gray-600"}
                        `}
                        >
                          <IconComponent className="w-8 h-8" />
                        </div>

                        <div>
                          <h5 className="text-lg font-bold text-gray-800 mb-1">
                            {visa.title}
                          </h5>
                          <p className="mb-2 text-sm font-semibold text-blue-600">
                            {visa.subtitle}
                          </p>
                          <p className="mb-3 text-sm text-gray-600">
                            {visa.description}
                          </p>

                          <div className="space-y-1">
                            {visa.features.map((feature, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-center gap-1 text-xs text-gray-500"
                              >
                                <CheckCircle className="w-3 h-3 text-green-500" />
                                <span>{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Label>
                  </div>
                );
              })}
            </RadioGroup>
          </div>

          {/* 급행 비자 처리 옵션 */}
          {formData.visaType === VISA_TYPES.E_VISA_URGENT && (
            <div className="space-y-6">
              <div className="text-center">
                <h4 className="mb-2 text-xl font-bold text-gray-800">
                  처리 속도 선택
                </h4>
                <p className="text-gray-600">
                  원하시는 처리 속도를 선택해주세요
                </p>
              </div>

              <RadioGroup
                value={formData.processingType || ""}
                onValueChange={handleProcessingTypeChange}
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
              >
                {urgentProcessingOptions.map((processing) => {
                  const IconComponent = processing.icon;
                  const isSelected = formData.processingType === processing.id;

                  return (
                    <div key={processing.id} className="relative">
                      <RadioGroupItem
                        value={processing.id}
                        id={processing.id}
                        className="sr-only peer"
                      />
                      <Label
                        htmlFor={processing.id}
                        className={`
                          relative block p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300
                          ${
                            isSelected
                              ? "border-purple-500 bg-purple-50 shadow-lg ring-2 ring-purple-200"
                              : "border-gray-200 bg-white hover:border-purple-300 hover:shadow-md"
                          }
                        `}
                      >
                        <div className="flex flex-col items-center text-center space-y-3">
                          <div
                            className={`
                            flex items-center justify-center w-12 h-12 rounded-xl transition-colors
                            ${isSelected ? `bg-gradient-to-r ${processing.gradient} text-white` : "bg-gray-100 text-gray-600"}
                          `}
                          >
                            <IconComponent className="w-6 h-6" />
                          </div>

                          <div>
                            <h5 className="mb-1 text-lg font-bold text-gray-800">
                              {processing.title}
                            </h5>
                            <p className="mb-2 text-sm font-semibold text-purple-600">
                              {processing.subtitle}
                            </p>
                            <p className="mb-2 text-sm text-gray-600">
                              {processing.description}
                            </p>
                            <p className="text-xs font-semibold text-gray-500">
                              요금 {processing.multiplier}
                            </p>
                          </div>
                        </div>
                      </Label>
                    </div>
                  );
                })}
              </RadioGroup>
            </div>
          )}

          {/* 예상 결제 금액 */}
          {isValid && (
            <div className="p-6 text-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl">
              <h4 className="mb-2 text-lg font-bold text-gray-800">
                예상 결제 금액
              </h4>
              <p className="text-3xl font-bold text-blue-600">계산 중...</p>
              <p className="text-sm text-gray-500">부가세 포함</p>
            </div>
          )}

          {/* 다음 버튼 */}
          <div className="flex justify-center pt-6">
            <Button
              onClick={onNext}
              disabled={!isValid}
              className="px-16 py-4 text-xl font-bold text-white transition-all duration-300 transform shadow-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 rounded-2xl hover:shadow-3xl disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
            >
              <span className="mr-3">다음</span>
              <ArrowRight className="w-6 h-6" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

ServiceSelectionStep.propTypes = {
  formData: PropTypes.shape({
    visaType: PropTypes.string,
    processingType: PropTypes.string,
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
};

export default ServiceSelectionStep;