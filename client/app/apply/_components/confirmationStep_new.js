"use client";

import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import { Card, CardContent, CardHeader, CardTitle } from "../../src/components/ui/card";
import { Button } from "../../src/components/ui/button";
import { CheckCircle, Download, Mail, Phone, MessageCircle, FileText, Clock, Calendar, User, Globe, MapPin, CreditCard, Plane, Building, Share2, Copy } from "lucide-react";

import { formatCurrency, calculateTotalPrice } from "./utils";

// 추가 서비스 한글 매핑 함수
const getServiceNameInKorean = (serviceName) => {
  const serviceMapping = {
    FAST_TRACK_ARRIVAL_PREMIUM: "패스트트랙 입국 프리미엄",
    FAST_TRACK_ARRIVAL_STANDARD: "패스트트랙 입국 스탠다드",
    FAST_TRACK_DEPARTURE_PREMIUM: "패스트트랙 출국 프리미엄",
    FAST_TRACK_DEPARTURE_STANDARD: "패스트트랙 출국 스탠다드",
    AIRPORT_PICKUP_SEDAN_DISTRICT1: "공항 픽업 세단 (1,3,푸년군)",
    AIRPORT_PICKUP_SUV_DISTRICT1: "공항 픽업 SUV (1,3,푸년군)",
    AIRPORT_PICKUP_SEDAN_DISTRICT2: "공항 픽업 세단 (2,4,7,빈탄군)",
    AIRPORT_PICKUP_SUV_DISTRICT2: "공항 픽업 SUV (2,4,7,빈탄군)",
    AIRPORT_PICKUP_SEDAN_DISTRICT3: "공항 픽업 세단 (5,6,8,투득군)",
    AIRPORT_PICKUP_SUV_DISTRICT3: "공항 픽업 SUV (5,6,8,투득군)",
    AIRPORT_PICKUP_SEDAN_DISTRICT4: "공항 픽업 세단 (9,10,11,12군)",
    AIRPORT_PICKUP_SUV_DISTRICT4: "공항 픽업 SUV (9,10,11,12군)",
    CITY_TOUR_HALF_DAY: "반일 시내 투어",
    CITY_TOUR_FULL_DAY: "하루 시내 투어",
    MEKONG_DELTA_TOUR: "메콩델타 투어",
    CU_CHI_TUNNEL_TOUR: "구찌터널 투어",
  };

  return serviceMapping[serviceName] || serviceName;
};

const ConfirmationStep = ({ formData, applicationId }) => {
  const currentPrice = calculateTotalPrice(formData);
  const receiptRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const getEntryPortLabel = (portCode) => {
    const portMap = {
      SGN: "호치민",
      HAN: "하노이",
      DAD: "다낭",
      CXR: "나트랑",
      PQC: "푸꾸옥",
      VDO: "반돈",
      HPH: "하이퐁",
      UIH: "부온마투옷",
      LAND_BORDER: "육로 국경",
      OTHER: "기타",
    };
    return portMap[portCode] || "미정";
  };

  const getVisaTypeInfo = () => {
    return {
      code: "E-VISA",
      name: "E-VISA",
    };
  };

  // PDF 다운로드 함수
  const downloadReceipt = async () => {
    try {
      setIsDownloading(true);
      const jsPDF = (await import("jspdf")).default;
      const html2canvas = (await import("html2canvas")).default;

      const element = receiptRef.current;
      if (!element) {
        alert("영수증 요소를 찾을 수 없습니다.");
        return;
      }

      element.style.display = "block";
      element.style.fontFamily = "'Noto Sans KR', 'Malgun Gothic', '맑은 고딕', 'Apple SD Gothic Neo', sans-serif";
      element.style.backgroundColor = "#ffffff";

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
      });

      element.style.display = "none";

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`베트남비자_접수증_${applicationId}.pdf`);
    } catch (error) {
      console.error("PDF 생성 오류:", error);
      alert("PDF 생성 중 오류가 발생했습니다.");
    } finally {
      setIsDownloading(false);
    }
  };

  // 이메일 발송 함수
  const sendEmailReceipt = async () => {
    try {
      setIsSendingEmail(true);
      alert("이메일이 발송되었습니다!");
    } catch (error) {
      console.error("이메일 발송 오류:", error);
      alert("이메일 발송 중 오류가 발생했습니다.");
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <div className="min-h-screen py-4 bg-gradient-to-br from-blue-50 via-white to-purple-50 md:py-8">
      {/* 성공 애니메이션 */}
      <div className="mb-4 text-center md:mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 mb-3 bg-green-100 rounded-full md:w-32 md:h-32 md:mb-6 animate-pulse">
          <CheckCircle className="w-12 h-12 text-green-600 md:w-20 md:h-20" />
        </div>
        <h1 className="px-4 mb-2 text-2xl font-bold text-gray-800 md:text-4xl md:mb-4">신청이 완료되었습니다!</h1>
        <p className="px-4 mb-1 text-lg text-gray-600 md:text-xl md:mb-2">
          신청번호:
          <span className="font-bold text-blue-600">{applicationId}</span>
        </p>
        <p className="px-4 text-base text-gray-500 md:text-lg">확인 이메일이 발송되었습니다.</p>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="max-w-4xl px-4 mx-auto">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 md:gap-8">
          {/* 신청 정보 카드 */}
          <div className="lg:col-span-2">
            <Card className="mb-4 border-0 shadow-lg md:mb-6 bg-white/90 backdrop-blur-sm">
              <CardHeader className="p-4 text-white rounded-t-lg bg-gradient-to-r from-blue-600 to-purple-600 md:p-6">
                <CardTitle className="flex items-center gap-2 text-lg md:gap-3 md:text-2xl">
                  <FileText className="w-5 h-5 md:w-8 md:h-8" />
                  신청 정보
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6">
                <div className="grid grid-cols-1 gap-4 md:gap-6">
                  <div className="space-y-3 md:space-y-4">
                    <div className="flex items-center gap-2 p-2 rounded-lg md:gap-3 md:p-3 bg-gray-50">
                      <User className="flex-shrink-0 w-4 h-4 text-blue-500 md:w-5 md:h-5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 md:text-sm">신청자명</p>
                        <p className="text-sm font-semibold truncate md:text-base">{formData.personalInfo?.fullName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-lg md:gap-3 md:p-3 bg-gray-50">
                      <Mail className="flex-shrink-0 w-4 h-4 text-green-500 md:w-5 md:h-5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 md:text-sm">이메일</p>
                        <p className="text-sm font-semibold truncate md:text-base">{formData.personalInfo?.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-lg md:gap-3 md:p-3 bg-gray-50">
                      <Phone className="flex-shrink-0 w-4 h-4 text-orange-500 md:w-5 md:h-5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 md:text-sm">연락처</p>
                        <p className="text-sm font-semibold truncate md:text-base">{formData.personalInfo?.phone}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t md:pt-4">
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
                      <div className="flex items-center gap-2 p-2 rounded-lg md:gap-3 md:p-3 bg-blue-50">
                        <Globe className="flex-shrink-0 w-4 h-4 text-blue-500 md:w-5 md:h-5" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-500 md:text-sm">비자 종류</p>
                          <p className="text-sm font-semibold md:text-base">{getVisaTypeInfo().name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-2 rounded-lg md:gap-3 md:p-3 bg-green-50">
                        <MapPin className="flex-shrink-0 w-4 h-4 text-green-500 md:w-5 md:h-5" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-500 md:text-sm">입국 공항</p>
                          <p className="text-sm font-semibold md:text-base">{getEntryPortLabel(formData.visaInfo?.entryPort)}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t md:pt-4">
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
                      <div className="flex items-center gap-2 p-2 rounded-lg md:gap-3 md:p-3 bg-purple-50">
                        <Calendar className="flex-shrink-0 w-4 h-4 text-purple-500 md:w-5 md:h-5" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-500 md:text-sm">입국 예정일</p>
                          <p className="text-sm font-semibold md:text-base">{formData.visaInfo?.entryDate ? new Date(formData.visaInfo.entryDate).toLocaleDateString("ko-KR") : "미정"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-2 rounded-lg md:gap-3 md:p-3 bg-orange-50">
                        <Clock className="flex-shrink-0 w-4 h-4 text-orange-500 md:w-5 md:h-5" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-500 md:text-sm">처리 옵션</p>
                          <p className="text-sm font-semibold md:text-base">{formData.processingType === "fast" ? "긴급 처리" : "일반 처리"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 추가 서비스 카드 */}
            <Card className="mb-4 border-0 shadow-lg md:mb-6 bg-white/90 backdrop-blur-sm">
              <CardHeader className="p-4 pb-3 md:pb-4 md:p-6">
                <CardTitle className="flex items-center gap-2 text-lg md:gap-3 md:text-xl">
                  <Building className="w-5 h-5 md:w-6 md:h-6" />
                  추가 서비스
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 md:p-6">
                {formData.additionalServices && Object.keys(formData.additionalServices).length > 0 ? (
                  Object.keys(formData.additionalServices).map((serviceId) => (
                    <div key={serviceId} className="flex items-center gap-3 p-2 mb-2 rounded-lg bg-gray-50 last:mb-0">
                      <div className="flex-1">
                        <span className="text-sm font-medium text-gray-700">{getServiceNameInKorean(serviceId)}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-3 text-center">
                    <p className="text-sm text-gray-500">선택 안함</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* 우측 사이드바 */}
          <div className="space-y-4 md:space-y-6">
            {/* 결제 정보 카드 */}
            <Card className="border-2 border-green-200 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
              <CardHeader className="p-4 pb-3 md:pb-4 md:p-6">
                <CardTitle className="flex items-center gap-2 text-lg text-green-700 md:gap-3 md:text-xl">
                  <CreditCard className="w-5 h-5 md:w-6 md:h-6" />
                  결제 정보
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-3 md:space-y-4 md:p-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm md:text-base">
                    <span className="text-gray-600">기본 서비스</span>
                    <span className="font-semibold">{formatCurrency(25000)}</span>
                  </div>
                  {formData.processingType === "fast" && (
                    <div className="flex items-center justify-between text-sm md:text-base">
                      <span className="text-gray-600">긴급 처리</span>
                      <span className="font-semibold text-orange-600">+{formatCurrency(10000)}</span>
                    </div>
                  )}
                </div>
                <div className="pt-2 border-t md:pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-gray-900 md:text-lg">총 결제금액</span>
                    <span className="text-lg font-bold text-green-600 md:text-2xl">{formatCurrency(currentPrice)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 접수증 다운로드 카드 */}
            <Card className="border-2 border-blue-200 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardHeader className="p-4 pb-3 md:pb-4 md:p-6">
                <CardTitle className="flex items-center gap-2 text-lg text-blue-700 md:gap-3 md:text-xl">
                  <Download className="w-5 h-5 md:w-6 md:h-6" />
                  접수증 다운로드
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-3 md:p-6">
                <Button onClick={downloadReceipt} disabled={isDownloading} className="w-full text-white bg-blue-600 hover:bg-blue-700">
                  {isDownloading ? (
                    <>
                      <div className="w-4 h-4 mr-2 border-2 border-white rounded-full animate-spin border-t-transparent"></div>
                      생성 중...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      PDF 다운로드
                    </>
                  )}
                </Button>
                <Button onClick={sendEmailReceipt} disabled={isSendingEmail} variant="outline" className="w-full text-blue-600 border-blue-600 hover:bg-blue-50">
                  {isSendingEmail ? (
                    <>
                      <div className="w-4 h-4 mr-2 border-2 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
                      발송 중...
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4 mr-2" />
                      이메일 발송
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* 고객지원 카드 */}
            <Card className="border-2 border-purple-200 shadow-lg bg-gradient-to-br from-purple-50 to-violet-50">
              <CardHeader className="p-4 pb-3 md:pb-4 md:p-6">
                <CardTitle className="flex items-center gap-2 text-lg text-purple-700 md:gap-3 md:text-xl">
                  <MessageCircle className="w-5 h-5 md:w-6 md:h-6" />
                  고객지원
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-3 md:p-6">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-purple-500" />
                    <span>전화: +82-2-1234-5678</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-purple-500" />
                    <span>이메일: support@vietnamvisa24.com</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-purple-500" />
                    <span>카카오톡: @vietnamvisa24</span>
                  </div>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-xs text-gray-600">평일 09:00-18:00, 토요일 09:00-15:00</p>
                </div>
              </CardContent>
            </Card>

            {/* 다음 단계 안내 */}
            <Card className="border-2 shadow-lg border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50">
              <CardHeader className="p-4 pb-3 md:pb-4 md:p-6">
                <CardTitle className="flex items-center gap-2 text-lg text-amber-700 md:gap-3 md:text-xl">
                  <Plane className="w-5 h-5 md:w-6 md:h-6" />
                  다음 단계
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 md:p-6">
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <div className="flex-shrink-0 w-5 h-5 mt-0.5 bg-amber-500 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-white">1</span>
                    </div>
                    <p>서류 검토 및 승인 대기 (1-2일)</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="flex-shrink-0 w-5 h-5 mt-0.5 bg-amber-500 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-white">2</span>
                    </div>
                    <p>비자 승인서 이메일 발송</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="flex-shrink-0 w-5 h-5 mt-0.5 bg-amber-500 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-white">3</span>
                    </div>
                    <p>승인서 출력 후 베트남 입국</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* 숨겨진 접수증 컴포넌트 */}
      <div
        ref={receiptRef}
        style={{
          display: "none",
          width: "210mm",
          minHeight: "297mm",
          backgroundColor: "#ffffff",
          fontFamily: "'Noto Sans KR', 'Malgun Gothic', '맑은 고딕', 'Apple SD Gothic Neo', sans-serif",
          padding: "15mm",
          boxSizing: "border-box",
        }}
      >
        {/* 헤더 섹션 */}
        <div
          style={{
            background: "linear-gradient(135deg, #4F8FFF 0%, #2563EB 100%)",
            padding: "18px",
            borderRadius: "8px",
            color: "white",
            textAlign: "center",
            marginBottom: "18px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <h1
            style={{
              fontSize: "22px",
              fontWeight: "bold",
              margin: "0 0 4px 0",
              letterSpacing: "0.5px",
            }}
          >
            VIETNAM VISA 24
          </h1>
          <p
            style={{
              fontSize: "11px",
              margin: "0 0 8px 0",
              opacity: "0.9",
            }}
          >
            Professional Visa Service
          </p>
          <div
            style={{
              width: "40px",
              height: "1px",
              backgroundColor: "rgba(255,255,255,0.6)",
              margin: "0 auto 8px auto",
            }}
          ></div>
          <p
            style={{
              fontSize: "9px",
              margin: "0",
              opacity: "0.8",
            }}
          >
            www.vietnamvisa24.com | 전문 베트남 비자 서비스
          </p>
        </div>

        {/* 메인 타이틀 */}
        <div style={{ textAlign: "center", marginBottom: "18px" }}>
          <h2
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              color: "#1F2937",
              margin: "0 0 4px 0",
            }}
          >
            비자 신청 접수증
          </h2>
          <p
            style={{
              fontSize: "10px",
              color: "#6B7280",
              margin: "0",
            }}
          >
            VISA APPLICATION RECEIPT
          </p>
        </div>

        {/* 신청번호 섹션 */}
        <div
          style={{
            border: "1px solid #E2E8F0",
            borderRadius: "6px",
            padding: "15px",
            marginBottom: "18px",
            backgroundColor: "#F8FAFC",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: "10px", color: "#6B7280", margin: "0 0 4px 0" }}>신청번호 / Application ID</p>
            <p
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                color: "#2563EB",
                margin: "0",
                letterSpacing: "1px",
              }}
            >
              {applicationId}
            </p>
          </div>
        </div>

        {/* 개인정보 섹션 */}
        <div style={{ marginBottom: "16px" }}>
          <div
            style={{
              backgroundColor: "#059669",
              color: "white",
              padding: "8px 12px",
              borderRadius: "4px 4px 0 0",
              fontSize: "12px",
              fontWeight: "bold",
            }}
          >
            <span>개인정보</span>
            <span
              style={{
                fontSize: "9px",
                fontWeight: "normal",
                marginLeft: "8px",
              }}
            >
              PERSONAL INFORMATION
            </span>
          </div>
          <div
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #E5E7EB",
              borderTop: "none",
              borderRadius: "0 0 4px 4px",
              padding: "12px",
            }}
          >
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "10px" }}>
              <div>
                <span style={{ color: "#6B7280", fontWeight: "600" }}>성명:</span>
                <span
                  style={{
                    marginLeft: "6px",
                    color: "#1F2937",
                    fontWeight: "bold",
                  }}
                >
                  {formData.personalInfo?.fullName || "정보 없음"}
                </span>
              </div>
              <div>
                <span style={{ color: "#6B7280", fontWeight: "600" }}>이메일:</span>
                <span
                  style={{
                    marginLeft: "6px",
                    color: "#1F2937",
                    fontWeight: "bold",
                  }}
                >
                  {formData.personalInfo?.email || "정보 없음"}
                </span>
              </div>
              <div>
                <span style={{ color: "#6B7280", fontWeight: "600" }}>연락처:</span>
                <span
                  style={{
                    marginLeft: "6px",
                    color: "#1F2937",
                    fontWeight: "bold",
                  }}
                >
                  {formData.personalInfo?.phone || "정보 없음"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 비자 정보 섹션 */}
        <div style={{ marginBottom: "16px" }}>
          <div
            style={{
              backgroundColor: "#059669",
              color: "white",
              padding: "8px 12px",
              borderRadius: "4px 4px 0 0",
              fontSize: "12px",
              fontWeight: "bold",
            }}
          >
            <span>비자 정보</span>
            <span
              style={{
                fontSize: "9px",
                fontWeight: "normal",
                marginLeft: "8px",
              }}
            >
              VISA INFORMATION
            </span>
          </div>
          <div
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #E5E7EB",
              borderTop: "none",
              borderRadius: "0 0 4px 4px",
              padding: "12px",
            }}
          >
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "10px" }}>
              <div>
                <span style={{ color: "#6B7280", fontWeight: "600" }}>비자 종류:</span>
                <span
                  style={{
                    marginLeft: "6px",
                    color: "#1F2937",
                    fontWeight: "bold",
                  }}
                >
                  {getVisaTypeInfo().name}
                </span>
              </div>
              <div>
                <span style={{ color: "#6B7280", fontWeight: "600" }}>입국 공항:</span>
                <span
                  style={{
                    marginLeft: "6px",
                    color: "#1F2937",
                    fontWeight: "bold",
                  }}
                >
                  {getEntryPortLabel(formData.visaInfo?.entryPort)}
                </span>
              </div>
              <div>
                <span style={{ color: "#6B7280", fontWeight: "600" }}>입국 예정일:</span>
                <span
                  style={{
                    marginLeft: "6px",
                    color: "#1F2937",
                    fontWeight: "bold",
                  }}
                >
                  {formData.visaInfo?.entryDate ? new Date(formData.visaInfo.entryDate).toLocaleDateString("ko-KR") : "미정"}
                </span>
              </div>
              <div>
                <span style={{ color: "#6B7280", fontWeight: "600" }}>처리 옵션:</span>
                <span
                  style={{
                    marginLeft: "6px",
                    color: "#1F2937",
                    fontWeight: "bold",
                  }}
                >
                  {formData.processingType === "fast" ? "긴급 처리" : "일반 처리"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 결제 정보 섹션 */}
        <div
          style={{
            border: "1px solid #10B981",
            borderRadius: "6px",
            padding: "12px",
            textAlign: "center",
            marginBottom: "16px",
            backgroundColor: "#ECFDF5",
          }}
        >
          <p
            style={{
              fontSize: "12px",
              fontWeight: "bold",
              color: "#059669",
              margin: "0 0 6px 0",
            }}
          >
            총 결제금액
          </p>
          <p
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              color: "#059669",
              margin: "0",
            }}
          >
            {formatCurrency(currentPrice)}
          </p>
        </div>

        {/* 중요 안내사항 */}
        <div style={{ marginBottom: "16px" }}>
          <div
            style={{
              border: "1px solid #F87171",
              borderRadius: "4px",
              padding: "10px",
              marginBottom: "16px",
              backgroundColor: "#FEF2F2",
            }}
          >
            <h4
              style={{
                fontSize: "11px",
                color: "#DC2626",
                margin: "0 0 8px 0",
                fontWeight: "bold",
              }}
            >
              중요 안내사항
            </h4>
            <ul
              style={{
                fontSize: "9px",
                color: "#6B7280",
                margin: "0",
                paddingLeft: "12px",
                lineHeight: "1.4",
              }}
            >
              <li style={{ marginBottom: "3px" }}>본 접수증은 공식 비자 승인서가 아닙니다.</li>
              <li style={{ marginBottom: "3px" }}>처리 상황은 실시간으로 이메일과 SMS로 안내됩니다.</li>
              <li>문의사항이 있으시면 언제든지 고객지원팀에 연락주세요.</li>
            </ul>
          </div>
        </div>

        {/* 푸터 */}
        <div
          style={{
            borderTop: "1px solid #E5E7EB",
            paddingTop: "10px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: "9px",
              color: "#9CA3AF",
              margin: "0 0 2px 0",
            }}
          >
            Vietnam Visa 24 - 전문 베트남 비자 서비스
          </p>
          <p
            style={{
              fontSize: "8px",
              color: "#9CA3AF",
              margin: "0 0 2px 0",
            }}
          >
            발급일시: {new Date().toLocaleString("ko-KR")}
          </p>
          <p
            style={{
              fontSize: "8px",
              color: "#9CA3AF",
              margin: "0",
            }}
          >
            이 문서는 자동으로 생성되었습니다. 향후 참조를 위해 안전하게 보관하세요.
          </p>
        </div>
      </div>
    </div>
  );
};

ConfirmationStep.propTypes = {
  formData: PropTypes.object.isRequired,
  applicationId: PropTypes.string.isRequired,
};

export default ConfirmationStep;
