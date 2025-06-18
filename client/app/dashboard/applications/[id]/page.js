"use client";

import React, { useState, useRef } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useRouter, useParams } from "next/navigation";
import { GET_APPLICATION } from "../../../src/lib/graphql/query/applications";
import { UPDATE_STATUS_MUTATION, SEND_NOTIFICATION_EMAIL_MUTATION } from "../../../src/lib/graphql/mutation/applications";
import { Card, CardContent, CardHeader, CardTitle } from "../../../src/components/ui/card";
import { Button } from "../../../src/components/ui/button";
import { Badge } from "../../../src/components/ui/badge";
import { ArrowLeft, User, Mail, Phone, Calendar, MapPin, FileText, Download, Eye, Clock, CreditCard, Globe, CheckCircle, AlertTriangle, XCircle, RefreshCw } from "lucide-react";
import ImagePreviewModal from "../../../../src/components/ui/ImagePreviewModal";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function ApplicationDetailPage() {
  const router = useRouter();
  const params = useParams();
  const applicationId = params?.id;
  const printRef = useRef();

  // 이미지 미리보기 모달 상태
  const [previewImage, setPreviewImage] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // PDF 생성 상태
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // GraphQL 뮤테이션
  const [updateStatus, { loading: updatingStatus }] = useMutation(UPDATE_STATUS_MUTATION, {
    refetch: [{ query: GET_APPLICATION, variables: { id: applicationId } }],
    onCompleted: () => {
      alert("상태가 성공적으로 업데이트되었습니다.");
    },
    onError: (error) => {
      alert(`상태 업데이트 실패: ${error.message}`);
    },
  });
  const [sendEmail, { loading: sendingEmail }] = useMutation(SEND_NOTIFICATION_EMAIL_MUTATION, {
    onCompleted: (data) => {
      alert(`이메일이 성공적으로 발송되었습니다: ${data.sendNotificationEmail.recipientEmail}`);
    },
    onError: (error) => {
      alert(`이메일 발송 실패: ${error.message}`);
    },
  });

  // PDF 생성 함수 (클라이언트 측)
  const generateApplicationPDF = async () => {
    if (!application) return;

    setIsGeneratingPDF(true);

    try {
      // PDF에 포함될 콘텐츠 요소
      const element = printRef.current;

      if (!element) {
        throw new Error("PDF 생성 요소를 찾을 수 없습니다.");
      }

      // html2canvas 옵션
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        scrollX: 0,
        scrollY: 0,
      });

      // jsPDF 인스턴스 생성
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // 캔버스 이미지를 PDF에 추가
      const imgData = canvas.toDataURL("image/png");
      const imgWidth = 210; // A4 가로 크기 (mm)
      const pageHeight = 295; // A4 세로 크기 (mm)
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      // 이미지가 페이지보다 길면 여러 페이지에 나누어 출력
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // PDF 파일명 생성
      const fileName = `${application.applicationNumber || `application_${applicationId}`}_${new Date().toISOString().split("T")[0]}.pdf`;

      // PDF 다운로드
      pdf.save(fileName);

      alert(`PDF가 성공적으로 생성되었습니다: ${fileName}`);
    } catch (error) {
      console.error("PDF 생성 오류:", error);
      alert(`PDF 생성 실패: ${error.message}`);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // 신청서 상세 정보 조회
  const { data, loading, error } = useQuery(GET_APPLICATION, {
    variables: { id: applicationId },
    skip: !applicationId,
    errorPolicy: "all",
  });

  const application = data?.application;

  // 로딩 상태
  if (loading) {
    return (
      <div className="min-h-screen p-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-b-2 border-blue-600 rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error || !application) {
    return (
      <div className="min-h-screen p-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <Card className="border-red-200">
            <CardContent className="p-8 text-center">
              <XCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
              <h2 className="mb-2 text-xl font-semibold text-gray-900">신청서를 찾을 수 없습니다</h2>
              <p className="mb-4 text-gray-600">{error?.message || "요청하신 신청서가 존재하지 않거나 접근 권한이 없습니다."}</p>
              <Button onClick={() => router.back()} variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                이전 페이지로
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // 상태별 스타일 및 아이콘
  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: { color: "bg-yellow-100 text-yellow-800", icon: Clock, label: "대기중" },
      PROCESSING: { color: "bg-blue-100 text-blue-800", icon: Clock, label: "처리중" },
      DOCUMENT_REVIEW: { color: "bg-purple-100 text-purple-800", icon: FileText, label: "서류검토" },
      SUBMITTED_TO_AUTHORITY: { color: "bg-orange-100 text-orange-800", icon: Globe, label: "기관제출" },
      APPROVED: { color: "bg-green-100 text-green-800", icon: CheckCircle, label: "승인" },
      REJECTED: { color: "bg-red-100 text-red-800", icon: XCircle, label: "거절" },
      COMPLETED: { color: "bg-green-100 text-green-800", icon: CheckCircle, label: "완료" },
    };

    const config = statusConfig[status] || statusConfig.PENDING;
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  // 이미지 다운로드 함수
  const downloadImage = async (imageData, fileName) => {
    try {
      // Base64 데이터에서 실제 데이터 부분 추출
      const base64Data = imageData.split(",")[1];
      const mimeType = imageData.split(";")[0].split(":")[1];

      // Base64를 Blob으로 변환
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: mimeType });

      // 다운로드 링크 생성 및 클릭
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName || "document.jpg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("이미지 다운로드 실패:", error);
      alert("이미지 다운로드에 실패했습니다.");
    }
  };
  // 이미지 미리보기 열기
  const openImagePreview = (imageData, fileName) => {
    setPreviewImage({ src: imageData, title: fileName });
    setIsPreviewOpen(true);
  };

  // 빠른 작업 핸들러들
  const handleStatusUpdate = () => {
    const statusOptions = [
      { value: "PENDING", label: "대기중" },
      { value: "PROCESSING", label: "처리중" },
      { value: "DOCUMENT_REVIEW", label: "서류검토" },
      { value: "SUBMITTED_TO_AUTHORITY", label: "기관제출" },
      { value: "APPROVED", label: "승인" },
      { value: "REJECTED", label: "거절" },
      { value: "COMPLETED", label: "완료" },
    ];

    const selectedStatus = prompt(`현재 상태: ${application.status}\n\n새로운 상태를 선택하세요:\n` + statusOptions.map((opt, idx) => `${idx + 1}. ${opt.label}`).join("\n"), "1");

    if (selectedStatus && !isNaN(selectedStatus)) {
      const statusIndex = parseInt(selectedStatus) - 1;
      if (statusIndex >= 0 && statusIndex < statusOptions.length) {
        updateStatus({
          variables: {
            id: applicationId,
            status: statusOptions[statusIndex].value,
          },
        });
      }
    }
  };

  const handleSendEmail = () => {
    const emailOptions = [
      { value: "STATUS_UPDATE", label: "상태 업데이트 알림" },
      { value: "DOCUMENT_REQUEST", label: "추가 서류 요청" },
      { value: "APPROVAL_NOTICE", label: "승인 알림" },
    ];

    const selectedEmailType = prompt("이메일 타입을 선택하세요:\n" + emailOptions.map((opt, idx) => `${idx + 1}. ${opt.label}`).join("\n"), "1");

    if (selectedEmailType && !isNaN(selectedEmailType)) {
      const emailIndex = parseInt(selectedEmailType) - 1;
      if (emailIndex >= 0 && emailIndex < emailOptions.length) {
        const customMessage = prompt("추가 메시지를 입력하세요 (선택사항):", "");

        sendEmail({
          variables: {
            applicationId: applicationId,
            emailType: emailOptions[emailIndex].value,
            customMessage: customMessage || undefined,
          },
        });
      }
    }
  };
  const handleGeneratePDF = () => {
    generateApplicationPDF();
  };
  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-6xl mx-auto space-y-6" ref={printRef}>
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => router.back()} className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              목록으로
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">신청서 상세정보</h1>
              <p className="text-gray-600">신청서 ID: {application.applicationId}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">{getStatusBadge(application.status)}</div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* 왼쪽 컬럼 - 기본 정보 */}
          <div className="space-y-6 lg:col-span-2">
            {/* 개인정보 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  개인정보
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-gray-500">성명</label>
                    <p className="font-medium text-gray-900">
                      {application.personalInfo?.firstName} {application.personalInfo?.lastName}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">이메일</label>
                    <p className="flex items-center gap-2 text-gray-900">
                      <Mail className="w-4 h-4 text-gray-400" />
                      {application.personalInfo?.email}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">전화번호</label>
                    <p className="flex items-center gap-2 text-gray-900">
                      <Phone className="w-4 h-4 text-gray-400" />
                      {application.personalInfo?.phone}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">주소</label>
                    <p className="flex items-center gap-2 text-gray-900">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      {application.personalInfo?.address}
                    </p>
                  </div>
                  {application.personalInfo?.phoneOfFriend && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">지인 연락처</label>
                      <p className="flex items-center gap-2 text-gray-900">
                        <Phone className="w-4 h-4 text-gray-400" />
                        {application.personalInfo.phoneOfFriend}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 여행정보 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-green-600" />
                  여행정보
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-gray-500">비자 종류</label>
                    <p className="font-medium text-gray-900">{application.travelInfo?.visaType}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">입국일</label>
                    <p className="flex items-center gap-2 text-gray-900">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {application.travelInfo?.entryDate}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">입국공항</label>
                    <p className="flex items-center gap-2 text-gray-900">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      {application.travelInfo?.entryPort}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">처리 방식</label>
                    <p className="text-gray-900">{application.processingType}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 추가 서비스 */}
            {application.additionalServices && application.additionalServices.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-purple-600" />
                    추가 서비스
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {application.additionalServices.map((service, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                        <span className="font-medium">{service.name}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 서류 목록 */}
            {application.documents && application.documents.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-orange-600" />
                    제출 서류
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {application.documents.map((document, index) => (
                      <div key={index} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-medium text-gray-900">{document.fileName}</h4>
                            <p className="text-sm text-gray-500">
                              {document.type} • {(document.fileSize / 1024).toFixed(1)}KB
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            {document.fileData && (
                              <>
                                <Button size="sm" variant="outline" onClick={() => openImagePreview(document.fileData, document.fileName)} className="flex items-center gap-1">
                                  <Eye className="w-4 h-4" />
                                  미리보기
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => downloadImage(document.fileData, document.fileName)} className="flex items-center gap-1">
                                  <Download className="w-4 h-4" />
                                  다운로드
                                </Button>
                              </>
                            )}
                          </div>
                        </div>

                        {/* OCR 추출 정보 */}
                        {document.extractedInfo && (
                          <div className="p-3 mt-3 rounded-md bg-blue-50">
                            <h5 className="mb-2 font-medium text-blue-900">추출된 정보</h5>
                            <div className="grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
                              {Object.entries(document.extractedInfo).map(
                                ([key, value]) =>
                                  value && (
                                    <div key={key} className="flex justify-between">
                                      <span className="font-medium text-blue-700">{key}:</span>
                                      <span className="text-blue-800">{value}</span>
                                    </div>
                                  )
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* 오른쪽 컬럼 - 요약 정보 */}
          <div className="space-y-6">
            {/* 처리 현황 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  처리 현황
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">신청일</label>
                  <p className="text-gray-900">{new Date(application.createdAt).toLocaleDateString("ko-KR")}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">현재 상태</label>
                  <div className="mt-1">{getStatusBadge(application.status)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">총 금액</label>
                  <p className="text-2xl font-bold text-green-600">{application.totalPrice?.toLocaleString()}원</p>
                </div>
              </CardContent>
            </Card>{" "}
            {/* 빠른 작업 */}
            <Card>
              <CardHeader>
                <CardTitle>빠른 작업</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full" variant="outline" onClick={() => handleStatusUpdate()} disabled={updatingStatus}>
                  {updatingStatus ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <FileText className="w-4 h-4 mr-2" />}
                  상태 업데이트
                </Button>
                <Button className="w-full" variant="outline" onClick={() => handleSendEmail()} disabled={sendingEmail}>
                  {sendingEmail ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Mail className="w-4 h-4 mr-2" />}
                  이메일 발송
                </Button>{" "}
                <Button className="w-full" variant="outline" onClick={() => handleGeneratePDF()} disabled={isGeneratingPDF}>
                  {isGeneratingPDF ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
                  PDF 다운로드
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>{" "}
      {/* 이미지 미리보기 모달 */}
      <ImagePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        imageSrc={previewImage?.src}
        fileName={previewImage?.title}
        onDownload={() => previewImage && downloadImage(previewImage.src, previewImage.title)}
      />
    </div>
  );
}
