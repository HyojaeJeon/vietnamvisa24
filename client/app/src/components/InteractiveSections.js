"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// 인터랙티브한 기능이 필요한 컴포넌트들만 동적 임포트
const Header = dynamic(() => import("./header"), {
  ssr: false,
  loading: () => (
    <header className="bg-white shadow-sm">
      <div className="container px-4 py-4 mx-auto">
        <div className="flex items-center justify-between">
          <div className="w-32 h-8 bg-gray-200 rounded animate-pulse"></div>
          <div className="flex space-x-4">
            <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </header>
  ),
});

const Chatbot = dynamic(() => import("./chatbot"), {
  ssr: false,
  loading: () => null,
});

const VisaServices = dynamic(() => import("./visaServices"), {
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
            <div key={`visa-loading-${i}`} className="p-6 bg-white shadow-lg rounded-xl">
              <div className="h-48 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
});

const AdditionalServices = dynamic(() => import("./additionalServices"), {
  ssr: false,
  loading: () => (
    <div className="py-16 bg-white">
      <div className="container px-4 mx-auto">
        <div className="w-1/4 h-6 mx-auto mb-8 bg-gray-200 rounded animate-pulse"></div>
        <div className="grid gap-6 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={`additional-loading-${i}`} className="p-4 rounded-lg bg-gray-50">
              <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
});

const ContactForm = dynamic(() => import("./contactForm"), {
  ssr: false,
  loading: () => (
    <div className="py-16 bg-gray-50">
      <div className="container px-4 mx-auto">
        <div className="w-1/4 h-8 mx-auto mb-8 bg-gray-200 rounded animate-pulse"></div>
        <div className="max-w-2xl mx-auto">
          <div className="p-8 bg-white rounded-lg shadow-lg">
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={`contact-loading-${i}`} className="h-12 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
});

export default function InteractiveSections() {
  const [mounted, setMounted] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [applicationData, setApplicationData] = useState(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleVisaApply = (visaData) => {
    console.log("Visa apply clicked:", visaData);
    setApplicationData(visaData);
    setIsChatbotOpen(true);
  };

  const handleChatbotToggle = () => {
    setIsChatbotOpen(!isChatbotOpen);
    if (isChatbotOpen) {
      setApplicationData(null);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen">
        {/* Header Loading */}
        <header className="bg-white shadow-sm">
          <div className="container px-4 py-4 mx-auto">
            <div className="flex items-center justify-between">
              <div className="w-32 h-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="flex space-x-4">
                <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Loading */}
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
    <>
      {/* Interactive Header */}
      <Header />

      {/* Interactive Visa Services */}
      <VisaServices onApplyClick={handleVisaApply} />

      {/* Interactive Additional Services */}
      <AdditionalServices onApplyClick={handleVisaApply} />

      {/* Interactive Contact Form */}
      <ContactForm />

      {/* Floating Chatbot */}
      <div className="fixed z-50 bottom-6 right-6">
        <Chatbot isOpen={isChatbotOpen} onToggle={handleChatbotToggle} applicationData={applicationData} />
      </div>
    </>
  );
}
