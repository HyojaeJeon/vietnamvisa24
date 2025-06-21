"use client";

import React from "react";
import PropTypes from "prop-types";
import { Card, CardContent, CardHeader, CardTitle } from "../../src/components/ui/card";
import { Button } from "../../src/components/ui/button";
import { RadioGroup, RadioGroupItem } from "../../src/components/ui/radio-group";
import { Label } from "../../src/components/ui/label";
import { Globe, Clock, ArrowRight, CheckCircle, Star, Zap, Shield, Timer, Plane, Crown, Car, Truck, Users } from "lucide-react";
import { VISA_TYPES, PROCESSING_TYPES, ADDITIONAL_SERVICES, TRANSIT_PEOPLE_COUNT, TRANSIT_VEHICLE_TYPES } from "./types";
import { calculateTotalPrice } from "./utils";

const ServiceSelectionStep = ({ formData, onUpdate, onNext }) => {
  // 가격 계산
  const priceInfo = calculateTotalPrice(formData);

  const handleVisaTypeChange = (value) => {
    onUpdate({
      visaType: value,
      processingType: "", // 비자 타입 변경 시 처리 유형 초기화
    });
  };

  const handleProcessingTypeChange = (value) => {
    onUpdate({ processingType: value });
  };
  const handleVisaDurationChange = (value) => {
    onUpdate({ visaDurationType: value });
  };
  const handleTransitPeopleCountChange = (value) => {
    // 인원수가 변경되면 기존 문서들을 모두 삭제
    const updatedData = {
      transitPeopleCount: value,
      documents: {}, // 문서 초기화
    };

    console.log(`👥 Transit people count changed to ${value}, clearing all documents`);
    onUpdate(updatedData);
  };

  const handleTransitVehicleTypeChange = (value) => {
    onUpdate({ transitVehicleType: value });
  };
  const handleAdditionalServiceToggle = (serviceId) => {
    const currentServices = formData.additionalServices || [];
    const serviceExists = currentServices.includes(serviceId);

    if (serviceExists) {
      // 선택 해제
      onUpdate({
        additionalServices: currentServices.filter((id) => id !== serviceId),
      });
    } else {
      let updatedServices = [...currentServices];

      // 패스트트랙 서비스들 (상호 배타적)
      const fastTrackServices = ["FAST_TRACK_ARRIVAL", "FAST_TRACK_ARRIVAL_PREMIUM"];
      if (fastTrackServices.includes(serviceId)) {
        // 다른 패스트트랙 서비스가 선택되어 있다면 제거
        updatedServices = updatedServices.filter((id) => !fastTrackServices.includes(id));
      }

      // 공항픽업 서비스들 (상호 배타적)
      const pickupServices = ["AIRPORT_PICKUP_SEDAN_DISTRICT1", "AIRPORT_PICKUP_SEDAN_DISTRICT2", "AIRPORT_PICKUP_SUV_DISTRICT1", "AIRPORT_PICKUP_SUV_DISTRICT2"];
      if (pickupServices.includes(serviceId)) {
        // 다른 공항픽업 서비스가 선택되어 있다면 제거
        updatedServices = updatedServices.filter((id) => !pickupServices.includes(id));
      }

      // 새로운 서비스 추가
      updatedServices.push(serviceId);

      onUpdate({
        additionalServices: updatedServices,
      });
    }
  };

  const isValid =
    formData.visaType &&
    formData.visaDurationType &&
    (formData.visaType !== VISA_TYPES.E_VISA_URGENT || formData.processingType) &&
    (formData.visaType !== VISA_TYPES.E_VISA_TRANSIT || (formData.transitPeopleCount && formData.transitVehicleType));
  const visaTypeOptions = [
    {
      id: VISA_TYPES.E_VISA_GENERAL,
      icon: Globe,
      title: "E-VISA(전자비자)",
      subtitle: "일반(4~5일 소요)",
      description: "표준 처리 속도로 안정적인 발급",
      features: ["온라인 신청", "3-4일 처리", "안정적 발급"],
      recommended: true,
      gradient: "from-blue-500 to-indigo-600",
    },
    {
      id: VISA_TYPES.E_VISA_URGENT,
      icon: Zap,
      title: "E-VISA(전자비자)",
      subtitle: "급행",
      description: "빠른 처리가 필요한 경우",
      features: ["온라인 신청", "빠른 처리", "다양한 옵션"],
      recommended: false,
      gradient: "from-orange-500 to-red-600",
    },
    {
      id: VISA_TYPES.E_VISA_TRANSIT,
      icon: Timer,
      title: "목바이 경유 E-VISA(전자비자)",
      subtitle: "당일 발급",
      description: "목바이 경유를 통한 당일 발급",
      features: ["목바이 경유", "당일 발급", "최고 속도"],
      recommended: false,
      gradient: "from-purple-500 to-pink-600",
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
      gradient: "from-red-500 to-red-600",
    },
    {
      id: PROCESSING_TYPES.EXPRESS_2HOUR,
      title: "2시간",
      subtitle: "긴급 처리",
      description: "우선 처리",
      icon: Zap,
      multiplier: "4x",
      gradient: "from-orange-500 to-red-500",
    },
    {
      id: PROCESSING_TYPES.EXPRESS_4HOUR,
      title: "4시간",
      subtitle: "긴급 처리",
      description: "빠른 처리",
      icon: Timer,
      multiplier: "3x",
      gradient: "from-yellow-500 to-orange-500",
    },
    {
      id: PROCESSING_TYPES.EXPRESS_1DAY,
      title: "1일",
      subtitle: "급행",
      description: "당일 처리",
      icon: Clock,
      multiplier: "2.5x",
      gradient: "from-green-500 to-yellow-500",
    },
    {
      id: PROCESSING_TYPES.EXPRESS_2DAY,
      title: "2일",
      subtitle: "급행",
      description: "2일 처리",
      icon: Clock,
      multiplier: "2x",
      gradient: "from-blue-500 to-green-500",
    },
    {
      id: PROCESSING_TYPES.EXPRESS_3DAY,
      title: "3일",
      subtitle: "급행",
      description: "3일 처리",
      icon: Clock,
      multiplier: "3x",
      gradient: "from-blue-500 to-green-500",
    },
  ];

  return (
    <div className="space-y-8">
      {/* 헤더 섹션 */}
      <Card className="overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-white via-slate-50 to-blue-50/30">
        <CardHeader className="relative pb-4 text-white sm:pb-6 md:pb-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 text-center">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 sm:w-16 sm:h-16 md:w-20 md:h-20 sm:mb-3 md:mb-4 bg-white/20 backdrop-blur-sm rounded-2xl sm:rounded-3xl">
              <Globe className="w-6 h-6 text-white sm:w-8 sm:h-8 md:w-10 md:h-10" />
            </div>
            <CardTitle className="mb-1 text-2xl font-bold sm:mb-2 md:mb-3 sm:text-3xl md:text-4xl">베트남 비자 신청</CardTitle>
            <p className="px-2 text-sm text-blue-100 sm:text-lg md:text-xl">간편하고 안전한 온라인 비자 신청 서비스를 경험해보세요</p>
          </div>
        </CardHeader>

        <CardContent className="p-4 space-y-6 sm:p-6 md:p-8 sm:space-y-8 md:space-y-10">
          {/* 비자 종류 선택 */}
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            <div className="text-center">
              <h3 className="mb-1 text-lg font-bold text-gray-800 sm:mb-2 sm:text-xl md:text-2xl">비자 종류 선택</h3>
              <p className="px-2 text-sm text-gray-600 sm:text-base md:text-lg">원하시는 비자 종류를 선택해주세요</p>
            </div>

            <RadioGroup value={formData.visaType || ""} onValueChange={handleVisaTypeChange} className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4">
              {visaTypeOptions.map((visa) => {
                const IconComponent = visa.icon;
                const isSelected = formData.visaType === visa.id;

                return (
                  <div key={visa.id} className="relative">
                    <RadioGroupItem value={visa.id} id={visa.id} className="sr-only peer" />
                    <Label
                      htmlFor={visa.id}
                      className={`
                        relative block p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl border-2 cursor-pointer transition-all duration-300
                        ${isSelected ? "border-blue-500 bg-blue-50 shadow-lg ring-2 ring-blue-200" : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-md"}
                      `}
                    >
                      {visa.recommended && (
                        <div className="absolute -top-1 left-1 sm:left-2">
                          <span className="inline-flex items-center px-1 sm:px-2 py-0.5 text-xs font-semibold text-white bg-gradient-to-r from-orange-500 to-red-500 rounded-full">
                            <Star className="w-2 h-2 mr-0.5" />
                            추천
                          </span>
                        </div>
                      )}

                      <div className="flex flex-col items-center space-y-1 text-center sm:space-y-2">
                        <div
                          className={`
                          flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg sm:rounded-xl transition-colors
                          ${isSelected ? `bg-gradient-to-r ${visa.gradient} text-white` : "bg-gray-100 text-gray-600"}
                        `}
                        >
                          <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                        </div>

                        <div>
                          <h5 className="text-xs sm:text-sm md:text-base font-bold text-gray-800 mb-0.5">{visa.title}</h5>
                          <p className="mb-1 text-xs font-semibold text-blue-600 sm:text-sm">{visa.subtitle}</p>
                          <p className="hidden mb-1 text-xs text-gray-600 sm:block">{visa.description}</p>{" "}
                          <div className="space-y-0.5 hidden md:block">
                            {visa.features.map((feature) => (
                              <div key={feature} className="flex items-center justify-center gap-1 text-xs text-gray-500">
                                <CheckCircle className="w-2 h-2 text-green-500" />
                                <span className="text-xs">{feature}</span>
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
          </div>{" "}
          {/* 비자 기간 타입 선택 (목바이 경유 E-VISA 제외) */}
          {formData.visaType && formData.visaType !== VISA_TYPES.E_VISA_TRANSIT && (
            <div className="space-y-3 sm:space-y-4 md:space-y-6">
              <div className="text-center">
                <h4 className="mb-1 text-lg font-bold text-gray-800 sm:mb-2 sm:text-xl">입국 횟수 선택</h4>
                <p className="px-2 text-sm text-gray-600 sm:text-base">단수 입국 또는 복수 입국을 선택해주세요</p>
              </div>

              <RadioGroup value={formData.visaDurationType || ""} onValueChange={handleVisaDurationChange} className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                <div className="relative">
                  <RadioGroupItem value="SINGLE_90" id="SINGLE_90" className="sr-only peer" />
                  <Label
                    htmlFor="SINGLE_90"
                    className={`
                      relative block p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl border-2 cursor-pointer transition-all duration-300
                      ${formData.visaDurationType === "SINGLE_90" ? "border-green-500 bg-green-50 shadow-lg ring-2 ring-green-200" : "border-gray-200 bg-white hover:border-green-300 hover:shadow-md"}
                    `}
                  >
                    <div className="flex flex-col items-center space-y-2 text-center sm:space-y-3">
                      <div
                        className={`
                        flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl transition-colors
                        ${formData.visaDurationType === "SINGLE_90" ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white" : "bg-gray-100 text-gray-600"}
                      `}
                      >
                        <Globe className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <div>
                        <h5 className="mb-0.5 sm:mb-1 text-sm sm:text-base md:text-lg font-bold text-gray-800">단수 입국 (90일)</h5>
                        <p className="mb-1 text-xs font-semibold text-green-600 sm:mb-2 sm:text-sm">1회 입국 가능</p>
                        <p className="text-xs text-gray-600 sm:text-sm">90일간 1회 입국 후 재입국 불가</p>
                      </div>
                    </div>
                  </Label>
                </div>

                <div className="relative">
                  <RadioGroupItem value="MULTIPLE_90" id="MULTIPLE_90" className="sr-only peer" />
                  <Label
                    htmlFor="MULTIPLE_90"
                    className={`
                      relative block p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl border-2 cursor-pointer transition-all duration-300
                      ${formData.visaDurationType === "MULTIPLE_90" ? "border-blue-500 bg-blue-50 shadow-lg ring-2 ring-blue-200" : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-md"}
                    `}
                  >
                    <div className="absolute -top-1 sm:-top-2 left-2 sm:left-4">
                      <span className="inline-flex items-center px-2 sm:px-3 py-0.5 sm:py-1 text-xs font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full">
                        <Star className="w-2 h-2 mr-1 sm:w-3 sm:h-3" />
                        인기
                      </span>
                    </div>
                    <div className="flex flex-col items-center space-y-2 text-center sm:space-y-3">
                      <div
                        className={`
                        flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl transition-colors
                        ${formData.visaDurationType === "MULTIPLE_90" ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white" : "bg-gray-100 text-gray-600"}
                      `}
                      >
                        <Globe className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <div>
                        <h5 className="mb-0.5 sm:mb-1 text-sm sm:text-base md:text-lg font-bold text-gray-800">복수 입국 (90일)</h5>
                        <p className="mb-1 text-xs font-semibold text-blue-600 sm:mb-2 sm:text-sm">여러 번 입국 가능</p>
                        <p className="text-xs text-gray-600 sm:text-sm">90일간 자유로운 출입국 가능</p>
                      </div>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          )}
          {/* 급행 비자 처리 옵션 */}
          {formData.visaType === VISA_TYPES.E_VISA_URGENT && formData.visaDurationType && (
            <div className="space-y-3 sm:space-y-4 md:space-y-6">
              <div className="text-center">
                <h4 className="mb-1 text-lg font-bold text-gray-800 sm:mb-2 sm:text-xl">처리 속도 선택</h4>
                <p className="px-2 text-sm text-gray-600 sm:text-base">원하시는 처리 속도를 선택해주세요</p>
              </div>

              <RadioGroup value={formData.processingType || ""} onValueChange={handleProcessingTypeChange} className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4">
                {urgentProcessingOptions.map((processing) => {
                  const IconComponent = processing.icon;
                  const isSelected = formData.processingType === processing.id;

                  return (
                    <div key={processing.id} className="relative">
                      <RadioGroupItem value={processing.id} id={processing.id} className="sr-only peer" />
                      <Label
                        htmlFor={processing.id}
                        className={`
                          relative block p-1 sm:p-2 md:p-3 rounded-lg sm:rounded-xl border-2 cursor-pointer transition-all duration-300
                          ${isSelected ? "border-purple-500 bg-purple-50 shadow-lg ring-2 ring-purple-200" : "border-gray-200 bg-white hover:border-purple-300 hover:shadow-md"}
                        `}
                      >
                        <div className="flex flex-col items-center space-y-1 text-center sm:space-y-2">
                          <div
                            className={`
                            flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-lg transition-colors
                            ${isSelected ? `bg-gradient-to-r ${processing.gradient} text-white` : "bg-gray-100 text-gray-600"}
                          `}
                          >
                            <IconComponent className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                          </div>

                          <div>
                            <h5 className="mb-0.5 text-xs sm:text-sm md:text-base font-bold text-gray-800">{processing.title}</h5>
                            <p className="mb-1 text-xs font-semibold text-purple-600 sm:text-sm">{processing.subtitle}</p>
                            <p className="hidden mb-1 text-xs text-gray-600 sm:block">{processing.description}</p>
                            <p className="text-xs font-semibold text-gray-500">요금 {processing.multiplier}</p>
                          </div>
                        </div>
                      </Label>
                    </div>
                  );
                })}
              </RadioGroup>
            </div>
          )}{" "}
          {/* 목바이 경유 E-VISA 추가 옵션 */}
          {formData.visaType === VISA_TYPES.E_VISA_TRANSIT && (
            <div className="space-y-6">
              {/* 입국 횟수 선택 (목바이 경유용) */}
              <div className="space-y-3">
                <div className="text-center">
                  <h4 className="mb-1 text-lg font-bold text-gray-800 sm:mb-2 sm:text-xl">입국 횟수 선택</h4>
                  <p className="px-2 text-sm text-gray-600 sm:text-base">단수 입국 또는 복수 입국을 선택해주세요</p>
                </div>

                <RadioGroup value={formData.visaDurationType || ""} onValueChange={handleVisaDurationChange} className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                  <div className="relative">
                    <RadioGroupItem value="SINGLE_90" id="transit_SINGLE_90" className="sr-only peer" />
                    <Label
                      htmlFor="transit_SINGLE_90"
                      className={`
                        relative block p-3 rounded-lg border-2 cursor-pointer transition-all duration-300
                        ${
                          formData.visaDurationType === "SINGLE_90" ? "border-green-500 bg-green-50 shadow-lg ring-2 ring-green-200" : "border-gray-200 bg-white hover:border-green-300 hover:shadow-md"
                        }
                      `}
                    >
                      <div className="flex flex-col items-center space-y-2 text-center">
                        <div
                          className={`
                          flex items-center justify-center w-10 h-10 rounded-lg transition-colors
                          ${formData.visaDurationType === "SINGLE_90" ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white" : "bg-gray-100 text-gray-600"}
                        `}
                        >
                          <Globe className="w-5 h-5" />
                        </div>
                        <div>
                          <h5 className="text-sm font-bold text-gray-800">단수 입국 (90일)</h5>
                          <p className="text-xs text-green-600">1회 입국 가능</p>
                        </div>
                      </div>
                    </Label>
                  </div>

                  <div className="relative">
                    <RadioGroupItem value="MULTIPLE_90" id="transit_MULTIPLE_90" className="sr-only peer" />
                    <Label
                      htmlFor="transit_MULTIPLE_90"
                      className={`
                        relative block p-3 rounded-lg border-2 cursor-pointer transition-all duration-300
                        ${formData.visaDurationType === "MULTIPLE_90" ? "border-blue-500 bg-blue-50 shadow-lg ring-2 ring-blue-200" : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-md"}
                      `}
                    >
                      <div className="flex flex-col items-center space-y-2 text-center">
                        <div
                          className={`
                          flex items-center justify-center w-10 h-10 rounded-lg transition-colors
                          ${formData.visaDurationType === "MULTIPLE_90" ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white" : "bg-gray-100 text-gray-600"}
                        `}
                        >
                          <Globe className="w-5 h-5" />
                        </div>
                        <div>
                          <h5 className="text-sm font-bold text-gray-800">복수 입국 (90일)</h5>
                          <p className="text-xs text-blue-600">여러 번 입국 가능</p>
                        </div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* 인원수 선택 */}
              {formData.visaDurationType && (
                <div className="space-y-3">
                  <div className="text-center">
                    <h4 className="mb-1 text-lg font-bold text-gray-800 sm:mb-2 sm:text-xl">인원수 선택</h4>
                    <p className="px-2 text-sm text-gray-600 sm:text-base">목바이 경유 서비스 인원수를 선택해주세요</p>
                  </div>

                  <RadioGroup
                    value={formData.transitPeopleCount?.toString() || "1"}
                    onValueChange={(value) => handleTransitPeopleCountChange(parseInt(value))}
                    className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4"
                  >
                    {TRANSIT_PEOPLE_COUNT.map((option) => (
                      <div key={option.value} className="relative">
                        <RadioGroupItem value={option.value.toString()} id={`people_${option.value}`} className="sr-only peer" />
                        <Label
                          htmlFor={`people_${option.value}`}
                          className={`
                            relative block p-3 rounded-lg border-2 cursor-pointer transition-all duration-300
                            ${
                              formData.transitPeopleCount === option.value
                                ? "border-purple-500 bg-purple-50 shadow-lg ring-2 ring-purple-200"
                                : "border-gray-200 bg-white hover:border-purple-300 hover:shadow-md"
                            }
                          `}
                        >
                          <div className="flex flex-col items-center space-y-2 text-center">
                            <div
                              className={`
                              flex items-center justify-center w-10 h-10 rounded-lg transition-colors
                              ${formData.transitPeopleCount === option.value ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white" : "bg-gray-100 text-gray-600"}
                            `}
                            >
                              <Users className="w-5 h-5" />
                            </div>
                            <h5 className="text-sm font-bold text-gray-800">{option.label}</h5>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}

              {/* 차량 선택 */}
              {formData.transitPeopleCount && (
                <div className="space-y-3">
                  <div className="text-center">
                    <h4 className="mb-1 text-lg font-bold text-gray-800 sm:mb-2 sm:text-xl">차량 선택</h4>
                    <p className="px-2 text-sm text-gray-600 sm:text-base">목바이 경유용 차량을 선택해주세요</p>
                  </div>

                  <RadioGroup value={formData.transitVehicleType || ""} onValueChange={handleTransitVehicleTypeChange} className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                    {TRANSIT_VEHICLE_TYPES.map((vehicle) => (
                      <div key={vehicle.id} className="relative">
                        <RadioGroupItem value={vehicle.id} id={vehicle.id} className="sr-only peer" />
                        <Label
                          htmlFor={vehicle.id}
                          className={`
                            relative block p-3 rounded-lg border-2 cursor-pointer transition-all duration-300
                            ${
                              formData.transitVehicleType === vehicle.id
                                ? "border-indigo-500 bg-indigo-50 shadow-lg ring-2 ring-indigo-200"
                                : "border-gray-200 bg-white hover:border-indigo-300 hover:shadow-md"
                            }
                          `}
                        >
                          <div className="flex flex-col items-center space-y-2 text-center">
                            <div
                              className={`
                              flex items-center justify-center w-12 h-12 rounded-lg transition-colors
                              ${formData.transitVehicleType === vehicle.id ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white" : "bg-gray-100 text-gray-600"}
                            `}
                            >
                              <Car className="w-6 h-6" />
                            </div>
                            <div>
                              <h5 className="text-base font-bold text-gray-800">{vehicle.name}</h5>
                              <p className="text-sm text-indigo-600">{vehicle.description}</p>
                              <p className="text-xs text-gray-600">{vehicle.capacity}</p>
                              <p className="text-sm font-semibold text-gray-800">
                                {new Intl.NumberFormat("vi-VN", {
                                  style: "currency",
                                  currency: "VND",
                                  minimumFractionDigits: 0,
                                }).format(vehicle.price)}
                              </p>
                            </div>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}
            </div>
          )}{" "}
          {/* 일반/급행 E-VISA 추가 서비스 */}
          {(formData.visaType === VISA_TYPES.E_VISA_GENERAL || formData.visaType === VISA_TYPES.E_VISA_URGENT) && formData.visaDurationType && (
            <div className="space-y-6">
              <div className="text-center">
                <h4 className="mb-1 text-lg font-bold text-gray-800 sm:mb-2 sm:text-xl">추가 서비스</h4>
                <p className="px-2 text-sm text-gray-600 sm:text-base">원하시는 추가 서비스를 선택해주세요 (선택사항)</p>
              </div>

              {/* 패스트트랙 서비스 (택 1) */}
              <div className="space-y-3">
                <div className="text-center">
                  <h5 className="text-base font-semibold text-gray-700">🛫 공항 패스트트랙 (택 1)</h5>
                  <p className="text-sm text-gray-500">입국 시 빠른 통과를 위한 서비스</p>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  {ADDITIONAL_SERVICES.filter((service) => service.available.includes(formData.visaType) && (service.id === "FAST_TRACK_ARRIVAL" || service.id === "FAST_TRACK_ARRIVAL_PREMIUM")).map(
                    (service) => {
                      const isSelected = formData.additionalServices?.includes(service.id);

                      // 아이콘 컴포넌트 선택
                      let IconComponent;
                      switch (service.icon) {
                        case "Plane":
                          IconComponent = Plane;
                          break;
                        case "Crown":
                          IconComponent = Crown;
                          break;
                        default:
                          IconComponent = Plane;
                      }

                      return (
                        <div key={service.id} className="relative">
                          <Label
                            className={`
                            relative block p-4 rounded-lg border-2 cursor-pointer transition-all duration-300
                            ${isSelected ? "border-blue-500 bg-blue-50 shadow-lg ring-2 ring-blue-200" : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-md"}
                          `}
                            onClick={() => handleAdditionalServiceToggle(service.id)}
                          >
                            <div className="flex items-start space-x-3">
                              <div
                                className={`
                              flex items-center justify-center w-10 h-10 rounded-lg transition-colors flex-shrink-0
                              ${isSelected ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white" : "bg-gray-100 text-gray-600"}
                            `}
                              >
                                <IconComponent className="w-5 h-5" />
                              </div>
                              <div className="flex-1">
                                <h5 className="mb-1 text-sm font-bold text-gray-800">{service.name}</h5>
                                <p className="mb-2 text-xs text-gray-600">{service.description}</p>
                                <p className="text-sm font-semibold text-blue-600">₩{service.price.toLocaleString()}</p>
                              </div>
                              {isSelected && <CheckCircle className="flex-shrink-0 w-5 h-5 text-blue-500" />}
                            </div>
                          </Label>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>

              {/* 공항픽업 서비스 (택 1) */}
              <div className="space-y-3">
                <div className="text-center">
                  <h5 className="text-base font-semibold text-gray-700">🚗 공항 픽업 서비스 (택 1)</h5>
                  <p className="text-sm text-gray-500">공항에서 호텔까지 편리한 이동 서비스</p>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  {ADDITIONAL_SERVICES.filter((service) => service.available.includes(formData.visaType) && service.category === "TRANSPORT").map((service) => {
                    const isSelected = formData.additionalServices?.includes(service.id);

                    // 아이콘 컴포넌트 선택
                    let IconComponent;
                    switch (service.icon) {
                      case "Car":
                        IconComponent = Car;
                        break;
                      case "Truck":
                        IconComponent = Truck;
                        break;
                      default:
                        IconComponent = Car;
                    }

                    return (
                      <div key={service.id} className="relative">
                        <Label
                          className={`
                            relative block p-4 rounded-lg border-2 cursor-pointer transition-all duration-300
                            ${isSelected ? "border-green-500 bg-green-50 shadow-lg ring-2 ring-green-200" : "border-gray-200 bg-white hover:border-green-300 hover:shadow-md"}
                          `}
                          onClick={() => handleAdditionalServiceToggle(service.id)}
                        >
                          <div className="flex items-start space-x-3">
                            <div
                              className={`
                              flex items-center justify-center w-10 h-10 rounded-lg transition-colors flex-shrink-0
                              ${isSelected ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white" : "bg-gray-100 text-gray-600"}
                            `}
                            >
                              <IconComponent className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                              <h5 className="mb-1 text-sm font-bold text-gray-800">{service.name}</h5>
                              <p className="mb-2 text-xs text-gray-600">{service.description}</p>
                              <p className="text-sm font-semibold text-green-600">
                                {new Intl.NumberFormat("ko-KR", {
                                  style: "currency",
                                  currency: "KRW",
                                  minimumFractionDigits: 0,
                                }).format(service.price)}
                              </p>
                            </div>
                            {isSelected && <CheckCircle className="flex-shrink-0 w-5 h-5 text-green-500" />}
                          </div>
                        </Label>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}{" "}
          {/* 예상 결제 금액 */}
          {isValid && (
            <div className="p-3 text-center sm:p-4 md:p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl sm:rounded-2xl">
              <h4 className="mb-2 text-sm font-bold text-gray-800 sm:mb-3 sm:text-base md:text-lg">예상 결제 금액</h4>

              {/* 가격 상세 */}
              <div className="mb-3 space-y-2 text-left">
                {/* 비자 기본 가격 */}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">비자 기본료</span>
                  <span className="font-semibold">{priceInfo.formatted.visaBasePrice}</span>
                </div>

                {/* 차량 추가 비용 (목바이 경유 시) */}
                {formData.visaType === VISA_TYPES.E_VISA_TRANSIT && priceInfo.visa.vehiclePrice > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">차량 추가료</span>
                    <span className="font-semibold">{priceInfo.formatted.visaVehiclePrice}</span>
                  </div>
                )}

                {/* 추가 서비스 */}
                {priceInfo.additionalServices.services.length > 0 && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">추가 서비스</span>
                      <span className="font-semibold">{priceInfo.formatted.additionalServicesPrice}</span>
                    </div>
                    <div className="pl-4 space-y-1">
                      {priceInfo.additionalServices.services.map((service) => (
                        <div key={service.id} className="flex justify-between text-xs text-gray-500">
                          <span>• {service.name}</span>
                          <span>
                            {formData.visaType === VISA_TYPES.E_VISA_TRANSIT
                              ? new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", minimumFractionDigits: 0 }).format(service.price)
                              : new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW", minimumFractionDigits: 0 }).format(service.price)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                <hr className="my-2 border-gray-300" />
              </div>

              {/* 총 금액 */}
              <p className="text-xl font-bold text-blue-600 sm:text-2xl md:text-3xl">{priceInfo.formatted.totalPrice}</p>
              <p className="text-xs text-gray-500 sm:text-sm">{priceInfo.currency === "VND" ? "베트남 동화 원가" : "부가세 포함"}</p>
            </div>
          )}
          {/* 다음 버튼 */}
          <div className="flex justify-center pt-3 sm:pt-4 md:pt-6">
            <Button
              onClick={onNext}
              disabled={!isValid}
              className="px-8 py-3 text-base font-bold text-white transition-all duration-300 transform shadow-2xl sm:px-12 md:px-16 sm:py-4 sm:text-lg md:text-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 rounded-xl sm:rounded-2xl hover:shadow-3xl disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
            >
              <span className="mr-2 sm:mr-3">다음</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
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
    visaDurationType: PropTypes.string,
    transitPeopleCount: PropTypes.number,
    transitVehicleType: PropTypes.string,
    additionalServices: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
};

export default ServiceSelectionStep;
