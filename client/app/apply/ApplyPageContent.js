"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Header from "../src/components/header";
import Footer from "../src/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "../src/components/ui/card";
import { Button } from "../src/components/ui/button";
import { Input } from "../src/components/ui/input";
import { Textarea } from "../src/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../src/components/ui/select";
import {
  FileText,
  Clock,
  Shield,
  CheckCircle,
  Upload,
  User,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Globe,
  AlertCircle,
  Send,
  Star,
  CreditCard,
  Zap,
  Camera,
  Briefcase,
  Smartphone,
  ArrowRight,
  Award,
} from "lucide-react";

export default function ApplyPageContent() {
  const searchParams = useSearchParams();
  const visaType = searchParams.get("type") || "general";

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // 개인정보
    firstName: "",
    lastName: "",
    birthDate: "",
    nationality: "",
    passportNumber: "",
    passportExpiry: "",
    gender: "",

    // 연락처
    email: "",
    phone: "",
    address: "",
    city: "",

    // 여행정보
    arrivalDate: "",
    departureDate: "",
    purpose: "",
    previousVisa: "",

    // 파일
    passportPhoto: null,
    additionalDocs: [],
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const visaTypes = {
    general: {
      title: "일반 관광 비자",
      description: "베트남 관광을 위한 기본 비자",
      price: "50,000원",
      duration: "30일",
      icon: <Globe className="w-8 h-8" />,
    },
    express: {
      title: "긴급 비자",
      description: "24시간 내 발급 가능한 긴급 비자",
      price: "100,000원",
      duration: "30일",
      icon: <Zap className="w-8 h-8" />,
    },
    business: {
      title: "비즈니스 비자",
      description: "사업 목적의 베트남 입국 비자",
      price: "80,000원",
      duration: "90일",
      icon: <Briefcase className="w-8 h-8" />,
    },
  };

  const currentVisa = visaTypes[visaType] || visaTypes.general;

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // 에러 제거
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = "이름을 입력해주세요";
      if (!formData.lastName.trim()) newErrors.lastName = "성을 입력해주세요";
      if (!formData.birthDate) newErrors.birthDate = "생년월일을 입력해주세요";
      if (!formData.nationality) newErrors.nationality = "국적을 선택해주세요";
      if (!formData.passportNumber.trim()) newErrors.passportNumber = "여권번호를 입력해주세요";
      if (!formData.passportExpiry) newErrors.passportExpiry = "여권 만료일을 입력해주세요";
      if (!formData.gender) newErrors.gender = "성별을 선택해주세요";
    }

    if (step === 2) {
      if (!formData.email.trim()) newErrors.email = "이메일을 입력해주세요";
      if (!formData.phone.trim()) newErrors.phone = "전화번호를 입력해주세요";
      if (!formData.address.trim()) newErrors.address = "주소를 입력해주세요";
    }

    if (step === 3) {
      if (!formData.arrivalDate) newErrors.arrivalDate = "입국일을 입력해주세요";
      if (!formData.departureDate) newErrors.departureDate = "출국일을 입력해주세요";
      if (!formData.purpose.trim()) newErrors.purpose = "방문 목적을 입력해주세요";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    try {
      // API 호출 시뮬레이션
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // 성공 처리
      alert("비자 신청이 완료되었습니다!");
    } catch (error) {
      console.error("신청 오류:", error);
      alert("신청 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">이름 *</label>
          <Input
            type="text"
            value={formData.firstName}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
            placeholder="이름을 입력하세요"
            className={errors.firstName ? "border-red-500" : ""}
          />
          {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">성 *</label>
          <Input
            type="text"
            value={formData.lastName}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
            placeholder="성을 입력하세요"
            className={errors.lastName ? "border-red-500" : ""}
          />
          {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">생년월일 *</label>
          <Input type="date" value={formData.birthDate} onChange={(e) => handleInputChange("birthDate", e.target.value)} className={errors.birthDate ? "border-red-500" : ""} />
          {errors.birthDate && <p className="text-red-500 text-sm mt-1">{errors.birthDate}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">성별 *</label>
          <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
            <SelectTrigger className={errors.gender ? "border-red-500" : ""}>
              <SelectValue placeholder="성별을 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">남성</SelectItem>
              <SelectItem value="female">여성</SelectItem>
            </SelectContent>
          </Select>
          {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">국적 *</label>
          <Select value={formData.nationality} onValueChange={(value) => handleInputChange("nationality", value)}>
            <SelectTrigger className={errors.nationality ? "border-red-500" : ""}>
              <SelectValue placeholder="국적을 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="korean">한국</SelectItem>
              <SelectItem value="american">미국</SelectItem>
              <SelectItem value="japanese">일본</SelectItem>
              <SelectItem value="chinese">중국</SelectItem>
            </SelectContent>
          </Select>
          {errors.nationality && <p className="text-red-500 text-sm mt-1">{errors.nationality}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">여권번호 *</label>
          <Input
            type="text"
            value={formData.passportNumber}
            onChange={(e) => handleInputChange("passportNumber", e.target.value)}
            placeholder="여권번호를 입력하세요"
            className={errors.passportNumber ? "border-red-500" : ""}
          />
          {errors.passportNumber && <p className="text-red-500 text-sm mt-1">{errors.passportNumber}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">여권 만료일 *</label>
        <Input type="date" value={formData.passportExpiry} onChange={(e) => handleInputChange("passportExpiry", e.target.value)} className={errors.passportExpiry ? "border-red-500" : ""} />
        {errors.passportExpiry && <p className="text-red-500 text-sm mt-1">{errors.passportExpiry}</p>}
      </div>
    </div>
  );

  const renderContactInfo = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">이메일 *</label>
        <Input type="email" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} placeholder="이메일을 입력하세요" className={errors.email ? "border-red-500" : ""} />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">전화번호 *</label>
        <Input type="tel" value={formData.phone} onChange={(e) => handleInputChange("phone", e.target.value)} placeholder="전화번호를 입력하세요" className={errors.phone ? "border-red-500" : ""} />
        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">주소 *</label>
        <Textarea value={formData.address} onChange={(e) => handleInputChange("address", e.target.value)} placeholder="주소를 입력하세요" className={errors.address ? "border-red-500" : ""} rows={3} />
        {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">도시</label>
        <Input type="text" value={formData.city} onChange={(e) => handleInputChange("city", e.target.value)} placeholder="도시를 입력하세요" />
      </div>
    </div>
  );

  const renderTravelInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">입국일 *</label>
          <Input type="date" value={formData.arrivalDate} onChange={(e) => handleInputChange("arrivalDate", e.target.value)} className={errors.arrivalDate ? "border-red-500" : ""} />
          {errors.arrivalDate && <p className="text-red-500 text-sm mt-1">{errors.arrivalDate}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">출국일 *</label>
          <Input type="date" value={formData.departureDate} onChange={(e) => handleInputChange("departureDate", e.target.value)} className={errors.departureDate ? "border-red-500" : ""} />
          {errors.departureDate && <p className="text-red-500 text-sm mt-1">{errors.departureDate}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">방문 목적 *</label>
        <Select value={formData.purpose} onValueChange={(value) => handleInputChange("purpose", value)}>
          <SelectTrigger className={errors.purpose ? "border-red-500" : ""}>
            <SelectValue placeholder="방문 목적을 선택하세요" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tourism">관광</SelectItem>
            <SelectItem value="business">사업</SelectItem>
            <SelectItem value="visiting">친지 방문</SelectItem>
            <SelectItem value="other">기타</SelectItem>
          </SelectContent>
        </Select>
        {errors.purpose && <p className="text-red-500 text-sm mt-1">{errors.purpose}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">이전 베트남 비자 여부</label>
        <Select value={formData.previousVisa} onValueChange={(value) => handleInputChange("previousVisa", value)}>
          <SelectTrigger>
            <SelectValue placeholder="이전 비자 여부를 선택하세요" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="yes">예</SelectItem>
            <SelectItem value="no">아니오</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const renderReview = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            신청 정보 확인
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">이름</p>
              <p className="font-medium">
                {formData.firstName} {formData.lastName}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">생년월일</p>
              <p className="font-medium">{formData.birthDate}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">여권번호</p>
              <p className="font-medium">{formData.passportNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">국적</p>
              <p className="font-medium">{formData.nationality}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">이메일</p>
              <p className="font-medium">{formData.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">전화번호</p>
              <p className="font-medium">{formData.phone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">입국일</p>
              <p className="font-medium">{formData.arrivalDate}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">출국일</p>
              <p className="font-medium">{formData.departureDate}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blue-500" />
            비자 정보 및 결제
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-3">
              {currentVisa.icon}
              <div>
                <h3 className="font-semibold">{currentVisa.title}</h3>
                <p className="text-sm text-gray-600">{currentVisa.description}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-blue-600">{currentVisa.price}</p>
              <p className="text-sm text-gray-600">{currentVisa.duration}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const steps = [
    { id: 1, title: "개인정보", icon: <User className="w-5 h-5" /> },
    { id: 2, title: "연락처", icon: <Phone className="w-5 h-5" /> },
    { id: 3, title: "여행정보", icon: <Calendar className="w-5 h-5" /> },
    { id: 4, title: "확인", icon: <CheckCircle className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* 비자 타입 헤더 */}
          <div className="mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {currentVisa.icon}
                    <div>
                      <h1 className="text-2xl font-bold">{currentVisa.title}</h1>
                      <p className="text-gray-600">{currentVisa.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-blue-600">{currentVisa.price}</p>
                    <p className="text-gray-600">{currentVisa.duration}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 진행 단계 */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${currentStep >= step.id ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-600"}`}>
                    {step.icon}
                    <span className="font-medium">{step.title}</span>
                  </div>
                  {index < steps.length - 1 && <ArrowRight className="w-5 h-5 text-gray-400 mx-2" />}
                </div>
              ))}
            </div>
          </div>

          {/* 폼 컨텐츠 */}
          <Card>
            <CardHeader>
              <CardTitle>
                {currentStep === 1 && "개인정보 입력"}
                {currentStep === 2 && "연락처 정보"}
                {currentStep === 3 && "여행 정보"}
                {currentStep === 4 && "신청 정보 확인"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {currentStep === 1 && renderPersonalInfo()}
              {currentStep === 2 && renderContactInfo()}
              {currentStep === 3 && renderTravelInfo()}
              {currentStep === 4 && renderReview()}
            </CardContent>
          </Card>

          {/* 네비게이션 버튼 */}
          <div className="flex justify-between mt-8">
            <Button variant="outline" onClick={handlePrev} disabled={currentStep === 1}>
              이전
            </Button>

            {currentStep < 4 ? (
              <Button onClick={handleNext}>다음</Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
                {isSubmitting ? "처리중..." : "신청 완료"}
              </Button>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
