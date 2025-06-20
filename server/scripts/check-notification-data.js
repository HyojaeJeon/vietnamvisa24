const models = require("../models");

async function checkNotificationData() {
  try {
    console.log("📊 현재 notifications 테이블 데이터 확인...\n");

    // 모든 알림 조회
    const notifications = await models.Notification.findAll({
      attributes: ["id", "type", "status", "priority"],
      order: [["id", "DESC"]],
      limit: 15,
    });

    console.log("🔍 최근 15개 알림:");
    notifications.forEach((n) => {
      console.log(
        `ID: ${n.id}, Type: ${n.type}, Status: ${n.status}, Priority: ${n.priority}`,
      );
    });

    // 각 컬럼별 고유값 확인
    const [typeResults] = await models.sequelize.query(
      "SELECT DISTINCT type FROM notifications ORDER BY type",
    );
    const [statusResults] = await models.sequelize.query(
      "SELECT DISTINCT status FROM notifications ORDER BY status",
    );
    const [priorityResults] = await models.sequelize.query(
      "SELECT DISTINCT priority FROM notifications ORDER BY priority",
    );

    console.log("\n📋 고유값 분석:");
    console.log(
      "Types:",
      typeResults.map((r) => r.type),
    );
    console.log(
      "Statuses:",
      statusResults.map((r) => r.status),
    );
    console.log(
      "Priorities:",
      priorityResults.map((r) => r.priority),
    );

    process.exit(0);
  } catch (error) {
    console.error("❌ 오류:", error);
    process.exit(1);
  }
}

checkNotificationData();
