import React, { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button.js";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card.js";
import { Input } from "./ui/input.js";
import {
  MessageCircle,
  Send,
  X,
  Bot,
  User,
  FileText,
  CheckCircle,
  Clock,
  Calendar,
} from "lucide-react";

function Chatbot({ isOpen, onToggle, applicationData = null, initialMessage = "" }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "안녕하세요! 베트남 비자 관련 궁금한 점이 있으시면 언제든 물어보세요.",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState(initialMessage);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 초기 메시지 설정
  useEffect(() => {
    if (initialMessage && isOpen) {
      setInputMessage(initialMessage);
    }
  }, [initialMessage, isOpen]);

  // 신청 데이터가 있을 때 신청 카드 메시지 추가
  useEffect(() => {
    if (applicationData && isOpen) {
      const applicationMessage = {
        id: Date.now(),
        isBot: true,
        isApplicationCard: true,
        applicationData: applicationData,
        timestamp: new Date(),
      };

      const confirmMessage = {
        id: Date.now() + 1,
        text: `${applicationData.title} 신청이 접수되었습니다! 담당자가 곧 연락드릴 예정입니다. 추가 문의사항이 있으시면 언제든 말씀해 주세요.`,
        isBot: true,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, applicationMessage, confirmMessage]);
    }
  }, [applicationData, isOpen]);

  const getResponse = (message) => {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes("관광") || lowerMessage.includes("여행")) {
      return "관광 비자(DL)는 베트남 여행을 위한 비자입니다. 최대 30일간 체류가 가능하며, 24시간 내 발급됩니다. 더 자세한 정보가 필요하시면 상담원 연결을 도와드릴까요?";
    } else if (lowerMessage.includes("상용") || lowerMessage.includes("출장")) {
      return "상용 비자(DN)는 비즈니스 목적의 베트남 방문을 위한 비자입니다. 최대 90일간 체류가 가능하며, 복수 입국이 가능합니다.";
    } else if (
      lowerMessage.includes("전자") ||
      lowerMessage.includes("온라인")
    ) {
      return "전자 비자(EV)는 온라인으로 신청하고 이메일로 받는 간편한 비자입니다. 12-24시간 내 발급되며, 가장 빠른 처리 방법입니다.";
    } else if (lowerMessage.includes("가격") || lowerMessage.includes("비용")) {
      return "비자 대행 수수료는 관광비자 89,000원, 상용비자 149,000원, 전자비자 59,000원입니다. VAT가 포함된 가격입니다.";
    } else if (lowerMessage.includes("시간") || lowerMessage.includes("처리")) {
      return "처리 시간은 비자 유형에 따라 다릅니다. 전자비자는 12-24시간, 관광비자는 24시간, 상용비자는 24-48시간 소요됩니다.";
    } else {
      return "죄송합니다. 더 자세한 답변을 위해 전문 상담사와 연결해드릴까요? 또는 다른 질문을 해주세요.";
    }
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        text: getResponse(inputMessage),
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);

    setInputMessage("");
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const ApplicationCard = ({ data }) => (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 max-w-md">
      <div className="flex items-center space-x-3 mb-4">
        <div
          className={`w-12 h-12 bg-gradient-to-br ${data.gradient} rounded-xl flex items-center justify-center shadow-lg`}
        >
          <FileText className="h-6 w-6 text-white" />
        </div>
        <div>
          <h4 className="text-lg font-bold text-gray-900">{data.title}</h4>
          <p className="text-sm text-gray-600">
            {data.subtitle} · {data.duration}
          </p>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">신청일시:</span>
          <span className="text-gray-900 font-medium">
            {new Date().toLocaleString("ko-KR")}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">처리상태:</span>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
            <span className="text-orange-600 font-medium">접수 완료</span>
          </div>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">예상 처리시간:</span>
          <span className="text-gray-900 font-medium">4-5일</span>
        </div>
      </div>

      <div className="bg-white/80 rounded-lg p-3 mb-4">
        <h5 className="text-sm font-semibold text-gray-900 mb-2">신청 내역</h5>
        <div className="space-y-1">
          {data.features?.slice(0, 2).map((feature, index) => (
            <div key={index} className="flex items-start space-x-2">
              <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-xs text-gray-700">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-xs text-gray-500">
          신청번호:{" "}
          {`${data.id?.toUpperCase() || "VISA"}-${Date.now().toString().slice(-6)}`}
        </div>
        <div className="flex items-center space-x-1 text-xs text-blue-600">
          <Clock className="h-3 w-3" />
          <span>처리 중</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Chat Toggle Button */}
      <Button
        onClick={onToggle}
        className="w-12 h-12 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg transition-all duration-300 animate-fade-pulse"
        style={{
          marginTop: "12px",
          background: "linear-gradient(45deg, #059669, #047857)",
          boxShadow:
            "0 10px 25px rgba(5, 150, 105, 0.3), 0 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        {isOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <MessageCircle className="h-5 w-5" />
        )}
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-[100px] right-6 w-96 h-[500px] z-40 transform transition-all duration-300 ease-out animate-slide-up">
          <Card className="h-full flex flex-col shadow-2xl border-0 bg-white rounded-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-xl flex-shrink-0 p-4">
              <CardTitle className="flex items-center space-x-2">
                <Bot className="h-5 w-5" />
                <span>비자 상담 챗봇</span>
                <div className="ml-auto">
                  <button
                    onClick={onToggle}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </CardTitle>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col p-0 min-h-0">
              {/* Messages */}
              <div
                className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0 bg-gray-50"
                style={{
                  scrollbarWidth: "thin",
                  scrollbarColor: "#cbd5e1 #f1f5f9",
                }}
              >
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}
                  >
                    {message.isApplicationCard ? (
                      <ApplicationCard data={message.applicationData} />
                    ) : (
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          message.isBot
                            ? "bg-white text-gray-800 shadow-sm border"
                            : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                        }`}
                      >
                        <div className="flex items-start space-x-2">
                          {message.isBot && (
                            <Bot className="h-4 w-4 mt-0.5 flex-shrink-0 text-blue-600" />
                          )}
                          <p className="text-sm leading-relaxed">
                            {message.text}
                          </p>
                          {!message.isBot && (
                            <User className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-gray-200 flex-shrink-0 bg-white">
                <div className="flex space-x-2">
                  <Input
                    ref={inputRef}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="메시지를 입력하세요..."
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-blue-500"
                  />
                  <Button
                    onClick={handleSendMessage}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl px-4"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }

        .animate-fade-pulse {
          animation: fade-pulse 2s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}

export default Chatbot;
