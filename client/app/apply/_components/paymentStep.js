"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../src/components/ui/card";
import { Button } from "../../src/components/ui/button";
import { CreditCard, ArrowRight, ArrowLeft } from "lucide-react";
import { formatCurrency, calculateVisaPrice, validateStep } from "./utils";

const PaymentStep = ({ formData, onUpdate, onNext, onPrev }) => {
  const handleInputChange = (field, value) => {
    onUpdate({ [field]: value });
  };

  const currentPrice = calculateVisaPrice(formData.visaType, formData.processingType);
  const isValid = validateStep(6, formData);

  const paymentMethods = [
    {
      id: "card",
      name: "신용카드",
      icon: "💳",
      description: "Visa, MasterCard, AMEX",
    },
    {
      id: "bank",
      name: "계좌이체",
      icon: "🏦",
      description: "실시간 계좌이체",
    },
    {
      id: "kakao",
      name: "카카오페이",
      icon: "💛",
      description: "간편결제",
    },
    {
      id: "naver",
      name: "네이버페이",
      icon: "💚",
      description: "간편결제",
    },
  ];

  return (
    <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-green-50/30">
      <CardHeader className="pb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">결제 방법 선택</CardTitle>
            <p className="text-gray-600 mt-1">안전한 결제를 진행해주세요</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 결제 금액 요약 */}
        <div className="p-6 bg-gradient-to-r from-green-600 to-emerald-700 rounded-xl text-white">
          <div className="text-center">
            <div className="text-sm text-green-200 mb-2">총 결제 금액</div>
            <div className="text-4xl font-bold mb-2">{formatCurrency(currentPrice)}</div>
            <div className="text-sm text-green-200">부가세 포함</div>
          </div>
        </div>

        {/* 결제 방법 선택 */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">결제 방법을 선택해주세요</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                  formData.paymentMethod === method.id ? "border-green-500 bg-green-50 shadow-lg" : "border-gray-200 hover:border-green-300 hover:shadow-md"
                }`}
                onClick={() => handleInputChange("paymentMethod", method.id)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{method.icon}</span>
                  <div>
                    <div className="font-semibold text-gray-800">{method.name}</div>
                    <div className="text-sm text-gray-600">{method.description}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 이용약관 동의 */}
        <div className="space-y-4">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-2">이용약관 및 개인정보 처리방침</h4>
            <div className="text-sm text-gray-600 space-y-2 max-h-32 overflow-y-auto">
              <p>• 개인정보는 비자 신청 처리 목적으로만 사용됩니다.</p>
              <p>• 제출된 서류는 베트남 이민청에 전달됩니다.</p>
              <p>• 비자 발급은 베트남 정부의 최종 승인에 따라 결정됩니다.</p>
              <p>• 서비스 수수료는 처리 과정에서 발생하는 비용입니다.</p>
              <p>• 취소 및 환불 정책은 별도 약관에 따릅니다.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="agreement"
              checked={formData.agreementAccepted || false}
              onChange={(e) => handleInputChange("agreementAccepted", e.target.checked)}
              className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
            />
            <label htmlFor="agreement" className="text-sm text-gray-700 cursor-pointer">
              위 내용을 모두 확인하였으며, 이용약관 및 개인정보 처리방침에 동의합니다. *
            </label>
          </div>
        </div>

        {/* 보안 안내 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 mb-2">🔒 보안 안내</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• 모든 결제는 SSL 암호화로 보호됩니다</li>
            <li>• 카드 정보는 저장되지 않습니다</li>
            <li>• PG사를 통한 안전한 결제 시스템</li>
          </ul>
        </div>

        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={onPrev} className="px-6 py-3 border-2 border-gray-300 hover:border-gray-400 rounded-xl font-semibold transition-all duration-300">
            <ArrowLeft className="w-5 h-5 mr-2" />
            이전
          </Button>
          <Button
            onClick={onNext}
            disabled={!isValid}
            className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="mr-2">{formatCurrency(currentPrice)} 결제하기</span>
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentStep;
