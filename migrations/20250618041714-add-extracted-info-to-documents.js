"use strict";

/** @type  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('documents', 'extracted_info');
    await queryInterface.removeColumn('documents', 'file_type');
    await queryInterface.removeColumn('documents', 'uploaded_at');
  }('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("documents", "extracted_info", {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: "JSON string containing OCR extracted information",
    });

    await queryInterface.addColumn("documents", "file_type", {
      type: Sequelize.STRING(100),
      allowNull: true,
      defaultValue: "application/octet-stream",
    });

    await queryInterface.addColumn("documents", "uploaded_at", {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: Sequelize.NOW,
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
