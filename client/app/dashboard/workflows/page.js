
'use client';

import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { 
  GET_WORKFLOW_TEMPLATES, 
  CREATE_WORKFLOW_TEMPLATE,
  UPDATE_APPLICATION_CHECKLIST 
} from '../../src/lib/graphql';
import { Card, CardContent, CardHeader, CardTitle } from '../../src/components/ui/card';
import { Button } from '../../src/components/ui/button';
import { Badge } from '../../src/components/ui/badge';
import {
  CheckSquare,
  Plus,
  Settings,
  Play,
  Clock,
  AlertTriangle,
  FileText,
  Users,
  Zap
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function WorkflowManagement() {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { data: templatesData, loading, refetch } = useQuery(GET_WORKFLOW_TEMPLATES, {
    errorPolicy: 'all'
  });

  const [createTemplate] = useMutation(CREATE_WORKFLOW_TEMPLATE, {
    onCompleted: () => {
      toast.success('워크플로우 템플릿이 생성되었습니다.');
      setShowCreateModal(false);
      refetch();
    },
    onError: (error) => {
      toast.error('템플릿 생성 중 오류가 발생했습니다.');
    }
  });

  // 기본 템플릿 데이터
  const defaultTemplates = {
    'E-visa': {
      name: 'E-visa 처리 워크플로우',
      checklist: [
        { id: 1, title: '신청서 접수 확인', description: '온라인 신청서 정보 검토', estimated_time: 10 },
        { id: 2, title: '서류 검증', description: '여권, 사진 등 필수 서류 확인', estimated_time: 15 },
        { id: 3, title: '결제 확인', description: '비자 수수료 결제 완료 확인', estimated_time: 5 },
        { id: 4, title: '베트남 당국 제출', description: '온라인 시스템을 통한 신청서 제출', estimated_time: 30 },
        { id: 5, title: '승인 확인', description: '베트남 당국 승인 결과 확인', estimated_time: 1440 },
        { id: 6, title: '비자 발급', description: 'E-visa PDF 파일 생성 및 전송', estimated_time: 15 }
      ],
      automation_rules: [
        {
          condition: 'status_changed_to_approved',
          action: 'send_email_template',
          template: 'visa_approved_notification'
        },
        {
          condition: 'payment_completed',
          action: 'move_to_next_step',
          next_step: 4
        }
      ]
    },
    'Business Visa': {
      name: '비즈니스 비자 처리 워크플로우',
      checklist: [
        { id: 1, title: '신청서 접수', description: '비즈니스 비자 신청서 검토', estimated_time: 20 },
        { id: 2, title: '초청장 확인', description: '베트남 기업 초청장 검증', estimated_time: 30 },
        { id: 3, title: '서류 완성도 검토', description: '모든 필수 서류 제출 확인', estimated_time: 25 },
        { id: 4, title: '영사관 예약', description: '한국 내 베트남 영사관 방문 예약', estimated_time: 60 },
        { id: 5, title: '영사관 제출', description: '영사관 방문하여 서류 제출', estimated_time: 120 },
        { id: 6, title: '심사 대기', description: '영사관 심사 진행 대기', estimated_time: 4320 },
        { id: 7, title: '비자 수령', description: '승인된 비자 수령 및 고객 전달', estimated_time: 30 }
      ],
      automation_rules: [
        {
          condition: 'documents_incomplete',
          action: 'send_email_template',
          template: 'document_request'
        }
      ]
    }
  };

  const handleCreateDefaultTemplate = async (visaType) => {
    const template = defaultTemplates[visaType];
    try {
      await createTemplate({
        variables: {
          input: {
            ...template,
            visa_type: visaType
          }
        }
      });
    } catch (error) {
      console.error('Template creation error:', error);
    }
  };

  if (loading) return <div className="p-6">로딩 중...</div>;

  return (
    <div className="p-6 space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">워크플로우 관리</h1>
          <p className="text-gray-600 mt-2">비자 처리 프로세스를 자동화하고 관리합니다</p>
        </div>
        <div className="flex space-x-3">
          <Button 
            variant="outline"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            커스텀 템플릿
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Zap className="h-4 w-4 mr-2" />
            자동화 규칙
          </Button>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">활성 템플릿</p>
                <p className="text-2xl font-bold text-gray-900">
                  {templatesData?.getWorkflowTemplates?.length || 0}
                </p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">진행 중인 작업</p>
                <p className="text-2xl font-bold text-orange-600">24</p>
              </div>
              <Play className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">자동화율</p>
                <p className="text-2xl font-bold text-green-600">87%</p>
              </div>
              <Zap className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">평균 처리시간</p>
                <p className="text-2xl font-bold text-purple-600">2.3일</p>
              </div>
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 기본 템플릿 설치 */}
      {(!templatesData?.getWorkflowTemplates || templatesData.getWorkflowTemplates.length === 0) && (
        <Card className="border-dashed border-2 border-gray-300">
          <CardContent className="p-8 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">워크플로우 템플릿이 없습니다</h3>
            <p className="text-gray-600 mb-6">기본 템플릿을 설치하여 시작하세요</p>
            <div className="flex justify-center space-x-4">
              <Button 
                onClick={() => handleCreateDefaultTemplate('E-visa')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                E-visa 템플릿 설치
              </Button>
              <Button 
                onClick={() => handleCreateDefaultTemplate('Business Visa')}
                variant="outline"
              >
                비즈니스 비자 템플릿 설치
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 워크플로우 템플릿 목록 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {templatesData?.getWorkflowTemplates?.map((template) => (
          <Card key={template.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant="outline">{template.visa_type}</Badge>
                    <Badge className="bg-green-100 text-green-800">
                      {template.checklist?.length || 0}단계
                    </Badge>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm text-gray-600">
                  예상 처리 시간: {Math.floor((template.checklist?.reduce((sum, item) => sum + (item.estimated_time || 0), 0) || 0) / 60)}시간
                </div>
                
                {/* 체크리스트 미리보기 */}
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">주요 단계:</h4>
                  {template.checklist?.slice(0, 4).map((item, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm">
                      <CheckSquare className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">{item.title}</span>
                    </div>
                  ))}
                  {template.checklist?.length > 4 && (
                    <div className="text-sm text-gray-500 ml-6">
                      +{template.checklist.length - 4}개 단계 더
                    </div>
                  )}
                </div>

                {/* 자동화 규칙 */}
                {template.automation_rules && template.automation_rules.length > 0 && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Zap className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">
                        {template.automation_rules.length}개 자동화 규칙 적용
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t">
                  <span className="text-sm text-gray-500">
                    생성일: {new Date(template.created_at).toLocaleDateString('ko-KR')}
                  </span>
                  <Button size="sm" onClick={() => setSelectedTemplate(template)}>
                    상세보기
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 자동화 규칙 설정 섹션 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="h-5 w-5 mr-2 text-blue-600" />
            자동화 규칙 현황
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">12</div>
              <div className="text-sm text-gray-600">활성 규칙</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">156</div>
              <div className="text-sm text-gray-600">오늘 실행</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">98.5%</div>
              <div className="text-sm text-gray-600">성공률</div>
            </div>
          </div>
          
          <div className="mt-6">
            <h4 className="font-medium text-gray-900 mb-3">최근 자동화 실행 로그</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between py-2 px-3 bg-green-50 rounded">
                <span className="text-sm">E-visa 승인 완료 → 고객 알림 발송</span>
                <span className="text-xs text-gray-500">2분 전</span>
              </div>
              <div className="flex items-center justify-between py-2 px-3 bg-blue-50 rounded">
                <span className="text-sm">결제 완료 → 다음 단계 자동 진행</span>
                <span className="text-xs text-gray-500">5분 전</span>
              </div>
              <div className="flex items-center justify-between py-2 px-3 bg-yellow-50 rounded">
                <span className="text-sm">서류 미비 → 보완 요청 발송</span>
                <span className="text-xs text-gray-500">12분 전</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
