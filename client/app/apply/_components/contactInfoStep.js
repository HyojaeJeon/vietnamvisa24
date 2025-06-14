"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../src/components/ui/card";
import { Button } from "../../src/components/ui/button";
import { Input } from "../../src/components/ui/input";
import { Textarea } from "../../src/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../src/components/ui/select";
import { Mail, Phone, MapPin, ArrowRight, ArrowLeft } from "lucide-react";
import { validateStep, validateEmail, validatePhone } from "./utils";

const ContactInfoStep = ({ formData, onUpdate, onNext, onPrev }) => {
  const handleInputChange = (field, value) => {
    onUpdate({ [field]: value });
  };

  const isValid = validateStep(2, formData);

  const countries = [
    { value: "KR", label: "대한민국" },
    { value: "VN", label: "베트남" },
    { value: "US", label: "미국" },
    { value: "JP", label: "일본" },
    { value: "CN", label: "중국" },
    { value: "TH", label: "태국" },
    { value: "SG", label: "싱가포르" },
  ];

  return (
    <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-green-50/30">
      <CardHeader className="pb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
            <Mail className="w-6 h-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">연락처 정보</CardTitle>
            <p className="text-gray-600 mt-1">연락 가능한 정보를 입력해주세요</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">이메일 주소 *</label>
            <Input
              type="email"
              value={formData.email || ""}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="example@email.com"
              className={`border-2 rounded-xl px-4 py-3 text-lg transition-all duration-300 ${
                formData.email && !validateEmail(formData.email) ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-green-500"
              }`}
            />
            {formData.email && !validateEmail(formData.email) && <p className="text-red-500 text-sm">올바른 이메일 형식이 아닙니다</p>}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">전화번호 *</label>
            <Input
              value={formData.phone || ""}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              placeholder="010-1234-5678"
              className={`border-2 rounded-xl px-4 py-3 text-lg transition-all duration-300 ${
                formData.phone && !validatePhone(formData.phone) ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-green-500"
              }`}
            />
            {formData.phone && !validatePhone(formData.phone) && <p className="text-red-500 text-sm">올바른 전화번호 형식이 아닙니다</p>}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">주소 *</label>
          <Textarea
            value={formData.address || ""}
            onChange={(e) => handleInputChange("address", e.target.value)}
            placeholder="상세 주소를 입력해주세요"
            className="border-2 border-gray-200 focus:border-green-500 rounded-xl px-4 py-3 text-lg min-h-20"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">도시 *</label>
            <Input
              value={formData.city || ""}
              onChange={(e) => handleInputChange("city", e.target.value)}
              placeholder="서울"
              className="border-2 border-gray-200 focus:border-green-500 rounded-xl px-4 py-3 text-lg"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">국가 *</label>
            <Select value={formData.country || ""} onValueChange={(value) => handleInputChange("country", value)}>
              <SelectTrigger className="border-2 border-gray-200 focus:border-green-500 rounded-xl px-4 py-3 text-lg">
                <SelectValue placeholder="국가를 선택해주세요" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country.value} value={country.value}>
                    {country.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="mr-2">다음</span>
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactInfoStep;
