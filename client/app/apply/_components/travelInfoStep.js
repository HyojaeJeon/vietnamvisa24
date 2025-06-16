"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../src/components/ui/card";
import { Button } from "../../src/components/ui/button";
import { Input } from "../../src/components/ui/input";
import { Textarea } from "../../src/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../src/components/ui/select";
import { RadioGroup, RadioGroupItem } from "../../src/components/ui/radio-group";
import { Label } from "../../src/components/ui/label";
import { Plane, Calendar, MapPin, Hotel, ArrowRight, ArrowLeft, Clock, Users, Building, Heart } from "lucide-react";
import { validateStep } from "./utils";

const TravelInfoStep = ({ formData, onUpdate, onNext, onPrevious }) => {
  const handleInputChange = (field, value) => {
    onUpdate({ [field]: value });
  };

  const isValid = validateStep(3, formData);

  const purposeOfVisit = [
    { value: "TOURISM", label: "관광", icon: "🏖️" },
    { value: "BUSINESS", label: "비즈니스", icon: "💼" },
    { value: "VISIT_RELATIVES", label: "친척 방문", icon: "👨‍👩‍👧‍👦" },
    { value: "CONFERENCE", label: "회의/컨퍼런스", icon: "🏢" },
    { value: "MEDICAL", label: "의료", icon: "🏥" },
    { value: "EDUCATION", label: "교육", icon: "🎓" },
    { value: "TRANSIT", label: "경유", icon: "✈️" },
    { value: "OTHER", label: "기타", icon: "📋" },
  ];

  const entryPorts = [
    { value: "SGN", label: "호치민 (탄손녓 국제공항)" },
    { value: "HAN", label: "하노이 (노이바이 국제공항)" },
    { value: "DAD", label: "다낭 (다낭 국제공항)" },
    { value: "CXR", label: "나트랑 (캄란 국제공항)" },
    { value: "PQC", label: "푸꾸옥 (푸꾸옥 국제공항)" },
    { value: "VDO", label: "반돈 (반돈 국제공항)" },
    { value: "HPH", label: "하이퐁 (캣비 국제공항)" },
    { value: "LAND_BORDER", label: "육로 국경" },
    { value: "OTHER", label: "기타" },
  ];

  const accommodationTypes = [
    { value: "HOTEL", label: "호텔" },
    { value: "RESORT", label: "리조트" },
    { value: "HOMESTAY", label: "홈스테이" },
    { value: "AIRBNB", label: "에어비앤비" },
    { value: "RELATIVES_HOUSE", label: "친척/지인 집" },
    { value: "COMPANY_ACCOMMODATION", label: "회사 숙소" },
    { value: "OTHER", label: "기타" },
  ];

  return (
    <Card className="overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-white via-slate-50 to-blue-50/30">
      <CardHeader className="relative pb-8 text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 flex items-center gap-4">
          <div className="flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl">
            <Plane className="w-8 h-8 text-white" />
          </div>
          <div>
            <CardTitle className="mb-2 text-3xl font-bold">베트남 방문 정보</CardTitle>
            <p className="text-lg text-blue-100">베트남 여행 계획에 대한 정보를 입력해주세요</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-8 space-y-8">
        {/* 여행 일정 섹션 */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">여행 일정</h3>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* 입국 예정일 */}
            <div className="space-y-3">
              <label className="block text-sm font-bold tracking-wide text-gray-800 uppercase">베트남 입국 예정일 *</label>
              <Input
                type="date"
                value={formData.travelInfo?.entryDate || ""}
                onChange={(e) =>
                  handleInputChange("travelInfo", {
                    ...formData.travelInfo,
                    entryDate: e.target.value,
                  })
                }
                min={new Date().toISOString().split("T")[0]}
                className="h-12 text-lg font-medium border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-200"
              />
              <p className="text-xs text-gray-500">오늘 이후 날짜를 선택하세요</p>
            </div>
          </div>
        </div>

        {/* 입국 정보 섹션 */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-lg">
              <MapPin className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">입국 정보</h3>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* 입국 공항/항구 */}
            <div className="space-y-3">
              <label className="block text-sm font-bold tracking-wide text-gray-800 uppercase">입국 공항/항구 *</label>
              <Select
                value={formData.travelInfo?.entryPort || ""}
                onValueChange={(value) =>
                  handleInputChange("travelInfo", {
                    ...formData.travelInfo,
                    entryPort: value,
                  })
                }
              >
                <SelectTrigger className="h-12 text-lg border-2 border-gray-200 focus:border-purple-500">
                  <SelectValue placeholder="입국 공항/항구를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {entryPorts.map((port) => (
                    <SelectItem key={port.value} value={port.value}>
                      {port.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* 네비게이션 버튼 */}
        <div className="flex justify-between pt-8 border-t border-gray-200">
          <Button onClick={onPrevious} variant="outline" className="px-8 py-4 text-lg font-bold text-gray-700 transition-all duration-300 border-2 border-gray-300 hover:border-gray-400 rounded-2xl">
            <ArrowLeft className="w-6 h-6 mr-3" />
            <span>이전</span>
          </Button>

          <Button
            onClick={onNext}
            disabled={!isValid}
            className="px-12 py-4 text-lg font-bold text-white transition-all duration-300 transform shadow-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 rounded-2xl hover:shadow-3xl disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
          >
            <span className="mr-3">다음</span>
            <ArrowRight className="w-6 h-6" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TravelInfoStep;
