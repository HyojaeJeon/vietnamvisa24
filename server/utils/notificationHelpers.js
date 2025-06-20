/**
 * 알림 생성 유틸리티 함수들
 * 다양한 상황에서 알림을 생성하는 헬퍼 함수들을 제공합니다.
 */

const models = require("../models");

/**
 * 비자 신청 상태 변경 알림 생성
 * @param {string} applicationId - 신청서 ID
 * @param {string} recipientEmail - 받는 사람 이메일
 * @param {string} oldStatus - 이전 상태
 * @param {string} newStatus - 새로운 상태
 */
const createApplicationStatusNotification = async (applicationId, recipientEmail, oldStatus, newStatus) => {
  try {
    const statusMessages = {
      PENDING: "접수 대기",
      PROCESSING: "처리 중",
      DOCUMENT_REVIEW: "서류 검토",
      SUBMITTED_TO_AUTHORITY: "기관 제출",
      APPROVED: "승인 완료",
      REJECTED: "승인 거부",
      COMPLETED: "처리 완료",
    };

    const notification = await models.Notification.create({
      type: "application_status_change",
      title: `비자 신청 상태가 변경되었습니다`,
      message: `신청서 상태가 "${statusMessages[oldStatus] || oldStatus}"에서 "${statusMessages[newStatus] || newStatus}"로 변경되었습니다.`,
      recipient: recipientEmail,
      priority: "normal",
      relatedId: applicationId,
      targetUrl: `/dashboard/applications/${applicationId}`,
      status: "unread",
    });

    console.log(`✅ 상태 변경 알림 생성 완료: ${notification.id}`);
    return notification;
  } catch (error) {
    console.error("❌ 상태 변경 알림 생성 실패:", error);
    throw error;
  }
};

/**
 * 새 비자 신청 알림 생성 (관리자용)
 * @param {string} applicationId - 신청서 ID
 * @param {string} applicantName - 신청자 이름
 * @param {string} visaType - 비자 종류
 */
const createNewApplicationNotification = async (applicationId, applicantName, visaType) => {
  try {
    // 모든 관리자에게 알림 전송 (임시로 admin@example.com 사용)
    const adminEmails = ["admin@example.com"];

    const notifications = await Promise.all(
      adminEmails.map(email =>
        models.Notification.create({
          type: "new_application",
          title: "새로운 비자 신청이 접수되었습니다",
          message: `${applicantName}님의 ${visaType} 신청이 접수되었습니다.`,
          recipient: email,
          priority: "normal",
          relatedId: applicationId,
          targetUrl: `/dashboard/applications/${applicationId}`,
          status: "unread",
        })
      )
    );

    console.log(`✅ 새 신청 알림 생성 완료: ${notifications.length}개`);
    return notifications;
  } catch (error) {
    console.error("❌ 새 신청 알림 생성 실패:", error);
    throw error;
  }
};

/**
 * 서류 요청 알림 생성
 * @param {string} applicationId - 신청서 ID
 * @param {string} recipientEmail - 받는 사람 이메일
 * @param {string} documentType - 요청할 서류 종류
 */
const createDocumentRequestNotification = async (applicationId, recipientEmail, documentType) => {
  try {
    const documentNames = {
      passport: "여권 사본",
      photo: "증명사진",
      flight_ticket: "항공권 예약 확인서",
      bank_statement: "은행 잔고 증명서",
      invitation_letter: "초청장",
      business_registration: "사업자등록증",
    };

    const notification = await models.Notification.create({
      type: "document_required",
      title: "추가 서류 제출이 필요합니다",
      message: `${documentNames[documentType] || documentType} 제출이 필요합니다. 신청서를 확인해주세요.`,
      recipient: recipientEmail,
      priority: "high",
      relatedId: applicationId,
      targetUrl: `/dashboard/applications/${applicationId}`,
      status: "unread",
    });

    console.log(`✅ 서류 요청 알림 생성 완료: ${notification.id}`);
    return notification;
  } catch (error) {
    console.error("❌ 서류 요청 알림 생성 실패:", error);
    throw error;
  }
};

/**
 * 부가 서비스 신청 알림 생성
 * @param {string} serviceId - 서비스 ID
 * @param {string} recipientEmail - 받는 사람 이메일
 * @param {string} serviceName - 서비스 이름
 */
const createAdditionalServiceNotification = async (serviceId, recipientEmail, serviceName) => {
  try {
    const notification = await models.Notification.create({
      type: "system",
      title: "부가 서비스 신청이 접수되었습니다",
      message: `${serviceName} 서비스 신청이 접수되었습니다.`,
      recipient: recipientEmail,
      priority: "normal",
      relatedId: serviceId,
      targetUrl: `/dashboard/services/${serviceId}`, // 향후 부가 서비스 페이지
      status: "unread",
    });

    console.log(`✅ 부가 서비스 알림 생성 완료: ${notification.id}`);
    return notification;
  } catch (error) {
    console.error("❌ 부가 서비스 알림 생성 실패:", error);
    throw error;
  }
};

/**
 * 시스템 알림 생성
 * @param {string} title - 알림 제목
 * @param {string} message - 알림 내용
 * @param {string} recipientEmail - 받는 사람 이메일
 * @param {string} priority - 우선순위 (normal, high, urgent)
 * @param {string} targetUrl - 클릭 시 이동할 URL
 */
const createSystemNotification = async (title, message, recipientEmail, priority = "normal", targetUrl = null) => {
  try {
    const notification = await models.Notification.create({
      type: "system",
      title,
      message,
      recipient: recipientEmail,
      priority,
      relatedId: null,
      targetUrl,
      status: "unread",
    });

    console.log(`✅ 시스템 알림 생성 완료: ${notification.id}`);
    return notification;
  } catch (error) {
    console.error("❌ 시스템 알림 생성 실패:", error);
    throw error;
  }
};

/**
 * 알림 대량 생성 (테스트용)
 * @param {string} recipientEmail - 받는 사람 이메일
 */
const createTestNotifications = async (recipientEmail) => {
  try {
    const testNotifications = [
      {
        type: "application_status_change",
        title: "비자 신청이 승인되었습니다",
        message: "축하합니다! 귀하의 비자 신청이 승인되었습니다.",
        priority: "high",
        targetUrl: "/dashboard/applications/1",
      },
      {
        type: "document_required",
        title: "추가 서류가 필요합니다",
        message: "여권 사본을 추가로 제출해주세요.",
        priority: "normal",
        targetUrl: "/dashboard/applications/2",
      },
      {
        type: "system",
        title: "시스템 점검 안내",
        message: "오늘 밤 12시부터 2시까지 시스템 점검이 있습니다.",
        priority: "normal",
        targetUrl: "/notices",
      },
    ];

    const notifications = await Promise.all(
      testNotifications.map(notif =>
        models.Notification.create({
          ...notif,
          recipient: recipientEmail,
          relatedId: Math.floor(Math.random() * 100).toString(),
          status: "unread",
        })
      )
    );

    console.log(`✅ 테스트 알림 ${notifications.length}개 생성 완료`);
    return notifications;
  } catch (error) {
    console.error("❌ 테스트 알림 생성 실패:", error);
    throw error;
  }
};

module.exports = {
  createApplicationStatusNotification,
  createNewApplicationNotification,
  createDocumentRequestNotification,
  createAdditionalServiceNotification,
  createSystemNotification,
  createTestNotifications,
};
