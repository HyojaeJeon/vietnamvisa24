
"use client";

import React, { useState } from "react";
import PropTypes from "prop-types";
import { jsPDF } from "jspdf";
import { Card, CardContent, CardHeader, CardTitle } from "../../src/components/ui/card";
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
  Building
} from "lucide-react";

const ConfirmationStep = ({ formData, applicationId }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  // 접수증 PDF 생성 함수
  const generateReceiptPDF = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // 폰트 설정
    doc.setFont("helvetica");
    
    // 색상 정의
    const primaryColor = [37, 99, 235]; // blue-600
    const secondaryColor = [107, 114, 128]; // gray-500
    const accentColor = [34, 197, 94]; // green-500

    // 페이지 여백
    const margin = 20;
    const pageWidth = 210;
    const contentWidth = pageWidth - (margin * 2);

    let currentY = margin;

    // 회사 로고 영역 (텍스트로 대체)
    doc.setFillColor(...primaryColor);
    doc.rect(margin, currentY, contentWidth, 25, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("베트남 비자 24", pageWidth / 2, currentY + 10, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Vietnam Visa 24 - Professional Visa Service", pageWidth / 2, currentY + 18, { align: 'center' });
    
    currentY += 35;

    // 제목
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("비자 신청 접수증", pageWidth / 2, currentY, { align: 'center' });
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text("Vietnam Visa Application Receipt", pageWidth / 2, currentY + 8, { align: 'center' });
    
    currentY += 20;

    // 접수일시와 신청번호
    doc.setFontSize(10);
    doc.setTextColor(...secondaryColor);
    doc.text(`접수일: ${new Date().toLocaleDateString('ko-KR')}`, margin, currentY);
    doc.text(`신청번호: ${applicationId}`, pageWidth - margin, currentY, { align: 'right' });
    
    currentY += 15;

    // 섹션을 그리는 헬퍼 함수
    const drawSection = (title, titleBg, data, startY) => {
      let y = startY;
      
      // 섹션 헤더
      doc.setFillColor(...titleBg);
      doc.rect(margin, y, contentWidth, 8, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(title, margin + 3, y + 5.5);
      
      y += 12;
      
      // 데이터 테이블
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      
      const colWidth = contentWidth / 2;
      let rowHeight = 6;
      let col = 0;
      
      data.forEach((item, index) => {
        if (col >= 2) {
          col = 0;
          y += rowHeight;
        }
        
        const x = margin + (col * colWidth);
        
        // 배경색 (짝수 행)
        if (Math.floor(index / 2) % 2 === 0) {
          doc.setFillColor(249, 250, 251);
          doc.rect(x, y - 1, colWidth, rowHeight, 'F');
        }
        
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...secondaryColor);
        doc.text(item.label + ":", x + 2, y + 3);
        
        doc.setFont("helvetica", "normal");
        doc.setTextColor(0, 0, 0);
        doc.text(item.value, x + 2, y + 3 + 3);
        
        col++;
      });
      
      return y + rowHeight + 8;
    };

    // 신청 정보 섹션
    const personalData = [
      { label: "신청번호", value: applicationId },
      { label: "비자 유형", value: formData.visaType || "E-VISA" },
      { label: "처리 속도", value: formData.processingType === "fast" ? "긴급 처리 (24시간)" : "일반 처리 (2-3일)" },
      { label: "신청자", value: `${formData.personalInfo?.firstName || ""} ${formData.personalInfo?.lastName || ""}`.trim() },
      { label: "국적", value: "REPUBLIC OF KOREA" },
      { label: "이메일", value: formData.personalInfo?.email || "" },
      { label: "연락처", value: formData.personalInfo?.phone || "" },
      { label: "친구 연락처", value: formData.personalInfo?.phoneOfFriend || "N/A" }
    ];

    currentY = drawSection("신청 정보", [37, 99, 235], personalData, currentY);

    // 여행 정보 섹션
    const travelData = [
      { label: "입국예정일", value: formData.travelInfo?.entryDate || "N/A" },
      { label: "입국 항구", value: formData.travelInfo?.entryPort || "다낭공항" },
      { label: "여행목적", value: "2020-01-23" },
      { label: "출국기한", value: "다낭공항" }
    ];

    currentY = drawSection("여행 정보", [239, 68, 68], travelData, currentY);

    // 여행 정보 섹션
    const tripData = [
      { label: "입국예정일", value: "2025-06-19" },
      { label: "출국예정일", value: "N/A" },
      { label: "항공편명", value: "초청인 연락처 확인 (5GN)" },
      { label: "일정조각", value: "공항" }
    ];

    currentY = drawSection("여행 정보", [147, 51, 234], tripData, currentY);

    // 비용 정보 섹션
    const costData = [
      { label: "총 예상 비용", value: "₩25,000" },
      { label: "Total Expected Cost", value: "" }
    ];

    currentY = drawSection("비용 정보", [34, 197, 94], costData, currentY);

    // 연락처 정보 섹션
    currentY += 10;
    doc.setFillColor(55, 65, 81);
    doc.rect(margin, currentY, contentWidth, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("연락처 정보", margin + 3, currentY + 5.5);
    
    currentY += 15;
    
    // 연락처 정보를 3열로 배치
    const contactInfo = [
      { type: "전화 문의", value: "1588-1234", desc: "@vietnamvisa24", extra: "평일 09:00-18:00" },
      { type: "카카오톡", value: "@vietnamvisa24", desc: "24시간 상담", extra: "24시간 접수" },
      { type: "이메일", value: "support@vietnamvisa24.com", desc: "24시간 접수", extra: "" }
    ];
    
    const contactColWidth = contentWidth / 3;
    contactInfo.forEach((contact, index) => {
      const x = margin + (index * contactColWidth);
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(37, 99, 235);
      doc.text(contact.type, x + contactColWidth/2, currentY, { align: 'center' });
      
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      doc.text(contact.value, x + contactColWidth/2, currentY + 6, { align: 'center' });
      
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...secondaryColor);
      doc.text(contact.desc, x + contactColWidth/2, currentY + 11, { align: 'center' });
      if (contact.extra) {
        doc.text(contact.extra, x + contactColWidth/2, currentY + 15, { align: 'center' });
      }
    });
    
    currentY += 25;

    // 하단 안내사항
    currentY += 5;
    doc.setDrawColor(...secondaryColor);
    doc.line(margin, currentY, pageWidth - margin, currentY);
    currentY += 8;
    
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...secondaryColor);
    
    const notices = [
      "본 접수증은 정식 비자 승인서가 아닙니다. 비자 승인은 별도로 안내드립니다.",
      "처리 상황은 등록된 이메일과 SMS로 실시간 안내드립니다.",
      "추가 서류 요청 시 즉시 제출해주시기 바랍니다. 지연 시 처리가 늦어질 수 있습니다.",
      "문의사항은 신청번호와 함께 위 연락처로 문의해주시기 바랍니다."
    ];
    
    notices.forEach(notice => {
      doc.text(`• ${notice}`, margin, currentY);
      currentY += 4;
    });

    return doc;
  };

  // PDF 다운로드 핸들러
  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      const pdf = generateReceiptPDF();
      const fileName = `베트남비자_접수증_${applicationId}_${new Date().toLocaleDateString('ko-KR').replace(/\./g, '')}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error('PDF 생성 오류:', error);
      alert('PDF 생성 중 오류가 발생했습니다.');
    } finally {
      setIsDownloading(false);
    }
  };

  // 이메일 발송 핸들러
  const handleSendEmail = async () => {
    if (!formData.personalInfo?.email) {
      alert('이메일 주소가 없습니다.');
      return;
    }

    setIsSendingEmail(true);
    try {
      const pdf = generateReceiptPDF();
      const pdfBlob = pdf.output('blob');
      
      // Blob을 Base64로 변환
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = reader.result.split(',')[1];
        const fileName = `베트남비자_접수증_${applicationId}_${new Date().toLocaleDateString('ko-KR').replace(/\./g, '')}.pdf`;
        
        try {
          const response = await fetch('/api/send-receipt', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: formData.personalInfo.email,
              applicationId: applicationId,
              applicantName: `${formData.personalInfo?.firstName || ""} ${formData.personalInfo?.lastName || ""}`.trim(),
              pdfData: base64Data,
              fileName: fileName
            }),
          });

          const result = await response.json();
          
          if (response.ok) {
            alert('접수증이 이메일로 성공적으로 발송되었습니다!');
          } else {
            throw new Error(result.message || '이메일 발송에 실패했습니다.');
          }
        } catch (error) {
          console.error('이메일 발송 오류:', error);
          alert(`이메일 발송 중 오류가 발생했습니다: ${error.message}`);
        }
      };
      
      reader.readAsDataURL(pdfBlob);
    } catch (error) {
      console.error('PDF 생성 오류:', error);
      alert('PDF 생성 중 오류가 발생했습니다.');
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* 성공 메시지 */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-8 text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle className="w-20 h-20 text-green-600" />
          </div>
          <h1 className="mb-4 text-3xl font-bold text-green-800">
            신청이 완료되었습니다!
          </h1>
          <p className="mb-6 text-lg text-green-700">
            베트남 비자 신청이 성공적으로 접수되었습니다.
          </p>
          <div className="p-4 bg-white rounded-lg shadow-sm">
            <p className="text-sm text-gray-600">신청번호</p>
            <p className="text-2xl font-bold text-blue-600">{applicationId}</p>
          </div>
        </CardContent>
      </Card>

      {/* 신청 정보 요약 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            신청 정보 요약
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 개인 정보 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <User className="w-5 h-5" />
                개인 정보
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">신청자:</span>
                  <span className="font-medium">
                    {formData.personalInfo?.firstName} {formData.personalInfo?.lastName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">이메일:</span>
                  <span className="font-medium">{formData.personalInfo?.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">연락처:</span>
                  <span className="font-medium">{formData.personalInfo?.phone}</span>
                </div>
              </div>
            </div>

            {/* 비자 정보 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Globe className="w-5 h-5" />
                비자 정보
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">비자 유형:</span>
                  <span className="font-medium">{formData.visaType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">처리 속도:</span>
                  <span className="font-medium">
                    {formData.processingType === "fast" ? "긴급 처리" : "일반 처리"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">입국 예정일:</span>
                  <span className="font-medium">{formData.travelInfo?.entryDate}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 다음 단계 안내 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            다음 단계
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <div>
                <h4 className="font-semibold">서류 검토 (1-2시간 내)</h4>
                <p className="text-gray-600">제출해주신 서류를 검토하고 추가 서류가 필요한 경우 연락드립니다.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-bold">2</span>
              </div>
              <div>
                <h4 className="font-semibold">비자 신청 제출</h4>
                <p className="text-gray-600">베트남 이민청에 정식으로 비자 신청을 제출합니다.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-green-600 font-bold">3</span>
              </div>
              <div>
                <h4 className="font-semibold">비자 승인 및 발급</h4>
                <p className="text-gray-600">
                  {formData.processingType === "fast" 
                    ? "24시간 내에 승인 결과를 받아 즉시 전달드립니다."
                    : "2-3일 내에 승인 결과를 받아 즉시 전달드립니다."
                  }
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 접수증 다운로드 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            접수증 다운로드
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <Download className="w-4 h-4" />
              {isDownloading ? "생성 중..." : "PDF 다운로드"}
            </Button>
            <Button 
              onClick={handleSendEmail}
              disabled={isSendingEmail || !formData.personalInfo?.email}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              {isSendingEmail ? "발송 중..." : "이메일로 발송"}
            </Button>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            접수증을 안전한 곳에 보관해주세요. 문의 시 신청번호가 필요합니다.
          </p>
        </CardContent>
      </Card>

      {/* 고객 지원 */}
      <Card>
        <CardHeader>
          <CardTitle>고객 지원</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
