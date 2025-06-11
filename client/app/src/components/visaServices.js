"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import Chatbot from "./chatbot";
import {
  Smartphone,
  Briefcase,
  CheckCircle,
  MessageCircle,
  Star,
  Clock,
  Globe,
  FileText,
  Users,
  Building,
  Zap,
  Shield,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Award,
  Play,
} from "lucide-react";

function VisaServices({ onApplyClick }) {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [chatbotMessage, setChatbotMessage] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleApplyClick = (serviceName) => {
    // 해당 서비스 데이터 찾기
    const serviceData = mainServices.find(
      (service) => service.title === serviceName,
    );

    if (serviceData && onApplyClick) {
      // 부모 컴포넌트의 onApplyClick 함수 호출하여 전체 서비스 데이터 전달
      onApplyClick({
        id: serviceData.id,
        title: serviceData.title,
        subtitle: serviceData.subtitle,
        description: serviceData.description,
        features: serviceData.features,
        processing: serviceData.processing,
        price: serviceData.price,
        gradient: serviceData.gradient,
        duration: serviceData.processing,
      });
    } else {
      // 기본 챗봇 메시지 설정
      setChatbotMessage(`${serviceName} 서비스 신청을 원합니다.`);
      setIsChatbotOpen(true);
    }
  };

  const mainServices = [
    {
      id: "evisa",
      title: "E-VISA (전자비자)",
      subtitle: "가장 인기 있는 선택",
      description: "온라인으로 간편하게 신청하는 베트남 전자비자",
      icon: Smartphone,
      gradient: "from-blue-500 via-indigo-500 to-purple-600",
      glowColor: "blue-500",
      badge: "인기 1위",
      badgeColor: "bg-gradient-to-r from-yellow-400 to-orange-500",
      features: [
        "24시간 빠른 처리",
        "단수/복수 선택 가능",
        "90일 체류 가능",
        "99.8% 승인률",
      ],
      processing: "당일~5일",
      price: "89,000원부터",
      highlight: true,
    },
    {
      id: "business",
      title: "비즈니스 비자",
      subtitle: "출장 및 사업 목적",
      description: "장기 출장과 사업 활동을 위한 전문 비자",
      icon: Briefcase,
      gradient: "from-emerald-500 via-teal-500 to-cyan-600",
      glowColor: "emerald-500",
      badge: "전문 서비스",
      badgeColor: "bg-gradient-to-r from-emerald-400 to-teal-500",
      features: [
        "최대 1년 체류",
        "복수 입국 가능",
        "초청장 지원",
        "전문가 컨설팅",
      ],
      processing: "7~14일",
      price: "150,000원부터",
      highlight: false,
    },
    {
      id: "longterm",
      title: "장기 체류 비자",
      subtitle: "노동허가서 & 거주증",
      description: "베트남에서 장기 거주하는 분들을 위한 종합 서비스",
      icon: Building,
      gradient: "from-orange-500 via-red-500 to-pink-600",
      glowColor: "orange-500",
      badge: "종합 서비스",
      badgeColor: "bg-gradient-to-r from-orange-400 to-red-500",
      features: [
        "노동허가서 발급",
        "거주증 신청",
        "가족 동반 가능",
        "전 과정 지원",
      ],
      processing: "30~60일",
      price: "상담 후 견적",
      highlight: false,
    },
  ];

  const quickStats = [
    { icon: Users, number: "50,000+", label: "고객 만족" },
    { icon: Award, number: "99.8%", label: "승인률" },
    { icon: Clock, number: "24시간", label: "빠른 처리" },
    { icon: Shield, number: "100%", label: "보안 보장" },
  ];

  return (
    <section className="relative py-24 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-hidden">
      {/* 배경 그라디언트 및 패턴 */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-full blur-3xl -translate-x-48 -translate-y-48"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-full blur-3xl translate-x-48 translate-y-48"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-br from-emerald-400/10 to-cyan-500/10 rounded-full blur-3xl -translate-x-32 -translate-y-32"></div>
      </div>

      {/* 부유하는 요소들 */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute top-20 left-10 w-4 h-4 bg-blue-400/30 rounded-full animate-ping"
          style={{ animationDelay: "0s" }}
        ></div>
        <div
          className="absolute top-40 right-20 w-3 h-3 bg-purple-400/30 rounded-full animate-ping"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-40 left-1/4 w-2 h-2 bg-emerald-400/30 rounded-full animate-ping"
          style={{ animationDelay: "4s" }}
        ></div>
        <div
          className="absolute top-1/3 right-1/4 w-5 h-5 bg-orange-400/20 rounded-full animate-ping"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* 헤더 섹션 */}
        <div
          className={`text-center mb-16 transform transition-all duration-1000 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
        >
          {/* 배지 */}
          <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full border border-blue-200/50 mb-6 shadow-lg">
            <Star className="h-5 w-5 text-blue-600" />
            <span className="text-blue-700 font-semibold">
              베트남 비자 전문 서비스
            </span>
          </div>

          {/* 메인 타이틀 */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              베트남 비자 서비스
            </span>
          </h2>

          {/* 서브 타이틀 */}
          <p className="text-xl md:text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed mb-8">
            목적에 맞는 최적의 베트남 비자를 선택하세요.
            <br />
            <span className="text-blue-600 font-semibold">
              AI 기술로 빠르고 정확한 처리를 보장합니다.
            </span>
          </p>

          {/* 통계 카드 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-12">
            {quickStats.map((stat, index) => (
              <div
                key={index}
                className={`bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl p-4 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl mb-3 mx-auto">
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
                <div className="text-2xl font-bold text-slate-800 mb-1">
                  {stat.number}
                </div>
                <div className="text-slate-600 text-sm font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 메인 서비스 카드 */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {mainServices.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <div
                key={service.id}
                className={`group relative transform transition-all duration-700 z-[99] flex ${isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"} ${service.highlight ? "lg:scale-105" : ""}`}
                style={{ animationDelay: `${index * 0.3}s` }}
                onMouseEnter={() => setHoveredCard(service.id)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() =>
                  setHoveredCard(hoveredCard === service.id ? null : service.id)
                }
              >
                <Card
                  className={`relative bg-white/90 backdrop-blur-sm border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 w-full flex flex-col ${service.highlight ? "ring-2 ring-yellow-400 ring-offset-4" : ""} ${hoveredCard === service.id ? "scale-105 ring-2 ring-blue-300 ring-offset-2" : ""} z-[101]`}
                >
                  {/* 상단 그라디언트 바 */}
                  <div
                    className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${service.gradient}`}
                  ></div>

                  {/* 인기 배지 */}
                  {service.highlight && (
                    <div className="absolute -top-4 right-6 z-20">
                      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 px-6 py-2 rounded-full text-white text-sm font-bold shadow-lg flex items-center space-x-1">
                        <span>⭐ 가장 인기</span>
                      </div>
                    </div>
                  )}

                  <CardHeader className="pb-4 pt-8">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-16 h-16 bg-gradient-to-br ${service.gradient} rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300`}
                        >
                          <IconComponent className="h-8 w-8 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-2xl text-slate-800 mb-1">
                            {service.title}
                          </CardTitle>
                          <p className="text-blue-600 font-semibold text-sm">
                            {service.subtitle}
                          </p>
                        </div>
                      </div>
                      <div
                        className={`${service.badgeColor} text-white px-3 py-1 rounded-full text-xs font-semibold`}
                      >
                        {service.badge}
                      </div>
                    </div>
                    <p className="text-slate-600 leading-relaxed">
                      {service.description}
                    </p>
                  </CardHeader>

                  <CardContent className="space-y-6 flex-1 flex flex-col">
                    {/* 특징 목록 - 유연한 높이 */}
                    <div className="space-y-3 flex-grow">
                      {service.features.map((feature, featureIndex) => (
                        <div
                          key={featureIndex}
                          className="flex items-center space-x-3 group/feature"
                        >
                          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center group-hover/feature:scale-110 transition-transform">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          </div>
                          <span className="text-slate-700 font-medium">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* 처리 시간 및 가격 - 하단 고정 */}
                    <div className="bg-slate-50 rounded-xl p-4 space-y-3 mt-auto">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600 font-medium flex items-center space-x-2">
                          <Clock className="h-4 w-4" />
                          <span>처리 시간</span>
                        </span>
                        <span className="text-slate-800 font-semibold">
                          {service.processing}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600 font-medium">
                          대행 수수료
                        </span>
                        <div className="text-right">
                          <span className="text-2xl font-bold text-slate-800">
                            {service.price}
                          </span>
                          {service.price !== "상담 후 견적" && (
                            <div className="text-sm text-slate-500">
                              VAT 포함
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* 신청 버튼 - 하단 고정 */}
                    <Button
                      onClick={() => handleApplyClick(service.title)}
                      className={`w-full bg-gradient-to-r ${service.gradient} text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group/btn mt-4`}
                    >
                      <span className="flex items-center justify-center space-x-2">
                        <span>{service.title} 신청하기</span>
                        <ArrowRight className="h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
                      </span>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>

        
      </div>

      {/* 챗봇 컴포넌트 */}
      {isChatbotOpen && (
        <Chatbot
          initialMessage={chatbotMessage}
          isOpen={isChatbotOpen}
          onToggle={() => setIsChatbotOpen(false)}
        />
      )}

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .shadow-3xl {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </section>
  );
}

export default VisaServices;
