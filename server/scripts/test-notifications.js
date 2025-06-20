/**
 * 알림 시스템 테스트 스크립트
 * 다양한 종류의 알림을 생성하여 시스템을 테스트합니다.
 */

const models = require("../models");
const {
  createApplicationStatusNotification,
  createNewApplicationNotification,
  createDocumentRequestNotification,
  createSystemNotification,
  createTestNotifications,
} = require("../utils/notificationHelpers");

async function testNotificationSystem() {
  try {
    console.log("🧪 알림 시스템 테스트 시작...");

    const testEmail = "admin@example.com";
    
    // 1. 상태 변경 알림 테스트
    console.log("\n1️⃣ 상태 변경 알림 테스트");
    const statusNotification = await createApplicationStatusNotification(
      "TEST_APP_001", 
      testEmail, 
      "PENDING", 
      "PROCESSING"
    );
    console.log("✅ 상태 변경 알림 생성됨:", statusNotification.id);

    // 2. 새 신청서 알림 테스트
    console.log("\n2️⃣ 새 신청서 알림 테스트");
    const newAppNotifications = await createNewApplicationNotification(
      "TEST_APP_002",
      "김테스트",
      "관광 비자"
    );
    console.log("✅ 새 신청서 알림 생성됨:", newAppNotifications.length, "개");

    // 3. 서류 요청 알림 테스트
    console.log("\n3️⃣ 서류 요청 알림 테스트");
    const documentNotification = await createDocumentRequestNotification(
      "TEST_APP_003",
      testEmail,
      "passport"
    );
    console.log("✅ 서류 요청 알림 생성됨:", documentNotification.id);

    // 4. 시스템 알림 테스트
    console.log("\n4️⃣ 시스템 알림 테스트");
    const systemNotification = await createSystemNotification(
      "시스템 점검 안내",
      "내일 오전 2시부터 4시까지 시스템 점검을 진행합니다.",
      testEmail,
      "normal",
      "/notices"
    );
    console.log("✅ 시스템 알림 생성됨:", systemNotification.id);

    // 5. 다양한 테스트 알림 생성
    console.log("\n5️⃣ 다양한 테스트 알림 생성");
    const testNotifications = await createTestNotifications(testEmail);
    console.log("✅ 테스트 알림", testNotifications.length, "개 생성됨");

    // 6. 생성된 모든 알림 조회
    console.log("\n6️⃣ 생성된 알림 조회");
    const allNotifications = await models.Notification.findAll({
      where: { recipient: testEmail },
      order: [["createdAt", "DESC"]],
      limit: 10
    });

    console.log("📋 최근 생성된 알림 목록:");
    allNotifications.forEach((notification, index) => {
      console.log(`  ${index + 1}. [${notification.type}] ${notification.title}`);
      console.log(`     → ${notification.message}`);
      console.log(`     → 상태: ${notification.status}, 우선순위: ${notification.priority}`);
      console.log(`     → 생성일: ${notification.createdAt}`);
      if (notification.targetUrl) {
        console.log(`     → 링크: ${notification.targetUrl}`);
      }
      console.log("");
    });

    console.log("🎉 알림 시스템 테스트 완료!");
    console.log(`총 ${allNotifications.length}개의 알림이 생성되었습니다.`);

  } catch (error) {
    console.error("❌ 알림 시스템 테스트 실패:", error);
  }
}

// 스크립트 직접 실행 시 테스트 실행
if (require.main === module) {
  testNotificationSystem()
    .then(() => {
      console.log("테스트 완료");
      process.exit(0);
    })
    .catch((error) => {
      console.error("테스트 실패:", error);
      process.exit(1);
    });
}

module.exports = { testNotificationSystem };
