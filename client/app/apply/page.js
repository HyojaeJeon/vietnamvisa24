
'use client'

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '../src/components/header';
import Footer from '../src/components/footer';
import { Card, CardContent, CardHeader, CardTitle } from '../src/components/ui/card';
import { Button } from '../src/components/ui/button';
import { Input } from '../src/components/ui/input';
import { Textarea } from '../src/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../src/components/ui/select';
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
  Award
} from 'lucide-react';

export default function VisaApplication() {
  const searchParams = useSearchParams();
  const visaType = searchParams.get('type') || 'general';
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // 개인정보
    firstName: '',
    lastName: '',
    birthDate: '',
    nationality: '',
    passportNumber: '',
    passportExpiry: '',
    gender: '',
    
    // 연락처
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    
    // 비자 정보
    visaType: visaType === 'e-visa' ? 'e-visa-30' : visaType === 'business' ? 'business-30' : '',
    purposeOfVisit: '',
    arrivalDate: '',
    departureDate: '',
    stayDuration: '',
    entryType: '',
    
    // 베트남 정보
    vietnamAddress: '',
    vietnamContact: '',
    previousVisit: '',
    
    // 추가 정보
    emergencyContact: '',
    emergencyPhone: '',
    specialRequests: ''
  });

  const [uploadedFiles, setUploadedFiles] = useState({
    passport: null,
    photo: null,
    invitation: null,
    additional: null
  });

  const totalSteps = 4;

  // 비자 타입별 정보
  const visaTypeInfo = {
    'general': {
      title: '일반 비자 신청',
      subtitle: '베트남 입국을 위한 종합 비자 서비스',
      icon: FileText,
      color: 'from-blue-500 to-indigo-600',
      badge: '종합 서비스',
      features: ['맞춤형 비자 상담', '전 과정 관리', '24/7 지원']
    },
    'business': {
      title: '비즈니스 비자 신청',
      subtitle: '출장 및 사업 목적의 베트남 비자',
      icon: Briefcase,
      color: 'from-amber-500 to-orange-600',
      badge: '비즈니스 전용',
      features: ['90일 체류 가능', '복수 입국 선택', '빠른 처리']
    },
    'e-visa': {
      title: 'E-VISA 신청',
      subtitle: '온라인으로 간편하게 신청하는 전자비자',
      icon: Smartphone,
      color: 'from-blue-500 to-cyan-600',
      badge: '가장 인기',
      features: ['24시간 빠른 처리', '온라인 발급', '합리적 가격']
    }
  };

  const currentVisaInfo = visaTypeInfo[visaType] || visaTypeInfo['general'];

  const visaTypes = [
    { value: 'e-visa-30', label: 'E-VISA 30일 (단수)' },
    { value: 'e-visa-90', label: 'E-VISA 90일 (단수/복수)' },
    { value: 'tourist-30', label: '관광비자 30일' },
    { value: 'tourist-90', label: '관광비자 90일' },
    { value: 'business-30', label: '상용비자 30일' },
    { value: 'business-90', label: '상용비자 90일' },
    { value: 'work', label: '노동비자 (LD)' },
    { value: 'investment', label: '투자비자 (DT)' },
    { value: 'family', label: '가족비자 (TT)' }
  ];

  const purposeOptions = [
    { value: 'tourism', label: '관광' },
    { value: 'business', label: '출장/사업' },
    { value: 'conference', label: '회의/컨퍼런스' },
    { value: 'family', label: '가족방문' },
    { value: 'education', label: '교육/연수' },
    { value: 'medical', label: '의료' },
    { value: 'investment', label: '투자' },
    { value: 'work', label: '취업' },
    { value: 'other', label: '기타' }
  ];

  useEffect(() => {
    // URL 파라미터에 따라 초기 비자 타입 설정
    if (visaType === 'e-visa') {
      setFormData(prev => ({ ...prev, visaType: 'e-visa-30' }));
    } else if (visaType === 'business') {
      setFormData(prev => ({ ...prev, visaType: 'business-30' }));
    }
  }, [visaType]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (type, file) => {
    setUploadedFiles(prev => ({ ...prev, [type]: file }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    console.log('Form Data:', formData);
    console.log('Uploaded Files:', uploadedFiles);
    alert('비자 신청이 접수되었습니다. 확인 이메일을 확인해주세요.');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            <div className="text-center mb-10">
              <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-100 to-indigo-100 px-6 py-3 rounded-2xl mb-6">
                <User className="h-6 w-6 text-blue-600" />
                <span className="text-blue-800 font-bold text-lg">1단계: 개인정보</span>
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-4">개인정보를 입력해주세요</h3>
              <p className="text-gray-600 text-lg">여권 정보와 일치하는 정보를 정확히 입력해주세요</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-lg font-bold text-gray-800 flex items-center space-x-2">
                  <span>성 (영문)</span>
                  <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="LEE"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="h-14 text-lg border-2 border-gray-300 focus:border-blue-500 rounded-xl bg-white shadow-sm"
                />
              </div>
              <div className="space-y-3">
                <label className="text-lg font-bold text-gray-800 flex items-center space-x-2">
                  <span>이름 (영문)</span>
                  <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="MINHO"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="h-14 text-lg border-2 border-gray-300 focus:border-blue-500 rounded-xl bg-white shadow-sm"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-lg font-bold text-gray-800 flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <span>생년월일</span>
                  <span className="text-red-500">*</span>
                </label>
                <Input
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => handleInputChange('birthDate', e.target.value)}
                  className="h-14 text-lg border-2 border-gray-300 focus:border-blue-500 rounded-xl bg-white shadow-sm"
                />
              </div>
              <div className="space-y-3">
                <label className="text-lg font-bold text-gray-800 flex items-center space-x-2">
                  <User className="h-5 w-5 text-pink-600" />
                  <span>성별</span>
                  <span className="text-red-500">*</span>
                </label>
                <Select onValueChange={(value) => handleInputChange('gender', value)}>
                  <SelectTrigger className="h-14 text-lg border-2 border-gray-300 rounded-xl bg-white">
                    <SelectValue placeholder="성별을 선택해주세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">남성</SelectItem>
                    <SelectItem value="female">여성</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-lg font-bold text-gray-800 flex items-center space-x-2">
                  <Globe className="h-5 w-5 text-green-600" />
                  <span>국적</span>
                  <span className="text-red-500">*</span>
                </label>
                <Select onValueChange={(value) => handleInputChange('nationality', value)}>
                  <SelectTrigger className="h-14 text-lg border-2 border-gray-300 rounded-xl bg-white">
                    <SelectValue placeholder="국적을 선택해주세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="KR">🇰🇷 대한민국</SelectItem>
                    <SelectItem value="US">🇺🇸 미국</SelectItem>
                    <SelectItem value="JP">🇯🇵 일본</SelectItem>
                    <SelectItem value="CN">🇨🇳 중국</SelectItem>
                    <SelectItem value="other">기타</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <label className="text-lg font-bold text-gray-800 flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-purple-600" />
                  <span>여권번호</span>
                  <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="M12345678"
                  value={formData.passportNumber}
                  onChange={(e) => handleInputChange('passportNumber', e.target.value)}
                  className="h-14 text-lg border-2 border-gray-300 focus:border-blue-500 rounded-xl bg-white shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-lg font-bold text-gray-800 flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-orange-600" />
                <span>여권 만료일</span>
                <span className="text-red-500">*</span>
              </label>
              <Input
                type="date"
                value={formData.passportExpiry}
                onChange={(e) => handleInputChange('passportExpiry', e.target.value)}
                className="h-14 text-lg border-2 border-gray-300 focus:border-blue-500 rounded-xl bg-white shadow-sm max-w-md"
              />
              <p className="text-sm text-gray-500 mt-2">여권 유효기간이 최소 6개월 이상 남아있어야 합니다.</p>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            <div className="text-center mb-10">
              <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-green-100 to-emerald-100 px-6 py-3 rounded-2xl mb-6">
                <Phone className="h-6 w-6 text-green-600" />
                <span className="text-green-800 font-bold text-lg">2단계: 연락처 정보</span>
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-4">연락처 정보를 입력해주세요</h3>
              <p className="text-gray-600 text-lg">정확한 연락처로 비자 진행 상황을 안내드립니다</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-lg font-bold text-gray-800 flex items-center space-x-2">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <span>이메일</span>
                  <span className="text-red-500">*</span>
                </label>
                <Input
                  type="email"
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="h-14 text-lg border-2 border-gray-300 focus:border-blue-500 rounded-xl bg-white shadow-sm"
                />
              </div>
              <div className="space-y-3">
                <label className="text-lg font-bold text-gray-800 flex items-center space-x-2">
                  <Phone className="h-5 w-5 text-green-600" />
                  <span>전화번호</span>
                  <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="010-1234-5678"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="h-14 text-lg border-2 border-gray-300 focus:border-blue-500 rounded-xl bg-white shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-lg font-bold text-gray-800 flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-red-600" />
                <span>주소 (영문)</span>
                <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="123 Main Street, Gangnam-gu"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="h-14 text-lg border-2 border-gray-300 focus:border-blue-500 rounded-xl bg-white shadow-sm"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-lg font-bold text-gray-800 flex items-center space-x-2">
                  <span>도시</span>
                  <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="Seoul"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className="h-14 text-lg border-2 border-gray-300 focus:border-blue-500 rounded-xl bg-white shadow-sm"
                />
              </div>
              <div className="space-y-3">
                <label className="text-lg font-bold text-gray-800">우편번호</label>
                <Input
                  placeholder="06234"
                  value={formData.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                  className="h-14 text-lg border-2 border-gray-300 focus:border-blue-500 rounded-xl bg-white shadow-sm"
                />
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200">
              <h4 className="text-xl font-bold text-blue-800 mb-4">긴급 연락처 (선택사항)</h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-lg font-semibold text-blue-700">긴급연락처 이름</label>
                  <Input
                    placeholder="홍길동"
                    value={formData.emergencyContact}
                    onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                    className="h-12 border-2 border-blue-200 focus:border-blue-500 rounded-xl bg-white"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-lg font-semibold text-blue-700">긴급연락처 전화번호</label>
                  <Input
                    placeholder="010-9876-5432"
                    value={formData.emergencyPhone}
                    onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                    className="h-12 border-2 border-blue-200 focus:border-blue-500 rounded-xl bg-white"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8">
            <div className="text-center mb-10">
              <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-purple-100 to-pink-100 px-6 py-3 rounded-2xl mb-6">
                <FileText className="h-6 w-6 text-purple-600" />
                <span className="text-purple-800 font-bold text-lg">3단계: 비자 정보</span>
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-4">비자 정보를 입력해주세요</h3>
              <p className="text-gray-600 text-lg">신청하실 비자 종류와 여행 계획을 알려주세요</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-lg font-bold text-gray-800 flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-purple-600" />
                  <span>비자 종류</span>
                  <span className="text-red-500">*</span>
                </label>
                <Select value={formData.visaType} onValueChange={(value) => handleInputChange('visaType', value)}>
                  <SelectTrigger className="h-14 text-lg border-2 border-gray-300 rounded-xl bg-white">
                    <SelectValue placeholder="비자 종류를 선택해주세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {visaTypes.map((visa) => (
                      <SelectItem key={visa.value} value={visa.value}>
                        {visa.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <label className="text-lg font-bold text-gray-800 flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-orange-600" />
                  <span>방문 목적</span>
                  <span className="text-red-500">*</span>
                </label>
                <Select onValueChange={(value) => handleInputChange('purposeOfVisit', value)}>
                  <SelectTrigger className="h-14 text-lg border-2 border-gray-300 rounded-xl bg-white">
                    <SelectValue placeholder="방문 목적을 선택해주세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {purposeOptions.map((purpose) => (
                      <SelectItem key={purpose.value} value={purpose.value}>
                        {purpose.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-lg font-bold text-gray-800 flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-green-600" />
                  <span>입국 예정일</span>
                  <span className="text-red-500">*</span>
                </label>
                <Input
                  type="date"
                  value={formData.arrivalDate}
                  onChange={(e) => handleInputChange('arrivalDate', e.target.value)}
                  className="h-14 text-lg border-2 border-gray-300 focus:border-blue-500 rounded-xl bg-white shadow-sm"
                />
              </div>
              <div className="space-y-3">
                <label className="text-lg font-bold text-gray-800 flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-red-600" />
                  <span>출국 예정일</span>
                  <span className="text-red-500">*</span>
                </label>
                <Input
                  type="date"
                  value={formData.departureDate}
                  onChange={(e) => handleInputChange('departureDate', e.target.value)}
                  className="h-14 text-lg border-2 border-gray-300 focus:border-blue-500 rounded-xl bg-white shadow-sm"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-lg font-bold text-gray-800 flex items-center space-x-2">
                  <span>입국 형태</span>
                  <span className="text-red-500">*</span>
                </label>
                <Select onValueChange={(value) => handleInputChange('entryType', value)}>
                  <SelectTrigger className="h-14 text-lg border-2 border-gray-300 rounded-xl bg-white">
                    <SelectValue placeholder="입국 형태를 선택해주세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">단수 입국</SelectItem>
                    <SelectItem value="multiple">복수 입국</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <label className="text-lg font-bold text-gray-800">이전 베트남 방문 여부</label>
                <Select onValueChange={(value) => handleInputChange('previousVisit', value)}>
                  <SelectTrigger className="h-14 text-lg border-2 border-gray-300 rounded-xl bg-white">
                    <SelectValue placeholder="이전 방문 여부를 선택해주세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">예 (이전에 방문한 적 있음)</SelectItem>
                    <SelectItem value="no">아니오 (첫 방문)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-lg font-bold text-gray-800 flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-indigo-600" />
                <span>베트남 내 체류 주소</span>
              </label>
              <Input
                placeholder="호텔명 또는 주소를 입력해주세요"
                value={formData.vietnamAddress}
                onChange={(e) => handleInputChange('vietnamAddress', e.target.value)}
                className="h-14 text-lg border-2 border-gray-300 focus:border-blue-500 rounded-xl bg-white shadow-sm"
              />
            </div>

            <div className="space-y-3">
              <label className="text-lg font-bold text-gray-800 flex items-center space-x-2">
                <Phone className="h-5 w-5 text-cyan-600" />
                <span>베트남 내 연락처</span>
              </label>
              <Input
                placeholder="현지 연락 가능한 번호"
                value={formData.vietnamContact}
                onChange={(e) => handleInputChange('vietnamContact', e.target.value)}
                className="h-14 text-lg border-2 border-gray-300 focus:border-blue-500 rounded-xl bg-white shadow-sm"
              />
            </div>

            <div className="space-y-3">
              <label className="text-lg font-bold text-gray-800">특별 요청사항</label>
              <Textarea
                placeholder="추가로 요청하실 사항이 있으면 자세히 작성해주세요"
                value={formData.specialRequests}
                onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                className="min-h-[120px] text-lg border-2 border-gray-300 focus:border-blue-500 rounded-xl bg-white shadow-sm"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-8">
            <div className="text-center mb-10">
              <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-orange-100 to-red-100 px-6 py-3 rounded-2xl mb-6">
                <Upload className="h-6 w-6 text-orange-600" />
                <span className="text-orange-800 font-bold text-lg">4단계: 서류 업로드</span>
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-4">필요한 서류를 업로드해주세요</h3>
              <p className="text-gray-600 text-lg">선명한 서류 이미지로 빠른 처리가 가능합니다</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-3 border-dashed border-blue-300 hover:border-blue-500 transition-all duration-300 hover:shadow-xl bg-gradient-to-br from-blue-50 to-indigo-50">
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <FileText className="h-10 w-10 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-800 mb-3">여권 사본</h4>
                  <div className="inline-flex items-center space-x-2 bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-bold mb-4">
                    <span>필수</span>
                  </div>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    여권 정보 페이지<br/>
                    (JPG, PNG, PDF - 최대 10MB)
                  </p>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={(e) => handleFileUpload('passport', e.target.files[0])}
                    className="hidden"
                    id="passport-upload"
                  />
                  <label htmlFor="passport-upload">
                    <Button variant="outline" className="cursor-pointer h-12 px-8 border-2 border-blue-400 text-blue-700 hover:bg-blue-50 font-bold">
                      파일 선택
                    </Button>
                  </label>
                  {uploadedFiles.passport && (
                    <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-xl border border-green-200">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5" />
                        <span className="font-semibold">{uploadedFiles.passport.name}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-3 border-dashed border-green-300 hover:border-green-500 transition-all duration-300 hover:shadow-xl bg-gradient-to-br from-green-50 to-emerald-50">
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <Camera className="h-10 w-10 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-800 mb-3">증명사진</h4>
                  <div className="inline-flex items-center space-x-2 bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-bold mb-4">
                    <span>필수</span>
                  </div>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    최근 6개월 내 촬영<br/>
                    (JPG, PNG - 최대 10MB)
                  </p>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    onChange={(e) => handleFileUpload('photo', e.target.files[0])}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label htmlFor="photo-upload">
                    <Button variant="outline" className="cursor-pointer h-12 px-8 border-2 border-green-400 text-green-700 hover:bg-green-50 font-bold">
                      파일 선택
                    </Button>
                  </label>
                  {uploadedFiles.photo && (
                    <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-xl border border-green-200">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5" />
                        <span className="font-semibold">{uploadedFiles.photo.name}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-3 border-dashed border-amber-300 hover:border-amber-500 transition-all duration-300 hover:shadow-xl bg-gradient-to-br from-amber-50 to-yellow-50">
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-amber-500 to-orange-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <Mail className="h-10 w-10 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-800 mb-3">초청장</h4>
                  <div className="inline-flex items-center space-x-2 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-bold mb-4">
                    <span>선택</span>
                  </div>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    비즈니스/가족 비자의 경우<br/>
                    (JPG, PNG, PDF - 최대 10MB)
                  </p>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={(e) => handleFileUpload('invitation', e.target.files[0])}
                    className="hidden"
                    id="invitation-upload"
                  />
                  <label htmlFor="invitation-upload">
                    <Button variant="outline" className="cursor-pointer h-12 px-8 border-2 border-amber-400 text-amber-700 hover:bg-amber-50 font-bold">
                      파일 선택
                    </Button>
                  </label>
                  {uploadedFiles.invitation && (
                    <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-xl border border-green-200">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5" />
                        <span className="font-semibold">{uploadedFiles.invitation.name}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-3 border-dashed border-purple-300 hover:border-purple-500 transition-all duration-300 hover:shadow-xl bg-gradient-to-br from-purple-50 to-pink-50">
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <FileText className="h-10 w-10 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-800 mb-3">추가 서류</h4>
                  <div className="inline-flex items-center space-x-2 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-bold mb-4">
                    <span>선택</span>
                  </div>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    기타 필요한 서류<br/>
                    (JPG, PNG, PDF - 최대 10MB)
                  </p>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={(e) => handleFileUpload('additional', e.target.files[0])}
                    className="hidden"
                    id="additional-upload"
                  />
                  <label htmlFor="additional-upload">
                    <Button variant="outline" className="cursor-pointer h-12 px-8 border-2 border-purple-400 text-purple-700 hover:bg-purple-50 font-bold">
                      파일 선택
                    </Button>
                  </label>
                  {uploadedFiles.additional && (
                    <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-xl border border-green-200">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5" />
                        <span className="font-semibold">{uploadedFiles.additional.name}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200">
              <CardContent className="p-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-amber-800 mb-4">서류 업로드 안내사항</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <ul className="text-amber-700 space-y-2 font-medium">
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-amber-600" />
                          <span>파일 크기는 최대 10MB까지 가능</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-amber-600" />
                          <span>지원 형식: JPG, PNG, PDF</span>
                        </li>
                      </ul>
                      <ul className="text-amber-700 space-y-2 font-medium">
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-amber-600" />
                          <span>모든 서류는 선명하게 촬영</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-amber-600" />
                          <span>여권 사본과 증명사진은 필수</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  const IconComponent = currentVisaInfo.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />
      
      <main className="pt-20">
        {/* 비자 선택 메뉴 섹션 */}
        <section className="py-12 bg-white border-b border-gray-200">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">비자 종류 선택</h2>
                <p className="text-gray-600 text-lg">목적에 맞는 비자를 선택해주세요</p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                <Card className={`cursor-pointer transition-all duration-300 hover:shadow-xl ${
                  visaType === 'e-visa' ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:shadow-lg'
                }`}>
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Smartphone className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">E-비자 (90일 관광)</h3>
                    <p className="text-gray-600 text-sm mb-4">가장 합리적인 전자비자</p>
                    <div className="space-y-2 text-left text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>최대 90일 체류</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>단수/복수 선택</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>영업일 3-5일 처리</span>
                      </div>
                    </div>
                    <Button 
                      onClick={() => window.location.href = '/apply?type=e-visa'}
                      className={`w-full mt-4 ${
                        visaType === 'e-visa' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-blue-50'
                      }`}
                    >
                      {visaType === 'e-visa' ? '선택됨' : 'E-비자 신청하기'}
                    </Button>
                  </CardContent>
                </Card>

                <Card className={`cursor-pointer transition-all duration-300 hover:shadow-xl ${
                  visaType === 'e-visa-urgent' ? 'ring-2 ring-orange-500 shadow-lg' : 'hover:shadow-lg'
                }`}>
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Zap className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">긴급 E-비자</h3>
                    <p className="text-gray-600 text-sm mb-4">최우선 처리 서비스</p>
                    <div className="space-y-2 text-left text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>최대 90일 체류</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>1:1 전담 상담사</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>영업일 1-2일 처리</span>
                      </div>
                    </div>
                    <Button 
                      onClick={() => window.location.href = '/apply?type=e-visa-urgent'}
                      className={`w-full mt-4 ${
                        visaType === 'e-visa-urgent' 
                          ? 'bg-orange-600 text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-orange-50'
                      }`}
                    >
                      {visaType === 'e-visa-urgent' ? '선택됨' : '긴급 E-비자 신청'}
                    </Button>
                  </CardContent>
                </Card>

                <Card className={`cursor-pointer transition-all duration-300 hover:shadow-xl ${
                  visaType === 'business' ? 'ring-2 ring-amber-500 shadow-lg' : 'hover:shadow-lg'
                }`}>
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Briefcase className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">비즈니스 비자</h3>
                    <p className="text-gray-600 text-sm mb-4">출장 및 사업 목적</p>
                    <div className="space-y-2 text-left text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>최대 90일 체류 (복수 입국)</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>초청장 지원</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>영업일 3-5일 처리</span>
                      </div>
                    </div>
                    <Button 
                      onClick={() => window.location.href = '/apply?type=business'}
                      className={`w-full mt-4 ${
                        visaType === 'business' 
                          ? 'bg-amber-600 text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-amber-50'
                      }`}
                    >
                      {visaType === 'business' ? '선택됨' : '비즈니스 비자 신청'}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* 선택된 비자 타입 정보 표시 */}
        <section className={`py-16 bg-gradient-to-br ${currentVisaInfo.color} text-white relative overflow-hidden`}>
          <div className="absolute inset-0 bg-black/10"></div>
          
          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="max-w-4xl mx-auto">
              <div className="inline-flex items-center space-x-3 bg-white/20 backdrop-blur-sm border border-white/30 px-6 py-3 rounded-full text-sm font-bold mb-8">
                <IconComponent className="h-5 w-5" />
                <span>{currentVisaInfo.badge}</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                {currentVisaInfo.title}
              </h1>
              <p className="text-xl md:text-2xl mb-8 leading-relaxed opacity-95">
                {currentVisaInfo.subtitle}
              </p>
              
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                {currentVisaInfo.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                    <CheckCircle className="h-4 w-4" />
                    <span className="font-semibold">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Progress Bar */}
        <section className="py-8 bg-white border-b-2 border-gray-100">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                {[1, 2, 3, 4].map((step) => (
                  <div key={step} className="flex items-center">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg border-4 transition-all duration-300 ${
                      currentStep >= step 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-lg' 
                        : 'bg-gray-100 text-gray-400 border-gray-200'
                    }`}>
                      {currentStep > step ? <CheckCircle className="h-8 w-8" /> : step}
                    </div>
                    {step < 4 && (
                      <div className={`w-full h-2 mx-6 rounded-full transition-all duration-300 ${
                        currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                      }`}></div>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-base font-semibold text-gray-700">
                <span>개인정보</span>
                <span>연락처</span>
                <span>비자정보</span>
                <span>서류업로드</span>
              </div>
            </div>
          </div>
        </section>

        {/* Form Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <Card className="shadow-2xl border-0 overflow-hidden">
                <CardContent className="p-8 md:p-12 lg:p-16 bg-gradient-to-br from-white to-gray-50">
                  {renderStepContent()}
                </CardContent>
              </Card>

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-12">
                {currentStep > 1 ? (
                  <Button 
                    onClick={prevStep}
                    variant="outline"
                    size="lg"
                    className="px-10 py-4 text-lg font-bold border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 rounded-xl transition-all duration-300"
                  >
                    <ArrowRight className="h-5 w-5 mr-2 rotate-180" />
                    이전 단계
                  </Button>
                ) : (
                  <div></div>
                )}

                {currentStep < totalSteps ? (
                  <Button 
                    onClick={nextStep}
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-10 py-4 text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                  >
                    다음 단계
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                ) : (
                  <Button 
                    onClick={handleSubmit}
                    size="lg"
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-10 py-4 text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                  >
                    <Send className="h-5 w-5 mr-2" />
                    신청 제출하기
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 bg-gradient-to-br from-slate-800 to-slate-900 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">왜 저희를 선택해야 할까요?</h2>
              <p className="text-slate-300 text-lg md:text-xl mb-12 max-w-3xl mx-auto">
                전문가가 제공하는 안전하고 빠른 온라인 비자 신청 서비스의 장점
              </p>
              
              <div className="grid md:grid-cols-3 gap-8">
                <Card className="bg-white/10 backdrop-blur-sm border-2 border-white/20 text-white hover:bg-white/15 transition-all duration-300">
                  <CardContent className="p-8 text-center">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Zap className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">초고속 처리</h3>
                    <p className="text-slate-300 text-lg leading-relaxed">
                      일반 3-5일, 긴급 처리 시<br/>
                      <span className="text-yellow-400 font-bold">24시간 내 발급</span>
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 backdrop-blur-sm border-2 border-white/20 text-white hover:bg-white/15 transition-all duration-300">
                  <CardContent className="p-8 text-center">
                    <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Shield className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">안전 보장</h3>
                    <p className="text-slate-300 text-lg leading-relaxed">
                      <span className="text-green-400 font-bold">99.8% 승인률</span><br/>
                      거부 시 전액 환불 보장
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 backdrop-blur-sm border-2 border-white/20 text-white hover:bg-white/15 transition-all duration-300">
                  <CardContent className="p-8 text-center">
                    <div className="w-20 h-20 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Star className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">전문 상담</h3>
                    <p className="text-slate-300 text-lg leading-relaxed">
                      <span className="text-orange-400 font-bold">24/7 전문가 상담</span><br/>
                      실시간 진행 상황 확인
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
