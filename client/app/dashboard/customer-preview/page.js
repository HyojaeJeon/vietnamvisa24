
'use client';

import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_VISA_APPLICATIONS } from '../../src/lib/graphql';
import { Card, CardContent, CardHeader, CardTitle } from '../../src/components/ui/card';
import { Button } from '../../src/components/ui/button';
import { Badge } from '../../src/components/ui/badge';
import {
  Eye,
  Settings,
  Bell,
  BellOff,
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  User,
  Phone,
  Mail
} from 'lucide-react';

export default function CustomerPreview() {
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);

  const { data: applicationsData, loading } = useQuery(GET_VISA_APPLICATIONS, {
    errorPolicy: 'all'
  });

  const getStatusInfo = (status) => {
    const statusMap = {
      'pending': { 
        label: '접수 완료', 
        color: 'bg-blue-100 text-blue-800',
        icon: Clock,
        description: '신청서가 접수되어 검토 중입니다.'
      },
      'processing': { 
        label: '처리 중', 
        color: 'bg-yellow-100 text-yellow-800',
        icon: Clock,
        description: '서류 검토 및 처리가 진행 중입니다.'
      },
      'document_review': { 
        label: '서류 검토', 
        color: 'bg-orange-100 text-orange-800',
        icon: FileText,
        description: '제출하신 서류를 면밀히 검토하고 있습니다.'
      },
      'submitted_to_authority': { 
        label: '기관 제출', 
        color: 'bg-purple-100 text-purple-800',
        icon: FileText,
        description: '베트남 관련 기관에 신청서가 제출되었습니다.'
      },
      'approved': { 
        label: '승인 완료', 
        color: 'bg-green-100 text-green-800',
        icon: CheckCircle,
        description: '비자 승인이 완료되었습니다.'
      },
      'rejected': { 
        label: '승인 거부', 
        color: 'bg-red-100 text-red-800',
        icon: AlertTriangle,
        description: '비자 신청이 거부되었습니다.'
      }
    };

    return statusMap[status] || statusMap['pending'];
  };

  // 고객 화면 미리보기 컴포넌트
  const CustomerView = ({ application }) => {
    const statusInfo = getStatusInfo(application.status);
    const StatusIcon = statusInfo.icon;

    return (
      <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
        {/* 고객용 헤더 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">비자 신청 현황</h1>
              <p className="text-gray-600 mt-1">신청번호: VN-{application.id}</p>
            </div>
            <div className="text-right">
              <Badge className={statusInfo.color}>
                {statusInfo.label}
              </Badge>
              <p className="text-sm text-gray-500 mt-1">
                신청일: {new Date(application.created_at).toLocaleDateString('ko-KR')}
              </p>
            </div>
          </div>
        </div>

        {/* 진행 상황 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <StatusIcon className="h-5 w-5 mr-2 text-blue-600" />
              현재 진행 상황
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <StatusIcon className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{statusInfo.label}</h3>
                <p className="text-gray-600">{statusInfo.description}</p>
              </div>
            </div>

            {/* 진행 단계 표시 */}
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900">진행률</span>
                <span className="text-sm text-gray-500">60%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 신청 정보 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>신청 정보</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">비자 종류</label>
                <p className="text-gray-900">{application.visa_type}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">신청자명</label>
                <p className="text-gray-900">{application.full_name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">여권번호</label>
                <p className="text-gray-900">{application.passport_number}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">국적</label>
                <p className="text-gray-900">{application.nationality}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">도착 예정일</label>
                <p className="text-gray-900">
                  {new Date(application.arrival_date).toLocaleDateString('ko-KR')}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">출발 예정일</label>
                <p className="text-gray-900">
                  {new Date(application.departure_date).toLocaleDateString('ko-KR')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 진행 로그 */}
        <Card>
          <CardHeader>
            <CardTitle>처리 내역</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">신청서 접수 완료</p>
                  <p className="text-sm text-gray-600">온라인 신청서가 성공적으로 접수되었습니다.</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(application.created_at).toLocaleString('ko-KR')}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">서류 검토 중</p>
                  <p className="text-sm text-gray-600">제출하신 서류를 검토하고 있습니다.</p>
                  <p className="text-xs text-gray-500 mt-1">진행 중</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="h-4 w-4 text-gray-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-400">베트남 당국 제출</p>
                  <p className="text-sm text-gray-400">대기 중</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  if (loading) return <div className="p-6">로딩 중...</div>;

  return (
    <div className="p-6 space-y-6">
      {!previewMode ? (
        <>
          {/* 헤더 */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">고객 화면 미리보기</h1>
              <p className="text-gray-600 mt-2">고객에게 보여지는 화면을 미리 확인하고 설정을 관리합니다</p>
            </div>
          </div>

          {/* 신청 목록 */}
          <Card>
            <CardHeader>
              <CardTitle>신청 목록</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {applicationsData?.getVisaApplications?.map((application) => (
                  <div key={application.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <User className="h-8 w-8 text-gray-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{application.full_name}</p>
                        <p className="text-sm text-gray-600">{application.visa_type}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <div className="flex items-center space-x-1">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <span className="text-xs text-gray-500">{application.email}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span className="text-xs text-gray-500">{application.phone}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Badge className={getStatusInfo(application.status).color}>
                        {getStatusInfo(application.status).label}
                      </Badge>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedApplication(application);
                            setPreviewMode(true);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          미리보기
                        </Button>
                        
                        <Button size="sm" variant="outline">
                          <Settings className="h-4 w-4 mr-1" />
                          설정
                        </Button>

                        <Button size="sm" variant="outline">
                          <Bell className="h-4 w-4 mr-1" />
                          알림
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 공통 설정 */}
          <Card>
            <CardHeader>
              <CardTitle>고객 화면 공통 설정</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">표시 정보 설정</h3>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-3" defaultChecked />
                      <span className="text-gray-700">진행 상황 백분율 표시</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-3" defaultChecked />
                      <span className="text-gray-700">처리 담당자 정보 표시</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-3" />
                      <span className="text-gray-700">예상 완료일 표시</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-3" defaultChecked />
                      <span className="text-gray-700">처리 내역 타임라인 표시</span>
                    </label>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-3">알림 설정</h3>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-3" defaultChecked />
                      <span className="text-gray-700">상태 변경 시 이메일 알림</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-3" defaultChecked />
                      <span className="text-gray-700">상태 변경 시 SMS 알림</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-3" />
                      <span className="text-gray-700">매일 진행 상황 요약 발송</span>
                    </label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <>
          {/* 미리보기 모드 헤더 */}
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Eye className="h-5 w-5 text-yellow-600" />
                <span className="font-medium text-yellow-800">고객 화면 미리보기 모드</span>
              </div>
              <Button onClick={() => setPreviewMode(false)} variant="outline" size="sm">
                관리자 화면으로 돌아가기
              </Button>
            </div>
          </div>

          {/* 고객 화면 */}
          {selectedApplication && <CustomerView application={selectedApplication} />}
        </>
      )}
    </div>
  );
}
