const models = require("../models");

async function fixEnumValues() {
  try {
    console.log("🔄 Converting notification enum values to uppercase...");

    // Status 값 개별 변환
    console.log("Converting 'unread' to 'UNREAD'...");
    const [statusResult1] = await models.sequelize.query(
      "UPDATE notifications SET status = 'UNREAD' WHERE status = 'unread'",
    );
    console.log(
      `Updated ${statusResult1.affectedRows || 0} rows for status 'unread'`,
    );

    console.log("Converting 'read' to 'READ'...");
    const [statusResult2] = await models.sequelize.query(
      "UPDATE notifications SET status = 'READ' WHERE status = 'read'",
    );
    console.log(
      `Updated ${statusResult2.affectedRows || 0} rows for status 'read'`,
    );

    // Priority 값 개별 변환
    console.log("Converting 'normal' to 'NORMAL'...");
    const [priorityResult1] = await models.sequelize.query(
      "UPDATE notifications SET priority = 'NORMAL' WHERE priority = 'normal'",
    );
    console.log(
      `Updated ${priorityResult1.affectedRows || 0} rows for priority 'normal'`,
    );

    console.log("Converting 'high' to 'HIGH'...");
    const [priorityResult2] = await models.sequelize.query(
      "UPDATE notifications SET priority = 'HIGH' WHERE priority = 'high'",
    );
    console.log(
      `Updated ${priorityResult2.affectedRows || 0} rows for priority 'high'`,
    );

    console.log("Converting 'urgent' to 'URGENT'...");
    const [priorityResult3] = await models.sequelize.query(
      "UPDATE notifications SET priority = 'URGENT' WHERE priority = 'urgent'",
    );
    console.log(
      `Updated ${priorityResult3.affectedRows || 0} rows for priority 'urgent'`,
    );

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
