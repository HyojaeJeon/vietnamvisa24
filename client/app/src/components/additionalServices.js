import React from 'react';
import { Button } from './ui/button.js';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card.js';
import { FileText, Car, Plane, Shield, Award, CheckCircle, Star, Sparkles, MapPin } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage.js';
import { t } from '../lib/translations.js';

function AdditionalServices({ onApplyClick }) {
  const { currentLanguage } = useLanguage();

  const services = [
    {
      id: 'mokbai',
      icon: Car,
      title: "목바이",
      subtitle: "캄보디아 비자 + 패스트랙",
      description: "캄보디아 비자 + 패스트랙 서비스로 편리한 출입국을 도와드립니다.",
      features: [
        "차장 (이노바)",
        "차장 (카니발)"
      ],
      price: "상담 문의",
      gradient: "from-blue-500 to-indigo-500",
      buttonGradient: "from-blue-600 to-indigo-600",
      popular: false
    },
    {
      id: 'fasttrack',
      icon: Plane,
      title: "패스트랙",
      subtitle: "공항 신속 통과",
      description: "공항 출입국 신속 처리 서비스로 대기시간을 단축시켜드립니다.",
      features: [
        "입국",
        "출국"
      ],
      price: "상담 문의",
      gradient: "from-green-500 to-emerald-500",
      buttonGradient: "from-green-600 to-emerald-600",
      popular: true
    },
    {
      id: 'overstay',
      icon: Shield,
      title: "오버스테이",
      subtitle: "체류기간 초과 처리",
      description: "체류기간 초과 시 벌금 납부 및 출국 수속을 도와드립니다.",
      features: [
        "7일 미만",
        "7일 이상 14일 미만",
        "그 이후 상담"
      ],
      price: "상담 문의",
      gradient: "from-orange-500 to-red-500",
      buttonGradient: "from-orange-600 to-red-600",
      popular: false
    },
    {
      id: 'pickup',
      icon: MapPin,
      title: "공항픽업(호치민 內)",
      subtitle: "공항 픽업 서비스",
      description: "공항에서 호텔까지 안전하고 편리한 픽업 서비스를 제공합니다.",
      features: [
        "이노바",
        "카니발"
      ],
      price: "상담 문의",
      gradient: "from-purple-500 to-pink-500",
      buttonGradient: "from-purple-600 to-pink-600",
      popular: false
    }
  ];

  return (
    <section id="additional-services" className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20 animate-fade-in">
          <div className="inline-flex items-center space-x-2 bg-purple-100 px-4 py-2 rounded-full text-purple-700 text-sm font-medium mb-6">
            <Star className="h-4 w-4" />
            <span>추가 서비스</span>
          </div>
          <h2 className="text-5xl font-bold text-[#003366] mb-6">
            <span className="text-gradient">부가 서비스</span>
          </h2>
          <p className="text-gray-600 text-xl max-w-3xl mx-auto">
            비자 발급과 함께 필요한 다양한 서비스를 원스톱으로 제공합니다.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <div
                key={service.id}
                className={`group animate-fade-in ${service.popular ? 'pt-6' : 'pt-0'}`}
                style={{animationDelay: `${index * 0.2}s`}}
              >
                <div className="relative h-full">
                  {service.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-30">
                      <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-2 md:px-4 py-1 md:py-2 rounded-full text-white text-xs md:text-sm font-bold shadow-lg">
                        ⭐ 인기
                      </div>
                    </div>
                  )}

                  <Card className="relative overflow-hidden floating-card gradient-card border-0 h-full flex flex-col z-10">
                    <CardHeader className="pb-2 md:pb-4 p-3 md:p-6 flex-shrink-0">
                      <div className="flex items-center justify-center mb-2 md:mb-4">
                        <div className={`w-10 h-10 md:w-16 md:h-16 bg-gradient-to-br ${service.gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          <IconComponent className="h-5 w-5 md:h-8 md:w-8 text-white" />
                        </div>
                      </div>
                      <CardTitle className="text-sm md:text-xl text-gray-900 mb-1 md:mb-2 text-center font-bold">{service.title}</CardTitle>
                      <p className="text-gray-600 leading-relaxed text-center text-xs md:text-base hidden md:block">{service.description}</p>
                    </CardHeader>

                    <CardContent className="space-y-2 md:space-y-4 flex-grow p-3 md:p-6">
                      <div className="space-y-1 md:space-y-3">
                        {service.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center space-x-2 md:space-x-3">
                            <div className="w-3 h-3 md:w-5 md:h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <CheckCircle className="h-2 w-2 md:h-3 md:w-3 text-green-600" />
                            </div>
                            <span className="text-gray-700 text-xs md:text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>

                      <div className="bg-gray-50 rounded-lg p-2 md:p-4 mt-auto">
                        <div className="text-center">
                          <span className="text-sm md:text-2xl font-bold text-[#003366]">{service.price}</span>
                          <div className="text-xs md:text-sm text-gray-500">부터</div>
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="pt-2 md:pt-4 p-3 md:p-6 flex-shrink-0 mt-auto">
                      <Button 
                        className={`w-full bg-gradient-to-r ${service.gradient} text-white font-semibold py-2 md:py-3 rounded-lg hover:scale-105 transition-all duration-300 shadow-lg text-xs md:text-base`}
                        onClick={() => onApplyClick && onApplyClick(service)}
                      >
                        신청하기
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-16 animate-fade-in" style={{animationDelay: '1s'}}>
          <div className="glass-card inline-block p-8 rounded-2xl">
            <h3 className="text-2xl font-bold text-[#003366] mb-4">맞춤형 패키지 상담</h3>
            <p className="text-gray-600 mb-6">고객님의 니즈에 맞는 최적의 서비스 조합을 제안해드립니다.</p>
            <Button className="gradient-accent text-white px-8 py-3 rounded-xl btn-glow hover:scale-105 transition-all duration-300">
              <Sparkles className="h-5 w-5 mr-2" />
              패키지 상담받기
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AdditionalServices;