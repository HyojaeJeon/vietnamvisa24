"use client";

import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../src/components/ui/card";
import { Button } from "../../src/components/ui/button";
import {
  CheckCircle,
  Download,
  Mail,
  Phone,
  MessageCircle,
  FileText,
  Clock,
  Calendar,
  User,
  Globe,
  MapPin,
  CreditCard,
  Plane,
  Building,
  Share2,
  Copy,
} from "lucide-react";

import { formatCurrency } from "./utils";

const ConfirmationStep = ({ formData, applicationId }) => {
  const currentPrice = calculateTotalPrice(formData);
  const receiptRef = useRef(null);

  const getEntryPortLabel = (portCode) => {
    const portMap = {
      DAD: "다낭",
      HAN: "하노이",
      SGN: "호치민",
      CXR: "나트랑",
      PQC: "푸꿕",
    };
    return portMap[portCode] || "미정";
  };

  const getVisaTypeInfo = () => {
    return {
      code: "E-VISA",
      name: "E-VISA",
    };
  };

  const calculateTotalPrice = (formData) => {
    let price = 25000;
    if (formData.processingType === "fast") {
      price += 10000;
    }
    return price;
  };

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
      element.style.fontFamily =
        "'Noto Sans KR', 'Malgun Gothic', '맑은 고딕', 'Apple SD Gothic Neo', sans-serif";
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

      // 파일명 생성
      const safeDate = new Date()
        .toLocaleDateString("ko-KR")
        .replace(/[.\s]/g, "");
      const fileName = `베트남비자_접수증_${applicationId}_${safeDate}.pdf`;

      // PDF 저장
      pdf.save(fileName);

      console.log("PDF 다운로드 완료:", fileName);
    } catch (error) {
      console.error("PDF 생성 오류:", error);
      alert(
        `PDF 생성 중 오류가 발생했습니다: ${error.message || "알 수 없는 오류"}`,
      );
    }
  };

  // PDF 다운로드 핸들러
  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      // 필수 데이터 검증
      if (!applicationId) {
        throw new Error("신청번호가 없습니다.");
      }

      if (!formData || !formData.personalInfo) {
        throw new Error("신청자 정보가 없습니다.");
      }

      await downloadReceipt();
    } catch (error) {
      console.error("PDF 생성 오류:", error);
      alert(
        `PDF 생성 중 오류가 발생했습니다: ${error.message || "알 수 없는 오류"}`,
      );
    } finally {
      setIsDownloading(false);
    }
  };

  // 이메일 발송 핸들러
  const handleSendEmail = async () => {
    if (!formData.personalInfo?.email) {
      alert("이메일 주소가 없습니다.");
      return;
    }

    setIsSendingEmail(true);
    try {
      // 임시 PDF 생성을 위해 html2canvas 사용
      const html2canvas = (await import("html2canvas")).default;
      const jsPDF = (await import("jspdf")).default;

      const element = receiptRef.current;
      if (!element) {
        throw new Error("영수증 요소를 찾을 수 없습니다.");
      }

      const originalDisplay = element.style.display;
      element.style.display = "block";

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      element.style.display = originalDisplay;

      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const imgData = canvas.toDataURL("image/jpeg", 0.95);

      pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight);
      const pdfBlob = pdf.output("blob");

      // Blob을 Base64로 변환
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = reader.result.split(",")[1];
        const fileName = `베트남비자_접수증_${applicationId}_${new Date().toLocaleDateString("ko-KR").replace(/\./g, "")}.pdf`;

        try {
          const response = await fetch("/api/send-receipt", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: formData.personalInfo.email,
              applicationId: applicationId,
              applicantName:
                `${formData.personalInfo?.firstName || ""} ${formData.personalInfo?.lastName || ""}`.trim(),
              pdfData: base64Data,
              fileName: fileName,
            }),
          });

          const result = await response.json();

          if (response.ok) {
            alert("접수증이 이메일로 성공적으로 발송되었습니다!");
          } else {
            throw new Error(result.message || "이메일 발송에 실패했습니다.");
          }
        } catch (error) {
          console.error("이메일 발송 오류:", error);
          alert(`이메일 발송 중 오류가 발생했습니다: ${error.message}`);
        }
      };

      reader.readAsDataURL(pdfBlob);
    } catch (error) {
      console.error("PDF 생성 오류:", error);
      alert("PDF 생성 중 오류가 발생했습니다.");
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-4 md:py-8">
      {/* 성공 애니메이션 */}
      <div className="text-center mb-4 md:mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 md:w-32 md:h-32 bg-green-100 rounded-full mb-3 md:mb-6 animate-pulse">
          <CheckCircle className="w-12 h-12 md:w-20 md:h-20 text-green-600" />
        </div>
        <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-2 md:mb-4 px-4">
          신청이 완료되었습니다!
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-1 md:mb-2 px-4">
          신청번호: <span className="font-bold text-blue-600">{applicationId}</span>
        </p>
        <p className="text-base md:text-lg text-gray-500 px-4">
          확인 이메일이 발송되었습니다.
        </p>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
          {/* 신청 정보 카드 */}
          <div className="lg:col-span-2">
            <Card className="mb-4 md:mb-6 shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg p-4 md:p-6">
                <CardTitle className="flex items-center gap-2 md:gap-3 text-lg md:text-2xl">
                  <FileText className="w-5 h-5 md:w-8 md:h-8" />
                  신청 정보
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6">
                <div className="grid grid-cols-1 gap-4 md:gap-6">
                  <div className="space-y-3 md:space-y-4">
                    <div className="flex items-center gap-2 md:gap-3 p-2 md:p-3 bg-gray-50 rounded-lg">
                      <User className="w-4 h-4 md:w-5 md:h-5 text-blue-500 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs md:text-sm text-gray-500">신청자명</p>
                        <p className="font-semibold text-sm md:text-base truncate">
                          {formData.personalInfo?.firstName} {formData.personalInfo?.lastName}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 md:gap-3 p-2 md:p-3 bg-gray-50 rounded-lg">
                      <Mail className="w-4 h-4 md:w-5 md:h-5 text-green-500 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs md:text-sm text-gray-500">이메일</p>
                        <p className="font-semibold text-sm md:text-base truncate">{formData.personalInfo?.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 md:gap-3 p-2 md:p-3 bg-gray-50 rounded-lg">
                      <Phone className="w-4 h-4 md:w-5 md:h-5 text-orange-500 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs md:text-sm text-gray-500">연락처</p>
                        <p className="font-semibold text-sm md:text-base">{formData.personalInfo?.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 md:gap-3 p-2 md:p-3 bg-gray-50 rounded-lg">
                      <Calendar className="w-4 h-4 md:w-5 md:h-5 text-purple-500 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs md:text-sm text-gray-500">입국 예정일</p>
                        <p className="font-semibold text-sm md:text-base">{formData.travelInfo?.entryDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 md:gap-3 p-2 md:p-3 bg-gray-50 rounded-lg">
                      <MapPin className="w-4 h-4 md:w-5 md:h-5 text-red-500 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs md:text-sm text-gray-500">입국 공항</p>
                        <p className="font-semibold text-sm md:text-base">{getEntryPortLabel(formData.travelInfo?.entryPort)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 md:gap-3 p-2 md:p-3 bg-gray-50 rounded-lg">
                      <Globe className="w-4 h-4 md:w-5 md:h-5 text-indigo-500 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs md:text-sm text-gray-500">비자 유형</p>
                        <p className="font-semibold text-sm md:text-base">{getVisaTypeInfo().name}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 사이드바 - 결제 정보 및 다운로드 */}
          <div className="space-y-4 md:space-y-6">
            {/* 결제 정보 카드 */}
            <Card className="shadow-lg border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
              <CardHeader className="pb-3 md:pb-4 p-4 md:p-6">
                <CardTitle className="flex items-center gap-2 md:gap-3 text-lg md:text-xl text-green-700">
                  <CreditCard className="w-5 h-5 md:w-6 md:h-6" />
                  결제 정보
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 md:space-y-4 p-4 md:p-6 pt-0">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm md:text-base">
                    <span className="text-gray-600">기본 서비스</span>
                    <span className="font-semibold">{formatCurrency(25000)}</span>
                  </div>
                  {formData.processingType === "fast" && (
                    <div className="flex justify-between items-center text-sm md:text-base">
                      <span className="text-gray-600">긴급 처리</span>
                      <span className="font-semibold text-orange-600">
                        +{formatCurrency(10000)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="border-t pt-2 md:pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-base md:text-lg font-bold text-gray-900">총 결제금액</span>
                    <span className="text-lg md:text-2xl font-bold text-green-600">
                      {formatCurrency(currentPrice)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 접수증 다운로드 카드 */}
            <Card className="shadow-lg border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardHeader className="pb-3 md:pb-4 p-4 md:p-6">
                <CardTitle className="flex items-center gap-2 md:gap-3 text-lg md:text-xl text-blue-700">
                  <Download className="w-5 h-5 md:w-6 md:h-6" />
                  접수증 다운로드
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 md:space-y-4 p-4 md:p-6 pt-0">
                <p className="text-gray-600 text-xs md:text-sm">
                  신청 접수증을 PDF로 다운로드하여 보관하세요.
                </p>
                <Button
                  onClick={handleDownloadPDF}
                  className="w-full py-2 md:py-3 text-sm md:text-lg font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Download className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                  접수증 다운로드
                </Button>
              </CardContent>
            </Card>

            {/* 공유 및 추가 액션 */}
            <Card className="shadow-lg border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
              <CardHeader className="pb-3 md:pb-4 p-4 md:p-6">
                <CardTitle className="flex items-center gap-2 md:gap-3 text-lg md:text-xl text-purple-700">
                  <Share2 className="w-5 h-5 md:w-6 md:h-6" />
                  공유 및 지원
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 p-4 md:p-6 pt-0">
                <Button
                  variant="outline"
                  className="w-full justify-start text-gray-700 border-gray-300 hover:bg-gray-50 py-2 text-sm md:text-base"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  신청번호 복사
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-gray-700 border-gray-300 hover:bg-gray-50 py-2 text-sm md:text-base"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  고객지원 문의
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 다음 단계 안내 */}
        <Card className="mt-4 md:mt-8 shadow-lg border-2 border-gray-200 bg-white/90 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-t-lg p-4 md:p-6">
            <CardTitle className="flex items-center gap-2 md:gap-3 text-lg md:text-2xl text-gray-700">
              <Clock className="w-6 h-6 md:w-8 md:h-8" />
              다음 단계
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <div className="text-center">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <FileText className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
                </div>
                <h3 className="font-bold text-base md:text-lg mb-2">1. 서류 검토</h3>
                <p className="text-gray-600 text-xs md:text-sm">
                  담당자가 제출된 서류를 검토합니다 (1-2시간 소요)
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <Globe className="w-6 h-6 md:w-8 md:h-8 text-green-600" />
                </div>
                <h3 className="font-bold text-base md:text-lg mb-2">2. 공식 신청</h3>
                <p className="text-gray-600 text-xs md:text-sm">
                  베트남 출입국관리소에 공식 신청합니다
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <Mail className="w-6 h-6 md:w-8 md:h-8 text-purple-600" />
                </div>
                <h3 className="font-bold text-base md:text-lg mb-2">3. 비자 발급</h3>
                <p className="text-gray-600 text-xs md:text-sm">
                  승인된 e-Visa를 이메일로 발송합니다
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 숨겨진 접수증 컴포넌트 */}
      <div
        ref={receiptRef}
        style={{
          display: "none",
          width: "210mm",
          minHeight: "297mm",
          backgroundColor: "#ffffff",
          fontFamily:
            "'Noto Sans KR', 'Malgun Gothic', '맑은 고딕', 'Apple SD Gothic Neo', sans-serif",
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
          {/* 장식 요소 */}
          <div
            style={{
              position: "absolute",
              top: "-15px",
              right: "-15px",
              width: "50px",
              height: "50px",
              backgroundColor: "rgba(255,255,255,0.1)",
              borderRadius: "50%",
            }}
          ></div>
          <div
            style={{
              position: "absolute",
              bottom: "-20px",
              left: "-20px",
              width: "60px",
              height: "60px",
              backgroundColor: "rgba(255,255,255,0.05)",
              borderRadius: "50%",
            }}
          ></div>

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
              fontSize: "12px",
              color: "#6B7280",
              margin: "0 0 3px 0",
            }}
          >
            VISA APPLICATION RECEIPT
          </p>
          <p
            style={{
              fontSize: "10px",
              color: "#9CA3AF",
              margin: "0",
            }}
          >
            비자 신청이 정상 접수되었습니다
          </p>
        </div>

        {/* 접수 정보 박스 */}
        <div
          style={{
            backgroundColor: "#F8FAFC",
            border: "1px solid #E2E8F0",
            borderRadius: "6px",
            padding: "15px",
            marginBottom: "18px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "8px",
            }}
          >
            <div>
              <p
                style={{
                  fontSize: "10px",
                  color: "#4B5563",
                  margin: "0 0 3px 0",
                  fontWeight: "600",
                }}
              >
                접수일시
              </p>
              <p
                style={{
                  fontSize: "12px",
                  color: "#1F2937",
                  margin: "0",
                  fontWeight: "bold",
                }}
              >
                {new Date().toLocaleDateString("ko-KR")}{" "}
                {new Date().toLocaleTimeString("ko-KR")}
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p
                style={{
                  fontSize: "10px",
                  color: "#4B5563",
                  margin: "0 0 3px 0",
                  fontWeight: "600",
                }}
              >
                신청번호
              </p>
              <p
                style={{
                  fontSize: "14px",
                  color: "#2563EB",
                  margin: "0",
                  fontWeight: "bold",
                  letterSpacing: "0.5px",
                }}
              >
                {applicationId}
              </p>
            </div>
          </div>
          <div
            style={{
              height: "1px",
              backgroundColor: "#E5E7EB",
              margin: "8px 0",
            }}
          ></div>
          <p
            style={{
              fontSize: "9px",
              color: "#6B7280",
              margin: "0",
              textAlign: "center",
            }}
          >
            Receipt Date & Time | Application Number
          </p>
        </div>

        {/* 신청자 정보 섹션 */}
        <div style={{ marginBottom: "16px" }}>
          <div
            style={{
              backgroundColor: "#2563EB",
              color: "white",
              padding: "8px 12px",
              borderRadius: "4px 4px 0 0",
              fontSize: "12px",
              fontWeight: "bold",
            }}
          >
            <span>신청자 정보</span>
            <span
              style={{
                fontSize: "9px",
                fontWeight: "normal",
                marginLeft: "8px",
              }}
            >
              APPLICANT INFORMATION
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
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "8px 20px",
                fontSize: "10px",
              }}
            >
              <div>
                <span style={{ color: "#6B7280", fontWeight: "600" }}>
                  신청자명:
                </span>
                <span
                  style={{
                    marginLeft: "6px",
                    color: "#1F2937",
                    fontWeight: "bold",
                  }}
                >
                  {formData.personalInfo?.firstName}{" "}
                  {formData.personalInfo?.lastName}
                </span>
              </div>
              <div>
                <span style={{ color: "#6B7280", fontWeight: "600" }}>
                  여권번호:
                </span>
                <span
                  style={{
                    marginLeft: "6px",
                    color: "#1F2937",
                    fontWeight: "bold",
                  }}
                >
                  {formData.personalInfo?.passportNo || "정보 없음"}
                </span>
              </div>
              <div>
                <span style={{ color: "#6B7280", fontWeight: "600" }}>
                  국적:
                </span>
                <span
                  style={{
                    marginLeft: "6px",
                    color: "#1F2937",
                    fontWeight: "bold",
                  }}
                >
                  대한민국
                </span>
              </div>
              <div>
                <span style={{ color: "#6B7280", fontWeight: "600" }}>
                  생년월일:
                </span>
                <span
                  style={{
                    marginLeft: "6px",
                    color: "#1F2937",
                    fontWeight: "bold",
                  }}
                >
                  {formData.personalInfo?.birthDate || "정보 없음"}
                </span>
              </div>
              <div>
                <span style={{ color: "#6B7280", fontWeight: "600" }}>
                  이메일:
                </span>
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
                <span style={{ color: "#6B7280", fontWeight: "600" }}>
                  연락처:
                </span>
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
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "8px 20px",
                fontSize: "10px",
              }}
            >
              <div>
                <span style={{ color: "#6B7280", fontWeight: "600" }}>
                  비자유형:
                </span>
                <span
                  style={{
                    marginLeft: "6px",
                    color: "#1F2937",
                    fontWeight: "bold",
                  }}
                >
                  {formData.visaType || "E-VISA"}
                </span>
              </div>
              <div>
                <span style={{ color: "#6B7280", fontWeight: "600" }}>
                  처리유형:
                </span>
                <span
                  style={{
                    marginLeft: "6px",
                    color: "#1F2937",
                    fontWeight: "bold",
                  }}
                >
                  {formData.processingType === "fast"
                    ? "긴급 처리"
                    : "일반 처리"}
                </span>
              </div>
              <div>
                <span style={{ color: "#6B7280", fontWeight: "600" }}>
                  입국예정일:
                </span>
                <span
                  style={{
                    marginLeft: "6px",
                    color: "#1F2937",
                    fontWeight: "bold",
                  }}
                >
                  {formData.travelInfo?.entryDate || "미정"}
                </span>
              </div>
              <div>
                <span style={{ color: "#6B7280", fontWeight: "600" }}>
                  완료예정:
                </span>
                <span
                  style={{
                    marginLeft: "6px",
                    color: "#1F2937",
                    fontWeight: "bold",
                  }}
                >
                  {formData.processingType === "fast"
                    ? "24시간 이내"
                    : "2-3 영업일"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 결제 정보 */}
        <div
          style={{
            backgroundColor: "#F0FDF4",
            border: "1px solid #10B981",
            borderRadius: "6px",
            padding: "12px",
            textAlign: "center",
            marginBottom: "16px",
          }}
        >
          <h3
            style={{
              fontSize: "12px",
              color: "#059669",
              margin: "0 0 4px 0",
              fontWeight: "bold",
            }}
          >
            결제 정보 | PAYMENT INFORMATION
          </h3>
          <p
            style={{
              fontSize: "16px",
              color: "#059669",
              margin: "0",
              fontWeight: "bold",
            }}
          >
            총 결제금액: ₩25,000
          </p>
        </div>

        {/* 고객지원 정보 */}
        <div style={{ marginBottom: "16px" }}>
          <h3
            style={{
              fontSize: "12px",
              color: "#1F2937",
              margin: "0 0 10px 0",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            고객 지원 | CUSTOMER SUPPORT
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "8px",
            }}
          >
            <div
              style={{
                backgroundColor: "#FEF2F2",
                border: "1px solid #F87171",
                borderRadius: "4px",
                padding: "8px",
                textAlign: "center",
              }}
            >
              <h4
                style={{
                  fontSize: "9px",
                  color: "#DC2626",
                  margin: "0 0 3px 0",
                  fontWeight: "bold",
                }}
              >
                전화 문의
              </h4>
              <p
                style={{
                  fontSize: "10px",
                  color: "#DC2626",
                  margin: "0 0 2px 0",
                  fontWeight: "bold",
                }}
              >
                1588-1234
              </p>
              <p
                style={{
                  fontSize: "8px",
                  color: "#6B7280",
                  margin: "0",
                }}
              >
                평일 09:00-18:00
              </p>
            </div>
            <div
              style={{
                backgroundColor: "#F0FDF4",
                border: "1px solid #10B981",
                borderRadius: "4px",
                padding: "8px",
                textAlign: "center",
              }}
            >
              <h4
                style={{
                  fontSize: "9px",
                  color: "#059669",
                  margin: "0 0 3px 0",
                  fontWeight: "bold",
                }}
              >
                카카오톡
              </h4>
              <p
                style={{
                  fontSize: "10px",
                  color: "#059669",
                  margin: "0 0 2px 0",
                  fontWeight: "bold",
                }}
              >
                @vietnamvisa24
              </p>
              <p
                style={{
                  fontSize: "8px",
                  color: "#6B7280",
                  margin: "0",
                }}
              >
                24시간 상담
              </p>
            </div>
            <div
              style={{
                backgroundColor: "#FDF4FF",
                border: "1px solid #A855F7",
                borderRadius: "4px",
                padding: "8px",
                textAlign: "center",
              }}
            >
              <h4
                style={{
                  fontSize: "9px",
                  color: "#7C3AED",
                  margin: "0 0 3px 0",
                  fontWeight: "bold",
                }}
              >
                이메일
              </h4>
              <p
                style={{
                  fontSize: "9px",
                  color: "#7C3AED",
                  margin: "0 0 2px 0",
                  fontWeight: "bold",
                }}
              >
                support@vietnamvisa24.com
              </p>
              <p
                style={{
                  fontSize: "8px",
                  color: "#6B7280",
                  margin: "0",
                }}
              >
                24시간 접수
              </p>
            </div>
          </div>
        </div>

        {/* 중요 안내사항 */}
        <div
          style={{
            backgroundColor: "#FEF2F2",
            border: "1px solid #F87171",
            borderRadius: "4px",
            padding: "10px",
            marginBottom: "16px",
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
            <li style={{ marginBottom: "3px" }}>
              본 접수증은 공식 비자 승인서가 아닙니다.
            </li>
            <li style={{ marginBottom: "3px" }}>
              처리 상황은 실시간으로 이메일과 SMS로 안내됩니다.
            </li>
            <li style={{ marginBottom: "3px" }}>
              추가 서류 요청 시 즉시 제출해주세요.
            </li>
            <li>문의사항이 있으시면 언제든지 고객지원팀에 연락주세요.</li>
          </ul>
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
            이 문서는 자동으로 생성되었습니다. 향후 참조를 위해 안전하게
            보관하세요.
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