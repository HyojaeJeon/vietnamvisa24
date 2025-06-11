
import React from 'react';
import { Button } from './ui/button.js';
import { Card, CardContent } from './ui/card.js';
import { Play, FileCheck, Users, Mail, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage.js';
import { t } from '../lib/translations.js';

function ProcessSteps() {
  const { currentLanguage } = useLanguage();

  const steps = [
    {
      id: 1,
      icon: FileCheck,
      title: '신청 정보 제출',
      description: '고객님이 간편한 한글 양식으로 정보를 입력하고 서류를 업로드합니다',
      details: ['5분 내 완료', '한국어 양식'],
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      id: 2,
      icon: Users,
      title: '전문가 검토 및 대행',
      description: '담당 전문가가 제출된 서류를 규정에 맞게 완벽히 검토 후, 공식 시스템에 오류 없이 대행 신청합니다',
      details: ['전문가 검토', '오류 방지'],
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      id: 3,
      icon: Mail,
      title: '이메일로 비자 수령',
      description: '발급이 완료된 E-VISA를 고객님의 이메일로 즉시 발송해 드립니다',
      details: ['즉시 발송', '인쇄 가능'],
      gradient: 'from-purple-500 to-pink-500'
    }
  ];

  return (
    <section id="process" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-orange-200/20 to-pink-200/20 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20 animate-fade-in">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-2 rounded-full text-blue-700 text-sm font-medium mb-6">
            <Play className="h-4 w-4" />
            <span>신청 과정</span>
          </div>
          <h2 className="text-5xl font-bold text-[#003366] mb-6">
            <span className="text-gradient">간단한 3단계</span>
          </h2>
          <p className="text-gray-600 text-xl max-w-3xl mx-auto">
            복잡한 비자 신청 과정을 3단계로 간소화했습니다. 전문가의 도움으로 빠르고 정확하게 처리됩니다.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="relative">
          {/* 데스크톱용 3열 레이아웃 (lg 이상에서만 표시) */}
          <div className="hidden lg:grid lg:grid-cols-3 gap-8">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div 
                  key={step.id} 
                  className="relative animate-fade-in"
                  style={{animationDelay: `${index * 0.2}s`}}
                >
                  <Card className="h-full floating-card hover-lift bg-white/80 backdrop-blur-sm border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 group">
                    <CardContent className="p-8 text-center relative overflow-hidden">
                      {/* Background gradient */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${step.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>

                      {/* Step number */}
                      <div className="absolute top-4 right-4 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-sm font-bold text-gray-700">{step.id}</span>
                      </div>

                      {/* Icon */}
                      <div className={`w-20 h-20 bg-gradient-to-br ${step.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="h-10 w-10 text-white" />
                      </div>

                      {/* Content */}
                      <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">
                        {step.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed mb-4">
                        {step.description}
                      </p>

                      {/* Details */}
                      <div className="space-y-2">
                        {step.details.map((detail, detailIndex) => (
                          <div key={detailIndex} className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                            <span>{detail}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Arrow between steps */}
                  {index < steps.length - 1 && (
                    <div className="absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                      <ArrowRight className="h-8 w-8 text-blue-300" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* 모바일/태블릿용 1열 레이아웃 (lg 미만에서만 표시) */}
          <div className="lg:hidden grid grid-cols-1 gap-6">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div 
                  key={step.id} 
                  className="animate-fade-in"
                  style={{animationDelay: `${index * 0.2}s`}}
                >
                  <Card className="h-full floating-card hover-lift bg-white/80 backdrop-blur-sm border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 group">
                    <CardContent className="p-4 sm:p-6 text-center relative overflow-hidden">
                      {/* Background gradient */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${step.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>

                      {/* Step number */}
                      <div className="absolute top-3 right-3 w-6 h-6 sm:w-7 sm:h-7 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-xs sm:text-sm font-bold text-gray-700">{step.id}</span>
                      </div>

                      {/* Icon */}
                      <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br ${step.gradient} rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                      </div>

                      {/* Content */}
                      <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2 sm:mb-3 group-hover:text-blue-600 transition-colors leading-tight">
                        {step.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed mb-3 sm:mb-4 text-sm sm:text-base">
                        {step.description}
                      </p>

                      {/* Details */}
                      <div className="space-y-1 sm:space-y-2">
                        {step.details.map((detail, detailIndex) => (
                          <div key={detailIndex} className="flex items-center justify-center space-x-2 text-xs sm:text-sm text-gray-500">
                            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                            <span className="leading-tight">{detail}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center animate-fade-in mt-16" style={{animationDelay: '1s'}}>
          <div className="glass-card inline-block p-8 rounded-3xl">
            <h3 className="text-2xl font-bold text-[#003366] mb-4">지금 바로 시작하세요!</h3>
            <p className="text-gray-600 mb-6 max-w-md">
              간단한 3단계로 안전하고 빠르게 베트남 비자를 받으세요.
            </p>
            <Button className="gradient-accent text-white px-8 py-4 rounded-xl btn-glow hover:scale-105 transition-all duration-300 text-lg font-semibold">
              <Sparkles className="h-5 w-5 mr-2" />
              비자 신청 시작하기
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProcessSteps;
