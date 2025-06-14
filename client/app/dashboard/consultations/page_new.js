'use client';

import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Card, CardContent, CardHeader, CardTitle } from '../../src/components/ui/card';
import { Button } from '../../src/components/ui/button';
import { Input } from '../../src/components/ui/input';
import { 
  MessageSquare,
  Phone,
  Search,
  Filter,
  Eye,
  Reply,
  CheckCircle,
  Clock,
  Star,
  User,
  Calendar,
  MessageCircle,
  Mail,
  Plus
} from 'lucide-react';
import { GET_CONSULTATIONS } from '../../src/lib/graphql/query/consultations/index.js';
import { 
  UPDATE_CONSULTATION_STATUS_MUTATION, 
  DELETE_CONSULTATION_MUTATION 
} from '../../src/lib/graphql/mutation/consultations/index.js';

export default function ConsultationsManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedConsultation, setSelectedConsultation] = useState(null);

  // GraphQL 쿼리로 실제 상담 데이터 가져오기
  const { data, loading, error, refetch } = useQuery(GET_CONSULTATIONS, {
    errorPolicy: 'all'
  });

  // 상담 상태 업데이트 mutation
  const [updateConsultationStatus] = useMutation(UPDATE_CONSULTATION_STATUS_MUTATION, {
    onCompleted: () => {
      refetch();
      setSelectedConsultation(null);
    }
  });

  // 실제 데이터 또는 로딩/에러 상태 처리
  const consultations = data?.consultations || [];

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">상담 데이터를 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 mb-4">데이터를 불러오는 중 오류가 발생했습니다.</p>
            <p className="text-sm text-gray-500 mb-4">{error.message}</p>
            <Button onClick={() => refetch()} className="bg-blue-600 hover:bg-blue-700">
              다시 시도
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const getStatusInfo = (status) => {
    switch (status) {
      case 'pending':
        return { label: '대기 중', color: 'bg-yellow-100 text-yellow-800', icon: Clock };
      case 'in_progress':
        return { label: '처리 중', color: 'bg-blue-100 text-blue-800', icon: MessageCircle };
      case 'completed':
        return { label: '완료', color: 'bg-green-100 text-green-800', icon: CheckCircle };
      case 'cancelled':
        return { label: '종료', color: 'bg-gray-100 text-gray-800', icon: CheckCircle };
      default:
        return { label: status, color: 'bg-gray-100 text-gray-800', icon: Clock };
    }
  };

  const getInquiryTypeLabel = (type) => {
    switch (type) {
      case 'visa_inquiry': return '비자 문의';
      case 'document_inquiry': return '서류 문의';
      case 'payment_inquiry': return '결제 문의';
      case 'general_inquiry': return '일반 문의';
      case 'work_permit': return '노동허가서';
      case 'complaint': return '불만/개선사항';
      default: return type;
    }
  };

  const filteredConsultations = consultations.filter(consultation => {
    const matchesSearch = consultation.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         consultation.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         consultation.service_type?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || consultation.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // 상담 상태 변경 함수
  const handleStatusChange = async (consultationId, newStatus) => {
    try {
      await updateConsultationStatus({
        variables: {
          id: consultationId,
          status: newStatus,
          notes: `관리자가 상태를 ${newStatus}로 변경함`
        }
      });
    } catch (error) {
      console.error('상태 변경 중 오류 발생:', error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <MessageSquare className="h-8 w-8 mr-3" />
            고객 상담 관리
          </h1>
          <p className="text-gray-600 mt-2">
            고객 문의를 효율적으로 관리하고 빠른 응답을 제공합니다.
          </p>
        </div>
        <div className="flex space-x-3">
          <Button className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            새 상담 등록
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">대기 중</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {consultations.filter(c => c.status === 'pending').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">처리 중</p>
                <p className="text-3xl font-bold text-blue-600">
                  {consultations.filter(c => c.status === 'in_progress').length}
                </p>
              </div>
              <MessageCircle className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">완료</p>
                <p className="text-3xl font-bold text-green-600">
                  {consultations.filter(c => c.status === 'completed').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">전체 상담</p>
                <p className="text-3xl font-bold text-purple-600">{consultations.length}</p>
              </div>
              <Star className="h-8 w-8 text-purple-500" />
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
                <Input
                  placeholder="고객명, 이메일, 서비스 유형으로 검색..."
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
                <option value="pending">대기 중</option>
                <option value="in_progress">처리 중</option>
                <option value="completed">완료</option>
                <option value="cancelled">취소</option>
              </select>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                필터
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 상담 목록이 비어있을 때 */}
      {filteredConsultations.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">상담 내역이 없습니다</h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== 'all' 
                ? '검색 조건에 맞는 상담이 없습니다.' 
                : '아직 접수된 상담이 없습니다.'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Consultations List */}
      <div className="space-y-4">
        {filteredConsultations.map((consultation) => {
          const statusInfo = getStatusInfo(consultation.status);
          const StatusIcon = statusInfo.icon;
          
          return (
            <Card key={consultation.id} className="hover:shadow-lg transition-shadow border-l-4 border-blue-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                      <MessageSquare className="h-6 w-6 text-white" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {consultation.service_type || '일반 상담'}
                        </h3>
                        <span className="text-sm text-gray-500">
                          ID: {consultation.id}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>{consultation.customer_name}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Mail className="h-4 w-4" />
                          <span>{consultation.email}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Phone className="h-4 w-4" />
                          <span>{consultation.phone}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(consultation.created_at).toLocaleDateString('ko-KR')}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                          {getInquiryTypeLabel(consultation.service_type)}
                        </span>
                      </div>
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
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedConsultation(consultation)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        상세보기
                      </Button>
                      {consultation.status === 'pending' && (
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700"
                          onClick={() => handleStatusChange(consultation.id, 'in_progress')}
                        >
                          <Reply className="h-4 w-4 mr-1" />
                          처리 시작
                        </Button>
                      )}
                      {consultation.status === 'in_progress' && (
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleStatusChange(consultation.id, 'completed')}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          완료
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

      {/* Consultation Detail Modal */}
      {selectedConsultation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">상담 상세 정보</h2>
              <Button
                variant="outline"
                onClick={() => setSelectedConsultation(null)}
              >
                닫기
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">상담 정보</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-600">상담 ID</label>
                    <p className="font-medium">{selectedConsultation.id}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">서비스 유형</label>
                    <p className="font-medium">{getInquiryTypeLabel(selectedConsultation.service_type)}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">상태</label>
                    <p className="font-medium">{getStatusInfo(selectedConsultation.status).label}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">생성일</label>
                    <p className="font-medium">{new Date(selectedConsultation.created_at).toLocaleString('ko-KR')}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">고객 정보</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-600">고객명</label>
                    <p className="font-medium">{selectedConsultation.customer_name}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">이메일</label>
                    <p className="font-medium">{selectedConsultation.email}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">전화번호</label>
                    <p className="font-medium">{selectedConsultation.phone}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {selectedConsultation.message && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4">문의 내용</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedConsultation.message}</p>
                </div>
              </div>
            )}

            {selectedConsultation.notes && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4">관리자 메모</h3>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-blue-800">{selectedConsultation.notes}</p>
                </div>
              </div>
            )}
            
            <div className="mt-6 pt-6 border-t">
              <div className="flex space-x-3">
                {selectedConsultation.status === 'pending' && (
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => handleStatusChange(selectedConsultation.id, 'in_progress')}
                  >
                    처리 시작
                  </Button>
                )}
                {selectedConsultation.status === 'in_progress' && (
                  <Button 
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => handleStatusChange(selectedConsultation.id, 'completed')}
                  >
                    처리 완료
                  </Button>
                )}
                <Button variant="outline">
                  답변 메일 보내기
                </Button>
                <Button variant="outline">
                  메모 추가
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
