
'use client'

import React, { useState } from 'react';
import Header from '../src/components/header';
import Footer from '../src/components/footer';
import { Card, CardContent, CardHeader, CardTitle } from '../src/components/ui/card';
import { Button } from '../src/components/ui/button';
import { 
  AlertTriangle, 
  Shield, 
  CheckCircle, 
  Users, 
  MessageCircle, 
  Phone,
  Clock,
  FileText,
  MapPin,
  Eye,
  Heart,
  Calendar,
  ArrowRight,
  Sparkles,
  Award,
  Target,
  Zap,
  PlayCircle,
  Star,
  HelpCircle,
  Lock,
  UserCheck,
  Scale,
  Briefcase
} from 'lucide-react';

export default function Overstay() {
  const [selectedFaq, setSelectedFaq] = useState(0);

  const urgentSteps = [
    {
      number: 1,
      title: "혼자 걱정하지 마세요",
      description: "불안감은 상황을 정확히 판단하는 데 방해가 될 뿐입니다. 10년 경력의 전문가가 고객님과 함께하며 가장 현실적인 해결책을 찾아드립니다.",
      icon: Heart,
      color: "from-blue-500 to-indigo-600"
    },
    {
      number: 2,
      title: "임의로 행동하지 마세요",
      description: "미해결 상태로 공항에 가거나, 부정확한 정보에 의존해 행동하면 벌금이 가중되거나 향후 입국 금지 등 더 큰 문제로 번질 수 있습니다.",
      icon: AlertTriangle,
      color: "from-orange-500 to-red-600"
    },
    {
      number: 3,
      title: "즉시 전문가와 상담하세요",
      description: "저희의 비공개 무료 상담을 통해 현재 상황을 정확히 진단하는 것이 급선무입니다. 상담 내용은 철저히 비밀이 보장됩니다.",
      icon: MessageCircle,
      color: "from-emerald-500 to-cyan-600"
    }
  ];

  const processSteps = [
    {
      step: 1,
      title: "1:1 비공개 상황 진단",
      description: "문의 접수 시, 고객님의 오버스테이 기간, 비자 종류 등 현재 상황을 비대면 채널을 통해 상세히 파악하고 문제의 난이도를 정확하게 진단합니다.",
      icon: Eye,
      gradient: "from-purple-500 to-indigo-600"
    },
    {
      step: 2,
      title: "맞춤 해결 방안 및 비용 안내",
      description: "진단 결과를 바탕으로, 가장 효과적인 해결 방안과 절차, 필요한 서류 목록, 그리고 예상 벌금과 서비스 수수료를 포함한 전체 비용을 사전에 투명하게 안내합니다.",
      icon: FileText,
      gradient: "from-blue-500 to-cyan-600"
    },
    {
      step: 3,
      title: "서류 준비 및 제출 대행",
      description: "고객님께서는 저희가 요청하는 기본 서류만 준비해 주시면 됩니다. 복잡한 현지 서류 작성 및 출입국 관리 사무소 제출까지, 모든 과정을 저희 전문가가 대행하여 고객님의 부담을 덜어드립니다.",
      icon: Briefcase,
      gradient: "from-emerald-500 to-teal-600"
    },
    {
      step: 4,
      title: "현지 기관 소통 및 문제 해결",
      description: "출입국 관리 사무소와의 모든 소통은 베트남 현지 법규와 행정에 능통한 저희 전문가가 책임집니다. 필요시 사무소에 동행하여 언어 문제부터 돌발 상황까지 완벽하게 해결합니다.",
      icon: UserCheck,
      gradient: "from-orange-500 to-red-600"
    },
    {
      step: 5,
      title: "최종 결과 보고",
      description: "벌금 납부, 출국 허가 등 모든 절차가 완료되면, 최종 처리 결과와 관련 서류를 고객님께 상세히 보고하며 서비스를 마무리합니다.",
      icon: CheckCircle,
      gradient: "from-green-500 to-emerald-600"
    }
  ];

  const serviceScope = [
    "1:1 비공개 상황 진단 및 맞춤 해결책 제시",
    "오버스테이 기간에 따른 벌금 산정 및 납부 절차 안내",
    "출입국 관리 사무소 제출 서류 일체 준비 및 대행",
    "출입국 관리 사무소 동행 및 통역 지원 (필요시)",
    "향후 베트남 재입국 관련 법률 자문"
  ];

  const faqs = [
    {
      question: "오버스테이 기간이 길어도 해결 가능한가요?",
      answer: "네, 가능합니다. 오버스테이 기간에 따라 벌금 액수와 절차의 복잡성은 달라지지만, 기간과 상관없이 해결 방안을 찾을 수 있습니다. 정확한 상황 진단 후 최적의 해결책을 제시해 드립니다."
    },
    {
      question: "해결 비용은 얼마나 드나요?",
      answer: "비용은 오버스테이 기간, 기존 비자 종류, 상황의 복잡성 등에 따라 개인별로 다르게 책정됩니다. 초기 상담 시 고객님의 상황에 맞춰 예상 벌금과 서비스 수수료를 포함한 전체 비용 견적을 사전에 명확하게 안내해 드립니다."
    },
    {
      question: "개인 정보 및 오버스테이 사실에 대해 비밀 보장이 되나요?",
      answer: "네, 그럼요. 고객님의 모든 개인 정보와 상담 내용은 철저하게 비밀이 보장됩니다. 고객님의 동의 없이는 어떠한 정보도 외부에 공개되지 않으니 안심하고 상담받으세요."
    },
    {
      question: "해결까지 얼마나 시간이 소요되나요?",
      answer: "소요 시간은 출입국 관리 사무소의 업무 처리 속도 및 개인 상황에 따라 유동적입니다. 평균적인 소요 기간은 안내해 드릴 수 있으나, 정확한 날짜를 보장하기는 어렵습니다. 다만, 모든 진행 상황은 단계별로 투명하게 공유해 드립니다."
    },
    {
      question: "오버스테이 문제를 해결하지 않으면 어떻게 되나요?",
      answer: "오버스테이 문제를 해결하지 않고 방치할 경우, 상당한 금액의 벌금이 누적될 뿐만 아니라 베트남에서 강제 출국 조치될 수 있습니다. 또한, 향후 베트남 입국이 영구적 또는 장기간 금지될 수 있어 반드시 해결해야 하는 중요한 문제입니다."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50">
      <Header />

      <main className="pt-16">
        {/* Hero Section - 완전히 새로운 디자인 */}
        <section className="relative py-24 overflow-hidden">
          {/* 배경 그라디언트와 패턴 */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-900 via-orange-900 to-amber-900"></div>
          <div className="absolute inset-0 opacity-10"
               style={{
                 backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M20 20h20v20H20V20zm20 0h20v20H40V20zm0 20h20v20H40V40zm-20 0h20v20H20V40z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
               }}>
          </div>

          {/* 동적 요소들 */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-orange-400/20 to-red-500/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-amber-400/20 to-orange-500/20 rounded-full blur-xl animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/2 w-20 h-20 bg-gradient-to-br from-red-400/20 to-pink-500/20 rounded-full blur-xl animate-pulse" style={{animationDelay: '4s'}}></div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                {/* 배지 */}
                <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 px-6 py-3 rounded-full mb-8">
                  <Shield className="h-5 w-5 text-amber-400" />
                  <span className="text-white font-semibold">전문가 오버스테이 해결 서비스</span>
                  <Award className="h-5 w-5 text-amber-400" />
                </div>

                {/* 메인 헤드라인 */}
                <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-8">
                  혼자서는 막막한
                  <br />
                  <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                    베트남 오버스테이
                  </span>
                </h1>

                <p className="text-xl md:text-2xl text-orange-100 leading-relaxed mb-12 max-w-4xl mx-auto">
                  전문가가 가장 안전한 길을 안내합니다
                  <br className="hidden md:block" />
                  <span className="text-amber-300 font-semibold">비공개 1:1 상담으로 지금 바로 해결을 시작하세요</span>
                </p>

                {/* CTA 버튼들 */}
                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                  <Button 
                    size="lg"
                    className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-10 py-6 text-lg font-bold shadow-2xl shadow-amber-500/25 transform hover:scale-105 transition-all duration-300 group"
                  >
                    <Lock className="h-6 w-6 mr-3 group-hover:rotate-12 transition-transform" />
                    전문가와 비공개 상담하기
                    <ArrowRight className="h-6 w-6 ml-3 group-hover:translate-x-1 transition-transform" />
                  </Button>

                  <Button 
                    size="lg"
                    variant="outline"
                    className="border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm px-10 py-6 text-lg font-semibold transition-all duration-300"
                  >
                    <PlayCircle className="h-6 w-6 mr-3" />
                    해결 절차 알아보기
                  </Button>
                </div>
              </div>

              {/* 실시간 통계 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
                {[
                  { number: "10+", label: "년 전문 경험", icon: Award },
                  { number: "100%", label: "비밀 보장", icon: Lock },
                  { number: "24/7", label: "긴급 상담", icon: MessageCircle },
                  { number: "99%", label: "해결 성공률", icon: CheckCircle }
                ].map((stat, index) => {
                  const IconComponent = stat.icon;
                  return (
                    <div key={index} className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                      <IconComponent className="h-8 w-8 text-amber-400 mx-auto mb-3" />
                      <div className="text-2xl font-bold text-white mb-1">{stat.number}</div>
                      <div className="text-orange-200 text-sm">{stat.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* 긴급 행동 지침 섹션 */}
        <section className="py-20 bg-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent"></div>

          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-2 bg-red-50 px-4 py-2 rounded-full text-red-700 text-sm font-medium mb-6">
                <AlertTriangle className="h-4 w-4" />
                <span>긴급 행동 지침</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                  오버스테이 사실을 알게 되셨다면
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                당황스럽고 불안하시겠지만, 침착한 초기 대응이 가장 중요합니다
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {urgentSteps.map((step, index) => {
                const IconComponent = step.icon;
                return (
                  <div key={index} className="group relative">
                    <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg z-10">
                      {step.number}
                    </div>
                    
                    <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-500 group-hover:scale-105 rounded-3xl overflow-hidden pt-8">
                      <div className={`h-2 bg-gradient-to-r ${step.color} rounded-t-3xl`}></div>
                      
                      <CardHeader className="text-center pt-8 pb-4">
                        <div className={`w-20 h-20 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg transform group-hover:rotate-6 transition-transform duration-300`}>
                          <IconComponent className="h-10 w-10 text-white" />
                        </div>
                        <CardTitle className="text-xl font-bold text-gray-900">{step.title}</CardTitle>
                      </CardHeader>
                      
                      <CardContent className="px-6 pb-8">
                        <p className="text-gray-600 leading-relaxed">{step.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 전문 해결 프로세스 섹션 */}
        <section className="py-20 bg-gradient-to-br from-slate-50 via-gray-50 to-orange-50 relative">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  전문적이고 투명한 해결 프로세스
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto">
                복잡하고 불투명한 오버스테이 해결 과정을 처음부터 끝까지 투명하게 진행합니다
              </p>
            </div>

            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-5 gap-8">
                {processSteps.map((step, index) => {
                  const IconComponent = step.icon;

                  return (
                    <div key={index} className="text-center relative group">
                      {/* 연결선 */}
                      {index < processSteps.length - 1 && (
                        <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-orange-300 to-red-400 z-0"
                             style={{ transform: 'translateX(-50%)' }}></div>
                      )}

                      {/* 단계 카드 */}
                      <div className="relative z-10 group-hover:scale-105 transition-transform duration-300">
                        <div className={`w-32 h-32 bg-gradient-to-br ${step.gradient} rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:shadow-2xl transition-shadow duration-300`}>
                          <IconComponent className="h-12 w-12 text-white" />
                        </div>

                        {/* 단계 번호 */}
                        <div className="absolute -top-4 -right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center text-lg font-bold text-gray-900 shadow-lg border-4 border-orange-100">
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

        {/* 대행 서비스 범위 섹션 */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    전문 서비스 범위
                  </span>
                </h2>
                <p className="text-xl text-gray-600">
                  단순히 서류를 전달하는 대행사가 아닙니다. 고객이 겪는 모든 과정을 함께하는 법률 행정 파트너입니다.
                </p>
              </div>

              <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-0 shadow-xl rounded-3xl overflow-hidden">
                <CardContent className="p-8">
                  <div className="space-y-6">
                    {serviceScope.map((service, index) => (
                      <div key={index} className="flex items-start space-x-4 p-4 bg-white/50 backdrop-blur-sm rounded-xl hover:bg-white/70 transition-colors duration-300">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="h-5 w-5 text-white" />
                        </div>
                        <p className="text-gray-700 leading-relaxed font-medium">{service}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ 섹션 */}
        <section className="py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  자주 묻는 질문
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

        {/* CTA 섹션 - 강력한 마무리 */}
        <section className="py-20 bg-gradient-to-br from-slate-900 via-red-900 to-orange-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10"
               style={{
                 backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
               }}>
          </div>

          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="max-w-5xl mx-auto">
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full mb-8">
                <Clock className="h-5 w-5 text-amber-400" />
                <span className="text-white font-semibold">24시간 긴급 상담 가능</span>
              </div>

              <h2 className="text-4xl md:text-6xl font-bold mb-8">
                가장 빠른 해결은,
                <br />
                <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                  지금 바로 전문가와 이야기하는 것입니다
                </span>
              </h2>

              <p className="text-xl md:text-2xl text-orange-100 mb-12 leading-relaxed">
                혼자 고민하며 불안해하지 마세요. 복잡한 오버스테이 절차, 언어 장벽, 불확실한 미래에 대한 걱정은 저희에게 맡기시고,
                <br />
                지금 바로 전문가와 무료 상담으로 가장 안전한 해결책을 찾으세요.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-12 py-6 text-xl font-bold shadow-2xl shadow-amber-500/25 transform hover:scale-105 transition-all duration-300 group rounded-2xl"
                >
                  <Lock className="h-6 w-6 mr-3 group-hover:rotate-12 transition-transform" />
                  전문가와 비공개 무료 상담하기
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

              {/* 추가 보장 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { icon: Lock, text: "100% 비밀 보장" },
                  { icon: Shield, text: "안전한 해결" },
                  { icon: Scale, text: "합법적 절차" },
                  { icon: Award, text: "전문가 품질" }
                ].map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <div key={index} className="flex flex-col items-center text-center">
                      <IconComponent className="h-8 w-8 text-amber-400 mb-2" />
                      <span className="text-orange-200 text-sm">{item.text}</span>
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
