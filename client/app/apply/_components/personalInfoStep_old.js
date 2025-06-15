"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../src/components/ui/card";
import { Button } from "../../src/components/ui/button";
import { Input } from "../../src/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../src/components/ui/select";
import { User, Calendar, Globe, ArrowRight } from "lucide-react";
import { validateStep } from "./utils";

const PersonalInfoStep = ({ formData, onUpdate, onNext }) => {
  const handleInputChange = (field, value) => {
    onUpdate({ [field]: value });
  };

  const isValid = validateStep(1, formData);

  const nationalities = [
    { value: "KR", label: "대한민국" },
    { value: "US", label: "미국" },
    { value: "JP", label: "일본" },
    { value: "CN", label: "중국" },
    { value: "GB", label: "영국" },
    { value: "DE", label: "독일" },
    { value: "FR", label: "프랑스" },
    { value: "CA", label: "캐나다" },
    { value: "AU", label: "호주" },
    { value: "SG", label: "싱가포르" },
  ];

  return (
    <Card className="border-0 shadow-2xl bg-gradient-to-br from-white via-slate-50 to-blue-50/30 overflow-hidden">
      <CardHeader className="pb-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white relative">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-3xl font-bold mb-2">개인정보 입력</CardTitle>
            <p className="text-blue-100 text-lg">여권 정보와 동일하게 입력해주세요</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="block text-sm font-bold text-gray-800 uppercase tracking-wide">성 (영문) *</label>
            <Input
              value={formData.firstName || ""}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              placeholder="HONG"
              className="border-2 border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-200 rounded-2xl px-6 py-4 text-lg font-medium transition-all duration-300 bg-white/80 backdrop-blur-sm"
            />
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-bold text-gray-800 uppercase tracking-wide">이름 (영문) *</label>
            <Input
              value={formData.lastName || ""}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              placeholder="GILDONG"
              className="border-2 border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-200 rounded-2xl px-6 py-4 text-lg font-medium transition-all duration-300 bg-white/80 backdrop-blur-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="block text-sm font-bold text-gray-800 uppercase tracking-wide">생년월일 *</label>
            <Input
              type="date"
              value={formData.birthDate || ""}
              onChange={(e) => handleInputChange("birthDate", e.target.value)}
              className="border-2 border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-200 rounded-2xl px-6 py-4 text-lg font-medium transition-all duration-300 bg-white/80 backdrop-blur-sm"
            />
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-bold text-gray-800 uppercase tracking-wide">성별 *</label>
            <Select value={formData.gender || ""} onValueChange={(value) => handleInputChange("gender", value)}>
              <SelectTrigger className="border-2 border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-200 rounded-2xl px-6 py-4 text-lg font-medium transition-all duration-300 bg-white/80 backdrop-blur-sm">
                <SelectValue placeholder="성별을 선택해주세요" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">남성</SelectItem>
                <SelectItem value="female">여성</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">국적 *</label>
            <Select value={formData.nationality || ""} onValueChange={(value) => handleInputChange("nationality", value)}>
              <SelectTrigger className="border-2 border-gray-200 focus:border-blue-500 rounded-xl px-4 py-3 text-lg">
                <SelectValue placeholder="국적을 선택해주세요" />
              </SelectTrigger>
              <SelectContent>
                {nationalities.map((nationality) => (
                  <SelectItem key={nationality.value} value={nationality.value}>
                    {nationality.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">여권번호 *</label>
            <Input
              value={formData.passportNumber || ""}
              onChange={(e) => handleInputChange("passportNumber", e.target.value.toUpperCase())}
              placeholder="M12345678"
              className="border-2 border-gray-200 focus:border-blue-500 rounded-xl px-4 py-3 text-lg"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">여권 만료일 *</label>
          <Input
            type="date"
            value={formData.passportExpiry || ""}
            onChange={(e) => handleInputChange("passportExpiry", e.target.value)}
            className="border-2 border-gray-200 focus:border-blue-500 rounded-xl px-4 py-3 text-lg max-w-sm"
          />
        </div>

        <div className="flex justify-between items-center pt-8">
          <div className="text-sm text-gray-600">
            <span className="font-medium">단계 2/7</span> - 개인정보 입력
          </div>
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

export default PersonalInfoStep;
