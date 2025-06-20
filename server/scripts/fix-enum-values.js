const models = require("../models");

async function fixEnumValues() {
  try {
    console.log("🔄 Converting notification enum values to uppercase...");

    // Status 값 변환
    await models.sequelize.query(`
      UPDATE notifications
      SET status = CASE
        WHEN status = 'unread' THEN 'UNREAD'
        WHEN status = 'read' THEN 'READ'
        ELSE status
      END
    `);

    // Priority 값 변환
    await models.sequelize.query(`
      UPDATE notifications
      SET priority = CASE
        WHEN priority = 'normal' THEN 'NORMAL'
        WHEN priority = 'high' THEN 'HIGH'
        WHEN priority = 'urgent' THEN 'URGENT'
        ELSE priority
      END
    `);

    console.log("✅ Successfully converted enum values to uppercase");

    // 변환 결과 확인
    const [statusResults] = await models.sequelize.query(
      "SELECT DISTINCT status FROM notifications ORDER BY status",
    );
    const [priorityResults] = await models.sequelize.query(
      "SELECT DISTINCT priority FROM notifications ORDER BY priority",
    );

    console.log("\n📋 변환 후 고유값:");
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

fixEnumValues();
