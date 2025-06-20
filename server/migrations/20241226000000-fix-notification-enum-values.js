"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    console.log("🔄 Converting notification enum values to uppercase...");

    try {
      // Status 값 변환
      await queryInterface.sequelize.query(`
        UPDATE notifications
        SET status = CASE
          WHEN status = 'unread' THEN 'UNREAD'
          WHEN status = 'read' THEN 'READ'
          ELSE status
        END
      `);

      // Priority 값 변환
      await queryInterface.sequelize.query(`
        UPDATE notifications
        SET priority = CASE
          WHEN priority = 'normal' THEN 'NORMAL'
          WHEN priority = 'high' THEN 'HIGH'
          WHEN priority = 'urgent' THEN 'URGENT'
          ELSE priority
        END
      `);

      console.log("✅ Successfully converted enum values to uppercase");
    } catch (error) {
      console.error("❌ Error converting enum values:", error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    console.log("🔄 Converting notification enum values back to lowercase...");

    try {
      // Status 값 원복
      await queryInterface.sequelize.query(`
        UPDATE notifications
        SET status = CASE
          WHEN status = 'UNREAD' THEN 'unread'
          WHEN status = 'READ' THEN 'read'
          ELSE status
        END
      `);

      // Priority 값 원복
      await queryInterface.sequelize.query(`
        UPDATE notifications
        SET priority = CASE
          WHEN priority = 'NORMAL' THEN 'normal'
          WHEN priority = 'HIGH' THEN 'high'
          WHEN priority = 'URGENT' THEN 'urgent'
          ELSE priority
        END
      `);

      console.log("✅ Successfully converted enum values back to lowercase");
    } catch (error) {
      console.error("❌ Error converting enum values:", error);
      throw error;
    }
  },
};
