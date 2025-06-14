const { VisaApplication, ApplicationStatusHistory, Payment, Document } = require("../models");
const { emailTemplates } = require("./emailService");
const socketManager = require("./socketManager");

/**
 * 워크플로우 엔진 - 비자 신청 처리 자동화
 */
class WorkflowEngine {
  constructor() {
    this.workflows = new Map();
    this.setupDefaultWorkflows();
  }

  /**
   * 기본 워크플로우 설정
   */
  setupDefaultWorkflows() {
    // E-VISA 워크플로우
    this.registerWorkflow("e_visa", {
      name: "E-VISA 처리 워크플로우",
      steps: [
        {
          id: "application_received",
          name: "신청 접수",
          description: "신청서 접수 및 기본 검토",
          autoAdvance: true,
          maxDuration: 30, // 30분
          actions: ["send_confirmation_email", "validate_basic_info"],
        },
        {
          id: "document_review",
          name: "서류 검토",
          description: "제출된 서류의 완성도 및 유효성 검토",
          autoAdvance: false,
          maxDuration: 1440, // 24시간
          actions: ["review_documents", "check_requirements"],
        },
        {
          id: "payment_required",
          name: "결제 대기",
          description: "신청 비용 결제 대기",
          autoAdvance: true,
          maxDuration: 4320, // 72시간
          actions: ["send_payment_request", "check_payment_status"],
        },
        {
          id: "government_submission",
          name: "정부 제출",
          description: "베트남 이민청에 신청서 제출",
          autoAdvance: true,
          maxDuration: 60, // 1시간
          actions: ["submit_to_government", "update_tracking"],
        },
        {
          id: "approval_pending",
          name: "승인 대기",
          description: "베트남 정부 승인 대기",
          autoAdvance: true,
          maxDuration: 4320, // 72시간
          actions: ["check_government_status"],
        },
        {
          id: "visa_issued",
          name: "비자 발급",
          description: "비자 발급 및 고객 전달",
          autoAdvance: true,
          maxDuration: 30, // 30분
          actions: ["generate_visa", "send_visa_email", "complete_application"],
        },
      ],
      triggers: {
        payment_completed: "payment_required → government_submission",
        document_approved: "document_review → payment_required",
        government_approved: "approval_pending → visa_issued",
        government_rejected: "approval_pending → rejected",
      },
    });

    // Business Visa 워크플로우
    this.registerWorkflow("business_visa", {
      name: "비즈니스 비자 처리 워크플로우",
      steps: [
        {
          id: "application_received",
          name: "신청 접수",
          description: "비즈니스 비자 신청서 접수",
          autoAdvance: true,
          maxDuration: 60,
          actions: ["send_confirmation_email", "assign_specialist"],
        },
        {
          id: "invitation_verification",
          name: "초청장 검증",
          description: "베트남 기업 초청장 및 관련 서류 검증",
          autoAdvance: false,
          maxDuration: 2880, // 48시간
          actions: ["verify_invitation", "contact_inviting_company"],
        },
        {
          id: "document_review",
          name: "서류 완성도 검토",
          description: "모든 필수 서류 제출 확인",
          autoAdvance: false,
          maxDuration: 1440,
          actions: ["review_business_documents", "check_company_registration"],
        },
        {
          id: "consulate_appointment",
          name: "영사관 예약",
          description: "한국 내 베트남 영사관 방문 예약",
          autoAdvance: false,
          maxDuration: 10080, // 7일
          actions: ["schedule_appointment", "send_appointment_notice"],
        },
        {
          id: "consulate_interview",
          name: "영사관 면접",
          description: "영사관 방문 및 인터뷰 진행",
          autoAdvance: false,
          maxDuration: 1440,
          actions: ["conduct_interview", "submit_application"],
        },
        {
          id: "visa_processing",
          name: "비자 처리",
          description: "영사관에서 비자 심사 및 발급",
          autoAdvance: true,
          maxDuration: 10080, // 7일
          actions: ["track_processing", "send_status_updates"],
        },
        {
          id: "visa_issued",
          name: "비자 발급 완료",
          description: "비자 수령 및 고객 전달",
          autoAdvance: true,
          maxDuration: 1440,
          actions: ["collect_visa", "deliver_to_customer"],
        },
      ],
      triggers: {
        invitation_verified: "invitation_verification → document_review",
        documents_complete: "document_review → consulate_appointment",
        appointment_confirmed: "consulate_appointment → consulate_interview",
        interview_completed: "consulate_interview → visa_processing",
        visa_approved: "visa_processing → visa_issued",
      },
    });

    // Work Permit 워크플로우
    this.registerWorkflow("work_permit", {
      name: "노동허가서 처리 워크플로우",
      steps: [
        {
          id: "application_received",
          name: "신청 접수",
          description: "노동허가서 신청 접수",
          autoAdvance: true,
          maxDuration: 60,
          actions: ["send_confirmation_email", "assign_specialist"],
        },
        {
          id: "document_collection",
          name: "서류 수집",
          description: "한국 및 베트남 관련 서류 수집",
          autoAdvance: false,
          maxDuration: 14400, // 10일
          actions: ["guide_document_preparation", "assist_document_collection"],
        },
        {
          id: "document_authentication",
          name: "서류 공증/아포스티유",
          description: "서류 공증 및 아포스티유 처리",
          autoAdvance: false,
          maxDuration: 10080, // 7일
          actions: ["process_apostille", "notarize_documents"],
        },
        {
          id: "vietnam_submission",
          name: "베트남 제출",
          description: "베트남 노동부에 서류 제출",
          autoAdvance: true,
          maxDuration: 1440,
          actions: ["submit_to_molisa", "start_tracking"],
        },
        {
          id: "government_review",
          name: "정부 심사",
          description: "베트남 노동부 심사 진행",
          autoAdvance: true,
          maxDuration: 21600, // 15일
          actions: ["track_government_review", "handle_inquiries"],
        },
        {
          id: "permit_issued",
          name: "허가서 발급",
          description: "노동허가서 발급 및 전달",
          autoAdvance: true,
          maxDuration: 1440,
          actions: ["collect_permit", "deliver_to_customer", "guide_next_steps"],
        },
      ],
      triggers: {
        documents_collected: "document_collection → document_authentication",
        authentication_complete: "document_authentication → vietnam_submission",
        government_approved: "government_review → permit_issued",
      },
    });
  }

  /**
   * 워크플로우 등록
   * @param {string} type - 워크플로우 타입
   * @param {Object} workflow - 워크플로우 정의
   */
  registerWorkflow(type, workflow) {
    this.workflows.set(type, workflow);
    console.log(`✅ Workflow registered: ${type}`);
  }

  /**
   * 신청서에 대한 워크플로우 시작
   * @param {number} applicationId - 신청서 ID
   */
  async startWorkflow(applicationId) {
    try {
      const application = await VisaApplication.findByPk(applicationId);
      if (!application) {
        throw new Error("Application not found");
      }

      const workflow = this.workflows.get(application.visa_type);
      if (!workflow) {
        console.log(`⚠️ No workflow defined for visa type: ${application.visa_type}`);
        return;
      }

      const firstStep = workflow.steps[0];

      // 첫 번째 단계로 상태 변경
      await this.moveToStep(applicationId, firstStep.id);

      console.log(`🚀 Workflow started for application ${applicationId}: ${workflow.name}`);
    } catch (error) {
      console.error("❌ Error starting workflow:", error);
    }
  }
  /**
   * 특정 단계로 이동
   * @param {number} applicationId - 신청서 ID
   * @param {string} stepId - 이동할 단계 ID
   * @param {string} [note] - 메모
   */
  async moveToStep(applicationId, stepId, note = null) {
    try {
      const application = await VisaApplication.findByPk(applicationId);
      if (!application) {
        throw new Error("Application not found");
      }

      const workflow = this.workflows.get(application.visa_type);
      if (!workflow) {
        throw new Error("Workflow not found");
      }

      const step = workflow.steps.find((s) => s.id === stepId);
      if (!step) {
        throw new Error("Step not found");
      }

      const previousStatus = application.status;

      // 상태 변경
      await application.update({ status: stepId });

      // 상태 변경 이력 기록
      await ApplicationStatusHistory.create({
        application_id: applicationId,
        from_status: previousStatus,
        to_status: stepId,
        changed_by: "system",
        note: note || `자동 워크플로우: ${step.name}`,
        created_at: new Date(),
      });

      // 실시간 알림 전송 (고객에게)
      if (application.user_id) {
        socketManager.notifyApplicationStatusChange(application.user_id, { ...application.toJSON(), status: stepId }, previousStatus, stepId);
      }

      // 실시간 알림 전송 (관리자에게)
      socketManager.notifyWorkflowProgress(
        application.user_id,
        {
          applicationId: applicationId,
          templateName: workflow.name,
          status: stepId,
        },
        {
          id: stepId,
          name: step.name,
          description: step.description,
        }
      );

      // 단계별 액션 실행
      await this.executeStepActions(applicationId, step);

      // 자동 진행 가능한 단계인 경우 다음 단계 확인
      if (step.autoAdvance) {
        setTimeout(() => {
          this.checkAutoAdvance(applicationId, stepId);
        }, 5000); // 5초 후 확인
      }

      console.log(`✅ Application ${applicationId} moved to step: ${step.name}`);
    } catch (error) {
      console.error("❌ Error moving to step:", error);
    }
  }

  /**
   * 단계별 액션 실행
   * @param {number} applicationId - 신청서 ID
   * @param {Object} step - 워크플로우 단계
   */
  async executeStepActions(applicationId, step) {
    for (const action of step.actions) {
      try {
        await this.executeAction(applicationId, action);
      } catch (error) {
        console.error(`❌ Error executing action ${action}:`, error);
      }
    }
  }

  /**
   * 개별 액션 실행
   * @param {number} applicationId - 신청서 ID
   * @param {string} action - 액션 이름
   */
  async executeAction(applicationId, action) {
    const application = await VisaApplication.findByPk(applicationId);
    if (!application) return;

    switch (action) {
      case "send_confirmation_email":
        await emailTemplates.sendApplicationConfirmation(application);
        // 이메일 발송 알림
        if (application.user_id) {
          socketManager.sendNotification(`user_${application.user_id}`, {
            type: "email_sent",
            title: "확인 이메일 발송",
            message: "신청 확인 이메일이 발송되었습니다.",
          });
        }
        break;
      case "send_payment_request": {
        const payment = await Payment.findOne({
          where: { application_id: applicationId },
          order: [["created_at", "DESC"]],
        });
        if (payment) {
          await emailTemplates.sendPaymentRequest(application, payment);
          // 결제 요청 알림
          if (application.user_id) {
            socketManager.sendNotification(`user_${application.user_id}`, {
              type: "payment_request",
              title: "결제 요청",
              message: "비자 수수료 결제가 필요합니다.",
              data: { payment },
            });
          }
        }
        break;
      }

      case "validate_basic_info":
        await this.validateBasicInfo(application);
        break;
      case "review_documents":
        const documentsValid = await this.reviewDocuments(application);
        // 서류 검토 완료 알림
        if (application.user_id) {
          const message = documentsValid ? "서류 검토가 완료되었습니다." : "추가 서류가 필요합니다.";
          socketManager.sendNotification(`user_${application.user_id}`, {
            type: "document_review",
            title: "서류 검토 완료",
            message,
          });
        }
        break;

      case "check_payment_status":
        await this.checkPaymentStatus(application);
        break;
      case "submit_to_government":
        await this.submitToGovernment(application);
        // 정부 제출 알림
        if (application.user_id) {
          socketManager.sendNotification(`user_${application.user_id}`, {
            type: "government_submission",
            title: "정부 기관 제출",
            message: "신청서가 베트남 정부 기관에 제출되었습니다.",
          });
        }
        break;

      case "check_government_status":
        await this.checkGovernmentStatus(application);
        break;
      case "generate_visa":
        const visaData = await this.generateVisa(application);
        // 비자 생성 알림
        if (application.user_id) {
          socketManager.sendNotification(`user_${application.user_id}`, {
            type: "visa_generated",
            title: "비자 생성 완료",
            message: "비자가 성공적으로 생성되었습니다.",
            data: { visaData },
          });
        }
        break;
      case "send_visa_email":
        await this.sendVisaEmail(application);
        // 비자 이메일 발송 알림
        if (application.user_id) {
          socketManager.sendNotification(`user_${application.user_id}`, {
            type: "visa_email_sent",
            title: "비자 발송 완료",
            message: "비자가 이메일로 발송되었습니다.",
          });
        }
        break;
      case "complete_application":
        await application.update({ status: "completed" });
        // 신청 완료 알림
        if (application.user_id) {
          socketManager.sendNotification(`user_${application.user_id}`, {
            type: "application_completed",
            title: "신청 처리 완료",
            message: "모든 처리가 완료되었습니다.",
          });
        }
        break;

      default:
        console.log(`⚠️ Unknown action: ${action}`);
    }
  }

  /**
   * 자동 진행 조건 확인
   * @param {number} applicationId - 신청서 ID
   * @param {string} currentStepId - 현재 단계 ID
   */
  async checkAutoAdvance(applicationId, currentStepId) {
    try {
      const application = await VisaApplication.findByPk(applicationId);
      if (!application || application.status !== currentStepId) {
        return; // 이미 다른 단계로 이동함
      }

      const workflow = this.workflows.get(application.visa_type);
      if (!workflow) return;

      const currentStep = workflow.steps.find((s) => s.id === currentStepId);
      if (!currentStep || !currentStep.autoAdvance) return;

      // 조건 검사
      const canAdvance = await this.checkAdvanceConditions(applicationId, currentStepId);

      if (canAdvance) {
        const nextStepIndex = workflow.steps.findIndex((s) => s.id === currentStepId) + 1;
        if (nextStepIndex < workflow.steps.length) {
          const nextStep = workflow.steps[nextStepIndex];
          await this.moveToStep(applicationId, nextStep.id, "자동 진행");
        }
      }
    } catch (error) {
      console.error("❌ Error checking auto advance:", error);
    }
  }

  /**
   * 진행 조건 확인
   * @param {number} applicationId - 신청서 ID
   * @param {string} stepId - 단계 ID
   * @returns {boolean} - 진행 가능 여부
   */
  async checkAdvanceConditions(applicationId, stepId) {
    switch (stepId) {
      case "application_received":
        return true; // 항상 진행

      case "payment_required":
        // 결제 완료 확인
        const payment = await Payment.findOne({
          where: {
            application_id: applicationId,
            status: "paid",
          },
        });
        return !!payment;

      case "government_submission":
        return true; // 자동 제출

      case "approval_pending":
        // 정부 승인 상태 확인 (실제로는 외부 API 호출)
        return Math.random() > 0.7; // 30% 확률로 승인 (테스트용)

      case "visa_issued":
        return true; // 자동 발급

      default:
        return false;
    }
  }

  /**
   * 트리거 이벤트 처리
   * @param {number} applicationId - 신청서 ID
   * @param {string} triggerEvent - 트리거 이벤트
   */
  async handleTrigger(applicationId, triggerEvent) {
    try {
      const application = await VisaApplication.findByPk(applicationId);
      if (!application) return;

      const workflow = this.workflows.get(application.visa_type);
      if (!workflow || !workflow.triggers[triggerEvent]) return;

      const triggerRule = workflow.triggers[triggerEvent];
      const [fromStep, toStep] = triggerRule.split(" → ");

      // 현재 상태가 조건에 맞는지 확인
      if (application.status === fromStep || fromStep === "*") {
        await this.moveToStep(applicationId, toStep, `트리거: ${triggerEvent}`);
      }
    } catch (error) {
      console.error("❌ Error handling trigger:", error);
    }
  }

  // === 액션 구현 함수들 ===

  async validateBasicInfo(application) {
    // 기본 정보 유효성 검사
    const errors = [];

    if (!application.full_name || application.full_name.trim().length < 2) {
      errors.push("유효하지 않은 이름");
    }

    if (!application.email || !application.email.includes("@")) {
      errors.push("유효하지 않은 이메일");
    }

    if (!application.passport_number || application.passport_number.length < 6) {
      errors.push("유효하지 않은 여권 번호");
    }

    if (errors.length > 0) {
      await application.update({
        status: "rejected",
        rejection_reason: errors.join(", "),
      });
      return false;
    }

    return true;
  }

  async reviewDocuments(application) {
    // 서류 검토 로직
    const documents = await Document.findAll({
      where: { application_id: application.id },
    });

    const requiredDocs = this.getRequiredDocuments(application.visa_type);
    const missingDocs = requiredDocs.filter((required) => !documents.some((doc) => doc.document_type === required));

    if (missingDocs.length > 0) {
      await emailTemplates.sendDocumentRequest(application, missingDocs);
      await application.update({ status: "document_required" });
      return false;
    }

    return true;
  }

  async checkPaymentStatus(application) {
    const payment = await Payment.findOne({
      where: { application_id: application.id },
      order: [["created_at", "DESC"]],
    });

    return payment && payment.status === "paid";
  }

  async submitToGovernment(application) {
    // 정부 기관 제출 시뮬레이션
    console.log(`🏛️ Submitting application ${application.id} to government`);

    // 실제로는 외부 API 호출
    // const result = await governmentAPI.submitApplication(application);

    await application.update({
      government_reference: `GOV-${Date.now()}`,
      submitted_to_government: new Date(),
    });

    return true;
  }

  async checkGovernmentStatus(application) {
    // 정부 승인 상태 확인 시뮬레이션
    console.log(`🏛️ Checking government status for application ${application.id}`);

    // 실제로는 외부 API 호출
    // const status = await governmentAPI.checkStatus(application.government_reference);

    return Math.random() > 0.5; // 50% 확률로 승인 (테스트용)
  }

  async generateVisa(application) {
    // 비자 생성 로직
    console.log(`📄 Generating visa for application ${application.id}`);

    const visaData = {
      visa_number: `VN-${Date.now()}`,
      issue_date: new Date(),
      expiry_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90일 후
      entry_type: application.visa_type === "e_visa" ? "single" : "multiple",
    };

    await application.update(visaData);
    return visaData;
  }

  async sendVisaEmail(application) {
    const visaDetails = {
      visaNumber: application.visa_number,
      validFrom: application.issue_date,
      validUntil: application.expiry_date,
      downloadLink: `${process.env.CLIENT_URL}/download-visa/${application.id}`,
    };

    await emailTemplates.sendVisaApproved(application, visaDetails);
  }

  getRequiredDocuments(visaType) {
    const requirements = {
      e_visa: ["passport_copy", "photo"],
      business_visa: ["passport_copy", "photo", "invitation_letter", "company_registration"],
      work_permit: ["passport_copy", "photo", "diploma", "criminal_record", "health_certificate"],
    };

    return requirements[visaType] || [];
  }
}

// 전역 워크플로우 엔진 인스턴스
const workflowEngine = new WorkflowEngine();

module.exports = workflowEngine;
