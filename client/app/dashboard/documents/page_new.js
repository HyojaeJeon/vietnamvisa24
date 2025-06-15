'use client';

import React, { useState, useMemo } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { 
  FileText, Search, Filter, Download, Eye, Check, X, Upload,
  AlertCircle, Clock, CheckCircle, XCircle, MoreHorizontal,
  Image, File, Trash2, Edit3, Calendar, User, FileCheck,
  Loader2, Plus, RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// GraphQL imports
import { 
  GET_DOCUMENTS, 
  GET_DOCUMENT_STATISTICS,
  GET_DOCUMENT_TYPES 
} from '@/lib/graphql/query/documents';
import { 
  UPDATE_DOCUMENT_STATUS,
  BULK_UPDATE_DOCUMENT_STATUS,
  DELETE_DOCUMENT 
} from '@/lib/graphql/mutation/documents';

// Components
import FileUpload from '@/components/FileUpload';

export default function DocumentsManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [reviewNotes, setReviewNotes] = useState('');
  const [uploadApplicationId, setUploadApplicationId] = useState('');

  // GraphQL queries
  const { 
    data: documentsData, 
    loading: documentsLoading, 
    error: documentsError,
    refetch: refetchDocuments 
  } = useQuery(GET_DOCUMENTS);

  const { 
    data: statisticsData,
    loading: statisticsLoading 
  } = useQuery(GET_DOCUMENT_STATISTICS);

  const { data: documentTypesData } = useQuery(GET_DOCUMENT_TYPES);

  // GraphQL mutations
  const [updateDocumentStatus] = useMutation(UPDATE_DOCUMENT_STATUS, {
    onCompleted: () => {
      refetchDocuments();
      setShowDetailModal(false);
      setReviewNotes('');
    },
    onError: (error) => {
      console.error('문서 상태 업데이트 오류:', error);
    }
  });

  const [bulkUpdateDocumentStatus] = useMutation(BULK_UPDATE_DOCUMENT_STATUS, {
    onCompleted: () => {
      refetchDocuments();
      setSelectedDocuments([]);
      setReviewNotes('');
    },
    onError: (error) => {
      console.error('일괄 문서 상태 업데이트 오류:', error);
    }
  });

  const [deleteDocument] = useMutation(DELETE_DOCUMENT, {
    onCompleted: () => {
      refetchDocuments();
      setShowDetailModal(false);
    },
    onError: (error) => {
      console.error('문서 삭제 오류:', error);
    }
  });

  // 데이터 처리
  const documents = documentsData?.getDocuments || [];
  const statistics = statisticsData?.getDocumentStatistics || {
    total: 0, pending: 0, approved: 0, rejected: 0, review_rate: 0
  };
  const documentTypes = documentTypesData?.getDocumentTypes || [];

  // 필터링된 문서 목록
  const filteredDocuments = useMemo(() => {
    return documents.filter(doc => {
      const matchesSearch = searchTerm === '' || 
        doc.document_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.application?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.application?.application_number?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
      const matchesType = typeFilter === 'all' || doc.document_type === typeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [documents, searchTerm, statusFilter, typeFilter]);

  // 문서 타입 정보 가져오기
  const getDocumentTypeInfo = (type) => {
    const typeInfo = documentTypes.find(t => t.value === type);
    if (typeInfo) {
      return { label: typeInfo.label, icon: FileText, color: 'text-blue-600' };
    }

    // 기본 타입 정보
    switch (type) {
      case 'passport':
        return { label: '여권 사본', icon: FileText, color: 'text-blue-600' };
      case 'photo':
        return { label: '증명사진', icon: Image, color: 'text-green-600' };
      case 'invitation':
        return { label: '초청장', icon: File, color: 'text-purple-600' };
      case 'health_certificate':
        return { label: '건강증명서', icon: FileCheck, color: 'text-orange-600' };
      case 'criminal_record':
        return { label: '무범죄증명서', icon: FileText, color: 'text-red-600' };
      default:
        return { label: '기타 서류', icon: File, color: 'text-gray-600' };
    }
  };

  // 상태 배지 정보
  const getStatusInfo = (status) => {
    switch (status) {
      case 'pending':
        return { label: '검토 대기', color: 'bg-yellow-100 text-yellow-800', icon: Clock };
      case 'approved':
        return { label: '승인', color: 'bg-green-100 text-green-800', icon: CheckCircle };
      case 'revision_required':
        return { label: '수정 요청', color: 'bg-red-100 text-red-800', icon: XCircle };
      default:
        return { label: '알 수 없음', color: 'bg-gray-100 text-gray-800', icon: AlertCircle };
    }
  };

  // 문서 상태 업데이트
  const handleStatusUpdate = async (documentId, newStatus, notes = '') => {
    try {
      await updateDocumentStatus({
        variables: {
          id: documentId,
          status: newStatus.toUpperCase(),
          notes: notes || undefined
        }
      });
    } catch (error) {
      console.error('상태 업데이트 실패:', error);
    }
  };

  // 일괄 상태 업데이트
  const handleBulkStatusUpdate = async (newStatus) => {
    if (selectedDocuments.length === 0) return;

    try {
      await bulkUpdateDocumentStatus({
        variables: {
          ids: selectedDocuments,
          status: newStatus.toUpperCase(),
          notes: reviewNotes || undefined
        }
      });
    } catch (error) {
      console.error('일괄 상태 업데이트 실패:', error);
    }
  };

  // 문서 삭제
  const handleDeleteDocument = async (documentId) => {
    if (window.confirm('정말로 이 문서를 삭제하시겠습니까?')) {
      try {
        await deleteDocument({
          variables: { id: documentId }
        });
      } catch (error) {
        console.error('문서 삭제 실패:', error);
      }
    }
  };

  // 문서 선택 토글
  const toggleDocumentSelection = (documentId) => {
    setSelectedDocuments(prev => 
      prev.includes(documentId)
        ? prev.filter(id => id !== documentId)
        : [...prev, documentId]
    );
  };

  // 전체 선택/해제
  const toggleSelectAll = () => {
    if (selectedDocuments.length === filteredDocuments.length) {
      setSelectedDocuments([]);
    } else {
      setSelectedDocuments(filteredDocuments.map(doc => doc.id));
    }
  };

  // 파일 다운로드
  const handleDownload = (document) => {
    if (document.downloadUrl) {
      window.open(document.downloadUrl, '_blank');
    }
  };

  // 업로드 성공 핸들러
  const handleUploadSuccess = (uploadedDocuments) => {
    refetchDocuments();
    setShowUploadModal(false);
    setUploadApplicationId('');
  };

  // 업로드 에러 핸들러
  const handleUploadError = (error) => {
    console.error('업로드 오류:', error);
    alert(`업로드 오류: ${error}`);
  };

  if (documentsError) {
    return (
      <div className="p-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            문서 목록을 불러오는 중 오류가 발생했습니다: {documentsError.message}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">문서 관리</h1>
          <p className="text-gray-600 mt-1">업로드된 문서를 검토하고 관리합니다</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => refetchDocuments()}
            disabled={documentsLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${documentsLoading ? 'animate-spin' : ''}`} />
            새로고침
          </Button>
          <Button onClick={() => setShowUploadModal(true)}>
            <Upload className="h-4 w-4 mr-2" />
            문서 업로드
          </Button>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">전체 문서</p>
                <p className="text-2xl font-bold text-gray-900">
                  {statisticsLoading ? '-' : statistics.total}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">검토 대기</p>
                <p className="text-2xl font-bold text-gray-900">
                  {statisticsLoading ? '-' : statistics.pending}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">승인</p>
                <p className="text-2xl font-bold text-gray-900">
                  {statisticsLoading ? '-' : statistics.approved}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <XCircle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">수정 요청</p>
                <p className="text-2xl font-bold text-gray-900">
                  {statisticsLoading ? '-' : statistics.rejected}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <FileCheck className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">검토율</p>
                <p className="text-2xl font-bold text-gray-900">
                  {statisticsLoading ? '-' : `${statistics.review_rate}%`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 필터 및 검색 */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="신청번호, 고객명, 파일명으로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="문서 타입" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">모든 타입</SelectItem>
                  {documentTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="상태" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">모든 상태</SelectItem>
                  <SelectItem value="pending">검토 대기</SelectItem>
                  <SelectItem value="approved">승인</SelectItem>
                  <SelectItem value="revision_required">수정 요청</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 일괄 작업 도구 */}
          {selectedDocuments.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">
                    {selectedDocuments.length}개 문서 선택됨
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedDocuments([])}
                  >
                    선택 해제
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    onClick={() => handleBulkStatusUpdate('approved')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    일괄 승인
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => handleBulkStatusUpdate('revision_required')}
                  >
                    일괄 수정요청
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 문서 목록 */}
      {documentsLoading ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-500">문서 목록을 불러오는 중...</p>
          </CardContent>
        </Card>
      ) : filteredDocuments.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">조건에 맞는 문서가 없습니다.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {/* 전체 선택 체크박스 */}
          <div className="flex items-center gap-2 px-4">
            <Checkbox
              checked={selectedDocuments.length === filteredDocuments.length}
              onCheckedChange={toggleSelectAll}
            />
            <span className="text-sm text-gray-600">전체 선택</span>
          </div>

          {filteredDocuments.map((document) => {
            const typeInfo = getDocumentTypeInfo(document.document_type);
            const statusInfo = getStatusInfo(document.status);
            const TypeIcon = typeInfo.icon;
            const StatusIcon = statusInfo.icon;
            
            return (
              <Card key={document.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    {/* 선택 체크박스 */}
                    <Checkbox
                      checked={selectedDocuments.includes(document.id)}
                      onCheckedChange={() => toggleDocumentSelection(document.id)}
                    />

                    {/* 문서 아이콘 */}
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <TypeIcon className="h-6 w-6 text-white" />
                    </div>
                    
                    {/* 문서 정보 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {document.document_name}
                        </h3>
                        <Badge variant="outline">
                          {document.application?.application_number || `#${document.application_id}`}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-6 text-sm text-gray-600 mb-2">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>{document.application?.full_name || '고객명 없음'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className={typeInfo.color}>{typeInfo.label}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>{document.formattedFileSize || document.file_size}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(document.uploaded_at).toLocaleDateString('ko-KR')}</span>
                        </div>
                      </div>
                      
                      {document.reviewer && (
                        <div className="flex items-center gap-4 text-sm mb-2">
                          <span className="text-blue-600">
                            검토자: {document.reviewer.name || document.reviewer}
                          </span>
                          {document.reviewed_at && (
                            <span className="text-gray-500">
                              {new Date(document.reviewed_at).toLocaleDateString('ko-KR')}
                            </span>
                          )}
                        </div>
                      )}

                      {document.notes && (
                        <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 mt-2">
                          {document.notes}
                        </div>
                      )}
                    </div>

                    {/* 상태 및 액션 */}
                    <div className="flex items-center gap-4">
                      {/* 상태 배지 */}
                      <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${statusInfo.color}`}>
                        <StatusIcon className="h-4 w-4" />
                        <span>{statusInfo.label}</span>
                      </div>

                      {/* 액션 메뉴 */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => {
                            setSelectedDocument(document);
                            setShowDetailModal(true);
                          }}>
                            <Eye className="h-4 w-4 mr-2" />
                            상세보기
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDownload(document)}>
                            <Download className="h-4 w-4 mr-2" />
                            다운로드
                          </DropdownMenuItem>
                          {document.status === 'pending' && (
                            <>
                              <DropdownMenuItem 
                                onClick={() => handleStatusUpdate(document.id, 'approved')}
                                className="text-green-600"
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                승인
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleStatusUpdate(document.id, 'revision_required')}
                                className="text-red-600"
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                수정요청
                              </DropdownMenuItem>
                            </>
                          )}
                          <DropdownMenuItem 
                            onClick={() => handleDeleteDocument(document.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            삭제
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* 문서 상세 모달 */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>문서 상세 정보</DialogTitle>
            <DialogDescription>
              업로드된 문서의 상세 정보를 확인하고 검토할 수 있습니다.
            </DialogDescription>
          </DialogHeader>
          
          {selectedDocument && (
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
                    <p className="font-medium">{selectedDocument.formattedFileSize || selectedDocument.file_size}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">서류 종류</label>
                    <p className="font-medium">{getDocumentTypeInfo(selectedDocument.document_type).label}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">업로드 일시</label>
                    <p className="font-medium">{new Date(selectedDocument.uploaded_at).toLocaleString('ko-KR')}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">검토 정보</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-600">신청번호</label>
                    <p className="font-medium">{selectedDocument.application?.application_number || selectedDocument.application_id}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">고객명</label>
                    <p className="font-medium">{selectedDocument.application?.full_name || '고객명 없음'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">검토자</label>
                    <p className="font-medium">{selectedDocument.reviewer?.name || '미지정'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">검토 일시</label>
                    <p className="font-medium">
                      {selectedDocument.reviewed_at 
                        ? new Date(selectedDocument.reviewed_at).toLocaleString('ko-KR')
                        : '미검토'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {selectedDocument?.notes && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">검토 메모</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">{selectedDocument.notes}</p>
              </div>
            </div>
          )}

          {/* 검토 메모 입력 */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">검토 메모</h3>
            <Textarea
              placeholder="검토 메모를 입력하세요..."
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          
          <DialogFooter>
            <div className="flex gap-3">
              {selectedDocument?.downloadUrl && (
                <Button variant="outline" onClick={() => handleDownload(selectedDocument)}>
                  <Download className="h-4 w-4 mr-2" />
                  다운로드
                </Button>
              )}
              
              {selectedDocument?.status === 'pending' && (
                <>
                  <Button 
                    onClick={() => handleStatusUpdate(selectedDocument.id, 'approved', reviewNotes)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    승인
                  </Button>
                  <Button 
                    variant="destructive"
                    onClick={() => handleStatusUpdate(selectedDocument.id, 'revision_required', reviewNotes)}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    수정 요청
                  </Button>
                </>
              )}
              
              <Button variant="outline" onClick={() => setShowDetailModal(false)}>
                닫기
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 문서 업로드 모달 */}
      <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>문서 업로드</DialogTitle>
            <DialogDescription>
              비자 신청과 관련된 문서를 업로드합니다.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                신청 ID
              </label>
              <Input
                placeholder="신청 ID를 입력하세요 (예: VN-2024-001)"
                value={uploadApplicationId}
                onChange={(e) => setUploadApplicationId(e.target.value)}
              />
            </div>
            
            {uploadApplicationId && (
              <FileUpload
                applicationId={uploadApplicationId}
                onUploadSuccess={handleUploadSuccess}
                onUploadError={handleUploadError}
                multiple={true}
                acceptedTypes="image/*,.pdf,.doc,.docx"
                maxSizeInMB={10}
              />
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUploadModal(false)}>
              취소
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
