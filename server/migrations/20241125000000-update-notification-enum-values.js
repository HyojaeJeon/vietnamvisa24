"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // type 컬럼 값들을 대문자로 변경
    const typeMapping = {
      application_update: "APPLICATION_UPDATE",
      status_change: "STATUS_CHANGE",
      consultation: "CONSULTATION",
      system: "SYSTEM",
      document_required: "DOCUMENT_REQUIRED",
      dashboard_new_application: "DASHBOARD_NEW_APPLICATION",
      new_application: "NEW_APPLICATION",
      application_status_change: "APPLICATION_STATUS_CHANGE",
      notification: "NOTIFICATION",
      workflow_progress: "WORKFLOW_PROGRESS",
      document_reviewed: "DOCUMENT_REVIEWED",
      payment_status_change: "PAYMENT_STATUS_CHANGE",
      consultation_reply: "CONSULTATION_REPLY",
      admin_notification: "ADMIN_NOTIFICATION",
      email_sent: "EMAIL_SENT",
      payment_request: "PAYMENT_REQUEST",
      document_review: "DOCUMENT_REVIEW",
      government_submission: "GOVERNMENT_SUBMISSION",
      visa_generated: "VISA_GENERATED",
      visa_email_sent: "VISA_EMAIL_SENT",
      application_completed: "APPLICATION_COMPLETED",
    };

    // type 값들 업데이트
    for (const [oldValue, newValue] of Object.entries(typeMapping)) {
      await queryInterface.sequelize.query(
        `UPDATE notifications SET type = '${newValue}' WHERE type = '${oldValue}'`,
      );
    }

    // status 컬럼 값들을 대문자로 변경
    await queryInterface.sequelize.query(
      `UPDATE notifications SET status = 'UNREAD' WHERE status = 'unread'`,
    );
    await queryInterface.sequelize.query(
      `UPDATE notifications SET status = 'READ' WHERE status = 'read'`,
    );

    // priority 컬럼 값들을 대문자로 변경
    await queryInterface.sequelize.query(
      `UPDATE notifications SET priority = 'NORMAL' WHERE priority = 'normal'`,
    );
    await queryInterface.sequelize.query(
      `UPDATE notifications SET priority = 'HIGH' WHERE priority = 'high'`,
    );
    await queryInterface.sequelize.query(
      `UPDATE notifications SET priority = 'URGENT' WHERE priority = 'urgent'`,
    );

    console.log("✅ 알림 enum 값들이 대문자로 변경되었습니다.");
  },

  async down(queryInterface, Sequelize) {
    // 롤백: 대문자를 소문자로 변경
    const typeMapping = {
      APPLICATION_UPDATE: "application_update",
      STATUS_CHANGE: "status_change",
      CONSULTATION: "consultation",
      SYSTEM: "system",
      DOCUMENT_REQUIRED: "document_required",
      DASHBOARD_NEW_APPLICATION: "dashboard_new_application",
      NEW_APPLICATION: "new_application",
      APPLICATION_STATUS_CHANGE: "application_status_change",
      NOTIFICATION: "notification",
      WORKFLOW_PROGRESS: "workflow_progress",
      DOCUMENT_REVIEWED: "document_reviewed",
      PAYMENT_STATUS_CHANGE: "payment_status_change",
      CONSULTATION_REPLY: "consultation_reply",
      ADMIN_NOTIFICATION: "admin_notification",
      EMAIL_SENT: "email_sent",
      PAYMENT_REQUEST: "payment_request",
      DOCUMENT_REVIEW: "document_review",
      GOVERNMENT_SUBMISSION: "government_submission",
      VISA_GENERATED: "visa_generated",
      VISA_EMAIL_SENT: "visa_email_sent",
      APPLICATION_COMPLETED: "application_completed",
    };

    // type 값들 롤백
    for (const [oldValue, newValue] of Object.entries(typeMapping)) {
      await queryInterface.sequelize.query(
        `UPDATE notifications SET type = '${newValue}' WHERE type = '${oldValue}'`,
      );
    }

    // status 롤백
    await queryInterface.sequelize.query(
      `UPDATE notifications SET status = 'unread' WHERE status = 'UNREAD'`,
    );
    await queryInterface.sequelize.query(
      `UPDATE notifications SET status = 'read' WHERE status = 'READ'`,
    );

    // priority 롤백
    await queryInterface.sequelize.query(
      `UPDATE notifications SET priority = 'normal' WHERE priority = 'NORMAL'`,
    );
    await queryInterface.sequelize.query(
      `UPDATE notifications SET priority = 'high' WHERE priority = 'HIGH'`,
    );
    await queryInterface.sequelize.query(
      `UPDATE notifications SET priority = 'urgent' WHERE priority = 'URGENT'`,
    );
  },
};
