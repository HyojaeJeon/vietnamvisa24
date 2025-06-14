"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../src/components/ui/card";
import { Button } from "../../src/components/ui/button";
import { CheckCircle, Download, Mail, Phone, Home } from "lucide-react";
import { formatCurrency, calculateVisaPrice } from "./utils";

const ConfirmationStep = ({ formData, applicationId }) => {
  const currentPrice = calculateVisaPrice(formData.visaType, formData.processingType);

  const getEstimatedProcessingDays = () => {
    const days = {
      standard: "5-7",
      express: "2-3",
      urgent: "1",
    };
    return days[formData.processingType] || "5-7";
  };

  const getExpectedDate = () => {
    const days = {
      standard: 7,
      express: 3,
      urgent: 1,
    };
    const processingDays = days[formData.processingType] || 7;
    const expectedDate = new Date();
    expectedDate.setDate(expectedDate.getDate() + processingDays);
    return expectedDate.toLocaleDateString("ko-KR");
  };

  return (
    <div className="space-y-8">
      <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-green-50/30">
        <CardHeader className="pb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-3xl bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">신청이 완료되었습니다!</CardTitle>
              <p className="text-gray-600 mt-1">비자 처리가 시작되었습니다</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 신청 정보 요약 */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-700 rounded-xl p-6 text-white">
            <div className="text-center mb-4">
              <div className="text-sm text-green-200">신청번호</div>
              <div className="text-2xl font-bold">{applicationId || "VN-" + Date.now().toString().slice(-8)}</div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center">
                <div className="text-green-200">결제 금액</div>
                <div className="font-bold">{formatCurrency(currentPrice)}</div>
              </div>
              <div className="text-center">
                <div className="text-green-200">예상 처리 기간</div>
                <div className="font-bold">{getEstimatedProcessingDays()}일</div>
              </div>
            </div>
          </div>

          {/* 처리 상태 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-800 mb-4 flex items-center gap-2">📋 처리 상태</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-sm">서류 접수 완료</span>
                <span className="text-xs text-gray-500 ml-auto">방금 전</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                <span className="text-sm text-gray-600">서류 검토 중</span>
                <span className="text-xs text-gray-500 ml-auto">1-2일 예상</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                <span className="text-sm text-gray-600">베트남 이민청 처리</span>
                <span className="text-xs text-gray-500 ml-auto">{getEstimatedProcessingDays()}일 예상</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                <span className="text-sm text-gray-600">비자 발급 완료</span>
                <span className="text-xs text-gray-500 ml-auto">{getExpectedDate()}</span>
              </div>
            </div>
          </div>

          {/* 중요 안내사항 */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="font-semibold text-yellow-800 mb-4 flex items-center gap-2">⚠️ 중요 안내사항</h3>
            <ul className="text-sm text-yellow-700 space-y-2">
              <li>• 신청번호를 꼭 기록해 두시기 바랍니다</li>
              <li>• 진행 상황은 이메일과 SMS로 안내됩니다</li>
              <li>• 추가 서류 요청 시 즉시 제출해 주세요</li>
              <li>• 비자 발급 후 여권에 부착하여 베트남 입국 시 제시</li>
              <li>• 문의사항은 고객센터로 연락 바랍니다</li>
            </ul>
          </div>

          {/* 연락처 정보 */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">📞 고객센터</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-600" />
                <div>
                  <div className="font-medium">전화 문의</div>
                  <div className="text-blue-600">02-1234-5678</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-green-600" />
                <div>
                  <div className="font-medium">이메일 문의</div>
                  <div className="text-green-600">support@vietnamvisa24.com</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500 rounded text-xs flex items-center justify-center text-white font-bold">K</div>
                <div>
                  <div className="font-medium">카카오톡</div>
                  <div className="text-yellow-600">@vietnamvisa24</div>
                </div>
              </div>
            </div>
          </div>

          {/* 액션 버튼들 */}
          <div className="flex flex-col md:flex-row gap-4 mt-8">
            <Button
              variant="outline"
              className="flex-1 px-6 py-3 border-2 border-blue-300 hover:border-blue-400 text-blue-600 rounded-xl font-semibold transition-all duration-300"
              onClick={() => window.print()}
            >
              <Download className="w-5 h-5 mr-2" />
              신청서 출력
            </Button>
            <Button
              variant="outline"
              className="flex-1 px-6 py-3 border-2 border-green-300 hover:border-green-400 text-green-600 rounded-xl font-semibold transition-all duration-300"
              onClick={() => (window.location.href = "/status")}
            >
              진행 상황 확인
            </Button>
            <Button
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => (window.location.href = "/")}
            >
              <Home className="w-5 h-5 mr-2" />
              홈으로
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConfirmationStep;
