"use client";

import React, { useState, useRef } from "react";
import { useQuery, useMutation, useApolloClient } from "@apollo/client";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { GET_APPLICATION } from "../../../src/lib/graphql/query/applications";
import { UPDATE_STATUS_MUTATION, SEND_NOTIFICATION_EMAIL_MUTATION, UPDATE_APPLICATION_MUTATION } from "../../../src/lib/graphql/mutation/applications";
import { Card, CardContent, CardHeader, CardTitle } from "../../../src/components/ui/card";
import { Button } from "../../../src/components/ui/button";
import { Badge } from "../../../src/components/ui/badge";
import { getDocumentImageUrl } from "../../../src/utils/imageUtils";
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
  ZoomIn,
  Sparkles,
  Brain,
  Loader2,
  Upload,
  Users,
  Car,
} from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// 영어 필드명을 한국어로 변환하는 함수
const getKoreanFieldName = (fieldName) => {
  const fieldMap = {
    // 개인정보
    surname: "성",
    givenNames: "이름",
    fullName: "전체 이름",
    firstName: "이름",
    lastName: "성",
    middleName: "중간 이름",

    // 여권 정보
    passportNumber: "여권번호",
    passportType: "여권 종류",
    issuingCountry: "발급국가",
    nationality: "국적",
    dateOfBirth: "생년월일",
    birthDate: "생년월일",
    placeOfBirth: "출생지",
    sex: "성별",
    gender: "성별",
    issueDate: "발급일",
    expiryDate: "만료일",
    issuingAuthority: "발급기관",
    personalNumber: "개인번호",

    // 주소 및 연락처
    address: "주소",
    phoneNumber: "전화번호",
    email: "이메일",

    // 비자 관련
    purposeOfVisit: "방문목적",
    entryDate: "입국일",
    exitDate: "출국일",
    duration: "체류기간",

    // 기타
    mrz1: "MRZ 첫번째 줄",
    mrz2: "MRZ 두번째 줄",
    mrz3: "MRZ 세번째 줄",
    documentNumber: "문서번호",
    checkDigit: "검증번호",

    // 카멜케이스 변형들
    givenName: "이름",
    familyName: "성",
    dateOfIssue: "발급일",
    dateOfExpiry: "만료일",
    countryOfBirth: "출생국가",
    placeOfIssue: "발급지",
  };

  return fieldMap[fieldName] || fieldName;
};

// 이미지 미리보기 모달 컴포넌트
const ImagePreviewModal = ({ isOpen, onClose, imageSrc, fileName }) => {
  const [isLoading, setIsLoading] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75" onClick={onClose}>
      <div className="relative max-w-4xl max-h-[90vh] m-4" onClick={(e) => e.stopPropagation()}>
        <div className="overflow-hidden bg-white rounded-lg shadow-2xl">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-semibold text-gray-900 truncate">{fileName}</h3>
            <div className="flex items-center space-x-2">
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
            <img src={imageSrc} alt={fileName} className="max-w-full max-h-[70vh] object-contain" onLoad={() => setIsLoading(false)} onError={() => setIsLoading(false)} />
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
  const client = useApolloClient();

  // 편집 모드 상태
  const [isEditing, setIsEditing] = useState(false);
  const [editableData, setEditableData] = useState({});

  // 이미지 미리보기 모달 상태
  const [previewImage, setPreviewImage] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // PDF 생성 상태
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // AI 여권 정보 추출 상태
  const [isExtractingPassport, setIsExtractingPassport] = useState(false);
  const [extractedPassportInfo, setExtractedPassportInfo] = useState(null);
  const [showExtractedInfo, setShowExtractedInfo] = useState(false);

  // 이미지 업로드 상태
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);

  // 비자 종류 한글 매핑
  const getVisaTypeLabel = (visaType) => {
    const visaTypeMapping = {
      "e-visa_general": "E-VISA 일반",
      "e-visa_urgent": "E-VISA 긴급",
      "e-visa_express": "E-VISA 특급",
    };
    return visaTypeMapping[visaType] || visaType;
  };

  // 입국공항 매핑
  const getAirportLabel = (airportCode) => {
    const airportMapping = {
      UIH: "푸꿕(UIH)",
      ICN: "인천(ICN)",
      SGN: "탄손냣(SGN)",
      HAN: "노이바이(HAN)",
      DAD: "다낭(DAD)",
      CXR: "캄란(CXR)",
      VCA: "껀터(VCA)",
      HPH: "깟비(HPH)",
      DLI: "달랏(DLI)",
      PQC: "푸꾸옥(PQC)",
    };
    return airportMapping[airportCode] || `${airportCode}`;
  };

  // 문서 타입 한글 매핑
  const getDocumentTypeLabel = (type) => {
    const typeMapping = {
      passport: "여권",
      photo: "증명사진",
      visa: "비자",
      ticket: "항공권",
      hotel: "숙박예약증",
      invitation: "초청장",
      insurance: "보험증서",
    };
    return typeMapping[type] || type;
  };

  // 처리방식 한글 매핑
  const getProcessingTypeLabel = (type) => {
    const typeMapping = {
      일반: "일반 처리 (3-4일)",
      "2시간": "급행 2시간",
      "4시간": "급행 4시간",
      익일: "급행 1일",
      "1시간": "급행 1시간",
      "1일": "급행 1일",
      "2일": "급행 2일",
      "3~4일": "일반 처리 (3-4일)",
      standard: "일반 처리 (3-4일)",
      express: "급행 처리",
      urgent: "긴급 처리",
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
  const { data, loading, error, refetch } = useQuery(GET_APPLICATION, {
    variables: { id: applicationId },
    skip: !applicationId,
    errorPolicy: "all",
    onCompleted: (data) => {
      if (data?.application) {
        // __typename과 id 필드를 제거한 깨끗한 데이터 설정
        const cleanPersonalInfo = {
          firstName: data.application.personalInfo?.firstName || "",
          lastName: data.application.personalInfo?.lastName || "",
          fullName: data.application.personalInfo?.fullName || "",
          email: data.application.personalInfo?.email || "",
          phone: data.application.personalInfo?.phone || "",
          address: data.application.personalInfo?.address || "",
          phoneOfFriend: data.application.personalInfo?.phoneOfFriend || "",
        };

        const cleanTravelInfo = {
          entryDate: data.application.travelInfo?.entryDate || "",
          entryPort: data.application.travelInfo?.entryPort || "",
          visaType: data.application.travelInfo?.visaType || "",
        };

        // 여권 추출 정보 초기화 - Application 레벨과 Document 레벨 모두 확인
        const passportDocument = data.application.documents?.find((doc) => doc.type === "passport");
        const applicationExtractedInfo = data.application.extractedInfo;
        const documentExtractedInfo = passportDocument?.extractedInfo;

        // Application 레벨 우선, 없으면 Document 레벨 사용
        const extractedInfo = applicationExtractedInfo || documentExtractedInfo;

        const cleanExtractedInfo = extractedInfo
          ? {
              type: extractedInfo.type || "",
              issuingCountry: extractedInfo.issuingCountry || "",
              passportNo: extractedInfo.passportNo || "",
              surname: extractedInfo.surname || "",
              givenNames: extractedInfo.givenNames || "",
              dateOfBirth: extractedInfo.dateOfBirth || "",
              dateOfIssue: extractedInfo.dateOfIssue || "",
              dateOfExpiry: extractedInfo.dateOfExpiry || "",
              sex: extractedInfo.sex || "",
              nationality: extractedInfo.nationality || "",
              personalNo: extractedInfo.personalNo || "",
              authority: extractedInfo.authority || "",
              koreanName: extractedInfo.koreanName || "",
            }
          : {};

        setEditableData({
          personalInfo: cleanPersonalInfo,
          travelInfo: cleanTravelInfo,
          processingType: data.application.processingType,
          totalPrice: data.application.totalPrice,
          extractedInfo: cleanExtractedInfo,
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

  // 여권 정보 추출 API 함수 (서버에 저장된 이미지 사용)
  const extractPassportInfoFromUrl = async (imageUrl, applicationId) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_URL_DEV || "http://localhost:5002/api";
      const response = await fetch(`${apiUrl}/extract_passport/from-url`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageUrl: imageUrl,
          applicationId: applicationId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "여권 정보 추출에 실패했습니다");
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("여권 정보 추출 오류:", error);
      throw error;
    }
  };

  // 여권 정보 추출 핸들러 (수정됨)
  const handleExtractPassportInfo = async () => {
    const passportDocument = application?.documents?.find((doc) => doc.type === "passport");
    if (!passportDocument?.fileUrl) {
      alert("여권 이미지를 찾을 수 없습니다.");
      return;
    }

    setIsExtractingPassport(true);
    try {
      // 서버에 저장된 이미지 URL 직접 사용
      const imageUrl = passportDocument.fileUrl;
      console.log("📷 여권 이미지 URL:", imageUrl);

      // API 호출 시 applicationId도 함께 전달
      const result = await extractPassportInfoFromUrl(imageUrl, applicationId);

      // 응답에서 application 데이터와 extractedInfo 모두 처리
      if (result.application) {
        // 1. Apollo Client 캐시 업데이트 (자동으로 UI 업데이트됨)
        client.writeQuery({
          query: GET_APPLICATION,
          variables: { id: applicationId },
          data: { application: result.application },
        });

        // 2. 추출된 정보 모달 표시
        const extractedInfo = result.application.extractedInfo || result.application.documents.find((doc) => doc.type === "passport")?.extractedInfo;

        if (extractedInfo) {
          setExtractedPassportInfo(extractedInfo);
          setShowExtractedInfo(true);
        }

        console.log("✅ AI 추출 완료 및 UI 업데이트 완료 - 추가 API 호출 없음");
      }
    } catch (error) {
      console.error("여권 정보 추출 오류:", error);
      alert("여권 정보 추출에 실패했습니다: " + error.message);
    } finally {
      setIsExtractingPassport(false);
    }
  };

  // 이미지 파일 업로드 함수 (기존 이미지 교체)
  const handleImageUpload = async (file) => {
    if (!file) return;

    setIsUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("document", file);
      formData.append("type", "passport");

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_URL_DEV || "http://localhost:5002/api";
      const response = await fetch(`${apiUrl}/documents/update-image/${applicationId}`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "이미지 교체에 실패했습니다");
      }

      const result = await response.json();

      // GraphQL 쿼리를 다시 실행하여 UI를 업데이트
      await refetch();

      alert("이미지가 성공적으로 교체되었습니다!");
    } catch (error) {
      console.error("이미지 교체 오류:", error);
      alert("이미지 교체에 실패했습니다: " + error.message);
    } finally {
      setIsUploadingImage(false);
      setShowImageUpload(false);
    }
  };

  // 파일 선택 핸들러
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // 파일 크기 체크 (5MB 제한)
      if (file.size > 5 * 1024 * 1024) {
        alert("파일 크기는 5MB를 초과할 수 없습니다.");
        return;
      }

      // 파일 타입 체크
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        alert("JPEG, PNG, WEBP 형식의 이미지만 업로드 가능합니다.");
        return;
      }

      handleImageUpload(file);
    }
  };

  // 추출된 정보를 신청서에 적용
  // const applyExtractedInfo = async () => {
  //   if (!extractedPassportInfo) return;

  //   try {
  //     // 추출된 정보를 editableData에 적용
  //     const updatedPersonalInfo = {
  //       ...editableData.personalInfo,
  //       firstName: extractedPassportInfo.given_names || editableData.personalInfo.firstName,
  //       lastName: extractedPassportInfo.surname || editableData.personalInfo.lastName,
  //     };

  //     const updatedExtractedInfo = {
  //       type: extractedPassportInfo.type || "",
  //       issuingCountry: extractedPassportInfo.issuing_country || "",
  //       passportNo: extractedPassportInfo.passport_no || "",
  //       surname: extractedPassportInfo.surname || "",
  //       givenNames: extractedPassportInfo.given_names || "",
  //       dateOfBirth: extractedPassportInfo.date_of_birth || "",
  //       dateOfIssue: extractedPassportInfo.date_of_issue || "",
  //       dateOfExpiry: extractedPassportInfo.date_of_expiry || "",
  //       sex: extractedPassportInfo.sex || "",
  //       nationality: extractedPassportInfo.nationality || "",
  //       personalNo: extractedPassportInfo.personal_no || "",
  //       authority: extractedPassportInfo.authority || "",
  //       koreanName: extractedPassportInfo.korean_name || "",
  //     };

  //     setEditableData((prev) => ({
  //       ...prev,
  //       personalInfo: updatedPersonalInfo,
  //       extractedInfo: updatedExtractedInfo,
  //     }));

  //     // 데이터베이스에 즉시 저장
  //     await updateApplication({
  //       variables: {
  //         id: applicationId,
  //         input: {
  //           personalInfo: updatedPersonalInfo,
  //           extractedInfo: updatedExtractedInfo,
  //         },
  //       },
  //     });

  //     setShowExtractedInfo(false);
  //     setExtractedPassportInfo(null);

  //     alert("추출된 정보가 신청서에 적용되고 저장되었습니다.");
  //   } catch (error) {
  //     console.error("정보 적용 오류:", error);
  //     alert("정보 적용에 실패했습니다: " + error.message);
  //   }
  // };

  // 로딩 상태
  if (loading) {
    return (
      <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="mx-auto max-w-7xl">
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
        <div className="mx-auto max-w-7xl">
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
        label: "처리 대기",
      },
      PROCESSING: {
        color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: RefreshCw,
        label: "처리중",
      },
      DOCUMENT_REVIEW: {
        color: "bg-purple-100 text-purple-800 border-purple-200",
        icon: FileText,
        label: "서류검토",
      },
      SUBMITTED_TO_AUTHORITY: {
        color: "bg-orange-100 text-orange-800 border-orange-200",
        icon: Building,
        label: "기관제출",
      },
      APPROVED: {
        color: "bg-green-100 text-green-800 border-green-200",
        icon: CheckCircle,
        label: "승인완료",
      },
      REJECTED: {
        color: "bg-red-100 text-red-800 border-red-200",
        icon: XCircle,
        label: "승인거부",
      },
      COMPLETED: {
        color: "bg-emerald-100 text-emerald-800 border-emerald-200",
        icon: FileCheck,
        label: "처리완료",
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
      // 깨끗한 데이터만 전송 (__typename, id 제거)
      const cleanInput = {
        personalInfo: {
          firstName: editableData.personalInfo?.firstName || "",
          lastName: editableData.personalInfo?.lastName || "",
          fullName: editableData.personalInfo?.fullName || "",
          email: editableData.personalInfo?.email || "",
          phone: editableData.personalInfo?.phone || "",
          address: editableData.personalInfo?.address || "",
          phoneOfFriend: editableData.personalInfo?.phoneOfFriend || "",
        },
        travelInfo: {
          entryDate: editableData.travelInfo?.entryDate || "",
          entryPort: editableData.travelInfo?.entryPort || "",
          visaType: editableData.travelInfo?.visaType || "",
        },
        processingType: editableData.processingType,
        totalPrice: editableData.totalPrice,
      };

      // 추출된 정보가 있으면 포함
      if (editableData.extractedInfo && Object.keys(editableData.extractedInfo).length > 0) {
        cleanInput.extractedInfo = editableData.extractedInfo;
      }

      updateApplication({
        variables: {
          id: applicationId,
          input: cleanInput,
        },
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="p-6 mx-auto space-y-6 max-w-7xl">
        {/* 헤더 섹션 */}
        <div className="p-8 border border-blue-100 shadow-xl bg-gradient-to-r from-white via-blue-50 to-indigo-50 rounded-2xl backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-6">
              <Button
                variant="outline"
                onClick={() => router.back()}
                className="flex items-center gap-2 transition-all duration-300 border-blue-200 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl hover:border-blue-300 hover:bg-blue-50/50"
              >
                <ArrowLeft className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-blue-600">목록으로</span>
              </Button>
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-12 h-12 shadow-lg bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="mb-2 text-3xl font-bold text-transparent bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text">신청서 상세관리</h1>
                  <div className="flex items-center gap-3">
                    <div className="px-3 py-1 border border-blue-200 rounded-lg bg-white/70 backdrop-blur-sm">
                      <p className="flex items-center gap-2 text-sm text-gray-700">
                        <span className="text-gray-500">신청서 ID:</span>
                        <span className="font-bold text-blue-700">{application.applicationId}</span>
                      </p>
                    </div>
                    <div className="px-3 py-1 border border-blue-200 rounded-lg bg-white/70 backdrop-blur-sm">
                      <p className="flex items-center gap-2 text-sm text-gray-700">
                        <Clock className="w-3 h-3 text-gray-500" />
                        <span className="text-gray-500">신청일:</span>
                        <span className="font-medium text-gray-800">
                          {new Date(application.createdAt).toLocaleString("ko-KR", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          })}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="p-1 border border-blue-200 shadow-lg bg-white/80 backdrop-blur-sm rounded-xl">{getStatusBadge(application.status)}</div>
              <div className="flex items-center p-2 space-x-2 border border-blue-200 shadow-lg bg-white/80 backdrop-blur-sm rounded-xl">
                <Button
                  variant={isEditing ? "destructive" : "default"}
                  onClick={() => (isEditing ? setIsEditing(false) : setIsEditing(true))}
                  className={`shadow-sm transition-all duration-300 ${
                    isEditing ? "bg-red-500 hover:bg-red-600 text-white" : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
                  }`}
                >
                  {isEditing ? <X className="w-4 h-4 mr-2" /> : <Edit className="w-4 h-4 mr-2" />}
                  {isEditing ? "편집 취소" : "정보 편집"}
                </Button>
                {isEditing && (
                  <Button
                    onClick={handleSaveEdit}
                    className="text-white transition-all duration-300 shadow-sm bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                    disabled={updatingApplication}
                  >
                    {updatingApplication ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    {updatingApplication ? "저장중..." : "변경사항 저장"}
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* 빠른 액션 버튼들 */}
          <div className="flex flex-wrap gap-3">
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => handleStatusUpdate("PROCESSING")} disabled={updatingStatus} className="hover:bg-blue-50">
                {updatingStatus ? <RefreshCw className="w-3 h-3 mr-1 animate-spin" /> : <Clock className="w-3 h-3 mr-1" />}
                처리중으로 변경
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleStatusUpdate("APPROVED")} disabled={updatingStatus} className="hover:bg-green-50">
                <CheckCircle className="w-3 h-3 mr-1" />
                승인 처리
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleStatusUpdate("COMPLETED")} disabled={updatingStatus} className="hover:bg-emerald-50">
                <FileCheck className="w-3 h-3 mr-1" />
                완료 처리
              </Button>
            </div>
            <div className="w-px h-6 bg-gray-300"></div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => handleSendEmail("STATUS_UPDATE")} disabled={sendingEmail} className="hover:bg-purple-50">
                {sendingEmail ? <RefreshCw className="w-3 h-3 mr-1 animate-spin" /> : <Send className="w-3 h-3 mr-1" />}
                상태 알림
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleSendEmail("DOCUMENT_REQUEST")} disabled={sendingEmail} className="hover:bg-orange-50">
                <FileText className="w-3 h-3 mr-1" />
                서류 요청
              </Button>
              <Button size="sm" variant="outline" onClick={generateApplicationPDF} disabled={isGeneratingPDF} className="hover:bg-gray-50">
                {isGeneratingPDF ? <RefreshCw className="w-3 h-3 mr-1 animate-spin" /> : <Download className="w-3 h-3 mr-1" />}
                PDF 다운로드
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
          {/* 메인 정보 영역 */}
          <div className="space-y-6 xl:col-span-3">
            {/* 개인정보 카드 */}
            <Card className="bg-white border-0 shadow-lg">
              <CardHeader className="text-white rounded-t-lg bg-gradient-to-r from-blue-500 to-blue-600">
                <CardTitle className="flex items-center gap-3">
                  <User className="w-5 h-5" />
                  개인정보
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-6">
                    <div>
                      <label className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-600">
                        <User className="w-4 h-4" />
                        전체 이름 (여권상 표기)
                      </label>
                      {isEditing ? (
                        <div className="relative">
                          <input
                            type="text"
                            value={editableData.personalInfo?.fullName || ""}
                            onChange={(e) =>
                              setEditableData({
                                ...editableData,
                                personalInfo: { ...editableData.personalInfo, fullName: e.target.value },
                              })
                            }
                            className="w-full px-4 py-3 text-gray-900 placeholder-gray-400 transition-all duration-200 bg-white border border-gray-200 shadow-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:shadow-md"
                            placeholder="여권에 표기된 전체 이름 (예: HONG GILDONG)"
                          />
                        </div>
                      ) : (
                        <div className="p-4 border border-gray-100 bg-gray-50 rounded-xl">
                          <p className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            {`${application.documents[0]?.extractedInfo?.koreanName} (${application.documents[0]?.extractedInfo?.givenNames} ${application.documents[0]?.extractedInfo?.surname})` ||
                              application.personalInfo?.fullName}
                            {console.log("application.documents[0]?.extractedInfo?.koreanName :", application.documents[0]?.extractedInfo?.koreanName)}
                          </p>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-600">
                        <User className="w-4 h-4" />
                        성명 (분리)
                      </label>
                      {isEditing ? (
                        <div className="grid grid-cols-2 gap-3">
                          <div className="relative">
                            <input
                              type="text"
                              value={editableData.personalInfo?.fullName || ""}
                              onChange={(e) =>
                                setEditableData({
                                  ...editableData,
                                  personalInfo: { ...editableData.personalInfo, fullName: e.target.value },
                                })
                              }
                              className="w-full px-4 py-3 text-gray-900 placeholder-gray-400 transition-all duration-200 bg-white border border-gray-200 shadow-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:shadow-md"
                              placeholder="이름 (First Name)"
                            />
                          </div>
                          <div className="relative">
                            <input
                              type="text"
                              value={editableData.personalInfo?.lastName || ""}
                              onChange={(e) =>
                                setEditableData({
                                  ...editableData,
                                  personalInfo: { ...editableData.personalInfo, lastName: e.target.value },
                                })
                              }
                              className="w-full px-4 py-3 text-gray-900 placeholder-gray-400 transition-all duration-200 bg-white border border-gray-200 shadow-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:shadow-md"
                              placeholder="성 (Last Name)"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 border border-gray-100 bg-gray-50 rounded-xl">
                          <p className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            {application.personalInfo?.firstName} {application.personalInfo?.lastName}
                          </p>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-600">
                        <Mail className="w-4 h-4" />
                        이메일
                      </label>
                      {isEditing ? (
                        <div className="relative">
                          <Mail className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                          <input
                            type="email"
                            value={editableData.personalInfo?.email || ""}
                            onChange={(e) =>
                              setEditableData({
                                ...editableData,
                                personalInfo: { ...editableData.personalInfo, email: e.target.value },
                              })
                            }
                            className="w-full py-3 pl-12 pr-4 text-gray-900 placeholder-gray-400 transition-all duration-200 bg-white border border-gray-200 shadow-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:shadow-md"
                            placeholder="이메일 주소를 입력하세요"
                          />
                        </div>
                      ) : (
                        <div className="p-4 border border-gray-100 bg-gray-50 rounded-xl">
                          <p className="flex items-center gap-2 text-gray-900">
                            <Mail className="w-4 h-4 text-blue-500" />
                            {application.personalInfo?.email}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <label className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-600">
                        <Phone className="w-4 h-4" />
                        전화번호
                      </label>
                      {isEditing ? (
                        <div className="relative">
                          <Phone className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                          <input
                            type="tel"
                            value={editableData.personalInfo?.phone || ""}
                            onChange={(e) =>
                              setEditableData({
                                ...editableData,
                                personalInfo: { ...editableData.personalInfo, phone: e.target.value },
                              })
                            }
                            className="w-full py-3 pl-12 pr-4 text-gray-900 placeholder-gray-400 transition-all duration-200 bg-white border border-gray-200 shadow-sm rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent hover:shadow-md"
                            placeholder="전화번호를 입력하세요"
                          />
                        </div>
                      ) : (
                        <div className="p-4 border border-gray-100 bg-gray-50 rounded-xl">
                          <p className="flex items-center gap-2 text-gray-900">
                            <Phone className="w-4 h-4 text-green-500" />
                            {application.personalInfo?.phone}
                          </p>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-600">
                        <MapPin className="w-4 h-4" />
                        주소
                      </label>
                      {isEditing ? (
                        <div className="relative">
                          <MapPin className="absolute w-5 h-5 text-gray-400 left-3 top-3" />
                          <textarea
                            value={editableData.personalInfo?.address || ""}
                            onChange={(e) =>
                              setEditableData({
                                ...editableData,
                                personalInfo: { ...editableData.personalInfo, address: e.target.value },
                              })
                            }
                            className="w-full py-3 pl-12 pr-4 text-gray-900 placeholder-gray-400 transition-all duration-200 bg-white border border-gray-200 shadow-sm resize-none rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent hover:shadow-md"
                            rows="3"
                            placeholder="주소를 입력하세요"
                          />
                        </div>
                      ) : (
                        <div className="p-4 border border-gray-100 bg-gray-50 rounded-xl">
                          <p className="flex items-start gap-2 text-gray-900">
                            <MapPin className="w-4 h-4 text-red-500 mt-0.5" />
                            {application.personalInfo?.address}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {application.personalInfo?.phoneOfFriend && (
                  <div className="pt-4 mt-4 border-t border-gray-100">
                    <label className="block mb-1 text-sm font-medium text-gray-500">지인 연락처</label>
                    <p className="flex items-center gap-2 text-gray-900">
                      <Phone className="w-4 h-4 text-purple-500" />
                      {application.personalInfo.phoneOfFriend}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
            {/* 여행정보 카드 */}
            <Card className="bg-white border-0 shadow-lg">
              <CardHeader className="text-white rounded-t-lg bg-gradient-to-r from-green-500 to-green-600">
                <CardTitle className="flex items-center gap-3">
                  <Plane className="w-5 h-5" />
                  여행정보
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-600">
                      <Globe className="w-4 h-4" />
                      비자 종류
                    </label>
                    {isEditing ? (
                      <select
                        value={editableData.travelInfo?.visaType || ""}
                        onChange={(e) =>
                          setEditableData({
                            ...editableData,
                            travelInfo: { ...editableData.travelInfo, visaType: e.target.value },
                          })
                        }
                        className="w-full px-4 py-3 text-gray-900 transition-all duration-200 bg-white border border-gray-200 shadow-sm rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent hover:shadow-md"
                      >
                        <option value="e-visa_general">E-VISA 일반</option>
                        <option value="e-visa_urgent">E-VISA 긴급</option>
                        <option value="transit_visa">목바이 경유 E-VISA</option>
                      </select>
                    ) : (
                      <div className="p-4 border border-gray-100 bg-gray-50 rounded-xl">
                        <p className="flex items-center gap-2 font-semibold text-gray-900">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          {getVisaTypeLabel(application.travelInfo?.visaType)}
                        </p>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-600">
                      <Clock className="w-4 h-4" />
                      처리 방식
                    </label>
                    {isEditing ? (
                      <select
                        value={editableData.processingType || ""}
                        onChange={(e) =>
                          setEditableData({
                            ...editableData,
                            processingType: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 text-gray-900 transition-all duration-200 bg-white border border-gray-200 shadow-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:shadow-md"
                      >
                        <option value="일반">일반</option>
                        <option value="2시간">2시간</option>
                        <option value="4시간">4시간</option>
                        <option value="익일">익일</option>
                      </select>
                    ) : (
                      <div className="p-4 border border-gray-100 bg-gray-50 rounded-xl">
                        <p className="flex items-center gap-2 font-semibold text-gray-900">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          {getProcessingTypeLabel(application.processingType)}
                        </p>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-600">
                      <Calendar className="w-4 h-4" />
                      입국일
                    </label>
                    {isEditing ? (
                      <div className="relative">
                        <Calendar className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                        <input
                          type="date"
                          value={editableData.travelInfo?.entryDate || ""}
                          onChange={(e) =>
                            setEditableData({
                              ...editableData,
                              travelInfo: { ...editableData.travelInfo, entryDate: e.target.value },
                            })
                          }
                          className="w-full py-3 pl-12 pr-4 text-gray-900 transition-all duration-200 bg-white border border-gray-200 shadow-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:shadow-md"
                        />
                      </div>
                    ) : (
                      <div className="p-4 border border-gray-100 bg-gray-50 rounded-xl">
                        <p className="flex items-center gap-2 text-gray-900">
                          <Calendar className="w-4 h-4 text-blue-500" />
                          {application.travelInfo?.entryDate}
                        </p>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-600">
                      <Plane className="w-4 h-4" />
                      입국공항
                    </label>
                    {isEditing ? (
                      <select
                        value={editableData.travelInfo?.entryPort || ""}
                        onChange={(e) =>
                          setEditableData({
                            ...editableData,
                            travelInfo: { ...editableData.travelInfo, entryPort: e.target.value },
                          })
                        }
                        className="w-full px-4 py-3 text-gray-900 transition-all duration-200 bg-white border border-gray-200 shadow-sm rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent hover:shadow-md"
                      >
                        <option value="UIH">푸꿕(UIH)</option>
                        <option value="ICN">인천(ICN)</option>
                        <option value="SGN">탄손냣(SGN)</option>
                        <option value="HAN">노이바이(HAN)</option>
                        <option value="DAD">다낭(DAD)</option>
                        <option value="CXR">캄란(CXR)</option>
                        <option value="VCA">껀터(VCA)</option>
                        <option value="HPH">깟비(HPH)</option>
                        <option value="DLI">달랏(DLI)</option>
                        <option value="PQC">푸꾸옥(PQC)</option>
                      </select>
                    ) : (
                      <div className="p-4 border border-gray-100 bg-gray-50 rounded-xl">
                        <p className="flex items-center gap-2 text-gray-900">
                          <Plane className="w-4 h-4 text-green-500" />
                          {getAirportLabel(application.travelInfo?.entryPort)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 가격 정보 카드 */}
            <Card className="bg-white border-0 shadow-lg">
              <CardHeader className="text-white rounded-t-lg bg-gradient-to-r from-green-500 to-emerald-600">
                <CardTitle className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5" />
                  상세 가격 구조
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* 비자 기본료 */}
                  {application.totalPrice?.visa && (
                    <div className="p-5 border border-green-200 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 bg-green-500 rounded-full">
                            <FileText className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-green-900">
                              {application.travelInfo?.visaType === "E_VISA_TRANSIT" || application.travelInfo?.visaType === "transit_visa"
                                ? `목바이 경유 비자료 (${application.transitPeopleCount || 1}명)`
                                : "비자 기본료"}
                            </h4>
                            <p className="text-sm text-green-700">기본 비자 신청 비용</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-900">
                            {application.totalPrice.formatted?.visaBasePrice ||
                              (application.totalPrice.visa.basePrice
                                ? new Intl.NumberFormat(application.travelInfo?.visaType === "E_VISA_TRANSIT" || application.travelInfo?.visaType === "transit_visa" ? "vi-VN" : "ko-KR", {
                                    style: "currency",
                                    currency: application.travelInfo?.visaType === "E_VISA_TRANSIT" || application.travelInfo?.visaType === "transit_visa" ? "VND" : "KRW",
                                    minimumFractionDigits: 0,
                                  }).format(application.totalPrice.visa.basePrice)
                                : "₩0")}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 차량 추가료 (경유 비자의 경우만) */}
                  {(application.travelInfo?.visaType === "E_VISA_TRANSIT" || application.travelInfo?.visaType === "transit_visa") && application.totalPrice?.visa?.vehiclePrice > 0 && (
                    <div className="p-5 border border-purple-200 rounded-xl bg-gradient-to-r from-purple-50 to-indigo-50">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 bg-purple-500 rounded-full">
                            <Car className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-purple-900">차량 추가료</h4>
                            <p className="text-sm text-purple-700">
                              {application.transitVehicleType === "innova" ? "이노바 (7인승 SUV)" : application.transitVehicleType === "carnival" ? "카니발 (11인승 밴)" : "선택된 차량"}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-purple-900">
                            {application.totalPrice.formatted?.visaVehiclePrice ||
                              new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND",
                                minimumFractionDigits: 0,
                              }).format(application.totalPrice.visa.vehiclePrice)}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 추가 서비스 */}
                  {application.totalPrice?.additionalServices?.services?.length > 0 && (
                    <div className="space-y-4">
                      <div className="p-5 border border-blue-200 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="flex items-center justify-center w-8 h-8 bg-blue-500 rounded-full">
                            <Sparkles className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-blue-900">추가 서비스</h4>
                            <p className="text-sm text-blue-700">선택한 부가 서비스</p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          {application.totalPrice.additionalServices.services.map((service, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-white border border-blue-100 rounded-lg">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <span className="font-medium text-blue-900">{service.name}</span>
                              </div>
                              <span className="font-semibold text-blue-900">
                                {application.travelInfo?.visaType === "E_VISA_TRANSIT" || application.travelInfo?.visaType === "transit_visa"
                                  ? new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", minimumFractionDigits: 0 }).format(service.price)
                                  : new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW", minimumFractionDigits: 0 }).format(service.price)}
                              </span>
                            </div>
                          ))}
                          <div className="flex items-center justify-between pt-2 border-t border-blue-200">
                            <span className="font-medium text-blue-800">추가 서비스 합계</span>
                            <span className="font-bold text-blue-900">
                              {application.totalPrice.formatted?.additionalServicesPrice ||
                                new Intl.NumberFormat(application.travelInfo?.visaType === "E_VISA_TRANSIT" || application.travelInfo?.visaType === "transit_visa" ? "vi-VN" : "ko-KR", {
                                  style: "currency",
                                  currency: application.travelInfo?.visaType === "E_VISA_TRANSIT" || application.travelInfo?.visaType === "transit_visa" ? "VND" : "KRW",
                                  minimumFractionDigits: 0,
                                }).format(application.totalPrice.additionalServices.totalPrice)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 총 결제 금액 */}
                  <div className="p-6 border-2 border-gray-300 rounded-xl bg-gradient-to-r from-gray-50 to-slate-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 bg-gray-600 rounded-full">
                          <CreditCard className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">총 결제 금액</h3>
                          <p className="text-sm text-gray-600">
                            {application.travelInfo?.visaType === "E_VISA_TRANSIT" || application.travelInfo?.visaType === "transit_visa" ? "베트남 동화 (VND) 기준" : "한국 원화 (KRW) 기준"}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-gray-900">
                          {application.totalPrice?.formatted?.totalPrice ||
                            (application.totalPrice?.totalPrice
                              ? new Intl.NumberFormat(application.travelInfo?.visaType === "E_VISA_TRANSIT" || application.travelInfo?.visaType === "transit_visa" ? "vi-VN" : "ko-KR", {
                                  style: "currency",
                                  currency: application.travelInfo?.visaType === "E_VISA_TRANSIT" || application.travelInfo?.visaType === "transit_visa" ? "VND" : "KRW",
                                  minimumFractionDigits: 0,
                                }).format(application.totalPrice.totalPrice)
                              : typeof application.totalPrice === "number"
                              ? new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW", minimumFractionDigits: 0 }).format(application.totalPrice)
                              : "₩0")}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {application.travelInfo?.visaType === "E_VISA_TRANSIT" || application.travelInfo?.visaType === "transit_visa" ? "부가세 포함" : "VAT 포함"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 가격 구조 요약 카드 */}
                  {application.totalPrice?.visa && (
                    <div className="p-4 border border-amber-200 rounded-xl bg-gradient-to-r from-amber-50 to-yellow-50">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center justify-center w-6 h-6 bg-amber-500 rounded-full">
                          <Activity className="w-3 h-3 text-white" />
                        </div>
                        <h4 className="font-medium text-amber-900">가격 구성</h4>
                      </div>
                      <div className="grid grid-cols-1 gap-2 text-sm md:grid-cols-3">
                        {application.totalPrice.visa.basePrice > 0 && (
                          <div className="flex items-center justify-between p-2 bg-white rounded">
                            <span className="text-amber-800">비자료</span>
                            <span className="font-medium text-amber-900">
                              {application.totalPrice.formatted?.visaBasePrice ||
                                new Intl.NumberFormat(application.travelInfo?.visaType === "E_VISA_TRANSIT" || application.travelInfo?.visaType === "transit_visa" ? "vi-VN" : "ko-KR", {
                                  style: "currency",
                                  currency: application.travelInfo?.visaType === "E_VISA_TRANSIT" || application.travelInfo?.visaType === "transit_visa" ? "VND" : "KRW",
                                  minimumFractionDigits: 0,
                                }).format(application.totalPrice.visa.basePrice)}
                            </span>
                          </div>
                        )}
                        {application.totalPrice.visa.vehiclePrice > 0 && (
                          <div className="flex items-center justify-between p-2 bg-white rounded">
                            <span className="text-amber-800">차량료</span>
                            <span className="font-medium text-amber-900">
                              {application.totalPrice.formatted?.visaVehiclePrice ||
                                new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", minimumFractionDigits: 0 }).format(application.totalPrice.visa.vehiclePrice)}
                            </span>
                          </div>
                        )}
                        {application.totalPrice.additionalServices?.totalPrice > 0 && (
                          <div className="flex items-center justify-between p-2 bg-white rounded">
                            <span className="text-amber-800">부가서비스</span>
                            <span className="font-medium text-amber-900">
                              {application.totalPrice.formatted?.additionalServicesPrice ||
                                new Intl.NumberFormat(application.travelInfo?.visaType === "E_VISA_TRANSIT" || application.travelInfo?.visaType === "transit_visa" ? "vi-VN" : "ko-KR", {
                                  style: "currency",
                                  currency: application.travelInfo?.visaType === "E_VISA_TRANSIT" || application.travelInfo?.visaType === "transit_visa" ? "VND" : "KRW",
                                  minimumFractionDigits: 0,
                                }).format(application.totalPrice.additionalServices.totalPrice)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Transit Visa 정보 카드 (목바이 경유 E-VISA인 경우만 표시) */}
            {(application.travelInfo?.visaType === "E_VISA_TRANSIT" || application.travelInfo?.visaType === "transit_visa") && (
              <Card className="bg-white border-0 shadow-lg">
                <CardHeader className="text-white rounded-t-lg bg-gradient-to-r from-indigo-500 to-purple-600">
                  <CardTitle className="flex items-center gap-3">
                    <Users className="w-5 h-5" />
                    목바이 경유 비자 정보
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <label className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-600">
                        <Users className="w-4 h-4" />
                        신청 인원수
                      </label>
                      <div className="p-4 border border-gray-100 bg-indigo-50 rounded-xl">
                        <p className="flex items-center gap-2 font-semibold text-indigo-900">
                          <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                          {application.transitPeopleCount || 1}명
                        </p>
                      </div>
                    </div>
                    <div>
                      <label className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-600">
                        <Car className="w-4 h-4" />
                        선택 차량
                      </label>
                      <div className="p-4 border border-gray-100 bg-indigo-50 rounded-xl">
                        <p className="flex items-center gap-2 font-semibold text-indigo-900">
                          <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                          {application.transitVehicleType === "innova"
                            ? "이노바 (7인승 SUV)"
                            : application.transitVehicleType === "carnival"
                            ? "카니발 (11인승 밴)"
                            : application.transitVehicleType || "선택안함"}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 추가 서비스 */}
            {application.additionalServices && application.additionalServices.length > 0 && (
              <Card className="bg-white border-0 shadow-lg">
                <CardHeader className="text-white rounded-t-lg bg-gradient-to-r from-purple-500 to-purple-600">
                  <CardTitle className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5" />
                    추가 서비스
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {application.additionalServices.map((service, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border border-purple-200 rounded-lg bg-purple-50">
                        <span className="font-medium text-purple-900">{service.name}</span>
                        <Badge variant="secondary" className="text-purple-800 bg-purple-100">
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
              <Card className="bg-white border-0 shadow-lg">
                <CardHeader className="text-white rounded-t-lg bg-gradient-to-r from-orange-500 to-orange-600">
                  <CardTitle className="flex items-center gap-3">
                    <FileText className="w-5 h-5" />
                    제출 서류
                    {(application.travelInfo?.visaType === "E_VISA_TRANSIT" || application.travelInfo?.visaType === "transit_visa") && (
                      <Badge variant="secondary" className="ml-2 text-orange-100 bg-orange-400">
                        {application.transitPeopleCount || 1}명 신청
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {(() => {
                      // 다중 인원 문서 처리를 위한 함수
                      const groupDocumentsByPerson = (documents) => {
                        const groups = {};

                        documents.forEach((doc, index) => {
                          // 문서 key에서 person index 추출
                          const personMatch = doc.type.match(/_person_(\d+)$/);
                          const personIndex = personMatch ? parseInt(personMatch[1]) : 0;
                          const baseType = personMatch ? doc.type.replace(/_person_\d+$/, "") : doc.type;

                          if (!groups[personIndex]) {
                            groups[personIndex] = [];
                          }

                          groups[personIndex].push({
                            ...doc,
                            baseType,
                            originalIndex: index,
                          });
                        });

                        return groups;
                      };

                      const documentGroups = groupDocumentsByPerson(application.documents);
                      const isMultiplePeople = Object.keys(documentGroups).length > 1;

                      return Object.entries(documentGroups).map(([personIndex, documents]) => (
                        <div key={`person_${personIndex}`} className="space-y-4">
                          {/* 인원 구분 헤더 (다중 인원일 때만 표시) */}
                          {isMultiplePeople && (
                            <div className="pb-3 border-b border-orange-200">
                              <div className="flex items-center space-x-3">
                                <div className="flex items-center justify-center w-8 h-8 text-white bg-gradient-to-r from-orange-500 to-red-600 rounded-full">
                                  <span className="text-sm font-bold">{parseInt(personIndex) + 1}</span>
                                </div>
                                <h3 className="text-lg font-bold text-gray-800">{parseInt(personIndex) + 1}번째 신청자 서류</h3>
                              </div>
                            </div>
                          )}

                          {/* 해당 인원의 문서들 */}
                          {documents.map((document) => (
                            <div key={`doc_${document.originalIndex}`} className="p-6 transition-shadow border border-gray-200 rounded-xl hover:shadow-md bg-gray-50">
                              {/* 문서 헤더 */}
                              <div className="flex items-center justify-between mb-6">
                                <div>
                                  <h4 className="mb-1 text-lg font-semibold text-gray-900">
                                    {getDocumentTypeLabel(document.baseType)} / {document.baseType.toUpperCase()}
                                    {isMultiplePeople && <span className="ml-2 text-sm text-orange-600">({parseInt(personIndex) + 1}번째 신청자)</span>}
                                  </h4>
                                  <p className="text-sm text-gray-500">
                                    {document.fileName} • {(document.fileSize / 1024).toFixed(1)}KB • {document.fileType}
                                  </p>
                                  <p className="mt-1 text-xs text-gray-400">
                                    업로드:{" "}
                                    {new Date(parseInt(document.uploadedAt)).toLocaleString("ko-KR", {
                                      year: "numeric",
                                      month: "2-digit",
                                      day: "2-digit",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      second: "2-digit",
                                    })}
                                  </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                  {(document.fileUrl || document.fileData) && (
                                    <>
                                      <Button size="sm" variant="outline" onClick={() => openImagePreview(document.fileUrl || document.fileData, document.fileName)} className="hover:bg-blue-50">
                                        <ZoomIn className="w-3 h-3 mr-1" />
                                        미리보기
                                      </Button>
                                      {/* AI 정보 추출 버튼 - 여권 문서일 때만 표시 */}
                                      {document.baseType === "passport" && (
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={handleExtractPassportInfo}
                                          disabled={isExtractingPassport}
                                          className="text-green-600 border-green-200 hover:bg-green-50"
                                        >
                                          {isExtractingPassport ? (
                                            <>
                                              <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                                              추출 중...
                                            </>
                                          ) : (
                                            <>
                                              <Brain className="w-3 h-3 mr-1" />
                                              AI 정보 추출
                                            </>
                                          )}
                                        </Button>
                                      )}
                                    </>
                                  )}
                                </div>
                              </div>

                              {/* 컨텐츠 영역을 세로로 배치 */}
                              <div className="space-y-6">
                                {/* 이미지 섹션 */}
                                <div>
                                  <h5 className="flex items-center gap-2 mb-3 font-medium text-gray-700">
                                    <Eye className="w-4 h-4" />
                                    문서 이미지 / Document Image
                                  </h5>
                                  {document.fileUrl || document.fileData ? (
                                    <div className="space-y-3">
                                      <div className="relative w-full max-w-md mx-auto">
                                        <Image
                                          src={getDocumentImageUrl(document)}
                                          alt={document.fileName}
                                          width={400}
                                          height={300}
                                          className="object-contain w-full h-auto transition-opacity bg-white border rounded-lg shadow-sm cursor-pointer hover:opacity-80"
                                          onClick={() => openImagePreview(getDocumentImageUrl(document), document.fileName)}
                                          style={{ maxHeight: "400px" }}
                                        />
                                      </div>
                                      <div className="flex justify-center gap-2">
                                        <Button size="sm" variant="outline" onClick={() => openImagePreview(getDocumentImageUrl(document), document.fileName)} className="hover:bg-blue-50">
                                          <Eye className="w-3 h-3 mr-1" />
                                          확대보기
                                        </Button>
                                        {/* 이미지 변경 버튼 - 여권 문서일 때만 표시 */}
                                        {document.baseType === "passport" && (
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => setShowImageUpload(true)}
                                            disabled={isUploadingImage}
                                            className="text-blue-600 border-blue-200 hover:bg-blue-50"
                                          >
                                            <Upload className="w-3 h-3 mr-1" />
                                            이미지 변경
                                          </Button>
                                        )}
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="flex items-center justify-center w-full h-48 bg-gray-100 border-2 border-gray-300 border-dashed rounded-lg">
                                      <p className="text-gray-500">이미지 없음</p>
                                    </div>
                                  )}
                                </div>

                                {/* AI 추출 정보 섹션 */}
                                {document.baseType === "passport" && (
                                  <div>
                                    <h5 className="flex items-center gap-2 mb-3 font-medium text-gray-700">
                                      <Brain className="w-4 h-4" />
                                      AI 추출 정보
                                    </h5>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                      {(() => {
                                        // Application 레벨 우선, 없으면 Document 레벨 사용
                                        const extractedInfo = application.extractedInfo || document.extractedInfo;

                                        return (
                                          extractedInfo &&
                                          Object.entries(extractedInfo)
                                            .filter(([key, value]) => key !== "__typename" && value !== null && value !== "")
                                            .map(([key, value]) => (
                                              <div key={key}>
                                                <label className="block mb-1 text-xs font-medium text-gray-500">{getKoreanFieldName(key)}</label>
                                                <div className="p-2 text-xs border border-gray-100 bg-gray-50 rounded-lg">
                                                  <p className="font-medium text-gray-900">{value}</p>
                                                </div>
                                              </div>
                                            ))
                                        );
                                      })()}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ));
                    })()}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* 사이드바 정보 */}
          <div className="space-y-6">
            {/* 처리 현황 */}
            <Card className="bg-white border-0 shadow-lg">
              <CardHeader className="text-white rounded-t-lg bg-gradient-to-r from-indigo-500 to-indigo-600">
                <CardTitle className="flex items-center gap-3">
                  <Activity className="w-5 h-5" />
                  처리 현황
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-500">신청일</label>
                  <p className="font-medium text-gray-900">
                    {new Date(application.createdAt).toLocaleString("ko-KR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </p>
                </div>
                {application.updatedAt && application.updatedAt !== application.createdAt && (
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-500">최종 수정일</label>
                    <p className="font-medium text-gray-900">
                      {new Date(application.updatedAt).toLocaleString("ko-KR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </p>
                  </div>
                )}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-500">현재 상태</label>
                  {getStatusBadge(application.status)}
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-500">총 금액</label>
                  <p className="flex items-center gap-2 text-2xl font-bold text-green-600">
                    <DollarSign className="w-5 h-5" />
                    {(() => {
                      // 새로운 pricing 구조 지원
                      if (application.totalPrice?.totalPrice) {
                        return application.totalPrice.formatted?.totalPrice || "가격 정보 없음";
                      }
                      // 기존 totalPrice가 number인 경우의 fallback
                      else if (typeof application.totalPrice === "number") {
                        return new Intl.NumberFormat("ko-KR", {
                          style: "currency",
                          currency: "KRW",
                          minimumFractionDigits: 0,
                        }).format(application.totalPrice);
                      } else {
                        return "가격 정보 없음";
                      }
                    })()}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* 상태 변경 */}
            <Card className="bg-white border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">상태 관리</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-3">
                {[
                  { status: "PENDING", label: "처리 대기", color: "bg-yellow-500" },
                  { status: "PROCESSING", label: "처리중", color: "bg-blue-500" },
                  { status: "DOCUMENT_REVIEW", label: "서류검토", color: "bg-purple-500" },
                  { status: "SUBMITTED_TO_AUTHORITY", label: "기관제출", color: "bg-orange-500" },
                  { status: "APPROVED", label: "승인완료", color: "bg-green-500" },
                  { status: "COMPLETED", label: "처리완료", color: "bg-emerald-500" },
                ].map((item) => (
                  <Button
                    key={item.status}
                    variant={application.status === item.status ? "default" : "outline"}
                    className={`w-full justify-start ${application.status === item.status ? item.color : ""}`}
                    onClick={() => handleStatusUpdate(item.status)}
                    disabled={updatingStatus || application.status === item.status}
                  >
                    {updatingStatus ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <div className={`w-3 h-3 rounded-full mr-2 ${item.color}`}></div>}
                    {item.label}
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* 이메일 발송 */}
            <Card className="bg-white border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">이메일 발송</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-3">
                <Button variant="outline" className="justify-start w-full hover:bg-blue-50" onClick={() => handleSendEmail("STATUS_UPDATE")} disabled={sendingEmail}>
                  {sendingEmail ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                  상태 업데이트 알림
                </Button>
                <Button variant="outline" className="justify-start w-full hover:bg-orange-50" onClick={() => handleSendEmail("DOCUMENT_REQUEST")} disabled={sendingEmail}>
                  <FileText className="w-4 h-4 mr-2" />
                  추가 서류 요청
                </Button>
                <Button variant="outline" className="justify-start w-full hover:bg-green-50" onClick={() => handleSendEmail("APPROVAL_NOTICE")} disabled={sendingEmail}>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  승인 완료 알림
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* PDF 생성용 숨겨진 엘리먼트 */}
        <div style={{ position: "absolute", left: "-9999px", top: "-9999px" }}>
          <div ref={printRef} style={{ width: "794px", padding: "40px", backgroundColor: "white" }}>
            <div style={{ textAlign: "center", marginBottom: "30px" }}>
              <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "10px" }}>비자 신청서</h1>
              <p style={{ fontSize: "16px", color: "#666" }}>신청서 ID: {application.applicationId}</p>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "10px", borderBottom: "2px solid #333", paddingBottom: "5px" }}>개인정보</h2>
              <p>
                <strong>성명:</strong> {application.personalInfo?.firstName} {application.personalInfo?.lastName}
              </p>
              <p>
                <strong>이메일:</strong> {application.personalInfo?.email}
              </p>
              <p>
                <strong>전화번호:</strong> {application.personalInfo?.phone}
              </p>
              <p>
                <strong>주소:</strong> {application.personalInfo?.address}
              </p>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "10px", borderBottom: "2px solid #333", paddingBottom: "5px" }}>여행정보</h2>
              <p>
                <strong>비자 종류:</strong> {getVisaTypeLabel(application.travelInfo?.visaType)}
              </p>
              <p>
                <strong>입국일:</strong> {application.travelInfo?.entryDate}
              </p>
              <p>
                <strong>입국공항:</strong> {getAirportLabel(application.travelInfo?.entryPort)}
              </p>
              <p>
                <strong>처리 방식:</strong> {application.processingType}
              </p>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "10px", borderBottom: "2px solid #333", paddingBottom: "5px" }}>처리 현황</h2>
              <p>
                <strong>상태:</strong> {getStatusBadge(application.status).props.children[1]}
              </p>
              <p>
                <strong>신청일:</strong>{" "}
                {new Date(application.createdAt).toLocaleString("ko-KR", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </p>
              <p>
                <strong>총 금액:</strong>{" "}
                {(() => {
                  if (application.totalPrice?.totalPrice) {
                    const totalPrice = application.totalPrice.totalPrice;
                    const isTransit = application.travelInfo?.visaType === "E_VISA_TRANSIT" || application.travelInfo?.visaType === "transit_visa";

                    if (isTransit) {
                      return new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                        minimumFractionDigits: 0,
                      }).format(totalPrice);
                    } else {
                      return new Intl.NumberFormat("ko-KR", {
                        style: "currency",
                        currency: "KRW",
                        minimumFractionDigits: 0,
                      }).format(totalPrice);
                    }
                  } else if (typeof application.totalPrice === "number") {
                    return application.totalPrice?.toLocaleString() + "원";
                  } else {
                    return "가격 정보 없음";
                  }
                })()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 추출된 정보 모달 */}
      {showExtractedInfo && extractedPassportInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                <Sparkles className="w-5 h-5 text-purple-500" />
                AI 추출된 여권 정보
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowExtractedInfo(false);
                  setExtractedPassportInfo(null);
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2">
              {Object.entries(extractedPassportInfo).map(
                ([key, value]) =>
                  value && (
                    <div key={key} className="p-3 rounded-lg bg-gray-50">
                      <div className="mb-1 text-xs text-gray-500">{key}</div>
                      <div className="text-sm font-medium text-gray-900">{value}</div>
                    </div>
                  )
              )}
            </div>

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowExtractedInfo(false);
                  setExtractedPassportInfo(null);
                }}
              >
                확인
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 이미지 업로드 모달 */}
      {showImageUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 mx-4 bg-white rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                <Upload className="w-5 h-5 text-blue-500" />
                여권 이미지 변경
              </h3>
              <Button variant="outline" size="sm" onClick={() => setShowImageUpload(false)} disabled={isUploadingImage}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="p-4 text-center border-2 border-gray-300 border-dashed rounded-lg">
                <div className="space-y-2">
                  <Upload className="w-8 h-8 mx-auto text-gray-400" />
                  <div className="text-sm text-gray-600">
                    <p>새로운 여권 이미지를 선택해주세요</p>
                    <p className="mt-1 text-xs text-gray-500">JPEG, PNG, WEBP 형식 / 최대 5MB</p>
                  </div>
                </div>
              </div>

              <input type="file" accept="image/jpeg,image/jpg,image/png,image/webp" onChange={handleFileSelect} className="w-full p-2 border border-gray-300 rounded-md" disabled={isUploadingImage} />

              {isUploadingImage && (
                <div className="flex items-center justify-center gap-2 text-blue-600">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">업로드 중...</span>
                </div>
              )}

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowImageUpload(false)} disabled={isUploadingImage}>
                  취소
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 이미지 프리뷰 모달 */}
      {isPreviewOpen && previewImage && (
        <ImagePreviewModal
          isOpen={isPreviewOpen}
          onClose={() => {
            setIsPreviewOpen(false);
            setPreviewImage(null);
          }}
          imageSrc={previewImage.src}
          fileName={previewImage.fileName}
        />
      )}
    </div>
  );
}
