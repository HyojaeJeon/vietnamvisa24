"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../src/components/ui/card";
import { Button } from "../../src/components/ui/button";
import { Badge } from "../../src/components/ui/badge";
import { CheckCircle, Download, Mail, Phone, Home, Calendar, Clock, Share2, Copy, MessageCircle, FileText, Globe } from "lucide-react";
import PropTypes from "prop-types";
import { formatCurrency, calculateTotalPrice } from "./utils";
import { VISA_TYPES, PROCESSING_TYPES } from "./types";

const ConfirmationStep = ({ formData, applicationId }) => {
  const currentPrice = calculateTotalPrice(formData);

  const getVisaTypeLabel = (type) => {
    const labels = {
      [VISA_TYPES.E_VISA_90_SINGLE]: "E-VISA 90일 단수",
      [VISA_TYPES.E_VISA_90_MULTIPLE]: "E-VISA 90일 복수",
      [VISA_TYPES.VISA_FREE_45_MOKBAI]: "무비자 45일 + 목바이런",
      [VISA_TYPES.E_VISA_90_MOKBAI]: "E-VISA 90일 + 목바이런",
    };
    return labels[type] || type;
  };

  const getProcessingTypeLabel = (type) => {
    const labels = {
      [PROCESSING_TYPES.NORMAL]: "일반 처리 (4-5일)",
      [PROCESSING_TYPES.URGENT_3DAYS]: "급행 3일",
      [PROCESSING_TYPES.URGENT_2DAYS]: "급행 2일",
      [PROCESSING_TYPES.URGENT_1DAY]: "급행 1일",
      [PROCESSING_TYPES.URGENT_4HOURS]: "급행 4시간",
      [PROCESSING_TYPES.URGENT_2HOURS]: "급행 2시간",
      [PROCESSING_TYPES.URGENT_1HOUR]: "급행 1시간",
    };
    return labels[type] || type;
  };

  const getEstimatedProcessingDays = () => {
    const days = {
      [PROCESSING_TYPES.NORMAL]: "4-5",
      [PROCESSING_TYPES.URGENT_3DAYS]: "3",
      [PROCESSING_TYPES.URGENT_2DAYS]: "2",
      [PROCESSING_TYPES.URGENT_1DAY]: "1",
      [PROCESSING_TYPES.URGENT_4HOURS]: "당일",
      [PROCESSING_TYPES.URGENT_2HOURS]: "당일",
      [PROCESSING_TYPES.URGENT_1HOUR]: "당일",
    };
    return days[formData.processingType] || "4-5";
  };

  const getExpectedDate = () => {
    const days = {
      [PROCESSING_TYPES.NORMAL]: 5,
      [PROCESSING_TYPES.URGENT_3DAYS]: 3,
      [PROCESSING_TYPES.URGENT_2DAYS]: 2,
      [PROCESSING_TYPES.URGENT_1DAY]: 1,
      [PROCESSING_TYPES.URGENT_4HOURS]: 0.2,
      [PROCESSING_TYPES.URGENT_2HOURS]: 0.1,
      [PROCESSING_TYPES.URGENT_1HOUR]: 0.05,
    };
    const processingDays = days[formData.processingType] || 5;
    const expectedDate = new Date();

    if (processingDays < 1) {
      expectedDate.setHours(expectedDate.getHours() + processingDays * 24);
      return expectedDate.toLocaleString("ko-KR");
    } else {
      expectedDate.setDate(expectedDate.getDate() + processingDays);
      return expectedDate.toLocaleDateString("ko-KR");
    }
  };

  const copyApplicationId = () => {
    navigator.clipboard.writeText(applicationId);
    // You could show a toast notification here
    alert("신청번호가 클립보드에 복사되었습니다.");
  };

  const nextSteps = [
    {
      id: "document-review",
      title: "서류 검토",
      description: "업로드된 서류의 유효성을 검토합니다",
      status: "pending",
      estimatedTime: "1-2시간",
    },
    {
      id: "immigration-submission",
      title: "베트남 이민청 접수",
      description: "베트남 이민청에 공식 신청서를 제출합니다",
      status: "pending",
      estimatedTime: "4-6시간",
    },
    {
      id: "review-approval",
      title: "심사 및 승인",
      description: "베트남 이민청에서 신청서를 심사합니다",
      status: "pending",
      estimatedTime: getEstimatedProcessingDays(),
    },
    {
      id: "visa-issuance",
      title: "비자 발급",
      description: "승인된 비자를 이메일로 발송합니다",
      status: "pending",
      estimatedTime: "즉시",
    },
  ];

  return (
    <div className="space-y-8">
      {/* 메인 완료 카드 */}
      <Card className="border-0 shadow-2xl bg-gradient-to-br from-white via-green-50 to-emerald-50/30 overflow-hidden">
        <CardHeader className="pb-8 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white relative">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 text-center">
            <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <CardTitle className="text-4xl font-bold mb-4">신청이 완료되었습니다!</CardTitle>
            <p className="text-green-100 text-xl">베트남 비자 처리가 시작되었습니다</p>
          </div>
        </CardHeader>

        <CardContent className="p-8 space-y-8">
          {/* 신청번호 */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-green-600 to-emerald-700 rounded-2xl p-8 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-white/10"></div>
              <div className="relative z-10">
                <div className="text-green-200 text-lg mb-2">신청번호</div>
                <div className="text-3xl font-bold mb-4 tracking-wider">{applicationId}</div>
                <Button onClick={copyApplicationId} variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
                  <Copy className="w-4 h-4 mr-2" />
                  복사하기
                </Button>
              </div>
            </div>
          </div>

          {/* 신청 정보 요약 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 rounded-xl p-6 text-center">
              <Globe className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <div className="text-sm text-blue-600 mb-1">비자 유형</div>
              <div className="font-bold text-gray-800">{getVisaTypeLabel(formData.visaType)}</div>
            </div>
            <div className="bg-purple-50 rounded-xl p-6 text-center">
              <Clock className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <div className="text-sm text-purple-600 mb-1">처리 속도</div>
              <div className="font-bold text-gray-800">{getProcessingTypeLabel(formData.processingType)}</div>
            </div>
            <div className="bg-orange-50 rounded-xl p-6 text-center">
              <FileText className="w-8 h-8 text-orange-600 mx-auto mb-3" />
              <div className="text-sm text-orange-600 mb-1">결제 금액</div>
              <div className="font-bold text-gray-800">{formatCurrency(currentPrice)}</div>
            </div>
          </div>

          {/* 예상 완료 시간 */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-6 h-6 text-indigo-600" />
              <h3 className="text-xl font-bold text-gray-800">예상 완료 시간</h3>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-2">{getExpectedDate()}</div>
              <div className="text-gray-600">처리 완료 예정일</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 처리 단계 */}
      <Card className="border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl">처리 단계</CardTitle>
          <p className="text-gray-600">비자 처리 과정을 단계별로 확인하세요</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <div className="flex-1">
                <h4 className="font-bold text-gray-800">신청 접수 완료</h4>
                <p className="text-sm text-gray-600">신청서와 서류가 성공적으로 접수되었습니다</p>
              </div>
              <Badge variant="default" className="bg-green-500">
                완료
              </Badge>
            </div>

            {nextSteps.map((step) => (
              <div key={step.id || step.title} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-800">{step.title}</h4>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
                <div className="text-right">
                  <Badge variant="outline">대기</Badge>
                  <div className="text-xs text-gray-500 mt-1">{step.estimatedTime}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 중요 안내사항 */}
      <Card className="border-0 shadow-xl border-l-4 border-l-yellow-500">
        <CardHeader>
          <CardTitle className="text-2xl text-yellow-700">중요 안내사항</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-yellow-50 rounded-lg p-6">
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <span>
                  <strong>신청번호를 안전한 곳에 보관하세요.</strong> 진행 상황 조회 시 필요합니다.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <span>
                  <strong>이메일과 SMS로 진행 상황을 안내합니다.</strong> 스팸함도 확인해주세요.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <span>
                  <strong>추가 서류 요청 시 즉시 제출해주세요.</strong> 지연 시 처리가 늦어질 수 있습니다.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <span>
                  <strong>비자 발급 후 여권과 함께 지참하세요.</strong> 베트남 입국 시 제시가 필요합니다.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <span>
                  <strong>문의사항은 고객센터로 연락하세요.</strong> 신청번호를 준비해주세요.
                </span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* 고객 지원 */}
      <Card className="border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl">고객 지원</CardTitle>
          <p className="text-gray-600">문의사항이나 도움이 필요하시면 연락해주세요</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-blue-50 rounded-xl">
              <Phone className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <h4 className="font-bold text-gray-800 mb-2">전화 문의</h4>
              <p className="text-blue-600 font-bold text-lg">1588-1234</p>
              <p className="text-sm text-gray-600">평일 09:00-18:00</p>
            </div>
            <div className="text-center p-6 bg-green-50 rounded-xl">
              <MessageCircle className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <h4 className="font-bold text-gray-800 mb-2">카카오톡</h4>
              <p className="text-green-600 font-bold">@vietnamvisa24</p>
              <p className="text-sm text-gray-600">24시간 상담</p>
            </div>
            <div className="text-center p-6 bg-purple-50 rounded-xl">
              <Mail className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <h4 className="font-bold text-gray-800 mb-2">이메일</h4>
              <p className="text-purple-600 font-bold">support@vietnamvisa24.com</p>
              <p className="text-sm text-gray-600">24시간 접수</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 액션 버튼 */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          onClick={() => (window.location.href = "/dashboard")}
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Home className="w-5 h-5 mr-2" />
          대시보드로 이동
        </Button>
        <Button variant="outline" onClick={() => window.print()} className="px-8 py-3 border-2 border-gray-300 hover:border-gray-400 font-bold rounded-xl transition-all duration-300">
          <Download className="w-5 h-5 mr-2" />
          접수증 출력
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            const shareData = {
              title: "베트남 비자 신청 완료",
              text: `베트남 비자 신청이 완료되었습니다. 신청번호: ${applicationId}`,
              url: window.location.href,
            };
            if (navigator.share) {
              navigator.share(shareData);
            } else {
              navigator.clipboard.writeText(`베트남 비자 신청 완료! 신청번호: ${applicationId}`);
              alert("신청 정보가 클립보드에 복사되었습니다.");
            }
          }}
          className="px-8 py-3 border-2 border-gray-300 hover:border-gray-400 font-bold rounded-xl transition-all duration-300"
        >
          <Share2 className="w-5 h-5 mr-2" />
          공유하기
        </Button>
      </div>
    </div>
  );
};

ConfirmationStep.propTypes = {
  formData: PropTypes.shape({
    visaType: PropTypes.string.isRequired,
    processingType: PropTypes.string.isRequired,
    personalInfo: PropTypes.object,
    travelInfo: PropTypes.object,
    additionalServices: PropTypes.array,
    documents: PropTypes.object,
    payment: PropTypes.object,
  }).isRequired,
  applicationId: PropTypes.string,
};

export default ConfirmationStep;
