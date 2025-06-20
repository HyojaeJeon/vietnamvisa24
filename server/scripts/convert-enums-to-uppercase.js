const models = require("../models");

async function convertEnumValuesToUppercase() {
  try {
    console.log("🔄 Converting notification enum values to uppercase...");

    // Status 값 변환: unread -> UNREAD, read -> READ
    const [statusUpdated] = await models.sequelize.query(`
      UPDATE notifications
      SET status = CASE
        WHEN status = 'unread' THEN 'UNREAD'
        WHEN status = 'read' THEN 'READ'
        ELSE status
      END
    `);
    console.log(
      `✅ Status values updated: ${statusUpdated.affectedRows || "unknown"} rows`,
    );

    // Priority 값 변환: normal -> NORMAL, high -> HIGH, urgent -> URGENT
    const [priorityUpdated] = await models.sequelize.query(`
      UPDATE notifications
      SET priority = CASE
        WHEN priority = 'normal' THEN 'NORMAL'
        WHEN priority = 'high' THEN 'HIGH'
        WHEN priority = 'urgent' THEN 'URGENT'
        ELSE priority
      END
    `);
    console.log(
      `✅ Priority values updated: ${priorityUpdated.affectedRows || "unknown"} rows`,
    );

    // Type 값 변환 (소문자를 대문자로)
    const [typeUpdated] = await models.sequelize.query(`
      UPDATE notifications
      SET type = UPPER(type)
    `);
    console.log(
      `✅ Type values updated: ${typeUpdated.affectedRows || "unknown"} rows`,
    );

    console.log("✅ Successfully converted all enum values to uppercase");

    // 변환 결과 확인
    const [statusResults] = await models.sequelize.query(
      "SELECT DISTINCT status FROM notifications ORDER BY status",
    );
    const [priorityResults] = await models.sequelize.query(
      "SELECT DISTINCT priority FROM notifications ORDER BY priority",
    );
    const [typeResults] = await models.sequelize.query(
      "SELECT DISTINCT type FROM notifications ORDER BY type",
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
    console.log(
      "Types:",
      typeResults.map((r) => r.type),
    );

    process.exit(0);
  } catch (error) {
    console.error("❌ 오류:", error);
    process.exit(1);
  }
}

convertEnumValuesToUppercase();
