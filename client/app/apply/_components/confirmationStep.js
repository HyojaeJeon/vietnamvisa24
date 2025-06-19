
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
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });

      // 한글 지원을 위한 폰트 설정
      doc.setFont("helvetica", "normal");
    
    // 브랜드 색상 정의 (더 생동감 있는 색상)
    const primaryBlue = [67, 133, 245];
    const accentOrange = [255, 99, 99];
    const successGreen = [34, 197, 94];
    const warningPurple = [168, 85, 247];
    const darkText = [31, 41, 55];
    const lightText = [107, 114, 128];
    const bgLight = [249, 250, 251];

    // 페이지 설정
    const margin = 12;
    const pageWidth = 210;
    const pageHeight = 297;
    const contentWidth = pageWidth - (margin * 2);
    let currentY = margin;

    // === 모던 헤더 디자인 ===
    // 메인 헤더 배경 (그라데이션 효과)
    doc.setFillColor(...primaryBlue);
    doc.rect(0, 0, pageWidth, 50, 'F');
    
    // 헤더 장식 요소
    doc.setFillColor(255, 255, 255);
    doc.setGlobalAlpha(0.1);
    doc.circle(pageWidth - 20, 15, 25, 'F');
    doc.circle(25, 35, 15, 'F');
    doc.setGlobalAlpha(1);
    
    // 회사명 및 로고 영역
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont("helvetica", "bold");
    doc.text("VIETNAM VISA 24", pageWidth / 2, 22, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Professional Visa Service", pageWidth / 2, 30, { align: 'center' });
    
    // 장식 라인
    doc.setDrawColor(255, 255, 255);
    doc.setLineWidth(1);
    doc.line(pageWidth / 2 - 40, 35, pageWidth / 2 + 40, 35);
    
    doc.setFontSize(10);
    doc.text("www.vietnamvisa24.com", pageWidth / 2, 42, { align: 'center' });
    
    currentY = 60;

    // === 접수증 타이틀 ===
    doc.setTextColor(...darkText);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("비자 신청 접수증", pageWidth / 2, currentY, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setTextColor(...lightText);
    doc.text("VISA APPLICATION RECEIPT", pageWidth / 2, currentY + 7, { align: 'center' });
    
    currentY += 20;

    // === 접수 정보 박스 (고급스러운 디자인) ===
    // 그림자 효과
    doc.setFillColor(200, 200, 200);
    doc.rect(margin + 1, currentY + 1, contentWidth, 20, 'F');
    
    // 메인 박스
    doc.setFillColor(...bgLight);
    doc.rect(margin, currentY, contentWidth, 20, 'F');
    doc.setDrawColor(...primaryBlue);
    doc.setLineWidth(2);
    doc.rect(margin, currentY, contentWidth, 20, 'S');
    
    // 접수 정보 내용
    doc.setTextColor(...darkText);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(`접수일시: ${new Date().toLocaleDateString('ko-KR')} ${new Date().toLocaleTimeString('ko-KR')}`, margin + 8, currentY + 8);
    
    doc.setTextColor(...primaryBlue);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(`신청번호: ${applicationId}`, pageWidth - margin - 8, currentY + 8, { align: 'right' });
    
    doc.setTextColor(...lightText);
    doc.setFontSize(9);
    doc.text("Receipt Date & Time", margin + 8, currentY + 14);
    doc.text("Application Number", pageWidth - margin - 8, currentY + 14, { align: 'right' });
    
    currentY += 30;

    // === 섹션 그리기 함수 (한글 중심) ===
    const drawKoreanSection = (koreanTitle, englishTitle, bgColor, data, startY) => {
      let y = startY;
      
      // 섹션 헤더 (라운드 코너 효과)
      doc.setFillColor(...bgColor);
      doc.roundedRect(margin, y, contentWidth, 14, 3, 3, 'F');
      
      // 헤더 텍스트
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(13);
      doc.setFont("helvetica", "bold");
      doc.text(koreanTitle, margin + 8, y + 7);
      
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text(englishTitle, margin + 8, y + 11);
      
      y += 18;
      
      // 데이터 영역 (카드 스타일)
      const dataHeight = Math.ceil(data.length / 2) * 14 + 12;
      
      // 그림자
      doc.setFillColor(230, 230, 230);
      doc.roundedRect(margin + 1, y + 1, contentWidth, dataHeight, 2, 2, 'F');
      
      // 메인 카드
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(margin, y, contentWidth, dataHeight, 2, 2, 'F');
      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.5);
      doc.roundedRect(margin, y, contentWidth, dataHeight, 2, 2, 'S');
      
      // 데이터 내용 배치
      const colWidth = contentWidth / 2;
      let row = 0;
      
      data.forEach((item, index) => {
        const col = index % 2;
        if (col === 0 && index > 0) row++;
        
        const x = margin + 8 + (col * colWidth);
        const yPos = y + 8 + (row * 14);
        
        // 한글 레이블 (강조)
        doc.setTextColor(...darkText);
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text(item.korean, x, yPos);
        
        // 영문 레이블 (보조)
        doc.setTextColor(...lightText);
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.text(item.english, x, yPos + 4);
        
        // 값
        doc.setTextColor(...darkText);
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        const valueX = x + 50;
        doc.text(item.value, valueX, yPos + 2);
      });
      
      return y + dataHeight + 8;
    };

    // === 신청자 정보 ===
    const applicantData = [
      {
        korean: "신청번호",
        english: "Application No",
        value: applicationId
      },
      {
        korean: "비자유형",
        english: "Visa Type",
        value: formData.visaType || "E-VISA"
      },
      {
        korean: "처리속도",
        english: "Processing Speed",
        value: formData.processingType === "fast" ? "긴급처리 (24시간)" : "일반처리 (2-3일)"
      },
      {
        korean: "신청자명",
        english: "Applicant Name",
        value: `${formData.personalInfo?.firstName || ""} ${formData.personalInfo?.lastName || ""}`.trim()
      },
      {
        korean: "국적",
        english: "Nationality",
        value: "대한민국 (Republic of Korea)"
      },
      {
        korean: "이메일",
        english: "Email Address",
        value: formData.personalInfo?.email || ""
      },
      {
        korean: "연락처",
        english: "Phone Number",
        value: formData.personalInfo?.phone || ""
      },
      {
        korean: "비상연락처",
        english: "Emergency Contact",
        value: formData.personalInfo?.phoneOfFriend || "N/A"
      }
    ];

    currentY = drawKoreanSection("신청자 정보", "APPLICANT INFORMATION", primaryBlue, applicantData, currentY);

    // === 여행 정보 ===
    const travelData = [
      {
        korean: "입국예정일",
        english: "Entry Date",
        value: formData.travelInfo?.entryDate || "미정"
      },
      {
        korean: "입국항구",
        english: "Entry Port",
        value: formData.travelInfo?.entryPort || "다낭공항"
      },
      {
        korean: "여행목적",
        english: "Purpose of Visit",
        value: "관광 (Tourism)"
      },
      {
        korean: "체류기간",
        english: "Duration of Stay",
        value: "30일 (30 Days)"
      }
    ];

    currentY = drawKoreanSection("여행 정보", "TRAVEL INFORMATION", accentOrange, travelData, currentY);

    // === 처리 정보 ===
    const processingData = [
      {
        korean: "처리유형",
        english: "Processing Type",
        value: formData.processingType === "fast" ? "긴급 서비스" : "일반 서비스"
      },
      {
        korean: "완료예정시간",
        english: "Expected Completion",
        value: formData.processingType === "fast" ? "24시간 이내" : "2-3 영업일"
      },
      {
        korean: "처리상태",
        english: "Processing Status",
        value: "접수완료 (Received)"
      },
      {
        korean: "결제상태",
        english: "Payment Status",
        value: "결제대기 (Pending Payment)"
      }
    ];

    currentY = drawKoreanSection("처리 정보", "PROCESSING INFORMATION", warningPurple, processingData, currentY);

    // === 결제 정보 (특별 강조) ===
    // 그림자
    doc.setFillColor(200, 200, 200);
    doc.roundedRect(margin + 2, currentY + 2, contentWidth, 25, 5, 5, 'F');
    
    // 메인 박스
    doc.setFillColor(240, 253, 244);
    doc.roundedRect(margin, currentY, contentWidth, 25, 5, 5, 'F');
    doc.setDrawColor(...successGreen);
    doc.setLineWidth(2);
    doc.roundedRect(margin, currentY, contentWidth, 25, 5, 5, 'S');
    
    // 제목
    doc.setTextColor(...successGreen);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("결제 정보", margin + 8, currentY + 8);
    doc.setFontSize(9);
    doc.text("PAYMENT INFORMATION", margin + 8, currentY + 13);
    
    // 금액 (중앙 강조)
    doc.setTextColor(...successGreen);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("총 결제금액: ₩25,000", pageWidth / 2, currentY + 17, { align: 'center' });
    
    currentY += 35;

    // === 고객지원 정보 (카드 스타일) ===
    doc.setTextColor(...darkText);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("고객 지원", margin, currentY);
    doc.setFontSize(10);
    doc.setTextColor(...lightText);
    doc.text("CUSTOMER SUPPORT", margin, currentY + 6);
    
    currentY += 15;
    
    // 연락처 카드들
    const contactWidth = (contentWidth - 8) / 3;
    const contacts = [
      {
        korean: "전화 문의",
        english: "Phone Support",
        value: "1588-1234",
        hours: "평일 09:00-18:00",
        color: [59, 130, 246]
      },
      {
        korean: "카카오톡",
        english: "KakaoTalk",
        value: "@vietnamvisa24",
        hours: "24시간 상담",
        color: [34, 197, 94]
      },
      {
        korean: "이메일",
        english: "Email Support",
        value: "support@vietnamvisa24.com",
        hours: "24시간 접수",
        color: [168, 85, 247]
      }
    ];
    
    contacts.forEach((contact, index) => {
      const x = margin + (index * (contactWidth + 4));
      
      // 카드 그림자
      doc.setFillColor(230, 230, 230);
      doc.roundedRect(x + 1, currentY + 1, contactWidth, 28, 3, 3, 'F');
      
      // 카드 배경
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(x, currentY, contactWidth, 28, 3, 3, 'F');
      doc.setDrawColor(...contact.color);
      doc.setLineWidth(1.5);
      doc.roundedRect(x, currentY, contactWidth, 28, 3, 3, 'S');
      
      // 아이콘 영역
      doc.setFillColor(...contact.color);
      doc.circle(x + contactWidth/2, currentY + 8, 3, 'F');
      
      // 텍스트
      doc.setTextColor(...darkText);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text(contact.korean, x + contactWidth/2, currentY + 15, { align: 'center' });
      
      doc.setTextColor(...contact.color);
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.text(contact.value, x + contactWidth/2, currentY + 19, { align: 'center' });
      
      doc.setTextColor(...lightText);
      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      doc.text(contact.hours, x + contactWidth/2, currentY + 23, { align: 'center' });
    });
    
    currentY += 38;

    // === 중요 안내사항 ===
    doc.setFillColor(254, 242, 242);
    doc.roundedRect(margin, currentY, contentWidth, 20, 3, 3, 'F');
    doc.setDrawColor(248, 113, 113);
    doc.setLineWidth(1);
    doc.roundedRect(margin, currentY, contentWidth, 20, 3, 3, 'S');
    
    doc.setTextColor(185, 28, 28);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("중요 안내사항", margin + 8, currentY + 7);
    
    doc.setTextColor(107, 114, 128);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    const notices = [
      "• 본 접수증은 공식 비자 승인서가 아닙니다. 승인서는 별도 발송됩니다.",
      "• 처리 상황은 실시간으로 이메일과 SMS로 안내드립니다.",
      "• 추가 서류 요청 시 지연 방지를 위해 즉시 제출해주세요."
    ];
    
    notices.forEach((notice, index) => {
      doc.text(notice, margin + 8, currentY + 12 + (index * 3));
    });
    
    currentY += 30;

    // === 푸터 ===
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.5);
    doc.line(margin, currentY, pageWidth - margin, currentY);
    
    currentY += 8;
    doc.setTextColor(...lightText);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text("Vietnam Visa 24 - 전문 비자 서비스", pageWidth / 2, currentY, { align: 'center' });
    doc.text(`발급일시: ${new Date().toLocaleString('ko-KR')}`, pageWidth / 2, currentY + 5, { align: 'center' });
    doc.text("이 문서는 자동으로 생성되었습니다. 향후 참조를 위해 안전하게 보관하세요.", pageWidth / 2, currentY + 10, { align: 'center' });

    return doc;
    } catch (error) {
      console.error('PDF 생성 중 오류 발생:', error);
      throw new Error('PDF 생성에 실패했습니다. 다시 시도해주세요.');
    }
  };

  // 한글 텍스트 처리를 위한 유틸리티 함수
  const wrapKoreanText = (text, maxWidth) => {
    if (!text) return [''];
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';
    
    words.forEach(word => {
      const testLine = currentLine + (currentLine ? ' ' : '') + word;
      if (testLine.length * 2.5 > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    });
    
    if (currentLine) lines.push(currentLine);
    return lines.length ? lines : [''];
  };

  // PDF 다운로드 핸들러
  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      // 필수 데이터 검증
      if (!applicationId) {
        throw new Error('신청번호가 없습니다.');
      }
      
      if (!formData || !formData.personalInfo) {
        throw new Error('신청자 정보가 없습니다.');
      }

      const pdf = generateReceiptPDF();
      const safeDate = new Date().toLocaleDateString('ko-KR').replace(/[.\s]/g, '');
      const fileName = `베트남비자_접수증_${applicationId}_${safeDate}.pdf`;
      
      // PDF 저장
      pdf.save(fileName);
      
      // 성공 메시지
      console.log('PDF 다운로드 완료:', fileName);
      
    } catch (error) {
      console.error('PDF 생성 오류:', error);
      alert(`PDF 생성 중 오류가 발생했습니다: ${error.message || '알 수 없는 오류'}`);
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
