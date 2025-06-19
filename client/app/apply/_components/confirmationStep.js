
"use client";

import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { 
  CheckCircle, 
  Download, 
  Mail, 
  Phone, 
  MessageCircle,
  Calendar,
  User,
  MapPin,
  FileText,
  Star,
  Globe,
  Clock,
  Shield,
  Award
} from "lucide-react";

// 가격 계산 함수
const calculateTotalPrice = (formData) => {
  let total = 0;
  
  // 기본 비자 가격
  if (formData.step1?.visaType === "tourist") {
    total += 89000;
  } else if (formData.step1?.visaType === "business") {
    total += 149000;
  }
  
  // 추가 서비스
  if (formData.step4?.fastTrack) {
    total += 50000;
  }
  if (formData.step4?.pickup) {
    total += 30000;
  }
  
  return total;
};

// 한글 폰트 지원 PDF 생성 함수
const downloadReceipt = async (applicationId, formData, currentPrice) => {
  try {
    const jsPDF = (await import("jspdf")).default;
    const html2canvas = (await import("html2canvas")).default;

    // 폰트 추가 (Noto Sans KR 웹폰트 사용)
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });

    // 한글 폰트 설정을 위한 CSS 추가
    const style = document.createElement("style");
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap');
      .pdf-content * {
        font-family: 'Noto Sans KR', -apple-system, BlinkMacSystemFont, sans-serif !important;
      }
    `;
    document.head.appendChild(style);

    const element = document.getElementById("receipt-content");
    if (!element) {
      alert("영수증 콘텐츠를 찾을 수 없습니다.");
      return;
    }

    // 높은 해상도로 캔버스 생성
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      width: element.scrollWidth,
      height: element.scrollHeight
    });

    const imgData = canvas.toDataURL("image/png");
    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    doc.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    doc.save(`베트남비자_접수증_${applicationId}.pdf`);

    // 스타일 요소 제거
    document.head.removeChild(style);
  } catch (error) {
    console.error("PDF 생성 오류:", error);
    alert("PDF 생성 중 오류가 발생했습니다. 다시 시도해주세요.");
  }
};

// 이메일 발송 함수
const sendReceiptEmail = async (applicationId, formData, currentPrice) => {
  try {
    const element = document.getElementById("receipt-content");
    if (!element) {
      alert("영수증 콘텐츠를 찾을 수 없습니다.");
      return;
    }

    // PDF 생성
    const jsPDF = (await import("jspdf")).default;
    const html2canvas = (await import("html2canvas")).default;

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff"
    });

    const imgData = canvas.toDataURL("image/png");
    const doc = new jsPDF();
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    doc.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    const pdfData = doc.output("datauristring").split(",")[1];

    // 이메일 발송 API 호출
    const response = await fetch("/api/send-receipt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: formData.step2?.email,
        applicationId: applicationId,
        applicantName: `${formData.step1?.firstName} ${formData.step1?.lastName}`,
        pdfData: pdfData,
        fileName: `베트남비자_접수증_${applicationId}.pdf`
      })
    });

    if (response.ok) {
      alert("접수증이 이메일로 발송되었습니다.");
    } else {
      throw new Error("이메일 발송 실패");
    }
  } catch (error) {
    console.error("이메일 발송 오류:", error);
    alert("이메일 발송 중 오류가 발생했습니다. 다시 시도해주세요.");
  }
};

export default function ConfirmationStep() {
  const formData = useSelector((state) => state.applyForm.form);
  const applicationId = useSelector((state) => state.applyForm.applicationId);
  const [isLoading, setIsLoading] = useState(false);
  
  const currentPrice = calculateTotalPrice(formData);
  const currentDate = new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long", 
    day: "numeric",
    weekday: "long"
  });

  const handleDownload = async () => {
    setIsLoading(true);
    await downloadReceipt(applicationId, formData, currentPrice);
    setIsLoading(false);
  };

  const handleEmailSend = async () => {
    setIsLoading(true);
    await sendReceiptEmail(applicationId, formData, currentPrice);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* 성공 헤더 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">신청 접수 완료!</h1>
          <p className="text-lg text-gray-600">베트남 비자 신청이 성공적으로 접수되었습니다.</p>
        </div>

        {/* 액션 버튼 */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <button
            onClick={handleDownload}
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Download className="w-5 h-5" />
            {isLoading ? "생성 중..." : "접수증 다운로드"}
          </button>
          <button
            onClick={handleEmailSend}
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            <Mail className="w-5 h-5" />
            {isLoading ? "발송 중..." : "이메일로 받기"}
          </button>
        </div>

        {/* 접수증 콘텐츠 */}
        <div id="receipt-content" className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* 헤더 */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -ml-12 -mb-12"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold">VIETNAM VISA 24</h2>
                  <p className="text-blue-100">Professional Visa Service</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-blue-100">Application Receipt</div>
                  <div className="text-lg font-semibold">비자 신청 접수증</div>
                </div>
              </div>
              
              <div className="bg-green-500 text-white px-4 py-2 rounded-full inline-block">
                <span className="text-sm font-semibold">✓ Your application has been successfully received</span>
              </div>
            </div>
          </div>

          {/* 신청자 정보 */}
          <div className="p-8">
            <div className="bg-blue-50 rounded-xl p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">APPLICANT INFORMATION</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Application No.</span>
                    <span className="font-bold text-blue-600">{applicationId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">성명 (Name)</span>
                    <span className="font-semibold">{formData.step1?.firstName} {formData.step1?.lastName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">국적 (Nationality)</span>
                    <span className="font-semibold">{formData.step1?.nationality || "대한민국"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">생년월일 (Date of Birth)</span>
                    <span className="font-semibold">{formData.step1?.dateOfBirth}</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Email Address</span>
                    <span className="font-semibold">{formData.step2?.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">전화번호 (Phone Number)</span>
                    <span className="font-semibold">{formData.step2?.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">여권번호 (Passport Number)</span>
                    <span className="font-semibold">{formData.step1?.passportNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">접수일 (Date Applied)</span>
                    <span className="font-semibold">{currentDate}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 여행 정보 */}
            <div className="bg-orange-50 rounded-xl p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">TRAVEL INFORMATION</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">입국일 (Entry Date)</span>
                    <span className="font-semibold">{formData.step3?.entryDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">출국일 (Exit Date)</span>
                    <span className="font-semibold">{formData.step3?.exitDate}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">목적 (Purpose)</span>
                    <span className="font-semibold">{formData.step1?.visaType === "tourist" ? "관광" : "상용"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">체류기간 (Duration)</span>
                    <span className="font-semibold">{formData.step3?.duration || "30일"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 처리 정보 */}
            <div className="bg-purple-50 rounded-xl p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">PROCESSING INFORMATION</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">처리 방식</span>
                    <span className="font-semibold">일반 처리</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">예상 완료일</span>
                    <span className="font-semibold">{new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString("ko-KR")}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">총 비용</span>
                    <span className="font-bold text-lg text-green-600">₩{currentPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">결제 상태</span>
                    <span className="font-semibold text-green-600">완료</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 추가 서비스 */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Award className="w-5 h-5" />
                ADDITIONAL VISA24ES
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white bg-opacity-20 rounded-lg p-4">
                  <div className="font-semibold text-green-300 mb-2">✓ Airport Pick-up Service</div>
                  <div className="text-sm">Safe and comfortable transportation service with experienced driver and professional guides.</div>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg p-4">
                  <div className="font-semibold text-green-300 mb-2">✓ Overstay Explanation</div>
                  <div className="text-sm">Expert assistance to clearly resolve overstay issues with immigration authorities.</div>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg p-4">
                  <div className="font-semibold text-green-300 mb-2">✓ Max Stay Service</div>
                  <div className="text-sm">Efficient and fast processing to maximize your stay duration in Vietnam.</div>
                </div>
              </div>
            </div>

            {/* 공항 패스트트랙 */}
            <div className="bg-blue-50 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4 text-blue-800 flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Airport Fast Track
              </h3>
              <div className="text-sm text-gray-600 leading-relaxed">
                • Priority immigration and customs clearance<br/>
                • Dedicated staff assistance throughout the process<br/>
                • Express lane access for faster processing<br/>
                • Available at major international airports
              </div>
            </div>

            {/* 고객 지원 */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                고객 지원 안내
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-blue-600 mb-2">전화 상담</h4>
                  <p className="text-2xl font-bold text-gray-800 mb-1">1588-1234</p>
                  <p className="text-sm text-gray-600">평일 09:00-18:00</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-green-600 mb-2">카카오톡 상담</h4>
                  <p className="text-lg font-bold text-gray-800 mb-1">@vietnamvisa24</p>
                  <p className="text-sm text-gray-600">24시간 상담 가능</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-purple-600 mb-2">VIP 서비스</h4>
                  <p className="text-lg font-bold text-gray-800 mb-1">프리미엄 지원</p>
                  <p className="text-sm text-gray-600">우선 처리 서비스</p>
                </div>
              </div>
            </div>
          </div>

          {/* 푸터 */}
          <div className="bg-gray-100 px-8 py-6 border-t">
            <div className="text-center text-sm text-gray-600">
              <p className="mb-2">
                <strong>중요:</strong> 본 접수증을 안전한 곳에 보관하시고, 문의 시 신청번호를 말씀해 주세요.
              </p>
              <p>
                처리 현황은 이메일과 SMS로 실시간 안내드리며, 추가 서류 요청 시 즉시 제출해 주시기 바랍니다.
              </p>
            </div>
          </div>
        </div>

        {/* 추가 안내 */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg text-sm">
            <Clock className="w-4 h-4" />
            처리 현황은 실시간으로 이메일과 SMS로 안내됩니다
          </div>
        </div>
      </div>
    </div>
  );
}
