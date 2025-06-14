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
    <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-blue-50/30">
      <CardHeader className="pb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">개인정보 입력</CardTitle>
            <p className="text-gray-600 mt-1">여권 정보와 동일하게 입력해주세요</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">성 (영문) *</label>
            <Input
              value={formData.firstName || ""}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              placeholder="HONG"
              className="border-2 border-gray-200 focus:border-blue-500 rounded-xl px-4 py-3 text-lg"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">이름 (영문) *</label>
            <Input
              value={formData.lastName || ""}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              placeholder="GILDONG"
              className="border-2 border-gray-200 focus:border-blue-500 rounded-xl px-4 py-3 text-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">생년월일 *</label>
            <Input
              type="date"
              value={formData.birthDate || ""}
              onChange={(e) => handleInputChange("birthDate", e.target.value)}
              className="border-2 border-gray-200 focus:border-blue-500 rounded-xl px-4 py-3 text-lg"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">성별 *</label>
            <Select value={formData.gender || ""} onValueChange={(value) => handleInputChange("gender", value)}>
              <SelectTrigger className="border-2 border-gray-200 focus:border-blue-500 rounded-xl px-4 py-3 text-lg">
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

        <div className="flex justify-end mt-8">
          <Button
            onClick={onNext}
            disabled={!isValid}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="mr-2">다음</span>
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalInfoStep;
