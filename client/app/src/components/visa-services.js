import React from 'react';
import { Button } from './ui/button.js';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card.js';
import { Badge } from './ui/badge.js';
import { Camera, Briefcase, Smartphone, Calendar, Plane, Clock, Check, Zap, Award, Sparkles } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage.js';
import { t } from '../lib/translations.js';

function VisaServices() {
  const { currentLanguage } = useLanguage();

  const visaTypes = [
    {
      id: 'tourist',
      icon: Camera,
      title: t('visa.tourist.title', currentLanguage),
      description: t('visa.tourist.description', currentLanguage),
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=300",
      badge: "인기",
      badgeIcon: Award,
      badgeColor: "bg-gradient-to-r from-green-500 to-emerald-500",
      features: [
        "체류기간: 최대 30일",
        "입국: 단수/복수 선택 가능",
        "처리시간: 24시간 내"
      ],
      price: "₩89,000",
      gradient: "from-green-400 to-emerald-500",
      buttonGradient: "from-[#FF6600] to-orange-600"
    },
    {
      id: 'business',
      icon: Briefcase,
      title: t('visa.business.title', currentLanguage),
      description: t('visa.business.description', currentLanguage),
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=300",
      badge: "추천",
      badgeIcon: Sparkles,
      badgeColor: "bg-gradient-to-r from-[#FF6600] to-orange-500",
      features: [
        "체류기간: 최대 90일",
        "입국: 복수 입국 가능",
        "처리시간: 24-48시간"
      ],
      price: "₩149,000",
      gradient: "from-orange-400 to-red-500",
      buttonGradient: "from-[#FF6600] to-orange-600",
      highlighted: true
    },
    {
      id: 'electronic',
      icon: Smartphone,
      title: t('visa.electronic.title', currentLanguage),
      description: t('visa.electronic.description', currentLanguage),
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=300",
      badge: "빠름",
      badgeIcon: Zap,
      badgeColor: "bg-gradient-to-r from-blue-500 to-cyan-500",
      features: [
        "체류기간: 최대 30일",
        "입국: 단수 입국",
        "처리시간: 12-24시간"
      ],
      price: "₩59,000",
      gradient: "from-blue-400 to-cyan-500",
      buttonGradient: "from-[#003366] to-blue-700"
    }
  ];

  return (
    <section id="services" className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20 animate-fade-in">
          <div className="inline-flex items-center space-x-2 bg-blue-100 px-4 py-2 rounded-full text-blue-700 text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            <span>전문 비자 서비스</span>
          </div>
          <h2 className="text-5xl font-bold text-[#003366] mb-6">
            <span className="text-gradient">비자 서비스</span>
          </h2>
          <p className="text-gray-600 text-xl max-w-3xl mx-auto">
            목적에 맞는 최적의 베트남 비자를 선택하세요. AI 기술로 빠르고 정확한 처리를 보장합니다.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {visaTypes.map((visa, index) => {
            const IconComponent = visa.icon;
            const BadgeIconComponent = visa.badgeIcon;
            return (
              <div
                key={visa.id}
                className="group animate-fade-in"
                style={{animationDelay: `${index * 0.2}s`}}
              >
                <Card 
                  className={`relative overflow-hidden floating-card gradient-card border-0 ${
                    visa.highlighted ? 'ring-2 ring-orange-400 ring-offset-4' : ''
                  }`}
                >
                  {/* Gradient overlay */}
                  <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${visa.gradient}`}></div>

                  {/* Popular badge */}
                  {visa.highlighted && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20">
                      <div className="gradient-accent px-6 py-2 rounded-full text-white text-sm font-bold shadow-lg animate-bounce-gentle">
                        ⭐ 가장 인기
                      </div>
                    </div>
                  )}

                  <div className="relative">
                    <img 
                      src={visa.image}
                      alt={visa.title}
                      className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                    />

                    {/* Badge */}
                    <div className={`absolute top-4 right-4 ${visa.badgeColor} text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1 shadow-lg`}>
                      <BadgeIconComponent className="h-4 w-4" />
                      <span>{visa.badge}</span>
                    </div>

                    {/* Gradient overlay on image */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>

                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 bg-gradient-to-br ${visa.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                        <CardTitle className="text-xl text-gray-900">{visa.title}</CardTitle>
                      </div>
                    </div>
                    <p className="text-gray-600 leading-relaxed">{visa.description}</p>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      {visa.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center space-x-3 group/feature">
                          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center group-hover/feature:scale-110 transition-transform">
                            <Check className="h-4 w-4 text-green-600" />
                          </div>
                          <span className="text-gray-700 font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 font-medium">대행 수수료</span>
                        <div className="text-right">
                          <span className="text-3xl font-bold text-[#003366]">{visa.price}</span>
                          <div className="text-sm text-gray-500">VAT 포함</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="pt-0">
                    <Button className={`w-full bg-gradient-to-r ${visa.buttonGradient} text-white font-semibold py-4 rounded-xl btn-glow hover:scale-105 transition-all duration-300 shadow-lg`}>
                      <Calendar className="h-5 w-5 mr-2" />
                      {visa.title} 신청하기
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA section */}
        <div className="text-center mt-16 animate-fade-in" style={{animationDelay: '0.8s'}}>
          <div className="glass-card inline-block p-8 rounded-2xl">
            <h3 className="text-2xl font-bold text-[#003366] mb-4">어떤 비자가 맞는지 모르겠나요?</h3>
            <p className="text-gray-600 mb-6">전문 상담사가 고객님의 여행 목적에 맞는 최적의 비자를 추천해드립니다.</p>
            <Button className="gradient-accent text-white px-8 py-3 rounded-xl btn-glow hover:scale-105 transition-all duration-300">
              <Sparkles className="h-5 w-5 mr-2" />
              무료 상담 받기
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default VisaServices;