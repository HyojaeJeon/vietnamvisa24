const { Sequelize } = require("sequelize");
const config = require("../config/database");

// Sequelize 인스턴스 생성
const sequelize = new Sequelize(config.development);

// 모델들 import
const models = require("../models");

async function syncDatabase() {
  try {
    console.log("🔄 데이터베이스 동기화 시작...");

    // 연결 테스트
    await sequelize.authenticate();
    console.log("✅ 데이터베이스 연결 성공");

    // 모델 동기화 (기존 테이블은 유지하면서 새 컬럼/테이블만 추가)
    await sequelize.sync({ alter: true });
    console.log("✅ 데이터베이스 동기화 완료");

    // 각 모델별 테이블 확인
    const tableNames = [
      "documents",
      "additional_services",
      "application_additional_services",
    ];

    for (const tableName of tableNames) {
      try {
        const [results] = await sequelize.query(`DESCRIBE ${tableName}`);
        console.log(`📋 ${tableName} 테이블 구조:`, results.length, "개 컬럼");
      } catch (error) {
        console.log(
          `⚠️ ${tableName} 테이블이 아직 생성되지 않았습니다:`,
          error.message,
        );
      }
    }

    console.log("🎉 데이터베이스 동기화 완료!");
  } catch (error) {
    console.error("❌ 데이터베이스 동기화 실패:", error);
  } finally {
    await sequelize.close();
  }
}

syncDatabase();
