"use client";

import { useState } from "react";
import Chatbot from "./chatbot";

export default function ChatbotRenderer() {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [applicationData, setApplicationData] = useState(null);
  const handleChatbotToggle = () => {
    setIsChatbotOpen(!isChatbotOpen);
    // 챗봇을 닫을 때만 applicationData를 초기화
    if (isChatbotOpen) {
      setApplicationData(null);
    }
  };

  return (
    <>
      {/* Floating Chatbot */}
      <div className="fixed bottom-6 right-6 z-50">
        <Chatbot
          isOpen={isChatbotOpen}
          onToggle={handleChatbotToggle}
          applicationData={applicationData}
        />
      </div>
    </>
  );
}
