"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // admins 테이블의 데이터를 users 테이블로 이관
    await queryInterface.sequelize.query(`
      INSERT INTO users (email, password, name, role, created_at, updated_at)
      SELECT email, password, name, role, NOW(), NOW() FROM admins
    `);
  },

  async down(queryInterface, Sequelize) {
    // 롤백 시 users에서 role이 SUPER_ADMIN/MANAGER/STAFF인 데이터만 삭제
    await queryInterface.sequelize.query(`
      DELETE FROM users WHERE role IN ('SUPER_ADMIN', 'MANAGER', 'STAFF')
    `);
  },
};
