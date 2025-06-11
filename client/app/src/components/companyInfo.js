import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card.js';
import { Award, Users, Clock, Headphones, Star, Shield, CheckCircle, Sparkles, Heart, Zap, Phone, MessageCircle } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage.js';
import { t } from '../lib/translations.js';
import { Button } from './ui/button.js'; // Import Button component

function CompanyInfo() {
  const { currentLanguage } = useLanguage();

  const stats = [
    {
      icon: Award,
      value: t('company.experience', currentLanguage),
      label: '전문 경험',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: CheckCircle,
      value: t('company.success', currentLanguage),
      label: '비자 승인률',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: Users,
      value: t('company.customers', currentLanguage),
      label: '만족한 고객',
      gradient: 'from-orange-500 to-red-500'
    },
    {
      icon: Headphones,
      value: t('company.support', currentLanguage),
      label: '고객 지원',
      gradient: 'from-purple-500 to-pink-500'
    }
  ];

  const features = [
    {
      icon: Shield,
      title: '안전한 개인정보 보호',
      description: '국제 보안 기준에 따른 철저한 개인정보 보호',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Clock,
      title: '신속한 처리',
      description: 'AI 기술과 전문가의 경험으로 빠른 처리',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: Star,
      title: '높은 성공률',
      description: '10년간 쌓인 노하우로 99.8% 성공률 달성',
      gradient: 'from-orange-500 to-red-500'
    },
    {
      icon: Headphones,
      title: '전담 상담사',
      description: '경험 많은 전담 상담사의 1:1 맞춤 서비스',
      gradient: 'from-purple-500 to-pink-500'
    }
  ];

  const teamMessages = [
    {
      icon: Users,
      role: '비자 전문가',
      message: '저희는 고객님의 성공적인 비자 발급을 위해 최선을 다하겠습니다.',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Headphones,
      role: '고객 지원팀',
      message: '궁금한 점이 있으시면 언제든지 문의해주세요. 친절하게 안내해 드리겠습니다.',
      gradient: 'from-green-500 to-emerald-500'
    }
  ];

  return (
    <section id="about" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 sm:mb-20 animate-fade-in px-4">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-2 rounded-full text-blue-700 text-sm font-medium mb-6">
            <Heart className="h-4 w-4" />
            <span>{t('company.title', currentLanguage)}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#003366] mb-6">
            <span className="text-gradient">{t('company.title', currentLanguage)}</span>
          </h2>
          <p className="text-gray-600 text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            {t('company.description', currentLanguage)}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 mb-16 sm:mb-20 px-4">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div 
                key={index}
                className="text-center animate-fade-in p-4 sm:p-6 md:p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br ${stat.gradient} rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <IconComponent className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-white" />
                </div>
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#003366] mb-2">{stat.value}</div>
                <div className="text-gray-600 font-medium text-sm sm:text-base">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className="group animate-fade-in"
                style={{animationDelay: `${(index + 4) * 0.2}s`}}
              >
                <Card className="floating-card gradient-card border-0 h-full hover-lift">
                  <CardContent className="p-8">
                    <div className="flex items-start space-x-4">
                      <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-[#003366] mb-3 group-hover:text-blue-600 transition-colors">
                          {feature.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>

        {/* Team Messages */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 mb-16 sm:mb-20 px-4">
          {teamMessages.map((message, index) => {
            const IconComponent = message.icon;
            return (
              <div 
                key={index}
                className="animate-fade-in"
                style={{animationDelay: `${index * 0.2}s`}}
              >
                <Card className="h-full border-0 shadow-2xl bg-white/90 backdrop-blur-sm hover:shadow-3xl transition-all duration-500 group">
                  <CardHeader className="relative overflow-hidden p-4 sm:p-6">
                    <div className={`absolute inset-0 bg-gradient-to-r ${message.gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}></div>
                    <div className="relative flex items-center space-x-3 sm:space-x-4">
                      <div className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-r ${message.gradient} rounded-xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                        <IconComponent className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-white" />
                      </div>
                      <div className="min-w-0">
                        <CardTitle className="text-lg sm:text-xl md:text-2xl font-bold text-[#003366] group-hover:text-blue-600 transition-colors leading-tight">
                          {message.role}
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 p-4 sm:p-6">
                    <blockquote className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed italic border-l-4 border-blue-200 pl-4 sm:pl-6">
                      "{message.message}"
                    </blockquote>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center animate-fade-in px-4" style={{animationDelay: '1.6s'}}>
          <div className="glass-card inline-block p-8 rounded-3xl">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Star className="h-6 w-6 text-yellow-500" />
              <Star className="h-6 w-6 text-yellow-500" />
              <Star className="h-6 w-6 text-yellow-500" />
              <Star className="h-6 w-6 text-yellow-500" />
              <Star className="h-6 w-6 text-yellow-500" />
            </div>
            <h3 className="text-2xl font-bold text-[#003366] mb-4">10,000명이 선택한 믿을 수 있는 서비스</h3>
            <p className="text-gray-600 mb-6">
              고객 만족도 5.0점, 99.8% 비자 승인률로 검증된 전문 서비스입니다.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}

export default CompanyInfo;