"use client";

import React, { useState } from "react";
import { useQuery, useSubscription } from "@apollo/client";
import { useRouter } from "next/navigation";
import { GET_APPLICATIONS, GET_APPLICATION_STATUS_COUNTS, APPLICATION_CREATED_SUBSCRIPTION, APPLICATION_UPDATED_SUBSCRIPTION } from "../../src/lib/graphql/query/applications";
import { Card, CardContent, CardHeader, CardTitle } from "../../src/components/ui/card";
import { Button } from "../../src/components/ui/button";
import { Input } from "../../src/components/ui/input";
import { Badge } from "../../src/components/ui/badge";
import { Search, Filter, FileText, Calendar, User, Mail, Phone, MapPin, CheckCircle, AlertTriangle, FileCheck, Eye, ChevronLeft, ChevronRight, RefreshCw, Users, Activity, Clock } from "lucide-react";
import { getStatusLabel, getVisaTypeLabel, getProcessingTypeLabel } from "../../utils/enumMappings";

export default function ApplicationsPage() {
  const router = useRouter();

  // 페이지네이션 및 필터링 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [visaTypeFilter, setVisaTypeFilter] = useState("all");
  const [processingTypeFilter, setProcessingTypeFilter] = useState("all");
  const itemsPerPage = 10;

  // 인증 확인
  // React.useEffect(() => {
  //   const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  //   if (!token) {
  //     router.replace("/dashboard/login");
  //     return;
  //   }
  //   setAuthChecked(true);
  // }, [router]);  // 통계 데이터 조회
  const { data: statisticsData, loading: statisticsLoading } = useQuery(GET_APPLICATION_STATUS_COUNTS, {
    // skip: !authChecked,
    errorPolicy: "all",
    onCompleted: (data) => {
      console.log("📊 통계 데이터 로드 완료:", data);
    },
    onError: (error) => {
      console.error("❌ 통계 데이터 로드 실패:", error);
    },
  });
  // 신청서 목록 조회 (페이지네이션 및 필터링 포함)
  const { data, loading, error, refetch } = useQuery(GET_APPLICATIONS, {
    variables: {
      page: currentPage,
      limit: itemsPerPage,
      searchTerm: searchTerm || undefined,
      statusFilter: statusFilter !== "all" ? statusFilter : undefined,
      visaTypeFilter: visaTypeFilter !== "all" ? visaTypeFilter : undefined,
      processingTypeFilter: processingTypeFilter !== "all" ? processingTypeFilter : undefined,
    },
    // skip: !authChecked,
    errorPolicy: "all",
    fetchPolicy: "cache-and-network",
  });

  // 실시간 신청서 생성 구독
  useSubscription(APPLICATION_CREATED_SUBSCRIPTION, {
    onSubscriptionData: ({ subscriptionData }) => {
      console.log("🔔 새로운 신청서 생성:", subscriptionData.data?.applicationCreated);
      if (subscriptionData.data?.applicationCreated) {
        // 목록 새로고침
        refetch();
        // 통계 새로고침
        // statisticsRefetch?.();
      }
    },
    onError: (error) => {
      console.error("❌ APPLICATION_CREATED 구독 오류:", error);
    },
  });

  // 실시간 신청서 업데이트 구독
  useSubscription(APPLICATION_UPDATED_SUBSCRIPTION, {
    onSubscriptionData: ({ subscriptionData }) => {
      console.log("🔄 신청서 업데이트:", subscriptionData.data?.applicationUpdated);
      if (subscriptionData.data?.applicationUpdated) {
        // 목록 새로고침
        refetch();
      }
    },
    onError: (error) => {
      console.error("❌ APPLICATION_UPDATED 구독 오류:", error);
    },
  });

  // 검색 필터 변경 시 첫 페이지로 이동
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, visaTypeFilter, processingTypeFilter]);

  // 필터 초기화
  const handleResetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setVisaTypeFilter("all");
    setProcessingTypeFilter("all");
    setCurrentPage(1);
  };
  // 상태별 정보 함수 (아이콘과 색상은 유지, 라벨만 enum 매핑 사용)
  const getStatusInfo = (status) => {
    const statusMap = {
      PENDING: {
        label: getStatusLabel(status),
        color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: Clock,
      },
      PROCESSING: {
        label: getStatusLabel(status),
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: RefreshCw,
      },
      DOCUMENT_REVIEW: {
        label: getStatusLabel(status),
        color: "bg-orange-100 text-orange-800 border-orange-200",
        icon: FileCheck,
      },
      SUBMITTED_TO_AUTHORITY: {
        label: getStatusLabel(status),
        color: "bg-purple-100 text-purple-800 border-purple-200",
        icon: FileText,
      },
      APPROVED: {
        label: getStatusLabel(status),
        color: "bg-green-100 text-green-800 border-green-200",
        icon: CheckCircle,
      },
      REJECTED: {
        label: getStatusLabel(status),
        color: "bg-red-100 text-red-800 border-red-200",
        icon: AlertTriangle,
      },
      COMPLETED: {
        label: getStatusLabel(status),
        color: "bg-emerald-100 text-emerald-800 border-emerald-200",
        icon: CheckCircle,
      },
    };
    return (
      statusMap[status] || {
        label: getStatusLabel(status),
        color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: Clock,
      }
    );
  };

  // // 인증 에러 처리
  // React.useEffect(() => {
  //   if (
  //     error &&
  //     (error.message.includes("Authentication") ||
  //       error.message.includes("인증"))
  //   ) {
  //     if (typeof window !== "undefined") {
  //       localStorage.removeItem("accessToken");
  //       localStorage.removeItem("refreshToken");
  //     }
  //     router.replace("/dashboard/login");
  //   }
  // }, [error, router]);  // 통계 데이터
  const statistics = statisticsData?.applicationStatusCounts || {
    pending: 0,
    processing: 0,
    document_review: 0,
    submitted_to_authority: 0,
    approved: 0,
    completed: 0,
    total: 0,
  };

  // 디버깅용 로그
  React.useEffect(() => {
    console.log("📊 통계 데이터 상태:", {
      statisticsData,
      statistics,
      statisticsLoading,
    });
  }, [statisticsData, statistics, statisticsLoading]);

  // 페이지네이션 데이터
  const applicationsData = data?.applications || {};
  const applications = applicationsData.applications || [];
  const totalCount = applicationsData.totalCount || 0;
  const totalPages = applicationsData.totalPages || 1;
  const hasNextPage = applicationsData.hasNextPage || false;
  const hasPreviousPage = applicationsData.hasPreviousPage || false;

  // if (!authChecked) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen">
  //       <div className="flex items-center space-x-2">
  //         <RefreshCw className="w-6 h-6 text-blue-600 animate-spin" />
  //         <span className="text-gray-600">인증 확인 중...</span>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="p-4 space-y-6 md:p-6 lg:p-8">
        {/* 헤더 */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="flex items-center text-2xl font-bold text-gray-900 md:text-3xl">
              <FileText className="mr-3 text-blue-600 w-7 h-7 md:w-8 md:h-8" />
              비자 신청 관리
            </h1>
            <p className="mt-2 text-sm text-gray-600 md:text-base">모든 비자 신청 건을 체계적으로 관리하고 처리 상태를 추적합니다</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => refetch()} disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              새로고침
            </Button>
          </div>
        </div>
        {/* 통계 카드 */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6 md:gap-4 lg:gap-3">
          <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center">
                <div className="p-2 bg-blue-200 rounded-lg">
                  <Clock className="w-4 h-4 text-blue-700 md:w-5 md:h-5" />
                </div>
                <div className="ml-2 md:ml-3">
                  <p className="text-xs font-medium text-blue-700">{getStatusLabel("PENDING")}</p>
                  <p className="text-lg font-bold text-blue-900 md:text-xl">{statisticsLoading ? "..." : statistics.pending || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm bg-gradient-to-br from-yellow-50 to-yellow-100">
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-200 rounded-lg">
                  <Activity className="w-4 h-4 text-yellow-700 md:w-5 md:h-5" />
                </div>
                <div className="ml-2 md:ml-3">
                  <p className="text-xs font-medium text-yellow-700">{getStatusLabel("PROCESSING")}</p>
                  <p className="text-lg font-bold text-yellow-900 md:text-xl">{statisticsLoading ? "..." : statistics.processing || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm bg-gradient-to-br from-orange-50 to-orange-100">
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center">
                <div className="p-2 bg-orange-200 rounded-lg">
                  <FileCheck className="w-4 h-4 text-orange-700 md:w-5 md:h-5" />
                </div>
                <div className="ml-2 md:ml-3">
                  <p className="text-xs font-medium text-orange-700">{getStatusLabel("DOCUMENT_REVIEW")}</p>
                  <p className="text-lg font-bold text-orange-900 md:text-xl">{statisticsLoading ? "..." : statistics.document_review || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center">
                <div className="p-2 bg-purple-200 rounded-lg">
                  <FileText className="w-4 h-4 text-purple-700 md:w-5 md:h-5" />
                </div>
                <div className="ml-2 md:ml-3">
                  <p className="text-xs font-medium text-purple-700">{getStatusLabel("SUBMITTED_TO_AUTHORITY")}</p>
                  <p className="text-lg font-bold text-purple-900 md:text-xl">{statisticsLoading ? "..." : statistics.submitted_to_authority || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center">
                <div className="p-2 bg-green-200 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-green-700 md:w-5 md:h-5" />
                </div>
                <div className="ml-2 md:ml-3">
                  <p className="text-xs font-medium text-green-700">{getStatusLabel("APPROVED")}</p>
                  <p className="text-lg font-bold text-green-900 md:text-xl">{statisticsLoading ? "..." : statistics.approved || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm bg-gradient-to-br from-emerald-50 to-emerald-100">
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-emerald-200">
                  <Users className="w-4 h-4 text-emerald-700 md:w-5 md:h-5" />
                </div>
                <div className="ml-2 md:ml-3">
                  <p className="text-xs font-medium text-emerald-700">{getStatusLabel("COMPLETED")}</p>
                  <p className="text-lg font-bold text-emerald-900 md:text-xl">{statisticsLoading ? "..." : statistics.completed || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* 검색 및 필터 */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 md:p-6">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-5 md:gap-4">
              <div className="relative lg:col-span-2">
                <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                <Input placeholder="신청자명, 신청번호, 이메일 검색..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 border-gray-200 focus:border-blue-500" />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">모든 상태</option>
                <option value="PENDING">{getStatusLabel("PENDING")}</option>
                <option value="PROCESSING">{getStatusLabel("PROCESSING")}</option>
                <option value="DOCUMENT_REVIEW">{getStatusLabel("DOCUMENT_REVIEW")}</option>
                <option value="SUBMITTED_TO_AUTHORITY">{getStatusLabel("SUBMITTED_TO_AUTHORITY")}</option>
                <option value="APPROVED">{getStatusLabel("APPROVED")}</option>
                <option value="REJECTED">{getStatusLabel("REJECTED")}</option>
                <option value="COMPLETED">{getStatusLabel("COMPLETED")}</option>
              </select>
              <select
                value={visaTypeFilter}
                onChange={(e) => setVisaTypeFilter(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">모든 비자 타입</option>
                <option value="E_VISA_GENERAL">{getVisaTypeLabel("E_VISA_GENERAL")}</option>
                <option value="E_VISA_URGENT">{getVisaTypeLabel("E_VISA_URGENT")}</option>
                <option value="E_VISA_TRANSIT">{getVisaTypeLabel("E_VISA_TRANSIT")}</option>
                <option value="BUSINESS">{getVisaTypeLabel("BUSINESS")}</option>
                <option value="TOURIST">{getVisaTypeLabel("TOURIST")}</option>
                <option value="WORK">{getVisaTypeLabel("WORK")}</option>
                <option value="STUDENT">{getVisaTypeLabel("STUDENT")}</option>
              </select>
              <Button variant="outline" onClick={handleResetFilters} className="border-gray-200 hover:bg-gray-50">
                <Filter className="w-4 h-4 mr-2" />
                초기화
              </Button>
            </div>

            <div className="mt-4 text-xs text-gray-600 md:text-sm">
              전체 {totalCount}건 중 {applications.length}건 표시
            </div>
          </CardContent>
        </Card>
        {/* 신청서 목록 */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="text-lg font-semibold text-gray-900">신청 목록</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
                <span className="ml-2 text-gray-600">로딩 중...</span>
              </div>
            ) : error ? (
              <div className="py-12 text-center">
                <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-red-500" />
                <p className="mb-4 text-red-600">데이터를 불러오는 중 오류가 발생했습니다.</p>
                <p className="mb-4 text-sm text-gray-500">{error.message}</p>
                <Button variant="outline" onClick={() => refetch()}>
                  다시 시도
                </Button>
              </div>
            ) : applications.length === 0 ? (
              <div className="py-12 text-center">
                <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">검색 조건에 맞는 신청 내역이 없습니다.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {applications.map((app, index) => {
                  const statusInfo = getStatusInfo(app.status);
                  const StatusIcon = statusInfo.icon;

                  return (
                    <div
                      key={app.id}
                      className="p-4 transition-all duration-200 cursor-pointer md:p-6 hover:bg-gray-50 hover:shadow-sm"
                      onClick={() => router.push(`/dashboard/applications/${app.id}`)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          router.push(`/dashboard/applications/${app.id}`);
                        }
                      }}
                    >
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex-1 space-y-3">
                          {/* 헤더 라인 */}
                          <div className="flex flex-wrap items-center gap-2 md:gap-3">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-gray-500" />
                              <h3 className="text-base font-semibold text-gray-900 md:text-lg">{app.personalInfo?.fullName}</h3>
                            </div>
                            <Badge variant="outline" className="font-mono text-xs">
                              {app.applicationId}
                            </Badge>
                            <Badge className={`${statusInfo.color} border text-xs`}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {statusInfo.label}
                            </Badge>
                          </div>

                          {/* 상세 정보 그리드 */}
                          <div className="grid grid-cols-1 gap-2 text-sm text-gray-600 md:grid-cols-2 lg:grid-cols-3">
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-gray-400" />
                              <span className="truncate">{app.personalInfo?.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-gray-400" />
                              <span>{app.personalInfo?.phone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span>
                                {new Date(app.createdAt).toLocaleString("ko-KR", {
                                  year: "numeric",
                                  month: "2-digit",
                                  day: "2-digit",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  second: "2-digit",
                                })}
                              </span>
                            </div>
                          </div>

                          {/* 서비스 정보 */}
                          <div className="flex flex-wrap gap-2">
                            {app.travelInfo?.visaType && (
                              <span className="inline-flex items-center px-2 py-1 text-xs text-blue-800 bg-blue-100 border border-blue-200 rounded-full">
                                {getVisaTypeLabel(app.travelInfo.visaType)}
                              </span>
                            )}
                            {app.processingType && (
                              <span className="inline-flex items-center px-2 py-1 text-xs text-purple-800 bg-purple-100 border border-purple-200 rounded-full">
                                {getProcessingTypeLabel(app.processingType)}
                              </span>
                            )}
                            {app.travelInfo?.entryPort && (
                              <span className="inline-flex items-center px-2 py-1 text-xs text-gray-600 bg-gray-100 border border-gray-200 rounded-full">
                                <MapPin className="w-3 h-3 mr-1" />
                                {app.travelInfo.entryPort}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between lg:flex-col lg:items-end lg:gap-2">
                          <div className="text-right">
                            <div className="text-lg font-semibold text-gray-900">₩{app.totalPrice?.toLocaleString()}</div>
                            <div className="text-xs text-gray-500">{app.travelInfo?.entryDate && `입국: ${new Date(app.travelInfo.entryDate).toLocaleDateString("ko-KR")}`}</div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/dashboard/applications/${app.id}`);
                            }}
                            className="border-gray-200 hover:bg-gray-50"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            상세보기
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* 페이지네이션 */}
            {totalPages > 1 && (
              <div className="flex flex-col gap-4 p-4 border-t border-gray-100 md:flex-row md:items-center md:justify-between md:p-6">
                <div className="text-sm text-gray-600">
                  {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, totalCount)} / {totalCount}
                </div>

                <div className="flex items-center justify-center gap-2 md:justify-end">
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={!hasPreviousPage || loading} className="border-gray-200">
                    <ChevronLeft className="w-4 h-4" />
                    이전
                  </Button>

                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => {
                      const page = i + 1;
                      if (page === 1 || page === totalPages || (page >= currentPage - 2 && page <= currentPage + 2)) {
                        return (
                          <Button key={page} variant={page === currentPage ? "default" : "outline"} size="sm" onClick={() => setCurrentPage(page)} className="w-8 h-8 p-0" disabled={loading}>
                            {page}
                          </Button>
                        );
                      } else if (page === currentPage - 3 || page === currentPage + 3) {
                        return (
                          <span key={page} className="px-2 py-1 text-sm text-gray-400">
                            ...
                          </span>
                        );
                      }
                      return null;
                    })}
                  </div>

                  <Button variant="outline" size="sm" onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={!hasNextPage || loading} className="border-gray-200">
                    다음
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
