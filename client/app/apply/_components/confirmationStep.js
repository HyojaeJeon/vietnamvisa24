
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

      // UTF-8 인코딩 설정으로 한글 지원
      doc.setFont("helvetica", "normal");
      doc.setLanguage("ko-KR");

      // 브랜드 색상 정의
      const brandBlue = [67, 133, 245];      // 메인 블루
      const lightBlue = [219, 234, 254];     // 연한 블루
      const coral = [255, 127, 80];          // 코랄 (여행정보)
      const purple = [147, 51, 234];         // 보라 (처리정보)
      const teal = [20, 184, 166];           // 틸 (결제정보)
      const slate = [71, 85, 105];           // 슬레이트 (고객지원)
      const darkText = [31, 41, 55];
      const lightText = [107, 114, 128];
      const whiteText = [255, 255, 255];

      // 페이지 설정
      const margin = 12;
      const pageWidth = 210;
      const pageHeight = 297;
      const contentWidth = pageWidth - (margin * 2);
      let currentY = 0;

      // === 페이지 1: 접수증 ===
      // === 메인 헤더 (그라데이션 배경) ===
      doc.setFillColor(79, 143, 255);
      doc.rect(0, 0, pageWidth, 40, 'F');

      // 헤더 장식 요소 (원형)
      doc.setFillColor(245, 245, 245);
      doc.circle(pageWidth - 15, 12, 15, 'F');
      doc.circle(20, 30, 8, 'F');

      // 회사 로고 및 브랜드명
      doc.setTextColor(...whiteText);
      doc.setFontSize(24);
      doc.setFont("helvetica", "bold");
      doc.text("VIETNAM VISA 24", pageWidth / 2, 15, { align: 'center' });
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("Professional Visa Service", pageWidth / 2, 22, { align: 'center' });
      
      // 장식 라인
      doc.setDrawColor(...whiteText);
      doc.setLineWidth(0.5);
      doc.line(pageWidth / 2 - 30, 26, pageWidth / 2 + 30, 26);
      
      doc.setFontSize(8);
      doc.text("www.vietnamvisa24.com", pageWidth / 2, 31, { align: 'center' });
      doc.text("전문 베트남 비자 서비스", pageWidth / 2, 36, { align: 'center' });

      currentY = 50;

      // === 메인 타이틀 ===
      doc.setTextColor(...darkText);
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.text("비자 신청 접수증", pageWidth / 2, currentY, { align: 'center' });
      
      doc.setFontSize(12);
      doc.setTextColor(...lightText);
      doc.text("VISA APPLICATION RECEIPT", pageWidth / 2, currentY + 6, { align: 'center' });
      
      doc.setFontSize(9);
      doc.text("비자 신청이 정상 접수되었습니다", pageWidth / 2, currentY + 12, { align: 'center' });
      
      currentY += 22;

      // === 접수 정보 박스 ===
      doc.setFillColor(249, 250, 251);
      doc.roundedRect(margin, currentY, contentWidth, 15, 3, 3, 'F');
      doc.setDrawColor(...brandBlue);
      doc.setLineWidth(1);
      doc.roundedRect(margin, currentY, contentWidth, 15, 3, 3, 'S');
      
      // 접수 정보
      doc.setTextColor(...darkText);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      const receiptDate = new Date().toLocaleDateString('ko-KR');
      const receiptTime = new Date().toLocaleTimeString('ko-KR');
      doc.text(`접수일시: ${receiptDate} ${receiptTime}`, margin + 5, currentY + 6);
      
      doc.setTextColor(...brandBlue);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text(`신청번호: ${applicationId}`, pageWidth - margin - 5, currentY + 6, { align: 'right' });
      
      doc.setTextColor(...lightText);
      doc.setFontSize(7);
      doc.text("Receipt Date & Time", margin + 5, currentY + 10);
      doc.text("Application Number", pageWidth - margin - 5, currentY + 10, { align: 'right' });
      
      currentY += 25;

      // === 간소화된 섹션 그리기 함수 ===
      const drawCompactSection = (koreanTitle, englishTitle, bgColor, data, startY) => {
        let y = startY;
        
        // 섹션 헤더
        doc.setFillColor(...bgColor);
        doc.roundedRect(margin, y, contentWidth, 12, 3, 3, 'F');
        
        // 헤더 텍스트
        doc.setTextColor(...whiteText);
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text(koreanTitle, margin + 6, y + 5);
        
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.text(englishTitle, margin + 6, y + 9);
        
        y += 15;
        
        // 데이터 영역 계산 (간소화)
        const rowHeight = 8;
        const dataHeight = Math.ceil(data.length / 2) * rowHeight + 10;
        
        // 메인 데이터 박스
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(margin, y, contentWidth, dataHeight, 2, 2, 'F');
        doc.setDrawColor(230, 230, 230);
        doc.setLineWidth(0.3);
        doc.roundedRect(margin, y, contentWidth, dataHeight, 2, 2, 'S');
        
        // 데이터 내용 배치 (2열)
        const colWidth = contentWidth / 2;
        let row = 0;
        
        data.forEach((item, index) => {
          const col = index % 2;
          if (col === 0 && index > 0) row++;
          
          const x = margin + 8 + (col * colWidth);
          const yPos = y + 6 + (row * rowHeight);
          
          // 한글 레이블
          doc.setTextColor(...darkText);
          doc.setFontSize(8);
          doc.setFont("helvetica", "bold");
          doc.text(item.korean + ":", x, yPos);
          
          // 값
          doc.setTextColor(...darkText);
          doc.setFontSize(8);
          doc.setFont("helvetica", "normal");
          const valueX = x + 35;
          const displayValue = item.value || "정보 없음";
          // 긴 텍스트는 줄바꿈 처리
          const maxWidth = colWidth - 45;
          if (displayValue.length > 25) {
            const splitValue = displayValue.substring(0, 25) + "...";
            doc.text(splitValue, valueX, yPos);
          } else {
            doc.text(displayValue, valueX, yPos);
          }
        });
        
        return y + dataHeight + 8;
      };

      // === 신청자 정보 섹션 ===
      const applicantData = [
        {
          korean: "신청번호",
          value: applicationId
        },
        {
          korean: "비자유형",
          value: formData.visaType || "E-VISA"
        },
        {
          korean: "신청자명",
          value: `${formData.personalInfo?.firstName || ""} ${formData.personalInfo?.lastName || ""}`.trim()
        },
        {
          korean: "여권번호",
          value: formData.personalInfo?.passportNumber || "정보 없음"
        },
        {
          korean: "국적",
          value: "대한민국"
        },
        {
          korean: "생년월일",
          value: formData.personalInfo?.dateOfBirth || "정보 없음"
        },
        {
          korean: "이메일",
          value: formData.personalInfo?.email || "정보 없음"
        },
        {
          korean: "연락처",
          value: formData.personalInfo?.phone || "정보 없음"
        }
      ];

      currentY = drawCompactSection("신청자 정보", "APPLICANT INFORMATION", brandBlue, applicantData, currentY);

      // === 여행 정보 섹션 ===
      const travelData = [
        {
          korean: "입국예정일",
          value: formData.travelInfo?.entryDate || "미정"
        },
        {
          korean: "입국항구",
          value: formData.travelInfo?.entryPort || "하노이공항"
        },
        {
          korean: "여행목적",
          value: "관광"
        },
        {
          korean: "체류기간",
          value: "30일"
        }
      ];

      currentY = drawCompactSection("여행 정보", "TRAVEL INFORMATION", coral, travelData, currentY);

      // === 처리 정보 섹션 ===
      const processingData = [
        {
          korean: "처리유형",
          value: formData.processingType === "fast" ? "긴급 서비스" : "일반 서비스"
        },
        {
          korean: "완료예정",
          value: formData.processingType === "fast" ? "24시간 이내" : "2-3 영업일"
        },
        {
          korean: "처리상태",
          value: "접수완료"
        },
        {
          korean: "결제상태",
          value: "결제대기"
        }
      ];

      currentY = drawCompactSection("처리 정보", "PROCESSING INFORMATION", purple, processingData, currentY);

      // === 결제 정보 (특별 강조) ===
      doc.setFillColor(240, 253, 250);
      doc.roundedRect(margin, currentY, contentWidth, 20, 4, 4, 'F');
      doc.setDrawColor(...teal);
      doc.setLineWidth(1.5);
      doc.roundedRect(margin, currentY, contentWidth, 20, 4, 4, 'S');
      
      // 제목
      doc.setTextColor(...teal);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("결제 정보", margin + 8, currentY + 6);
      doc.setFontSize(8);
      doc.text("PAYMENT INFORMATION", margin + 8, currentY + 10);
      
      // 금액 (중앙 강조)
      doc.setTextColor(...teal);
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("총 결제금액: ₩25,000", pageWidth / 2, currentY + 14, { align: 'center' });
      
      currentY += 30;

      // === 고객지원 정보 ===
      doc.setTextColor(...darkText);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("고객 지원", margin, currentY);
      doc.setFontSize(8);
      doc.setTextColor(...lightText);
      doc.text("CUSTOMER SUPPORT", margin, currentY + 5);
      
      currentY += 12;
      
      // 연락처 카드들 (간소화)
      const contactWidth = (contentWidth - 8) / 3;
      const contacts = [
        {
          korean: "전화 문의",
          value: "1588-1234",
          hours: "평일 09:00-18:00",
          color: [59, 130, 246]
        },
        {
          korean: "카카오톡",
          value: "@vietnamvisa24",
          hours: "24시간 상담",
          color: [34, 197, 94]
        },
        {
          korean: "이메일",
          value: "support@vietnamvisa24.com",
          hours: "24시간 접수",
          color: [168, 85, 247]
        }
      ];
      
      contacts.forEach((contact, index) => {
        const x = margin + (index * (contactWidth + 4));
        
        // 카드 배경
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(x, currentY, contactWidth, 24, 3, 3, 'F');
        doc.setDrawColor(...contact.color);
        doc.setLineWidth(0.8);
        doc.roundedRect(x, currentY, contactWidth, 24, 3, 3, 'S');
        
        // 아이콘 영역
        doc.setFillColor(...contact.color);
        doc.circle(x + contactWidth/2, currentY + 7, 3, 'F');
        
        // 텍스트
        doc.setTextColor(...darkText);
        doc.setFontSize(7);
        doc.setFont("helvetica", "bold");
        doc.text(contact.korean, x + contactWidth/2, currentY + 13, { align: 'center' });
        
        doc.setTextColor(...contact.color);
        doc.setFontSize(6);
        doc.setFont("helvetica", "bold");
        doc.text(contact.value, x + contactWidth/2, currentY + 17, { align: 'center' });
        
        doc.setTextColor(...lightText);
        doc.setFontSize(5);
        doc.setFont("helvetica", "normal");
        doc.text(contact.hours, x + contactWidth/2, currentY + 21, { align: 'center' });
      });
      
      currentY += 34;

      // === 중요 안내사항 ===
      doc.setFillColor(254, 242, 242);
      doc.roundedRect(margin, currentY, contentWidth, 20, 3, 3, 'F');
      doc.setDrawColor(248, 113, 113);
      doc.setLineWidth(0.8);
      doc.roundedRect(margin, currentY, contentWidth, 20, 3, 3, 'S');
      
      doc.setTextColor(185, 28, 28);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text("중요 안내사항", margin + 6, currentY + 6);
      
      doc.setTextColor(107, 114, 128);
      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      const notices = [
        "• 본 접수증은 공식 비자 승인서가 아닙니다.",
        "• 처리 상황은 실시간으로 이메일과 SMS로 안내됩니다.",
        "• 추가 서류 요청 시 즉시 제출해주세요."
      ];
      
      notices.forEach((notice, index) => {
        doc.text(notice, margin + 6, currentY + 10 + (index * 3));
      });
      
      currentY += 25;

      // === 푸터 ===
      doc.setDrawColor(229, 231, 235);
      doc.setLineWidth(0.3);
      doc.line(margin, currentY, pageWidth - margin, currentY);
      
      currentY += 5;
      doc.setTextColor(...lightText);
      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      doc.text("Vietnam Visa 24 - 전문 베트남 비자 서비스", pageWidth / 2, currentY, { align: 'center' });
      doc.text(`발급일시: ${new Date().toLocaleString('ko-KR')}`, pageWidth / 2, currentY + 4, { align: 'center' });
      doc.text("이 문서는 자동으로 생성되었습니다. 향후 참조를 위해 안전하게 보관하세요.", pageWidth / 2, currentY + 8, { align: 'center' });

      // === 페이지 2: 부가서비스 안내 ===
      doc.addPage();
      currentY = 20;

      // 페이지 2 헤더
      doc.setFillColor(79, 143, 255);
      doc.rect(0, 0, pageWidth, 35, 'F');

      doc.setTextColor(...whiteText);
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.text("부가 서비스 안내", pageWidth / 2, 15, { align: 'center' });
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("ADDITIONAL SERVICES GUIDE", pageWidth / 2, 22, { align: 'center' });
      
      doc.setFontSize(8);
      doc.text("Vietnam Visa 24의 다양한 부가 서비스를 확인하세요", pageWidth / 2, 29, { align: 'center' });

      currentY = 50;

      // 부가서비스 데이터
      const additionalServices = [
        {
          title: "공항 픽업",
          englishTitle: "Airport Pickup Service",
          description: "투명한 요금제와 안전한 이동으로 여행의 시작과 끝을 편안하게 만듭니다.",
          features: [
            "• 24시간 공항 픽업 서비스",
            "• 전문 운전기사와 안전한 차량",
            "• 투명한 요금제 (사전 고지)",
            "• 실시간 위치 추적 서비스"
          ],
          color: [34, 197, 94]
        },
        {
          title: "오버스테이 해결",
          englishTitle: "Overstay Resolution",
          description: "전문가의 도움으로 복잡한 비자 문제를 안전하게 해결합니다.",
          features: [
            "• 오버스테이 벌금 처리",
            "• 출국 허가 절차 대행",
            "• 법적 문제 상담 서비스",
            "• 신속한 문제 해결"
          ],
          color: [239, 68, 68]
        },
        {
          title: "목바이 국경 서비스",
          englishTitle: "Moc Bai Border Service",
          description: "복잡한 비자런 과정을 효율적이고 안전하게 처리합니다.",
          features: [
            "• 국경 통과 절차 안내",
            "• 비자런 전 과정 대행",
            "• 안전한 교통편 제공",
            "• 당일 왕복 서비스"
          ],
          color: [168, 85, 247]
        },
        {
          title: "공항 패스트트랙",
          englishTitle: "Airport Fast Track",
          description: "신속한 공항 수속으로 시간 절약과 스트레스 해소를 도와드립니다.",
          features: [
            "• 우선 출입국 심사",
            "• 빠른 수하물 처리",
            "• VIP 라운지 이용",
            "• 전담 직원 안내"
          ],
          color: [59, 130, 246]
        }
      ];

      // 서비스 카드 그리기
      additionalServices.forEach((service, index) => {
        // 서비스 헤더
        doc.setFillColor(...service.color);
        doc.roundedRect(margin, currentY, contentWidth, 15, 4, 4, 'F');
        
        // 헤더 텍스트
        doc.setTextColor(...whiteText);
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text(service.title, margin + 8, currentY + 6);
        
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.text(service.englishTitle, margin + 8, currentY + 11);
        
        currentY += 18;
        
        // 서비스 내용 박스
        const contentHeight = 35;
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(margin, currentY, contentWidth, contentHeight, 3, 3, 'F');
        doc.setDrawColor(...service.color);
        doc.setLineWidth(1);
        doc.roundedRect(margin, currentY, contentWidth, contentHeight, 3, 3, 'S');
        
        // 설명
        doc.setTextColor(...darkText);
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.text(service.description, margin + 8, currentY + 8);
        
        // 특징 리스트
        doc.setFontSize(8);
        service.features.forEach((feature, featureIndex) => {
          doc.text(feature, margin + 8, currentY + 15 + (featureIndex * 4));
        });
        
        currentY += contentHeight + 10;
      });

      // 페이지 2 푸터
      currentY = pageHeight - 30;
      doc.setDrawColor(229, 231, 235);
      doc.setLineWidth(0.3);
      doc.line(margin, currentY, pageWidth - margin, currentY);
      
      currentY += 8;
      doc.setTextColor(...lightText);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text("부가서비스 문의: 1588-1234 | support@vietnamvisa24.com", pageWidth / 2, currentY, { align: 'center' });
      doc.text("Vietnam Visa 24 - 고객님의 편안한 베트남 여행을 위해", pageWidth / 2, currentY + 5, { align: 'center' });

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
