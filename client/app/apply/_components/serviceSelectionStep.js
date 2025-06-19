"use client";

import React from "react";
import PropTypes from "prop-types";
import { Card, CardContent, CardHeader, CardTitle } from "../../src/components/ui/card";
import { Button } from "../../src/components/ui/button";
import { RadioGroup, RadioGroupItem } from "../../src/components/ui/radio-group";
import { Label } from "../../src/components/ui/label";
import { Badge } from "../../src/components/ui/badge";
import { 
  Plane, 
  Calendar, 
  Clock, 
  CheckCircle, 
  ArrowRight, 
  Zap, 
  Shield,
  Star,
  Users
} from "lucide-react";
import { VISA_TYPES, PROCESSING_TYPES } from "./types";
import { calculateTotalPrice, formatCurrency, validateStep } from "./utils";

const ServiceSelectionStep = ({ formData, onUpdate, onNext }) => {
  const handleVisaTypeChange = (value) => {
    onUpdate({ visaType: value });
  };

  const handleProcessingTypeChange = (value) => {
    onUpdate({ processingType: value });
  };

  const handleAdditionalServicesChange = (serviceId, checked) => {
    const currentServices = formData.additionalServices || [];
    const updatedServices = checked
      ? [...currentServices, serviceId]
      : currentServices.filter(id => id !== serviceId);
    onUpdate({ additionalServices: updatedServices });
  };

  const totalPrice = calculateTotalPrice(formData);
  const isValid = validateStep(1, formData);

  return (
    <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-white via-slate-50 to-blue-50/30">
      <CardHeader className="relative pb-4 md:pb-8 text-white bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 flex items-center gap-3 md:gap-4">
          <div className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-white/20 backdrop-blur-sm rounded-xl md:rounded-2xl">
            <Plane className="w-6 h-6 md:w-8 md:h-8 text-white" />
          </div>
          <div className="flex-1">
            <CardTitle className="mb-1 md:mb-2 text-xl md:text-3xl font-bold">
              서비스 선택
            </CardTitle>
            <p className="text-sm md:text-lg text-blue-100">
              원하는 비자 서비스를 선택해주세요
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 md:p-8 space-y-4 md:space-y-8">
        {/* 비자 종류 선택 */}
        <div className="space-y-3 md:space-y-6">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm md:text-base">1</span>
            </div>
            <h3 className="text-lg md:text-2xl font-bold text-gray-800">비자 종류 선택</h3>
          </div>

          <RadioGroup
            value={formData.visaType || ""}
            onValueChange={handleVisaTypeChange}
            className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-6"
          >
            {Object.entries(VISA_TYPES).map(([key, visa]) => (
              <Card 
                key={key} 
                className={`cursor-pointer transition-all duration-300 border-2 hover:shadow-lg ${
                  formData.visaType === key 
                    ? "border-blue-500 bg-blue-50 shadow-md" 
                    : "border-gray-200 hover:border-blue-300"
                }`}
              >
                <CardContent className="p-3 md:p-6">
                  <div className="flex items-start space-x-3 md:space-x-4">
                    <RadioGroupItem value={key} id={key} className="mt-1" />
                    <Label htmlFor={key} className="flex-1 cursor-pointer">
                      <div className="space-y-2 md:space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-base md:text-lg font-bold text-gray-800">{visa.name}</h4>
                          <Badge variant="secondary" className="text-xs md:text-sm font-medium">
                            {formatCurrency(visa.basePrice)}
                          </Badge>
                        </div>
                        <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                          {visa.description}
                        </p>
                        <div className="flex flex-wrap gap-1 md:gap-2">
                          <div className="flex items-center gap-1 text-xs md:text-sm text-gray-500">
                            <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                            <span>{visa.duration}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs md:text-sm text-gray-500">
                            <Users className="w-3 h-3 md:w-4 md:h-4" />
                            <span>{visa.entries}</span>
                          </div>
                        </div>
                        {visa.popular && (
                          <Badge className="w-fit bg-orange-100 text-orange-700 text-xs">
                            <Star className="w-3 h-3 mr-1" />
                            인기
                          </Badge>
                        )}
                      </div>
                    </Label>
                  </div>
                </CardContent>
              </Card>
            ))}
          </RadioGroup>
        </div>

        {/* 처리 속도 선택 */}
        <div className="space-y-3 md:space-y-6">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm md:text-base">2</span>
            </div>
            <h3 className="text-lg md:text-2xl font-bold text-gray-800">처리 속도 선택</h3>
          </div>

          <RadioGroup
            value={formData.processingType || ""}
            onValueChange={handleProcessingTypeChange}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4"
          >
            {Object.entries(PROCESSING_TYPES).map(([key, processing]) => (
              <Card 
                key={key} 
                className={`cursor-pointer transition-all duration-300 border-2 hover:shadow-lg ${
                  formData.processingType === key 
                    ? "border-green-500 bg-green-50 shadow-md" 
                    : "border-gray-200 hover:border-green-300"
                }`}
              >
                <CardContent className="p-3 md:p-5">
                  <div className="flex items-start space-x-2 md:space-x-3">
                    <RadioGroupItem value={key} id={`processing-${key}`} className="mt-1" />
                    <Label htmlFor={`processing-${key}`} className="flex-1 cursor-pointer">
                      <div className="space-y-2 md:space-y-3">
                        <div className="flex items-center gap-2">
                          {processing.icon}
                          <h4 className="text-sm md:text-base font-bold text-gray-800">{processing.name}</h4>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-xs md:text-sm text-gray-600">
                            <Clock className="w-3 h-3 md:w-4 md:h-4" />
                            <span>{processing.duration}</span>
                          </div>
                          <Badge 
                            variant="outline" 
                            className={`text-xs md:text-sm font-medium ${
                              key === 'express' ? 'border-orange-300 text-orange-700' :
                              key === 'urgent' ? 'border-red-300 text-red-700' :
                              'border-green-300 text-green-700'
                            }`}
                          >
                            +{formatCurrency(processing.additionalPrice)}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed">
                          {processing.description}
                        </p>
                        {processing.recommended && (
                          <Badge className="w-fit bg-blue-100 text-blue-700 text-xs">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            추천
                          </Badge>
                        )}
                      </div>
                    </Label>
                  </div>
                </CardContent>
              </Card>
            ))}
          </RadioGroup>
        </div>

        {/* 추가 서비스 선택 */}
        <div className="space-y-3 md:space-y-6">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm md:text-base">3</span>
            </div>
            <h3 className="text-lg md:text-2xl font-bold text-gray-800">추가 서비스 (선택사항)</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {[
              {
                id: "fast-track",
                name: "공항 패스트트랙",
                description: "공항에서 빠른 출입국 심사",
                icon: <Zap className="w-4 h-4 md:w-5 md:h-5 text-yellow-600" />,
                price: 50
              },
              {
                id: "airport-pickup",
                name: "공항 픽업 서비스",
                description: "전용 차량으로 안전한 이동",
                icon: <Shield className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />,
                price: 80
              }
            ].map((service) => (
              <Card 
                key={service.id}
                className={`cursor-pointer transition-all duration-300 border-2 hover:shadow-lg ${
                  (formData.additionalServices || []).includes(service.id)
                    ? "border-purple-500 bg-purple-50 shadow-md" 
                    : "border-gray-200 hover:border-purple-300"
                }`}
                onClick={() => handleAdditionalServicesChange(
                  service.id, 
                  !(formData.additionalServices || []).includes(service.id)
                )}
              >
                <CardContent className="p-3 md:p-4">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={(formData.additionalServices || []).includes(service.id)}
                      onChange={(e) => handleAdditionalServicesChange(service.id, e.target.checked)}
                      className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {service.icon}
                        <h4 className="text-sm md:text-base font-semibold text-gray-800">{service.name}</h4>
                      </div>
                      <p className="text-xs md:text-sm text-gray-600 mb-2">{service.description}</p>
                      <Badge variant="outline" className="text-xs font-medium">
                        +{formatCurrency(service.price)}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* 총 금액 표시 */}
        <Card className="border-2 border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50">
          <CardContent className="p-3 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base md:text-xl font-bold text-gray-800">총 결제 금액</h3>
                <p className="text-xs md:text-sm text-gray-600">선택한 서비스의 총 비용입니다</p>
              </div>
              <div className="text-right">
                <div className="text-xl md:text-3xl font-bold text-emerald-600">
                  {formatCurrency(totalPrice)}
                </div>
                <p className="text-xs md:text-sm text-gray-500">VAT 포함</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 다음 버튼 */}
        <div className="flex justify-end pt-4 md:pt-8 border-t border-gray-200">
          <Button
            onClick={onNext}
            disabled={!isValid}
            className="w-full md:w-auto px-6 md:px-12 py-3 md:py-4 text-base md:text-lg font-bold text-white transition-all duration-300 transform shadow-lg bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 rounded-xl md:rounded-2xl hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
          >
            <span className="mr-2 md:mr-3">다음</span>
            <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

ServiceSelectionStep.propTypes = {
  formData: PropTypes.object.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
};

export default ServiceSelectionStep;