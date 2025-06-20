const models = require("../models");

async function testNotificationQueries() {
  try {
    console.log("🧪 Testing notification queries...\n");

    // 1. 사용자 ID 1의 모든 알림 조회
    console.log("1️⃣ Testing getNotificationsByUser for userId: 1");
    const userNotifications = await models.Notification.findAll({
      where: { recipient: "1" },
      order: [["createdAt", "DESC"]],
    });
    console.log(`Found ${userNotifications.length} notifications for user 1`);
    userNotifications.forEach((n, idx) => {
      console.log(
        `  ${idx + 1}. ID: ${n.id}, Status: ${n.status}, Title: ${n.title}`,
      );
    });

    // 2. 읽지 않은 알림 개수 조회
    console.log("\n2️⃣ Testing unread notifications count");
    const unreadCount = await models.Notification.count({
      where: {
        recipient: "1",
        status: "unread",
      },
    });
    console.log(`Unread notifications count: ${unreadCount}`);

    // 3. 페이지네이션 테스트 (첫 3개)
    console.log("\n3️⃣ Testing pagination (first 3 notifications)");
    const paginatedNotifications = await models.Notification.findAll({
      where: { recipient: "1" },
      order: [["createdAt", "DESC"]],
      limit: 3,
      offset: 0,
    });
    console.log(
      `Paginated result: ${paginatedNotifications.length} notifications`,
    );
    paginatedNotifications.forEach((n, idx) => {
      console.log(
        `  ${idx + 1}. ID: ${n.id}, Title: ${n.title}, Created: ${n.createdAt}`,
      );
    });

    // 4. 하나의 알림을 읽음으로 표시 테스트
    if (userNotifications.length > 0) {
      const firstNotification = userNotifications[0];
      console.log(
        `\n4️⃣ Testing mark notification ${firstNotification.id} as read`,
      );
      await firstNotification.update({
        status: "read",
        updatedAt: new Date(),
      });
      console.log(`✅ Notification ${firstNotification.id} marked as read`);

      // 읽지 않은 개수 다시 확인
      const newUnreadCount = await models.Notification.count({
        where: {
          recipient: "1",
          status: "unread",
        },
      });
      console.log(`New unread count: ${newUnreadCount}`);
    }

    console.log("\n🎉 All notification query tests completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error testing notification queries:", error);
    process.exit(1);
  }
}

testNotificationQueries();
