const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs").promises;
const path = require("path");

// 이메일 전송 설정
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: process.env.SMTP_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// 이메일 템플릿 캐시
const templateCache = new Map();

/**
 * 이메일 템플릿 로드 및 컴파일
 * @param {string} templateName - 템플릿 이름
 * @returns {Function} - 컴파일된 Handlebars 템플릿
 */
async function loadTemplate(templateName) {
  if (templateCache.has(templateName)) {
    return templateCache.get(templateName);
  }

  try {
    const templatePath = path.join(__dirname, "../templates/email", `${templateName}.hbs`);
    const templateContent = await fs.readFile(templatePath, "utf8");
    const compiledTemplate = handlebars.compile(templateContent);

    templateCache.set(templateName, compiledTemplate);
    return compiledTemplate;
  } catch (error) {
    console.error(`❌ Error loading email template ${templateName}:`, error);
    // 기본 템플릿 반환
    return handlebars.compile("<p>{{message}}</p>");
  }
}

/**
 * 이메일 발송
 * @param {Object} emailData - 이메일 데이터
 * @param {string} emailData.to - 수신자 이메일
 * @param {string} emailData.subject - 제목
 * @param {string} emailData.template - 템플릿 이름
 * @param {Object} emailData.data - 템플릿 데이터
 * @param {string} [emailData.html] - 직접 HTML (템플릿 대신)
 * @param {string} [emailData.text] - 텍스트 내용
 */
async function sendEmail(emailData) {
  try {
    let htmlContent = emailData.html;

    // 템플릿이 지정된 경우 렌더링
    if (emailData.template && !htmlContent) {
      const template = await loadTemplate(emailData.template);
      htmlContent = template(emailData.data || {});
    }

    const mailOptions = {
      from: `"베트남비자24" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: emailData.to,
      subject: emailData.subject,
      html: htmlContent,
      text: emailData.text,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent successfully to ${emailData.to}: ${result.messageId}`);
    return result;
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw error;
  }
}

/**
 * 대량 이메일 발송
 * @param {Array} emailList - 이메일 데이터 배열
 */
async function sendBulkEmails(emailList) {
  const results = [];

  for (const emailData of emailList) {
    try {
      const result = await sendEmail(emailData);
      results.push({ success: true, email: emailData.to, result });

      // 스팸 방지를 위한 지연
      await new Promise((resolve) => setTimeout(resolve, 100));
    } catch (error) {
      results.push({ success: false, email: emailData.to, error: error.message });
    }
  }

  return results;
}

/**
 * 이메일 템플릿 미리보기 (개발용)
 * @param {string} templateName - 템플릿 이름
 * @param {Object} data - 템플릿 데이터
 * @returns {string} - 렌더링된 HTML
 */
async function previewTemplate(templateName, data = {}) {
  try {
    const template = await loadTemplate(templateName);
    return template(data);
  } catch (error) {
    console.error("❌ Error previewing template:", error);
    throw error;
  }
}

// 사전 정의된 이메일 발송 함수들
const emailTemplates = {
  // 비자 신청 확인
  async sendApplicationConfirmation(application) {
    return sendEmail({
      to: application.email,
      subject: `[베트남비자24] 비자 신청 확인 - ${application.application_number}`,
      template: "application_confirmation",
      data: {
        customerName: application.full_name,
        applicationNumber: application.application_number,
        visaType: application.visa_type,
        submittedAt: application.created_at,
        estimatedProcessingTime: getEstimatedProcessingTime(application.visa_type),
      },
    });
  },

  // 서류 보완 요청
  async sendDocumentRequest(application, requiredDocuments) {
    return sendEmail({
      to: application.email,
      subject: `[베트남비자24] 서류 보완 요청 - ${application.application_number}`,
      template: "document_request",
      data: {
        fullName: application.full_name,
        applicationNumber: application.application_number,
        visaType: application.visa_type,
        requiredDocuments: requiredDocuments,
        requestDate: new Date().toLocaleDateString("ko-KR"),
        isUrgent: application.priority === "urgent",
        portalUrl: `${process.env.CLIENT_URL}/portal/${application.id}`,
      },
    });
  },

  // 비자 승인 완료
  async sendVisaApproved(application, visaDetails) {
    return sendEmail({
      to: application.email,
      subject: `[베트남비자24] 비자 발급 완료 - ${application.application_number}`,
      template: "visa_approved",
      data: {
        customerName: application.full_name,
        applicationNumber: application.application_number,
        visaType: application.visa_type,
        visaNumber: visaDetails.visaNumber,
        validFrom: visaDetails.validFrom,
        validUntil: visaDetails.validUntil,
        downloadLink: visaDetails.downloadLink,
      },
    });
  },

  // 비자 승인
  async sendVisaApproval(application, visaDetails) {
    return sendEmail({
      to: application.email,
      subject: `[베트남비자24] 🎉 비자 승인 완료 - ${application.application_number}`,
      template: "visa_approval",
      data: {
        fullName: application.full_name,
        applicationNumber: application.application_number,
        approvalDate: new Date().toLocaleDateString("ko-KR"),
        processingDays: visaDetails.processingDays || "N/A",
        visaType: application.visa_type,
        validityPeriod: visaDetails.validityPeriod || "30일",
        entryType: visaDetails.entryType || "단수",
        maxStayDuration: visaDetails.maxStayDuration || "30일",
        visaNumber: visaDetails.visaNumber,
        downloadUrl: visaDetails.downloadUrl,
        additionalRequirements: visaDetails.additionalRequirements,
        portalUrl: `${process.env.CLIENT_URL}/portal/${application.id}`,
      },
    });
  },

  // 비자 거절
  async sendVisaRejection(application, rejectionData) {
    return sendEmail({
      to: application.email,
      subject: `[베트남비자24] 비자 신청 결과 안내 - ${application.application_number}`,
      template: "visa_rejection",
      data: {
        fullName: application.full_name,
        applicationNumber: application.application_number,
        rejectionDate: new Date().toLocaleDateString("ko-KR"),
        visaType: application.visa_type,
        rejectionReasons: rejectionData.reasons || [],
        refundAmount: rejectionData.refundAmount,
        currency: rejectionData.currency || "KRW",
        refundDays: rejectionData.refundDays || "7-10 영업일",
        refundNote: rejectionData.refundNote,
        waitingPeriod: rejectionData.waitingPeriod,
        consultationUrl: `${process.env.CLIENT_URL}/consultation`,
        reapplyUrl: `${process.env.CLIENT_URL}/apply`,
        portalUrl: `${process.env.CLIENT_URL}/portal/${application.id}`,
      },
    });
  },

  // 결제 요청
  async sendPaymentRequest(application, payment) {
    return sendEmail({
      to: application.email,
      subject: `[베트남비자24] 결제 요청 - ${payment.invoice_number}`,
      template: "payment_request",
      data: {
        customerName: application.full_name,
        invoiceNumber: payment.invoice_number,
        amount: payment.amount,
        currency: payment.currency,
        dueDate: payment.due_date,
        paymentLink: `${process.env.CLIENT_URL}/payment/${payment.invoice_number}`,
        applicationNumber: application.application_number,
      },
    });
  },

  // 결제 확인
  async sendPaymentConfirmation(application, payment) {
    return sendEmail({
      to: application.email,
      subject: `[베트남비자24] 결제 완료 - ${payment.invoice_number}`,
      template: "payment_confirmation",
      data: {
        customerName: application.full_name,
        invoiceNumber: payment.invoice_number,
        amount: payment.paid_amount,
        currency: payment.currency,
        paymentMethod: payment.payment_method,
        paidAt: payment.paid_at,
        applicationNumber: application.application_number,
      },
    });
  },

  // 결제 실패 알림
  async sendPaymentFailed(application, payment, error) {
    return sendEmail({
      to: application.email,
      subject: `[베트남비자24] 결제 처리 실패 - ${application.application_number}`,
      template: "payment_failed",
      data: {
        fullName: application.full_name,
        applicationNumber: application.application_number,
        invoiceNumber: payment.invoice_number,
        amount: payment.amount,
        currency: payment.currency,
        failureReason: error.message || "결제 처리 중 오류가 발생했습니다",
        retryUrl: `${process.env.CLIENT_URL}/payment/${payment.id}/retry`,
        supportEmail: process.env.SUPPORT_EMAIL || "support@vietnamvisa24.com",
        supportPhone: process.env.SUPPORT_PHONE || "1588-0000",
      },
    });
  },

  // 상담 문의 접수
  async sendConsultationReceived(consultation) {
    return sendEmail({
      to: consultation.email,
      subject: `[베트남비자24] 상담 문의 접수 완료`,
      template: "consultation_received",
      data: {
        customerName: consultation.customer_name,
        consultationId: consultation.id,
        submittedAt: consultation.created_at,
        expectedResponseTime: "24시간 이내",
        serviceType: consultation.service_type,
        message: consultation.message,
        portalUrl: `${process.env.CLIENT_URL}/consultation/${consultation.id}`,
      },
    });
  },

  // 상담 답변 완료
  async sendConsultationReply(consultation, reply) {
    return sendEmail({
      to: consultation.email,
      subject: `[베트남비자24] 상담 답변 완료 - ${consultation.service_type}`,
      template: "consultation_reply",
      data: {
        customerName: consultation.customer_name,
        consultationId: consultation.id,
        serviceType: consultation.service_type,
        originalMessage: consultation.message,
        replyMessage: reply.message,
        repliedBy: reply.admin_name,
        repliedAt: reply.created_at,
        additionalNotes: reply.notes,
        portalUrl: `${process.env.CLIENT_URL}/consultation/${consultation.id}`,
      },
    });
  },

  // 관리자 알림
  async sendAdminNotification(adminEmail, type, data) {
    const subjects = {
      new_application: "새로운 비자 신청",
      payment_received: "결제 확인",
      document_uploaded: "서류 업로드",
      urgent_application: "긴급 비자 신청",
    };

    return sendEmail({
      to: adminEmail,
      subject: `[베트남비자24 관리자] ${subjects[type] || "알림"}`,
      template: "admin_notification",
      data: {
        notificationType: type,
        ...data,
      },
    });
  },
};

// 헬퍼 함수들
function getEstimatedProcessingTime(visaType) {
  const processingTimes = {
    e_visa: "1-3 영업일",
    business_visa: "5-7 영업일",
    tourist_visa: "3-5 영업일",
    work_permit: "15-20 영업일",
    visa_run: "당일",
  };

  return processingTimes[visaType] || "3-5 영업일";
}

// 이메일 템플릿 등록 (Handlebars 헬퍼)
handlebars.registerHelper("formatDate", function (date) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("ko-KR");
});

handlebars.registerHelper("formatCurrency", function (amount, currency = "KRW") {
  if (!amount) return "0";
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: currency,
  }).format(amount);
});

handlebars.registerHelper("eq", function (a, b) {
  return a === b;
});

module.exports = {
  sendEmail,
  sendBulkEmails,
  previewTemplate,
  emailTemplates,
  transporter,
};