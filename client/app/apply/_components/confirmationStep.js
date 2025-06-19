"use client";

import React, { useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../src/components/ui/card";
import { Button } from "../../src/components/ui/button";
import { Badge } from "../../src/components/ui/badge";
import { CheckCircle, Download, Mail, Phone, Home, Calendar, Clock, Share2, Copy, MessageCircle, FileText, Globe } from "lucide-react";
import PropTypes from "prop-types";
import { formatCurrency, calculateTotalPrice } from "./utils";
import { VISA_TYPES, PROCESSING_TYPES } from "./types";

const ConfirmationStep = ({ formData, applicationId }) => {
  const currentPrice = calculateTotalPrice(formData);
  const receiptRef = useRef(null);

  // PDF 다운로드 함수 - 한글 폰트 지원
  const downloadReceipt = async () => {
    try {
      const jsPDF = (await import("jspdf")).default;
      const html2canvas = (await import("html2canvas")).default;

      const element = receiptRef.current;
      if (!element) {
        alert("영수증 요소를 찾을 수 없습니다.");
        return;
      }

      // 접수증 요소를 일시적으로 표시
      const originalDisplay = element.style.display;
      element.style.display = "block";
      element.style.fontFamily = "'Noto Sans KR', 'Malgun Gothic', '맑은 고딕', 'Apple SD Gothic Neo', sans-serif";
      element.style.backgroundColor = "#ffffff";

      // HTML 요소를 캔버스로 변환 (한글 폰트 개선)
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
        imageTimeout: 30000,
        removeContainer: true,
        foreignObjectRendering: false,
        letterRendering: true,
        onclone: function (clonedDoc) {
          // 한글 폰트 스타일 추가
          const style = clonedDoc.createElement("style");
          style.textContent = `
            @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&display=swap');
            * {
              font-family: 'Noto Sans KR', 'Malgun Gothic', '맑은 고딕', 'Apple SD Gothic Neo', sans-serif !important;
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
            }
          `;
          clonedDoc.head.appendChild(style);
        },
      });

      // 원래 스타일 복원
      element.style.display = originalDisplay;

      if (!canvas || canvas.width === 0 || canvas.height === 0) {
        throw new Error("캔버스 생성에 실패했습니다.");
      }

      // PDF 생성
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      const pdf = new jsPDF("p", "mm", "a4");
      let position = 0;

      const imgData = canvas.toDataURL("image/jpeg", 0.95);
      if (!imgData || imgData === "data:,") {
        throw new Error("이미지 데이터 생성에 실패했습니다.");
      }

      pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`베트남_비자_접수증_${applicationId || "TEMP"}.pdf`);

      // 이메일 자동 발송 (nodemailer)
      try {
        await sendEmail(formData.personalInfo?.email, `베트남 비자 접수증_${applicationId || "TEMP"}.pdf`, pdf.output('datauristring'));
      } catch (emailError) {
        console.error("이메일 발송 오류:", emailError);
        alert("접수증 다운로드 완료. 이메일 발송에 실패했습니다.");
      }

    } catch (error) {
      console.error("PDF 생성 오류:", error);
      // 대체 방법: 텍스트 기반 PDF
      try {
        await generateTextBasedPDF();
      } catch (fallbackError) {
        console.error("대체 PDF 생성도 실패:", fallbackError);
        alert("PDF 생성 중 오류가 발생했습니다. 브라우저 인쇄 기능을 사용해주세요.");
      }
    }
  };

  // 텍스트 기반 PDF 생성 (대체 방법)
  const generateTextBasedPDF = async () => {
    const jsPDF = (await import("jspdf")).default;
    const pdf = new jsPDF("p", "mm", "a4");

    pdf.setFont("helvetica", "normal");
    let y = 20;
    const lineHeight = 8;
    const leftMargin = 20;

    // 제목
    pdf.setFontSize(18);
    pdf.text("Vietnam Visa Application Receipt", 105, y, { align: "center" });
    y += lineHeight * 2;

    // 신청번호
    pdf.setFontSize(14);
    pdf.text(`Application ID: ${applicationId || "N/A"}`, leftMargin, y);
    y += lineHeight * 2;

    // 개인정보
    pdf.setFontSize(12);
    pdf.text("=== Personal Information ===", leftMargin, y);
    y += lineHeight;

    const personalInfo = formData.personalInfo || {};
    pdf.text(`Name: ${personalInfo.lastName || ""} ${personalInfo.firstName || ""}`, leftMargin, y);
    y += lineHeight;
    pdf.text(`Email: ${personalInfo.email || "N/A"}`, leftMargin, y);
    y += lineHeight;
    pdf.text(`Phone: ${personalInfo.phone || "N/A"}`, leftMargin, y);
    y += lineHeight * 2;

    // 여행정보
    pdf.text("=== Travel Information ===", leftMargin, y);
    y += lineHeight;

    const travelInfo = formData.travelInfo || {};
    pdf.text(`Entry Date: ${travelInfo.entryDate || "N/A"}`, leftMargin, y);
    y += lineHeight;
    pdf.text(`Entry Port: ${travelInfo.entryPort || "N/A"}`, leftMargin, y);
    y += lineHeight;
    pdf.text(`Visa Type: ${getVisaTypeLabel(formData.visaType)}`, leftMargin, y);
    y += lineHeight;
    pdf.text(`Processing Type: ${getProcessingTypeLabel(formData.processingType)}`, leftMargin, y);
    y += lineHeight * 2;

    // 결제정보
    pdf.text("=== Payment Information ===", leftMargin, y);
    y += lineHeight;
    pdf.text(`Total Amount: ${formatCurrency(currentPrice)}`, leftMargin, y);
    y += lineHeight * 2;

    // 발급일
    pdf.text(`Issue Date: ${new Date().toLocaleDateString("en-US")}`, leftMargin, y);

    pdf.save(`Vietnam_Visa_Receipt_${applicationId || "TEMP"}.pdf`);

        // 이메일 자동 발송 (nodemailer)
      try {
        await sendEmail(formData.personalInfo?.email, `베트남 비자 접수증_${applicationId || "TEMP"}.pdf`, pdf.output('datauristring'));
      } catch (emailError) {
        console.error("이메일 발송 오류:", emailError);
        alert("접수증 다운로드 완료. 이메일 발송에 실패했습니다.");
      }
  };

  // 이메일 발송 함수 (nodemailer)
  const sendEmail = async (to, filename, dataUri) => {
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: to,
          subject: '베트남 비자 신청 접수증',
          filename: filename,
          dataUri: dataUri,
        }),
      });

      if (!response.ok) {
        throw new Error(`이메일 전송 실패: ${response.status}`);
      }

      const result = await response.json();
      console.log('이메일 전송 결과:', result);
    } catch (error) {
      console.error('이메일 전송 오류:', error);
      throw error; // 오류를 다시 던져 상위 함수에서 처리하도록 함
    }
  };

  const getVisaTypeLabel = (type) => {
    const labels = {
      [VISA_TYPES.E_VISA_90_SINGLE]: "E-VISA 90일 단수",
      [VISA_TYPES.E_VISA_90_MULTIPLE]: "E-VISA 90일 복수",
      [VISA_TYPES.VISA_FREE_45_MOKBAI]: "무비자 45일 + 목바이런",
      [VISA_TYPES.E_VISA_90_MOKBAI]: "E-VISA 90일 + 목바이런",
      "e-visa_urgent": "E-VISA 긴급", // 추가된 부분
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

    const getAirportLabel = (code) => {
    const labels = {
      "SGN": "호치민 떤선녓 공항 (SGN)",
      "HAN": "하노이 노이바이 공항 (HAN)",
      "DAD": "다낭 국제공항 (DAD)",
      "CXR": "나트랑 깜란 공항 (CXR)", //깜라인 공항 추가
      // 다른 공항 코드 추가
    };
    return labels[code] || code;
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
      {/* PDF용 접수증 (숨겨진 요소) */}
      <div
        ref={receiptRef}
        className="p-10 space-y-8 bg-white"
        style={{
          display: "none",
          fontFamily: "'Noto Sans KR', 'Malgun Gothic', '맑은 고딕', 'Apple SD Gothic Neo', sans-serif",
          lineHeight: "1.8",
          minWidth: "800px",
        }}
      >
        {/* 헤더 */}
        <div className="pb-8 mb-8 text-center border-b-2 border-blue-600">
          <div className="mb-4">
            <h1 className="mb-3 text-4xl font-bold text-blue-800">베트남 비자 신청 접수증</h1>
            <p className="text-xl text-gray-600 font-medium">Vietnam Visa Application Receipt</p>
          </div>
          <div className="flex justify-between items-center mt-6">
            <div className="text-left">
              <p className="text-sm text-gray-500">발급일: {new Date().toLocaleDateString("ko-KR")}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-blue-600">신청번호: {applicationId}</p>
            </div>
          </div>
        </div>

        {/* 메인 정보 그리드 */}
        <div className="grid grid-cols-2 gap-10">
          {/* 신청 정보 */}
          <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="mb-5 text-xl font-bold text-blue-800 border-b border-blue-300 pb-2">신청 정보</h3>
            <div className="space-y-3">
              <div className="flex">
                <span className="font-medium text-gray-700 w-24">신청번호:</span>
                <span className="font-bold text-blue-600">{applicationId}</span>
              </div>
              <div className="flex">
                <span className="font-medium text-gray-700 w-24">비자 유형:</span>
                <span className="font-bold">{getVisaTypeLabel(formData.visaType)}</span>
              </div>
              <div className="flex">
                <span className="font-medium text-gray-700 w-24">처리 속도:</span>
                <span className="font-bold">{getProcessingTypeLabel(formData.processingType)}</span>
              </div>
              <div className="flex">
                <span className="font-medium text-gray-700 w-24">신청일:</span>
                <span>{new Date().toLocaleDateString("ko-KR")}</span>
              </div>
              <div className="flex">
                <span className="font-medium text-gray-700 w-24">예상 완료일:</span>
                <span className="font-bold text-green-600">{getExpectedDate()}</span>
              </div>
            </div>
          </div>

          {/* 개인 정보 */}
          <div className="p-6 bg-green-50 rounded-lg border border-green-200">
            <h3 className="mb-5 text-xl font-bold text-green-800 border-b border-green-300 pb-2">개인 정보</h3>
            <div className="space-y-3">
              <div className="flex">
                <span className="font-medium text-gray-700 w-24">성명:</span>
                <span className="font-bold">{formData.personalInfo?.lastName} {formData.personalInfo?.firstName}</span>
              </div>
              <div className="flex">
                <span className="font-medium text-gray-700 w-24">생년월일:</span>
                <span>{formData.personalInfo?.birthDate || "N/A"}</span>
              </div>
              <div className="flex">
                <span className="font-medium text-gray-700 w-24">국적:</span>
                <span>{formData.personalInfo?.nationality || "대한민국"}</span>
              </div>
              <div className="flex">
                <span className="font-medium text-gray-700 w-24">이메일:</span>
                <span>{formData.personalInfo?.email}</span>
              </div>
              <div className="flex">
                <span className="font-medium text-gray-700 w-24">전화번호:</span>
                <span>{formData.personalInfo?.phone}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 여권 정보 */}
        <div className="p-6 bg-orange-50 rounded-lg border border-orange-200">
          <h3 className="mb-5 text-xl font-bold text-orange-800 border-b border-orange-300 pb-2">여권 정보</h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex">
                <span className="font-medium text-gray-700 w-32">여권번호:</span>
                <span className="font-bold">{formData.personalInfo?.passportNumber || "N/A"}</span>
              </div>
              <div className="flex">
                <span className="font-medium text-gray-700 w-32">여권 발급일:</span>
                <span>{formData.personalInfo?.passportIssueDate || "N/A"}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex">
                <span className="font-medium text-gray-700 w-32">여권 만료일:</span>
                <span>{formData.personalInfo?.passportExpiryDate || "N/A"}</span>
              </div>
              <div className="flex">
                <span className="font-medium text-gray-700 w-32">발급기관:</span>
                <span>{formData.personalInfo?.passportIssuePlace || "대한민국"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 여행 정보 */}
        <div className="p-6 bg-purple-50 rounded-lg border border-purple-200">
          <h3 className="mb-5 text-xl font-bold text-purple-800 border-b border-purple-300 pb-2">여행 정보</h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex">
                <span className="font-medium text-gray-700 w-32">입국일:</span>
                <span className="font-bold">{formData.travelInfo?.entryDate || "N/A"}</span>
              </div>
              <div className="flex">
                <span className="font-medium text-gray-700 w-32">출국일:</span>
                <span>{formData.travelInfo?.departureDate || "N/A"}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex">
                <span className="font-medium text-gray-700 w-32">입국공항:</span>
                <span className="font-bold">{getAirportLabel(formData.travelInfo?.entryPort)}</span>
              </div>
              <div className="flex">
                <span className="font-medium text-gray-700 w-32">방문목적:</span>
                <span>{formData.travelInfo?.purpose || "관광"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 비용 정보 */}
        <div className="p-6 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg border-2 border-green-300">
          <h3 className="mb-5 text-xl font-bold text-green-800 border-b border-green-400 pb-2">비용 정보</h3>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-lg font-medium text-gray-700">총 예상 비용</p>
              <p className="text-sm text-gray-500">Total Expected Cost</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-green-600">{formatCurrency(currentPrice)}</div>
              <div className="text-sm text-gray-500">부가세 포함</div>
            </div>
          </div>
        </div>

        {/* 연락처 정보 */}
        <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="mb-5 text-xl font-bold text-gray-800 border-b border-gray-300 pb-2">연락처 정보</h3>
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <p className="font-bold text-blue-600">전화 문의</p>
              <p className="text-lg font-bold">1588-1234</p>
              <p className="text-sm text-gray-500">평일 09:00-18:00</p>
            </div>
            <div>
              <p className="font-bold text-green-600">카카오톡</p>
              <p className="font-bold">@vietnamvisa24</p>
              <p className="text-sm text-gray-500">24시간 상담</p>
            </div>
            <div>
              <p className="font-bold text-purple-600">이메일</p>
              <p className="font-bold">support@vietnamvisa24.com</p>
              <p className="text-sm text-gray-500">24시간 접수</p>
            </div>
          </div>
        </div>

        {/* 하단 안내사항 */}
        <div className="pt-6 text-sm text-gray-600 border-t-2 border-gray-300">
          <div className="grid grid-cols-1 gap-2">
            <p>※ 본 접수증은 신청 접수 확인용이며, 비자 발급을 보장하지 않습니다.</p>
            <p>※ 처리 상황은 이메일로 안내드리며, 신청번호로 진행 상황을 확인하실 수 있습니다.</p>
            <p>※ 베트남 입국 시 여권과 승인된 비자를 함께 지참하시기 바랍니다.</p>
            <p>※ 문의사항이 있으시면 위 연락처로 신청번호와 함께 연락주시기 바랍니다.</p>
          </div>
        </div>
      </div>

      {/* 메인 완료 카드 */}
      <Card className="overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-white via-green-50 to-emerald-50/30">
        <CardHeader className="relative pb-8 text-white bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 text-center">
            <div className="flex items-center justify-center w-24 h-24 mx-auto mb-6 rounded-full bg-white/20 backdrop-blur-sm">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <CardTitle className="mb-4 text-4xl font-bold">신청이 완료되었습니다!</CardTitle>
            <p className="text-xl text-green-100">베트남 비자 처리가 시작되었습니다</p>
          </div>
        </CardHeader>

        <CardContent className="p-8 space-y-8">
          {/* 신청번호 */}
          <div className="text-center">
            <div className="relative p-8 overflow-hidden text-white bg-gradient-to-r from-green-600 to-emerald-700 rounded-2xl">
              <div className="absolute inset-0 bg-white/10"></div>
              <div className="relative z-10">
                <div className="mb-2 text-lg text-green-200">신청번호</div>
                <div className="mb-4 text-3xl font-bold tracking-wider">{applicationId}</div>
                <Button onClick={copyApplicationId} variant="outline" className="text-white bg-white/20 border-white/30 hover:bg-white/30">
                  <Copy className="w-4 h-4 mr-2" />
                  복사하기
                </Button>
              </div>
            </div>
          </div>

          {/* 신청 정보 요약 */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="p-6 text-center bg-blue-50 rounded-xl">
              <Globe className="w-8 h-8 mx-auto mb-3 text-blue-600" />
              <div className="mb-1 text-sm text-blue-600">비자 유형</div>
              <div className="font-bold text-gray-800">{getVisaTypeLabel(formData.visaType)}</div>
            </div>
            <div className="p-6 text-center bg-purple-50 rounded-xl">
              <Clock className="w-8 h-8 mx-auto mb-3 text-purple-600" />
              <div className="mb-1 text-sm text-purple-600">처리 속도</div>
              <div className="font-bold text-gray-800">{getProcessingTypeLabel(formData.processingType)}</div>
            </div>
            <div className="p-6 text-center bg-orange-50 rounded-xl">
              <FileText className="w-8 h-8 mx-auto mb-3 text-orange-600" />
              <div className="mb-1 text-sm text-orange-600">결제 금액</div>
              <div className="font-bold text-gray-800">{formatCurrency(currentPrice)}</div>
            </div>
          </div>

          {/* 예상 완료 시간 */}
          <div className="p-6 border border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-6 h-6 text-indigo-600" />
              <h3 className="text-xl font-bold text-gray-800">예상 완료 시간</h3>
            </div>
            <div className="text-center">
              <div className="mb-2 text-3xl font-bold text-indigo-600">{getExpectedDate()}</div>
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
            <div className="flex items-center gap-4 p-4 border border-green-200 rounded-lg bg-green-50">
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
              <div key={step.id || step.title} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="flex items-center justify-center w-8 h-8 border-2 border-gray-300 rounded-full">
                  <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-800">{step.title}</h4>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
                <div className="text-right">
                  <Badge variant="outline">대기</Badge>
                  <div className="mt-1 text-xs text-gray-500">{step.estimatedTime}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 중요 안내사항 */}
      <Card className="border-0 border-l-4 shadow-xl border-l-yellow-500">
        <CardHeader>
          <CardTitle className="text-2xl text-yellow-700">중요 안내사항</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-6 rounded-lg bg-yellow-50">
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 mt-2 bg-yellow-500 rounded-full"></div>
                <span>
                  <strong>신청번호를 안전한 곳에 보관하세요.</strong> 진행 상황 조회 시 필요합니다.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 mt-2 bg-yellow-500 rounded-full"></div>
                <span>
                  <strong>이메일과 SMS로 진행 상황을 안내합니다.</strong> 스팸함도 확인해주세요.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 mt-2 bg-yellow-500 rounded-full"></div>
                <span>
                  <strong>추가 서류 요청 시 즉시 제출해주세요.</strong> 지연 시 처리가 늦어질 수 있습니다.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 mt-2 bg-yellow-500 rounded-full"></div>
                <span>
                  <strong>비자 발급 후 여권과 함께 지참하세요.</strong> 베트남 입국 시 제시가 필요합니다.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 mt-2 bg-yellow-500 rounded-full"></div>
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
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="p-6 text-center bg-blue-50 rounded-xl">
              <Phone className="w-8 h-8 mx-auto mb-3 text-blue-600" />
              <h4 className="mb-2 font-bold text-gray-800">전화 문의</h4>
              <p className="text-lg font-bold text-blue-600">1588-1234</p>
              <p className="text-sm text-gray-600">평일 09:00-18:00</p>
            </div>
            <div className="p-6 text-center bg-green-50 rounded-xl">
              <MessageCircle className="w-8 h-8 mx-auto mb-3 text-green-600" />
              <h4 className="mb-2 font-bold text-gray-800">카카오톡</h4>
              <p className="text-lg font-bold text-green-600">@vietnamvisa24</p>
              <p className="text-sm text-gray-600">24시간 상담</p>
            </div>
            <div className="p-6 text-center bg-purple-50 rounded-xl">
              <Mail className="w-8 h-8 mx-auto mb-3 text-purple-600" />
              <h4 className="mb-2 font-bold text-gray-800">이메일</h4>
              <p className="text-lg font-bold text-purple-600">support@vietnamvisa24.com</p>
              <p className="text-sm text-gray-600">24시간 접수</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

ConfirmationStep.propTypes = {
  formData: PropTypes.object.isRequired,
  applicationId: PropTypes.string.isRequired,
};

export default ConfirmationStep;