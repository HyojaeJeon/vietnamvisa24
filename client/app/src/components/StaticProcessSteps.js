import React from "react";
import { Card, CardContent } from "./ui/card.js";
import { FileCheck, Users, Mail, CheckCircle, ArrowRight, Sparkles, Play, Clock, Shield, Star } from "lucide-react";

// 서버 사이드 렌더링을 위한 정적 ProcessSteps 컴포넌트
function StaticProcessSteps() {
  const steps = [
    {
      id: 1,
      icon: FileCheck,
      title: "신청 정보 제출",
      description: "고객님이 간편한 한글 양식으로 정보를 입력하고 서류를 업로드합니다",
      details: ["5분 내 완료", "한국어 양식"],
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      id: 2,
      icon: Users,
      title: "전문가 검토 및 대행",
      description: "담당 전문가가 제출된 서류를 규정에 맞게 완벽히 검토 후, 공식 시스템에 오류 없이 대행 신청합니다",
      details: ["전문가 검토", "오류 방지"],
      gradient: "from-green-500 to-emerald-500",
    },
    {
      id: 3,
      icon: Mail,
      title: "이메일로 비자 수령",
      description: "발급이 완료된 E-VISA를 고객님의 이메일로 즉시 발송해 드립니다",
      details: ["즉시 발송", "인쇄 가능"],
      gradient: "from-purple-500 to-pink-500",
    },
  ];

  return (
    <section id="process" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-orange-200/20 to-pink-200/20 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-2 rounded-full text-blue-700 text-sm font-medium mb-6">
            <Play className="h-4 w-4" />
            <span>신청 과정</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-6">간단한 3단계로 완료</h2>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto">복잡한 베트남 비자 신청, 전문가가 대신 처리해드립니다</p>
        </div>

        <div className="relative">
          {/* Connection Lines */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-green-200 to-purple-200 transform -translate-y-1/2 z-0"></div>

          <div className="grid md:grid-cols-3 gap-8 relative z-10">
            {steps.map((step, index) => {
              const IconComponent = step.icon;

              return (
                <Card key={step.id} className="relative bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group">
                  {/* Step Number */}
                  <div className="absolute -top-4 left-6 w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm z-10">
                    {step.id}
                  </div>

                  <CardContent className="p-8">
                    {/* Icon */}
                    <div
                      className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${step.gradient} mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-blue-600 transition-colors">{step.title}</h3>

                    {/* Description */}
                    <p className="text-gray-600 mb-6 leading-relaxed">{step.description}</p>

                    {/* Details */}
                    <div className="space-y-2">
                      {step.details.map((detail, idx) => (
                        <div key={idx} className="flex items-center space-x-3">
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm text-gray-600">{detail}</span>
                        </div>
                      ))}
                    </div>

                    {/* Arrow for non-last items */}
                    {index < steps.length - 1 && (
                      <div className="hidden lg:block absolute -right-4 top-1/2 transform -translate-y-1/2">
                        <div className="w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-gray-100">
                          <ArrowRight className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { number: "99.8%", label: "승인률", icon: CheckCircle },
            { number: "24H", label: "처리시간", icon: Clock },
            { number: "10K+", label: "만족고객", icon: Users },
            { number: "5년", label: "서비스 경력", icon: Shield },
          ].map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-100">
                <IconComponent className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-800 mb-1">{stat.number}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-10 right-10 w-20 h-20 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-full opacity-20 blur-xl"></div>
        <div className="absolute bottom-10 left-10 w-16 h-16 bg-gradient-to-br from-green-200 to-blue-200 rounded-full opacity-20 blur-xl"></div>
      </div>
    </section>
  );
}

export default StaticProcessSteps;
