"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import { GET_APPLICATIONS, GET_APPLICATION } from "../../src/lib/graphql/query/applications";
import { UPDATE_APPLICATION_INFO_MUTATION } from "../../src/lib/graphql/mutation/applications";
import { Card, CardContent, CardHeader, CardTitle } from "../../src/components/ui/card";
import { Button } from "../../src/components/ui/button";
import { Input } from "../../src/components/ui/input";
import { Badge } from "../../src/components/ui/badge";
import { Search, Filter, FileText, Calendar, User, Mail, Phone, CreditCard, Clock, CheckCircle, AlertTriangle, FileCheck, Eye, Edit, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";

export default function ApplicationsPage() {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState(null);
  const [editPassport, setEditPassport] = useState(false);
  const [passportForm, setPassportForm] = useState({});
  const [authChecked, setAuthChecked] = useState(false);

  // 페이지네이션 및 필터링 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [visaTypeFilter, setVisaTypeFilter] = useState("all");
  const itemsPerPage = 10;

  // 인증 확인
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    if (!token) {
      router.replace("/dashboard/login");
      return;
    }
    setAuthChecked(true);
  }, [router]);
  // 전체 신청서 목록 - 인증 후에만 실행
  const { data, loading, error } = useQuery(GET_APPLICATIONS, {
    skip: !authChecked,
    errorPolicy: "all",
  });

  // 신청서 데이터 추출
  const applications = data?.applications || [];

  // 필터링된 신청서 목록
  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const matchesSearch =
        searchTerm === "" ||
        `${app.personalInfo?.firstName} ${app.personalInfo?.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.applicationId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.personalInfo?.email?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === "all" || app.status === statusFilter;
      const matchesVisaType = visaTypeFilter === "all" || app.travelInfo?.visaType === visaTypeFilter;

      return matchesSearch && matchesStatus && matchesVisaType;
    });
  }, [applications, searchTerm, statusFilter, visaTypeFilter]);

  // 페이지네이션 계산
  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentApplications = filteredApplications.slice(startIndex, endIndex);

  // 상태별 정보 함수
  const getStatusInfo = (status) => {
    const statusMap = {
      PENDING: { label: "접수 완료", color: "bg-blue-100 text-blue-800", icon: Clock },
      PROCESSING: { label: "처리 중", color: "bg-yellow-100 text-yellow-800", icon: RefreshCw },
      DOCUMENT_REVIEW: { label: "서류 검토", color: "bg-orange-100 text-orange-800", icon: FileCheck },
      SUBMITTED_TO_AUTHORITY: { label: "기관 제출", color: "bg-purple-100 text-purple-800", icon: FileText },
      APPROVED: { label: "승인 완료", color: "bg-green-100 text-green-800", icon: CheckCircle },
      REJECTED: { label: "승인 거부", color: "bg-red-100 text-red-800", icon: AlertTriangle },
      COMPLETED: { label: "발급 완료", color: "bg-emerald-100 text-emerald-800", icon: CheckCircle },
    };
    return statusMap[status] || statusMap["PENDING"];
  };

  // 비자 타입별 라벨
  const getVisaTypeLabel = (type) => {
    const typeMap = {
      E_VISA_GENERAL: "E-VISA 일반",
      E_VISA_URGENT: "E-VISA 긴급",
      E_VISA_TRANSIT: "E-VISA 경유",
      BUSINESS: "비즈니스",
      TOURIST: "관광",
      WORK: "노동허가서",
    };
    return typeMap[type] || type;
  };

  // 인증 에러 처리
  useEffect(() => {
    if (error && (error.message.includes("Authentication") || error.message.includes("인증"))) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      }
      router.replace("/dashboard/login");
    }
  }, [error, router]);

  // 상세 신청서
  const { data: detailData, refetch } = useQuery(GET_APPLICATION, {
    variables: { id: selectedId },
    skip: !selectedId,
  });
  const application = detailData?.application;

  // 신청서 수정
  const [updateApplication, { loading: updating }] = useMutation(UPDATE_APPLICATION_INFO_MUTATION, {
    onCompleted: () => {
      setEditPassport(false);
      refetch();
    },
  });

  // 여권 정보 input 값 변경 핸들러
  const handlePassportChange = (e) => {
    setPassportForm({ ...passportForm, [e.target.name]: e.target.value });
  };

  // 여권 정보 수정 저장
  const handlePassportSave = () => {
    updateApplication({
      variables: {
        id: application.id,
        input: {
          documents: {
            passport: {
              ...application.documents.find((d) => d.type === "passport"),
              extractedInfo: {
                ...application.documents.find((d) => d.type === "passport")?.extractedInfo,
                ...passportForm,
              },
            },
          },
        },
      },
    });
  };
  // 목록 렌더링
  if (!selectedId) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="p-6 space-y-6">
          {/* 헤더 */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="flex items-center text-3xl font-bold text-gray-900">
                <FileText className="w-8 h-8 mr-3 text-blue-600" />
                비자 신청 관리
              </h1>
              <p className="mt-2 text-gray-600">모든 비자 신청 건을 체계적으로 관리하고 처리 상태를 추적합니다</p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={() => window.location.reload()}>
                <RefreshCw className="w-4 h-4 mr-2" />
                새로고침
              </Button>
            </div>
          </div>

          {/* 통계 카드 */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Clock className="w-8 h-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">처리 대기</p>
                    <p className="text-2xl font-bold text-gray-900">{filteredApplications.filter((app) => app.status === "PENDING").length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <RefreshCw className="w-8 h-8 text-yellow-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">처리 중</p>
                    <p className="text-2xl font-bold text-gray-900">{filteredApplications.filter((app) => ["PROCESSING", "DOCUMENT_REVIEW", "SUBMITTED_TO_AUTHORITY"].includes(app.status)).length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">완료</p>
                    <p className="text-2xl font-bold text-gray-900">{filteredApplications.filter((app) => ["APPROVED", "COMPLETED"].includes(app.status)).length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <FileText className="w-8 h-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">전체</p>
                    <p className="text-2xl font-bold text-gray-900">{filteredApplications.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 검색 및 필터 */}
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <div className="relative">
                  <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                  <Input placeholder="신청자명, 신청번호, 이메일 검색..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">모든 상태</option>
                  <option value="PENDING">접수 완료</option>
                  <option value="PROCESSING">처리 중</option>
                  <option value="DOCUMENT_REVIEW">서류 검토</option>
                  <option value="SUBMITTED_TO_AUTHORITY">기관 제출</option>
                  <option value="APPROVED">승인 완료</option>
                  <option value="REJECTED">승인 거부</option>
                  <option value="COMPLETED">발급 완료</option>
                </select>

                <select
                  value={visaTypeFilter}
                  onChange={(e) => setVisaTypeFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">모든 비자 타입</option>
                  <option value="E_VISA_GENERAL">E-VISA 일반</option>
                  <option value="E_VISA_URGENT">E-VISA 긴급</option>
                  <option value="E_VISA_TRANSIT">E-VISA 경유</option>
                  <option value="BUSINESS">비즈니스</option>
                  <option value="TOURIST">관광</option>
                  <option value="WORK">노동허가서</option>
                </select>

                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  필터 초기화
                </Button>
              </div>

              <div className="mt-4 text-sm text-gray-600">
                전체 {applications.length}건 중 {filteredApplications.length}건 표시
              </div>
            </CardContent>
          </Card>

          {/* 신청서 목록 */}
          <Card>
            <CardHeader>
              <CardTitle>신청 목록</CardTitle>
            </CardHeader>
            <CardContent>
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
                  <Button variant="outline" onClick={() => window.location.reload()}>
                    다시 시도
                  </Button>
                </div>
              ) : currentApplications.length === 0 ? (
                <div className="py-12 text-center">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">검색 조건에 맞는 신청 내역이 없습니다.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {currentApplications.map((app) => {
                    const statusInfo = getStatusInfo(app.status);
                    const StatusIcon = statusInfo.icon;

                    return (
                      <div
                        key={app.id}
                        className="p-6 transition-shadow bg-white border rounded-lg cursor-pointer hover:shadow-md"
                        onClick={() => router.push(`/dashboard/applications/${app.id}`)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            router.push(`/dashboard/applications/${app.id}`);
                          }
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-4 mb-3">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {app.personalInfo?.firstName} {app.personalInfo?.lastName}
                              </h3>
                              <Badge variant="outline" className="text-xs">
                                {app.applicationId}
                              </Badge>
                              <Badge className={statusInfo.color}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {statusInfo.label}
                              </Badge>
                            </div>

                            <div className="grid grid-cols-1 gap-4 text-sm text-gray-600 md:grid-cols-3">
                              <div className="flex items-center">
                                <Mail className="w-4 h-4 mr-2" />
                                {app.personalInfo?.email}
                              </div>
                              <div className="flex items-center">
                                <Phone className="w-4 h-4 mr-2" />
                                {app.personalInfo?.phone}
                              </div>
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-2" />
                                {new Date(app.createdAt).toLocaleDateString("ko-KR")}
                              </div>
                            </div>

                            {app.travelInfo?.visaType && (
                              <div className="mt-2">
                                <span className="inline-flex items-center px-2 py-1 text-xs text-blue-800 bg-blue-100 rounded-full">{getVisaTypeLabel(app.travelInfo.visaType)}</span>
                              </div>
                            )}
                          </div>{" "}
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/dashboard/applications/${app.id}`);
                              }}
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
                <div className="flex items-center justify-between pt-6 mt-6 border-t">
                  <div className="text-sm text-gray-600">
                    {startIndex + 1}-{Math.min(endIndex, filteredApplications.length)} / {filteredApplications.length}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1}>
                      <ChevronLeft className="w-4 h-4" />
                      이전
                    </Button>

                    <div className="flex space-x-1">
                      {Array.from({ length: totalPages }, (_, i) => {
                        const page = i + 1;
                        if (page === 1 || page === totalPages || (page >= currentPage - 2 && page <= currentPage + 2)) {
                          return (
                            <Button key={page} variant={page === currentPage ? "default" : "outline"} size="sm" onClick={() => setCurrentPage(page)} className="w-8 h-8 p-0">
                              {page}
                            </Button>
                          );
                        } else if (page === currentPage - 3 || page === currentPage + 3) {
                          return (
                            <span key={page} className="px-2">
                              ...
                            </span>
                          );
                        }
                        return null;
                      })}
                    </div>

                    <Button variant="outline" size="sm" onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages}>
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

  // 상세페이지 렌더링
  if (application) {
    // 여권 정보 추출
    const passportDoc = application.documents?.find((d) => d.type === "passport");
    const passportInfo = passportDoc?.extractedInfo || {};

    return (
      <div className="p-6 space-y-6">
        <Button onClick={() => setSelectedId(null)} variant="outline">
          ← 목록으로
        </Button>
        <Card>
          <CardHeader>
            <CardTitle>신청 상세 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="mb-2 font-bold">개인 정보</div>
              <div>
                이름: {application.personalInfo?.firstName} {application.personalInfo?.lastName}
              </div>
              <div>이메일: {application.personalInfo?.email}</div>
              <div>전화번호: {application.personalInfo?.phone}</div>
              <div>주소: {application.personalInfo?.address}</div>
            </div>
            <div>
              <div className="mb-2 font-bold">여권 정보</div>
              {!editPassport ? (
                <div className="space-y-1">
                  {" "}
                  <div>여권번호: {passportInfo.passportNo || passportInfo.passport_no}</div>
                  <div>이름(영문): {passportInfo.givenNames || passportInfo.given_names}</div>
                  <div>성: {passportInfo.surname}</div>
                  <div>한글이름: {passportInfo.koreanName || passportInfo.korean_name}</div>
                  <div>생년월일: {passportInfo.dateOfBirth || passportInfo.date_of_birth}</div>
                  <div>성별: {passportInfo.sex}</div>
                  <div>국적: {passportInfo.nationality}</div>
                  <div>개인번호: {passportInfo.personalNo || passportInfo.personal_no}</div>
                  <div>여권타입: {passportInfo.type}</div>
                  <div>발급국가: {passportInfo.issuingCountry || passportInfo.issuing_country}</div>
                  <div>발급일: {passportInfo.dateOfIssue || passportInfo.date_of_issue}</div>
                  <div>만료일: {passportInfo.dateOfExpiry || passportInfo.date_of_expiry}</div>
                  <div>발급기관: {passportInfo.authority}</div>
                  <Button
                    onClick={() => {
                      setEditPassport(true);
                      setPassportForm({
                        passport_no: passportInfo.passportNo || passportInfo.passport_no || "",
                        given_names: passportInfo.givenNames || passportInfo.given_names || "",
                        surname: passportInfo.surname || "",
                        korean_name: passportInfo.koreanName || passportInfo.korean_name || "",
                        date_of_birth: passportInfo.dateOfBirth || passportInfo.date_of_birth || "",
                        sex: passportInfo.sex || "",
                        nationality: passportInfo.nationality || "",
                        personal_no: passportInfo.personalNo || passportInfo.personal_no || "",
                        type: passportInfo.type || "",
                        issuing_country: passportInfo.issuingCountry || passportInfo.issuing_country || "",
                        date_of_issue: passportInfo.dateOfIssue || passportInfo.date_of_issue || "",
                        date_of_expiry: passportInfo.dateOfExpiry || passportInfo.date_of_expiry || "",
                        authority: passportInfo.authority || "",
                      });
                    }}
                    size="sm"
                  >
                    수정
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Input name="passport_no" value={passportForm.passport_no} onChange={handlePassportChange} placeholder="여권번호" />
                  <Input name="given_names" value={passportForm.given_names} onChange={handlePassportChange} placeholder="이름(영문)" />
                  <Input name="surname" value={passportForm.surname} onChange={handlePassportChange} placeholder="성" />
                  <Input name="korean_name" value={passportForm.korean_name} onChange={handlePassportChange} placeholder="한글이름" />
                  <Input name="date_of_birth" value={passportForm.date_of_birth} onChange={handlePassportChange} placeholder="생년월일" />
                  <Input name="sex" value={passportForm.sex} onChange={handlePassportChange} placeholder="성별" />
                  <Input name="nationality" value={passportForm.nationality} onChange={handlePassportChange} placeholder="국적" />
                  <Input name="personal_no" value={passportForm.personal_no} onChange={handlePassportChange} placeholder="개인번호" />
                  <Input name="type" value={passportForm.type} onChange={handlePassportChange} placeholder="여권타입" />
                  <Input name="issuing_country" value={passportForm.issuing_country} onChange={handlePassportChange} placeholder="발급국가" />
                  <Input name="date_of_issue" value={passportForm.date_of_issue} onChange={handlePassportChange} placeholder="발급일" />
                  <Input name="date_of_expiry" value={passportForm.date_of_expiry} onChange={handlePassportChange} placeholder="만료일" />
                  <Input name="authority" value={passportForm.authority} onChange={handlePassportChange} placeholder="발급기관" />
                  <div className="flex space-x-2">
                    <Button onClick={handlePassportSave} disabled={updating} size="sm">
                      저장
                    </Button>
                    <Button onClick={() => setEditPassport(false)} variant="outline" size="sm">
                      취소
                    </Button>
                  </div>
                </div>
              )}
            </div>
            <div>
              <div className="mb-2 font-bold">여행 정보</div>
              <div>입국일: {application.travelInfo?.entryDate}</div>
              <div>입국항: {application.travelInfo?.entryPort}</div>
              <div>비자 타입: {application.travelInfo?.visaType}</div>
            </div>
            <div>
              <div className="mb-2 font-bold">부가서비스</div>
              <div>{application.additionalServices?.map((s) => s.name).join(", ") || "없음"}</div>
            </div>
            <div>
              <div className="mb-2 font-bold">첨부 서류</div>
              {application.documents?.map((doc) => (
                <div key={doc.id} className="mb-2">
                  <div className="font-medium">{doc.type}</div>
                  <div>파일명: {doc.fileName}</div>
                  <div>업로드일: {doc.uploadedAt}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}
