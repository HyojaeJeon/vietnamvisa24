"use client";

import React, { useState } from "react";
import { useTracking } from "../../hooks/useTracking";
import { ServiceStructuredData } from "../../components/seo/StructuredData";
import Header from "../src/components/header";
import Footer from "../src/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "../src/components/ui/card";
import { Button } from "../src/components/ui/button";
import {
  FileText,
  Clock,
  Shield,
  CheckCircle,
  X,
  Plane,
  Building,
  Heart,
  Briefcase,
  Users,
  Camera,
  Calendar,
  MapPin,
  AlertCircle,
  Phone,
  MessageCircle,
  Download,
  ArrowRight,
  Star,
  Globe,
  CreditCard,
  Zap,
  ChevronDown,
  ChevronUp,
  UserCheck,
  Mail,
  FileCheck,
  Headphones,
  Award,
  Timer,
  BadgeCheck,
} from "lucide-react";

export default function EVisa() {
  const [expandedFaq, setExpandedFaq] = useState(null);

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const faqData = [
    {
      question: "무비자(45일)와 E-VISA(90일), 무엇이 다른가요?",
      answer: `
        <div class="space-y-4">
          <div class="grid md:grid-cols-2 gap-4">
            <div class="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 class="font-semibold text-green-800 mb-2">무비자 (45일)</h4>
              <ul class="text-sm text-green-700 space-y-1">
                <li>• 자동으로 45일 부여</li>
                <li>• 별도 신청 불필요</li>
                <li>• 출국 후 재입국 가능</li>
              </ul>
            </div>
            <div class="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 class="font-semibold text-blue-800 mb-2">E-VISA (90일)</h4>
              <ul class="text-sm text-blue-700 space-y-1">
                <li>• 45일 이상 체류 시 필요</li>
                <li>• 사전 온라인 신청</li>
                <li>• 단수/복수 선택 가능</li>
              </ul>
            </div>
          </div>
        </div>
      `,
    },
    {
      question: "E-VISA(90일) 만료 후 더 체류하려면 어떻게 해야 하나요?",
      answer: `
        <div class="space-y-4">
          <p class="text-gray-700">E-VISA는 베트남 내에서 연장이 불가능합니다. 더 체류하려면 '비자런'을 통해 재입국해야 합니다.</p>
          <div class="grid md:grid-cols-2 gap-4">
            <div class="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <h4 class="font-semibold text-amber-800 mb-2">육로 비자런 (추천)</h4>
              <ul class="text-sm text-amber-700 space-y-1">
                <li>• 캄보디아 목바이 당일 왕복</li>
                <li>• 가장 경제적인 방법</li>
                <li>• 출국 스탬프 필수</li>
                <li>• 재입국 시 45일 자동 부여</li>
              </ul>
            </div>
            <div class="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h4 class="font-semibold text-purple-800 mb-2">항공 비자런</h4>
              <ul class="text-sm text-purple-700 space-y-1">
                <li>• 태국/캄보디아/라오스</li>
                <li>• 빠르고 확실한 방법</li>
                <li>• 관광과 연계 가능</li>
                <li>• 항공료 추가 비용</li>
              </ul>
            </div>
          </div>
        </div>
      `,
    },
    {
      question: "E-VISA 신청 시 가장 흔한 실수는 무엇인가요?",
      answer: `
        <div class="space-y-4">
          <div class="p-4 bg-red-50 rounded-lg border border-red-200">
            <h4 class="font-semibold text-red-800 mb-3">흔한 반려 사유들</h4>
            <ul class="text-sm text-red-700 space-y-2">
              <li>• <strong>사진 규격 불일치:</strong> 배경색, 크기, 화질 기준 미달</li>
              <li>• <strong>여권 정보 오타:</strong> 영문명, 여권번호 입력 실수</li>
              <li>• <strong>결제 오류:</strong> 해외 결제 차단, 카드 한도 초과</li>
              <li>• <strong>서류 누락:</strong> 필수 서류 미첨부 또는 해상도 불량</li>
            </ul>
          </div>
          <div class="p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 class="font-semibold text-green-800 mb-2">전문가 대행 시 해결되는 문제들</h4>
            <p class="text-sm text-green-700">✓ 사전 서류 검토로 오류 방지 ✓ 정확한 양식 작성 ✓ 안전한 결제 처리 ✓ 99.8% 승인률 보장</p>
          </div>
        </div>
      `,
    },
    {
      question: "여권 유효기간은 얼마나 남아야 하나요?",
      answer: `
        <div class="space-y-4">
          <div class="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 class="font-semibold text-blue-800 mb-2">여권 유효기간 요구사항</h4>
            <ul class="text-sm text-blue-700 space-y-1">
              <li>• <strong>무비자 입국:</strong> 최소 6개월 이상</li>
              <li>• <strong>E-VISA 신청:</strong> 3-6개월 사이</li>
              <li>• <strong>입국 시:</strong> 반드시 유효기간 확인</li>
            </ul>
          </div>
          <div class="p-4 bg-amber-50 rounded-lg border border-amber-200">
            <p class="text-sm text-amber-700"><strong>주의:</strong> 여권 유효기간이 부족할 경우 입국이 거부될 수 있습니다.</p>
          </div>
        </div>
      `,
    },
  ];

  const testimonials = [
    {
      name: "김민수",
      location: "서울",
      comment: "급하게 필요했는데 1일 만에 처리해주셔서 감사합니다! 덕분에 출장 일정에 차질 없이 다녀올 수 있었어요.",
      rating: 5,
    },
    {
      name: "박지영",
      location: "부산",
      comment: "혼자 하다가 계속 오류 나서 맡겼는데 바로 해결됐어요. 사진 규격도 맞춰주시고 너무 편했습니다.",
      rating: 5,
    },
    {
      name: "이준호",
      location: "대구",
      comment: "복잡한 절차 없이 한국어로 간편하게 신청할 수 있어서 좋았어요. 전문가 서비스 추천합니다!",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />

      <main className="pt-20">
        {/* Hero Section - 문제 제기 및 해결책 제시 */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/50 to-transparent"></div>

          {/* 배경 애니메이션 */}
          <div className="absolute inset-0">
            <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-ping" style={{ animationDelay: "0s" }}></div>
            <div className="absolute top-32 right-20 w-16 h-16 bg-white/5 rounded-full animate-ping" style={{ animationDelay: "2s" }}></div>
            <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white/10 rounded-full animate-ping" style={{ animationDelay: "4s" }}></div>
          </div>

          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="inline-flex items-center space-x-3 bg-white/20 backdrop-blur-sm border border-white/30 px-6 py-3 rounded-full text-sm font-semibold mb-8">
              <BadgeCheck className="h-5 w-5" />
              <span>99.8% 승인률 보장 서비스</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent leading-tight">
              베트남 E-VISA,
              <br />
              <span className="text-yellow-300">5분 만에 실수 없이</span> 신청하세요
            </h1>
            <p className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto leading-relaxed text-blue-100">
              복잡한 신청 절차, 잦은 오류, 반려될까 불안하셨나요?
              <br />
              <span className="font-semibold text-white">전문가가 처음부터 끝까지 확인하여 99.8%의 승인률로 안전하게 발급해 드립니다.</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black px-8 py-4 text-xl font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <CreditCard className="h-6 w-6 mr-3" />
                지금 바로 E-VISA 신청하기
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-white/50 text-white hover:bg-white/10 px-8 py-4 text-xl backdrop-blur-sm"
                onClick={() => document.getElementById("why-agency").scrollIntoView({ behavior: "smooth" })}
              >
                <ArrowRight className="h-5 w-5 mr-2" />
                대행 서비스 장점 보기
              </Button>
            </div>
          </div>
        </section>

        {/* 왜 대행 서비스를 이용해야 하는가? */}
        <section id="why-agency" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-2 bg-red-100 px-4 py-2 rounded-full text-red-700 text-sm font-medium mb-6">
                <AlertCircle className="h-4 w-4" />
                <span>혼자 신청하면 이런 문제가...</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">왜 전문가에게 맡겨야 할까요?</h2>
              <p className="text-gray-600 text-xl max-w-3xl mx-auto">복잡한 E-VISA 신청, 작은 실수 하나로 반려될 수 있습니다</p>
            </div>

            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* 혼자 신청할 경우 */}
                <Card className="border-red-200 shadow-xl">
                  <CardHeader className="bg-gradient-to-r from-red-500 to-red-600 text-white">
                    <CardTitle className="flex items-center text-2xl">
                      <X className="h-6 w-6 mr-3" />
                      혼자 신청할 경우
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="space-y-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <X className="h-4 w-4 text-red-500" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-2">복잡한 영문 양식</h4>
                          <p className="text-gray-600 text-sm">어려운 영어 양식으로 인한 입력 오류 위험</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-4">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <X className="h-4 w-4 text-red-500" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-2">사진 규정 불일치</h4>
                          <p className="text-gray-600 text-sm">까다로운 사진 규격으로 인한 반려 위험 높음</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-4">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <X className="h-4 w-4 text-red-500" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-2">결제 및 인증 오류</h4>
                          <p className="text-gray-600 text-sm">해외 결제 차단, 카드 한도 문제 등</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-4">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <X className="h-4 w-4 text-red-500" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-2">문제 발생 시 소통 어려움</h4>
                          <p className="text-gray-600 text-sm">영어로만 제공되는 고객지원</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 전문가에게 맡길 경우 */}
                <Card className="border-green-200 shadow-xl ring-2 ring-green-400">
                  <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                    <CardTitle className="flex items-center text-2xl">
                      <CheckCircle className="h-6 w-6 mr-3" />
                      전문가에게 맡길 경우
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="space-y-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-2">간편한 한국어 정보 입력</h4>
                          <p className="text-gray-600 text-sm">직관적인 한글 양식으로 5분 만에 완료</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-4">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-2">서류 사전 검토</h4>
                          <p className="text-gray-600 text-sm">전문가가 사진/여권 규정 완벽 확인</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-4">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-2">신속한 급행 처리</h4>
                          <p className="text-gray-600 text-sm">긴급 시 1-2일 내 발급 가능</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-4">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-2">한국어 전문 상담</h4>
                          <p className="text-gray-600 text-sm">카카오톡, 전화로 실시간 지원</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* 단 3단계로 끝내는 E-VISA 신청 프로세스 */}
        <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-2 bg-blue-100 px-4 py-2 rounded-full text-blue-700 text-sm font-medium mb-6">
                <Timer className="h-4 w-4" />
                <span>간단한 3단계 프로세스</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                단 3단계로 끝내는
                <br />
                <span className="text-blue-600">E-VISA 신청 프로세스</span>
              </h2>
              <p className="text-gray-600 text-xl max-w-3xl mx-auto">복잡한 절차는 저희가, 고객님은 편리하게</p>
            </div>

            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-3 gap-8">
                {/* Step 1 */}
                <div className="text-center group">
                  <div className="relative mb-8">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110">
                      <FileText className="h-10 w-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-black font-bold text-sm">1</div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">신청 정보 제출</h3>
                  <p className="text-gray-600 leading-relaxed mb-6">고객님이 간편한 한글 양식으로 정보를 입력하고 서류를 업로드합니다</p>
                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center justify-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>5분 내 완료</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>한국어 양식</span>
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="text-center group">
                  <div className="relative mb-8">
                    <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110">
                      <UserCheck className="h-10 w-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-black font-bold text-sm">2</div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">전문가 검토 및 대행</h3>
                  <p className="text-gray-600 leading-relaxed mb-6">담당 전문가가 제출된 서류를 규정에 맞게 완벽히 검토 후, 공식 시스템에 오류 없이 대행 신청합니다</p>
                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center justify-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>전문가 검토</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>오류 방지</span>
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="text-center group">
                  <div className="relative mb-8">
                    <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110">
                      <Mail className="h-10 w-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-black font-bold text-sm">3</div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">이메일로 비자 수령</h3>
                  <p className="text-gray-600 leading-relaxed mb-6">발급이 완료된 E-VISA를 고객님의 이메일로 즉시 발송해 드립니다</p>
                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center justify-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>즉시 발송</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>인쇄 가능</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 프로세스 연결선 */}
              <div className="hidden md:block absolute inset-0 pointer-events-none">
                <div className="flex items-center justify-center h-full">
                  <div className="flex space-x-32">
                    <ArrowRight className="h-8 w-8 text-gray-300" />
                    <ArrowRight className="h-8 w-8 text-gray-300" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 서비스 플랜 및 가격 안내 */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-2 bg-green-100 px-4 py-2 rounded-full text-green-700 text-sm font-medium mb-6">
                <CreditCard className="h-4 w-4" />
                <span>투명한 가격 정책</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">서비스 플랜 및 가격</h2>
              <p className="text-gray-600 text-xl max-w-3xl mx-auto">필요에 맞는 최적의 플랜을 선택하세요</p>
            </div>

            <div className="max-w-5xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8">
                {/* 일반 신청 */}
                <Card className="shadow-xl border-0 relative overflow-hidden">
                  <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                  <CardHeader className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                          <Clock className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-2xl font-bold text-gray-800">일반 신청</CardTitle>
                          <p className="text-gray-600">안정적인 표준 처리</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-blue-600 mb-2">₩89,000</div>
                      <div className="text-sm text-gray-500">VAT, 정부 발급비 포함</div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="space-y-4 mb-8">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="text-gray-700">처리 소요 시간: 4-5 영업일</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="text-gray-700">전문가 서류 사전 검토</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="text-gray-700">대행 신청 및 발급</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="text-gray-700">한국어 고객 지원</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="text-gray-700">이메일 즉시 발송</span>
                      </div>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-4 text-lg font-semibold shadow-xl">
                      일반 신청하기
                    </Button>
                  </CardContent>
                </Card>

                {/* 긴급 신청 */}
                <Card className="shadow-xl border-0 relative overflow-hidden ring-2 ring-orange-400">
                  <div className="h-2 bg-gradient-to-r from-orange-500 to-red-500"></div>
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">급행 서비스</div>
                  <CardHeader className="p-8 bg-gradient-to-br from-orange-50 to-red-50">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                          <Zap className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-2xl font-bold text-gray-800">긴급 신청</CardTitle>
                          <p className="text-gray-600">최우선 처리 서비스</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-orange-600 mb-2">₩149,000</div>
                      <div className="text-sm text-gray-500">VAT, 정부 발급비 포함</div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="space-y-4 mb-8">
                      <div className="flex items-center space-x-3">
                        <Zap className="h-5 w-5 text-orange-500" />
                        <span className="text-gray-700 font-semibold">처리 소요 시간: 1-2 영업일</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="text-gray-700">1:1 전담 상담사 배정</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="text-gray-700">최우선 처리 보장</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="text-gray-700">실시간 진행 상황 알림</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="text-gray-700">24시간 고객 지원</span>
                      </div>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-4 text-lg font-semibold shadow-xl">긴급 신청하기</Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* E-VISA 핵심 정보 & FAQ */}
        <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-2 bg-blue-100 px-4 py-2 rounded-full text-blue-700 text-sm font-medium mb-6">
                <FileCheck className="h-4 w-4" />
                <span>자주 묻는 질문</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">E-VISA 핵심 정보 & FAQ</h2>
              <p className="text-gray-600 text-xl max-w-3xl mx-auto">궁금한 점들을 미리 확인해보세요</p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="space-y-4">
                {faqData.map((faq, index) => (
                  <Card key={index} className="shadow-lg border-0">
                    <CardHeader className="cursor-pointer hover:bg-blue-50 transition-colors p-6" onClick={() => toggleFaq(index)}>
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-800">{faq.question}</h3>
                        {expandedFaq === index ? <ChevronUp className="h-5 w-5 text-blue-500" /> : <ChevronDown className="h-5 w-5 text-blue-500" />}
                      </div>
                    </CardHeader>
                    {expandedFaq === index && (
                      <CardContent className="p-6 pt-0">
                        <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: faq.answer }} />
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 고객 후기 및 최종 CTA */}
        <section className="py-20 bg-gradient-to-br from-slate-800 to-slate-900 text-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-2 bg-yellow-500/20 backdrop-blur-sm border border-yellow-400/30 px-6 py-3 rounded-full text-yellow-300 text-sm font-semibold mb-8">
                <Award className="h-5 w-5" />
                <span>고객 만족도 99.8%</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">실제 고객 후기</h2>
              <p className="text-slate-300 text-xl max-w-3xl mx-auto">이미 수많은 고객들이 만족한 서비스를 경험해보세요</p>
            </div>

            {/* 고객 후기 */}
            <div className="grid md:grid-cols-3 gap-8 mb-16 max-w-6xl mx-auto">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="bg-white/10 backdrop-blur-sm border border-white/20 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-white/90 mb-4 leading-relaxed">"{testimonial.comment}"</p>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white font-semibold">{testimonial.name[0]}</span>
                      </div>
                      <div>
                        <div className="font-semibold">{testimonial.name}</div>
                        <div className="text-sm text-white/70">{testimonial.location}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* 최종 CTA */}
            <div className="text-center">
              <h3 className="text-3xl md:text-4xl font-bold mb-6">지금 바로 전문가에게 맡기세요!</h3>
              <p className="text-slate-300 text-xl mb-12 max-w-3xl mx-auto">
                복잡한 E-VISA 신청, 더 이상 혼자 고민하지 마세요.
                <br />
                전문가가 처음부터 끝까지 안전하게 처리해드립니다.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black px-8 py-4 text-xl font-bold shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  <CreditCard className="h-6 w-6 mr-3" />
                  지금 바로 E-VISA 신청하기
                </Button>
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/50 text-white hover:bg-white/10 px-8 py-4 text-xl backdrop-blur-sm">
                  <Phone className="h-5 w-5 mr-2" />
                  전문가 상담받기
                </Button>
              </div>

              {/* 연락처 정보 */}
              <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <Card className="bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <MessageCircle className="h-10 w-10 text-yellow-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">카카오톡</h3>
                    <p className="text-slate-300 mb-4 text-sm">실시간 채팅 상담</p>
                    <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">hcm2424</Button>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <MessageCircle className="h-10 w-10 text-blue-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">잘로 (Zalo)</h3>
                    <p className="text-slate-300 mb-4 text-sm">베트남 현지 상담</p>
                    <Button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold">093 721 7284</Button>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <Phone className="h-10 w-10 text-green-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">전화 상담</h3>
                    <p className="text-slate-300 mb-4 text-sm">직접 통화 상담</p>
                    <Button className="bg-green-500 hover:bg-green-600 text-white font-semibold">+84 93 721 7284</Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
