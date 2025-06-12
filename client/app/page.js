"use client";

import { useState } from "react";
import Header from "./src/components/header";
import Footer from "./src/components/footer";
import HeroSection from "./src/components/heroSection";
import VisaServices from "./src/components/visaServices";
import ProcessSteps from "./src/components/processSteps";
import AdditionalServices from "./src/components/additionalServices";
import CompanyInfo from "./src/components/companyInfo";
import FaqSection from "./src/components/faqSection";
import ContactForm from "./src/components/contactForm";
import Chatbot from "./src/components/chatbot";
import GraphQLTest from "./src/components/test/GraphQLTest.jsx";

export default function HomePage() {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [applicationData, setApplicationData] = useState(null);

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

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <VisaServices onApplyClick={handleVisaApply} />
        <ProcessSteps />
        <AdditionalServices onApplyClick={handleVisaApply} /> <CompanyInfo />
        <div className="py-12 bg-gray-50">
          <div className="max-w-4xl px-4 mx-auto">
            <GraphQLTest />
          </div>
        </div>
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
