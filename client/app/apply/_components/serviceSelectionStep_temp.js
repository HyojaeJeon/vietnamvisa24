"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../src/components/ui/card";
import { Button } from "../../src/components/ui/button";
import { Badge } from "../../src/components/ui/badge";
import { Globe, Clock, Star, Zap, ArrowRight, Check, Plane } from "lucide-react";
import { validateStep, calculateTotalPrice, formatCurrency } from "./utils";
import { VISA_TYPES, PROCESSING_TYPES, ADDITIONAL_SERVICES } from "./types";

const ServiceSelectionStep = ({ formData, onUpdate, onNext }) => {
  const handleVisaTypeChange = (visaType) => {
    onUpdate({
      visaType,
      totalPrice: calculateTotalPrice({
        ...formData,
        visaType,
      }),
    });
  };

  const handleProcessingTypeChange = (processingType) => {
    onUpdate({
      processingType,
      totalPrice: calculateTotalPrice({
        ...formData,
        processingType,
      }),
    });
  };

  const handleAdditionalServiceToggle = (serviceKey, checked) => {
    const newAdditionalServices = checked ? [...(formData.additionalServices || []), serviceKey] : (formData.additionalServices || []).filter((s) => s !== serviceKey);

    onUpdate({
      additionalServices: newAdditionalServices,
      totalPrice: calculateTotalPrice({
        ...formData,
        additionalServices: newAdditionalServices,
      }),
    });
  };

  const isValid = validateStep(1, formData);
  const currentPrice = calculateTotalPrice(formData);

  // 비자 유형 옵션들
  const visaOptions = [
    {
      value: VISA_TYPES.E_VISA_90_SINGLE,
      title: "E-VISA 90일 단수",
      description: "90일간 유효한 단수 입국 전자비자",
      price: 30,
      popular: true,
      icon: <Globe className="w-6 h-6" />,
      features: ["90일 체류", "단수 입국", "온라인 발급"],
    },
    {
      value: VISA_TYPES.E_VISA_90_MULTIPLE,
      title: "E-VISA 90일 복수",
      description: "90일간 유효한 복수 입국 전자비자",
      price: 55,
      popular: false,
      icon: <Globe className="w-6 h-6" />,
      features: ["90일 체류", "복수 입국", "온라인 발급"],
    },
    {
      value: VISA_TYPES.VISA_FREE_45_MOKBAI,
      title: "무비자 45일 + 목바이런",
      description: "45일 무비자 입국 + 목바이런 서비스",
      price: 180,
      popular: false,
      icon: <Plane className="w-6 h-6" />,
      features: ["45일 체류", "무비자 입국", "목바이런 포함"],
    },
    {
      value: VISA_TYPES.E_VISA_90_MOKBAI,
      title: "E-VISA 90일 + 목바이런",
      description: "90일 전자비자 + 목바이런 서비스",
      price: 230,
      popular: false,
      icon: <Globe className="w-6 h-6" />,
      features: ["90일 체류", "비자 + 목바이런", "올인원 서비스"],
    },
  ];

  // 처리 속도 옵션들
  const processingOptions = [
    {
      value: PROCESSING_TYPES.NORMAL,
      title: "일반 처리",
      duration: "4-5일",
      price: 0,
      icon: <Clock className="w-5 h-5" />,
      description: "가장 경제적인 옵션",
    },
    {
      value: PROCESSING_TYPES.URGENT_3DAYS,
      title: "급행 3일",
      duration: "3일",
      price: 20,
      icon: <Zap className="w-5 h-5" />,
      description: "빠른 처리",
    },
    {
      value: PROCESSING_TYPES.URGENT_2DAYS,
      title: "급행 2일",
      duration: "2일",
      price: 35,
      icon: <Zap className="w-5 h-5" />,
      description: "더 빠른 처리",
    },
    {
      value: PROCESSING_TYPES.URGENT_1DAY,
      title: "급행 1일",
      duration: "1일",
      price: 50,
      icon: <Zap className="w-5 h-5" />,
      description: "최우선 처리",
    },
    {
      value: PROCESSING_TYPES.URGENT_4HOURS,
      title: "급행 4시간",
      duration: "4시간",
      price: 80,
      icon: <Star className="w-5 h-5" />,
      description: "초고속 처리",
    },
    {
      value: PROCESSING_TYPES.URGENT_2HOURS,
      title: "급행 2시간",
      duration: "2시간",
      price: 120,
      icon: <Star className="w-5 h-5" />,
      description: "특급 처리",
    },
    {
      value: PROCESSING_TYPES.URGENT_1HOUR,
      title: "급행 1시간",
      duration: "1시간",
      price: 180,
      icon: <Star className="w-5 h-5" />,
      description: "긴급 처리",
    },
  ];

  // 추가 서비스 옵션들
  const additionalServiceOptions = [
    {
      key: ADDITIONAL_SERVICES.FAST_TRACK,
      title: "패스트트랙",
      description: "공항 입출국 우선 통과 서비스",
      price: 25,
    },
    {
      key: ADDITIONAL_SERVICES.AIRPORT_PICKUP,
      title: "공항픽업",
      description: "노이바이/탄손넛 공항 픽업 서비스",
      price: 35,
    },
    {
      key: ADDITIONAL_SERVICES.HOTEL_DELIVERY,
      title: "호텔배송",
      description: "호텔로 직접 서류 배송",
      price: 15,
    },
  ];

  return (
    <Card className="border-0 shadow-2xl bg-gradient-to-br from-white via-slate-50 to-blue-50/30 overflow-hidden">
      <CardHeader className="pb-8 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white relative">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <CardTitle className="text-3xl font-bold mb-2">서비스 선택</CardTitle>
          <p className="text-blue-100 text-lg">비자 유형과 처리 옵션을 선택해주세요</p>
        </div>
      </CardHeader>

      <CardContent className="p-8 space-y-10">
        {/* 비자 유형 선택 */}
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">비자 유형</h3>
            <p className="text-gray-600">원하시는 비자 유형을 선택해주세요</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {visaOptions.map((visa) => (
              <div
                key={visa.value}
                className={`relative group p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                  formData.visaType === visa.value
                    ? "border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-xl ring-4 ring-blue-200"
                    : "border-gray-200 hover:border-blue-300 hover:shadow-lg bg-white"
                }`}
                onClick={() => handleVisaTypeChange(visa.value)}
              >
                {visa.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-orange-400 to-red-500 text-white">인기</Badge>
                  </div>
                )}

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                    {visa.icon}
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-bold text-gray-800">{visa.title}</h4>
                      <span className="text-lg font-bold text-blue-600">${visa.price}</span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{visa.description}</p>

                    <div className="flex flex-wrap gap-2 pt-2">
                      {visa.features.map((feature, index) => (
                        <span key={index} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-700">
                          <Check className="w-3 h-3 text-green-500" />
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {formData.visaType === visa.value && (
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

        {/* 처리 속도 선택 */}
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">처리 속도</h3>
            <p className="text-gray-600">비자 처리 속도를 선택해주세요</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {processingOptions.map((processing) => (
              <div
                key={processing.value}
                className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                  formData.processingType === processing.value
                    ? "border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg"
                    : "border-gray-200 hover:border-purple-300 hover:shadow-md bg-white"
                }`}
                onClick={() => handleProcessingTypeChange(processing.value)}
              >
                <div className="text-center space-y-2">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-600 rounded-lg flex items-center justify-center text-white mx-auto">{processing.icon}</div>
                  <h4 className="text-sm font-bold text-gray-800">{processing.title}</h4>
                  <p className="text-xs text-purple-600 font-medium">{processing.duration}</p>
                  {processing.price > 0 && <p className="text-xs font-bold text-gray-800">+${processing.price}</p>}
                  <p className="text-xs text-gray-500">{processing.description}</p>
                </div>

                {formData.processingType === processing.value && (
                  <div className="absolute top-2 right-2">
                    <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 추가 서비스 선택 */}
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">추가 서비스</h3>
            <p className="text-gray-600">필요한 추가 서비스를 선택해주세요 (선택사항)</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {additionalServiceOptions.map((service) => {
              const isSelected = (formData.additionalServices || []).includes(service.key);
              return (
                <div
                  key={service.key}
                  className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                    isSelected ? "border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg" : "border-gray-200 hover:border-green-300 hover:shadow-md bg-white"
                  }`}
                  onClick={() => handleAdditionalServiceToggle(service.key, !isSelected)}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-gray-800">{service.title}</h4>
                      <span className="text-sm font-bold text-green-600">${service.price}</span>
                    </div>
                    <p className="text-xs text-gray-600">{service.description}</p>
                  </div>

                  <div className="absolute top-2 right-2">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                        isSelected ? "bg-green-500 border-green-500" : "border-gray-300 hover:border-green-400"
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 예상 결제 금액 */}
        <div className="bg-gradient-to-r from-slate-800 via-gray-900 to-slate-800 rounded-3xl p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
          <div className="relative z-10 text-center">
            <h3 className="text-xl font-semibold mb-2">예상 결제 금액</h3>
            <div className="text-4xl font-bold mb-2">{formatCurrency(currentPrice)}</div>
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
