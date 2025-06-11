import React, { useState } from 'react';
import { Button } from './ui/button.js';
import { Card, CardContent } from './ui/card.js';
import { ArrowRight, MessageCircle, Shield, FileCheck, DollarSign, Clock, Users, CheckCircle2, Star, Award, TrendingUp } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage.js';

function HeroSection() {
  const { currentLanguage } = useLanguage();
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  const coreValues = [
    {
      icon: Shield,
      title: "투명한 진행 현황",
      description: "모든 비자 진행 단계를 고객님께서 직접 실시간으로 확인 가능합니다.",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      icon: FileCheck,
      title: "전문가의 원스톱 솔루션",
      description: "E-visa부터 노동허가서까지, 복잡한 서류 준비를 원스톱으로 해결합니다.",
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      icon: DollarSign,
      title: "정직한 정찰제 비용",
      description: "불필요한 추가 비용 없이, 사전에 안내된 투명한 비용을 약속합니다.",
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  const handleConsultation = () => {
    setIsChatbotOpen(true);
  };

  const scrollToPricing = () => {
    const element = document.querySelector('#visa-services');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-orange-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-gradient-to-br from-green-400/5 to-cyan-400/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-screen py-20">
          {/* 좌측: 메시지 및 설득 영역 */}
          <div className="space-y-8 lg:space-y-10">
            {/* 신뢰 배지 */}
            <div className="animate-fade-in">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-100 to-orange-100 px-4 py-2 rounded-full text-amber-700 text-sm font-medium shadow-lg">
                <Star className="h-4 w-4 fill-current" />
                <span>⭐ 10년 전문가의 98.5% 승인율</span>
              </div>
            </div>

            {/* 메인 헤드라인 */}
            <div className="animate-fade-in" style={{animationDelay: '0.2s'}}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#003366] leading-tight mb-6">
                <span className="text-gradient bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  가장 확실한
                </span>
                <br />
                베트남 비자 솔루션
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-lg">
                불투명한 절차와 예측 불가능한 시간은 끝.<br />
                E-Visa부터 장기체류비자까지 원스톱으로 해결하세요.
              </p>
            </div>

            {/* 핵심 가치 아이콘 */}
            <div className="space-y-4 animate-fade-in" style={{animationDelay: '0.4s'}}>
              {coreValues.map((value, index) => {
                const IconComponent = value.icon;
                return (
                  <div 
                    key={index} 
                    className="flex items-start space-x-4 p-4 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <div className={`w-12 h-12 ${value.bgColor} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <IconComponent className={`h-6 w-6 ${value.color}`} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 mb-1">{value.title}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{value.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTA 버튼 */}
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{animationDelay: '0.6s'}}>
              <Button 
                onClick={handleConsultation}
                className="bg-[#003366] hover:bg-[#004080] text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center group"
              >
                <MessageCircle className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform" />
                1:1 맞춤 비자 상담
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>

              <Button 
                onClick={scrollToPricing}
                variant="outline"
                className="border-2 border-[#003366] text-[#003366] hover:bg-[#003366] hover:text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center group"
              >
                서비스 비용 확인하기
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>

          {/* 우측: 시각적 증명 영역 (실시간 비자 진행 현황) */}
          <div className="relative animate-fade-in" style={{animationDelay: '0.8s'}}>
            <div className="relative">
              {/* 메인 진행 현황 카드 */}
              <Card className="bg-white/90 backdrop-blur-xl shadow-2xl border-0 rounded-3xl overflow-hidden">
                <CardContent className="p-8">
                  {/* 헤더 */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-[#003366] mb-1">실시간 비자 진행 현황</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>1-7일 평균 처리기간</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-green-600 font-medium">실시간 업데이트</span>
                    </div>
                  </div>

                  {/* 진행 단계 */}
                  <div className="space-y-4">
                    {[
                      { step: 1, title: "신청서 접수", status: "completed", time: "완료", color: "green" },
                      { step: 2, title: "서류 검토", status: "completed", time: "완료", color: "green" },
                      { step: 3, title: "영사관 제출", status: "current", time: "진행중", color: "blue" },
                      { step: 4, title: "비자 발급", status: "pending", time: "대기중", color: "gray" }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center space-x-4 p-3 rounded-xl bg-gray-50/50">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm
                          ${item.status === 'completed' ? 'bg-green-500' : 
                            item.status === 'current' ? 'bg-blue-500 animate-pulse' : 'bg-gray-400'}`}>
                          {item.status === 'completed' ? <CheckCircle2 className="h-5 w-5" /> : item.step}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800">{item.title}</p>
                          <p className={`text-sm ${
                            item.status === 'completed' ? 'text-green-600' :
                            item.status === 'current' ? 'text-blue-600' : 'text-gray-500'
                          }`}>{item.time}</p>
                        </div>
                        {item.status === 'current' && (
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* 하단 통계 */}
                  <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
                    {[
                      { icon: Users, label: "처리 중", value: "1,247건", color: "blue" },
                      { icon: Award, label: "이번 달 승인", value: "2,891건", color: "green" },
                      { icon: TrendingUp, label: "승인율", value: "98.5%", color: "purple" }
                    ].map((stat, index) => {
                      const StatIcon = stat.icon;
                      return (
                        <div key={index} className="text-center">
                          <div className={`w-8 h-8 bg-${stat.color}-100 rounded-lg flex items-center justify-center mx-auto mb-2`}>
                            <StatIcon className={`h-4 w-4 text-${stat.color}-600`} />
                          </div>
                          <p className="font-bold text-gray-800 text-lg">{stat.value}</p>
                          <p className="text-xs text-gray-600">{stat.label}</p>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* 부유하는 요소들 (데스크톱에서만 표시) */}
              <div className="hidden lg:block">
                {/* 좌측 상단 부유 카드 */}
                <div className="absolute -top-4 -left-8 bg-gradient-to-r from-green-500 to-emerald-500 text-white p-4 rounded-2xl shadow-xl animate-float">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="h-5 w-5" />
                    <div>
                      <p className="font-bold text-sm">실시간 알림</p>
                      <p className="text-xs opacity-90">김○○님 비자 승인!</p>
                    </div>
                  </div>
                </div>

                {/* 우측 하단 부유 카드 */}
                <div className="absolute -bottom-4 -right-8 bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-4 rounded-2xl shadow-xl animate-float" style={{animationDelay: '1s'}}>
                  <div className="flex items-center space-x-2">
                    <Star className="h-5 w-5 fill-current" />
                    <div>
                      <p className="font-bold text-sm">고객 만족도</p>
                      <p className="text-xs opacity-90">★★★★★ 4.9/5.0</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 챗봇 렌더링 */}
      {isChatbotOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <h3 className="font-semibold">비자 상담 챗봇</h3>
              <button 
                onClick={() => setIsChatbotOpen(false)}
                className="text-white hover:bg-white/20 p-1 rounded-full transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-6 text-center">
              <MessageCircle className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              <h4 className="text-xl font-bold text-gray-800 mb-2">전문가와 상담하세요</h4>
              <p className="text-gray-600 mb-4">
                베트남 비자 전문가가 1:1로 맞춤 상담을 제공해드립니다.
              </p>
              <Button 
                onClick={() => window.open('https://open.kakao.com/o/your-channel', '_blank')}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 rounded-xl"
              >
                카카오톡으로 상담하기
              </Button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-fade-in {
          animation: fadeIn 1s ease-out forwards;
          opacity: 0;
        }

        @keyframes fadeIn {
          to { opacity: 1; }
        }
      `}</style>
    </section>
  );
}

export default HeroSection;