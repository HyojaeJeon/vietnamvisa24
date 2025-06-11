
'use client'

import React, { useState } from 'react';
import Header from '../src/components/header';
import Footer from '../src/components/footer';
import { Card, CardContent, CardHeader, CardTitle } from '../src/components/ui/card';
import { Button } from '../src/components/ui/button';
import { 
  Plane, 
  Clock, 
  Shield, 
  Star, 
  CheckCircle, 
  Phone, 
  MessageCircle,
  Users,
  ArrowRight,
  Crown,
  Zap,
  UserCheck,
  MapPin,
  Navigation,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Luggage,
  Timer,
  Heart,
  Award,
  Lock,
  Sparkles,
  Eye,
  FileText
} from 'lucide-react';

export default function AirportFastTrack() {
  const [selectedFaq, setSelectedFaq] = useState(0);
  const [selectedService, setSelectedService] = useState('arrival');

  const targetCustomers = [
    {
      title: "시간이 가장 중요한 분",
      description: "중요한 비즈니스 미팅이나 촉박한 환승 항공편을 놓칠 수 없는 비즈니스 여행객",
      icon: Clock,
      color: "from-blue-500 to-indigo-600"
    },
    {
      title: "편안한 여행을 원하는 분",
      description: "긴 대기 줄의 피로와 스트레스 없이, 여행의 시작과 끝을 VIP처럼 편안하게 보내고 싶은 모든 여행객",
      icon: Crown,
      color: "from-purple-500 to-pink-600"
    },
    {
      title: "도움이 필요하신 분",
      description: "어린 자녀, 연로하신 부모님과 함께하여 도움이 필요하거나, 넓은 공항에서 길을 찾거나 절차를 밟는 것이 부담스러운 분",
      icon: Heart,
      color: "from-orange-500 to-red-600"
    },
    {
      title: "베트남이 처음인 분",
      description: "낯선 공항 환경에서 헤매지 않고, 전담 직원의 안내에 따라 가장 빠르고 정확하게 모든 절차를 완료하고 싶은 첫 방문객",
      icon: MapPin,
      color: "from-emerald-500 to-teal-600"
    }
  ];

  const serviceFeatures = [
    {
      icon: Zap,
      title: "획기적인 시간 단축",
      description: "일반 대기 줄이 아닌 전용 우선 라인을 통해 출입국 심사와 보안 검색을 통과, 1~2시간 이상 걸릴 수 있는 대기 시간을 수 분 내로 단축합니다."
    },
    {
      icon: UserCheck,
      title: "1:1 전담 에스코트",
      description: "항공편 도착부터(입국 시) 또는 공항 도착부터(출국 시) 전담 스태프가 고객님과 동행하며 모든 절차를 안내하고 지원하는 프리미엄 서비스를 제공합니다."
    },
    {
      icon: Shield,
      title: "스트레스 없는 절차 진행",
      description: "복잡한 동선, 서류 제출, 언어 문제까지 전담 스태프가 해결해 드립니다. 고객님은 편안하게 스태프를 따라 이동하기만 하면 됩니다."
    },
    {
      icon: Navigation,
      title: "예측 가능한 여정",
      description: "항공기 탑승 시간, 미팅 시간 등 다음 일정을 놓칠 걱정 없이, 모든 공항 절차를 여유롭게 완료할 수 있도록 저희가 관리해 드립니다."
    }
  ];

  const arrivalSteps = [
    { step: 1, title: "서비스 예약", description: "베트남 입국일, 항공편명 등 정보를 입력하고 예약을 완료합니다.", icon: Phone },
    { step: 2, title: "전담 스태프 미팅", description: "비행기에서 내린 후, 브릿지 또는 지정된 미팅 포인트에서 고객님의 이름표를 든 전담 스태프를 만납니다.", icon: UserCheck },
    { step: 3, title: "신속한 입국 절차", description: "전용 우선 라인을 통해 입국 심사를 신속하게 통과하고, 수하물 수취 및 세관 통과를 지원합니다.", icon: Zap },
    { step: 4, title: "서비스 완료", description: "모든 절차 완료 후, 최종 입국장에서 대기 중인 픽업 드라이버나 마중 나온 분에게 안전하게 인계해 드립니다.", icon: CheckCircle }
  ];

  const departureSteps = [
    { step: 1, title: "서비스 예약", description: "베트남 출국일, 항공편명 등 정보를 입력하고 예약을 완료합니다.", icon: Phone },
    { step: 2, title: "전담 스태프 미팅", description: "약속된 시간에 공항 출발층의 지정된 항공사 카운터 앞에서 전담 스태프를 만납니다.", icon: UserCheck },
    { step: 3, title: "신속한 출국 절차", description: "체크인, 보안검색, 출국심사를 전용 우선 라인을 통해 신속하게 통과합니다.", icon: Zap },
    { step: 4, title: "서비스 완료", description: "모든 심사 완료 후, 면세 구역 또는 항공사 라운지 입구까지 안내해 드립니다.", icon: CheckCircle }
  ];

  const faqData = [
    {
      question: "패스트트랙 서비스는 어떤 공항에서 이용 가능한가요?",
      answer: "현재 저희 Vietnamvisa24의 패스트트랙 서비스는 하노이의 노이바이 국제공항(HAN)과 호치민의 탄손녓 국제공항(SGN)에서만 지원됩니다. 다낭 공항은 지원되지 않으니 예약 전 꼭 확인해 주십시오."
    },
    {
      question: "정말 대기 시간이 없어지나요?",
      answer: "패스트트랙은 일반 라인보다 훨씬 짧은 시간 내 절차를 통과하도록 돕는 프리미엄 서비스입니다. 공항 전체 상황에 따라 아주 짧은 대기가 발생할 수는 있지만, 일반 대기 시간을 획기적으로 줄여드리는 것을 보장합니다."
    },
    {
      question: "항공편이 연착되면 어떻게 하나요?",
      answer: "고객님께서 전달해주신 항공권 정보로 저희가 실시간 운항 정보를 확인합니다. 항공편이 연착되어도 변경된 도착 시간에 맞춰 스태프가 대기할 예정이니 안심하고 입국해 주십시오."
    },
    {
      question: "수하물 찾는 것도 도와주시나요?",
      answer: "네, 입국 서비스 시 저희 전담 스태프가 수하물 수취대까지 동행하여 고객님의 짐 찾는 것을 도와드립니다. 다만, 수하물을 직접 운반해 드리는 포터 서비스는 포함되어 있지 않습니다."
    },
    {
      question: "서비스 예약은 언제까지 해야 하나요?",
      answer: "원활한 스태프 배정을 위해 항공편 출발 또는 도착 시간 기준 최소 24시간 전까지 예약을 완료해 주시는 것을 권장합니다."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <Header />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-700 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>

          {/* 배경 패턴 */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}
          ></div>

          {/* 배경 애니메이션 */}
          <div className="absolute inset-0">
            <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-ping" style={{animationDelay: '0s'}}></div>
            <div className="absolute top-32 right-20 w-16 h-16 bg-white/5 rounded-full animate-ping" style={{animationDelay: '2s'}}></div>
            <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white/10 rounded-full animate-ping" style={{animationDelay: '4s'}}></div>
          </div>

          <div className="container mx-auto px-4 text-center relative z-10">
            {/* 대비 이미지 영역 (가상) */}
            <div className="mb-12">
              <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* 불편한 상황 */}
                  <div className="bg-red-100/20 rounded-2xl p-6 border border-red-300/30">
                    <div className="text-red-200 mb-4">
                      <Users className="h-12 w-12 mx-auto opacity-50" />
                    </div>
                    <h3 className="text-lg font-semibold text-red-200 mb-2">긴 대기 줄의 스트레스</h3>
                    <p className="text-red-100 text-sm">지치고 답답한 공항 대기</p>
                  </div>

                  {/* 편안한 상황 */}
                  <div className="bg-green-100/20 rounded-2xl p-6 border border-green-300/30">
                    <div className="text-green-200 mb-4">
                      <Crown className="h-12 w-12 mx-auto" />
                    </div>
                    <h3 className="text-lg font-semibold text-green-200 mb-2">VIP 전용 라인</h3>
                    <p className="text-green-100 text-sm">빠르고 편안한 프리미엄 서비스</p>
                  </div>
                </div>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              당신의 시간은 소중하니까,<br />
              <span className="text-yellow-300">공항에서의 1분 1초를</span><br />
              아끼세요.
            </h1>
            <p className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto leading-relaxed text-blue-100">
              Vietnamvisa24 공항 패스트트랙으로 기다림 없는 프리미엄 입출국을 경험하세요.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="w-full sm:w-auto bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black px-8 py-4 text-xl font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                onClick={() => document.getElementById('service-options').scrollIntoView({ behavior: 'smooth' })}
              >
                <ArrowRight className="h-6 w-6 mr-3" />
                서비스 바로 예약하기
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="w-full sm:w-auto border-white/50 text-white hover:bg-white/10 px-8 py-4 text-xl backdrop-blur-sm"
              >
                <Phone className="h-5 w-5 mr-2" />
                요금 확인 및 문의
              </Button>
            </div>
          </div>
        </section>

        {/* 추천 고객 섹션 */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-2 bg-purple-100 px-4 py-2 rounded-full text-purple-700 text-sm font-medium mb-6">
                <Users className="h-4 w-4" />
                <span>추천 고객</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                이런 분들께 가장 필요합니다!
              </h2>
              <p className="text-gray-600 text-xl max-w-4xl mx-auto">
                공항에서의 긴 대기 시간과 복잡한 절차는 이제 스트레스가 아닌,<br />
                편안한 경험이 될 수 있습니다.
              </p>
            </div>

            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8">
                {targetCustomers.map((customer, index) => (
                  <Card key={index} className="shadow-lg border-0 hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-8">
                      <div className="flex items-start space-x-4">
                        <div className={`w-12 h-12 bg-gradient-to-r ${customer.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                          <customer.icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800 mb-3">{customer.title}</h3>
                          <p className="text-gray-600 leading-relaxed">{customer.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 서비스 강점 섹션 */}
        <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-100">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-2 bg-blue-100 px-4 py-2 rounded-full text-blue-700 text-sm font-medium mb-6">
                <Crown className="h-4 w-4" />
                <span>서비스 강점</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                공항 패스트트랙으로 얻는<br />
                <span className="text-purple-600">완벽한 경험</span>
              </h2>
              <p className="text-gray-600 text-xl max-w-3xl mx-auto">
                단순히 '빠른 통과'가 아닙니다. 공항에 머무는 모든 순간의 가치를 높여드립니다.
              </p>
            </div>

            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8">
                {serviceFeatures.map((feature, index) => (
                  <Card key={index} className="shadow-lg border-0 hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                          <feature.icon className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-3">{feature.title}</h3>
                        <p className="text-gray-600 leading-relaxed text-sm">{feature.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 서비스 옵션 섹션 */}
        <section id="service-options" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-2 bg-green-100 px-4 py-2 rounded-full text-green-700 text-sm font-medium mb-6">
                <Plane className="h-4 w-4" />
                <span>서비스 옵션</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                입국 / 출국 서비스 선택
              </h2>
              <p className="text-gray-600 text-xl max-w-3xl mx-auto">
                고객님의 여정에 맞춰 필요한 서비스를 선택하세요.
              </p>
            </div>

            <div className="max-w-6xl mx-auto">
              <div className="flex justify-center mb-8">
                <div className="bg-gray-100 p-1 rounded-2xl">
                  <Button 
                    variant={selectedService === 'arrival' ? 'default' : 'ghost'}
                    className={`px-8 py-3 rounded-xl ${selectedService === 'arrival' ? 'bg-blue-600 text-white' : 'text-gray-600'}`}
                    onClick={() => setSelectedService('arrival')}
                  >
                    입국 패스트트랙
                  </Button>
                  <Button 
                    variant={selectedService === 'departure' ? 'default' : 'ghost'}
                    className={`px-8 py-3 rounded-xl ${selectedService === 'departure' ? 'bg-purple-600 text-white' : 'text-gray-600'}`}
                    onClick={() => setSelectedService('departure')}
                  >
                    출국 패스트트랙
                  </Button>
                </div>
              </div>

              {/* 입국 서비스 */}
              {selectedService === 'arrival' && (
                <Card className="shadow-xl border-0 relative overflow-hidden">
                  <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                  <CardHeader className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <Plane className="h-8 w-8 text-white transform -rotate-45" />
                      </div>
                      <CardTitle className="text-3xl font-bold text-gray-800 mb-2">입국 패스트트랙</CardTitle>
                      <p className="text-gray-600">베트남 도착 시 프리미엄 서비스</p>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="grid md:grid-cols-4 gap-6">
                      {arrivalSteps.map((step, index) => (
                        <div key={index} className="text-center">
                          <div className="relative mb-4">
                            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                              <step.icon className="h-8 w-8 text-white" />
                            </div>
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-black font-bold text-xs">
                              {step.step}
                            </div>
                          </div>
                          <h3 className="text-sm font-bold text-gray-800 mb-2">{step.title}</h3>
                          <p className="text-xs text-gray-600">{step.description}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-8 text-center">
                      <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-12 py-4 text-lg font-semibold">
                        입국 패스트트랙 예약하기
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* 출국 서비스 */}
              {selectedService === 'departure' && (
                <Card className="shadow-xl border-0 relative overflow-hidden">
                  <div className="h-2 bg-gradient-to-r from-purple-500 to-pink-600"></div>
                  <CardHeader className="p-8 bg-gradient-to-br from-purple-50 to-pink-50">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <Plane className="h-8 w-8 text-white transform rotate-45" />
                      </div>
                      <CardTitle className="text-3xl font-bold text-gray-800 mb-2">출국 패스트트랙</CardTitle>
                      <p className="text-gray-600">베트남 출발 시 프리미엄 서비스</p>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="grid md:grid-cols-4 gap-6">
                      {departureSteps.map((step, index) => (
                        <div key={index} className="text-center">
                          <div className="relative mb-4">
                            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                              <step.icon className="h-8 w-8 text-white" />
                            </div>
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-black font-bold text-xs">
                              {step.step}
                            </div>
                          </div>
                          <h3 className="text-sm font-bold text-gray-800 mb-2">{step.title}</h3>
                          <p className="text-xs text-gray-600">{step.description}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-8 text-center">
                      <Button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-12 py-4 text-lg font-semibold">
                        출국 패스트트랙 예약하기
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </section>

        {/* FAQ 섹션 */}
        <section className="py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-2 bg-orange-100 px-4 py-2 rounded-full text-orange-700 text-sm font-medium mb-6">
                <HelpCircle className="h-4 w-4" />
                <span>자주 묻는 질문</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                자주 묻는 질문 (FAQ)
              </h2>
              <p className="text-gray-600 text-xl max-w-3xl mx-auto">
                궁금한 점들을 미리 확인해보세요
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="space-y-4">
                {faqData.map((faq, index) => (
                  <Card key={index} className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden">
                    <CardHeader 
                      className="cursor-pointer p-6 hover:bg-purple-50/50 transition-colors duration-300"
                      onClick={() => setSelectedFaq(selectedFaq === index ? -1 : index)}
                    >
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-bold text-gray-900 flex items-center">
                          <HelpCircle className="h-6 w-6 text-purple-600 mr-3" />
                          {faq.question}
                        </CardTitle>
                        <div className={`transform transition-transform duration-300 ${selectedFaq === index ? 'rotate-180' : ''}`}>
                          {selectedFaq === index ? (
                            <ChevronUp className="h-5 w-5 text-gray-500" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-gray-500" />
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    
                    {selectedFaq === index && (
                      <CardContent className="px-6 pb-6 pt-0">
                        <div className="pl-9">
                          <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 최종 CTA 섹션 */}
        <section className="py-20 bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 text-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-2 bg-yellow-500/20 backdrop-blur-sm border border-yellow-400/30 px-6 py-3 rounded-full text-yellow-300 text-sm font-semibold mb-8">
                <Star className="h-5 w-5" />
                <span>프리미엄 공항 서비스</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                여행의 품격을 높이는<br />
                가장 스마트한 선택
              </h2>
              <p className="text-slate-300 text-xl max-w-4xl mx-auto mb-12">
                긴 대기 줄에서의 시간 낭비, 이제 그만. 중요한 비즈니스와 편안한 여행의<br />
                모든 순간에 집중하세요. 지금 바로 Vietnamvisa24 공항 패스트트랙으로<br />
                차원이 다른 공항 경험을 예약하세요.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black px-8 py-4 text-xl font-bold shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  <Crown className="h-6 w-6 mr-3" />
                  지금 바로 예약하기
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="w-full sm:w-auto border-white/50 text-white hover:bg-white/10 px-8 py-4 text-xl backdrop-blur-sm"
                >
                  <Phone className="h-5 w-5 mr-2" />
                  전문가 상담받기
                </Button>
              </div>

              {/* 연락처 정보 */}
              <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <Card className="bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <MessageCircle className="h-10 w-10 text-yellow-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">카카오톡</h3>
                    <p className="text-slate-300 mb-4 text-sm">실시간 채팅 상담</p>
                    <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
                      hcm2424
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <MessageCircle className="h-10 w-10 text-blue-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">잘로 (Zalo)</h3>
                    <p className="text-slate-300 mb-4 text-sm">베트남 현지 상담</p>
                    <Button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold">
                      093 721 7284
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <Phone className="h-10 w-10 text-green-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">전화 상담</h3>
                    <p className="text-slate-300 mb-4 text-sm">직접 통화 상담</p>
                    <Button className="bg-green-500 hover:bg-green-600 text-white font-semibold">
                      +84 93 721 7284
                    </Button>
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
