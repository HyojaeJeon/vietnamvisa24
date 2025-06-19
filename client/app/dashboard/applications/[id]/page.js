
"use client";

import React, { useState, useRef } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useRouter, useParams } from "next/navigation";
import { GET_APPLICATION } from "../../../src/lib/graphql/query/applications";
import { UPDATE_STATUS_MUTATION, SEND_NOTIFICATION_EMAIL_MUTATION, UPDATE_APPLICATION_MUTATION } from "../../../src/lib/graphql/mutation/applications";
import { Card, CardContent, CardHeader, CardTitle } from "../../../src/components/ui/card";
import { Button } from "../../../src/components/ui/button";
import { Badge } from "../../../src/components/ui/badge";
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  FileText, 
  Download, 
  Eye, 
  Clock, 
  CreditCard, 
  Globe, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  RefreshCw,
  Edit,
  Save,
  X,
  Plane,
  Building,
  DollarSign,
  Activity,
  FileCheck,
  Send,
  ExternalLink,
  ZoomIn
} from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// 이미지 미리보기 모달 컴포넌트
const ImagePreviewModal = ({ isOpen, onClose, imageSrc, fileName }) => {
  const [isLoading, setIsLoading] = useState(true);

  if (!isOpen) return null;

  const downloadImage = () => {
    try {
      const base64Data = imageSrc.split(",")[1];
      const mimeType = imageSrc.split(";")[0].split(":")[1];

      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: mimeType });

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75" onClick={onClose}>
      <div className="relative max-w-4xl max-h-[90vh] m-4" onClick={e => e.stopPropagation()}>
        <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-semibold text-gray-900 truncate">{fileName}</h3>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={downloadImage}>
                <Download className="w-4 h-4 mr-2" />
                다운로드
              </Button>
              <Button variant="outline" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="relative">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-8 h-8 border-b-2 border-blue-600 rounded-full animate-spin"></div>
                  <p className="text-sm text-gray-600">이미지 로딩 중...</p>
                </div>
              </div>
            )}
            <img
              src={imageSrc}
              alt={fileName}
              className="max-w-full max-h-[70vh] object-contain"
              onLoad={() => setIsLoading(false)}
              onError={() => setIsLoading(false)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ApplicationDetailPage() {
  const router = useRouter();
  const params = useParams();
  const applicationId = params?.id;
  const printRef = useRef();

  // 편집 모드 상태
  const [isEditing, setIsEditing] = useState(false);
  const [editableData, setEditableData] = useState({});

  // 이미지 미리보기 모달 상태
  const [previewImage, setPreviewImage] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // PDF 생성 상태
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // 비자 종류 한글 매핑
  const getVisaTypeLabel = (visaType) => {
    const visaTypeMapping = {
      'e-visa_general': 'E-VISA 일반',
      'e-visa_urgent': 'E-VISA 긴급',
      'e-visa_express': 'E-VISA 특급',
      'tourist_visa': '관광 비자',
      'business_visa': '상용 비자',
      'transit_visa': '경유 비자'
    };
    return visaTypeMapping[visaType] || visaType;
  };

  // 입국공항 매핑
  const getAirportLabel = (airportCode) => {
    const airportMapping = {
      'UIH': '푸꿕(UIH)',
      'ICN': '인천(ICN)',
      'SGN': '탄손냣(SGN)',
      'HAN': '노이바이(HAN)',
      'DAD': '다낭(DAD)',
      'CXR': '캄란(CXR)',
      'VCA': '껀터(VCA)',
      'HPH': '깟비(HPH)',
      'DLI': '달랏(DLI)',
      'PQC': '푸꾸옥(PQC)'
    };
    return airportMapping[airportCode] || `${airportCode}`;
  };

  // 문서 타입 한글 매핑
  const getDocumentTypeLabel = (type) => {
    const typeMapping = {
      'passport': '여권',
      'photo': '증명사진',
      'visa': '비자',
      'ticket': '항공권',
      'hotel': '숙박예약증',
      'invitation': '초청장',
      'insurance': '보험증서'
    };
    return typeMapping[type] || type;
  };

  // GraphQL 뮤테이션
  const [updateStatus, { loading: updatingStatus }] = useMutation(UPDATE_STATUS_MUTATION, {
    refetchQueries: [{ query: GET_APPLICATION, variables: { id: applicationId } }],
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

  const [updateApplication, { loading: updatingApplication }] = useMutation(UPDATE_APPLICATION_MUTATION, {
    refetchQueries: [{ query: GET_APPLICATION, variables: { id: applicationId } }],
    onCompleted: () => {
      alert("신청서 정보가 성공적으로 업데이트되었습니다.");
      setIsEditing(false);
    },
    onError: (error) => {
      alert(`신청서 업데이트 실패: ${error.message}`);
    },
  });

  // 신청서 상세 정보 조회
  const { data, loading, error } = useQuery(GET_APPLICATION, {
    variables: { id: applicationId },
    skip: !applicationId,
    errorPolicy: "all",
    onCompleted: (data) => {
      if (data?.application) {
        setEditableData({
          personalInfo: { ...data.application.personalInfo },
          travelInfo: { ...data.application.travelInfo },
          processingType: data.application.processingType,
          totalPrice: data.application.totalPrice,
        });
      }
    },
  });

  const application = data?.application;

  // PDF 생성 함수 (apply 페이지와 동일한 방식)
  const generateApplicationPDF = async () => {
    if (!application) return;

    setIsGeneratingPDF(true);

    try {
      const element = printRef.current;

      if (!element) {
        throw new Error("PDF 생성 요소를 찾을 수 없습니다.");
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        scrollX: 0,
        scrollY: 0,
      });

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgData = canvas.toDataURL("image/png");
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

      const fileName = `${application.applicationId || `application_${applicationId}`}_${new Date().toISOString().split("T")[0]}.pdf`;
      pdf.save(fileName);

      alert(`PDF가 성공적으로 생성되었습니다: ${fileName}`);
    } catch (error) {
      console.error("PDF 생성 오류:", error);
      alert(`PDF 생성 실패: ${error.message}`);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // 로딩 상태
  if (loading) {
    return (
      <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-12 h-12 border-b-2 border-blue-600 rounded-full animate-spin"></div>
              <p className="text-gray-600">신청서 정보를 불러오는 중...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error || !application) {
    return (
      <div className="min-h-screen p-6 bg-gradient-to-br from-red-50 via-white to-pink-50">
        <div className="max-w-7xl mx-auto">
          <Card className="border-red-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <XCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
              <h2 className="mb-2 text-xl font-semibold text-gray-900">신청서를 찾을 수 없습니다</h2>
              <p className="mb-4 text-gray-600">{error?.message || "요청하신 신청서가 존재하지 않거나 접근 권한이 없습니다."}</p>
              <Button onClick={() => router.back()} variant="outline" className="shadow-sm">
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
      PENDING: { 
        color: "bg-yellow-100 text-yellow-800 border-yellow-200", 
        icon: Clock, 
        label: "처리 대기" 
      },
      PROCESSING: { 
        color: "bg-blue-100 text-blue-800 border-blue-200", 
        icon: RefreshCw, 
        label: "처리중" 
      },
      DOCUMENT_REVIEW: { 
        color: "bg-purple-100 text-purple-800 border-purple-200", 
        icon: FileText, 
        label: "서류검토" 
      },
      SUBMITTED_TO_AUTHORITY: { 
        color: "bg-orange-100 text-orange-800 border-orange-200", 
        icon: Building, 
        label: "기관제출" 
      },
      APPROVED: { 
        color: "bg-green-100 text-green-800 border-green-200", 
        icon: CheckCircle, 
        label: "승인완료" 
      },
      REJECTED: { 
        color: "bg-red-100 text-red-800 border-red-200", 
        icon: XCircle, 
        label: "승인거부" 
      },
      COMPLETED: { 
        color: "bg-emerald-100 text-emerald-800 border-emerald-200", 
        icon: FileCheck, 
        label: "처리완료" 
      },
    };

    const config = statusConfig[status] || statusConfig.PENDING;
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} border px-3 py-1 flex items-center gap-2 font-medium`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  // 이미지 미리보기 열기
  const openImagePreview = (imageData, fileName) => {
    setPreviewImage({ src: imageData, title: fileName });
    setIsPreviewOpen(true);
  };

  // 상태 업데이트 핸들러
  const handleStatusUpdate = (newStatus) => {
    if (confirm(`상태를 '${getStatusBadge(newStatus).props.children[1]}'로 변경하시겠습니까?`)) {
      updateStatus({
        variables: {
          id: applicationId,
          status: newStatus,
        },
      });
    }
  };

  // 이메일 발송 핸들러
  const handleSendEmail = (emailType) => {
    const customMessage = prompt("추가 메시지를 입력하세요 (선택사항):", "");
    
    sendEmail({
      variables: {
        applicationId: applicationId,
        emailType: emailType,
        customMessage: customMessage || undefined,
      },
    });
  };

  // 편집 저장 핸들러
  const handleSaveEdit = () => {
    if (confirm("변경사항을 저장하시겠습니까?")) {
      updateApplication({
        variables: {
          id: applicationId,
          input: {
            personalInfo: editableData.personalInfo,
            travelInfo: editableData.travelInfo,
            processingType: editableData.processingType,
            totalPrice: editableData.totalPrice,
          },
        },
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* 헤더 섹션 */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                onClick={() => router.back()} 
                className="flex items-center gap-2 shadow-sm hover:shadow-md transition-shadow"
              >
                <ArrowLeft className="w-4 h-4" />
                목록으로
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-1">신청서 상세관리</h1>
                <p className="text-gray-600 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  신청서 ID: <span className="font-medium text-blue-600">{application.applicationId}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {getStatusBadge(application.status)}
              <Button
                variant={isEditing ? "destructive" : "outline"}
                onClick={() => isEditing ? setIsEditing(false) : setIsEditing(true)}
                className="shadow-sm"
              >
                {isEditing ? <X className="w-4 h-4 mr-2" /> : <Edit className="w-4 h-4 mr-2" />}
                {isEditing ? "취소" : "편집"}
              </Button>
              {isEditing && (
                <Button onClick={handleSaveEdit} className="shadow-sm" disabled={updatingApplication}>
                  {updatingApplication ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  {updatingApplication ? "저장중..." : "저장"}
                </Button>
              )}
            </div>
          </div>

          {/* 빠른 액션 버튼들 */}
          <div className="flex flex-wrap gap-3">
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleStatusUpdate('PROCESSING')}
                disabled={updatingStatus}
                className="hover:bg-blue-50"
              >
                {updatingStatus ? <RefreshCw className="w-3 h-3 mr-1 animate-spin" /> : <Clock className="w-3 h-3 mr-1" />}
                처리중으로 변경
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleStatusUpdate('APPROVED')}
                disabled={updatingStatus}
                className="hover:bg-green-50"
              >
                <CheckCircle className="w-3 h-3 mr-1" />
                승인 처리
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleStatusUpdate('COMPLETED')}
                disabled={updatingStatus}
                className="hover:bg-emerald-50"
              >
                <FileCheck className="w-3 h-3 mr-1" />
                완료 처리
              </Button>
            </div>
            <div className="h-6 w-px bg-gray-300"></div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleSendEmail('STATUS_UPDATE')}
                disabled={sendingEmail}
                className="hover:bg-purple-50"
              >
                {sendingEmail ? <RefreshCw className="w-3 h-3 mr-1 animate-spin" /> : <Send className="w-3 h-3 mr-1" />}
                상태 알림
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleSendEmail('DOCUMENT_REQUEST')}
                disabled={sendingEmail}
                className="hover:bg-orange-50"
              >
                <FileText className="w-3 h-3 mr-1" />
                서류 요청
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={generateApplicationPDF}
                disabled={isGeneratingPDF}
                className="hover:bg-gray-50"
              >
                {isGeneratingPDF ? <RefreshCw className="w-3 h-3 mr-1 animate-spin" /> : <Download className="w-3 h-3 mr-1" />}
                PDF 다운로드
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* 메인 정보 영역 */}
          <div className="xl:col-span-3 space-y-6">
            {/* 개인정보 카드 */}
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3">
                  <User className="w-5 h-5" />
                  개인정보
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500 block mb-1">성명</label>
                      {isEditing ? (
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            value={editableData.personalInfo?.firstName || ''}
                            onChange={(e) => setEditableData({
                              ...editableData,
                              personalInfo: { ...editableData.personalInfo, firstName: e.target.value }
                            })}
                            className="flex-1 p-2 border border-gray-300 rounded-md"
                            placeholder="이름"
                          />
                          <input
                            type="text"
                            value={editableData.personalInfo?.lastName || ''}
                            onChange={(e) => setEditableData({
                              ...editableData,
                              personalInfo: { ...editableData.personalInfo, lastName: e.target.value }
                            })}
                            className="flex-1 p-2 border border-gray-300 rounded-md"
                            placeholder="성"
                          />
                        </div>
                      ) : (
                        <p className="font-semibold text-gray-900 text-lg">
                          {application.personalInfo?.firstName} {application.personalInfo?.lastName}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 block mb-1">이메일</label>
                      {isEditing ? (
                        <input
                          type="email"
                          value={editableData.personalInfo?.email || ''}
                          onChange={(e) => setEditableData({
                            ...editableData,
                            personalInfo: { ...editableData.personalInfo, email: e.target.value }
                          })}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      ) : (
                        <p className="flex items-center gap-2 text-gray-900">
                          <Mail className="w-4 h-4 text-blue-500" />
                          {application.personalInfo?.email}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500 block mb-1">전화번호</label>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={editableData.personalInfo?.phone || ''}
                          onChange={(e) => setEditableData({
                            ...editableData,
                            personalInfo: { ...editableData.personalInfo, phone: e.target.value }
                          })}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      ) : (
                        <p className="flex items-center gap-2 text-gray-900">
                          <Phone className="w-4 h-4 text-green-500" />
                          {application.personalInfo?.phone}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 block mb-1">주소</label>
                      {isEditing ? (
                        <textarea
                          value={editableData.personalInfo?.address || ''}
                          onChange={(e) => setEditableData({
                            ...editableData,
                            personalInfo: { ...editableData.personalInfo, address: e.target.value }
                          })}
                          className="w-full p-2 border border-gray-300 rounded-md"
                          rows="2"
                        />
                      ) : (
                        <p className="flex items-start gap-2 text-gray-900">
                          <MapPin className="w-4 h-4 text-red-500 mt-0.5" />
                          {application.personalInfo?.address}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                {application.personalInfo?.phoneOfFriend && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <label className="text-sm font-medium text-gray-500 block mb-1">지인 연락처</label>
                    <p className="flex items-center gap-2 text-gray-900">
                      <Phone className="w-4 h-4 text-purple-500" />
                      {application.personalInfo.phoneOfFriend}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 여행정보 카드 */}
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3">
                  <Plane className="w-5 h-5" />
                  여행정보
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-500 block mb-1">비자 종류</label>
                    <p className="font-semibold text-gray-900 bg-gray-50 p-3 rounded-lg">
                      {getVisaTypeLabel(application.travelInfo?.visaType)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 block mb-1">처리 방식</label>
                    <p className="font-semibold text-gray-900 bg-gray-50 p-3 rounded-lg">
                      {application.processingType}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 block mb-1">입국일</label>
                    <p className="flex items-center gap-2 text-gray-900">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      {application.travelInfo?.entryDate}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 block mb-1">입국공항</label>
                    <p className="flex items-center gap-2 text-gray-900">
                      <MapPin className="w-4 h-4 text-green-500" />
                      {getAirportLabel(application.travelInfo?.entryPort)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 추가 서비스 */}
            {application.additionalServices && application.additionalServices.length > 0 && (
              <Card className="shadow-lg border-0 bg-white">
                <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5" />
                    추가 서비스
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {application.additionalServices.map((service, index) => (
                      <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-purple-50 border border-purple-200">
                        <span className="font-medium text-purple-900">{service.name}</span>
                        <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                          추가 서비스
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 제출 서류 */}
            {application.documents && application.documents.length > 0 && (
              <Card className="shadow-lg border-0 bg-white">
                <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-3">
                    <FileText className="w-5 h-5" />
                    제출 서류
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {application.documents.map((document, index) => (
                      <div key={index} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow bg-gray-50">
                        {/* 문서 헤더 */}
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-1 text-lg">
                              {getDocumentTypeLabel(document.type)} / {document.type.toUpperCase()}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {document.fileName} • {(document.fileSize / 1024).toFixed(1)}KB • {document.fileType}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              업로드: {new Date(parseInt(document.uploadedAt)).toLocaleString('ko-KR')}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            {document.fileData && (
                              <>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  onClick={() => openImagePreview(document.fileData, document.fileName)}
                                  className="hover:bg-blue-50"
                                >
                                  <ZoomIn className="w-3 h-3 mr-1" />
                                  미리보기
                                </Button>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* 이미지 섹션 */}
                          <div>
                            <h5 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                              <Eye className="w-4 h-4" />
                              문서 이미지 / Document Image
                            </h5>
                            {document.fileData ? (
                              <div className="space-y-3">
                                <img
                                  src={document.fileData}
                                  alt={document.fileName}
                                  className="w-full h-48 object-cover rounded-lg border cursor-pointer hover:opacity-80 transition-opacity shadow-sm"
                                  onClick={() => openImagePreview(document.fileData, document.fileName)}
                                />
                                <div className="flex gap-2">
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    onClick={() => openImagePreview(document.fileData, document.fileName)}
                                    className="flex-1 hover:bg-blue-50"
                                  >
                                    <Eye className="w-3 h-3 mr-1" />
                                    확대보기
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <div className="w-full h-48 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                                <p className="text-gray-500">이미지 없음</p>
                              </div>
                            )}
                          </div>

                          {/* 추출된 정보 섹션 */}
                          <div>
                            <h5 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                              <Activity className="w-4 h-4" />
                              추출된 정보 / Extracted Information
                            </h5>
                            {document.extractedInfo ? (
                              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
                                <div className="grid grid-cols-1 gap-3 text-sm">
                                  {Object.entries(document.extractedInfo).map(
                                    ([key, value]) =>
                                      value && key !== '__typename' && (
                                        <div key={key} className="bg-white rounded p-2 border border-blue-100">
                                          <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                              <span className="font-medium text-blue-700 block text-xs mb-1">
                                                {getKoreanFieldName(key)} / {key.replace(/([A-Z])/g, ' $1').trim()}
                                              </span>
                                              <span className="text-blue-900 font-medium">{value}</span>
                                            </div>
                                          </div>
                                        </div>
                                      )
                                  )}
                                </div>
                              </div>
                            ) : (
                              <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                                <p className="text-gray-500 text-sm">추출된 정보가 없습니다</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* 사이드바 정보 */}
          <div className="space-y-6">
            {/* 처리 현황 */}
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3">
                  <Activity className="w-5 h-5" />
                  처리 현황
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-1">신청일</label>
                  <p className="text-gray-900 font-medium">
                    {new Date(application.createdAt).toLocaleDateString("ko-KR", {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-2">현재 상태</label>
                  {getStatusBadge(application.status)}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-1">총 금액</label>
                  <p className="text-2xl font-bold text-green-600 flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    {application.totalPrice?.toLocaleString()}원
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* 상태 변경 */}
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader>
                <CardTitle className="text-lg">상태 관리</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-3">
                {[
                  { status: 'PENDING', label: '처리 대기', color: 'bg-yellow-500' },
                  { status: 'PROCESSING', label: '처리중', color: 'bg-blue-500' },
                  { status: 'DOCUMENT_REVIEW', label: '서류검토', color: 'bg-purple-500' },
                  { status: 'SUBMITTED_TO_AUTHORITY', label: '기관제출', color: 'bg-orange-500' },
                  { status: 'APPROVED', label: '승인완료', color: 'bg-green-500' },
                  { status: 'COMPLETED', label: '처리완료', color: 'bg-emerald-500' },
                ].map((item) => (
                  <Button
                    key={item.status}
                    variant={application.status === item.status ? "default" : "outline"}
                    className={`w-full justify-start ${application.status === item.status ? item.color : ''}`}
                    onClick={() => handleStatusUpdate(item.status)}
                    disabled={updatingStatus || application.status === item.status}
                  >
                    {updatingStatus ? (
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <div className={`w-3 h-3 rounded-full mr-2 ${item.color}`}></div>
                    )}
                    {item.label}
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* 이메일 발송 */}
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader>
                <CardTitle className="text-lg">이메일 발송</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start hover:bg-blue-50"
                  onClick={() => handleSendEmail('STATUS_UPDATE')}
                  disabled={sendingEmail}
                >
                  {sendingEmail ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 mr-2" />
                  )}
                  상태 업데이트 알림
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start hover:bg-orange-50"
                  onClick={() => handleSendEmail('DOCUMENT_REQUEST')}
                  disabled={sendingEmail}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  추가 서류 요청
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start hover:bg-green-50"
                  onClick={() => handleSendEmail('APPROVAL_NOTICE')}
                  disabled={sendingEmail}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  승인 완료 알림
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* PDF 생성용 숨겨진 엘리먼트 */}
        <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
          <div ref={printRef} style={{ width: '794px', padding: '40px', backgroundColor: 'white' }}>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}>비자 신청서</h1>
              <p style={{ fontSize: '16px', color: '#666' }}>신청서 ID: {application.applicationId}</p>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px', borderBottom: '2px solid #333', paddingBottom: '5px' }}>개인정보</h2>
              <p><strong>성명:</strong> {application.personalInfo?.firstName} {application.personalInfo?.lastName}</p>
              <p><strong>이메일:</strong> {application.personalInfo?.email}</p>
              <p><strong>전화번호:</strong> {application.personalInfo?.phone}</p>
              <p><strong>주소:</strong> {application.personalInfo?.address}</p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px', borderBottom: '2px solid #333', paddingBottom: '5px' }}>여행정보</h2>
              <p><strong>비자 종류:</strong> {getVisaTypeLabel(application.travelInfo?.visaType)}</p>
              <p><strong>입국일:</strong> {application.travelInfo?.entryDate}</p>
              <p><strong>입국공항:</strong> {getAirportLabel(application.travelInfo?.entryPort)}</p>
              <p><strong>처리 방식:</strong> {application.processingType}</p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px', borderBottom: '2px solid #333', paddingBottom: '5px' }}>처리 현황</h2>
              <p><strong>상태:</strong> {getStatusBadge(application.status).props.children[1]}</p>
              <p><strong>신청일:</strong> {new Date(application.createdAt).toLocaleDateString("ko-KR")}</p>
              <p><strong>총 금액:</strong> {application.totalPrice?.toLocaleString()}원</p>
            </div>
          </div>
        </div>
      </div>

      {/* 이미지 미리보기 모달 */}
      <ImagePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        imageSrc={previewImage?.src}
        fileName={previewImage?.title}
      />
    </div>
  );
}

// 필드명 한글 매핑 함수
function getKoreanFieldName(fieldName) {
  const fieldMapping = {
    type: '여권종류',
    issuingCountry: '발급국가',
    passportNo: '여권번호',
    surname: '성',
    givenNames: '이름',
    dateOfBirth: '생년월일',
    dateOfIssue: '발급일',
    dateOfExpiry: '만료일',
    sex: '성별',
    nationality: '국적',
    personalNo: '개인번호',
    authority: '발급기관',
    koreanName: '한글명'
  };
  return fieldMapping[fieldName] || fieldName;
}
