"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Add targetUrl column to notifications table
      await queryInterface.addColumn("notifications", "targetUrl", {
        type: Sequelize.STRING(500),
        allowNull: true,
        comment: "URL to navigate to when notification is clicked",
      });

      console.log("Successfully added targetUrl column to notifications table");
    } catch (error) {
      console.error("Migration error:", error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      // Remove targetUrl column from notifications table
      await queryInterface.removeColumn("notifications", "targetUrl");

      console.log(
        "Successfully removed targetUrl column from notifications table",
      );
    } catch (error) {
      console.error("Rollback error:", error);
      throw error;
    }
  },
};
