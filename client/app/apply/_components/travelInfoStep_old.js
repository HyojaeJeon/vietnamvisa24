"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../src/components/ui/card";
import { Button } from "../../src/components/ui/button";
import { Input } from "../../src/components/ui/input";
import { Textarea } from "../../src/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../src/components/ui/select";
import { Globe, Calendar, Clock, Star, Shield, ArrowRight, ArrowLeft } from "lucide-react";
import { validateStep, calculateVisaPrice, formatCurrency } from "./utils";
import { VISA_TYPES, PROCESSING_TYPES } from "./types";

const TravelInfoStep = ({ formData, onUpdate, onNext, onPrev }) => {
  const handleInputChange = (field, value) => {
    onUpdate({ [field]: value });
  };

  const isValid = validateStep(3, formData);
  const currentPrice = calculateVisaPrice(formData.visaType, formData.processingType);

  const visaTypes = [
    {
      value: VISA_TYPES.GENERAL,
      label: "일반 관광",
      description: "관광 목적의 일반 비자",
      icon: "🏖️",
    },
    {
      value: VISA_TYPES.BUSINESS,
      label: "비즈니스",
      description: "출장 및 비즈니스 목적",
      icon: "💼",
    },
    {
      value: VISA_TYPES.TOURIST,
      label: "단기 관광",
      description: "단기간 관광 목적",
      icon: "📸",
    },
    {
      value: VISA_TYPES.TRANSIT,
      label: "경유",
      description: "경유 목적의 단기 체류",
      icon: "✈️",
    },
  ];

  const processingTypes = [
    {
      value: PROCESSING_TYPES.STANDARD,
      label: "일반",
      time: "5-7일",
      icon: <Clock className="w-5 h-5" />,
      color: "blue",
    },
    {
      value: PROCESSING_TYPES.EXPRESS,
      label: "급행",
      time: "2-3일",
      icon: <Star className="w-5 h-5" />,
      color: "purple",
    },
    {
      value: PROCESSING_TYPES.URGENT,
      label: "긴급",
      time: "1일",
      icon: <Shield className="w-5 h-5" />,
      color: "red",
    },
  ];

  const purposes = [
    { value: "tourism", label: "관광" },
    { value: "business", label: "출장" },
    { value: "transit", label: "경유" },
    { value: "family_visit", label: "가족 방문" },
    { value: "conference", label: "회의 참석" },
    { value: "other", label: "기타" },
  ];

  return (
    <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-purple-50/30">
      <CardHeader className="pb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">여행 정보</CardTitle>
            <p className="text-gray-600 mt-1">베트남 방문 계획을 입력해주세요</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 비자 종류 선택 */}
        <div className="space-y-3">
          <label className="block text-lg font-semibold text-gray-800">비자 종류 *</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {visaTypes.map((visa) => (
              <div
                key={visa.value}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                  formData.visaType === visa.value ? "border-purple-500 bg-purple-50 shadow-lg" : "border-gray-200 hover:border-purple-300 hover:shadow-md"
                }`}
                onClick={() => handleInputChange("visaType", visa.value)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{visa.icon}</span>
                  <div>
                    <div className="font-semibold text-gray-800">{visa.label}</div>
                    <div className="text-sm text-gray-600">{visa.description}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 처리 속도 선택 */}
        <div className="space-y-3">
          <label className="block text-lg font-semibold text-gray-800">처리 속도 *</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {processingTypes.map((processing) => (
              <div
                key={processing.value}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                  formData.processingType === processing.value ? `border-${processing.color}-500 bg-${processing.color}-50 shadow-lg` : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                }`}
                onClick={() => handleInputChange("processingType", processing.value)}
              >
                <div className="flex items-center gap-3">
                  <div className={`text-${processing.color}-600`}>{processing.icon}</div>
                  <div>
                    <div className="font-semibold text-gray-800">{processing.label}</div>
                    <div className="text-sm text-gray-600">{processing.time}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 여행 날짜 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">입국 예정일 *</label>
            <Input
              type="date"
              value={formData.entryDate || ""}
              onChange={(e) => handleInputChange("entryDate", e.target.value)}
              className="border-2 border-gray-200 focus:border-purple-500 rounded-xl px-4 py-3 text-lg"
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">출국 예정일</label>
            <Input
              type="date"
              value={formData.exitDate || ""}
              onChange={(e) => handleInputChange("exitDate", e.target.value)}
              className="border-2 border-gray-200 focus:border-purple-500 rounded-xl px-4 py-3 text-lg"
              min={formData.entryDate || new Date().toISOString().split("T")[0]}
            />
          </div>
        </div>

        {/* 방문 목적 */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">방문 목적 *</label>
          <Select value={formData.purpose || ""} onValueChange={(value) => handleInputChange("purpose", value)}>
            <SelectTrigger className="border-2 border-gray-200 focus:border-purple-500 rounded-xl px-4 py-3 text-lg">
              <SelectValue placeholder="방문 목적을 선택해주세요" />
            </SelectTrigger>
            <SelectContent>
              {purposes.map((purpose) => (
                <SelectItem key={purpose.value} value={purpose.value}>
                  {purpose.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 이전 방문 경험 */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700">베트남 방문 경험이 있으신가요?</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="previousVisit" checked={formData.previousVisit === true} onChange={() => handleInputChange("previousVisit", true)} className="w-4 h-4 text-purple-600" />
              <span>예</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="previousVisit" checked={formData.previousVisit === false} onChange={() => handleInputChange("previousVisit", false)} className="w-4 h-4 text-purple-600" />
              <span>아니오</span>
            </label>
          </div>
        </div>

        {/* 가격 요약 */}
        <div className="p-6 bg-gradient-to-r from-purple-600 to-pink-700 rounded-2xl text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6" />
              <span className="text-lg font-semibold">예상 비자 비용</span>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{formatCurrency(currentPrice)}</div>
              <div className="text-purple-200 text-sm">부가세 포함</div>
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={onPrev} className="px-6 py-3 border-2 border-gray-300 hover:border-gray-400 rounded-xl font-semibold transition-all duration-300">
            <ArrowLeft className="w-5 h-5 mr-2" />
            이전
          </Button>
          <Button
            onClick={onNext}
            disabled={!isValid}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="mr-2">다음</span>
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TravelInfoStep;
