
"use client";

import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
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

      // 파일명 생성
      const safeDate = new Date().toLocaleDateString('ko-KR').replace(/[.\s]/g, '');
      const fileName = `베트남비자_접수증_${applicationId}_${safeDate}.pdf`;
      
      // PDF 저장
      pdf.save(fileName);
      
      console.log('PDF 다운로드 완료:', fileName);
      
    } catch (error) {
      console.error('PDF 생성 오류:', error);
      alert(`PDF 생성 중 오류가 발생했습니다: ${error.message || '알 수 없는 오류'}`);
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

      await downloadReceipt();
      
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
      {/* 숨겨진 접수증 컴포넌트 */}
      <div 
        ref={receiptRef} 
        style={{ 
          display: 'none',
          width: '210mm',
          minHeight: '297mm',
          backgroundColor: '#ffffff',
          fontFamily: "'Noto Sans KR', 'Malgun Gothic', '맑은 고딕', 'Apple SD Gothic Neo', sans-serif",
          padding: '20mm',
          boxSizing: 'border-box'
        }}
      >
        {/* 헤더 섹션 */}
        <div style={{ 
          background: 'linear-gradient(135deg, #4F8FFF 0%, #2563EB 100%)',
          padding: '30px',
          borderRadius: '12px',
          color: 'white',
          textAlign: 'center',
          marginBottom: '30px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* 장식 요소 */}
          <div style={{
            position: 'absolute',
            top: '-20px',
            right: '-20px',
            width: '80px',
            height: '80px',
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderRadius: '50%'
          }}></div>
          <div style={{
            position: 'absolute',
            bottom: '-30px',
            left: '-30px',
            width: '100px',
            height: '100px',
            backgroundColor: 'rgba(255,255,255,0.05)',
            borderRadius: '50%'
          }}></div>
          
          <h1 style={{ 
            fontSize: '32px', 
            fontWeight: 'bold', 
            margin: '0 0 8px 0',
            letterSpacing: '1px'
          }}>
            VIETNAM VISA 24
          </h1>
          <p style={{ 
            fontSize: '14px', 
            margin: '0 0 15px 0',
            opacity: '0.9'
          }}>
            Professional Visa Service
          </p>
          <div style={{
            width: '60px',
            height: '2px',
            backgroundColor: 'rgba(255,255,255,0.6)',
            margin: '0 auto 15px auto'
          }}></div>
          <p style={{ 
            fontSize: '11px', 
            margin: '0',
            opacity: '0.8'
          }}>
            www.vietnamvisa24.com | 전문 베트남 비자 서비스
          </p>
        </div>

        {/* 메인 타이틀 */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ 
            fontSize: '28px', 
            fontWeight: 'bold', 
            color: '#1F2937',
            margin: '0 0 8px 0'
          }}>
            비자 신청 접수증
          </h2>
          <p style={{ 
            fontSize: '16px', 
            color: '#6B7280',
            margin: '0 0 6px 0'
          }}>
            VISA APPLICATION RECEIPT
          </p>
          <p style={{ 
            fontSize: '14px', 
            color: '#9CA3AF',
            margin: '0'
          }}>
            비자 신청이 정상 접수되었습니다
          </p>
        </div>

        {/* 접수 정보 박스 */}
        <div style={{
          backgroundColor: '#F8FAFC',
          border: '2px solid #E2E8F0',
          borderRadius: '12px',
          padding: '25px',
          marginBottom: '35px'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '15px'
          }}>
            <div>
              <p style={{ 
                fontSize: '14px', 
                color: '#4B5563',
                margin: '0 0 5px 0',
                fontWeight: '600'
              }}>
                접수일시
              </p>
              <p style={{ 
                fontSize: '16px', 
                color: '#1F2937',
                margin: '0',
                fontWeight: 'bold'
              }}>
                {new Date().toLocaleDateString('ko-KR')} {new Date().toLocaleTimeString('ko-KR')}
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ 
                fontSize: '14px', 
                color: '#4B5563',
                margin: '0 0 5px 0',
                fontWeight: '600'
              }}>
                신청번호
              </p>
              <p style={{ 
                fontSize: '20px', 
                color: '#2563EB',
                margin: '0',
                fontWeight: 'bold',
                letterSpacing: '1px'
              }}>
                {applicationId}
              </p>
            </div>
          </div>
          <div style={{
            height: '1px',
            backgroundColor: '#E5E7EB',
            margin: '15px 0'
          }}></div>
          <p style={{ 
            fontSize: '12px', 
            color: '#6B7280',
            margin: '0',
            textAlign: 'center'
          }}>
            Receipt Date & Time | Application Number
          </p>
        </div>

        {/* 신청자 정보 섹션 */}
        <div style={{ marginBottom: '30px' }}>
          <div style={{
            backgroundColor: '#2563EB',
            color: 'white',
            padding: '15px 20px',
            borderRadius: '8px 8px 0 0',
            fontSize: '16px',
            fontWeight: 'bold'
          }}>
            <span>신청자 정보</span>
            <span style={{ fontSize: '12px', fontWeight: 'normal', marginLeft: '10px' }}>
              APPLICANT INFORMATION
            </span>
          </div>
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '2px solid #E5E7EB',
            borderTop: 'none',
            borderRadius: '0 0 8px 8px',
            padding: '25px'
          }}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '20px 40px',
              fontSize: '14px'
            }}>
              <div>
                <span style={{ color: '#6B7280', fontWeight: '600' }}>신청자명:</span>
                <span style={{ marginLeft: '10px', color: '#1F2937', fontWeight: 'bold' }}>
                  {formData.personalInfo?.firstName} {formData.personalInfo?.lastName}
                </span>
              </div>
              <div>
                <span style={{ color: '#6B7280', fontWeight: '600' }}>여권번호:</span>
                <span style={{ marginLeft: '10px', color: '#1F2937', fontWeight: 'bold' }}>
                  {formData.personalInfo?.passportNumber || "정보 없음"}
                </span>
              </div>
              <div>
                <span style={{ color: '#6B7280', fontWeight: '600' }}>국적:</span>
                <span style={{ marginLeft: '10px', color: '#1F2937', fontWeight: 'bold' }}>
                  대한민국
                </span>
              </div>
              <div>
                <span style={{ color: '#6B7280', fontWeight: '600' }}>생년월일:</span>
                <span style={{ marginLeft: '10px', color: '#1F2937', fontWeight: 'bold' }}>
                  {formData.personalInfo?.dateOfBirth || "정보 없음"}
                </span>
              </div>
              <div>
                <span style={{ color: '#6B7280', fontWeight: '600' }}>이메일:</span>
                <span style={{ marginLeft: '10px', color: '#1F2937', fontWeight: 'bold' }}>
                  {formData.personalInfo?.email || "정보 없음"}
                </span>
              </div>
              <div>
                <span style={{ color: '#6B7280', fontWeight: '600' }}>연락처:</span>
                <span style={{ marginLeft: '10px', color: '#1F2937', fontWeight: 'bold' }}>
                  {formData.personalInfo?.phone || "정보 없음"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 비자 정보 섹션 */}
        <div style={{ marginBottom: '30px' }}>
          <div style={{
            backgroundColor: '#059669',
            color: 'white',
            padding: '15px 20px',
            borderRadius: '8px 8px 0 0',
            fontSize: '16px',
            fontWeight: 'bold'
          }}>
            <span>비자 정보</span>
            <span style={{ fontSize: '12px', fontWeight: 'normal', marginLeft: '10px' }}>
              VISA INFORMATION
            </span>
          </div>
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '2px solid #E5E7EB',
            borderTop: 'none',
            borderRadius: '0 0 8px 8px',
            padding: '25px'
          }}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '20px 40px',
              fontSize: '14px'
            }}>
              <div>
                <span style={{ color: '#6B7280', fontWeight: '600' }}>비자유형:</span>
                <span style={{ marginLeft: '10px', color: '#1F2937', fontWeight: 'bold' }}>
                  {formData.visaType || "E-VISA"}
                </span>
              </div>
              <div>
                <span style={{ color: '#6B7280', fontWeight: '600' }}>처리유형:</span>
                <span style={{ marginLeft: '10px', color: '#1F2937', fontWeight: 'bold' }}>
                  {formData.processingType === "fast" ? "긴급 처리" : "일반 처리"}
                </span>
              </div>
              <div>
                <span style={{ color: '#6B7280', fontWeight: '600' }}>입국예정일:</span>
                <span style={{ marginLeft: '10px', color: '#1F2937', fontWeight: 'bold' }}>
                  {formData.travelInfo?.entryDate || "미정"}
                </span>
              </div>
              <div>
                <span style={{ color: '#6B7280', fontWeight: '600' }}>완료예정:</span>
                <span style={{ marginLeft: '10px', color: '#1F2937', fontWeight: 'bold' }}>
                  {formData.processingType === "fast" ? "24시간 이내" : "2-3 영업일"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 결제 정보 */}
        <div style={{
          backgroundColor: '#F0FDF4',
          border: '2px solid #10B981',
          borderRadius: '12px',
          padding: '25px',
          textAlign: 'center',
          marginBottom: '35px'
        }}>
          <h3 style={{ 
            fontSize: '18px', 
            color: '#059669',
            margin: '0 0 10px 0',
            fontWeight: 'bold'
          }}>
            결제 정보 | PAYMENT INFORMATION
          </h3>
          <p style={{ 
            fontSize: '24px', 
            color: '#059669',
            margin: '0',
            fontWeight: 'bold'
          }}>
            총 결제금액: ₩25,000
          </p>
        </div>

        {/* 고객지원 정보 */}
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ 
            fontSize: '18px', 
            color: '#1F2937',
            margin: '0 0 20px 0',
            fontWeight: 'bold',
            textAlign: 'center'
          }}>
            고객 지원 | CUSTOMER SUPPORT
          </h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr 1fr', 
            gap: '15px'
          }}>
            <div style={{
              backgroundColor: '#FEF2F2',
              border: '2px solid #F87171',
              borderRadius: '8px',
              padding: '20px',
              textAlign: 'center'
            }}>
              <h4 style={{ 
                fontSize: '14px', 
                color: '#DC2626',
                margin: '0 0 8px 0',
                fontWeight: 'bold'
              }}>
                전화 문의
              </h4>
              <p style={{ 
                fontSize: '16px', 
                color: '#DC2626',
                margin: '0 0 5px 0',
                fontWeight: 'bold'
              }}>
                1588-1234
              </p>
              <p style={{ 
                fontSize: '12px', 
                color: '#6B7280',
                margin: '0'
              }}>
                평일 09:00-18:00
              </p>
            </div>
            <div style={{
              backgroundColor: '#F0FDF4',
              border: '2px solid #10B981',
              borderRadius: '8px',
              padding: '20px',
              textAlign: 'center'
            }}>
              <h4 style={{ 
                fontSize: '14px', 
                color: '#059669',
                margin: '0 0 8px 0',
                fontWeight: 'bold'
              }}>
                카카오톡
              </h4>
              <p style={{ 
                fontSize: '16px', 
                color: '#059669',
                margin: '0 0 5px 0',
                fontWeight: 'bold'
              }}>
                @vietnamvisa24
              </p>
              <p style={{ 
                fontSize: '12px', 
                color: '#6B7280',
                margin: '0'
              }}>
                24시간 상담
              </p>
            </div>
            <div style={{
              backgroundColor: '#FDF4FF',
              border: '2px solid #A855F7',
              borderRadius: '8px',
              padding: '20px',
              textAlign: 'center'
            }}>
              <h4 style={{ 
                fontSize: '14px', 
                color: '#7C3AED',
                margin: '0 0 8px 0',
                fontWeight: 'bold'
              }}>
                이메일
              </h4>
              <p style={{ 
                fontSize: '13px', 
                color: '#7C3AED',
                margin: '0 0 5px 0',
                fontWeight: 'bold'
              }}>
                support@vietnamvisa24.com
              </p>
              <p style={{ 
                fontSize: '12px', 
                color: '#6B7280',
                margin: '0'
              }}>
                24시간 접수
              </p>
            </div>
          </div>
        </div>

        {/* 중요 안내사항 */}
        <div style={{
          backgroundColor: '#FEF2F2',
          border: '2px solid #F87171',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '30px'
        }}>
          <h4 style={{ 
            fontSize: '16px', 
            color: '#DC2626',
            margin: '0 0 15px 0',
            fontWeight: 'bold'
          }}>
            중요 안내사항
          </h4>
          <ul style={{ 
            fontSize: '13px', 
            color: '#6B7280',
            margin: '0',
            paddingLeft: '20px',
            lineHeight: '1.6'
          }}>
            <li style={{ marginBottom: '8px' }}>본 접수증은 공식 비자 승인서가 아닙니다.</li>
            <li style={{ marginBottom: '8px' }}>처리 상황은 실시간으로 이메일과 SMS로 안내됩니다.</li>
            <li style={{ marginBottom: '8px' }}>추가 서류 요청 시 즉시 제출해주세요.</li>
            <li>문의사항이 있으시면 언제든지 고객지원팀에 연락주세요.</li>
          </ul>
        </div>

        {/* 푸터 */}
        <div style={{
          borderTop: '1px solid #E5E7EB',
          paddingTop: '20px',
          textAlign: 'center'
        }}>
          <p style={{ 
            fontSize: '12px', 
            color: '#9CA3AF',
            margin: '0 0 5px 0'
          }}>
            Vietnam Visa 24 - 전문 베트남 비자 서비스
          </p>
          <p style={{ 
            fontSize: '11px', 
            color: '#9CA3AF',
            margin: '0 0 5px 0'
          }}>
            발급일시: {new Date().toLocaleString('ko-KR')}
          </p>
          <p style={{ 
            fontSize: '11px', 
            color: '#9CA3AF',
            margin: '0'
          }}>
            이 문서는 자동으로 생성되었습니다. 향후 참조를 위해 안전하게 보관하세요.
          </p>
        </div>
      </div>

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
