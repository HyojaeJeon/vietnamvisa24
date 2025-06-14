import React from "react";
import { Card, CardContent } from "./ui/card.js";
import { Award, Users, Clock, Shield, Star, CheckCircle, Globe, HeadphonesIcon, TrendingUp, Zap } from "lucide-react";

// 서버 사이드 렌더링을 위한 정적 CompanyInfo 컴포넌트
function StaticCompanyInfo() {
  const stats = [
    {
      icon: Users,
      number: "10,000+",
      label: "만족한 고객",
      description: "성공적인 비자 발급",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: Award,
      number: "99.8%",
      label: "승인률",
      description: "업계 최고 수준",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: Clock,
      number: "24시간",
      label: "빠른 처리",
      description: "긴급 비자 가능",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: Shield,
      number: "5년+",
      label: "전문 경력",
      description: "안전한 대행 서비스",
      gradient: "from-orange-500 to-red-500",
    },
  ];

  const features = [
    {
      icon: Star,
      title: "전문 상담원",
      description: "베트남 비자 전문가가 직접 상담",
      color: "text-yellow-600",
      bg: "bg-yellow-50",
    },
    {
      icon: CheckCircle,
      title: "완벽한 서류 검토",
      description: "오류 없는 완벽한 신청 보장",
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      icon: Globe,
      title: "다국어 지원",
      description: "한국어, 영어, 베트남어 상담",
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      icon: HeadphonesIcon,
      title: "24/7 고객지원",
      description: "언제든지 문의 가능한 상담",
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  const certifications = [
    {
      title: "베트남 정부 공인",
      subtitle: "Official Partner",
      icon: Award,
      verified: true,
    },
    {
      title: "ISO 27001 인증",
      subtitle: "정보보안 관리",
      icon: Shield,
      verified: true,
    },
    {
      title: "관광청 등록",
      subtitle: "Licensed Agency",
      icon: CheckCircle,
      verified: true,
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-orange-200/20 to-pink-200/20 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-2 rounded-full text-blue-700 text-sm font-medium mb-6">
            <TrendingUp className="h-4 w-4" />
            <span>회사 소개</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-6">믿을 수 있는 베트남 비자 전문 서비스</h2>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto">5년 경력의 전문가가 10,000명 이상의 고객에게 완벽한 비자 서비스를 제공했습니다</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;

            return (
              <Card key={index} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 group overflow-hidden">
                <CardContent className="p-6 text-center relative">
                  {/* Background Gradient */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.gradient}`}></div>

                  {/* Icon */}
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${stat.gradient} mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>

                  {/* Number */}
                  <div className="text-3xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">{stat.number}</div>

                  {/* Label */}
                  <div className="text-lg font-semibold text-gray-700 mb-1">{stat.label}</div>

                  {/* Description */}
                  <div className="text-sm text-gray-500">{stat.description}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Features Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">왜 저희를 선택해야 할까요?</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">고객 만족을 위한 차별화된 서비스를 제공합니다</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;

              return (
                <Card key={index} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 ${feature.bg} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className={`h-8 w-8 ${feature.color}`} />
                    </div>

                    <h4 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">{feature.title}</h4>

                    <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Certifications Section */}
        <div className="text-center">
          <h3 className="text-3xl font-bold text-gray-800 mb-4">공인된 안전한 서비스</h3>
          <p className="text-gray-600 mb-12 max-w-2xl mx-auto">정부 공인 및 각종 인증을 통해 안전하고 신뢰할 수 있는 서비스를 보장합니다</p>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {certifications.map((cert, index) => {
              const IconComponent = cert.icon;

              return (
                <Card key={index} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <CardContent className="p-6 text-center">
                    <div className="relative mb-4">
                      <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <IconComponent className="h-10 w-10 text-white" />
                      </div>
                      {cert.verified && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>

                    <h4 className="text-lg font-semibold text-gray-800 mb-1 group-hover:text-green-600 transition-colors">{cert.title}</h4>

                    <p className="text-sm text-gray-500">{cert.subtitle}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-10 right-10 w-20 h-20 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-full opacity-20 blur-xl"></div>
        <div className="absolute bottom-10 left-10 w-16 h-16 bg-gradient-to-br from-green-200 to-blue-200 rounded-full opacity-20 blur-xl"></div>
      </div>
    </section>
  );
}

export default StaticCompanyInfo;
