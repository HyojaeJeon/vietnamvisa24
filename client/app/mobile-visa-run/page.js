'use client'

import React, { useState } from 'react';
import Header from '../src/components/header';
import Footer from '../src/components/footer';
import { Card, CardContent, CardHeader, CardTitle } from '../src/components/ui/card';
import { Button } from '../src/components/ui/button';
import { 
  Car,
  MapPin,
  Clock,
  Shield,
  Star,
  CheckCircle,
  Phone,
  MessageCircle,
  ArrowRight,
  Users,
  FileText,
  Globe,
  UserCheck,
  AlertCircle,
  Zap,
  Navigation,
  CarFront,
  HelpCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function MobileVisaRun() {
  const [expandedFaq, setExpandedFaq] = useState(null);

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const targetCustomers = [
    {
      icon: FileText,
      title: "비자 연장이 필요한 분",
      description: "기존 비자가 만료되어 새로운 비자로 갱신해야 하는 장기 체류자"
    },
    {
      icon: UserCheck,
      title: "비자 종류를 변경하려는 분",
      description: "관광 비자를 사업 비자로 변경하는 등, 베트남 내에서 체류 자격을 변경하고자 하는 분"
    },
    {
      icon: Globe,
      title: "무비자 재입국이 필요한 분",
      description: "비자 면제 협정 국가 국민으로, 체류 가능 기간을 새로 받기 위해 출국 후 재입국이 필요한 분"
    },
    {
      icon: Clock,
      title: "시간과 에너지를 아끼고 싶은 분",
      description: "하루 종일 소요되는 복잡한 비자런 과정을 최소한의 피로와 시간으로 해결하고 싶은 모든 분"
    }
  ];

  const serviceFeatures = [
    {
      icon: FileText,
      title: "서류 준비부터 완벽하게",
      description: "고객님의 비자런 목적에 맞는 필요 서류를 사전에 체크하고, 출입국 신고서 작성을 도와 서류 미비로 인한 문제를 원천 차단합니다."
    },
    {
      icon: AlertCircle,
      title: "현장 돌발상황 즉시 해결",
      description: "국경 심사관의 예상치 못한 질문이나, 까다로운 절차 요구 시 풍부한 경험을 바탕으로 즉각 개입하여 원활하게 문제를 해결합니다."
    },
    {
      icon: MessageCircle,
      title: "언어 장벽 제로",
      description: "국경 사무소 직원과의 모든 의사소통을 전담하여, 언어로 인한 오해나 불편함 없이 모든 절차를 신속하게 진행합니다."
    },
    {
      icon: Zap,
      title: "시간 및 에너지 절약",
      description: "가장 효율적인 동선과 절차 진행으로 불필요한 대기 시간을 최소화하여 고객님의 소중한 시간과 에너지를 지켜드립니다."
    },
    {
      icon: Shield,
      title: "사전 고지되지 않은 추가비용 제로",
      description: "서비스 비용 외 별도의 추가 비용이나 숨겨진 요금이 전혀 없습니다. 모든 비용은 예약 시점에 명확하게 안내해 드립니다."
    }
  ];

  const processSteps = [
    { icon: Phone, title: "예약 및 상담", description: "서비스 예약 및 필요 서류 안내" },
    { icon: Car, title: "숙소 앞 픽업", description: "지정된 시간에 숙소 앞에서 픽업" },
    { icon: Navigation, title: "목바이 국경으로 이동", description: "안전하고 편안한 프라이빗 차량으로 이동" },
    { icon: ArrowRight, title: "베트남 출국 수속", description: "출국 절차 진행 및 전문가 동행 지원" },
    { icon: Globe, title: "캄보디아 입/출국 수속", description: "캄보디아 국경 통과 절차" },
    { icon: CheckCircle, title: "베트남 재입국 수속", description: "새로운 비자 또는 무비자로 재입국" },
    { icon: MapPin, title: "원하는 목적지로 이동", description: "목적지까지 안전하게 이송" }
  ];

  const faqData = [
    {
      question: "목바이 국경 서비스는 주로 어떤 목적으로 이용되나요?",
      answer: "베트남 비자 유효기간이 만료되어 새로운 비자를 받거나 비자 면제 재입국을 위해 캄보디아 국경(목바이)을 통해 잠시 출국했다가 다시 베트남으로 입국하는 '비자런' 목적으로 가장 많이 이용됩니다."
    },
    {
      question: "서비스 이용 시 필요한 서류는 무엇인가요?",
      answer: "유효기간이 6개월 이상 남은 여권은 필수입니다. 목적에 따라 베트남 재입국을 위한 비자 초청장, 사진 등이 필요할 수 있습니다. 예약 시 고객님의 상황에 맞춰 필요한 서류를 상세히 안내해 드립니다."
    },
    {
      question: "전체 소요 시간은 얼마나 되나요?",
      answer: "픽업 장소(호치민 시내 기준)와 당일 국경 상황에 따라 달라지지만, 일반적으로 왕복 이동 및 국경 절차를 포함하여 약 5~7시간 정도 소요됩니다."
    },
    {
      question: "국경에서 예상치 못한 문제가 발생하면 어떻게 되나요?",
      answer: "저희 서비스를 이용하시면, 동행하는 가이드가 현장 경험을 바탕으로 문제 상황을 즉각 파악하고 해결을 위한 최선의 방법을 지원하므로 안심하셔도 됩니다."
    },
    {
      question: "차량은 몇 명까지 탑승 가능한가요?",
      answer: "모든 서비스는 프라이빗 차량으로 제공됩니다. 예약 시 인원수에 맞춰 가장 적합한 크기의 차량(세단, SUV, 승합차 등)을 배정해 드립니다."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white relative overflow-hidden">
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
                      <Car className="h-12 w-12 mx-auto opacity-50" />
                    </div>
                    <h3 className="text-lg font-semibold text-red-200 mb-2">좁고 불편한 로컬 버스</h3>
                    <p className="text-red-100 text-sm">지치고 불안한 비자런 여행</p>
                  </div>

                  {/* 편안한 상황 */}
                  <div className="bg-green-100/20 rounded-2xl p-6 border border-green-300/30">
                    <div className="text-green-200 mb-4">
                      <CarFront className="h-12 w-12 mx-auto" />
                    </div>
                    <h3 className="text-lg font-semibold text-green-200 mb-2">넓고 쾌적한 프라이빗 차량</h3>
                    <p className="text-green-100 text-sm">편안하고 안전한 전문 서비스</p>
                  </div>
                </div>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              단 하루의 투자로,<br />
              <span className="text-yellow-300">완벽한 베트남 체류를</span><br />
              이어가세요.
            </h1>
            <p className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto leading-relaxed text-blue-100">
              지치고 불안한 비자런, 이제 전문가와 함께 편안하게 끝내세요.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="w-full sm:w-auto bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black px-8 py-4 text-xl font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                onClick={() => document.getElementById('service-options').scrollIntoView({ behavior: 'smooth' })}
              >
                <ArrowRight className="h-6 w-6 mr-3" />
                서비스 옵션 보기
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="w-full sm:w-auto border-white/50 text-white hover:bg-white/10 px-8 py-4 text-xl backdrop-blur-sm"
              >
                <Phone className="h-5 w-5 mr-2" />
                지금 바로 상담하기
              </Button>
            </div>
          </div>
        </section>

        {/* 추천 고객 섹션 */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-2 bg-blue-100 px-4 py-2 rounded-full text-blue-700 text-sm font-medium mb-6">
                <Users className="h-4 w-4" />
                <span>추천 고객</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                이런 분들께 반드시 필요합니다!
              </h2>
              <p className="text-gray-600 text-xl max-w-4xl mx-auto">
                목바이 국경 서비스는 베트남 장기 체류를 위한 필수적인 과정을<br />
                가장 효율적이고 안전하게 해결해 드리는 솔루션입니다.
              </p>
            </div>

            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8">
                {targetCustomers.map((customer, index) => (
                  <Card key={index} className="shadow-lg border-0 hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-8">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
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

        {/* 서비스 섹션 */}
        <section id="service-options" className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-2 bg-green-100 px-4 py-2 rounded-full text-green-700 text-sm font-medium mb-6">
                <Car className="h-4 w-4" />
                <span>서비스</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                프라이빗 차량 서비스<br />
                <span className="text-blue-600">(Transportation Only)</span>
              </h2>
              <p className="text-gray-600 text-xl max-w-3xl mx-auto">
                국경 통과 절차에 익숙하며, 오직 안전하고 편안한 이동 수단만 필요한 분들을 위한 합리적인 선택입니다.
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <Card className="shadow-xl border-0 relative overflow-hidden hover:shadow-2xl transition-all duration-300">
                <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                <CardHeader className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                      <Car className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-bold text-gray-800">프라이빗 차량 서비스</CardTitle>
                      <p className="text-gray-600">Transportation Only</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="mb-8">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">포함 내역:</h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="text-gray-700">숙소 ↔ 목바이 국경 왕복 프라이빗 차량</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="text-gray-700">숙련된 운전기사</span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-8">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">추천 대상:</h4>
                    <p className="text-gray-600 leading-relaxed">
                      국경 통과 절차에 익숙하며, 오직 안전하고 편안한 이동 수단만 필요한 분들을 위한 합리적인 선택입니다.
                    </p>
                  </div>

                  <Button 
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-4 text-lg font-semibold shadow-xl"
                  >
                    지금 바로 예약하기
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* 서비스 특징 섹션 */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-2 bg-orange-100 px-4 py-2 rounded-full text-orange-700 text-sm font-medium mb-6">
                <Shield className="h-4 w-4" />
                <span>서비스 특징</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                완벽한 목바이 비자런 서비스
              </h2>
              <p className="text-gray-600 text-xl max-w-4xl mx-auto">
                단순한 이동을 넘어, 전 과정에서 안전하고 편안한 서비스를 제공합니다.
              </p>
            </div>

            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {serviceFeatures.map((feature, index) => (
                  <Card key={index} className="shadow-lg border-0 hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
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

        {/* 진행 과정 섹션 */}
        <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-2 bg-purple-100 px-4 py-2 rounded-full text-purple-700 text-sm font-medium mb-6">
                <Navigation className="h-4 w-4" />
                <span>진행 과정</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                목바이 국경 서비스 진행 과정
              </h2>
              <p className="text-gray-600 text-xl max-w-3xl mx-auto">
                안전하고 체계적인 7단계 프로세스
              </p>
            </div>

            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                {processSteps.map((step, index) => (
                  <div key={index} className="text-center">
                    <div className="relative mb-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                        <step.icon className="h-8 w-8 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-black font-bold text-xs">
                        {index + 1}
                      </div>
                    </div>
                    <h3 className="text-sm font-bold text-gray-800 mb-2">{step.title}</h3>
                    <p className="text-xs text-gray-600">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ 섹션 */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-2 bg-green-100 px-4 py-2 rounded-full text-green-700 text-sm font-medium mb-6">
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
                  <Card key={index} className="shadow-lg border-0">
                    <CardHeader 
                      className="cursor-pointer hover:bg-blue-50 transition-colors p-6"
                      onClick={() => toggleFaq(index)}
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-800">{faq.question}</h3>
                        {expandedFaq === index ? (
                          <ChevronUp className="h-5 w-5 text-blue-500" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-blue-500" />
                        )}
                      </div>
                    </CardHeader>
                    {expandedFaq === index && (
                      <CardContent className="p-6 pt-0">
                        <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 최종 CTA 섹션 */}
        <section className="py-20 bg-gradient-to-br from-slate-800 to-slate-900 text-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-2 bg-yellow-500/20 backdrop-blur-sm border border-yellow-400/30 px-6 py-3 rounded-full text-yellow-300 text-sm font-semibold mb-8">
                <Star className="h-5 w-5" />
                <span>고객 만족도 99.8%</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                가장 스마트하게 베트남 체류를<br />
                연장하는 방법
              </h2>
              <p className="text-slate-300 text-xl max-w-4xl mx-auto mb-12">
                지치고 복잡한 비자런은 이제 그만! Vietnamvisa24의 안전하고 편안한<br />
                목바이 국경 서비스로 당신의 소중한 시간과 에너지를 절약하세요.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black px-8 py-4 text-xl font-bold shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  <Car className="h-6 w-6 mr-3" />
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