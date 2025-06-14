import React, { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button.js";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card.js";
import { Input } from "./ui/input.js";
import { MessageCircle, Send, X, Bot, User, FileText, CheckCircle, Clock, UserPlus } from "lucide-react";
import { useMutation } from "@apollo/client";
import { CREATE_CONSULTATION_MUTATION } from "../lib/graphql/mutation/consultations/index.js";
import PropTypes from "prop-types";

function Chatbot({ isOpen, onToggle, applicationData = null, initialMessage = "" }) {
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "안녕하세요! 베트남 비자 관련 궁금한 점이 있으시면 언제든 물어보세요.",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState(initialMessage);
  const [showConsultationForm, setShowConsultationForm] = useState(false);
  const [consultationForm, setConsultationForm] = useState({
    customer_name: "",
    phone: "",
    email: "",
    service_type: "general_inquiry",
  });
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // GraphQL mutation for creating consultation
  const [createConsultation, { loading: creatingConsultation }] = useMutation(CREATE_CONSULTATION_MUTATION, {
    onCompleted: (data) => {
      const botResponse = {
        id: Date.now(),
        text: `상담 티켓이 생성되었습니다! 티켓번호: CS-${data.createConsultation.id}. 담당자가 빠른 시일 내에 연락드리겠습니다.`,
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
      setShowConsultationForm(false);
      setConsultationForm({
        customer_name: "",
        phone: "",
        email: "",
        service_type: "general_inquiry",
      });
    },
    onError: (error) => {
      const botResponse = {
        id: Date.now(),
        text: "죄송합니다. 상담 접수 중 오류가 발생했습니다. 다시 시도해 주세요.",
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
    },
  });

  // Check if component is mounted (client-side)
  useEffect(() => {
    setMounted(true);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (mounted) {
      scrollToBottom();
    }
  }, [messages, mounted]);

  // 초기 메시지 설정
  useEffect(() => {
    if (mounted && initialMessage && isOpen) {
      setInputMessage(initialMessage);
    }
  }, [initialMessage, isOpen, mounted]);

  // 신청 데이터가 있을 때 신청 카드 메시지 추가
  useEffect(() => {
    if (mounted && applicationData && isOpen) {
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

    // 상담원 연결 요청 키워드 체크
    if (
      lowerMessage.includes("상담원") ||
      lowerMessage.includes("담당자") ||
      lowerMessage.includes("전문가") ||
      lowerMessage.includes("연결") ||
      lowerMessage.includes("직접 문의") ||
      lowerMessage.includes("실제 상담")
    ) {
      // 상담 연결 확인 메시지 표시
      setTimeout(() => {
        const confirmMessage = {
          id: Date.now() + 2,
          text: "전문 상담사와 연결해드릴까요?",
          isBot: true,
          isConsultationOffer: true,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, confirmMessage]);
      }, 1500);

      return "네, 더 자세한 상담을 원하시는군요. 전문 상담사가 직접 도움을 드릴 수 있습니다.";
    }

    if (lowerMessage.includes("관광") || lowerMessage.includes("여행")) {
      return "관광 비자(DL)는 베트남 여행을 위한 비자입니다. 최대 30일간 체류가 가능하며, 24시간 내 발급됩니다. 더 자세한 정보가 필요하시면 상담원 연결을 도와드릴까요?";
    } else if (lowerMessage.includes("상용") || lowerMessage.includes("출장")) {
      return "상용 비자(DN)는 비즈니스 목적의 베트남 방문을 위한 비자입니다. 최대 90일간 체류가 가능하며, 복수 입국이 가능합니다.";
    } else if (lowerMessage.includes("전자") || lowerMessage.includes("온라인")) {
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

  // 상담 신청 처리
  const handleConsultationRequest = () => {
    setShowConsultationForm(true);
    const botMessage = {
      id: Date.now(),
      text: "상담 신청을 위해 간단한 정보를 입력해 주세요:",
      isBot: true,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, botMessage]);
  };

  // 상담 신청 완료
  const handleSubmitConsultation = () => {
    if (!consultationForm.customer_name || !consultationForm.phone || !consultationForm.email) {
      alert("모든 필수 정보를 입력해 주세요.");
      return;
    }

    // 대화 기록을 JSON 형태로 저장
    const chatHistory = messages.map((msg) => ({
      timestamp: msg.timestamp,
      isBot: msg.isBot,
      text: msg.text,
    }));

    createConsultation({
      variables: {
        input: {
          ...consultationForm,
          message: `채팅 상담 요청\n\n대화 기록:\n${JSON.stringify(chatHistory, null, 2)}`,
        },
      },
    });
  };

  const ApplicationCard = ({ data }) => (
    <div className="max-w-md p-4 border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
      <div className="flex items-center mb-4 space-x-3">
        <div className={`w-12 h-12 bg-gradient-to-br ${data.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
          <FileText className="w-6 h-6 text-white" />
        </div>
        <div>
          <h4 className="text-lg font-bold text-gray-900">{data.title}</h4>
          <p className="text-sm text-gray-600">
            {data.subtitle} · {data.duration}
          </p>
        </div>
      </div>

      <div className="mb-4 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">신청일시:</span>
          <span className="font-medium text-gray-900">{new Date().toLocaleString("ko-KR")}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">처리상태:</span>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
            <span className="font-medium text-orange-600">접수 완료</span>
          </div>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">예상 처리시간:</span>
          <span className="font-medium text-gray-900">4-5일</span>
        </div>
      </div>

      <div className="p-3 mb-4 rounded-lg bg-white/80">
        <h5 className="mb-2 text-sm font-semibold text-gray-900">신청 내역</h5>{" "}
        <div className="space-y-1">
          {data.features?.slice(0, 2).map((feature) => (
            <div key={feature} className="flex items-start space-x-2">
              <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-xs text-gray-700">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-xs text-gray-500">신청번호: {`${data.id?.toUpperCase() || "VISA"}-${Date.now().toString().slice(-6)}`}</div>
        <div className="flex items-center space-x-1 text-xs text-blue-600">
          <Clock className="w-3 h-3" />
          <span>처리 중</span>
        </div>
      </div>
    </div>
  );

  // Don't render anything until component is mounted (prevents hydration issues)
  if (!mounted) {
    return null;
  }

  return (
    <>
      {/* Chat Toggle Button */}
      <Button
        onClick={onToggle}
        className="w-12 h-12 text-white transition-all duration-300 rounded-full shadow-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 animate-pulse"
        style={{
          marginTop: "12px",
          background: "linear-gradient(45deg, #059669, #047857)",
          boxShadow: "0 10px 25px rgba(5, 150, 105, 0.3), 0 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        {isOpen ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
      </Button>{" "}
      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-[100px] right-6 w-96 h-[500px] z-40 transform transition-all duration-300 ease-out animate-in slide-in-from-bottom-2">
          <Card className="flex flex-col h-full overflow-hidden bg-white border-0 shadow-2xl rounded-xl">
            <CardHeader className="flex-shrink-0 p-4 text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-xl">
              <CardTitle className="flex items-center space-x-2">
                <Bot className="w-5 h-5" />
                <span>비자 상담 챗봇</span>
                <div className="ml-auto">
                  <button onClick={onToggle} className="transition-colors text-white/80 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col flex-1 min-h-0 p-0">
              {/* Messages */}
              <div
                className="flex-1 min-h-0 p-4 space-y-4 overflow-y-auto bg-gray-50"
                style={{
                  scrollbarWidth: "thin",
                  scrollbarColor: "#cbd5e1 #f1f5f9",
                }}
              >
                {" "}
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}>
                    {message.isApplicationCard ? (
                      <ApplicationCard data={message.applicationData} />
                    ) : message.isConsultationOffer ? (
                      // 상담 연결 확인 메시지
                      <div className="max-w-[80%]">
                        <div className="p-3 mb-2 text-gray-800 bg-white border rounded-lg shadow-sm">
                          <div className="flex items-start space-x-2">
                            <Bot className="h-4 w-4 mt-0.5 flex-shrink-0 text-blue-600" />
                            <p className="text-sm leading-relaxed">{message.text}</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button onClick={handleConsultationRequest} className="px-4 py-2 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700">
                            예, 상담 신청하기
                          </Button>
                          <Button
                            onClick={() => {
                              const botMessage = {
                                id: Date.now(),
                                text: "알겠습니다. 다른 궁금한 점이 있으시면 언제든 말씀해 주세요!",
                                isBot: true,
                                timestamp: new Date(),
                              };
                              setMessages((prev) => [...prev, botMessage]);
                            }}
                            variant="outline"
                            className="px-4 py-2 text-sm rounded-lg"
                          >
                            나중에 하기
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className={`max-w-[80%] p-3 rounded-lg ${message.isBot ? "bg-white text-gray-800 shadow-sm border" : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"}`}>
                        <div className="flex items-start space-x-2">
                          {message.isBot && <Bot className="h-4 w-4 mt-0.5 flex-shrink-0 text-blue-600" />}
                          <p className="text-sm leading-relaxed">{message.text}</p>
                          {!message.isBot && <User className="h-4 w-4 mt-0.5 flex-shrink-0" />}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {/* 상담 신청 폼 */}
                {showConsultationForm && (
                  <div className="p-4 space-y-3 bg-white border rounded-lg">
                    <h4 className="font-medium text-gray-900">상담 신청 정보</h4>
                    <div className="space-y-2">
                      <Input
                        placeholder="성함"
                        value={consultationForm.customer_name}
                        onChange={(e) => setConsultationForm((prev) => ({ ...prev, customer_name: e.target.value }))}
                        className="text-sm"
                      />
                      <Input placeholder="연락처" value={consultationForm.phone} onChange={(e) => setConsultationForm((prev) => ({ ...prev, phone: e.target.value }))} className="text-sm" />
                      <Input
                        placeholder="이메일"
                        type="email"
                        value={consultationForm.email}
                        onChange={(e) => setConsultationForm((prev) => ({ ...prev, email: e.target.value }))}
                        className="text-sm"
                      />
                      <select
                        value={consultationForm.service_type}
                        onChange={(e) => setConsultationForm((prev) => ({ ...prev, service_type: e.target.value }))}
                        className="w-full p-2 text-sm border border-gray-300 rounded-md"
                      >
                        <option value="general_inquiry">일반 문의</option>
                        <option value="visa_inquiry">비자 관련</option>
                        <option value="payment_inquiry">결제 문의</option>
                        <option value="document_inquiry">서류 문의</option>
                      </select>
                    </div>
                    <div className="flex space-x-2">
                      <Button onClick={handleSubmitConsultation} disabled={creatingConsultation} className="flex-1 px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                        {creatingConsultation ? "신청 중..." : "상담 신청"}
                      </Button>
                      <Button onClick={() => setShowConsultationForm(false)} variant="outline" className="px-4 py-2 text-sm rounded-lg">
                        취소
                      </Button>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="flex-shrink-0 p-4 bg-white border-t border-gray-200">
                <div className="flex space-x-2">
                  <Input
                    ref={inputRef}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="메시지를 입력하세요..."
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-blue-500"
                  />
                  <Button onClick={handleSendMessage} className="px-4 text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>{" "}
        </div>
      )}
    </>
  );
}

Chatbot.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  applicationData: PropTypes.object,
  initialMessage: PropTypes.string,
};

export default Chatbot;
