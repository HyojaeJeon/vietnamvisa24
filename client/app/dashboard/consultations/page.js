
'use client';

import React, { useState } from 'react';
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

export default function ConsultationsManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedConsultation, setSelectedConsultation] = useState(null);

  // Mock data for consultations
  const consultations = [
    {
      id: 1,
      ticket_number: 'CS-2024-001',
      customer_name: '김민수',
      email: 'minsu.kim@email.com',
      phone: '010-1234-5678',
      subject: 'E-visa 처리 시간 문의',
      inquiry_type: 'visa_inquiry',
      status: 'pending',
      priority: 'normal',
      created_at: '2024-01-16T09:30:00Z',
      updated_at: '2024-01-16T09:30:00Z',
      assigned_to: null,
      rating: null,
      content: '안녕하세요. E-visa 신청 후 언제쯤 결과를 받을 수 있는지 궁금합니다.'
    },
    {
      id: 2,
      ticket_number: 'CS-2024-002',
      customer_name: '이영희',
      email: 'younghee.lee@company.com',
      phone: '010-9876-5432',
      subject: '비즈니스 비자 서류 문의',
      inquiry_type: 'document_inquiry',
      status: 'in_progress',
      priority: 'high',
      created_at: '2024-01-15T14:20:00Z',
      updated_at: '2024-01-16T10:15:00Z',
      assigned_to: '김상담',
      rating: null,
      content: '비즈니스 비자 신청 시 초청장이 꼭 필요한지 문의드립니다.'
    },
    {
      id: 3,
      ticket_number: 'CS-2024-003',
      customer_name: '박철수',
      email: 'chulsoo.park@email.com',
      phone: '010-5555-1234',
      subject: '노동허가서 연장 절차',
      inquiry_type: 'work_permit',
      status: 'resolved',
      priority: 'urgent',
      created_at: '2024-01-14T11:30:00Z',
      updated_at: '2024-01-15T16:45:00Z',
      assigned_to: '이매니저',
      rating: 5,
      content: '현재 노동허가서가 곧 만료예정인데 연장 절차와 소요시간을 알고 싶습니다.'
    }
  ];

  const getStatusInfo = (status) => {
    switch (status) {
      case 'pending':
        return { label: '대기 중', color: 'bg-yellow-100 text-yellow-800', icon: Clock };
      case 'in_progress':
        return { label: '처리 중', color: 'bg-blue-100 text-blue-800', icon: MessageCircle };
      case 'resolved':
        return { label: '완료', color: 'bg-green-100 text-green-800', icon: CheckCircle };
      case 'closed':
        return { label: '종료', color: 'bg-gray-100 text-gray-800', icon: CheckCircle };
      default:
        return { label: status, color: 'bg-gray-100 text-gray-800', icon: Clock };
    }
  };

  const getInquiryTypeLabel = (type) => {
    switch (type) {
      case 'visa_inquiry': return '비자 문의';
      case 'document_inquiry': return '서류 문의';
      case 'work_permit': return '노동허가서';
      case 'general': return '일반 문의';
      case 'complaint': return '불만/개선사항';
      default: return type;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'border-l-4 border-red-500';
      case 'high': return 'border-l-4 border-orange-500';
      case 'normal': return 'border-l-4 border-blue-500';
      default: return 'border-l-4 border-gray-300';
    }
  };

  const filteredConsultations = consultations.filter(consultation => {
    const matchesSearch = consultation.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         consultation.ticket_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         consultation.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || consultation.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
                <p className="text-sm font-medium text-gray-600">오늘 완료</p>
                <p className="text-3xl font-bold text-green-600">8</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">평균 만족도</p>
                <p className="text-3xl font-bold text-purple-600">4.8</p>
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
                  placeholder="티켓번호, 고객명, 제목으로 검색..."
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
                <option value="resolved">완료</option>
                <option value="closed">종료</option>
              </select>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                필터
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Consultations List */}
      <div className="space-y-4">
        {filteredConsultations.map((consultation) => {
          const statusInfo = getStatusInfo(consultation.status);
          const StatusIcon = statusInfo.icon;
          
          return (
            <Card key={consultation.id} className={`hover:shadow-lg transition-shadow ${getPriorityColor(consultation.priority)}`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                      <MessageSquare className="h-6 w-6 text-white" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {consultation.subject}
                        </h3>
                        <span className="text-sm text-gray-500">
                          #{consultation.ticket_number}
                        </span>
                        {consultation.priority === 'urgent' && (
                          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                            긴급
                          </span>
                        )}
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
                          {getInquiryTypeLabel(consultation.inquiry_type)}
                        </span>
                        {consultation.assigned_to && (
                          <span className="text-sm text-blue-600">
                            담당자: {consultation.assigned_to}
                          </span>
                        )}
                        {consultation.rating && (
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="text-sm text-yellow-600">{consultation.rating}</span>
                          </div>
                        )}
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
                      <Button
                        variant="outline"
                        size="sm"
                      >
                        <Reply className="h-4 w-4 mr-1" />
                        응답
                      </Button>
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
                    <label className="text-sm text-gray-600">티켓번호</label>
                    <p className="font-medium">{selectedConsultation.ticket_number}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">제목</label>
                    <p className="font-medium">{selectedConsultation.subject}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">문의 유형</label>
                    <p className="font-medium">{getInquiryTypeLabel(selectedConsultation.inquiry_type)}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">우선순위</label>
                    <p className="font-medium">{selectedConsultation.priority}</p>
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
            
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">문의 내용</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">{selectedConsultation.content}</p>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t">
              <div className="flex space-x-3">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  답변하기
                </Button>
                <Button variant="outline">
                  담당자 변경
                </Button>
                <Button variant="outline">
                  상태 변경
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
