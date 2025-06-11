import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import {
  Play,
  Star,
  Shield,
  Clock,
  Users,
  ArrowRight,
  CheckCircle,
  Award,
  Zap,
  Globe,
  Phone,
  MessageCircle,
} from "lucide-react";

function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

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
      description: "AI 기술과 전문가 검토로 오류 없는 신속한 처리",
      gradient: "from-emerald-500 via-teal-600 to-cyan-700",
    },
    {
      title: "전 과정 완벽 지원",
      subtitle: "신청부터 발급까지 원스톱 서비스",
      description: "서류 준비, 번역, 검토까지 모든 과정을 책임집니다",
      gradient: "from-orange-500 via-red-500 to-pink-600",
    },
  ];

  useEffect(() => {
    setIsVisible(true);
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const stats = [
    { icon: Users, number: "50,000+", label: "고객 만족" },
    { icon: Award, number: "99.8%", label: "승인률" },
    { icon: Clock, number: "24시간", label: "빠른 처리" },
    { icon: Shield, number: "100%", label: "보안 보장" },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 동적 배경 그라디언트 */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${slides[currentSlide].gradient} transition-all duration-1000 ease-in-out`}
      ></div>

      {/* 배경 패턴 */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>

      {/* 부유하는 요소들 */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full animate-ping"
          style={{ animationDelay: "0s" }}
        ></div>
        <div
          className="absolute top-40 right-20 w-16 h-16 bg-white/5 rounded-full animate-ping"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-40 left-1/4 w-12 h-12 bg-white/10 rounded-full animate-ping"
          style={{ animationDelay: "4s" }}
        ></div>
        <div
          className="absolute top-1/3 right-1/4 w-8 h-8 bg-white/20 rounded-full animate-ping"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center text-white">
          {/* 메인 콘텐츠 */}
          <div
            className={`transform transition-all duration-1000 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
          >
            {/* 배지 */}
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm border border-white/30 px-6 py-3 rounded-full text-white text-sm font-semibold mb-8 animate-bounce">
              <Star className="h-5 w-5 text-yellow-300" />
              <span>대한민국 1위 베트남 비자 전문 서비스</span>
            </div>

            {/* 메인 타이틀 */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              {slides[currentSlide].title}
            </h1>

            {/* 서브 타이틀 */}
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-4 text-yellow-300">
              {slides[currentSlide].subtitle}
            </h2>

            {/* 설명 */}
            <p className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto leading-relaxed text-blue-100">
              {slides[currentSlide].description}
            </p>

            {/* CTA 버튼 */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black px-8 py-4 text-xl font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <Zap className="h-6 w-6 mr-3" />
                지금 바로 신청하기
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-white/50 text-white hover:bg-white/10 px-8 py-4 text-xl backdrop-blur-sm"
              >
                <Play className="h-5 w-5 mr-2" />
                서비스 소개 영상
              </Button>
            </div>
          </div>

          {/* 통계 카드 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 text-center transform transition-all duration-500 hover:scale-105 hover:bg-white/20 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl mb-4 mx-auto">
                  <stat.icon className="h-6 w-6 text-black" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-blue-200 text-sm font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* 슬라이드 인디케이터 */}
          <div className="flex justify-center space-x-3 mt-12">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "bg-yellow-400 w-8"
                    : "bg-white/50 hover:bg-white/70"
                }`}
              />
            ))}
          </div>

          {/* 스크롤 다운 표시 */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="flex flex-col items-center text-white/70">
              <span className="text-sm mb-2">더 알아보기</span>
              <ArrowRight className="h-5 w-5 rotate-90" />
            </div>
          </div>
        </div>
      </div>

      {/* 연락처 플로팅 버튼 */}
      <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-50 space-y-3">
        <Button
          size="sm"
          className="w-14 h-14 rounded-full bg-yellow-500 hover:bg-yellow-600 text-black shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300"
          title="카카오톡 상담"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
        <Button
          size="sm"
          className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300"
          title="전화 상담"
        >
          <Phone className="h-6 w-6" />
        </Button>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}

export default HeroSection;
