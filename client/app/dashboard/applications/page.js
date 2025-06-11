"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_VISA_APPLICATIONS, UPDATE_APPLICATION_STATUS_MUTATION } from "../../src/lib/graphql";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../src/components/ui/card";
import { Button } from "../../src/components/ui/button";
import { Input } from "../../src/components/ui/input";
import {
  FileText,
  Search,
  Filter,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Download,
  Send,
  User,
  Calendar,
  Globe,
  Phone,
  Mail,
} from "lucide-react";

export default function ApplicationsManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedApplication, setSelectedApplication] = useState(null);

  const { data, loading, error, refetch } = useQuery(GET_VISA_APPLICATIONS);
  const [updateApplicationStatus] = useMutation(UPDATE_APPLICATION_STATUS_MUTATION);

  // Use real data from backend or fallback to mock data
  const applications = data?.getVisaApplications || [
    {
      id: 1,
      application_number: "VN-2024-001",
      full_name: "김민수",
      visa_type: "E-visa",
      status: "pending_review",
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
      status: "document_required",
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
      status: "submitted_to_authority",
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
      status: "approved",
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
      await updateApplicationStatus({
        variables: {
          id: applicationId,
          status: newStatus
        }
      });
      refetch();
    } catch (error) {
      console.error('상태 업데이트 오류:', error);
    }
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case "pending_review":
        return {
          label: "검토 대기",
          color: "bg-yellow-100 text-yellow-800",
          icon: Clock,
        };
      case "document_required":
        return {
          label: "서류 보완 필요",
          color: "bg-orange-100 text-orange-800",
          icon: AlertTriangle,
        };
      case "submitted_to_authority":
        return {
          label: "기관 제출",
          color: "bg-blue-100 text-blue-800",
          icon: Send,
        };
      case "approved":
        return {
          label: "승인 완료",
          color: "bg-green-100 text-green-800",
          icon: CheckCircle,
        };
      case "rejected":
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
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <FileText className="h-8 w-8 mr-3" />
            비자 신청 관리
          </h1>
          <p className="text-gray-600 mt-2">
            모든 비자 신청을 체계적으로 관리하고 처리 상태를 추적합니다.
          </p>
        </div>
        <div className="flex space-x-3">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Download className="h-4 w-4 mr-2" />
            엑셀 다운로드
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="신청번호, 이름, 이메일로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex space-x-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">모든 상태</option>
                <option value="pending_review">검토 대기</option>
                <option value="document_required">서류 보완 필요</option>
                <option value="submitted_to_authority">기관 제출</option>
                <option value="approved">승인 완료</option>
                <option value="rejected">반려</option>
              </select>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
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
            <Card
              key={application.id}
              className={`hover:shadow-lg transition-shadow ${getPriorityColor(application.priority)}`}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <FileText className="h-6 w-6 text-white" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {application.full_name}
                        </h3>
                        <span className="text-sm text-gray-500">
                          #{application.application_number}
                        </span>
                        {application.priority === "urgent" && (
                          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                            긴급
                          </span>
                        )}
                        {application.priority === "high" && (
                          <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">
                            우선
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-6 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Globe className="h-4 w-4" />
                          <span>{application.visa_type}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>{application.nationality}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {new Date(
                              application.arrival_date,
                            ).toLocaleDateString("ko-KR")}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Phone className="h-4 w-4" />
                          <span>{application.phone}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    {/* Status Badge */}
                    <div
                      className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 ${statusInfo.color}`}
                    >
                      <StatusIcon className="h-4 w-4" />
                      <span>{statusInfo.label}</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedApplication(application)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        상세보기
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        수정
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Progress Timeline */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>
                      신청일:{" "}
                      {new Date(application.created_at).toLocaleDateString(
                        "ko-KR",
                      )}
                    </span>
                    <span>
                      최종 업데이트:{" "}
                      {new Date(application.updated_at).toLocaleDateString(
                        "ko-KR",
                      )}
                    </span>
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
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">조건에 맞는 신청 건이 없습니다.</p>
          </CardContent>
        </Card>
      )}

      {/* Application Detail Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">신청 상세 정보</h2>
              <Button
                variant="outline"
                onClick={() => setSelectedApplication(null)}
              >
                닫기
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">기본 정보</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm text-gray-600">
                          신청번호
                        </label>
                        <p className="font-medium">
                          {selectedApplication.application_number}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">
                          신청자명
                        </label>
                        <p className="font-medium">
                          {selectedApplication.full_name}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">
                          비자 유형
                        </label>
                        <p className="font-medium">
                          {selectedApplication.visa_type}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">
                          여권번호
                        </label>
                        <p className="font-medium">
                          {selectedApplication.passport_number}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">
                          입국 예정일
                        </label>
                        <p className="font-medium">
                          {new Date(
                            selectedApplication.arrival_date,
                          ).toLocaleDateString("ko-KR")}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">연락처 정보</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm text-gray-600">이메일</label>
                        <p className="font-medium">
                          {selectedApplication.email}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">
                          전화번호
                        </label>
                        <p className="font-medium">
                          {selectedApplication.phone}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">국적</label>
                        <p className="font-medium">
                          {selectedApplication.nationality}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">
                          출국 예정일
                        </label>
                        <p className="font-medium">
                          {new Date(
                            selectedApplication.departure_date,
                          ).toLocaleDateString("ko-KR")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 진행 상태 타임라인 */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4">처리 진행 상황</h3>
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
                        completed:
                          selectedApplication.status !== "pending_review",
                      },
                      {
                        status: "approved",
                        label: "승인 완료",
                        date: "",
                        completed: selectedApplication.status === "approved",
                      },
                    ].map((step, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            step.completed
                              ? "bg-green-500 text-white"
                              : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {step.completed ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <Clock className="h-4 w-4" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p
                            className={`font-medium ${step.completed ? "text-green-700" : "text-gray-600"}`}
                          >
                            {step.label}
                          </p>
                          {step.date && (
                            <p className="text-sm text-gray-500">{step.date}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 내부 메모 */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">내부 메모</h3>
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <p className="text-sm text-gray-600 mb-2">
                      2024-01-16 14:20 - 김담당
                    </p>
                    <p className="text-gray-700">
                      서류 검토 완료. 모든 서류가 정상적으로 제출되었음.
                    </p>
                  </div>
                  <textarea
                    placeholder="새 메모 추가..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                  <Button className="mt-2 bg-gray-600 hover:bg-gray-700">
                    메모 추가
                  </Button>
                </div>
              </div>

              {/* 사이드바 - 상태 관리 */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">상태 관리</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-gray-600 mb-2 block">
                        현재 상태
                      </label>
                      <select
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        defaultValue={selectedApplication.status}
                        data-app-id={selectedApplication.id}
                      >
                        <option value="pending_review">검토 대기</option>
                        <option value="document_required">
                          서류 보완 필요
                        </option>
                        <option value="submitted_to_authority">
                          기관 제출
                        </option>
                        <option value="approved">승인 완료</option>
                        <option value="rejected">반려</option>
                      </select>
                    </div>
                    <Button 
                      className="w-full bg-green-600 hover:bg-green-700"
                      onClick={() => {
                        const select = document.querySelector(`select[data-app-id="${selectedApplication.id}"]`);
                        if (select) {
                          handleStatusUpdate(selectedApplication.id, select.value);
                          setSelectedApplication(null);
                        }
                      }}
                    >
                      상태 업데이트
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">빠른 작업</h3>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <Mail className="h-4 w-4 mr-2" />
                      고객에게 이메일 발송
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="h-4 w-4 mr-2" />
                      서류 다운로드
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Edit className="h-4 w-4 mr-2" />
                      정보 수정
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">제출 서류</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-green-50 rounded border">
                      <span className="text-sm">여권 사본</span>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="flex items-center justify-between p-2 bg-green-50 rounded border">
                      <span className="text-sm">증명사진</span>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="flex items-center justify-between p-2 bg-yellow-50 rounded border">
                      <span className="text-sm">초청장</span>
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
