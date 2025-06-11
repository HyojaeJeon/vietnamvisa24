import React, { useState } from "react";
import { Button } from "./ui/button.js";
import { Card, CardContent } from "./ui/card.js";
import {
  ArrowRight,
  MessageCircle,
  Shield,
  FileCheck,
  DollarSign,
  Clock,
  Users,
  CheckCircle2,
  Star,
  Award,
  TrendingUp,
} from "lucide-react";
import { useLanguage } from "../hooks/useLanguage.js";

function HeroSection() {
  const { currentLanguage } = useLanguage();
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  const coreValues = [
    {
      icon: Shield,
      title: "투명한 진행 현황",
      description:
        "모든 비자 진행 단계를 고객님께서 직접 실시간으로 확인 가능합니다.",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: FileCheck,
      title: "전문가의 원스톱 솔루션",
      description:
        "E-visa부터 노동허가서까지, 복잡한 서류 준비를 원스톱으로 해결합니다.",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      icon: DollarSign,
      title: "정직한 정찰제 비용",
      description:
        "불필요한 추가 비용 없이, 사전에 안내된 투명한 비용을 약속합니다.",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  const handleConsultation = () => {
    setIsChatbotOpen(true);
  };

  const scrollToPricing = () => {
    const element = document.querySelector("#visa-services");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-orange-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/3 w-64 h-64 bg-gradient-to-br from-green-400/5 to-cyan-400/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-screen py-20">
          {/* 좌측: 메시지 및 설득 영역 */}
          <div className="space-y-8 lg:space-y-10">
            {/* 신뢰 배지 */}
            <div className="animate-fade-in">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-100 to-orange-100 px-4 py-2 rounded-full text-amber-700 text-sm font-medium shadow-lg">
                <Star className="h-4 w-4 fill-current" />
                <span>⭐ 10년 전문가의 98.5% 승인율</span>
              </div>
            </div>

            {/* 메인 헤드라인 */}
            <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#003366] leading-tight mb-6">
                <span className="text-gradient bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  가장 확실한
                </span>
                <br />
                베트남 비자 솔루션
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-lg">
                불투명한 절차와 예측 불가능한 시간은 끝.
                <br />
                E-Visa부터 장기체류비자까지 원스톱으로 해결하세요.
              </p>
            </div>

            {/* 핵심 가치 아이콘 */}
            <div
              className="space-y-4 animate-fade-in"
              style={{ animationDelay: "0.4s" }}
            >
              {coreValues.map((value, index) => {
                const IconComponent = value.icon;
                return (
                  <div
                    key={index}
                    className="flex items-start space-x-4 p-4 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <div
                      className={`w-12 h-12 ${value.bgColor} rounded-xl flex items-center justify-center flex-shrink-0`}
                    >
                      <IconComponent className={`h-6 w-6 ${value.color}`} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 mb-1">
                        {value.title}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {value.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTA 버튼 */}
            <div
              className="flex flex-col sm:flex-row gap-4 animate-fade-in"
              style={{ animationDelay: "0.6s" }}
            >
              <Button
                onClick={handleConsultation}
                className="bg-[#003366] hover:bg-[#004080] text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center group"
              >
                <MessageCircle className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform" />
                1:1 맞춤 비자 상담
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>

              <Button
                onClick={scrollToPricing}
                variant="outline"
                className="border-2 border-[#003366] text-[#003366] hover:bg-[#003366] hover:text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center group"
              >
                서비스 비용 확인하기
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>

          {/* 우측: 3D 이소메트릭 비자 처리 워크플로우 */}
          <div
            className="relative animate-fade-in"
            style={{ animationDelay: "0.8s" }}
          >
            <div className="isometric-container relative w-full h-[600px] bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 rounded-3xl overflow-hidden border border-blue-200/50 shadow-2xl">
              {/* 배경 패턴 */}
              <div className="absolute inset-0">
                <div className="digital-grid-pattern"></div>
                <div className="holographic-overlay"></div>
              </div>

              {/* 메인 3D 이소메트릭 워크플로우 */}
              <div className="relative z-10 h-full flex flex-col items-center justify-center p-8">
                {/* 헤더 */}
                <div className="text-center mb-12">
                  <h3 className="text-2xl font-bold text-blue-700 mb-2">
                    스마트 비자 처리 시스템
                  </h3>
                  <div className="flex items-center justify-center space-x-2 text-sm text-blue-600">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span>AI 기반 자동화 처리</span>
                  </div>
                </div>

                {/* 3D 이소메트릭 워크플로우 단계들 */}
                <div className="relative w-full max-w-2xl">
                  {/* 1단계: 서류 제출 */}
                  <div className="workflow-step step-1">
                    <div className="iso-platform">
                      <div className="platform-base"></div>
                      <div className="platform-edge"></div>

                      {/* 사용자 아바타 */}
                      <div className="user-avatar">
                        <div className="avatar-body"></div>
                        <div className="avatar-head"></div>
                      </div>

                      {/* 문서들 애니메이션 */}
                      <div className="documents-container">
                        <div className="document doc-1">
                          <div className="doc-face doc-top"></div>
                          <div className="doc-face doc-front"></div>
                          <div className="doc-face doc-right"></div>
                        </div>
                        <div className="document doc-2">
                          <div className="doc-face doc-top"></div>
                          <div className="doc-face doc-front"></div>
                          <div className="doc-face doc-right"></div>
                        </div>
                        <div className="document doc-3">
                          <div className="doc-face doc-top"></div>
                          <div className="doc-face doc-front"></div>
                          <div className="doc-face doc-right"></div>
                        </div>
                      </div>

                      {/* 업로드 이펙트 */}
                      <div className="upload-beam"></div>
                    </div>

                    <div className="step-label">
                      <h4 className="font-bold text-blue-700">1. 서류 제출</h4>
                      <p className="text-sm text-blue-600">
                        간편한 디지털 업로드
                      </p>
                    </div>
                  </div>

                  {/* 연결선 애니메이션 */}
                  <div className="workflow-connector connector-1">
                    <div className="data-flow-line"></div>
                    <div className="data-particles">
                      {[...Array(8)].map((_, i) => (
                        <div
                          key={i}
                          className={`data-particle particle-${i}`}
                        ></div>
                      ))}
                    </div>
                  </div>

                  {/* 2단계: AI + 전문가 검토 */}
                  <div className="workflow-step step-2">
                    <div className="iso-platform">
                      <div className="platform-base"></div>
                      <div className="platform-edge"></div>

                      {/* AI 홀로그램 */}
                      <div className="ai-hologram">
                        <div className="ai-core">
                          <div className="ai-ring ring-1"></div>
                          <div className="ai-ring ring-2"></div>
                          <div className="ai-ring ring-3"></div>
                          <div className="ai-center"></div>
                        </div>
                        <div className="scan-beam"></div>
                      </div>

                      {/* 전문가 홀로그램 */}
                      <div className="expert-hologram">
                        <div className="expert-avatar">
                          <div className="expert-body"></div>
                          <div className="expert-head"></div>
                          <div className="expert-glasses"></div>
                        </div>
                        <div className="verification-badge">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        </div>
                      </div>

                      {/* 스캔 중인 문서 */}
                      <div className="scanning-document">
                        <div className="scan-progress"></div>
                      </div>
                    </div>

                    <div className="step-label">
                      <h4 className="font-bold text-blue-700">
                        2. AI + 전문가 검토
                      </h4>
                      <p className="text-sm text-blue-600">정확도 99.8% 검증</p>
                    </div>
                  </div>

                  {/* 연결선 애니메이션 2 */}
                  <div className="workflow-connector connector-2">
                    <div className="data-flow-line"></div>
                    <div className="data-particles">
                      {[...Array(8)].map((_, i) => (
                        <div
                          key={i}
                          className={`data-particle particle-${i}`}
                        ></div>
                      ))}
                    </div>
                  </div>

                  {/* 3단계: 비자 발급 */}
                  <div className="workflow-step step-3">
                    <div className="iso-platform">
                      <div className="platform-base"></div>
                      <div className="platform-edge"></div>

                      {/* 비자 문서 */}
                      <div className="visa-document">
                        <div className="visa-face visa-front">
                          <div className="visa-header"></div>
                          <div className="visa-photo"></div>
                          <div className="visa-details">
                            <div className="detail-line"></div>
                            <div className="detail-line"></div>
                            <div className="detail-line"></div>
                          </div>
                        </div>
                        <div className="visa-face visa-top"></div>
                        <div className="visa-face visa-right"></div>
                      </div>

                      {/* 승인 스탬프 애니메이션 */}
                      <div className="approval-stamp">
                        <div className="stamp-circle">
                          <CheckCircle2 className="h-8 w-8 text-green-500" />
                        </div>
                        <div className="stamp-glow"></div>
                      </div>

                      {/* 성공 이펙트 */}
                      <div className="success-particles">
                        {[...Array(12)].map((_, i) => (
                          <div
                            key={i}
                            className={`success-particle sp-${i}`}
                          ></div>
                        ))}
                      </div>
                    </div>

                    <div className="step-label">
                      <h4 className="font-bold text-blue-700">3. 비자 발급</h4>
                      <p className="text-sm text-blue-600">즉시 이메일 전송</p>
                    </div>
                  </div>
                </div>

                {/* 하단 통계 */}
                {/* <div className="grid grid-cols-3 gap-6 w-full max-w-md mt-8">
                  {[
                    { icon: Clock, label: "평균 처리", value: "2-3일", color: "blue" },
                    { icon: CheckCircle2, label: "승인율", value: "99.8%", color: "green" },
                    { icon: Users, label: "월 처리", value: "2,500+", color: "purple" }
                  ].map((stat, index) => {
                    const StatIcon = stat.icon;
                    return (
                      <div key={index} className="stat-card">
                        <div className={`stat-icon-wrapper ${stat.color}`}>
                          <StatIcon className="h-5 w-5" />
                        </div>
                        <p className="text-lg font-bold text-gray-800">{stat.value}</p>
                        <p className="text-xs text-gray-600">{stat.label}</p>
                      </div>
                    );
                  })}
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 챗봇 렌더링 */}
      {isChatbotOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <h3 className="font-semibold">비자 상담 챗봇</h3>
              <button
                onClick={() => setIsChatbotOpen(false)}
                className="text-white hover:bg-white/20 p-1 rounded-full transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-6 text-center">
              <MessageCircle className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              <h4 className="text-xl font-bold text-gray-800 mb-2">
                전문가와 상담하세요
              </h4>
              <p className="text-gray-600 mb-4">
                베트남 비자 전문가가 1:1로 맞춤 상담을 제공해드립니다.
              </p>
              <Button
                onClick={() =>
                  window.open("https://open.kakao.com/o/your-channel", "_blank")
                }
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 rounded-xl"
              >
                카카오톡으로 상담하기
              </Button>
            </div>
          </div>
        </div>
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
          animation: float 3s ease-in-out infinite;
        }

        .animate-fade-in {
          animation: fadeIn 1s ease-out forwards;
          opacity: 0;
        }

        @keyframes fadeIn {
          to {
            opacity: 1;
          }
        }

        /* 3D 이소메트릭 워크플로우 스타일 */
        .isometric-container {
          background: linear-gradient(
            135deg,
            rgba(248, 250, 252, 0.95) 0%,
            rgba(239, 246, 255, 0.9) 25%,
            rgba(224, 242, 254, 0.95) 50%,
            rgba(239, 246, 255, 0.9) 75%,
            rgba(248, 250, 252, 0.95) 100%
          );
          backdrop-filter: blur(20px);
          box-shadow:
            0 20px 40px rgba(59, 130, 246, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.2),
            0 0 80px rgba(147, 197, 253, 0.1);
        }

        .digital-grid-pattern {
          background-image: linear-gradient(
              rgba(59, 130, 246, 0.08) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(59, 130, 246, 0.08) 1px,
              transparent 1px
            );
          background-size: 30px 30px;
          animation: gridFloat 15s linear infinite;
          position: absolute;
          inset: 0;
        }

        .holographic-overlay {
          background: radial-gradient(
              circle at 30% 70%,
              rgba(59, 130, 246, 0.05) 0%,
              transparent 50%
            ),
            radial-gradient(
              circle at 80% 20%,
              rgba(147, 51, 234, 0.05) 0%,
              transparent 50%
            );
          position: absolute;
          inset: 0;
          animation: shimmer 6s ease-in-out infinite alternate;
        }

        @keyframes gridFloat {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(30px, 30px);
          }
        }

        @keyframes shimmer {
          0% {
            opacity: 0.3;
          }
          100% {
            opacity: 0.8;
          }
        }

        /* 워크플로우 단계 레이아웃 */
        .workflow-step {
          position: absolute;
          text-align: center;
        }

        .step-1 {
          top: 20%;
          left: 10%;
          animation: step1Intro 2s ease-out;
        }

        .step-2 {
          top: 30%;
          left: 50%;
          transform: translateX(-50%);
          animation: step2Intro 2s ease-out 0.5s both;
        }

        .step-3 {
          top: 20%;
          right: 10%;
          animation: step3Intro 2s ease-out 1s both;
        }

        @keyframes step1Intro {
          0% {
            opacity: 0;
            transform: translateY(50px) rotateY(-30deg);
          }
          100% {
            opacity: 1;
            transform: translateY(0) rotateY(0deg);
          }
        }

        @keyframes step2Intro {
          0% {
            opacity: 0;
            transform: translateX(-50%) translateY(50px) scale(0.8);
          }
          100% {
            opacity: 1;
            transform: translateX(-50%) translateY(0) scale(1);
          }
        }

        @keyframes step3Intro {
          0% {
            opacity: 0;
            transform: translateY(50px) rotateY(30deg);
          }
          100% {
            opacity: 1;
            transform: translateY(0) rotateY(0deg);
          }
        }

        /* 이소메트릭 플랫폼 */
        .iso-platform {
          position: relative;
          width: 160px;
          height: 160px;
          margin: 0 auto 20px;
          transform-style: preserve-3d;
          animation: platformFloat 4s ease-in-out infinite;
        }

        @keyframes platformFloat {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        .platform-base {
          position: absolute;
          width: 140px;
          height: 140px;
          background: linear-gradient(135deg, #e0f2fe 0%, #b3e5fc 100%);
          border-radius: 20px;
          transform: rotateX(60deg) rotateY(-15deg);
          box-shadow:
            0 15px 30px rgba(59, 130, 246, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
        }

        .platform-edge {
          position: absolute;
          width: 140px;
          height: 20px;
          background: linear-gradient(180deg, #81d4fa 0%, #4fc3f7 100%);
          border-radius: 0 0 20px 20px;
          transform: rotateX(60deg) rotateY(-15deg) translateZ(10px);
          top: 120px;
        }

        /* 사용자 아바타 (1단계) */
        .user-avatar {
          position: absolute;
          top: 20px;
          left: 30px;
          transform: rotateX(60deg) rotateY(-15deg);
          animation: userInteraction 3s ease-in-out infinite;
        }

        @keyframes userInteraction {
          0%,
          100% {
            transform: rotateX(60deg) rotateY(-15deg) scale(1);
          }
          50% {
            transform: rotateX(60deg) rotateY(-15deg) scale(1.05);
          }
        }

        .avatar-body {
          width: 25px;
          height: 40px;
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          border-radius: 12px;
        }

        .avatar-head {
          width: 20px;
          height: 20px;
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          border-radius: 50%;
          margin: -5px auto 0;
        }

        /* 문서들 (1단계) */
        .documents-container {
          position: absolute;
          top: 40px;
          right: 20px;
          transform: rotateX(60deg) rotateY(-15deg);
        }

        .document {
          position: absolute;
          width: 30px;
          height: 40px;
          animation: documentFloat 2s ease-in-out infinite;
        }

        .doc-1 {
          z-index: 3;
          animation-delay: 0s;
        }

        .doc-2 {
          z-index: 2;
          transform: translateX(5px) translateY(5px);
          animation-delay: 0.3s;
        }

        .doc-3 {
          z-index: 1;
          transform: translateX(10px) translateY(10px);
          animation-delay: 0.6s;
        }

        @keyframes documentFloat {
          0%,
          100% {
            transform: translateY(0px) translateX(var(--doc-offset-x, 0px));
          }
          50% {
            transform: translateY(-15px) translateX(var(--doc-offset-x, 0px));
          }
        }

        .doc-face {
          position: absolute;
        }

        .doc-top {
          width: 30px;
          height: 5px;
          background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
          transform: rotateX(90deg) translateZ(2.5px);
        }

        .doc-front {
          width: 30px;
          height: 40px;
          background: linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%);
          border: 1px solid #e2e8f0;
          border-radius: 3px;
        }

        .doc-right {
          width: 5px;
          height: 40px;
          background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%);
          transform: rotateY(90deg) translateZ(30px);
        }

        /* 업로드 빔 (1단계) */
        .upload-beam {
          position: absolute;
          top: 80px;
          left: 50%;
          width: 3px;
          height: 40px;
          background: linear-gradient(
            180deg,
            rgba(34, 197, 94, 0.8) 0%,
            rgba(34, 197, 94, 0.4) 50%,
            transparent 100%
          );
          transform: translateX(-50%);
          animation: uploadPulse 1.5s ease-in-out infinite;
          box-shadow: 0 0 15px rgba(34, 197, 94, 0.6);
        }

        @keyframes uploadPulse {
          0%,
          100% {
            opacity: 0;
            transform: translateX(-50%) scaleY(0);
          }
          50% {
            opacity: 1;
            transform: translateX(-50%) scaleY(1);
          }
        }

        /* AI 홀로그램 (2단계) */
        .ai-hologram {
          position: absolute;
          top: 30px;
          left: 20px;
          transform: rotateX(60deg) rotateY(-15deg);
        }

        .ai-core {
          position: relative;
          width: 50px;
          height: 50px;
        }

        .ai-ring {
          position: absolute;
          border-radius: 50%;
          border: 2px solid;
          animation: aiRotate 3s linear infinite;
        }

        .ring-1 {
          width: 50px;
          height: 50px;
          border-color: rgba(59, 130, 246, 0.6);
          animation-duration: 3s;
        }

        .ring-2 {
          width: 35px;
          height: 35px;
          top: 7.5px;
          left: 7.5px;
          border-color: rgba(34, 211, 238, 0.8);
          animation-duration: 2s;
          animation-direction: reverse;
        }

        .ring-3 {
          width: 20px;
          height: 20px;
          top: 15px;
          left: 15px;
          border-color: rgba(147, 51, 234, 0.9);
          animation-duration: 1.5s;
        }

        .ai-center {
          position: absolute;
          width: 10px;
          height: 10px;
          top: 20px;
          left: 20px;
          background: radial-gradient(circle, #3b82f6 0%, #1e40af 100%);
          border-radius: 50%;
          animation: aiPulse 2s ease-in-out infinite;
        }

        @keyframes aiRotate {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes aiPulse {
          0%,
          100% {
            transform: scale(1);
            box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
          }
          50% {
            transform: scale(1.2);
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.8);
          }
        }

        /* 스캔 빔 (2단계) */
        .scan-beam {
          position: absolute;
          top: 55px;
          left: 15px;
          width: 60px;
          height: 3px;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(34, 211, 238, 0.8) 20%,
            rgba(34, 211, 238, 1) 50%,
            rgba(34, 211, 238, 0.8) 80%,
            transparent 100%
          );
          animation: scanSweep 2s ease-in-out infinite;
          box-shadow: 0 0 10px rgba(34, 211, 238, 0.8);
        }

        @keyframes scanSweep {
          0%,
          100% {
            transform: translateX(-20px);
            opacity: 0;
          }
          10%,
          90% {
            opacity: 1;
          }
          50% {
            transform: translateX(40px);
          }
        }

        /* 전문가 홀로그램 (2단계) */
        .expert-hologram {
          position: absolute;
          top: 20px;
          right: 20px;
          transform: rotateX(60deg) rotateY(-15deg);
          animation: expertAnalysis 4s ease-in-out infinite;
        }

        @keyframes expertAnalysis {
          0%,
          100% {
            transform: rotateX(60deg) rotateY(-15deg) scale(1);
          }
          50% {
            transform: rotateX(60deg) rotateY(-15deg) scale(1.1);
          }
        }

        .expert-avatar {
          position: relative;
        }

        .expert-body {
          width: 20px;
          height: 30px;
          background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
          border-radius: 10px;
        }

        .expert-head {
          width: 15px;
          height: 15px;
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          border-radius: 50%;
          margin: -3px auto 0;
        }

        .expert-glasses {
          position: absolute;
          top: 27px;
          left: 2.5px;
          width: 10px;
          height: 3px;
          border: 1px solid #374151;
          border-radius: 2px;
          background: rgba(59, 130, 246, 0.2);
        }

        .verification-badge {
          position: absolute;
          top: -5px;
          right: -5px;
          width: 20px;
          height: 20px;
          background: radial-gradient(circle, #10b981 0%, #059669 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: badgePulse 2s ease-in-out infinite;
        }

        @keyframes badgePulse {
          0%,
          100% {
            transform: scale(1);
            box-shadow: 0 0 10px rgba(16, 185, 129, 0.5);
          }
          50% {
            transform: scale(1.1);
            box-shadow: 0 0 20px rgba(16, 185, 129, 0.8);
          }
        }

        /* 스캔 중인 문서 (2단계) */
        .scanning-document {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%) rotateX(60deg) rotateY(-15deg);
          width: 40px;
          height: 50px;
          background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
          border: 1px solid #e2e8f0;
          border-radius: 5px;
        }

        .scan-progress {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 60%;
          background: linear-gradient(
            180deg,
            rgba(34, 211, 238, 0.3) 0%,
            rgba(34, 211, 238, 0.1) 100%
          );
          border-radius: 0 0 5px 5px;
          animation: scanProgress 3s ease-in-out infinite;
        }

        @keyframes scanProgress {
          0% {
            height: 0%;
          }
          50% {
            height: 80%;
          }
          100% {
            height: 100%;
          }
        }

        /* 비자 문서 (3단계) */
        .visa-document {
          position: absolute;
          top: 40px;
          left: 50%;
          transform: translateX(-50%) rotateX(60deg) rotateY(-15deg);
          width: 60px;
          height: 80px;
          animation: visaReveal 3s ease-in-out infinite;
        }

        @keyframes visaReveal {
          0%,
          50% {
            transform: translateX(-50%) rotateX(60deg) rotateY(-15deg)
              scale(0.8);
            opacity: 0.5;
          }
          100% {
            transform: translateX(-50%) rotateX(60deg) rotateY(-15deg) scale(1);
            opacity: 1;
          }
        }

        .visa-face {
          position: absolute;
        }

        .visa-front {
          width: 60px;
          height: 80px;
          background: linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%);
          border: 2px solid #3b82f6;
          border-radius: 8px;
          padding: 8px;
        }

        .visa-top {
          width: 60px;
          height: 8px;
          background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
          transform: rotateX(90deg) translateZ(4px);
          border-radius: 8px 8px 0 0;
        }

        .visa-right {
          width: 8px;
          height: 80px;
          background: linear-gradient(135deg, #93c5fd 0%, #60a5fa 100%);
          transform: rotateY(90deg) translateZ(60px);
          border-radius: 0 8px 8px 0;
        }

        .visa-header {
          width: 100%;
          height: 12px;
          background: linear-gradient(90deg, #3b82f6 0%, #1d4ed8 100%);
          border-radius: 4px;
          margin-bottom: 4px;
        }

        .visa-photo {
          width: 20px;
          height: 25px;
          background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
          border: 1px solid #d1d5db;
          border-radius: 2px;
          margin-bottom: 4px;
        }

        .detail-line {
          width: 100%;
          height: 3px;
          background: linear-gradient(90deg, #e5e7eb 0%, #d1d5db 100%);
          border-radius: 2px;
          margin-bottom: 2px;
        }

        /* 승인 스탬프 (3단계) */
        .approval-stamp {
          position: absolute;
          top: 20px;
          right: 20px;
          transform: rotateX(60deg) rotateY(-15deg);
          animation: stampApproval 2s ease-in-out 1s infinite;
        }

        @keyframes stampApproval {
          0%,
          80% {
            transform: rotateX(60deg) rotateY(-15deg) scale(0) rotate(0deg);
            opacity: 0;
          }
          85% {
            transform: rotateX(60deg) rotateY(-15deg) scale(1.2) rotate(-10deg);
            opacity: 1;
          }
          100% {
            transform: rotateX(60deg) rotateY(-15deg) scale(1) rotate(0deg);
            opacity: 1;
          }
        }

        .stamp-circle {
          width: 40px;
          height: 40px;
          background: radial-gradient(circle, #10b981 0%, #059669 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 5px 15px rgba(16, 185, 129, 0.4);
        }

        .stamp-glow {
          position: absolute;
          inset: -5px;
          background: radial-gradient(
            circle,
            rgba(16, 185, 129, 0.3) 0%,
            transparent 70%
          );
          border-radius: 50%;
          animation: stampGlow 2s ease-in-out infinite;
        }

        @keyframes stampGlow {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.2);
            opacity: 1;
          }
        }

        /* 성공 파티클 (3단계) */
        .success-particles {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .success-particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: radial-gradient(circle, #10b981 0%, transparent 70%);
          border-radius: 50%;
        }

        .sp-1 {
          top: 20%;
          left: 20%;
          animation: successFloat1 3s ease-in-out infinite;
        }
        .sp-2 {
          top: 30%;
          right: 20%;
          animation: successFloat2 3.5s ease-in-out infinite;
        }
        .sp-3 {
          bottom: 40%;
          left: 30%;
          animation: successFloat3 4s ease-in-out infinite;
        }
        .sp-4 {
          bottom: 30%;
          right: 30%;
          animation: successFloat4 3.2s ease-in-out infinite;
        }
        .sp-5 {
          top: 50%;
          left: 10%;
          animation: successFloat5 3.8s ease-in-out infinite;
        }
        .sp-6 {
          top: 60%;
          right: 10%;
          animation: successFloat6 3.3s ease-in-out infinite;
        }
        .sp-7 {
          bottom: 60%;
          left: 15%;
          animation: successFloat7 3.7s ease-in-out infinite;
        }
        .sp-8 {
          bottom: 50%;
          right: 15%;
          animation: successFloat8 3.4s ease-in-out infinite;
        }
        .sp-9 {
          top: 40%;
          left: 50%;
          animation: successFloat9 3.6s ease-in-out infinite;
        }
        .sp-10 {
          bottom: 70%;
          left: 50%;
          animation: successFloat10 3.9s ease-in-out infinite;
        }
        .sp-11 {
          top: 70%;
          right: 40%;
          animation: successFloat11 3.1s ease-in-out infinite;
        }
        .sp-12 {
          bottom: 20%;
          left: 40%;
          animation: successFloat12 3.5s ease-in-out infinite;
        }

        @keyframes successFloat1 {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.3;
          }
          50% {
            transform: translate(10px, -20px) scale(1.5);
            opacity: 1;
          }
        }
        @keyframes successFloat2 {
          0%,
          100% {
            transform: translate(0, 0) scale(0.8);
            opacity: 0.4;
          }
          50% {
            transform: translate(-15px, 25px) scale(1.2);
            opacity: 0.9;
          }
        }
        @keyframes successFloat3 {
          0%,
          100% {
            transform: translate(0, 0) scale(1.2);
            opacity: 0.2;
          }
          50% {
            transform: translate(20px, -15px) scale(0.6);
            opacity: 0.8;
          }
        }
        @keyframes successFloat4 {
          0%,
          100% {
            transform: translate(0, 0) scale(0.9);
            opacity: 0.5;
          }
          50% {
            transform: translate(-25px, -10px) scale(1.1);
            opacity: 0.7;
          }
        }
        @keyframes successFloat5 {
          0%,
          100% {
            transform: translate(0, 0) scale(1.1);
            opacity: 0.3;
          }
          50% {
            transform: translate(30px, 20px) scale(0.8);
            opacity: 0.9;
          }
        }
        @keyframes successFloat6 {
          0%,
          100% {
            transform: translate(0, 0) scale(0.7);
            opacity: 0.6;
          }
          50% {
            transform: translate(-20px, 15px) scale(1.3);
            opacity: 0.4;
          }
        }
        @keyframes successFloat7 {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.4;
          }
          50% {
            transform: translate(25px, -30px) scale(0.6);
            opacity: 0.9;
          }
        }
        @keyframes successFloat8 {
          0%,
          100% {
            transform: translate(0, 0) scale(1.2);
            opacity: 0.2;
          }
          50% {
            transform: translate(-15px, 25px) scale(0.8);
            opacity: 0.7;
          }
        }
        @keyframes successFloat9 {
          0%,
          100% {
            transform: translate(0, 0) scale(0.8);
            opacity: 0.5;
          }
          50% {
            transform: translate(0px, -35px) scale(1.1);
            opacity: 0.8;
          }
        }
        @keyframes successFloat10 {
          0%,
          100% {
            transform: translate(0, 0) scale(1.1);
            opacity: 0.3;
          }
          50% {
            transform: translate(0px, 30px) scale(0.7);
            opacity: 0.9;
          }
        }
        @keyframes successFloat11 {
          0%,
          100% {
            transform: translate(0, 0) scale(0.9);
            opacity: 0.4;
          }
          50% {
            transform: translate(-30px, 10px) scale(1.2);
            opacity: 0.6;
          }
        }
        @keyframes successFloat12 {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.5;
          }
          50% {
            transform: translate(20px, -25px) scale(0.6);
            opacity: 0.9;
          }
        }

        /* 워크플로우 연결선 */
        .workflow-connector {
          position: absolute;
          z-index: 1;
        }

        .connector-1 {
          top: 35%;
          left: 25%;
          width: 25%;
          height: 3px;
          transform: rotate(-10deg);
        }

        .connector-2 {
          top: 35%;
          right: 25%;
          width: 25%;
          height: 3px;
          transform: rotate(10deg);
        }

        .data-flow-line {
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(59, 130, 246, 0.3) 20%,
            rgba(59, 130, 246, 0.8) 50%,
            rgba(59, 130, 246, 0.3) 80%,
            transparent 100%
          );
          border-radius: 2px;
          animation: dataFlowLine 3s ease-in-out infinite;
        }

        @keyframes dataFlowLine {
          0%,
          100% {
            opacity: 0.3;
          }
          50% {
            opacity: 1;
          }
        }

        .data-particles {
          position: absolute;
          inset: 0;
        }

        .data-particle {
          position: absolute;
          width: 3px;
          height: 3px;
          background: radial-gradient(circle, #3b82f6 0%, transparent 70%);
          border-radius: 50%;
          top: 50%;
          animation: particleFlow 2s linear infinite;
        }

        .particle-0 {
          animation-delay: 0s;
        }
        .particle-1 {
          animation-delay: 0.25s;
        }
        .particle-2 {
          animation-delay: 0.5s;
        }
        .particle-3 {
          animation-delay: 0.75s;
        }
        .particle-4 {
          animation-delay: 1s;
        }
        .particle-5 {
          animation-delay: 1.25s;
        }
        .particle-6 {
          animation-delay: 1.5s;
        }
        .particle-7 {
          animation-delay: 1.75s;
        }

        @keyframes particleFlow {
          0% {
            left: -5px;
            opacity: 0;
            transform: translateY(-50%);
          }
          10%,
          90% {
            opacity: 1;
          }
          100% {
            left: calc(100% + 5px);
            opacity: 0;
            transform: translateY(-50%);
          }
        }

        /* 단계 라벨 */
        .step-label {
          margin-top: 10px;
        }

        .step-label h4 {
          font-size: 14px;
          margin-bottom: 4px;
        }

        .step-label p {
          font-size: 11px;
        }

        /* 하단 통계 카드 */
        .stat-card {
          text-align: center;
          padding: 16px;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(59, 130, 246, 0.2);
          backdrop-filter: blur(10px);
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.1);
          animation: statCardFloat 3s ease-in-out infinite;
        }

        @keyframes statCardFloat {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        .stat-icon-wrapper {
          width: 40px;
          height: 40px;
          margin: 0 auto 8px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .stat-icon-wrapper.blue {
          background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
          color: #1d4ed8;
        }

        .stat-icon-wrapper.green {
          background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
          color: #166534;
        }

        .stat-icon-wrapper.purple {
          background: linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%);
          color: #7c3aed;
        }
      `}</style>
    </section>
  );
}

export default HeroSection;
