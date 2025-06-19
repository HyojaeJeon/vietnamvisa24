
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

      // 한글 폰트 설정 (기본 내장 폰트 사용)
      doc.setFont("helvetica", "normal");

      // 브랜드 색상 정의
      const colors = {
        primary: [67, 133, 245],        // 메인 블루
        primaryLight: [147, 181, 255],   // 연한 블루
        secondary: [255, 127, 80],       // 코랄
        secondaryLight: [255, 177, 130], // 연한 코랄
        accent: [147, 51, 234],          // 보라
        accentLight: [197, 151, 255],    // 연한 보라
        success: [34, 197, 94],          // 초록
        successLight: [134, 239, 172],   // 연한 초록
        warning: [245, 158, 11],         // 주황
        warningLight: [253, 230, 138],   // 연한 주황
        dark: [31, 41, 55],             // 다크 그레이
        light: [107, 114, 128],         // 라이트 그레이
        white: [255, 255, 255],         // 흰색
        gray: [243, 244, 246],          // 배경 그레이
        border: [229, 231, 235]         // 경계선 그레이
      };

      // 페이지 설정
      const margin = 15;
      const pageWidth = 210;
      const pageHeight = 297;
      const contentWidth = pageWidth - (margin * 2);
      let currentY = 0;

      // === 그라데이션 헤더 그리기 함수 ===
      const drawGradientHeader = () => {
        // 그라데이션 효과 시뮬레이션 (여러 색상 레이어)
        for (let i = 0; i < 45; i++) {
          const ratio = i / 45;
          const r = colors.primary[0] + (colors.primaryLight[0] - colors.primary[0]) * ratio;
          const g = colors.primary[1] + (colors.primaryLight[1] - colors.primary[1]) * ratio;
          const b = colors.primary[2] + (colors.primaryLight[2] - colors.primary[2]) * ratio;
          
          doc.setFillColor(Math.round(r), Math.round(g), Math.round(b));
          doc.rect(0, i, pageWidth, 1.2, 'F');
        }

        // 장식 요소들
        doc.setFillColor(255, 255, 255, 0.1);
        doc.circle(pageWidth - 25, 15, 20, 'F');
        doc.circle(25, 35, 15, 'F');
        doc.circle(pageWidth - 50, 35, 8, 'F');
        
        // 회사 로고 영역
        doc.setTextColor(...colors.white);
        doc.setFontSize(28);
        doc.setFont("helvetica", "bold");
        doc.text("VIETNAM VISA 24", pageWidth / 2, 18, { align: 'center' });
        
        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        doc.text("Professional Visa Service", pageWidth / 2, 26, { align: 'center' });
        
        // 장식 라인
        doc.setDrawColor(...colors.white);
        doc.setLineWidth(0.8);
        doc.line(pageWidth / 2 - 40, 30, pageWidth / 2 + 40, 30);
        
        doc.setFontSize(9);
        doc.text("www.vietnamvisa24.com", pageWidth / 2, 36, { align: 'center' });
        doc.text("Professional Vietnam Visa Solution", pageWidth / 2, 41, { align: 'center' });
      };

      // === 섹션 그리기 함수 ===
      const drawSection = (title, englishTitle, bgColor, lightColor, data, startY, icon = null) => {
        let y = startY;
        
        // 섹션 헤더 (그라데이션 효과)
        for (let i = 0; i < 16; i++) {
          const ratio = i / 16;
          const r = bgColor[0] + (lightColor[0] - bgColor[0]) * ratio;
          const g = bgColor[1] + (lightColor[1] - bgColor[1]) * ratio;
          const b = bgColor[2] + (lightColor[2] - bgColor[2]) * ratio;
          
          doc.setFillColor(Math.round(r), Math.round(g), Math.round(b));
          doc.roundedRect(margin, y + i, contentWidth, 1, 3, 3, 'F');
        }
        
        // 헤더 텍스트
        doc.setTextColor(...colors.white);
        doc.setFontSize(13);
        doc.setFont("helvetica", "bold");
        doc.text(title, margin + 8, y + 7);
        
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.text(englishTitle, margin + 8, y + 12);
        
        // 아이콘 영역 (시뮬레이션)
        if (icon) {
          doc.setFillColor(...colors.white);
          doc.circle(pageWidth - margin - 15, y + 8, 4, 'F');
        }
        
        y += 20;
        
        // 데이터 영역
        const dataHeight = Math.ceil(data.length / 2) * 12 + 15;
        
        // 메인 데이터 박스 (그림자 효과)
        doc.setFillColor(240, 240, 240);
        doc.roundedRect(margin + 1, y + 1, contentWidth, dataHeight, 3, 3, 'F');
        
        doc.setFillColor(...colors.white);
        doc.roundedRect(margin, y, contentWidth, dataHeight, 3, 3, 'F');
        doc.setDrawColor(...colors.border);
        doc.setLineWidth(0.5);
        doc.roundedRect(margin, y, contentWidth, dataHeight, 3, 3, 'S');
        
        // 데이터 내용 배치
        const colWidth = contentWidth / 2;
        let row = 0;
        
        data.forEach((item, index) => {
          const col = index % 2;
          if (col === 0 && index > 0) row++;
          
          const x = margin + 12 + (col * colWidth);
          const yPos = y + 10 + (row * 12);
          
          // 라벨
          doc.setTextColor(...colors.dark);
          doc.setFontSize(9);
          doc.setFont("helvetica", "bold");
          // 한글 텍스트를 ASCII로 변환하여 표시
          const labelText = item.korean || item.label || "정보";
          doc.text(labelText + ":", x, yPos);
          
          // 값
          doc.setTextColor(...colors.light);
          doc.setFontSize(9);
          doc.setFont("helvetica", "normal");
          const valueX = x + 40;
          const displayValue = item.value || "정보 없음";
          
          // 긴 텍스트 처리
          if (displayValue.length > 20) {
            const splitValue = displayValue.substring(0, 20) + "...";
            doc.text(splitValue, valueX, yPos);
          } else {
            doc.text(displayValue, valueX, yPos);
          }
          
          // 구분선
          if (col === 0) {
            doc.setDrawColor(...colors.border);
            doc.setLineWidth(0.2);
            doc.line(x + colWidth - 10, yPos - 6, x + colWidth - 10, yPos + 4);
          }
        });
        
        return y + dataHeight + 12;
      };

      // === 페이지 1: 접수증 ===
      drawGradientHeader();
      currentY = 55;

      // 메인 타이틀
      doc.setTextColor(...colors.dark);
      doc.setFontSize(24);
      doc.setFont("helvetica", "bold");
      doc.text("VISA APPLICATION RECEIPT", pageWidth / 2, currentY, { align: 'center' });
      
      doc.setFontSize(14);
      doc.setTextColor(...colors.light);
      doc.text("비자 신청 접수증", pageWidth / 2, currentY + 8, { align: 'center' });
      
      doc.setFontSize(10);
      doc.text("Your visa application has been successfully received", pageWidth / 2, currentY + 15, { align: 'center' });
      
      currentY += 25;

      // 접수 정보 박스 (특별 강조)
      // 그라데이션 배경
      for (let i = 0; i < 18; i++) {
        const ratio = i / 18;
        const r = colors.success[0] + (colors.successLight[0] - colors.success[0]) * ratio;
        const g = colors.success[1] + (colors.successLight[1] - colors.success[1]) * ratio;
        const b = colors.success[2] + (colors.successLight[2] - colors.success[2]) * ratio;
        
        doc.setFillColor(Math.round(r), Math.round(g), Math.round(b));
        doc.roundedRect(margin, currentY + i, contentWidth, 1, 4, 4, 'F');
      }
      
      doc.setDrawColor(...colors.success);
      doc.setLineWidth(1.5);
      doc.roundedRect(margin, currentY, contentWidth, 18, 4, 4, 'S');
      
      // 접수 정보
      doc.setTextColor(...colors.white);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      const receiptDate = new Date().toLocaleDateString('en-US');
      const receiptTime = new Date().toLocaleTimeString('en-US');
      doc.text(`Receipt Date: ${receiptDate} ${receiptTime}`, margin + 8, currentY + 8);
      
      doc.setFontSize(13);
      doc.setFont("helvetica", "bold");
      doc.text(`Application No: ${applicationId}`, pageWidth - margin - 8, currentY + 8, { align: 'right' });
      
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text("접수일시", margin + 8, currentY + 13);
      doc.text("신청번호", pageWidth - margin - 8, currentY + 13, { align: 'right' });
      
      currentY += 28;

      // 신청자 정보 섹션
      const applicantData = [
        {
          korean: "Application No",
          value: applicationId
        },
        {
          korean: "Visa Type",
          value: formData.visaType || "E-VISA"
        },
        {
          korean: "Applicant Name",
          value: `${formData.personalInfo?.firstName || ""} ${formData.personalInfo?.lastName || ""}`.trim()
        },
        {
          korean: "Passport Number",
          value: formData.personalInfo?.passportNumber || "Not provided"
        },
        {
          korean: "Nationality",
          value: "Republic of Korea"
        },
        {
          korean: "Date of Birth",
          value: formData.personalInfo?.dateOfBirth || "Not provided"
        },
        {
          korean: "Email Address",
          value: formData.personalInfo?.email || "Not provided"
        },
        {
          korean: "Phone Number",
          value: formData.personalInfo?.phone || "Not provided"
        }
      ];

      currentY = drawSection("APPLICANT INFORMATION", "신청자 정보", colors.primary, colors.primaryLight, applicantData, currentY, true);

      // 여행 정보 섹션
      const travelData = [
        {
          korean: "Entry Date",
          value: formData.travelInfo?.entryDate || "To be determined"
        },
        {
          korean: "Entry Port",
          value: formData.travelInfo?.entryPort || "Hanoi Airport"
        },
        {
          korean: "Purpose",
          value: "Tourism"
        },
        {
          korean: "Duration",
          value: "30 Days"
        }
      ];

      currentY = drawSection("TRAVEL INFORMATION", "여행 정보", colors.secondary, colors.secondaryLight, travelData, currentY, true);

      // 처리 정보 섹션
      const processingData = [
        {
          korean: "Processing Type",
          value: formData.processingType === "fast" ? "Express Service" : "Standard Service"
        },
        {
          korean: "Expected Completion",
          value: formData.processingType === "fast" ? "Within 24 hours" : "2-3 Business Days"
        },
        {
          korean: "Status",
          value: "Application Received"
        },
        {
          korean: "Payment Status",
          value: "Pending Payment"
        }
      ];

      currentY = drawSection("PROCESSING INFORMATION", "처리 정보", colors.accent, colors.accentLight, processingData, currentY, true);

      // 결제 정보 (특별 강조)
      // 그라데이션 배경
      for (let i = 0; i < 25; i++) {
        const ratio = i / 25;
        const r = colors.warning[0] + (colors.warningLight[0] - colors.warning[0]) * ratio;
        const g = colors.warning[1] + (colors.warningLight[1] - colors.warning[1]) * ratio;
        const b = colors.warning[2] + (colors.warningLight[2] - colors.warning[2]) * ratio;
        
        doc.setFillColor(Math.round(r), Math.round(g), Math.round(b));
        doc.roundedRect(margin, currentY + i, contentWidth, 1, 5, 5, 'F');
      }
      
      doc.setDrawColor(...colors.warning);
      doc.setLineWidth(2);
      doc.roundedRect(margin, currentY, contentWidth, 25, 5, 5, 'S');
      
      // 제목
      doc.setTextColor(...colors.dark);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("PAYMENT INFORMATION", margin + 10, currentY + 8);
      doc.setFontSize(9);
      doc.text("결제 정보", margin + 10, currentY + 13);
      
      // 금액 (중앙 강조)
      doc.setTextColor(...colors.dark);
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("Total Amount: ₩25,000", pageWidth / 2, currentY + 18, { align: 'center' });
      
      currentY += 35;

      // 고객지원 정보
      doc.setTextColor(...colors.dark);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("CUSTOMER SUPPORT", margin, currentY);
      doc.setFontSize(9);
      doc.setTextColor(...colors.light);
      doc.text("고객 지원", margin, currentY + 6);
      
      currentY += 15;
      
      // 연락처 카드들
      const contactWidth = (contentWidth - 16) / 3;
      const contacts = [
        {
          title: "Phone Support",
          value: "1588-1234",
          hours: "Weekdays 09:00-18:00",
          color: colors.primary
        },
        {
          title: "KakaoTalk",
          value: "@vietnamvisa24",
          hours: "24/7 Available",
          color: colors.success
        },
        {
          title: "Email Support",
          value: "support@vietnamvisa24.com",
          hours: "24/7 Reception",
          color: colors.accent
        }
      ];
      
      contacts.forEach((contact, index) => {
        const x = margin + (index * (contactWidth + 8));
        
        // 카드 배경 (그림자)
        doc.setFillColor(235, 235, 235);
        doc.roundedRect(x + 1, currentY + 1, contactWidth, 28, 4, 4, 'F');
        
        doc.setFillColor(...colors.white);
        doc.roundedRect(x, currentY, contactWidth, 28, 4, 4, 'F');
        doc.setDrawColor(...contact.color);
        doc.setLineWidth(1);
        doc.roundedRect(x, currentY, contactWidth, 28, 4, 4, 'S');
        
        // 아이콘 영역
        doc.setFillColor(...contact.color);
        doc.circle(x + contactWidth/2, currentY + 8, 4, 'F');
        
        // 텍스트
        doc.setTextColor(...colors.dark);
        doc.setFontSize(8);
        doc.setFont("helvetica", "bold");
        doc.text(contact.title, x + contactWidth/2, currentY + 15, { align: 'center' });
        
        doc.setTextColor(...contact.color);
        doc.setFontSize(7);
        doc.setFont("helvetica", "bold");
        doc.text(contact.value, x + contactWidth/2, currentY + 20, { align: 'center' });
        
        doc.setTextColor(...colors.light);
        doc.setFontSize(6);
        doc.setFont("helvetica", "normal");
        doc.text(contact.hours, x + contactWidth/2, currentY + 24, { align: 'center' });
      });
      
      currentY += 38;

      // 중요 안내사항
      doc.setFillColor(254, 242, 242);
      doc.roundedRect(margin, currentY, contentWidth, 24, 4, 4, 'F');
      doc.setDrawColor(248, 113, 113);
      doc.setLineWidth(1);
      doc.roundedRect(margin, currentY, contentWidth, 24, 4, 4, 'S');
      
      doc.setTextColor(185, 28, 28);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("IMPORTANT NOTICE", margin + 8, currentY + 8);
      
      doc.setTextColor(...colors.light);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      const notices = [
        "• This receipt is not an official visa approval document.",
        "• Processing status will be updated via email and SMS in real-time.",
        "• Please submit additional documents immediately if requested."
      ];
      
      notices.forEach((notice, index) => {
        doc.text(notice, margin + 8, currentY + 13 + (index * 4));
      });
      
      currentY += 30;

      // 푸터
      doc.setDrawColor(...colors.border);
      doc.setLineWidth(0.5);
      doc.line(margin, currentY, pageWidth - margin, currentY);
      
      currentY += 6;
      doc.setTextColor(...colors.light);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text("Vietnam Visa 24 - Professional Vietnam Visa Service", pageWidth / 2, currentY, { align: 'center' });
      doc.text(`Generated: ${new Date().toLocaleString('en-US')}`, pageWidth / 2, currentY + 5, { align: 'center' });
      doc.text("This document is automatically generated. Please keep it safe for future reference.", pageWidth / 2, currentY + 10, { align: 'center' });

      // === 페이지 2: 부가서비스 안내 ===
      doc.addPage();
      currentY = 0;

      // 페이지 2 헤더
      drawGradientHeader();
      
      doc.setTextColor(...colors.white);
      doc.setFontSize(24);
      doc.setFont("helvetica", "bold");
      doc.text("ADDITIONAL SERVICES", pageWidth / 2, 18, { align: 'center' });
      
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.text("부가 서비스 안내", pageWidth / 2, 26, { align: 'center' });
      
      doc.setFontSize(9);
      doc.text("Discover our comprehensive additional services for your Vietnam journey", pageWidth / 2, 36, { align: 'center' });

      currentY = 60;

      // 부가서비스 데이터
      const additionalServices = [
        {
          title: "Airport Pickup Service",
          koreanTitle: "공항 픽업 서비스",
          description: "Safe and comfortable transportation with transparent pricing for the start and end of your journey.",
          features: [
            "• 24/7 Airport pickup service",
            "• Professional drivers and safe vehicles",
            "• Transparent pricing (pre-disclosed)",
            "• Real-time location tracking"
          ],
          color: colors.success,
          lightColor: colors.successLight
        },
        {
          title: "Overstay Resolution",
          koreanTitle: "오버스테이 해결 서비스",
          description: "Expert assistance to safely resolve complex visa issues with professional guidance.",
          features: [
            "• Overstay fine processing",
            "• Exit permit procedure assistance",
            "• Legal consultation services",
            "• Quick problem resolution"
          ],
          color: [239, 68, 68],
          lightColor: [252, 165, 165]
        },
        {
          title: "Moc Bai Border Service",
          koreanTitle: "목바이 국경 서비스",
          description: "Efficient and safe processing of complex visa run procedures at the border.",
          features: [
            "• Border crossing procedure guidance",
            "• Complete visa run process assistance",
            "• Safe transportation provided",
            "• Same-day round trip service"
          ],
          color: colors.accent,
          lightColor: colors.accentLight
        },
        {
          title: "Airport Fast Track",
          koreanTitle: "공항 패스트트랙 서비스",
          description: "Save time and reduce stress with expedited airport procedures and VIP treatment.",
          features: [
            "• Priority immigration processing",
            "• Fast baggage handling",
            "• VIP lounge access",
            "• Dedicated staff assistance"
          ],
          color: colors.primary,
          lightColor: colors.primaryLight
        }
      ];

      // 서비스 카드 그리기
      additionalServices.forEach((service, index) => {
        // 서비스 헤더 (그라데이션)
        for (let i = 0; i < 18; i++) {
          const ratio = i / 18;
          const r = service.color[0] + (service.lightColor[0] - service.color[0]) * ratio;
          const g = service.color[1] + (service.lightColor[1] - service.color[1]) * ratio;
          const b = service.color[2] + (service.lightColor[2] - service.color[2]) * ratio;
          
          doc.setFillColor(Math.round(r), Math.round(g), Math.round(b));
          doc.roundedRect(margin, currentY + i, contentWidth, 1, 5, 5, 'F');
        }
        
        // 헤더 텍스트
        doc.setTextColor(...colors.white);
        doc.setFontSize(15);
        doc.setFont("helvetica", "bold");
        doc.text(service.title, margin + 10, currentY + 8);
        
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(service.koreanTitle, margin + 10, currentY + 14);
        
        currentY += 22;
        
        // 서비스 내용 박스
        const contentHeight = 38;
        
        // 그림자 효과
        doc.setFillColor(240, 240, 240);
        doc.roundedRect(margin + 1, currentY + 1, contentWidth, contentHeight, 4, 4, 'F');
        
        doc.setFillColor(...colors.white);
        doc.roundedRect(margin, currentY, contentWidth, contentHeight, 4, 4, 'F');
        doc.setDrawColor(...service.color);
        doc.setLineWidth(1);
        doc.roundedRect(margin, currentY, contentWidth, contentHeight, 4, 4, 'S');
        
        // 설명
        doc.setTextColor(...colors.dark);
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(service.description, margin + 10, currentY + 10);
        
        // 특징 리스트
        doc.setFontSize(9);
        service.features.forEach((feature, featureIndex) => {
          doc.text(feature, margin + 10, currentY + 18 + (featureIndex * 5));
        });
        
        currentY += contentHeight + 12;
      });

      // 페이지 2 푸터
      currentY = pageHeight - 25;
      doc.setDrawColor(...colors.border);
      doc.setLineWidth(0.5);
      doc.line(margin, currentY, pageWidth - margin, currentY);
      
      currentY += 8;
      doc.setTextColor(...colors.light);
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text("Additional Services Inquiry: 1588-1234 | support@vietnamvisa24.com", pageWidth / 2, currentY, { align: 'center' });
      doc.text("Vietnam Visa 24 - For your comfortable Vietnam journey", pageWidth / 2, currentY + 6, { align: 'center' });

      return doc;
    } catch (error) {
      console.error('PDF 생성 중 오류 발생:', error);
      throw new Error('PDF 생성에 실패했습니다. 다시 시도해주세요.');
    }
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
      const fileName = `Vietnam_Visa_Receipt_${applicationId}_${safeDate}.pdf`;
      
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
        const fileName = `Vietnam_Visa_Receipt_${applicationId}_${new Date().toLocaleDateString('en-US').replace(/\//g, '')}.pdf`;
        
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
