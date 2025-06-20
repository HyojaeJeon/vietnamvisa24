const models = require("../models");

async function createTestNotifications() {
  try {
    console.log("🔔 Creating test notifications...");

    const testNotifications = [
      {
        type: "application_status_change",
        title: "비자 신청 상태 변경",
        message: "귀하의 비자 신청이 승인되었습니다.",
        recipient: "1", // 테스트 사용자 ID
        priority: "high",
        relatedId: "123",
        targetUrl: "/dashboard/applications/123",
        status: "unread",
      },
      {
        type: "document_required",
        title: "추가 서류 필요",
        message: "여권 사본을 업로드해주세요.",
        recipient: "1",
        priority: "normal",
        relatedId: "124",
        targetUrl: "/dashboard/documents",
        status: "unread",
      },
      {
        type: "system",
        title: "시스템 공지",
        message: "시스템 점검이 예정되어 있습니다.",
        recipient: "1",
        priority: "normal",
        targetUrl: "/notices",
        status: "unread",
      },
    ];

    for (const notificationData of testNotifications) {
      const notification = await models.Notification.create(notificationData);
      console.log(
        `✅ Created notification: ${notification.id} - ${notification.title}`,
      );
    }

    console.log("🎉 All test notifications created successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating test notifications:", error);
    process.exit(1);
  }
}

createTestNotifications();
