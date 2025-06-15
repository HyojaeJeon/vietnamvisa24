"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../src/components/ui/card";
import { Button } from "../../src/components/ui/button";
import { Input } from "../../src/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../src/components/ui/select";
import { Alert, AlertDescription } from "../../src/components/ui/alert";
import { CreditCard, ArrowRight, ArrowLeft, Shield, Lock, Check, Loader2, AlertCircle, Smartphone, Building } from "lucide-react";
import { formatCurrency, calculateTotalPrice } from "./utils";

const PaymentStep = ({ formData, onUpdate, onPaymentComplete, onPrevious, isSubmitting }) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
    billingAddress: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const currentPrice = calculateTotalPrice(formData);

  const paymentMethods = [
    {
      id: "card",
      name: "신용카드",
      icon: <CreditCard className="w-6 h-6" />,
      description: "Visa, MasterCard, AMEX 지원",
      popular: true,
      color: "blue",
    },
    {
      id: "kakao",
      name: "카카오페이",
      icon: <Smartphone className="w-6 h-6" />,
      description: "간편하고 안전한 결제",
      popular: true,
      color: "yellow",
    },
    {
      id: "naver",
      name: "네이버페이",
      icon: <Smartphone className="w-6 h-6" />,
      description: "네이버 간편결제",
      popular: false,
      color: "green",
    },
    {
      id: "bank",
      name: "실시간 계좌이체",
      icon: <Building className="w-6 h-6" />,
      description: "주요 은행 실시간 이체",
      popular: false,
      color: "gray",
    },
  ];

  const handlePaymentDataChange = (field, value) => {
    setPaymentData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePayment = async () => {
    if (!selectedPaymentMethod) {
      alert("결제 방법을 선택해주세요.");
      return;
    }

    if (selectedPaymentMethod === "card") {
      if (!paymentData.cardNumber || !paymentData.expiryDate || !paymentData.cvv || !paymentData.cardholderName) {
        alert("카드 정보를 모두 입력해주세요.");
        return;
      }
    }

    setIsProcessing(true);

    try {
      // 결제 처리 시뮬레이션
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const paymentInfo = {
        method: selectedPaymentMethod,
        amount: currentPrice,
        currency: "USD",
        transactionId: `TXN-${Date.now()}`,
        paidAt: new Date().toISOString(),
        ...paymentData,
      };

      await onPaymentComplete(paymentInfo);
    } catch (error) {
      console.error("Payment error:", error);
      alert("결제 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
      setIsProcessing(false);
    }
  };

  return (
    <Card className="border-0 shadow-2xl bg-gradient-to-br from-white via-slate-50 to-blue-50/30 overflow-hidden">
      <CardHeader className="pb-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white relative">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <CreditCard className="w-8 h-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-3xl font-bold mb-2">결제</CardTitle>
            <p className="text-indigo-100 text-lg">안전하고 빠른 결제로 신청을 완료하세요</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-8 space-y-8">
        {/* 결제 금액 요약 */}
        <div className="bg-gradient-to-r from-slate-800 via-gray-900 to-slate-800 rounded-3xl p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20"></div>
          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-6 text-center">결제 금액</h3>
            <div className="text-center">
              <div className="text-5xl font-bold mb-2 text-indigo-400">{formatCurrency(currentPrice)}</div>
              <p className="text-gray-300 text-lg">부가세 포함</p>
            </div>
          </div>
        </div>

        {/* 보안 안내 */}
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              <span>
                <strong>안전한 결제</strong> - 모든 결제 정보는 SSL 암호화로 보호됩니다
              </span>
            </div>
          </AlertDescription>
        </Alert>

        {/* 결제 방법 선택 */}
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">결제 방법 선택</h3>
            <p className="text-gray-600">원하시는 결제 방법을 선택해주세요</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                  selectedPaymentMethod === method.id
                    ? `border-${method.color}-500 bg-gradient-to-br from-${method.color}-50 to-${method.color}-100 shadow-lg`
                    : "border-gray-200 hover:border-gray-300 hover:shadow-md bg-white"
                }`}
                onClick={() => setSelectedPaymentMethod(method.id)}
              >
                {method.popular && (
                  <div className="absolute -top-3 left-6">
                    <span className="bg-gradient-to-r from-orange-400 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">인기</span>
                  </div>
                )}

                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 bg-gradient-to-r from-${method.color}-400 to-${method.color}-600 rounded-xl flex items-center justify-center text-white`}>{method.icon}</div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-gray-800">{method.name}</h4>
                    <p className="text-sm text-gray-600">{method.description}</p>
                  </div>
                </div>

                {selectedPaymentMethod === method.id && (
                  <div className="absolute top-4 right-4">
                    <div className={`w-6 h-6 bg-${method.color}-500 rounded-full flex items-center justify-center`}>
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 신용카드 정보 입력 (신용카드 선택 시) */}
        {selectedPaymentMethod === "card" && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-800 mb-2">카드 정보 입력</h3>
              <p className="text-gray-600">안전하게 암호화되어 처리됩니다</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-800 mb-2">카드번호 *</label>
                <Input
                  value={paymentData.cardNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").replace(/(\d{4})(?=\d)/g, "$1 ");
                    if (value.length <= 19) {
                      handlePaymentDataChange("cardNumber", value);
                    }
                  }}
                  placeholder="1234 5678 9012 3456"
                  className="h-12 text-lg font-medium border-2 border-gray-200 focus:border-blue-500"
                  maxLength={19}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">만료일 *</label>
                <Input
                  value={paymentData.expiryDate}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").replace(/(\d{2})(?=\d)/, "$1/");
                    if (value.length <= 5) {
                      handlePaymentDataChange("expiryDate", value);
                    }
                  }}
                  placeholder="MM/YY"
                  className="h-12 text-lg font-medium border-2 border-gray-200 focus:border-blue-500"
                  maxLength={5}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">보안코드 *</label>
                <Input
                  type="password"
                  value={paymentData.cvv}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    if (value.length <= 4) {
                      handlePaymentDataChange("cvv", value);
                    }
                  }}
                  placeholder="123"
                  className="h-12 text-lg font-medium border-2 border-gray-200 focus:border-blue-500"
                  maxLength={4}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-800 mb-2">카드소지자명 *</label>
                <Input
                  value={paymentData.cardholderName}
                  onChange={(e) => handlePaymentDataChange("cardholderName", e.target.value.toUpperCase())}
                  placeholder="HONG GIL DONG"
                  className="h-12 text-lg font-medium border-2 border-gray-200 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* 간편결제 안내 (카카오페이/네이버페이 선택 시) */}
        {(selectedPaymentMethod === "kakao" || selectedPaymentMethod === "naver") && (
          <div className="bg-blue-50 rounded-2xl p-6 text-center">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Smartphone className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{selectedPaymentMethod === "kakao" ? "카카오페이" : "네이버페이"} 결제</h3>
            <p className="text-gray-600">
              결제 버튼을 클릭하면 {selectedPaymentMethod === "kakao" ? "카카오페이" : "네이버페이"}
              결제 창이 열립니다.
            </p>
          </div>
        )}

        {/* 계좌이체 안내 (계좌이체 선택 시) */}
        {selectedPaymentMethod === "bank" && (
          <div className="bg-gray-50 rounded-2xl p-6 text-center">
            <div className="w-16 h-16 bg-gray-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">실시간 계좌이체</h3>
            <p className="text-gray-600">결제 버튼을 클릭하면 은행 선택 및 이체 절차가 진행됩니다.</p>
          </div>
        )}

        {/* 네비게이션 버튼 */}
        <div className="flex justify-between pt-8 border-t border-gray-200">
          <Button
            onClick={onPrevious}
            variant="outline"
            disabled={isProcessing || isSubmitting}
            className="px-8 py-4 border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-bold text-lg rounded-2xl transition-all duration-300"
          >
            <ArrowLeft className="w-6 h-6 mr-3" />
            <span>이전</span>
          </Button>

          <Button
            onClick={handlePayment}
            disabled={!selectedPaymentMethod || isProcessing || isSubmitting}
            className="px-12 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
          >
            {isProcessing || isSubmitting ? (
              <>
                <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                <span>처리 중...</span>
              </>
            ) : (
              <>
                <span className="mr-3">{formatCurrency(currentPrice)} 결제</span>
                <ArrowRight className="w-6 h-6" />
              </>
            )}
          </Button>
        </div>

        {/* 결제 약관 */}
        <div className="text-center text-sm text-gray-500 pt-4 border-t border-gray-200">
          <p>
            결제를 진행함으로써{" "}
            <a href="#" className="text-blue-600 hover:underline">
              이용약관
            </a>{" "}
            및{" "}
            <a href="#" className="text-blue-600 hover:underline">
              개인정보처리방침
            </a>
            에 동의하게 됩니다.
          </p>
          <p className="mt-2">문의사항이 있으시면 고객센터(1588-1234)로 연락해주세요.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentStep;
