import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card.js";
import { Input } from "./ui/input.js";
import { ChevronDown, ChevronUp, Search, HelpCircle, MessageCircle } from "lucide-react";
import { useLanguage } from "../hooks/useLanguage.js";
import { t } from "../lib/translations.js";

function FaqSection() {
  const { currentLanguage } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Check if component is mounted (client-side)
  useEffect(() => {
    setMounted(true);
  }, []);

  // Use default language on server-side rendering
  const displayLanguage = mounted ? currentLanguage : "ko";
  const faqs = [
    {
      id: 1,
      question: t("faq.q1", displayLanguage),
      answer: t("faq.a1", displayLanguage),
      category: "processing",
    },
    {
      id: 2,
      question: t("faq.q2", displayLanguage),
      answer: t("faq.a2", displayLanguage),
      category: "approval",
    },
    {
      id: 3,
      question: t("faq.q3", displayLanguage),
      answer: t("faq.a3", displayLanguage),
      category: "documents",
    },
    {
      id: 4,
      question: t("faq.q4", displayLanguage),
      answer: t("faq.a4", displayLanguage),
      category: "cost",
    },
    {
      id: 5,
      question: t("faq.q5", displayLanguage),
      answer: t("faq.a5", displayLanguage),
      category: "approval",
    },
    {
      id: 6,
      question: t("faq.q6", displayLanguage),
      answer: t("faq.a6", displayLanguage),
      category: "urgent",
    },
  ];

  const filteredFaqs = faqs.filter((faq) => faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || faq.answer.toLowerCase().includes(searchTerm.toLowerCase()));

  const toggleFaq = (id) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  return (
    <section id="faq" className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20 animate-fade-in">
          <div className="inline-flex items-center space-x-2 bg-blue-100 px-4 py-2 rounded-full text-blue-700 text-sm font-medium mb-6">
            <HelpCircle className="h-4 w-4" />
            <span>FAQ</span>
          </div>{" "}
          <h2 className="text-5xl font-bold text-[#003366] mb-6">
            <span className="text-gradient">{t("faq.title", displayLanguage)}</span>
          </h2>
          <p className="text-gray-600 text-xl max-w-3xl mx-auto">{t("faq.subtitle", displayLanguage)}</p>
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-12 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />{" "}
            <Input
              type="text"
              placeholder={t("faq.search", displayLanguage)}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-4 text-lg rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0"
            />
          </div>
        </div>

        {/* FAQ Items */}
        <div className="max-w-4xl mx-auto space-y-4">
          {filteredFaqs.map((faq, index) => (
            <div key={faq.id} className="animate-fade-in" style={{ animationDelay: `${(index + 1) * 0.1}s` }}>
              <Card className="floating-card gradient-card border-0 overflow-hidden hover-lift">
                <CardHeader className="cursor-pointer p-6 hover:bg-gray-50 transition-colors" onClick={() => toggleFaq(faq.id)}>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-[#003366] pr-4">{faq.question}</CardTitle>
                    <div className="flex-shrink-0">{openFaq === faq.id ? <ChevronUp className="h-6 w-6 text-gray-500" /> : <ChevronDown className="h-6 w-6 text-gray-500" />}</div>
                  </div>
                </CardHeader>
                {openFaq === faq.id && (
                  <CardContent className="px-6 pb-6 pt-0">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                    </div>
                  </CardContent>
                )}
              </Card>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 animate-fade-in" style={{ animationDelay: "1s" }}>
          <div className="glass-card inline-block p-8 rounded-2xl">
            <MessageCircle className="h-12 w-12 text-blue-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-[#003366] mb-4">더 궁금한 점이 있으신가요?</h3>
            <p className="text-gray-600 mb-6">전문 상담사가 실시간으로 답변해드립니다. 언제든 편하게 문의해주세요.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="gradient-accent text-white px-6 py-3 rounded-xl hover:scale-105 transition-all duration-300 font-semibold">실시간 채팅 상담</button>
              <button className="bg-white border-2 border-blue-200 text-blue-600 px-6 py-3 rounded-xl hover:bg-blue-50 hover:scale-105 transition-all duration-300 font-semibold">
                전화 상담 예약
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FaqSection;
