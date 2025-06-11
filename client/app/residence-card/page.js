
'use client'

import React, { useState } from 'react';
import Header from '../src/components/header';
import Footer from '../src/components/footer';
import { Card, CardContent, CardHeader, CardTitle } from '../src/components/ui/card';
import { Button } from '../src/components/ui/button';
import { 
  Building2, 
  FileText, 
  Users, 
  Heart, 
  Shield, 
  CheckCircle, 
  AlertCircle, 
  Phone, 
  MessageCircle, 
  Scale, 
  Award, 
  Star, 
  Target, 
  Briefcase, 
  UserCheck,
  ArrowRight,
  Globe,
  Calendar,
  Clock,
  Lock,
  Zap,
  Eye,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  MapPin,
  BadgeCheck,
  Sparkles
} from 'lucide-react';

export default function ResidenceCard() {
  const [expandedFaq, setExpandedFaq] = useState(null);

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const visaTypes = [
    {
      icon: Building2,
      title: "투자 비자 (DT) 및 법인 설립 연계",
      description: "베트남 내 외국인 투자 법인 설립 자문 및 등록 절차 지원",
      features: [
        "베트남 내 외국인 투자 법인 설립 자문 및 등록 절차 지원",
        "투자 비자(DT) 발급 대행",
        "거주증(Temporary Residence Card, TRC) 연계 취득 지원",
        "로컬 기업과의 합작 법인 설립 관련 자문 포함"
      ],
      benefit: "합법적인 투자 활동을 통한 장기적이고 안정적인 베트남 체류 기반 마련",
      result: "사업 운영과 연계된 합법적인 체류 자격 확보",
      gradient: "from-blue-500 to-indigo-600"
    },
    {
      icon: Briefcase,
      title: "노동 비자 (LD) 및 워크퍼밋 연계",
      description: "베트남 노동 허가서(Work Permit) 취득 절차 지원",
      features: [
        "베트남 노동 허가서(Work Permit) 취득 절차 지원",
        "노동 비자(LD) 발급 대행",
        "거주증(TRC) 연계 취득 지원"
      ],
      benefit: "베트남 내 합법적인 취업 및 근로 활동 보장",
      result: "법적 문제 없이 안정적인 경제 활동 및 장기 체류 가능",
      gradient: "from-green-500 to-emerald-600"
    },
    {
      icon: Heart,
      title: "결혼/가족 비자 (TT)",
      description: "베트남 국민 또는 합법적인 장기 체류 외국인의 가족을 위한 비자",
      features: [
        "베트남 국민 또는 합법적인 장기 체류 외국인의 가족(배우자, 자녀)을 위한 결혼 비자 및 가족 비자(TT) 발급 대행",
        "거주증(TRC) 연계 취득 지원"
      ],
      benefit: "가족 구성원의 합법적인 베트남 동반 체류 지원",
      result: "베트남 내 가족 구성원과의 안정적인 생활 기반 마련",
      gradient: "from-pink-500 to-rose-600"
    },
    {
      icon: UserCheck,
      title: "기타 비자 및 맞춤형 솔루션",
      description: "다양한 목적과 상황에 맞는 베트남 비자 및 체류 허가 관련 서비스",
      features: [
        "상기 유형 외 다양한 목적과 상황에 맞는 베트남 비자 및 체류 허가 관련 법률 자문",
        "행정 절차 대행 서비스 제공",
        "고객의 개별적인 필요에 맞춰 가장 적합하고 합법적인 해결책 제시"
      ],
      benefit: "개별 상황에 최적화된 맞춤형 솔루션",
      result: "가장 효율적이고 안전한 체류 자격 확보",
      gradient: "from-purple-500 to-violet-600"
    }
  ];

  const companyStrengths = [
    {
      icon: Scale,
      title: "법규 기반의 전문성",
      description: "다년간의 경험과 최신 베트남 출입국 관리법(특히 법률 제23/2023/QH15호) 및 관련 규정에 대한 깊이 있는 이해",
      color: "from-blue-500 to-cyan-600"
    },
    {
      icon: CheckCircle,
      title: "투명한 절차 안내",
      description: "비현실적인 '100% 보장' 약속 대신, 법적으로 가능한 범위, 예상 소요 기간, 잠재적 리스크 등을 투명하게 설명",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: FileText,
      title: "체계적인 서류 관리",
      description: "복잡한 서류 준비부터 관할 기관 제출 및 후속 절차까지, 법규 요구사항에 맞춰 정확하고 누락 없이 체계적으로 진행",
      color: "from-purple-500 to-indigo-600"
    },
    {
      icon: Target,
      title: "합리적인 비용 정책",
      description: "불필요한 추가 비용 없이 서비스 범위에 따른 투명하고 합리적인 수수료 정책 운영",
      color: "from-orange-500 to-red-600"
    },
    {
      icon: Shield,
      title: "고객의 법적 안전 최우선",
      description: "불법적이거나 편법적인 방법은 절대 사용하지 않으며, 고객의 장기적인 법적 안전을 보호",
      color: "from-red-500 to-pink-600"
    },
    {
      icon: Award,
      title: "베트남 정식 법인",
      description: "베트남 투자법 및 기업법에 따라 정식으로 설립된 100% 외국인 투자 법인으로서 법규 준수 최우선",
      color: "from-indigo-500 to-purple-600"
    }
  ];

  const processSteps = [
    {
      step: 1,
      title: "무료 상담 및 현황 분석",
      description: "고객님의 현재 상황, 목적, 장기 계획을 종합적으로 분석하여 가장 적합한 비자/거주증 유형을 추천합니다.",
      icon: Eye,
      gradient: "from-blue-500 to-indigo-600"
    },
    {
      step: 2,
      title: "맞춤 서비스 계획 수립",
      description: "선택된 비자 유형에 따른 구체적인 진행 절차, 필요 서류 목록, 예상 소요 기간 및 비용을 상세히 안내합니다.",
      icon: FileText,
      gradient: "from-green-500 to-emerald-600"
    },
    {
      step: 3,
      title: "서류 준비 및 검토",
      description: "복잡한 법적 서류 작성부터 필요 서류 수집까지, 모든 준비 과정을 전문가가 체계적으로 관리합니다.",
      icon: CheckCircle,
      gradient: "from-purple-500 to-violet-600"
    },
    {
      step: 4,
      title: "관할 기관 제출 및 추적",
      description: "관련 정부 기관에 서류를 제출하고, 진행 상황을 실시간으로 추적하여 고객님께 투명하게 보고합니다.",
      icon: Building2,
      gradient: "from-orange-500 to-red-600"
    },
    {
      step: 5,
      title: "최종 결과 안내 및 사후 관리",
      description: "비자/거주증 발급 완료 후 관련 서류 전달 및 향후 갱신, 변경 등에 대한 지속적인 자문을 제공합니다.",
      icon: BadgeCheck,
      gradient: "from-teal-500 to-cyan-600"
    }
  ];

  const faqData = [
    {
      question: "2년 거주증 발급에 얼마나 시간이 걸리나요?",
      answer: "거주증 발급 소요 시간은 비자 유형과 개인 상황에 따라 다릅니다. 일반적으로 투자 비자 기반의 경우 2-3개월, 노동 비자 기반의 경우 1-2개월, 결혼/가족 비자 기반의 경우 1-2개월 정도 소요됩니다. 정확한 소요 기간은 상담 시 개별적으로 안내해 드립니다."
    },
    {
      question: "거주증 발급 비용은 얼마인가요?",
      answer: "거주증 발급 비용은 선택하는 비자 유형, 법인 설립 여부, 서류 복잡성 등에 따라 달라집니다. 투자 비자+법인 설립의 경우 가장 높은 비용이, 결혼/가족 비자의 경우 상대적으로 낮은 비용이 발생합니다. 무료 상담을 통해 정확한 견적을 제공해 드립니다."
    },
    {
      question: "거주증을 받으면 어떤 혜택이 있나요?",
      answer: "2년 거주증을 받으면 ①비자 없이 베트남 자유 출입국 가능 ②은행 계좌 개설 용이 ③부동산 임대 계약 체결 가능 ④각종 공공 서비스 이용 편의 ⑤장기 체류 계획 수립 가능 등의 혜택을 누리실 수 있습니다."
    },
    {
      question: "거주증 발급 실패 시 비용은 어떻게 되나요?",
      answer: "저희는 사전에 철저한 검토를 통해 발급 가능성을 평가한 후 서비스를 진행합니다. 만약 저희의 실수나 부주의로 인해 발급이 실패할 경우, 서비스 수수료는 전액 환불해 드립니다. 다만, 정부 수수료나 이미 발생한 비용은 환불이 어려울 수 있습니다."
    },
    {
      question: "VinaLegal Expert는 어떤 회사인가요?",
      answer: "VinaLegal Expert는 베트남 투자법 및 기업법에 따라 정식으로 설립된 100% 외국인 투자 법인입니다. 베트남 현지 법규 준수를 최우선으로 하며, 불법적이거나 편법적인 방법은 절대 사용하지 않습니다. 고객의 장기적인 법적 안전을 보장하는 것이 저희의 핵심 가치입니다."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />

      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative py-24 overflow-hidden">
          {/* 배경 그라디언트와 패턴 */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900"></div>
          <div className="absolute inset-0 opacity-10"
               style={{
                 backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M20 20h20v20H20V20zm20 0h20v20H40V20zm0 20h20v20H40V40zm-20 0h20v20H20V40z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
               }}>
          </div>

          {/* 동적 요소들 */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-full blur-xl animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/2 w-20 h-20 bg-gradient-to-br from-indigo-400/20 to-blue-500/20 rounded-full blur-xl animate-pulse" style={{animationDelay: '4s'}}></div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                {/* 배지 */}
                <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 px-6 py-3 rounded-full mb-8">
                  <Building2 className="h-5 w-5 text-blue-400" />
                  <span className="text-white font-semibold">VinaLegal Expert 전문 서비스</span>
                  <Award className="h-5 w-5 text-blue-400" />
                </div>

                {/* 메인 헤드라인 */}
                <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-8">
                  베트남 장기 체류의
                  <br />
                  <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    완벽한 솔루션
                  </span>
                </h1>

                <p className="text-xl md:text-2xl text-blue-100 leading-relaxed mb-12 max-w-4xl mx-auto">
                  베트남 투자법에 따라 정식 설립된 100% 외국인 투자 법인
                  <br className="hidden md:block" />
                  <span className="text-indigo-300 font-semibold">2년 거주증 발급 및 비자 전문 서비스</span>
                </p>

                {/* CTA 버튼들 */}
                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                  <Button 
                    size="lg"
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-10 py-6 text-lg font-bold shadow-2xl shadow-blue-500/25 transform hover:scale-105 transition-all duration-300 group"
                  >
                    <FileText className="h-6 w-6 mr-3 group-hover:rotate-12 transition-transform" />
                    무료 상담 신청하기
                    <ArrowRight className="h-6 w-6 ml-3 group-hover:translate-x-1 transition-transform" />
                  </Button>

                  <Button 
                    size="lg"
                    variant="outline"
                    className="border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm px-10 py-6 text-lg font-semibold transition-all duration-300"
                  >
                    <Phone className="h-6 w-6 mr-3" />
                    서비스 상세 보기
                  </Button>
                </div>
              </div>

              {/* 실시간 통계 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
                {[
                  { number: "10+", label: "년 전문 경험", icon: Award },
                  { number: "100%", label: "법규 준수", icon: Shield },
                  { number: "24/7", label: "전문 상담", icon: MessageCircle },
                  { number: "99%", label: "고객 만족도", icon: Star }
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

        {/* Company Introduction */}
        <section className="py-20 bg-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>

          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-full text-blue-700 text-sm font-medium mb-6">
                <Building2 className="h-4 w-4" />
                <span>회사 소개</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  VinaLegal Expert
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                VinaLegal Expert는 베트남 투자법 및 기업법에 따라 정식으로 설립된 
                <span className="font-semibold text-blue-600"> 100% 외국인 투자 법인</span>으로서, 
                법규 준수를 최우선 가치로 삼아 고객의 안정적인 베트남 체류를 지원합니다.
              </p>
            </div>
          </div>
        </section>

        {/* 비자 유형별 전문 서비스 */}
        <section className="py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-2 bg-indigo-50 px-4 py-2 rounded-full text-indigo-700 text-sm font-medium mb-6">
                <Users className="h-4 w-4" />
                <span>전문 서비스</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  비자 유형별 전문 서비스
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto">
                다양한 목적의 베트남 체류를 위한 비자 및 거주증 발급 절차를 법률 전문가 팀이 안내하고 대행합니다
              </p>
            </div>

            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-8">
                {visaTypes.map((visa, index) => {
                  const IconComponent = visa.icon;
                  return (
                    <Card key={index} className="group h-full bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-3xl overflow-hidden">
                      <div className={`h-2 bg-gradient-to-r ${visa.gradient} rounded-t-3xl`}></div>
                      
                      <CardHeader className="p-8">
                        <div className="flex items-center space-x-4 mb-6">
                          <div className={`w-16 h-16 bg-gradient-to-br ${visa.gradient} rounded-2xl flex items-center justify-center shadow-lg transform group-hover:rotate-6 transition-transform duration-300`}>
                            <IconComponent className="h-8 w-8 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-xl font-bold text-gray-900">{visa.title}</CardTitle>
                            <p className="text-gray-600 text-sm mt-1">{visa.description}</p>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="px-8 pb-8 space-y-6">
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-3">서비스 내용:</h4>
                          <ul className="space-y-2">
                            {visa.features.map((feature, featureIndex) => (
                              <li key={featureIndex} className="flex items-start space-x-3">
                                <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mt-2 flex-shrink-0"></div>
                                <span className="text-gray-600 text-sm leading-relaxed">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                          <h4 className="font-semibold text-green-800 mb-2">핵심 가치:</h4>
                          <p className="text-green-700 text-sm leading-relaxed">{visa.benefit}</p>
                        </div>
                        
                        <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
                          <h4 className="font-semibold text-purple-800 mb-2">기대 효과:</h4>
                          <p className="text-purple-700 text-sm leading-relaxed">{visa.result}</p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* VinaLegal Expert의 강점 */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-2 bg-orange-50 px-4 py-2 rounded-full text-orange-700 text-sm font-medium mb-6">
                <Shield className="h-4 w-4" />
                <span>회사 강점</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  VinaLegal Expert의 강점
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto">
                베트남 비자 및 체류 서비스 선택 시 가장 중요한 것은 법적 안정성입니다. 
                VinaLegal Expert는 다음 원칙을 고수하며 고객의 신뢰를 구축하고 있습니다.
              </p>
            </div>

            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {companyStrengths.map((strength, index) => {
                  const IconComponent = strength.icon;
                  return (
                    <Card key={index} className="group text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden">
                      <div className={`h-1 bg-gradient-to-r ${strength.color}`}></div>
                      <CardContent className="p-8">
                        <div className={`w-16 h-16 bg-gradient-to-br ${strength.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                          <IconComponent className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4">{strength.title}</h3>
                        <p className="text-gray-600 leading-relaxed text-sm">{strength.description}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* 서비스 진행 과정 */}
        <section className="py-20 bg-gradient-to-br from-slate-50 to-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-2 bg-purple-50 px-4 py-2 rounded-full text-purple-700 text-sm font-medium mb-6">
                <Clock className="h-4 w-4" />
                <span>진행 과정</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  체계적인 서비스 진행 과정
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                투명하고 체계적인 5단계 프로세스로 안전한 거주증 발급을 보장합니다
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
                        <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-purple-300 to-pink-400 z-0"
                             style={{ transform: 'translateX(-50%)' }}></div>
                      )}

                      {/* 단계 카드 */}
                      <div className="relative z-10 group-hover:scale-105 transition-transform duration-300">
                        <div className={`w-32 h-32 bg-gradient-to-br ${step.gradient} rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:shadow-2xl transition-shadow duration-300`}>
                          <IconComponent className="h-12 w-12 text-white" />
                        </div>

                        {/* 단계 번호 */}
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

        {/* 베트남 비자 발급 환경 안내 */}
        <section className="py-20 bg-gradient-to-r from-yellow-50 to-orange-50">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <Card className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border-l-4 border-yellow-500">
                <div className="flex items-center mb-6">
                  <AlertCircle className="h-8 w-8 text-yellow-500 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-800">베트남 비자 발급 환경 및 전문가 선택의 중요성</h2>
                </div>
                
                <div className="space-y-6 text-gray-700 leading-relaxed">
                  <div className="bg-red-50 p-6 rounded-2xl border border-red-200">
                    <p className="font-semibold text-red-700 mb-3">
                      최근 베트남 이민국 규정이 지속적으로 개정됨에 따라, 공식적인 비자 발급 절차가 더욱 엄격해지고 있습니다.
                    </p>
                    <p className="text-red-600">
                      이는 비자 대행 과정에서 비공식적인 방법이나 불법적인 접근이 오히려 심각한 문제를 야기할 수 있음을 의미합니다.
                    </p>
                  </div>
                  
                  <p className="text-lg">
                    <span className="font-semibold text-blue-600">베트남에서의 합법적인 체류는 개인 및 사업 활동의 가장 기본적인 전제입니다.</span> 
                    잘못된 정보나 불법적인 방법으로 인해 발생할 수 있는 벌금, 강제 출국, 
                    그리고 향후 베트남 재입국이 금지되는 '블랙리스트' 등 심각한 불이익을 피하기 위해서는 
                    반드시 베트남 법규를 완벽히 이해하고 준수하는 신뢰할 수 있는 전문가의 조력을 받아야 합니다.
                  </p>
                  
                  <div className="bg-green-50 p-6 rounded-2xl border border-green-200">
                    <p className="font-semibold text-green-800 text-lg">
                      VinaLegal Expert는 변화하는 베트남 법규에 신속하게 대응하며, 
                      오직 합법적인 절차만을 통해 고객의 베트남 체류 문제를 해결하고 안정적인 미래를 설계할 수 있도록 돕습니다.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ 섹션 */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-full text-green-700 text-sm font-medium mb-6">
                <HelpCircle className="h-4 w-4" />
                <span>자주 묻는 질문</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  자주 묻는 질문 (FAQ)
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                2년 거주증 발급에 대한 궁금한 점들을 미리 확인해보세요
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="space-y-4">
                {faqData.map((faq, index) => (
                  <Card key={index} className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden">
                    <CardHeader 
                      className="cursor-pointer p-6 hover:bg-green-50/50 transition-colors duration-300"
                      onClick={() => toggleFaq(index)}
                    >
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-bold text-gray-900 flex items-center">
                          <HelpCircle className="h-6 w-6 text-green-600 mr-3" />
                          {faq.question}
                        </CardTitle>
                        <div className={`transform transition-transform duration-300 ${expandedFaq === index ? 'rotate-180' : ''}`}>
                          {expandedFaq === index ? (
                            <ChevronUp className="h-5 w-5 text-gray-500" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-gray-500" />
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    
                    {expandedFaq === index && (
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
        <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10"
               style={{
                 backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
               }}>
          </div>

          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="max-w-5xl mx-auto">
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full mb-8">
                <Sparkles className="h-5 w-5 text-blue-400" />
                <span className="text-white font-semibold">베트남 정식 법인의 전문 서비스</span>
              </div>

              <h2 className="text-4xl md:text-6xl font-bold mb-8">
                2년 거주증 발급 및
                <br />
                <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  베트남 체류 전문 상담
                </span>
              </h2>

              <p className="text-xl md:text-2xl text-blue-100 mb-12 leading-relaxed max-w-4xl mx-auto">
                귀하의 현재 비자 상태, 베트남 체류 목적, 투자 또는 근로 계획 등 개별적인 상황에 맞는 
                최적의 비자 및 2년 거주증 발급 방법, 기타 체류 관련 문제에 대해 전문적인 상담을 제공합니다.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-12 py-6 text-xl font-bold shadow-2xl shadow-blue-500/25 transform hover:scale-105 transition-all duration-300 group rounded-2xl"
                >
                  <FileText className="h-6 w-6 mr-3 group-hover:rotate-12 transition-transform" />
                  무료 상담 신청하기
                  <ArrowRight className="h-6 w-6 ml-3 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>

              {/* 연락처 정보 */}
              <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                <Card className="bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300 rounded-2xl">
                  <CardContent className="p-8 text-center">
                    <MessageCircle className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">카카오톡 문의</h3>
                    <p className="text-blue-200 mb-4">실시간 전문 상담</p>
                    <div className="text-2xl font-bold text-blue-300">hcm2424</div>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300 rounded-2xl">
                  <CardContent className="p-8 text-center">
                    <Phone className="h-12 w-12 text-green-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Zalo 문의</h3>
                    <p className="text-green-200 mb-4">베트남 현지 상담</p>
                    <div className="text-2xl font-bold text-green-300">093 721 7284</div>
                  </CardContent>
                </Card>
              </div>

              {/* 추가 보장 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
                {[
                  { icon: Shield, text: "법규 준수" },
                  { icon: Lock, text: "안전한 절차" },
                  { icon: Award, text: "전문가 서비스" },
                  { icon: CheckCircle, text: "투명한 진행" }
                ].map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <div key={index} className="flex flex-col items-center text-center">
                      <IconComponent className="h-8 w-8 text-blue-400 mb-2" />
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
            <h3 className="text-2xl font-bold mb-6 text-gray-800">VinaLegal Expert</h3>
            <div className="space-y-2 text-gray-600">
              <p>사업자 등록번호 : 79-1252/2021</p>
              <p>Address : 93 Cao Trieu Phat. Tan Phong Ward, District 7, Phu My Hung, HCMC.</p>
              <p className="text-sm">Copyright ⓒ 2025 VinaLegal Expert All rights reserved.</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
