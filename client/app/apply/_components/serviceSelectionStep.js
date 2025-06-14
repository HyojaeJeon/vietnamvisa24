
"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../src/components/ui/card";
import { Button } from "../../src/components/ui/button";
import { Globe, Plane, Car, Clock, Star, Zap, ArrowRight, Check } from "lucide-react";
import { validateStep, calculateServicePrice, formatCurrency } from "./utils";
import { SERVICE_TYPES, VISA_DURATION_TYPES, PROCESSING_TYPES } from "./types";

const ServiceSelectionStep = ({ formData, onUpdate, onNext }) => {
  const handleInputChange = (field, value) => {
    onUpdate({ [field]: value });
  };

  const isValid = validateStep(1, formData);
  const currentPrice = calculateServicePrice(formData.serviceType, formData.visaDurationType, formData.processingType);

  const serviceTypes = [
    {
      value: SERVICE_TYPES.E_VISA,
      title: "E-Visa",
      subtitle: "온라인 비자 신청",
      description: "온라인으로 간편하게 신청하고 이메일로 받아보세요",
      icon: <Globe className="w-8 h-8" />,
      popular: true,
      bgColor: "from-blue-500 to-cyan-600",
      features: ["온라인 신청", "빠른 처리", "이메일 발급"]
    },
    {
      value: SERVICE_TYPES.ARRIVAL_VISA,
      title: "도착 비자",
      subtitle: "공항에서 발급",
      description: "베트남 공항 도착 시 현장에서 비자를 발급받습니다",
      icon: <Plane className="w-8 h-8" />,
      popular: false,
      bgColor: "from-green-500 to-emerald-600",
      features: ["공항 발급", "현장 처리", "즉시 발급"]
    },
    {
      value: SERVICE_TYPES.VISA_RUN,
      title: "비자런",
      subtitle: "국경 통과 서비스",
      description: "국경을 통과하여 비자를 갱신하는 서비스입니다",
      icon: <Car className="w-8 h-8" />,
      popular: false,
      bgColor: "from-purple-500 to-pink-600",
      features: ["국경 통과", "비자 갱신", "전문 가이드"]
    }
  ];

  const visaDurationTypes = [
    {
      value: VISA_DURATION_TYPES.SINGLE_90,
      title: "90일 단수",
      subtitle: "1회 입국 가능",
      description: "90일간 베트남에 체류할 수 있으며, 1회만 입국 가능합니다",
      popular: true,
      badge: "인기"
    },
    {
      value: VISA_DURATION_TYPES.MULTIPLE_90,
      title: "90일 복수",
      subtitle: "여러 번 입국 가능",
      description: "90일간 여러 번 입출국이 가능한 복수 비자입니다",
      popular: false,
      badge: "추천"
    }
  ];

  const processingTypes = [
    {
      value: PROCESSING_TYPES.STANDARD,
      title: "일반",
      subtitle: "3-5일",
      icon: <Clock className="w-6 h-6" />,
      color: "blue"
    },
    {
      value: PROCESSING_TYPES.EXPRESS,
      title: "급행",
      subtitle: "1-2일",
      icon: <Star className="w-6 h-6" />,
      color: "purple"
    },
    {
      value: PROCESSING_TYPES.URGENT,
      title: "초급행",
      subtitle: "당일",
      icon: <Zap className="w-6 h-6" />,
      color: "red"
    }
  ];

  return (
    <Card className="border-0 shadow-2xl bg-gradient-to-br from-white via-slate-50 to-blue-50/30 overflow-hidden">
      <CardHeader className="pb-8 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white relative">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <CardTitle className="text-3xl font-bold mb-2">서비스 선택</CardTitle>
          <p className="text-blue-100 text-lg">원하시는 서비스와 기본정보를 선택해주세요</p>
        </div>
      </CardHeader>
      
      <CardContent className="p-8 space-y-10">
        {/* 서비스 종류 선택 */}
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">서비스 종류</h3>
            <p className="text-gray-600">원하시는 비자 서비스를 선택해주세요</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {serviceTypes.map((service) => (
              <div
                key={service.value}
                className={`relative group p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                  formData.serviceType === service.value 
                    ? "border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-xl ring-4 ring-blue-200" 
                    : "border-gray-200 hover:border-blue-300 hover:shadow-lg bg-white"
                }`}
                onClick={() => handleInputChange("serviceType", service.value)}
              >
                {service.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-orange-400 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      인기
                    </span>
                  </div>
                )}
                
                <div className={`w-16 h-16 bg-gradient-to-r ${service.bgColor} rounded-2xl flex items-center justify-center text-white mb-4 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                  {service.icon}
                </div>
                
                <div className="text-center space-y-2">
                  <h4 className="text-xl font-bold text-gray-800">{service.title}</h4>
                  <p className="text-blue-600 font-medium">{service.subtitle}</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{service.description}</p>
                  
                  <div className="pt-3 space-y-1">
                    {service.features.map((feature, index) => (
                      <div key={index} className="flex items-center justify-center gap-2 text-sm text-gray-700">
                        <Check className="w-4 h-4 text-green-500" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {formData.serviceType === service.value && (
                  <div className="absolute top-4 right-4">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 비자 유형 선택 */}
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">비자 유형</h3>
            <p className="text-gray-600">체류 기간과 입국 횟수를 선택해주세요</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {visaDurationTypes.map((duration) => (
              <div
                key={duration.value}
                className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                  formData.visaDurationType === duration.value 
                    ? "border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 shadow-xl" 
                    : "border-gray-200 hover:border-purple-300 hover:shadow-lg bg-white"
                }`}
                onClick={() => handleInputChange("visaDurationType", duration.value)}
              >
                {duration.popular && (
                  <div className="absolute -top-3 left-6">
                    <span className="bg-gradient-to-r from-purple-400 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      {duration.badge}
                    </span>
                  </div>
                )}
                
                <div className="space-y-3">
                  <h4 className="text-xl font-bold text-gray-800">{duration.title}</h4>
                  <p className="text-purple-600 font-medium">{duration.subtitle}</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{duration.description}</p>
                </div>
                
                {formData.visaDurationType === duration.value && (
                  <div className="absolute top-4 right-4">
                    <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 처리 속도 선택 */}
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">처리 속도</h3>
            <p className="text-gray-600">비자 처리 속도를 선택해주세요</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {processingTypes.map((processing) => (
              <div
                key={processing.value}
                className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                  formData.processingType === processing.value 
                    ? `border-${processing.color}-500 bg-gradient-to-br from-${processing.color}-50 to-${processing.color}-100 shadow-xl` 
                    : "border-gray-200 hover:border-gray-300 hover:shadow-lg bg-white"
                }`}
                onClick={() => handleInputChange("processingType", processing.value)}
              >
                <div className="text-center space-y-3">
                  <div className={`w-12 h-12 bg-gradient-to-r from-${processing.color}-400 to-${processing.color}-600 rounded-xl flex items-center justify-center text-white mx-auto`}>
                    {processing.icon}
                  </div>
                  <h4 className="text-lg font-bold text-gray-800">{processing.title}</h4>
                  <p className={`text-${processing.color}-600 font-medium`}>{processing.subtitle}</p>
                </div>
                
                {formData.processingType === processing.value && (
                  <div className="absolute top-4 right-4">
                    <div className={`w-6 h-6 bg-${processing.color}-500 rounded-full flex items-center justify-center`}>
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 예상 결제 금액 */}
        <div className="bg-gradient-to-r from-slate-800 via-gray-900 to-slate-800 rounded-3xl p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
          <div className="relative z-10 text-center">
            <h3 className="text-xl font-semibold mb-2">예상 결제 금액</h3>
            <div className="text-5xl font-bold mb-2">{formatCurrency(currentPrice)}</div>
            <p className="text-gray-300">부가세 포함</p>
          </div>
        </div>

        {/* 다음 버튼 */}
        <div className="flex justify-end pt-6">
          <Button
            onClick={onNext}
            disabled={!isValid}
            className="px-12 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
          >
            <span className="mr-3">다음</span>
            <ArrowRight className="w-6 h-6" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceSelectionStep;
