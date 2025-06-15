"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_VISA_APPLICATIONS, GET_APPLICATION_MEMOS } from "@/lib/graphql/query/applications";
import {
  UPDATE_APPLICATION_STATUS_MUTATION,
  SEND_EMAIL_MUTATION,
  ADD_MEMO_MUTATION,
  UPDATE_MEMO_MUTATION,
  DELETE_MEMO_MUTATION,
  UPDATE_APPLICATION_INFO_MUTATION,
  DOWNLOAD_DOCUMENTS_MUTATION,
} from "@/lib/graphql/mutation/applications";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Search, Filter, Eye, Edit, CheckCircle, XCircle, Clock, AlertTriangle, Download, Send, User, Calendar, Globe, Phone, Mail } from "lucide-react";

export default function ApplicationsManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [memoContent, setMemoContent] = useState("");
  const [editingMemoId, setEditingMemoId] = useState(null);
  const [editingMemoContent, setEditingMemoContent] = useState("");
  const [emailContent, setEmailContent] = useState("");
  const [emailType, setEmailType] = useState("status_update");
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  const { data, loading } = useQuery(GET_VISA_APPLICATIONS);
  // Query for application memos when an application is selected
  const {
    data: memosData,
    loading: memosLoading,
    error: memosError,
    refetch: refetchMemos,
  } = useQuery(GET_APPLICATION_MEMOS, {
    variables: { applicationId: selectedApplication?.id?.toString() },
    skip: !selectedApplication?.id, // Skip query if no application is selected
    errorPolicy: "all", // 에러가 발생해도 부분적인 데이터 반환
    notifyOnNetworkStatusChange: true, // 네트워크 상태 변경 알림
  });
  const [updateApplicationStatus] = useMutation(UPDATE_APPLICATION_STATUS_MUTATION);
  const [sendEmail] = useMutation(SEND_EMAIL_MUTATION);
  const [addMemo] = useMutation(ADD_MEMO_MUTATION);
  const [updateMemo] = useMutation(UPDATE_MEMO_MUTATION);
  const [deleteMemo] = useMutation(DELETE_MEMO_MUTATION);
  const [updateApplicationInfo] = useMutation(UPDATE_APPLICATION_INFO_MUTATION);
  const [downloadDocuments] = useMutation(DOWNLOAD_DOCUMENTS_MUTATION);

  // Use real data from backend or fallback to mock data
  const applications = data?.getVisaApplications || [
    {
      id: 1,
      application_number: "VN-2024-001",
      full_name: "김민수",
      visa_type: "E-visa",
      status: "PENDING",
      created_at: "2024-01-15T09:30:00Z",
      updated_at: "2024-01-16T14:20:00Z",
      email: "minsu.kim@email.com",
      phone: "010-1234-5678",
      nationality: "대한민국",
      passport_number: "M12345678",
      arrival_date: "2024-02-15",
      departure_date: "2024-02-25",
      priority: "normal",
    },
    {
      id: 2,
      application_number: "VN-2024-002",
      full_name: "이영희",
      visa_type: "Business Visa",
      status: "PROCESSING",
      created_at: "2024-01-14T16:45:00Z",
      updated_at: "2024-01-16T10:15:00Z",
      email: "younghee.lee@company.com",
      phone: "010-9876-5432",
      nationality: "대한민국",
      passport_number: "M87654321",
      arrival_date: "2024-02-20",
      departure_date: "2024-03-20",
      priority: "high",
    },
    {
      id: 3,
      application_number: "VN-2024-003",
      full_name: "박철수",
      visa_type: "노동허가서",
      status: "CONSULTATION",
      created_at: "2024-01-10T11:20:00Z",
      updated_at: "2024-01-16T16:30:00Z",
      email: "chulsoo.park@email.com",
      phone: "010-5555-1234",
      nationality: "대한민국",
      passport_number: "M11111111",
      arrival_date: "2024-03-01",
      departure_date: "2025-03-01",
      priority: "urgent",
    },
    {
      id: 4,
      application_number: "VN-2024-004",
      full_name: "최지민",
      visa_type: "E-visa",
      status: "APPROVED",
      created_at: "2024-01-12T08:15:00Z",
      updated_at: "2024-01-16T12:45:00Z",
      email: "jimin.choi@email.com",
      phone: "010-7777-8888",
      nationality: "대한민국",
      passport_number: "M22222222",
      arrival_date: "2024-02-10",
      departure_date: "2024-02-20",
      priority: "normal",
    },
  ];
  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      console.log("Updating status:", { applicationId, newStatus, Type: typeof applicationId });

      const result = await updateApplicationStatus({
        variables: {
          id: applicationId.toString(), // ID를 명시적으로 문자열로 변환
          status: newStatus,
        },
        // Optimistic response for better UX
        optimisticResponse: {
          updateApplicationStatus: {
            __typename: "VisaApplication",
            id: applicationId.toString(), // 일관된 ID 타입
            status: newStatus,
            updated_at: new Date().toISOString(),
            application_number: selectedApplication?.application_number || `VN-2024-${applicationId}`,
            full_name: selectedApplication?.full_name || "Unknown",
          },
        }, // Update Apollo Cache
        update: (cache, { data }) => {
          if (data?.updateApplicationStatus) {
            // Update the selected application if it matches - 원본 ID 유지
            if (selectedApplication?.id == applicationId) {
              setSelectedApplication((prev) => ({
                ...prev,
                status: newStatus,
                updated_at: new Date().toISOString(),
                // ID는 원본 그대로 유지 (문자열/숫자 타입 보존)
                id: prev.id,
              }));
            }

            // Update the cache for getVisaApplications query
            try {
              const existingData = cache.readQuery({
                query: GET_VISA_APPLICATIONS,
              });

              if (existingData?.getVisaApplications) {
                const updatedApplications = existingData.getVisaApplications.map((app) =>
                  app.id == applicationId ? { ...app, status: newStatus, updated_at: new Date().toISOString(), id: app.id } : app
                );

                cache.writeQuery({
                  query: GET_VISA_APPLICATIONS,
                  data: {
                    getVisaApplications: updatedApplications,
                  },
                });
              }
            } catch (cacheError) {
              console.log("Cache update error:", cacheError);
            }
          }
        },
      });

      if (result.data?.updateApplicationStatus) {
        alert("상태가 성공적으로 업데이트되었습니다.");
      }
    } catch (error) {
      console.error("상태 업데이트 오류:", error);
      alert("상태 업데이트 중 오류가 발생했습니다: " + (error.message || "알 수 없는 오류"));
    }
  };
  const handleSendEmail = async (applicationId) => {
    try {
      console.log("Sending email for application:", applicationId, "Type:", typeof applicationId);

      const result = await sendEmail({
        variables: {
          applicationId: applicationId.toString(), // ID를 명시적으로 문자열로 변환
          emailType,
          content: emailContent,
        },
        // Cache update for email sending activity
        update: (cache, { data }) => {
          if (data?.sendEmailToCustomer?.success) {
            // You could add email activity to the application's history
            console.log("Email sent successfully, cache could be updated with activity log");
          }
        },
      });

      if (result.data?.sendEmailToCustomer?.success) {
        alert(`이메일이 성공적으로 발송되었습니다: ${result.data.sendEmailToCustomer.message}`);
        setIsEmailModalOpen(false);
        setEmailContent("");
      } else {
        alert("이메일 발송에 실패했습니다: " + (result.data?.sendEmailToCustomer?.message || "알 수 없는 오류"));
      }
    } catch (error) {
      console.error("이메일 발송 오류:", error);
      alert("이메일 발송 중 오류가 발생했습니다.");
    }
  };
  const handleDownloadDocuments = async (applicationId) => {
    try {
      console.log("Downloading documents for application:", applicationId, "Type:", typeof applicationId);

      const result = await downloadDocuments({
        variables: { applicationId: applicationId.toString() }, // ID를 명시적으로 문자열로 변환
      });
      if (result.data?.downloadApplicationDocuments?.downloadUrl) {
        const { downloadUrl, fileName } = result.data.downloadApplicationDocuments;

        // Check if it's a mock URL
        if (downloadUrl.startsWith("/api/download/")) {
          alert(`서류 다운로드 링크가 준비되었습니다 (개발 모드): ${fileName}\n실제 환경에서는 파일이 다운로드됩니다.`);
        } else {
          // 브라우저에서 파일 다운로드
          const link = document.createElement("a");
          link.href = downloadUrl;
          link.download = fileName || `application_${applicationId}_documents.zip`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          alert("서류 다운로드가 시작되었습니다.");
        }
      } else {
        alert("다운로드할 서류가 없습니다.");
      }
    } catch (error) {
      console.error("서류 다운로드 오류:", error);
      alert("서류 다운로드 중 오류가 발생했습니다.");
    }
  };

  const handleEditInformation = (application) => {
    setEditForm({
      full_name: application.full_name,
      email: application.email,
      phone: application.phone,
      arrival_date: application.arrival_date,
      departure_date: application.departure_date,
    });
    setIsEditingInfo(true);
  };
  const handleSaveInformation = async (applicationId) => {
    try {
      console.log("Saving information for application:", applicationId, "Type:", typeof applicationId);

      const result = await updateApplicationInfo({
        variables: {
          id: applicationId.toString(), // ID를 명시적으로 문자열로 변환
          input: editForm,
        },
        // Optimistic response
        optimisticResponse: {
          updateApplicationInfo: {
            __typename: "VisaApplication",
            id: applicationId.toString(), // 일관된 ID 타입
            ...editForm,
            updated_at: new Date().toISOString(),
          },
        },
        // Update Apollo Cache
        update: (cache, { data }) => {
          if (data?.updateApplicationInfo) {
            // Update selected application immediately - 원본 ID 유지
            if (selectedApplication?.id == applicationId) {
              setSelectedApplication({
                ...selectedApplication,
                ...data.updateApplicationInfo,
                id: selectedApplication.id, // 원본 ID 타입 유지
              });
            }

            // Update the cache for getVisaApplications query
            try {
              const existingData = cache.readQuery({
                query: GET_VISA_APPLICATIONS,
              });

              if (existingData?.getVisaApplications) {
                const updatedApplications = existingData.getVisaApplications.map((app) =>
                  app.id == applicationId
                    ? { ...app, ...data.updateApplicationInfo, id: app.id } // 원본 ID 유지
                    : app
                );

                cache.writeQuery({
                  query: GET_VISA_APPLICATIONS,
                  data: {
                    getVisaApplications: updatedApplications,
                  },
                });
              }
            } catch (cacheError) {
              console.log("Cache update error:", cacheError);
            }
          }
        },
      });

      if (result.data?.updateApplicationInfo) {
        alert("정보가 성공적으로 수정되었습니다.");
        setIsEditingInfo(false);
      }
    } catch (error) {
      console.error("정보 수정 오류:", error);
      alert("정보 수정 중 오류가 발생했습니다.");
    }
  };
  const handleAddMemo = async (applicationId) => {
    if (!memoContent.trim()) {
      alert("메모 내용을 입력해주세요.");
      return;
    }

    try {
      console.log("Adding memo for application:", applicationId, "Type:", typeof applicationId);

      const result = await addMemo({
        variables: {
          applicationId: applicationId.toString(), // ID를 명시적으로 문자열로 변환
          content: memoContent,
        },
        // Apollo Cache 업데이트 - optimistic response 제거하고 직접 캐시 업데이트
        update: (cache, { data }) => {
          if (data?.addApplicationMemo) {
            // Apollo Cache에서 메모 쿼리 업데이트
            try {
              const existingMemos = cache.readQuery({
                query: GET_APPLICATION_MEMOS,
                variables: { applicationId: applicationId.toString() },
              });

              if (existingMemos?.getApplicationMemos) {
                // 새 메모를 기존 메모 목록에 추가
                const updatedMemos = [...existingMemos.getApplicationMemos, data.addApplicationMemo];

                cache.writeQuery({
                  query: GET_APPLICATION_MEMOS,
                  variables: { applicationId: applicationId.toString() },
                  data: {
                    getApplicationMemos: updatedMemos,
                  },
                });

                console.log("Cache updated successfully with new memo");
              } else {
                // 기존 메모가 없으면 새 메모만 포함된 배열 생성
                cache.writeQuery({
                  query: GET_APPLICATION_MEMOS,
                  variables: { applicationId: applicationId.toString() },
                  data: {
                    getApplicationMemos: [data.addApplicationMemo],
                  },
                });
              }
            } catch (cacheError) {
              console.log("Cache update error for memos:", cacheError);
              // 캐시 업데이트 실패 시 쿼리 리페치
              if (refetchMemos) {
                refetchMemos();
              }
            }
          }
        },
      });

      if (result.data?.addApplicationMemo) {
        alert("메모가 성공적으로 추가되었습니다.");
        setMemoContent("");
      }
    } catch (error) {
      console.error("메모 추가 오류:", error);
      alert("메모 추가 중 오류가 발생했습니다.");

      // 오류 발생 시 메모 목록 새로고침
      if (refetchMemos) {
        refetchMemos();
      }
    }
  };

  const handleEditMemo = (memo) => {
    setEditingMemoId(memo.id);
    setEditingMemoContent(memo.content);
  };

  const handleCancelEditMemo = () => {
    setEditingMemoId(null);
    setEditingMemoContent("");
  };

  const handleUpdateMemo = async (memoId) => {
    try {
      console.log("Updating memo:", memoId, "Content:", editingMemoContent);

      const result = await updateMemo({
        variables: {
          id: memoId.toString(),
          content: editingMemoContent,
        },
        // Optimistic response
        optimisticResponse: {
          updateApplicationMemo: {
            __typename: "MemoResponse",
            id: memoId.toString(),
            content: editingMemoContent,
            updated_at: new Date().toISOString(),
            created_by: "관리자", // This should come from user context
          },
        },
        // Update Apollo Cache
        update: (cache, { data }) => {
          if (data?.updateApplicationMemo && selectedApplication?.id) {
            try {
              const existingMemos = cache.readQuery({
                query: GET_APPLICATION_MEMOS,
                variables: { applicationId: selectedApplication.id.toString() },
              });

              if (existingMemos?.getApplicationMemos) {
                const updatedMemos = existingMemos.getApplicationMemos.map((memo) => (memo.id === memoId.toString() ? data.updateApplicationMemo : memo));

                cache.writeQuery({
                  query: GET_APPLICATION_MEMOS,
                  variables: { applicationId: selectedApplication.id.toString() },
                  data: {
                    getApplicationMemos: updatedMemos,
                  },
                });
              }
            } catch (cacheError) {
              console.log("Cache update error for memo update:", cacheError);
              if (refetchMemos) {
                refetchMemos();
              }
            }
          }
        },
      });

      if (result.data?.updateApplicationMemo) {
        alert("메모가 성공적으로 수정되었습니다.");
        setEditingMemoId(null);
        setEditingMemoContent("");
      }
    } catch (error) {
      console.error("메모 수정 오류:", error);
      alert("메모 수정 중 오류가 발생했습니다: " + (error.message || "알 수 없는 오류"));
    }
  };

  const handleDeleteMemo = async (memoId) => {
    if (!confirm("정말로 이 메모를 삭제하시겠습니까?")) {
      return;
    }

    try {
      console.log("Deleting memo:", memoId);

      const result = await deleteMemo({
        variables: {
          id: memoId.toString(),
        },
        // Update Apollo Cache
        update: (cache, { data }) => {
          if (data?.deleteApplicationMemo?.success && selectedApplication?.id) {
            try {
              const existingMemos = cache.readQuery({
                query: GET_APPLICATION_MEMOS,
                variables: { applicationId: selectedApplication.id.toString() },
              });

              if (existingMemos?.getApplicationMemos) {
                const updatedMemos = existingMemos.getApplicationMemos.filter((memo) => memo.id !== memoId.toString());

                cache.writeQuery({
                  query: GET_APPLICATION_MEMOS,
                  variables: { applicationId: selectedApplication.id.toString() },
                  data: {
                    getApplicationMemos: updatedMemos,
                  },
                });
              }
            } catch (cacheError) {
              console.log("Cache update error for memo deletion:", cacheError);
              if (refetchMemos) {
                refetchMemos();
              }
            }
          }
        },
      });

      if (result.data?.deleteApplicationMemo?.success) {
        alert("메모가 성공적으로 삭제되었습니다.");
      }
    } catch (error) {
      console.error("메모 삭제 오류:", error);
      alert("메모 삭제 중 오류가 발생했습니다: " + (error.message || "알 수 없는 오류"));

      // 오류 발생 시 메모 목록 새로고침
      if (refetchMemos) {
        refetchMemos();
      }
    }
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case "PENDING":
        return {
          label: "접수 대기",
          color: "bg-yellow-100 text-yellow-800",
          icon: Clock,
        };
      case "PROCESSING":
        return {
          label: "처리 중",
          color: "bg-blue-100 text-blue-800",
          icon: AlertTriangle,
        };
      case "CONSULTATION":
        return {
          label: "상담 중",
          color: "bg-orange-100 text-orange-800",
          icon: Send,
        };
      case "APPROVED":
        return {
          label: "승인 완료",
          color: "bg-green-100 text-green-800",
          icon: CheckCircle,
        };
      case "REJECTED":
        return {
          label: "반려",
          color: "bg-red-100 text-red-800",
          icon: XCircle,
        };
      default:
        return {
          label: status,
          color: "bg-gray-100 text-gray-800",
          icon: Clock,
        };
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "urgent":
        return "border-l-4 border-red-500";
      case "high":
        return "border-l-4 border-orange-500";
      case "normal":
        return "border-l-4 border-blue-500";
      default:
        return "border-l-4 border-gray-300";
    }
  };

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.application_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) return <div className="p-6">로딩 중...</div>;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center text-3xl font-bold text-gray-900">
            <FileText className="w-8 h-8 mr-3" />
            비자 신청 관리
          </h1>
          <p className="mt-2 text-gray-600">모든 비자 신청을 체계적으로 관리하고 처리 상태를 추적합니다.</p>
        </div>
        <div className="flex space-x-3">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Download className="w-4 h-4 mr-2" />
            엑셀 다운로드
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                <Input placeholder="신청번호, 이름, 이메일로 검색..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
              </div>
            </div>
            <div className="flex space-x-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">모든 상태</option>
                <option value="PENDING">접수 대기</option>
                <option value="PROCESSING">처리 중</option>
                <option value="CONSULTATION">상담 중</option>
                <option value="APPROVED">승인 완료</option>
                <option value="REJECTED">반려</option>
              </select>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                필터
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.map((application) => {
          const statusInfo = getStatusInfo(application.status);
          const StatusIcon = statusInfo.icon;

          return (
            <Card key={application.id} className={`hover:shadow-lg transition-shadow ${getPriorityColor(application.priority)}`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
                      <FileText className="w-6 h-6 text-white" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-4">
                        <h3 className="text-lg font-semibold text-gray-900">{application.full_name}</h3>
                        <span className="text-sm text-gray-500">#{application.application_number}</span>
                        {application.priority === "urgent" && <span className="px-2 py-1 text-xs font-medium text-red-800 bg-red-100 rounded-full">긴급</span>}
                        {application.priority === "high" && <span className="px-2 py-1 text-xs font-medium text-orange-800 bg-orange-100 rounded-full">우선</span>}
                      </div>

                      <div className="flex items-center space-x-6 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Globe className="w-4 h-4" />
                          <span>{application.visa_type}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span>{application.nationality}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(application.arrival_date).toLocaleDateString("ko-KR")}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Phone className="w-4 h-4" />
                          <span>{application.phone}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    {/* Status Badge */}
                    <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 ${statusInfo.color}`}>
                      <StatusIcon className="w-4 h-4" />
                      <span>{statusInfo.label}</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      {" "}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedApplication(application);
                        }}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        상세보기
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleEditInformation(application)}>
                        <Edit className="w-4 h-4 mr-1" />
                        수정
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Progress Timeline */}
                <div className="pt-4 mt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>신청일: {new Date(application.created_at).toLocaleDateString("ko-KR")}</span>
                    <span>최종 업데이트: {new Date(application.updated_at).toLocaleDateString("ko-KR")}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredApplications.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500">조건에 맞는 신청 건이 없습니다.</p>
          </CardContent>
        </Card>
      )}

      {/* Application Detail Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">신청 상세 정보</h2>{" "}
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedApplication(null);
                  setIsEditingInfo(false); // 편집 상태 초기화
                  setMemoContent(""); // 메모 입력 내용 초기화
                }}
              >
                닫기
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2">
                  <div>
                    <h3 className="mb-4 text-lg font-semibold">기본 정보</h3>
                    {isEditingInfo ? (
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm text-gray-600">신청자명</label>
                          <Input value={editForm.full_name} onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })} className="mt-1" />
                        </div>
                        <div>
                          <label className="text-sm text-gray-600">이메일</label>
                          <Input value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} className="mt-1" />
                        </div>
                        <div>
                          <label className="text-sm text-gray-600">전화번호</label>
                          <Input value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} className="mt-1" />
                        </div>
                        <div>
                          <label className="text-sm text-gray-600">입국 예정일</label>
                          <Input type="date" value={editForm.arrival_date} onChange={(e) => setEditForm({ ...editForm, arrival_date: e.target.value })} className="mt-1" />
                        </div>
                        <div>
                          <label className="text-sm text-gray-600">출국 예정일</label>
                          <Input type="date" value={editForm.departure_date} onChange={(e) => setEditForm({ ...editForm, departure_date: e.target.value })} className="mt-1" />
                        </div>
                        <div className="flex mt-4 space-x-2">
                          <Button onClick={() => handleSaveInformation(selectedApplication.id)} className="bg-green-600 hover:bg-green-700">
                            저장
                          </Button>
                          <Button variant="outline" onClick={() => setIsEditingInfo(false)}>
                            취소
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm text-gray-600">신청번호</label>
                          <p className="font-medium">{selectedApplication.application_number}</p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-600">신청자명</label>
                          <p className="font-medium">{selectedApplication.full_name}</p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-600">비자 유형</label>
                          <p className="font-medium">{selectedApplication.visa_type}</p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-600">여권번호</label>
                          <p className="font-medium">{selectedApplication.passport_number}</p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-600">입국 예정일</label>
                          <p className="font-medium">{new Date(selectedApplication.arrival_date).toLocaleDateString("ko-KR")}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="mb-4 text-lg font-semibold">연락처 정보</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm text-gray-600">이메일</label>
                        <p className="font-medium">{selectedApplication.email}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">전화번호</label>
                        <p className="font-medium">{selectedApplication.phone}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">국적</label>
                        <p className="font-medium">{selectedApplication.nationality}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">출국 예정일</label>
                        <p className="font-medium">{new Date(selectedApplication.departure_date).toLocaleDateString("ko-KR")}</p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* 진행 상태 타임라인 */}
                <div className="mb-6">
                  <h3 className="mb-4 text-lg font-semibold">처리 진행 상황</h3>
                  <div className="space-y-4">
                    {[
                      {
                        status: "received",
                        label: "접수 완료",
                        date: "2024-01-15 09:30",
                        completed: true,
                      },
                      {
                        status: "reviewing",
                        label: "서류 검토",
                        date: "2024-01-15 14:20",
                        completed: true,
                      },
                      {
                        status: "submitted",
                        label: "기관 제출",
                        date: "2024-01-16 10:15",
                        completed: selectedApplication.status !== "PENDING",
                      },
                      {
                        status: "approved",
                        label: "승인 완료",
                        date: "",
                        completed: selectedApplication.status === "APPROVED",
                      },
                    ].map((step, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step.completed ? "bg-green-500 text-white" : "bg-gray-200 text-gray-600"}`}>
                          {step.completed ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                        </div>
                        <div className="flex-1">
                          <p className={`font-medium ${step.completed ? "text-green-700" : "text-gray-600"}`}>{step.label}</p>
                          {step.date && <p className="text-sm text-gray-500">{step.date}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>{" "}
                {/* 내부 메모 */}
                <div>
                  <h3 className="mb-4 text-lg font-semibold">내부 메모</h3> {/* 기존 메모들 */}
                  <div className="mb-4 space-y-3">
                    {memosLoading ? (
                      <div className="p-4 rounded-lg bg-gray-50">
                        <p className="text-gray-500">메모를 불러오는 중...</p>
                      </div>
                    ) : memosError ? (
                      <div className="p-4 rounded-lg bg-red-50">
                        <p className="text-red-600">메모를 불러오는 중 오류가 발생했습니다.</p>
                        <Button variant="outline" size="sm" className="mt-2" onClick={() => refetchMemos()}>
                          다시 시도
                        </Button>
                      </div>
                    ) : (
                      <>
                        {" "}
                        {/* 서버에서 가져온 메모들만 표시 */}
                        {memosData?.getApplicationMemos?.map((memo) => (
                          <div key={memo.id} className="p-4 rounded-lg bg-gray-50 border-l-4 border-blue-500">
                            <div className="flex justify-between items-start mb-2">
                              <p className="text-sm text-gray-600">
                                {new Date(memo.created_at).toLocaleString("ko-KR")} - {memo.created_by}
                                {memo.updated_at && memo.updated_at !== memo.created_at && <span className="text-gray-400 ml-2">(수정됨: {new Date(memo.updated_at).toLocaleString("ko-KR")})</span>}
                              </p>
                              <div className="flex gap-2">
                                <Button variant="ghost" size="sm" onClick={() => handleEditMemo(memo)} className="p-1 h-6 w-6" title="메모 편집">
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleDeleteMemo(memo.id)} className="p-1 h-6 w-6 text-red-600 hover:text-red-700" title="메모 삭제">
                                  <XCircle className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>

                            {editingMemoId === memo.id ? (
                              <div className="space-y-2">
                                <textarea
                                  value={editingMemoContent}
                                  onChange={(e) => setEditingMemoContent(e.target.value)}
                                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  rows={3}
                                  placeholder="메모 내용을 입력하세요..."
                                />
                                <div className="flex gap-2">
                                  <Button size="sm" onClick={() => handleUpdateMemo(memo.id)} disabled={!editingMemoContent.trim()} className="bg-green-600 hover:bg-green-700">
                                    저장
                                  </Button>
                                  <Button size="sm" variant="outline" onClick={handleCancelEditMemo}>
                                    취소
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <p className="text-gray-700 whitespace-pre-wrap">{memo.content}</p>
                            )}
                          </div>
                        ))}
                        {/* 메모가 없는 경우 */}
                        {!memosData?.getApplicationMemos?.length && (
                          <div className="p-4 rounded-lg bg-gray-50">
                            <p className="text-gray-500">아직 메모가 없습니다.</p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  {/* 새 메모 추가 */}
                  <textarea
                    placeholder="새 메모 추가..."
                    value={memoContent}
                    onChange={(e) => setMemoContent(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                  <Button className="mt-2 bg-gray-600 hover:bg-gray-700" onClick={() => handleAddMemo(selectedApplication.id)} disabled={!memoContent.trim()}>
                    메모 추가
                  </Button>
                </div>
              </div>

              {/* 사이드바 - 상태 관리 */}
              <div className="space-y-6">
                <div>
                  <h3 className="mb-4 text-lg font-semibold">상태 관리</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block mb-2 text-sm text-gray-600">현재 상태</label>
                      <select
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        defaultValue={selectedApplication.status}
                        data-app-id={selectedApplication.id}
                      >
                        <option value="PENDING">접수 대기</option>
                        <option value="PROCESSING">처리 중</option>
                        <option value="CONSULTATION">상담 중</option>
                        <option value="APPROVED">승인 완료</option>
                        <option value="REJECTED">반려</option>
                      </select>
                    </div>{" "}
                    <Button
                      className="w-full bg-green-600 hover:bg-green-700"
                      onClick={() => {
                        const select = document.querySelector(`select[data-app-id="${selectedApplication.id}"]`);
                        if (select) {
                          console.log("Status update - Application ID:", selectedApplication.id, "Type:", typeof selectedApplication.id);
                          handleStatusUpdate(selectedApplication.id, select.value);
                          // 상태 업데이트 후 모달을 닫지 않음 - 사용자가 수동으로 닫도록 함
                          // setSelectedApplication(null);
                        }
                      }}
                    >
                      상태 업데이트
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="mb-4 text-lg font-semibold">빠른 작업</h3>
                  <div className="space-y-2">
                    <Button variant="outline" className="justify-start w-full" onClick={() => setIsEmailModalOpen(true)}>
                      <Mail className="w-4 h-4 mr-2" />
                      고객에게 이메일 발송
                    </Button>
                    <Button variant="outline" className="justify-start w-full" onClick={() => handleDownloadDocuments(selectedApplication.id)}>
                      <Download className="w-4 h-4 mr-2" />
                      서류 다운로드
                    </Button>
                    <Button variant="outline" className="justify-start w-full" onClick={() => handleEditInformation(selectedApplication)}>
                      <Edit className="w-4 h-4 mr-2" />
                      정보 수정
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="mb-4 text-lg font-semibold">제출 서류</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 border rounded bg-green-50">
                      <span className="text-sm">여권 사본</span>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </div>
                    <div className="flex items-center justify-between p-2 border rounded bg-green-50">
                      <span className="text-sm">증명사진</span>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </div>
                    <div className="flex items-center justify-between p-2 border rounded bg-yellow-50">
                      <span className="text-sm">초청장</span>
                      <AlertTriangle className="w-4 h-4 text-yellow-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Email Modal */}
      {isEmailModalOpen && selectedApplication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-2xl p-6 mx-4 bg-white rounded-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">이메일 발송</h2>
              <Button variant="outline" onClick={() => setIsEmailModalOpen(false)}>
                닫기
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-sm text-gray-600">받는 사람</label>
                <p className="font-medium">{selectedApplication.email}</p>
              </div>

              <div>
                <label className="block mb-2 text-sm text-gray-600">이메일 유형</label>
                <select value={emailType} onChange={(e) => setEmailType(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="status_update">상태 업데이트</option>
                  <option value="document_request">서류 요청</option>
                  <option value="approval_notice">승인 안내</option>
                  <option value="rejection_notice">반려 안내</option>
                  <option value="general">일반 안내</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 text-sm text-gray-600">내용</label>
                <textarea
                  value={emailContent}
                  onChange={(e) => setEmailContent(e.target.value)}
                  placeholder="이메일 내용을 입력하세요..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={8}
                />
              </div>

              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setIsEmailModalOpen(false)}>
                  취소
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => handleSendEmail(selectedApplication.id)}>
                  <Send className="w-4 h-4 mr-2" />
                  이메일 발송
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
