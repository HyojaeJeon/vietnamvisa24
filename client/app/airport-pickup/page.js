
'use client'

import React, { useState } from 'react';
import Header from '../src/components/header';
import Footer from '../src/components/footer';
import { Card, CardContent, CardHeader, CardTitle } from '../src/components/ui/card';
import { Button } from '../src/components/ui/button';
import { 
  Plane, 
  Shield, 
  CheckCircle, 
  Users, 
  MessageCircle, 
  Phone,
  Clock,
  MapPin,
  Heart,
  Car,
  ArrowRight,
  Sparkles,
  Award,
  Star,
  HelpCircle,
  Lock,
  UserCheck,
  DollarSign,
  Luggage,
  Navigation,
  Timer,
  AlertCircle,
  CreditCard,
  Globe
} from 'lucide-react';

export default function AirportPickup() {
  const [selectedFaq, setSelectedFaq] = useState(0);

  const targetCustomers = [
    {
      title: "처음이라 낯선 분",
      description: "베트남에 처음 방문하여 공항 출구부터 목적지까지 가는 길이 막막하고 불안한 여행객",
      icon: MapPin,
      color: "from-blue-500 to-indigo-600"
    },
    {
      title: "시간이 금인 분",
      description: "1분 1초가 중요한 비즈니스 미팅, 또는 촉박한 일정으로 빠른 이동이 필수적인 출장자",
      icon: Clock,
      color: "from-orange-500 to-red-600"
    },
    {
      title: "가족과 함께하는 분",
      description: "어린 자녀나 연로하신 부모님과 함께하여 짐이 많고, 안전하고 편안한 이동이 최우선인 가족 여행객",
      icon: Users,
      color: "from-emerald-500 to-cyan-600"
    },
    {
      title: "안전이 최우선인 분",
      description: "늦은 밤 또는 새벽 비행기로 도착하여 대중교통 이용이 걱정되고, 검증된 드라이버의 안전한 운행을 원하는 모든 고객",
      icon: Shield,
      color: "from-purple-500 to-pink-600"
    }
  ];

  const serviceStrengths = [
    {
      title: "투명한 정찰제 요금",
      description: "사전에 확정된 고정 요금으로, 현장에서의 바가지요금이나 예상치 못한 추가 비용 걱정을 완전히 없앴습니다. 숨겨진 비용 없이 안심하고 이용하세요.",
      icon: DollarSign,
      gradient: "from-green-500 to-emerald-600"
    },
    {
      title: "'예약 펑크' 걱정 없는 시스템",
      description: "고객님의 항공편을 실시간으로 추적합니다. 비행기가 연착되어도 추가 요금 없이 변경된 시간에 맞춰 드라이버가 대기하며, '노쇼'나 장시간 대기 문제를 원천적으로 차단합니다.",
      icon: Timer,
      gradient: "from-blue-500 to-cyan-600"
    },
    {
      title: "믿을 수 있는 드라이버와 차량",
      description: "예약 확정 시, 배정될 차량(차종, 번호)과 드라이버(이름, 사진, 연락처) 정보를 사전에 투명하게 공개하여 신뢰를 더합니다.",
      icon: UserCheck,
      gradient: "from-purple-500 to-indigo-600"
    },
    {
      title: "언어 장벽 없는 편안함",
      description: "의사소통 문제로 인한 불편함이 없도록, 기본적인 영어 소통이 가능한 드라이버를 배정하거나 실시간 소통 지원 시스템을 통해 원활한 이동을 돕습니다.",
      icon: Globe,
      gradient: "from-orange-500 to-red-600"
    }
  ];

  const pricingData = [
    {
      vehicle: "4인승 세단",
      capacity: "1~3인 탑승",
      destinations: [
        { area: "1군, 3군, 푸년군", price: "$25" },
        { area: "2군, 7군, 빈탄군", price: "$30" }
      ]
    },
    {
      vehicle: "7인승 SUV",
      capacity: "4~5인 탑승",
      destinations: [
        { area: "1군, 3군, 푸년군", price: "$35" },
        { area: "2군, 7군, 빈탄군", price: "$40" }
      ]
    },
    {
      vehicle: "16인승 승합차",
      capacity: "6~12인 탑승",
      destinations: [
        { area: "별도 문의", price: "별도 문의" }
      ]
    }
  ];

  const processSteps = [
    {
      step: 1,
      title: "온라인 예약",
      description: "웹사이트 또는 카카오톡/Zalo를 통해 목적지, 항공편명, 인원 등 필수 정보를 입력하고 예약을 완료합니다.",
      icon: CreditCard,
      gradient: "from-blue-500 to-indigo-600"
    },
    {
      step: 2,
      title: "예약 정보 확인",
      description: "예약 확정 후, 배정된 드라이버와 차량 정보를 메시지로 전송해 드립니다.",
      icon: CheckCircle,
      gradient: "from-green-500 to-emerald-600"
    },
    {
      step: 3,
      title: "미팅 장소 안내",
      description: "공항 도착 전, 이름표를 든 드라이버가 대기할 정확한 미팅 포인트(예: 10번 출구 기둥)를 안내해 드립니다.",
      icon: MapPin,
      gradient: "from-purple-500 to-pink-600"
    },
    {
      step: 4,
      title: "드라이버 미팅",
      description: "안내된 장소에서 피켓을 든 드라이버를 만나 차량으로 안전하게 이동합니다.",
      icon: UserCheck,
      gradient: "from-orange-500 to-red-600"
    },
    {
      step: 5,
      title: "목적지 도착",
      description: "가장 안전하고 효율적인 경로로 목적지까지 편안하게 이동한 후 서비스가 종료됩니다.",
      icon: Navigation,
      gradient: "from-cyan-500 to-blue-600"
    }
  ];

  const faqs = [
    {
      question: "비행기가 연착되면 어떻게 하나요?",
      answer: "걱정하지 마십시오. 저희는 고객님의 항공편 정보를 실시간으로 추적하고 있으므로, 변경된 도착 시간에 맞춰 추가 요금 없이 드라이버가 대기할 예정입니다."
    },
    {
      question: "예약 변경 또는 취소는 어떻게 하나요?",
      answer: "예약 변경 및 취소는 서비스 이용 시간 기준 최소 24시간 전까지 가능하며, 별도의 수수료가 발생하지 않습니다. 그 이후 시간에는 규정에 따른 수수료가 발생할 수 있으니, 자세한 내용은 예약 시 안내되는 약관을 참고해 주시기 바랍니다."
    },
    {
      question: "드라이버에게 팁을 주어야 하나요?",
      answer: "팁은 의무 사항이 아니며, 요금에 포함되어 있지 않습니다. 서비스에 만족하셨다면 감사의 표시로 주실 수 있으나 전혀 부담 갖지 않으셔도 됩니다. 만약 드라이버가 팁을 요구하는 불편한 상황이 발생하면, 절대 응하지 마시고 즉시 저희 고객센터로 연락 주십시오."
    },
    {
      question: "짐이 많거나 부피가 큰 짐(골프백 등)이 있어도 괜찮나요?",
      answer: "네, 괜찮습니다. 예약 시 인원수와 짐 개수를 정확하게 기재해 주시면, 그에 맞는 적절한 크기의 차량을 배정해 드립니다. 부피가 큰 짐이 있다면 예약 시 비고란에 남겨주시면 더욱 원활한 배정에 도움이 됩니다."
    },
    {
      question: "제가 예약한 차량과 다른 종류의 차량이 올 수도 있나요?",
      answer: "저희는 고객님께서 예약하신 등급 또는 그 이상의 차량으로 배정하는 것을 원칙으로 합니다. 만약 부득이하게 동급의 다른 차종이 배정될 경우, 사전에 고객님께 안내해 드리고 있으며 서비스 품질에는 차이가 없도록 철저히 관리하고 있으니 안심하셔도 좋습니다."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Header />

      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900"></div>
          <div className="absolute inset-0 opacity-10"
               style={{
                 backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M20 20h20v20H20V20zm20 0h20v20H40V20zm0 20h20v20H40V40zm-20 0h20v20H20V40z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
               }}>
          </div>

          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-purple-400/20 to-blue-500/20 rounded-full blur-xl animate-pulse" style={{animationDelay: '2s'}}></div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 px-6 py-3 rounded-full mb-8">
                  <Plane className="h-5 w-5 text-blue-400" />
                  <span className="text-white font-semibold">Vietnamvisa24 공항 픽업 서비스</span>
                  <Award className="h-5 w-5 text-blue-400" />
                </div>

                <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-8">
                  베트남 공항 도착,
                  <br />
                  <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                    설렘만 남기고 걱정은 끝.
                  </span>
                </h1>

                <p className="text-xl md:text-2xl text-blue-100 leading-relaxed mb-12 max-w-4xl mx-auto">
                  안전하고 편안한 Vietnamvisa24 공항 픽업 서비스로
                  <br className="hidden md:block" />
                  <span className="text-cyan-300 font-semibold">당신의 완벽한 여행을 시작하세요</span>
                </p>

                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                  <Button 
                    size="lg"
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-10 py-6 text-lg font-bold shadow-2xl shadow-blue-500/25 transform hover:scale-105 transition-all duration-300 group"
                  >
                    <Car className="h-6 w-6 mr-3 group-hover:rotate-12 transition-transform" />
                    지금 바로 예약하기
                    <ArrowRight className="h-6 w-6 ml-3 group-hover:translate-x-1 transition-transform" />
                  </Button>

                  <Button 
                    size="lg"
                    variant="outline"
                    className="border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm px-10 py-6 text-lg font-semibold transition-all duration-300"
                  >
                    <DollarSign className="h-6 w-6 mr-3" />
                    서비스 요금 확인
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
                {[
                  { number: "24/7", label: "실시간 추적", icon: Clock },
                  { number: "100%", label: "투명한 요금", icon: DollarSign },
                  { number: "검증된", label: "전문 드라이버", icon: UserCheck },
                  { number: "즉시", label: "예약 확정", icon: CheckCircle }
                ].map((stat, index) => {
                  const IconComponent = stat.icon;
                  return (
                    <div key={index} className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                      <IconComponent className="h-8 w-8 text-blue-400 mx-auto mb-3" />
                      <div className="text-2xl font-bold text-white mb-1">{stat.number}</div>
                      <div className="text-blue-200 text-sm">{stat.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* 추천 고객 섹션 */}
        <section className="py-20 bg-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>

          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-full text-blue-700 text-sm font-medium mb-6">
                <Users className="h-4 w-4" />
                <span>추천 고객</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  이런 분들께 추천합니다!
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Vietnamvisa24의 공항 픽업 서비스는 단순한 이동을 넘어, 고객님의 소중한 시간과 안전을 지키는 가장 확실한 첫걸음입니다
              </p>
            </div>

            <div className="grid lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {targetCustomers.map((customer, index) => {
                const IconComponent = customer.icon;
                return (
                  <div key={index} className="group relative">
                    <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-500 group-hover:scale-105 rounded-3xl overflow-hidden">
                      <div className={`h-2 bg-gradient-to-r ${customer.color} rounded-t-3xl`}></div>
                      
                      <CardHeader className="text-center pt-8 pb-4">
                        <div className={`w-20 h-20 bg-gradient-to-br ${customer.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg transform group-hover:rotate-6 transition-transform duration-300`}>
                          <IconComponent className="h-10 w-10 text-white" />
                        </div>
                        <CardTitle className="text-xl font-bold text-gray-900">{customer.title}</CardTitle>
                      </CardHeader>
                      
                      <CardContent className="px-6 pb-8">
                        <p className="text-gray-600 leading-relaxed text-sm">{customer.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 서비스 강점 섹션 */}
        <section className="py-20 bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 relative">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                  Vietnamvisa24 픽업 서비스는 무엇이 다른가요?
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto">
                저희는 현지 공항에서 발생할 수 있는 모든 불편함을 예측하고, 체계적인 시스템으로 완벽하게 해결합니다
              </p>
            </div>

            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {serviceStrengths.map((strength, index) => {
                  const IconComponent = strength.icon;

                  return (
                    <div key={index} className="text-center relative group">
                      <div className="relative z-10 group-hover:scale-105 transition-transform duration-300">
                        <div className={`w-32 h-32 bg-gradient-to-br ${strength.gradient} rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:shadow-2xl transition-shadow duration-300`}>
                          <IconComponent className="h-12 w-12 text-white" />
                        </div>

                        <h3 className="text-lg font-bold text-gray-900 mb-3">{strength.title}</h3>
                        <p className="text-gray-600 leading-relaxed text-sm">{strength.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* 요금 안내 섹션 */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  투명한 정찰제 요금 안내
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto">
                모든 요금은 통행료 및 유류비가 포함된 최종 금액입니다. 예약 시 결제한 금액 외에 어떠한 추가 비용도 요구하지 않습니다.
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="grid gap-6">
                {pricingData.map((pricing, index) => (
                  <Card key={index} className="bg-gradient-to-r from-green-50 to-emerald-50 border-0 shadow-lg rounded-2xl overflow-hidden">
                    <CardContent className="p-8">
                      <div className="flex flex-col md:flex-row items-center justify-between">
                        <div className="text-center md:text-left mb-4 md:mb-0">
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">{pricing.vehicle}</h3>
                          <p className="text-gray-600 font-medium">({pricing.capacity})</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full md:w-auto">
                          {pricing.destinations.map((dest, destIndex) => (
                            <div key={destIndex} className="bg-white rounded-xl p-4 shadow-sm">
                              <div className="text-sm text-gray-600 mb-1">{dest.area}</div>
                              <div className="text-xl font-bold text-green-600">{dest.price}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="mt-8 bg-amber-50 border-l-4 border-amber-400 p-6 rounded-r-xl">
                <div className="flex items-start">
                  <AlertCircle className="h-6 w-6 text-amber-400 mr-3 flex-shrink-0 mt-1" />
                  <div className="text-sm text-amber-800">
                    <p className="font-semibold mb-2">참고사항:</p>
                    <ul className="space-y-1">
                      <li>• 위 요금은 예시이며, 실제 요금은 예약 시점에 따라 변동될 수 있습니다.</li>
                      <li>• 부피가 큰 짐(골프백, 대형 캐리어 등)이 많을 경우, 원활한 탑승을 위해 한 단계 위 등급의 차량 예약을 권장합니다.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 이용 방법 섹션 */}
        <section className="py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  간편한 이용 방법 (5단계)
                </span>
              </h2>
            </div>

            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-5 gap-8">
                {processSteps.map((step, index) => {
                  const IconComponent = step.icon;

                  return (
                    <div key={index} className="text-center relative group">
                      {index < processSteps.length - 1 && (
                        <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-purple-300 to-indigo-400 z-0"
                             style={{ transform: 'translateX(-50%)' }}></div>
                      )}

                      <div className="relative z-10 group-hover:scale-105 transition-transform duration-300">
                        <div className={`w-32 h-32 bg-gradient-to-br ${step.gradient} rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:shadow-2xl transition-shadow duration-300`}>
                          <IconComponent className="h-12 w-12 text-white" />
                        </div>

                        <div className="absolute -top-4 -right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center text-lg font-bold text-gray-900 shadow-lg border-4 border-purple-100">
                          {step.step}
                        </div>

                        <h3 className="text-lg font-bold text-gray-900 mb-3">{step.title}</h3>
                        <p className="text-gray-600 leading-relaxed text-sm">{step.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ 섹션 */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  자주 묻는 질문 (FAQ)
                </span>
              </h2>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <Card key={index} className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden">
                    <CardHeader 
                      className="cursor-pointer p-6 hover:bg-blue-50/50 transition-colors duration-300"
                      onClick={() => setSelectedFaq(selectedFaq === index ? -1 : index)}
                    >
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-bold text-gray-900 flex items-center">
                          <HelpCircle className="h-6 w-6 text-blue-600 mr-3" />
                          {faq.question}
                        </CardTitle>
                        <div className={`transform transition-transform duration-300 ${selectedFaq === index ? 'rotate-180' : ''}`}>
                          <ArrowRight className="h-5 w-5 text-gray-500" />
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

        {/* CTA 섹션 */}
        <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10"
               style={{
                 backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
               }}>
          </div>

          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="max-w-5xl mx-auto">
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full mb-8">
                <Clock className="h-5 w-5 text-cyan-400" />
                <span className="text-white font-semibold">24시간 예약 가능</span>
              </div>

              <h2 className="text-4xl md:text-6xl font-bold mb-8">
                지금 바로 예약하고,
                <br />
                <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  편안한 여행을 시작하세요
                </span>
              </h2>

              <p className="text-xl md:text-2xl text-blue-100 mb-12 leading-relaxed">
                더 이상 공항에서 헤매거나 바가지요금 걱정으로 스트레스받지 마세요.
                <br />
                지금 바로 Vietnamvisa24의 안전하고 편안한 공항 픽업 서비스를 예약하고 여행의 시작을 가장 기분 좋게 만드세요.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-12 py-6 text-xl font-bold shadow-2xl shadow-cyan-500/25 transform hover:scale-105 transition-all duration-300 group rounded-2xl"
                >
                  <Car className="h-6 w-6 mr-3 group-hover:rotate-12 transition-transform" />
                  지금 바로 예약하기
                  <ArrowRight className="h-6 w-6 ml-3 group-hover:translate-x-1 transition-transform" />
                </Button>

                <div className="flex gap-4">
                  <Button 
                    size="lg"
                    variant="outline"
                    className="border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm px-8 py-6 text-lg font-semibold transition-all duration-300 rounded-2xl"
                  >
                    <MessageCircle className="h-6 w-6 mr-2" />
                    KAKAO: hcm2424
                  </Button>

                  <Button 
                    size="lg"
                    variant="outline"
                    className="border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm px-8 py-6 text-lg font-semibold transition-all duration-300 rounded-2xl"
                  >
                    <Phone className="h-6 w-6 mr-2" />
                    Zalo: 093 721 7284
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { icon: Shield, text: "안전 보장" },
                  { icon: DollarSign, text: "투명한 요금" },
                  { icon: Clock, text: "실시간 추적" },
                  { icon: Award, text: "전문 서비스" }
                ].map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <div key={index} className="flex flex-col items-center text-center">
                      <IconComponent className="h-8 w-8 text-cyan-400 mb-2" />
                      <span className="text-blue-200 text-sm">{item.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Company Info */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">VietnamVisa24</h3>
            <div className="space-y-2 text-gray-600">
              <p>사업자 등록번호 : 79-1252/2021</p>
              <p>Address : 93 Cao Trieu Phat. Tan Phong Ward, District 7, Phu My Hung, HCMC.</p>
              <p className="text-sm">Copyright ⓒ 2025 VietnamVisa24 All rights reserved.</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
