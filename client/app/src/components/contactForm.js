import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card.js';
import { Button } from './ui/button.js';
import { Input } from './ui/input.js';
import { Textarea } from './ui/textarea.js';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select.js';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage.js';
import { t } from '../lib/translations.js';
import { CREATE_CONSULTATION_MUTATION } from '../lib/graphql';
import { useToast } from '../hooks/useToast.js';

function ContactForm() {
  const { currentLanguage } = useLanguage();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    inquiryType: '',
    message: ''
  });

  const [submitConsultation, { loading: isSubmitting }] = useMutation(CREATE_CONSULTATION_MUTATION, {
    onCompleted: () => {
      toast({
        title: "문의가 접수되었습니다",
        description: "빠른 시일 내에 답변 드리겠습니다.",
      });
      setFormData({ name: '', email: '', phone: '', inquiryType: '', message: '' });
    },
    onError: (error) => {
      toast({
        title: "오류가 발생했습니다",
        description: "다시 시도해주세요.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "필수 항목을 입력해주세요",
        description: "이름, 이메일, 문의내용은 필수 입력 항목입니다.",
        variant: "destructive",
      });
      return;
    }
    
    submitConsultation({
      variables: {
        input: {
          customer_name: formData.name,
          email: formData.email,
          phone: formData.phone || '',
          service_type: formData.inquiryType || 'other',
          notes: formData.message
        }
      }
    });
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const inquiryTypes = [
    { value: 'visa', label: '비자 문의' },
    { value: 'process', label: '처리 과정 문의' },
    { value: 'document', label: '서류 관련' },
    { value: 'payment', label: '결제 문의' },
    { value: 'other', label: '기타' }
  ];

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-blue-50"></div>
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-br from-orange-200/30 to-pink-200/30 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20 animate-fade-in">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-2 rounded-full text-blue-700 text-sm font-medium mb-6">
            <Mail className="h-4 w-4" />
            <span>문의하기</span>
          </div>
          <h2 className="text-5xl font-bold text-[#003366] mb-6">
            <span className="text-gradient">Contact Us</span>
          </h2>
          <p className="text-gray-600 text-xl max-w-3xl mx-auto">
            베트남 비자에 관한 궁금한 점이 있으시면 언제든 문의해주세요. 전문 상담사가 신속하게 답변해드립니다.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <Card className="floating-card gradient-card border-0 animate-slide-in-left">
            <CardHeader>
              <CardTitle className="text-2xl text-[#003366] mb-2">문의 양식</CardTitle>
              <p className="text-gray-600">아래 양식을 작성해주시면 빠르게 답변드리겠습니다.</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">이름 *</label>
                    <Input
                      type="text"
                      placeholder="홍길동"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      className="rounded-xl border-gray-200 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">이메일 *</label>
                    <Input
                      type="email"
                      placeholder="example@email.com"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className="rounded-xl border-gray-200 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">전화번호</label>
                    <Input
                      type="tel"
                      placeholder="010-1234-5678"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      className="rounded-xl border-gray-200 focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">문의 유형</label>
                    <Select onValueChange={(value) => handleChange('inquiryType', value)}>
                      <SelectTrigger className="rounded-xl border-gray-200">
                        <SelectValue placeholder="문의 유형을 선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        {inquiryTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">문의 내용 *</label>
                  <Textarea
                    placeholder="문의하실 내용을 자세히 작성해주세요..."
                    value={formData.message}
                    onChange={(e) => handleChange('message', e.target.value)}
                    className="rounded-xl border-gray-200 focus:border-blue-500 min-h-[120px]"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full gradient-accent text-white py-4 rounded-xl btn-glow hover:scale-105 transition-all duration-300 text-lg font-semibold"
                >
                  {isSubmitting ? (
                    <>처리 중...</>
                  ) : (
                    <>
                      <Send className="h-5 w-5 mr-2" />
                      문의 보내기
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <div className="space-y-8 animate-slide-in-right">
            <Card className="floating-card gradient-card border-0">
              <CardContent className="p-8">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 gradient-accent rounded-xl flex items-center justify-center">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#003366]">전화 상담</h3>
                    <p className="text-gray-600">02-1234-5678</p>
                    <p className="text-sm text-gray-500">평일 09:00 - 18:00</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="floating-card gradient-card border-0">
              <CardContent className="p-8">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#003366]">이메일 문의</h3>
                    <p className="text-gray-600">info@vietnamvisa.co.kr</p>
                    <p className="text-sm text-gray-500">24시간 접수 가능</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="floating-card gradient-card border-0">
              <CardContent className="p-8">
                <div className="flex items-start space-x-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#003366]">오피스 방문</h3>
                    <p className="text-gray-600">서울특별시 강남구</p>
                    <p className="text-gray-600">테헤란로 123길 45</p>
                    <p className="text-sm text-gray-500">사전 예약 필수</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="floating-card gradient-card border-0">
              <CardContent className="p-8">
                <h3 className="text-lg font-semibold text-[#003366] mb-6">빠른 응답 보장</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gradient mb-1">2시간</div>
                    <div className="text-sm text-gray-600">평균 응답 시간</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gradient mb-1">100%</div>
                    <div className="text-sm text-gray-600">응답률</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactForm