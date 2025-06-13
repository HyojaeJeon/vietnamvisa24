"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// 모든 컴포넌트를 동적 임포트로 변경하여 하이드레이션 문제 해결
const Header = dynamic(() => import("./src/components/header"), {
  ssr: false,
  loading: () => null,
});

const Footer = dynamic(() => import("./src/components/footer"), {
  ssr: false,
  loading: () => null,
});

const HeroSection = dynamic(() => import("./src/components/heroSection"), {
  ssr: false,
  loading: () => null,
});

const ProcessSteps = dynamic(() => import("./src/components/processSteps"), {
  ssr: false,
  loading: () => null,
});

const FaqSection = dynamic(() => import("./src/components/faqSection"), {
  ssr: false,
  loading: () => null,
});

const ContactForm = dynamic(() => import("./src/components/contactForm"), {
  ssr: false,
  loading: () => null,
});

const VisaServices = dynamic(() => import("./src/components/visaServices"), {
  ssr: false,
  loading: () => (
    <div className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container px-4 mx-auto">
        <div className="mb-12 text-center">
          <div className="w-1/3 h-8 mx-auto mb-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-2/3 h-4 mx-auto bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={`fallback-visa-${i}`} className="p-6 bg-white shadow-lg rounded-xl">
              <div className="h-48 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
});

const AdditionalServices = dynamic(() => import("./src/components/additionalServices"), {
  ssr: false,
  loading: () => (
    <div className="py-16 bg-white">
      <div className="container px-4 mx-auto">
        <div className="w-1/4 h-6 mx-auto mb-8 bg-gray-200 rounded animate-pulse"></div>
        <div className="grid gap-6 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={`fallback-additional-${i}`} className="p-4 rounded-lg bg-gray-50">
              <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
});

const CompanyInfo = dynamic(() => import("./src/components/companyInfo"), {
  ssr: false,
  loading: () => (
    <div className="py-16 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container px-4 mx-auto">
        <div className="mb-12 text-center">
          <div className="w-1/3 h-8 mx-auto mb-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-2/3 h-4 mx-auto bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={`fallback-company-${i}`} className="p-6 bg-white shadow-lg rounded-xl">
              <div className="h-24 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
});

const Chatbot = dynamic(() => import("./src/components/chatbot"), {
  ssr: false,
  loading: () => null,
});

const GraphQLTest = dynamic(() => import("./src/components/test/GraphQLTest.jsx"), {
  ssr: false,
  loading: () => null,
});

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [applicationData, setApplicationData] = useState(null);

  // 컴포넌트가 마운트되었는지 확인 (클라이언트 사이드)
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleVisaApply = (visaData) => {
    console.log("Visa apply clicked:", visaData); // 디버깅용
    setApplicationData(visaData);
    setIsChatbotOpen(true);
  };

  const handleChatbotToggle = () => {
    setIsChatbotOpen(!isChatbotOpen);
    // 챗봇을 닫을 때만 applicationData를 초기화
    if (isChatbotOpen) {
      setApplicationData(null);
    }
  };

  // 마운트되지 않은 경우 로딩 상태 표시
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="container px-4 py-16 mx-auto">
          <div className="text-center">
            <div className="w-1/3 h-8 mx-auto mb-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-2/3 h-4 mx-auto bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <VisaServices onApplyClick={handleVisaApply} />
        <ProcessSteps />
        <AdditionalServices onApplyClick={handleVisaApply} />
        <CompanyInfo />

        {/* GraphQL Test - 개발 모드에서만 표시 */}
        {process.env.NODE_ENV === "development" && (
          <div className="py-12 bg-gray-50">
            <div className="max-w-4xl px-4 mx-auto">
              <GraphQLTest />
            </div>
          </div>
        )}

        <FaqSection />
        <ContactForm />
      </main>
      <Footer />

      {/* Floating Chatbot */}
      <div className="fixed z-50 bottom-6 right-6">
        <Chatbot isOpen={isChatbotOpen} onToggle={handleChatbotToggle} applicationData={applicationData} />
      </div>
    </div>
  );
}
