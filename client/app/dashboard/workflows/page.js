"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import { CREATE_WORKFLOW_TEMPLATE } from "@/lib/graphql/mutation/workflows";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckSquare, Plus, Settings, Play, FileText, Zap, Trash, Clock } from "lucide-react";
import { toast } from "react-hot-toast";

import Seo from "@/lib/seo";
import { useTranslation } from "react-i18next";
import { v4 as uuidv4 } from "uuid";
import PropTypes from "prop-types";
import PerformanceMonitor from "@/components/performance/PerformanceMonitor";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <button className="absolute text-gray-500 top-2 right-2 hover:text-gray-700" onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

const GET_WORKFLOW_TEMPLATES = gql`
  query GetWorkflowTemplates {
    getWorkflowTemplates {
      id
      name
      visa_type
      checklist
      automation_rules
      is_active
      created_at
      updated_at
    }
  }
`;

export default function WorkflowManagement() {
  const { t } = useTranslation();
  const [successRate, setSuccessRate] = useState(98.5);
  const [userInteractionLogs, setUserInteractionLogs] = useState([]); // 사용자 상호작용 로그 상태 추가

  const {
    data: templatesData,
    loading,
    refetch,
  } = useQuery(GET_WORKFLOW_TEMPLATES, {
    errorPolicy: "all",
  });

  const [createTemplate] = useMutation(CREATE_WORKFLOW_TEMPLATE, {
    onCompleted: () => {
      toast.success("워크플로우 템플릿이 생성되었습니다.");
      refetch();
    },
    onError: (error) => {
      toast.error("템플릿 생성 중 오류가 발생했습니다.");
    },
  });

  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAutomationModal, setShowAutomationModal] = useState(false);
  const [newAutomationRule, setNewAutomationRule] = useState({ condition: "", action: "" });

  // 기본 템플릿 데이터
  const defaultTemplates = {
    "E-visa": {
      name: "E-visa 처리 워크플로우",
      checklist: [
        { id: 1, title: "신청서 접수 확인", description: "온라인 신청서 정보 검토", estimated_time: 10 },
        { id: 2, title: "서류 검증", description: "여권, 사진 등 필수 서류 확인", estimated_time: 15 },
        { id: 3, title: "결제 확인", description: "비자 수수료 결제 완료 확인", estimated_time: 5 },
        { id: 4, title: "베트남 당국 제출", description: "온라인 시스템을 통한 신청서 제출", estimated_time: 30 },
        { id: 5, title: "승인 확인", description: "베트남 당국 승인 결과 확인", estimated_time: 1440 },
        { id: 6, title: "비자 발급", description: "E-visa PDF 파일 생성 및 전송", estimated_time: 15 },
      ],
      automation_rules: [
        {
          condition: "status_changed_to_approved",
          action: "send_email_template",
          template: "visa_approved_notification",
        },
        {
          condition: "payment_completed",
          action: "move_to_next_step",
          next_step: 4,
        },
      ],
    },
    "Business Visa": {
      name: "비즈니스 비자 처리 워크플로우",
      checklist: [
        { id: 1, title: "신청서 접수", description: "비즈니스 비자 신청서 검토", estimated_time: 20 },
        { id: 2, title: "초청장 확인", description: "베트남 기업 초청장 검증", estimated_time: 30 },
        { id: 3, title: "서류 완성도 검토", description: "모든 필수 서류 제출 확인", estimated_time: 25 },
        { id: 4, title: "영사관 예약", description: "한국 내 베트남 영사관 방문 예약", estimated_time: 60 },
        { id: 5, title: "영사관 제출", description: "영사관 방문하여 서류 제출", estimated_time: 120 },
        { id: 6, title: "심사 대기", description: "영사관 심사 진행 대기", estimated_time: 4320 },
        { id: 7, title: "비자 수령", description: "승인된 비자 수령 및 고객 전달", estimated_time: 30 },
      ],
      automation_rules: [
        {
          condition: "documents_incomplete",
          action: "send_email_template",
          template: "document_request",
        },
      ],
    },
  };

  const handleCreateDefaultTemplate = async (visaType) => {
    const template = defaultTemplates[visaType];
    try {
      await createTemplate({
        variables: {
          input: {
            ...template,
            visa_type: visaType,
          },
        },
      });
    } catch (error) {
      console.error("Template creation error:", error);
    }
  };

  const handleShowDetails = (template) => {
    setSelectedTemplate(template);
    setShowDetailModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailModal(false);
    setSelectedTemplate(null);
  };

  const handleAddAutomationRule = () => {
    if (selectedTemplate) {
      const updatedTemplate = {
        ...selectedTemplate,
        automation_rules: [...selectedTemplate.automation_rules, newAutomationRule],
      };
      setSelectedTemplate(updatedTemplate);
      setNewAutomationRule({ condition: "", action: "" });
      toast.success("새 자동화 규칙이 추가되었습니다.");
    }
  };

  const logUserInteraction = (action, details) => {
    const timestamp = new Date().toISOString();
    const id = uuidv4();
    setUserInteractionLogs((prevLogs) => [...prevLogs, { id, action, details, timestamp }]);
  };

  const updateSuccessRate = (newRate) => {
    setSuccessRate(newRate);
    logUserInteraction("Success Rate Updated", `성공률이 ${newRate}%로 업데이트되었습니다.`);
  };

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth <= 768;
      document.body.classList.toggle("mobile-view", isMobile);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (loading) return <div className="p-6">로딩 중...</div>;

  return (
    <div className="p-6 space-y-6">
      {/* 다국어 지원 */}
      <h1 className="text-3xl font-bold text-gray-900">{t("workflow_management.title")}</h1>
      <p className="mt-2 text-gray-600">{t("workflow_management.description")}</p>

      {/* SEO 최적화 */}
      <Seo title="워크플로우 관리 | VietnamVisa24" description="비자 처리 프로세스를 자동화하고 관리하는 워크플로우 관리 페이지입니다." keywords="비자, 워크플로우, 자동화, VietnamVisa24" />

      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">워크플로우 관리</h1>
          <p className="mt-2 text-gray-600">비자 처리 프로세스를 자동화하고 관리합니다</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            커스텀 템플릿
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Zap className="w-4 h-4 mr-2" />
            자동화 규칙
          </Button>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">활성 템플릿</p>
                <p className="text-2xl font-bold text-gray-900">{templatesData?.getWorkflowTemplates?.length || 0}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
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
              <Play className="w-8 h-8 text-orange-600" />
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
              <Zap className="w-8 h-8 text-green-600" />
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
              <Clock className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 기본 템플릿 설치 */}
      {(!templatesData?.getWorkflowTemplates || templatesData.getWorkflowTemplates.length === 0) && (
        <Card className="border-2 border-gray-300 border-dashed">
          <CardContent className="p-8 text-center">
            <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="mb-2 text-lg font-medium text-gray-900">워크플로우 템플릿이 없습니다</h3>
            <p className="mb-6 text-gray-600">기본 템플릿을 설치하여 시작하세요</p>
            <div className="flex justify-center space-x-4">
              <Button onClick={() => handleCreateDefaultTemplate("E-visa")} className="bg-blue-600 hover:bg-blue-700">
                E-visa 템플릿 설치
              </Button>
              <Button onClick={() => handleCreateDefaultTemplate("Business Visa")} variant="outline">
                비즈니스 비자 템플릿 설치
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 워크플로우 템플릿 목록 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {templatesData?.getWorkflowTemplates?.map((template) => (
          <Card key={template.id} className="transition-shadow hover:shadow-lg">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <div className="flex items-center mt-2 space-x-2">
                    <Badge variant="outline">{template.visa_type}</Badge>
                    <Badge className="text-green-800 bg-green-100">{template.checklist?.length || 0}단계</Badge>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    <Settings className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDeleteTemplate(template.id)}>
                    <Trash className="w-4 h-4" /> 삭제
                  </Button>
                  <Button size="sm" onClick={() => handleShowDetails(template)}>
                    상세보기
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm text-gray-600" aria-label="예상 처리 시간">
                  예상 처리 시간: {Math.floor((template.checklist?.reduce((sum, item) => sum + (item.estimated_time || 0), 0) || 0) / 60)}시간
                </div>

                {/* 체크리스트 미리보기 */}
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">주요 단계:</h4>
                  {template.checklist?.map((item) => (
                    <div key={item.id} className="flex items-center space-x-2 text-sm">
                      <CheckSquare className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{item.title}</span>
                    </div>
                  ))}
                </div>

                {/* 자동화 규칙 */}
                {template.automation_rules && template.automation_rules.length > 0 && (
                  <div className="p-3 mt-4 rounded-lg bg-blue-50">
                    <div className="flex items-center space-x-2">
                      <Zap className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">{template.automation_rules.length}개 자동화 규칙 적용</span>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t">
                  <span className="text-sm text-gray-500">생성일: {new Date(template.created_at).toLocaleDateString("ko-KR")}</span>
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
            <Zap className="w-5 h-5 mr-2 text-blue-600" />
            자동화 규칙 현황
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="text-center" aria-label="활성 규칙">
              <div className="text-2xl font-bold text-green-600">12</div>
              <div className="text-sm text-gray-600">{t("workflow_management.active_rules")}</div>
            </div>
            <div className="text-center" aria-label="오늘 실행">
              <div className="text-2xl font-bold text-blue-600">156</div>
              <div className="text-sm text-gray-600">{t("workflow_management.executed_today")}</div>
            </div>
            <div className="text-center" aria-label="성공률">
              <div className="text-2xl font-bold text-purple-600">98.5%</div>
              <div className="text-sm text-gray-600">{t("workflow_management.success_rate")}</div>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="mb-3 font-medium text-gray-900">최근 자동화 실행 로그</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between px-3 py-2 rounded bg-green-50">
                <span className="text-sm">E-visa 승인 완료 → 고객 알림 발송</span>
                <span className="text-xs text-gray-500">2분 전</span>
              </div>
              <div className="flex items-center justify-between px-3 py-2 rounded bg-blue-50">
                <span className="text-sm">결제 완료 → 다음 단계 자동 진행</span>
                <span className="text-xs text-gray-500">5분 전</span>
              </div>
              <div className="flex items-center justify-between px-3 py-2 rounded bg-yellow-50">
                <span className="text-sm">서류 미비 → 보완 요청 발송</span>
                <span className="text-xs text-gray-500">12분 전</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 고급 자동화 규칙 구성 섹션 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="w-5 h-5 mr-2 text-blue-600" />
            고급 자동화 규칙 구성
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label htmlFor="advanced-condition" className="block text-sm font-medium text-gray-700">
                조건
              </label>
              <input id="advanced-condition" type="text" className="w-full p-2 mt-1 border rounded-md" placeholder="예: status_changed_to_approved" />
            </div>
            <div>
              <label htmlFor="advanced-action" className="block text-sm font-medium text-gray-700">
                액션
              </label>
              <input id="advanced-action" type="text" className="w-full p-2 mt-1 border rounded-md" placeholder="예: send_email_template" />
            </div>
            <Button className="bg-green-600 hover:bg-green-700">규칙 추가</Button>
          </div>
        </CardContent>
      </Card>

      {/* 워크플로우 성능 분석 섹션 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">워크플로우 성능 분석</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">워크플로우의 평균 처리 시간 및 성공률을 분석합니다.</p>
            <PerformanceMonitor data={templatesData?.getWorkflowTemplates} />
          </div>
        </CardContent>
      </Card>

      {/* 상세보기 모달 */}
      {showDetailModal && selectedTemplate && (
        <Modal isOpen={showDetailModal} onClose={handleCloseModal}>
          <div className="p-6">
            <h2 className="text-xl font-bold">{selectedTemplate.name}</h2>
            <p className="mt-2 text-gray-600">{selectedTemplate.visa_type}</p>
            <div className="mt-4 space-y-2">
              <h4 className="font-medium text-gray-900">체크리스트:</h4>
              {selectedTemplate.checklist?.map((item) => (
                <div key={item.id} className="flex items-center space-x-2 text-sm">
                  <CheckSquare className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{item.title}</span>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <h4 className="font-medium text-gray-900">자동화 규칙:</h4>
              {selectedTemplate.automation_rules?.map((rule) => (
                <div key={rule.id} className="text-sm text-gray-600">
                  조건: {rule.condition}, 액션: {rule.action}
                </div>
              ))}
            </div>
          </div>
        </Modal>
      )}

      {/* 자동화 규칙 추가 모달 */}
      {showAutomationModal && (
        <Modal isOpen={showAutomationModal} onClose={() => setShowAutomationModal(false)}>
          <div className="p-6">
            <h2 className="text-xl font-bold">자동화 규칙 추가</h2>
            <div className="mt-4 space-y-4">
              <div>
                <label htmlFor="condition" className="block text-sm font-medium text-gray-700">
                  조건
                </label>
                <input
                  id="condition"
                  type="text"
                  className="w-full p-2 mt-1 border rounded-md"
                  value={newAutomationRule.condition}
                  onChange={(e) => setNewAutomationRule({ ...newAutomationRule, condition: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="action" className="block text-sm font-medium text-gray-700">
                  액션
                </label>
                <input
                  id="action"
                  type="text"
                  className="w-full p-2 mt-1 border rounded-md"
                  value={newAutomationRule.action}
                  onChange={(e) => setNewAutomationRule({ ...newAutomationRule, action: e.target.value })}
                />
              </div>
              <Button className="bg-green-600 hover:bg-green-700" onClick={handleAddAutomationRule}>
                추가
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* 사용자 상호작용 로그 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="w-5 h-5 mr-2 text-blue-600" />
            사용자 상호작용 로그
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {userInteractionLogs.map((log) => (
              <div key={log.id} className="flex items-center justify-between px-3 py-2 rounded bg-gray-50">
                <span className="text-sm">
                  {log.action}: {log.details}
                </span>
                <span className="text-xs text-gray-500">{new Date(log.timestamp).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 성공률 업데이트 섹션 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="w-5 h-5 mr-2 text-purple-600" />
            성공률 업데이트
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{successRate}%</div>
            <Button className="mt-4 bg-purple-600 hover:bg-purple-700" onClick={() => updateSuccessRate(successRate + 0.1)}>
              성공률 증가
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
