import React from "react";
import { Card, CardContent } from "./ui/card.js";
import { Star, Shield, Clock, Users, ArrowRight, CheckCircle, Award, Zap, Globe, Phone, MessageCircle, Play, Sparkles } from "lucide-react";

// 서버 사이드 렌더링을 위한 정적 HeroSection 컴포넌트
function StaticHeroSection() {
  const slides = [
    {
      title: "베트남 E-VISA 전문 서비스",
      subtitle: "99.8% 승인률의 믿을 수 있는 비자 대행",
      description: "복잡한 비자 신청 과정을 전문가가 완벽하게 처리해드립니다",
      gradient: "from-blue-600 via-indigo-600 to-purple-700",
    },
    {
      title: "24시간 빠른 처리",
      subtitle: "긴급 비자도 당일 발급 가능",
      description: "여행 일정이 급하신가요? 당일 발급 서비스로 해결해드립니다",
      gradient: "from-emerald-600 via-green-600 to-teal-700",
    },
    {
      title: "완벽한 한국어 서비스",
      subtitle: "어려운 베트남어 신청서, 저희가 대신 작성",
      description: "언어 장벽 없이 편리하게 비자를 신청하세요",
      gradient: "from-purple-600 via-pink-600 to-rose-700",
    },
  ];

  const stats = [
    { icon: Users, number: "10,000+", label: "만족 고객" },
    { icon: Star, number: "99.8%", label: "승인률" },
    { icon: Clock, number: "24H", label: "빠른 처리" },
    { icon: Shield, number: "5년", label: "전문 경력" },
  ];

  const benefits = [
    { icon: CheckCircle, text: "99.8% 높은 승인률 보장" },
    { icon: Clock, text: "24시간 내 긴급 처리 가능" },
    { icon: Shield, text: "전문가의 완벽한 서류 검토" },
    { icon: Star, text: "한국어 전용 고객 서비스" },
  ];

  // 첫 번째 슬라이드를 기본으로 표시 (서버 사이드)
  const currentSlide = slides[0];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${currentSlide.gradient}`}>
        <div className="absolute inset-0 bg-black/20"></div>

        {/* Floating Elements */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-48 h-48 bg-white/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-32 h-32 bg-white/15 rounded-full blur-xl animate-pulse delay-500"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-white space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
              <Star className="h-4 w-4 text-yellow-300" />
              <span>베트남 비자 전문 대행 서비스</span>
            </div>

            {/* Main Title */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">{currentSlide.title}</h1>
              <h2 className="text-2xl md:text-3xl font-medium text-white/90">{currentSlide.subtitle}</h2>
              <p className="text-xl text-white/80 max-w-2xl leading-relaxed">{currentSlide.description}</p>
            </div>

            {/* Benefits */}
            <div className="grid sm:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => {
                const IconComponent = benefit.icon;
                return (
                  <div key={index} className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm p-4 rounded-xl">
                    <IconComponent className="h-5 w-5 text-green-300 flex-shrink-0" />
                    <span className="text-sm font-medium">{benefit.text}</span>
                  </div>
                );
              })}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-white text-gray-800 px-8 py-4 rounded-xl font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2">
                <Zap className="h-5 w-5" />
                <span>지금 신청하기</span>
              </button>

              <button className="border-2 border-white/30 text-white px-8 py-4 rounded-xl font-semibold backdrop-blur-sm hover:bg-white/10 transition-all duration-300 flex items-center justify-center space-x-2">
                <Phone className="h-5 w-5" />
                <span>무료 상담</span>
              </button>
            </div>

            {/* Contact Info */}
            <div className="flex flex-col sm:flex-row gap-4 text-sm text-white/80">
              <div className="flex items-center space-x-2">
                <MessageCircle className="h-4 w-4" />
                <span>카카오톡: @vietnamvisa24</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>24시간 상담: 1588-0000</span>
              </div>
            </div>
          </div>

          {/* Right Content - Stats & Info */}
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <Card key={index} className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
                    <CardContent className="p-6 text-center">
                      <IconComponent className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                      <div className="text-2xl font-bold text-gray-800 mb-1">{stat.number}</div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Process Preview */}
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <Play className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">간단한 3단계 신청</h3>
                    <p className="text-sm text-gray-600">5분이면 완료되는 쉬운 신청</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {["1. 온라인 정보 입력", "2. 전문가 서류 검토", "3. 이메일로 비자 수령"].map((step, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      <span className="text-sm text-gray-700">{step}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Trust Indicators */}
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-800">신뢰할 수 있는 서비스</h3>
                  <Award className="h-6 w-6 text-yellow-500" />
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Shield className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="text-xs text-gray-600">정부 공인</div>
                  </div>
                  <div>
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Globe className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="text-xs text-gray-600">국제 인증</div>
                  </div>
                  <div>
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Star className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="text-xs text-gray-600">5성급 서비스</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60">
        <div className="flex flex-col items-center space-y-2">
          <span className="text-sm">아래로 스크롤</span>
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-bounce"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default StaticHeroSection;
