import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card.js";
import { Award, Users, Clock, Headphones, Star, Shield, CheckCircle, Heart } from "lucide-react";
import { useLanguage } from "../hooks/useLanguage.js";
import { t } from "../lib/translations.js";

function CompanyInfo() {
  const [mounted, setMounted] = useState(false);
  const { currentLanguage } = useLanguage();

  // Check if component is mounted to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Use default language on server-side rendering
  const displayLanguage = mounted ? currentLanguage : "ko";

  const stats = [
    {
      id: "experience",
      icon: Award,
      value: t("company.experience", displayLanguage),
      label: "전문 경험",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      id: "success",
      icon: CheckCircle,
      value: t("company.success", displayLanguage),
      label: "비자 승인률",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      id: "customers",
      icon: Users,
      value: t("company.customers", displayLanguage),
      label: "만족한 고객",
      gradient: "from-orange-500 to-red-500",
    },
    {
      id: "support",
      icon: Headphones,
      value: t("company.support", displayLanguage),
      label: "고객 지원",
      gradient: "from-purple-500 to-pink-500",
    },
  ];

  const features = [
    {
      id: "privacy",
      icon: Shield,
      title: "안전한 개인정보 보호",
      description: "국제 보안 기준에 따른 철저한 개인정보 보호",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      id: "processing",
      icon: Clock,
      title: "신속한 처리",
      description: "AI 기술과 전문가의 경험으로 빠른 처리",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      id: "success-rate",
      icon: Star,
      title: "높은 성공률",
      description: "10년간 쌓인 노하우로 99.8% 성공률 달성",
      gradient: "from-orange-500 to-red-500",
    },
    {
      id: "consultant",
      icon: Headphones,
      title: "전담 상담사",
      description: "경험 많은 전담 상담사의 1:1 맞춤 서비스",
      gradient: "from-purple-500 to-pink-500",
    },
  ];

  const teamMessages = [
    {
      id: "expert",
      icon: Users,
      role: "비자 전문가",
      message: "저희는 고객님의 성공적인 비자 발급을 위해 최선을 다하겠습니다.",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      id: "support-team",
      icon: Headphones,
      role: "고객 지원팀",
      message: "궁금한 점이 있으시면 언제든지 문의해주세요. 친절하게 안내해 드리겠습니다.",
      gradient: "from-green-500 to-emerald-500",
    },
  ];

  return (
    <section id="about" className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50"></div>

      <div className="container relative z-10 px-4 mx-auto">
        {/* Header */}
        <div className="px-4 mb-16 text-center sm:mb-20 animate-fade-in">
          <div className="inline-flex items-center px-4 py-2 mb-6 space-x-2 text-sm font-medium text-blue-700 rounded-full bg-gradient-to-r from-blue-100 to-purple-100">
            <Heart className="w-4 h-4" />
            <span>{t("company.title", displayLanguage)}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#003366] mb-6">
            <span className="text-gradient">{t("company.title", displayLanguage)}</span>
          </h2>
          <p className="max-w-3xl mx-auto text-base leading-relaxed text-gray-600 sm:text-lg md:text-xl">{t("company.subtitle", displayLanguage)}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 px-4 mb-16 lg:grid-cols-4 sm:gap-6 md:gap-8 sm:mb-20">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={stat.id}
                className="p-4 text-center transition-all duration-300 shadow-lg animate-fade-in sm:p-6 md:p-8 bg-white/80 backdrop-blur-sm rounded-2xl hover:shadow-xl"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br ${stat.gradient} rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4`}>
                  <IconComponent className="w-6 h-6 text-white sm:h-7 sm:w-7 md:h-8 md:w-8" />
                </div>
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#003366] mb-2">{stat.value}</div>
                <div className="text-sm font-medium text-gray-600 sm:text-base">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Features */}
        <div className="grid gap-8 mb-16 md:grid-cols-2">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={feature.id} className="group animate-fade-in" style={{ animationDelay: `${(index + 4) * 0.2}s` }}>
                <Card className="h-full border-0 floating-card gradient-card hover-lift">
                  <CardContent className="p-8">
                    <div className="flex items-start space-x-4">
                      <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-[#003366] mb-3 group-hover:text-blue-600 transition-colors">{feature.title}</h3>
                        <p className="leading-relaxed text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>

        {/* Team Messages */}
        <div className="grid grid-cols-1 gap-6 px-4 mb-16 lg:grid-cols-2 sm:gap-8 md:gap-12 sm:mb-20">
          {teamMessages.map((message, index) => {
            const IconComponent = message.icon;
            return (
              <div key={message.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.2}s` }}>
                <Card className="h-full transition-all duration-500 border-0 shadow-2xl bg-white/90 backdrop-blur-sm hover:shadow-3xl group">
                  <CardHeader className="relative p-4 overflow-hidden sm:p-6">
                    <div className={`absolute inset-0 bg-gradient-to-r ${message.gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}></div>
                    <div className="relative flex items-center space-x-3 sm:space-x-4">
                      <div className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-r ${message.gradient} rounded-xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                        <IconComponent className="w-6 h-6 text-white sm:h-7 sm:w-7 md:h-8 md:w-8" />
                      </div>
                      <div className="min-w-0">
                        <CardTitle className="text-lg sm:text-xl md:text-2xl font-bold text-[#003366] group-hover:text-blue-600 transition-colors leading-tight">{message.role}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 sm:p-6">
                    <blockquote className="pl-4 text-sm italic leading-relaxed text-gray-700 border-l-4 border-blue-200 sm:text-base md:text-lg sm:pl-6">"{message.message}"</blockquote>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="px-4 text-center animate-fade-in" style={{ animationDelay: "1.6s" }}>
          <div className="inline-block p-8 glass-card rounded-3xl">
            <div className="flex items-center justify-center mb-4 space-x-2">
              <Star className="w-6 h-6 text-yellow-500" />
              <Star className="w-6 h-6 text-yellow-500" />
              <Star className="w-6 h-6 text-yellow-500" />
              <Star className="w-6 h-6 text-yellow-500" />
              <Star className="w-6 h-6 text-yellow-500" />
            </div>
            <h3 className="text-2xl font-bold text-[#003366] mb-4">10,000명이 선택한 믿을 수 있는 서비스</h3>
            <p className="mb-6 text-gray-600">고객 만족도 5.0점, 99.8% 비자 승인률로 검증된 전문 서비스입니다.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CompanyInfo;
