
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

    // 한글 지원을 위한 폰트 설정 (기본 폰트 사용, 더 나은 레이아웃)
    doc.setFont("helvetica");
    
    // 브랜드 색상 정의
    const brandBlue = [37, 99, 235];
    const brandGreen = [16, 185, 129];
    const brandPurple = [139, 92, 246];
    const brandOrange = [245, 101, 101];
    const darkGray = [55, 65, 81];
    const lightGray = [156, 163, 175];
    const bgGray = [248, 250, 252];

    // 페이지 설정
    const margin = 15;
    const pageWidth = 210;
    const pageHeight = 297;
    const contentWidth = pageWidth - (margin * 2);
    let currentY = margin;

    // === 헤더 부분 (개선된 디자인) ===
    // 그라데이션 효과를 위한 배경
    doc.setFillColor(...brandBlue);
    doc.rect(0, 0, pageWidth, 45, 'F');
    
    // 회사 로고 영역
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(26);
    doc.setFont("helvetica", "bold");
    doc.text("VIETNAM VISA 24", pageWidth / 2, 20, { align: 'center' });
    
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text("Professional Visa Service", pageWidth / 2, 28, { align: 'center' });
    
    // 장식적 라인
    doc.setDrawColor(255, 255, 255);
    doc.setLineWidth(0.5);
    doc.line(pageWidth / 2 - 30, 32, pageWidth / 2 + 30, 32);
    
    doc.setFontSize(9);
    doc.text("www.vietnamvisa24.com", pageWidth / 2, 38, { align: 'center' });
    
    currentY = 55;

    // === 접수증 제목 ===
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("VISA APPLICATION RECEIPT", pageWidth / 2, currentY, { align: 'center' });
    
    doc.setFontSize(18);
    doc.setTextColor(...darkGray);
    doc.text("BIZA SINCHENG JEOPSUJEUNG", pageWidth / 2, currentY + 8, { align: 'center' });
    
    currentY += 20;

    // === 접수 정보 박스 ===
    doc.setFillColor(...bgGray);
    doc.rect(margin, currentY, contentWidth, 15, 'F');
    doc.setDrawColor(...lightGray);
    doc.rect(margin, currentY, contentWidth, 15, 'S');
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Receipt Date: ${new Date().toLocaleDateString('en-US')}`, margin + 5, currentY + 6);
    doc.text(`JEOPSU-IL: ${new Date().toLocaleDateString('ko-KR')}`, margin + 5, currentY + 11);
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(`Application No: ${applicationId}`, pageWidth - margin - 5, currentY + 9, { align: 'right' });
    
    currentY += 25;

    // === 개선된 섹션 그리기 함수 ===
    const drawModernSection = (title, titleEn, color, data, startY) => {
      let y = startY;
      
      // 섹션 헤더 (그라데이션 스타일)
      doc.setFillColor(...color);
      doc.rect(margin, y, contentWidth, 12, 'F');
      
      // 섹션 제목
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(titleEn, margin + 5, y + 6);
      doc.setFontSize(9);
      doc.text(title, margin + 5, y + 9.5);
      
      y += 16;
      
      // 데이터 영역
      doc.setFillColor(255, 255, 255);
      const dataHeight = Math.ceil(data.length / 2) * 8 + 4;
      doc.rect(margin, y, contentWidth, dataHeight, 'F');
      doc.setDrawColor(...lightGray);
      doc.rect(margin, y, contentWidth, dataHeight, 'S');
      
      // 데이터 내용
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(9);
      
      const colWidth = contentWidth / 2;
      let row = 0;
      
      data.forEach((item, index) => {
        const col = index % 2;
        if (col === 0 && index > 0) row++;
        
        const x = margin + 5 + (col * colWidth);
        const yPos = y + 6 + (row * 8);
        
        // 레이블
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...darkGray);
        doc.text(item.labelEn + ":", x, yPos);
        doc.setFontSize(8);
        doc.text(item.label, x, yPos + 3);
        
        // 값
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(0, 0, 0);
        doc.text(item.value, x + 35, yPos);
      });
      
      return y + dataHeight + 5;
    };

    // === 신청자 정보 ===
    const applicantData = [
      { 
        labelEn: "Application No", 
        label: "SINCHENG BEONHO", 
        value: applicationId 
      },
      { 
        labelEn: "Visa Type", 
        label: "BIZA YUHYEONG", 
        value: formData.visaType || "E-VISA" 
      },
      { 
        labelEn: "Processing", 
        label: "CHEORI SOKDO", 
        value: formData.processingType === "fast" ? "Express (24h)" : "Standard (2-3 days)" 
      },
      { 
        labelEn: "Applicant", 
        label: "SINCHENGJA", 
        value: `${formData.personalInfo?.firstName || ""} ${formData.personalInfo?.lastName || ""}`.trim() 
      },
      { 
        labelEn: "Nationality", 
        label: "GUKJEOK", 
        value: "REPUBLIC OF KOREA" 
      },
      { 
        labelEn: "Email", 
        label: "IMEOL", 
        value: formData.personalInfo?.email || "" 
      },
      { 
        labelEn: "Phone", 
        label: "YEONRAKCHEO", 
        value: formData.personalInfo?.phone || "" 
      },
      { 
        labelEn: "Emergency Contact", 
        label: "BISAN YEONRAKCHEO", 
        value: formData.personalInfo?.phoneOfFriend || "N/A" 
      }
    ];

    currentY = drawModernSection("SINCHENGJA JEONGBO", "APPLICANT INFORMATION", brandBlue, applicantData, currentY);

    // === 여행 정보 ===
    const travelData = [
      { 
        labelEn: "Entry Date", 
        label: "IPGUK YEJEONG-IL", 
        value: formData.travelInfo?.entryDate || "N/A" 
      },
      { 
        labelEn: "Entry Port", 
        label: "IPGUK HANGGOO", 
        value: formData.travelInfo?.entryPort || "Danang Airport" 
      },
      { 
        labelEn: "Purpose", 
        label: "YEOHAENG MOGJEOK", 
        value: "Tourism / GWAN-GWANG" 
      },
      { 
        labelEn: "Duration", 
        label: "CHERYOO GIGAN", 
        value: "30 Days / 30-IL" 
      }
    ];

    currentY = drawModernSection("YEOHAENG JEONGBO", "TRAVEL INFORMATION", brandOrange, travelData, currentY);

    // === 처리 정보 ===
    const processingData = [
      { 
        labelEn: "Processing Type", 
        label: "CHEORI YUHYEONG", 
        value: formData.processingType === "fast" ? "Express Service" : "Standard Service" 
      },
      { 
        labelEn: "Expected Completion", 
        label: "WANRYO YEJEONGSIGAN", 
        value: formData.processingType === "fast" ? "Within 24 hours" : "2-3 Business Days" 
      },
      { 
        labelEn: "Status", 
        label: "CHEORI SANGTAE", 
        value: "Received / JEOPSU WANRYO" 
      },
      { 
        labelEn: "Payment Status", 
        label: "GYEOLJE SANGTAE", 
        value: "Pending / GYEOLJE DAEGI" 
      }
    ];

    currentY = drawModernSection("CHEORI JEONGBO", "PROCESSING INFORMATION", brandPurple, processingData, currentY);

    // === 비용 정보 ===
    doc.setFillColor(...brandGreen);
    doc.rect(margin, currentY, contentWidth, 12, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("PAYMENT INFORMATION", margin + 5, currentY + 6);
    doc.setFontSize(9);
    doc.text("GYEOLJE JEONGBO", margin + 5, currentY + 9.5);
    
    currentY += 16;
    
    // 비용 박스
    doc.setFillColor(248, 250, 248);
    doc.rect(margin, currentY, contentWidth, 18, 'F');
    doc.setDrawColor(...brandGreen);
    doc.setLineWidth(1);
    doc.rect(margin, currentY, contentWidth, 18, 'S');
    
    doc.setTextColor(...brandGreen);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Total Amount: ₩25,000", pageWidth / 2, currentY + 8, { align: 'center' });
    doc.setFontSize(10);
    doc.text("CHONG BIONG: ISMAN-OCHEON WON", pageWidth / 2, currentY + 13, { align: 'center' });
    
    currentY += 28;

    // === 고객 지원 정보 ===
    doc.setFillColor(...darkGray);
    doc.rect(margin, currentY, contentWidth, 12, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("CUSTOMER SUPPORT", margin + 5, currentY + 6);
    doc.setFontSize(9);
    doc.text("GOGAEK JIWON", margin + 5, currentY + 9.5);
    
    currentY += 16;
    
    // 연락처 정보
    const contactColWidth = contentWidth / 3;
    const contacts = [
      { 
        type: "PHONE / JEONHWA", 
        value: "1588-1234", 
        time: "09:00-18:00 (Weekdays)" 
      },
      { 
        type: "KAKAOTALK", 
        value: "@vietnamvisa24", 
        time: "24/7 Support" 
      },
      { 
        type: "EMAIL / IMEOL", 
        value: "support@vietnamvisa24.com", 
        time: "24/7 Reception" 
      }
    ];
    
    contacts.forEach((contact, index) => {
      const x = margin + (index * contactColWidth);
      const centerX = x + contactColWidth / 2;
      
      // 배경 박스
      doc.setFillColor(index === 0 ? 239 : index === 1 ? 220 : 233, 
                       index === 0 ? 246 : index === 1 ? 252 : 213, 
                       index === 0 ? 255 : index === 1 ? 191 : 255);
      doc.rect(x + 2, currentY, contactColWidth - 4, 22, 'F');
      doc.setDrawColor(...lightGray);
      doc.rect(x + 2, currentY, contactColWidth - 4, 22, 'S');
      
      // 내용
      doc.setTextColor(...darkGray);
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.text(contact.type, centerX, currentY + 5, { align: 'center' });
      
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "bold");
      doc.text(contact.value, centerX, currentY + 10, { align: 'center' });
      
      doc.setFontSize(7);
      doc.setTextColor(...lightGray);
      doc.setFont("helvetica", "normal");
      doc.text(contact.time, centerX, currentY + 15, { align: 'center' });
    });
    
    currentY += 32;

    // === 중요 안내사항 ===
    doc.setDrawColor(...lightGray);
    doc.line(margin, currentY, pageWidth - margin, currentY);
    currentY += 8;
    
    doc.setTextColor(...darkGray);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("IMPORTANT NOTICES / JUNGYO ANGAE", margin, currentY);
    currentY += 6;
    
    const notices = [
      "• This receipt is not an official visa approval. Official approval will be sent separately.",
      "• Processing status will be updated via email and SMS in real-time.",
      "• Please submit additional documents immediately when requested to avoid delays.",
      "• For inquiries, please contact us with your application number."
    ];
    
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    notices.forEach(notice => {
      doc.text(notice, margin, currentY);
      currentY += 4;
    });

    // === 푸터 ===
    currentY = pageHeight - 25;
    doc.setDrawColor(...lightGray);
    doc.line(margin, currentY, pageWidth - margin, currentY);
    
    doc.setTextColor(...lightGray);
    doc.setFontSize(7);
    doc.text("Vietnam Visa 24 - Professional Visa Service", pageWidth / 2, currentY + 5, { align: 'center' });
    doc.text("This document was generated automatically. Please keep it safe for future reference.", pageWidth / 2, currentY + 9, { align: 'center' });
    doc.text(`Generated on ${new Date().toLocaleString('en-US')}`, pageWidth / 2, currentY + 13, { align: 'center' });

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
