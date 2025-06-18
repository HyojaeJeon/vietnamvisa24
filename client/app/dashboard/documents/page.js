"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../src/components/ui/card";
import { Button } from "../../src/components/ui/button";
import { Input } from "../../src/components/ui/input";
import { FileText, Upload, Download, Search, Filter, Eye, Trash2, CheckCircle, AlertTriangle, Clock, User, Calendar, FolderOpen, File, Image, FileCheck } from "lucide-react";

export default function DocumentsManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedDocument, setSelectedDocument] = useState(null);

  // Mock documents data
  const documents = [
    {
      id: 1,
      application_id: "VN-2024-001",
      customer_name: "김민수",
      document_type: "passport",
      document_name: "passport_copy.pdf",
      file_size: "2.3 MB",
      status: "approved",
      uploaded_at: "2024-01-15T09:30:00Z",
      reviewed_at: "2024-01-15T14:20:00Z",
      reviewer: "김담당",
      notes: "여권 사본 확인 완료",
    },
    {
      id: 2,
      application_id: "VN-2024-001",
      customer_name: "김민수",
      document_type: "photo",
      document_name: "passport_photo.jpg",
      file_size: "1.1 MB",
      status: "approved",
      uploaded_at: "2024-01-15T09:32:00Z",
      reviewed_at: "2024-01-15T14:22:00Z",
      reviewer: "김담당",
      notes: "증명사진 규격 적합",
    },
    {
      id: 3,
      application_id: "VN-2024-002",
      customer_name: "이영희",
      document_type: "invitation",
      document_name: "business_invitation.pdf",
      file_size: "0.8 MB",
      status: "revision_required",
      uploaded_at: "2024-01-14T16:45:00Z",
      reviewed_at: "2024-01-15T10:15:00Z",
      reviewer: "이매니저",
      notes: "초청 기업 정보 보완 필요",
    },
    {
      id: 4,
      application_id: "VN-2024-003",
      customer_name: "박철수",
      document_type: "health_certificate",
      document_name: "health_check.pdf",
      file_size: "1.5 MB",
      status: "pending",
      uploaded_at: "2024-01-16T11:20:00Z",
      reviewed_at: null,
      reviewer: null,
      notes: null,
    },
    {
      id: 5,
      application_id: "VN-2024-004",
      customer_name: "최지민",
      document_type: "criminal_record",
      document_name: "criminal_background.pdf",
      file_size: "0.6 MB",
      status: "approved",
      uploaded_at: "2024-01-12T08:15:00Z",
      reviewed_at: "2024-01-12T15:30:00Z",
      reviewer: "김담당",
      notes: "무범죄 증명서 확인 완료",
    },
  ];

  const getDocumentTypeInfo = (type) => {
    switch (type) {
      case "passport":
        return { label: "여권 사본", icon: FileText, color: "text-blue-600" };
      case "photo":
        return { label: "증명사진", icon: Image, color: "text-green-600" };
      case "invitation":
        return { label: "초청장", icon: File, color: "text-purple-600" };
      case "health_certificate":
        return { label: "건강증명서", icon: FileCheck, color: "text-orange-600" };
      case "criminal_record":
        return { label: "무범죄증명서", icon: FileText, color: "text-red-600" };
      default:
        return { label: type, icon: File, color: "text-gray-600" };
    }
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case "pending":
        return { label: "검토 대기", color: "bg-yellow-100 text-yellow-800", icon: Clock };
      case "approved":
        return { label: "승인", color: "bg-green-100 text-green-800", icon: CheckCircle };
      case "revision_required":
        return { label: "수정 필요", color: "bg-red-100 text-red-800", icon: AlertTriangle };
      default:
        return { label: status, color: "bg-gray-100 text-gray-800", icon: Clock };
    }
  };

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.application_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.document_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || doc.document_type === typeFilter;
    const matchesStatus = statusFilter === "all" || doc.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <FolderOpen className="h-8 w-8 mr-3" />
            서류 관리
          </h1>
          <p className="text-gray-600 mt-2">고객이 제출한 모든 서류를 체계적으로 관리하고 검토합니다.</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            서류 업로드
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Download className="h-4 w-4 mr-2" />
            일괄 다운로드
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">검토 대기</p>
                <p className="text-3xl font-bold text-yellow-600">{documents.filter((d) => d.status === "pending").length}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">승인 완료</p>
                <p className="text-3xl font-bold text-green-600">{documents.filter((d) => d.status === "approved").length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">수정 필요</p>
                <p className="text-3xl font-bold text-red-600">{documents.filter((d) => d.status === "revision_required").length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">총 서류</p>
                <p className="text-3xl font-bold text-gray-600">{documents.length}</p>
              </div>
              <FileText className="h-8 w-8 text-gray-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input placeholder="신청번호, 고객명, 파일명으로 검색..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
              </div>
            </div>
            <div className="flex space-x-3">
              <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="all">모든 서류</option>
                <option value="passport">여권 사본</option>
                <option value="photo">증명사진</option>
                <option value="invitation">초청장</option>
                <option value="health_certificate">건강증명서</option>
                <option value="criminal_record">무범죄증명서</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">모든 상태</option>
                <option value="pending">검토 대기</option>
                <option value="approved">승인</option>
                <option value="revision_required">수정 필요</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents List */}
      <div className="space-y-4">
        {filteredDocuments.map((document) => {
          const typeInfo = getDocumentTypeInfo(document.document_type);
          const statusInfo = getStatusInfo(document.status);
          const TypeIcon = typeInfo.icon;
          const StatusIcon = statusInfo.icon;

          return (
            <Card key={document.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <TypeIcon className="h-6 w-6 text-white" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-4">
                        <h3 className="text-lg font-semibold text-gray-900">{document.document_name}</h3>
                        <span className="text-sm text-gray-500">#{document.application_id}</span>
                      </div>

                      <div className="flex items-center space-x-6 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>{document.customer_name}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className={typeInfo.color}>{typeInfo.label}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span>{document.file_size}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(document.uploaded_at).toLocaleDateString("ko-KR")}</span>
                        </div>
                      </div>

                      {document.reviewer && (
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="text-blue-600">검토자: {document.reviewer}</span>
                          {document.reviewed_at && <span className="text-gray-500">{new Date(document.reviewed_at).toLocaleDateString("ko-KR")}</span>}
                        </div>
                      )}

                      {document.notes && <div className="bg-gray-50 p-2 rounded text-sm text-gray-700">{document.notes}</div>}
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    {/* Status Badge */}
                    <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 ${statusInfo.color}`}>
                      <StatusIcon className="h-4 w-4" />
                      <span>{statusInfo.label}</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => setSelectedDocument(document)}>
                        <Eye className="h-4 w-4 mr-1" />
                        보기
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        다운로드
                      </Button>
                      {document.status === "pending" && (
                        <Button variant="outline" size="sm" className="text-green-600 hover:text-green-700">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          승인
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredDocuments.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">조건에 맞는 서류가 없습니다.</p>
          </CardContent>
        </Card>
      )}

      {/* Document Detail Modal */}
      {selectedDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">서류 상세 정보</h2>
              <Button variant="outline" onClick={() => setSelectedDocument(null)}>
                닫기
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">파일 정보</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-600">파일명</label>
                    <p className="font-medium">{selectedDocument.document_name}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">파일 크기</label>
                    <p className="font-medium">{selectedDocument.file_size}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">서류 종류</label>
                    <p className="font-medium">{getDocumentTypeInfo(selectedDocument.document_type).label}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">업로드 일시</label>
                    <p className="font-medium">{new Date(selectedDocument.uploaded_at).toLocaleString("ko-KR")}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">검토 정보</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-600">신청번호</label>
                    <p className="font-medium">{selectedDocument.application_id}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">고객명</label>
                    <p className="font-medium">{selectedDocument.customer_name}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">검토자</label>
                    <p className="font-medium">{selectedDocument.reviewer || "미지정"}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">검토 일시</label>
                    <p className="font-medium">{selectedDocument.reviewed_at ? new Date(selectedDocument.reviewed_at).toLocaleString("ko-KR") : "미검토"}</p>
                  </div>
                </div>
              </div>
            </div>

            {selectedDocument.notes && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4">검토 메모</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700">{selectedDocument.notes}</p>
                </div>
              </div>
            )}

            <div className="mt-6 pt-6 border-t">
              <div className="flex space-x-3">
                <Button className="bg-green-600 hover:bg-green-700">승인</Button>
                <Button variant="outline" className="text-red-600 hover:text-red-700">
                  수정 요청
                </Button>
                <Button variant="outline">다운로드</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
