import React from "react";
import { Card, CardContent } from "./ui/card.js";
import { ChevronDown, Search, HelpCircle, MessageCircle, Clock, CheckCircle, FileText, DollarSign } from "lucide-react";

// 서버 사이드 렌더링을 위한 정적 FAQ 컴포넌트
function StaticFaqSection() {
  const faqs = [
    {
      id: 1,
      question: "베트남 E-VISA 처리 시간은 얼마나 걸리나요?",
      answer: "일반적으로 영업일 기준 1-3일이 소요되며, 긴급 처리 시 24시간 내 발급 가능합니다. 성수기나 베트남 공휴일에는 처리 시간이 다소 지연될 수 있습니다.",
      category: "processing",
      icon: Clock,
    },
    {
      id: 2,
      question: "승인률은 어느 정도인가요?",
      answer: "저희 서비스의 승인률은 99.8%입니다. 전문가가 사전에 서류를 검토하고 완벽하게 대행 신청하기 때문에 거의 모든 신청이 승인됩니다.",
      category: "approval",
      icon: CheckCircle,
    },
    {
      id: 3,
      question: "필요한 서류는 무엇인가요?",
      answer: "여권 스캔본, 증명사진, 항공편 정보, 숙박 정보가 필요합니다. 한국어로 된 간편한 양식을 제공해드리며, 어려운 부분은 전문가가 도움을 드립니다.",
      category: "documents",
      icon: FileText,
    },
    {
      id: 4,
      question: "비용은 얼마인가요?",
      answer: "관광비자 기준으로 50,000원부터 시작하며, 처리 시간과 비자 종류에 따라 차이가 있습니다. 정확한 견적은 상담을 통해 안내해드립니다.",
      category: "cost",
      icon: DollarSign,
    },
    {
      id: 5,
      question: "비자가 거절되면 어떻게 되나요?",
      answer: "만약 비자가 거절되는 경우, 전액 환불해드리며 거절 사유를 분석하여 재신청 방법을 안내해드립니다. 다만, 저희 서비스는 99.8%의 높은 승인률을 자랑합니다.",
      category: "approval",
      icon: HelpCircle,
    },
  ];

  const categories = [
    { key: "all", label: "전체", icon: HelpCircle },
    { key: "processing", label: "처리시간", icon: Clock },
    { key: "documents", label: "서류", icon: FileText },
    { key: "approval", label: "승인", icon: CheckCircle },
    { key: "cost", label: "비용", icon: DollarSign },
  ];

  return (
    <section id="faq" className="py-24 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-br from-blue-200/10 to-purple-200/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-purple-200/10 to-pink-200/10 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-2 rounded-full text-blue-700 text-sm font-medium mb-6">
            <HelpCircle className="h-4 w-4" />
            <span>자주 묻는 질문</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-6">궁금한 점이 있으신가요?</h2>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">베트남 비자 신청에 대한 자주 묻는 질문들을 확인해보세요</p>
        </div>

        {/* FAQ Content */}
        <div className="max-w-4xl mx-auto">
          <div className="grid gap-6">
            {faqs.map((faq) => {
              const IconComponent = faq.icon;

              return (
                <Card key={faq.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                  <CardContent className="p-0">
                    {/* Question */}
                    <div className="p-6 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 flex-1">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                            <IconComponent className="h-6 w-6 text-white" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">{faq.question}</h3>
                        </div>
                        <ChevronDown className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                      </div>
                    </div>

                    {/* Answer */}
                    <div className="px-6 pb-6">
                      <div className="pl-16 pr-8">
                        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-l-4 border-blue-500">
                          <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Contact Section */}
          <div className="mt-16 text-center">
            <Card className="bg-gradient-to-r from-blue-600 to-purple-600 border-0 text-white overflow-hidden relative">
              <div className="absolute inset-0 bg-black/10"></div>
              <CardContent className="p-8 relative z-10">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-90" />
                <h3 className="text-2xl font-bold mb-4">더 궁금한 점이 있으신가요?</h3>
                <p className="text-blue-100 mb-6 max-w-2xl mx-auto">전문 상담원이 24시간 친절하게 답변드립니다. 언제든지 편하게 문의해주세요.</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <div className="flex items-center justify-center space-x-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl">
                    <MessageCircle className="h-5 w-5" />
                    <span>카카오톡 상담</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl">
                    <HelpCircle className="h-5 w-5" />
                    <span>전화 상담</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

export default StaticFaqSection;
