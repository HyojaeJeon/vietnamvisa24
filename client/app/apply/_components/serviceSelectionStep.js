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
  Plane,
  Car,
  Clock,
  ArrowRight,
  CheckCircle,
  Star,
  Zap,
  Shield,
  Users,
} from "lucide-react";
import { validateStep } from "./utils";

const ServiceSelectionStep = ({ formData, onUpdate, onNext }) => {
  const handleServiceChange = (field, value) => {
    onUpdate({ [field]: value });
  };

  const isValid = validateStep(1, formData);

  const serviceTypes = [
    {
      id: "e_visa",
      icon: Globe,
      title: "E-Visa",
      subtitle: "온라인 비자 신청",
      description: "간편하고 빠른 온라인 신청",
      features: ["온라인 완료", "24시간 접수", "빠른 처리"],
      recommended: true,
    },
    {
      id: "arrival_visa",
      icon: Plane,
      title: "도착 비자",
      subtitle: "공항에서 발급",
      description: "공항 도착 후 현장 발급",
      features: ["현장 발급", "즉시 처리", "공항 서비스"],
      recommended: false,
    },
    {
      id: "visa_run",
      icon: Car,
      title: "비자런",
      subtitle: "국경 통과 서비스",
      description: "국경을 통한 비자 연장",
      features: ["국경 통과", "연장 서비스", "전문 가이드"],
      recommended: false,
    },
  ];

  const visaDurationTypes = [
    {
      id: "single_90",
      title: "90일 단수",
      subtitle: "1회 입국 가능",
      description: "90일간 1회 입국",
      popular: true,
      price: "25,000원~",
    },
    {
      id: "multiple_90",
      title: "90일 복수",
      subtitle: "여러 번 입국 가능",
      description: "90일간 무제한 입출국",
      popular: false,
      price: "35,000원~",
    },
  ];

  const processingTypes = [
    {
      id: "standard",
      icon: Clock,
      title: "일반",
      subtitle: "3-5일",
      description: "일반적인 처리 속도",
      multiplier: "1x",
    },
    {
      id: "express",
      icon: Zap,
      title: "급행",
      subtitle: "1-2일",
      description: "빠른 처리",
      multiplier: "1.5x",
    },
    {
      id: "urgent",
      icon: Shield,
      title: "초급행",
      subtitle: "당일",
      description: "최우선 처리",
      multiplier: "2x",
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
          {/* 서비스 종류 선택 */}
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="mb-2 text-2xl font-bold text-gray-800">
                서비스 선택
              </h3>
              <p className="text-lg text-gray-600">
                원하시는 서비스와 기본정보를 선택해주세요
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-bold text-gray-700">서비스 종류</h4>
              <RadioGroup
                value={formData.serviceType || ""}
                onValueChange={(value) =>
                  handleServiceChange("serviceType", value)
                }
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
              >
                {serviceTypes.map((service) => {
                  const IconComponent = service.icon;
                  const isSelected = formData.serviceType === service.id;

                  return (
                    <div key={service.id} className="relative">
                      <RadioGroupItem
                        value={service.id}
                        id={service.id}
                        className="sr-only peer"
                      />
                      <Label
                        htmlFor={service.id}
                        className={`
                          relative block p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 
                          ${
                            isSelected
                              ? "border-blue-500 bg-blue-50 shadow-lg ring-2 ring-blue-200"
                              : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-md"
                          }
                        `}
                      >
                        {service.recommended && (
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
                            ${isSelected ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-600"}
                          `}
                          >
                            <IconComponent className="w-8 h-8" />
                          </div>

                          <div>
                            <div className="flex items-center justify-center gap-2 mb-1">
                              <span className="text-xl font-bold text-gray-800">
                                {service.icon === Globe
                                  ? "🌐"
                                  : service.icon === Plane
                                    ? "✈️"
                                    : "🚗"}
                              </span>
                              <h5 className="text-lg font-bold text-gray-800">
                                {service.title}
                              </h5>
                            </div>
                            <p className="mb-2 text-sm font-semibold text-blue-600">
                              {service.subtitle}
                            </p>
                            <p className="mb-3 text-sm text-gray-600">
                              {service.description}
                            </p>

                            <div className="space-y-1">
                              {service.features.map((feature, index) => (
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
          </div>

          {/* 비자 유형 선택 */}
          {formData.serviceType === "e_visa" && (
            <div className="space-y-6">
              <h4 className="text-lg font-bold text-gray-700">비자 유형</h4>
              <RadioGroup
                value={formData.visaDurationType || ""}
                onValueChange={(value) =>
                  handleServiceChange("visaDurationType", value)
                }
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
              >
                {visaDurationTypes.map((duration) => {
                  const isSelected = formData.visaDurationType === duration.id;

                  return (
                    <div key={duration.id} className="relative">
                      <RadioGroupItem
                        value={duration.id}
                        id={duration.id}
                        className="sr-only peer"
                      />
                      <Label
                        htmlFor={duration.id}
                        className={`
                          relative block p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300
                          ${
                            isSelected
                              ? "border-emerald-500 bg-emerald-50 shadow-lg ring-2 ring-emerald-200"
                              : "border-gray-200 bg-white hover:border-emerald-300 hover:shadow-md"
                          }
                        `}
                      >
                        {duration.popular && (
                          <div className="absolute -top-2 left-4">
                            <span className="inline-flex items-center px-3 py-1 text-xs font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full">
                              인기
                            </span>
                          </div>
                        )}

                        <div className="text-center space-y-3">
                          <div>
                            <h5 className="mb-1 text-xl font-bold text-gray-800">
                              {duration.title}
                            </h5>
                            <p className="mb-2 text-sm font-semibold text-emerald-600">
                              {duration.subtitle}
                            </p>
                            <p className="mb-3 text-sm text-gray-600">
                              {duration.description}
                            </p>
                            <p className="text-lg font-bold text-blue-600">
                              {duration.price}
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

          {/* 처리 속도 선택 */}
          {formData.serviceType && (
            <div className="space-y-6">
              <h4 className="text-lg font-bold text-gray-700">처리 속도</h4>
              <RadioGroup
                value={formData.processingType || ""}
                onValueChange={(value) =>
                  handleServiceChange("processingType", value)
                }
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
              >
                {processingTypes.map((processing) => {
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
                            ${isSelected ? "bg-purple-500 text-white" : "bg-gray-100 text-gray-600"}
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
              <p className="text-3xl font-bold text-blue-600">0₩</p>
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
    serviceType: PropTypes.string,
    visaDurationType: PropTypes.string,
    processingType: PropTypes.string,
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
};

export default ServiceSelectionStep;