"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // type 컬럼의 길이를 늘려서 긴 알림 타입을 지원
    await queryInterface.changeColumn("notifications", "type", {
      type: Sequelize.STRING(100),
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    // 원래 길이로 되돌림
    await queryInterface.changeColumn("notifications", "type", {
      type: Sequelize.STRING(50),
      allowNull: false,
    });
  },
};
