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
    <Card className="border-0 shadow-2xl bg-gradient-to-br from-white via-slate-50 to-blue-50/30 overflow-hidden">
      <CardHeader className="pb-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white relative">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <Plane className="w-8 h-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-3xl font-bold mb-2">베트남 방문 정보</CardTitle>
            <p className="text-blue-100 text-lg">베트남 여행 계획에 대한 정보를 입력해주세요</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-8 space-y-8">
        {/* 여행 일정 섹션 */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">여행 일정</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 입국 예정일 */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-gray-800 uppercase tracking-wide">베트남 입국 예정일 *</label>
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

            {/* 출국 예정일 */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-gray-800 uppercase tracking-wide">베트남 출국 예정일 *</label>
              <Input
                type="date"
                value={formData.travelInfo?.exitDate || ""}
                onChange={(e) =>
                  handleInputChange("travelInfo", {
                    ...formData.travelInfo,
                    exitDate: e.target.value,
                  })
                }
                min={formData.travelInfo?.entryDate || new Date().toISOString().split("T")[0]}
                className="h-12 text-lg font-medium border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-200"
              />
              <p className="text-xs text-gray-500">입국일 이후 날짜를 선택하세요</p>
            </div>
          </div>
        </div>

        {/* 방문 목적 섹션 */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">방문 목적</h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {purposeOfVisit.map((purpose) => (
              <div
                key={purpose.value}
                className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                  formData.travelInfo?.purpose === purpose.value
                    ? "border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg"
                    : "border-gray-200 hover:border-green-300 hover:shadow-md bg-white"
                }`}
                onClick={() =>
                  handleInputChange("travelInfo", {
                    ...formData.travelInfo,
                    purpose: purpose.value,
                  })
                }
              >
                <div className="text-center space-y-2">
                  <div className="text-2xl">{purpose.icon}</div>
                  <h4 className="text-sm font-bold text-gray-800">{purpose.label}</h4>
                </div>

                {formData.travelInfo?.purpose === purpose.value && (
                  <div className="absolute top-2 right-2">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* 기타 목적 상세 입력 */}
          {formData.travelInfo?.purpose === "OTHER" && (
            <div className="space-y-3">
              <label className="block text-sm font-bold text-gray-800 uppercase tracking-wide">방문 목적 상세 *</label>
              <Input
                value={formData.travelInfo?.purposeDetail || ""}
                onChange={(e) =>
                  handleInputChange("travelInfo", {
                    ...formData.travelInfo,
                    purposeDetail: e.target.value,
                  })
                }
                placeholder="구체적인 방문 목적을 입력해주세요"
                className="h-12 text-lg font-medium border-2 border-gray-200 focus:border-green-500 focus:ring-green-200"
              />
            </div>
          )}
        </div>

        {/* 입국 정보 섹션 */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">입국 정보</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 입국 공항/항구 */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-gray-800 uppercase tracking-wide">입국 공항/항구 *</label>
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

            {/* 출국 공항/항구 */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-gray-800 uppercase tracking-wide">출국 공항/항구 *</label>
              <Select
                value={formData.travelInfo?.exitPort || ""}
                onValueChange={(value) =>
                  handleInputChange("travelInfo", {
                    ...formData.travelInfo,
                    exitPort: value,
                  })
                }
              >
                <SelectTrigger className="h-12 text-lg border-2 border-gray-200 focus:border-purple-500">
                  <SelectValue placeholder="출국 공항/항구를 선택하세요" />
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

        {/* 숙박 정보 섹션 */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
              <Hotel className="w-5 h-5 text-orange-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">숙박 정보</h3>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {/* 숙박 유형 */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-gray-800 uppercase tracking-wide">숙박 유형 *</label>
              <Select
                value={formData.travelInfo?.accommodationType || ""}
                onValueChange={(value) =>
                  handleInputChange("travelInfo", {
                    ...formData.travelInfo,
                    accommodationType: value,
                  })
                }
              >
                <SelectTrigger className="h-12 text-lg border-2 border-gray-200 focus:border-orange-500">
                  <SelectValue placeholder="숙박 유형을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {accommodationTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 숙박 장소명 */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-gray-800 uppercase tracking-wide">숙박 장소명 *</label>
              <Input
                value={formData.travelInfo?.accommodationName || ""}
                onChange={(e) =>
                  handleInputChange("travelInfo", {
                    ...formData.travelInfo,
                    accommodationName: e.target.value,
                  })
                }
                placeholder="호텔명 또는 숙박 장소명을 입력하세요"
                className="h-12 text-lg font-medium border-2 border-gray-200 focus:border-orange-500 focus:ring-orange-200"
              />
            </div>

            {/* 숙박 주소 */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-gray-800 uppercase tracking-wide">숙박 주소 *</label>
              <Textarea
                value={formData.travelInfo?.accommodationAddress || ""}
                onChange={(e) =>
                  handleInputChange("travelInfo", {
                    ...formData.travelInfo,
                    accommodationAddress: e.target.value,
                  })
                }
                placeholder="숙박 장소의 상세 주소를 입력하세요"
                className="min-h-[100px] text-lg font-medium border-2 border-gray-200 focus:border-orange-500 focus:ring-orange-200"
                rows={3}
              />
              <p className="text-xs text-gray-500">정확한 주소를 영문으로 입력해주세요</p>
            </div>
          </div>
        </div>

        {/* 동반자 정보 섹션 */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">동반자 정보</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 동반자 여부 */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-gray-800 uppercase tracking-wide">동반자 여부</label>
              <RadioGroup
                value={formData.travelInfo?.hasCompanions || ""}
                onValueChange={(value) =>
                  handleInputChange("travelInfo", {
                    ...formData.travelInfo,
                    hasCompanions: value,
                  })
                }
                className="flex space-x-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="companions-yes" />
                  <Label htmlFor="companions-yes" className="text-lg font-medium cursor-pointer">
                    있음
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="companions-no" />
                  <Label htmlFor="companions-no" className="text-lg font-medium cursor-pointer">
                    없음 (단독 여행)
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* 동반자 수 */}
            {formData.travelInfo?.hasCompanions === "yes" && (
              <div className="space-y-3">
                <label className="block text-sm font-bold text-gray-800 uppercase tracking-wide">동반자 수</label>
                <Input
                  type="number"
                  min="1"
                  max="10"
                  value={formData.travelInfo?.companionCount || ""}
                  onChange={(e) =>
                    handleInputChange("travelInfo", {
                      ...formData.travelInfo,
                      companionCount: e.target.value,
                    })
                  }
                  placeholder="동반자 수를 입력하세요"
                  className="h-12 text-lg font-medium border-2 border-gray-200 focus:border-indigo-500 focus:ring-indigo-200"
                />
              </div>
            )}
          </div>
        </div>

        {/* 네비게이션 버튼 */}
        <div className="flex justify-between pt-8 border-t border-gray-200">
          <Button onClick={onPrevious} variant="outline" className="px-8 py-4 border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-bold text-lg rounded-2xl transition-all duration-300">
            <ArrowLeft className="w-6 h-6 mr-3" />
            <span>이전</span>
          </Button>

          <Button
            onClick={onNext}
            disabled={!isValid}
            className="px-12 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
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
