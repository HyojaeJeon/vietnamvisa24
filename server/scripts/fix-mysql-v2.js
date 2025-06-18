const mysql = require("mysql2/promise");
require("dotenv").config();

async function fixMySQLIssues() {
  console.log("🔧 MySQL 문제 해결 시작...");

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "127.0.0.1",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || "vietnamvisa24_db",
    port: process.env.DB_PORT || 3306,
  });

  try {
    // 1. 먼저 SQL_MODE를 유연하게 설정 (NO_AUTO_CREATE_USER 제거)
    console.log("🔧 SQL_MODE 설정 중...");
    await connection.execute(`
      SET SESSION sql_mode = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION'
    `);
    console.log("✅ SQL_MODE 설정 완료");

    // 2. documents 테이블에서 NULL 값이나 문제가 있는 데이터 확인
    console.log("📊 documents 테이블 데이터 확인 중...");

    // 먼저 전체 레코드 수 확인
    const [totalCount] = await connection.execute(
      "SELECT COUNT(*) as total FROM documents",
    );
    console.log(`전체 documents 레코드 수: ${totalCount[0].total}`);

    // NULL 값들 확인
    const [nullCheck] = await connection.execute(`
      SELECT
        COUNT(*) as total,
        SUM(CASE WHEN createdAt IS NULL THEN 1 ELSE 0 END) as null_created,
        SUM(CASE WHEN updatedAt IS NULL THEN 1 ELSE 0 END) as null_updated,
        SUM(CASE WHEN uploadedAt IS NULL THEN 1 ELSE 0 END) as null_uploaded
      FROM documents
    `);

    console.log("NULL 값 현황:", nullCheck[0]);

    // 3. 문제가 있는 레코드들을 직접 수정
    if (nullCheck[0].null_created > 0) {
      console.log("🔧 NULL createdAt 값들을 현재 시간으로 설정 중...");
      await connection.execute(`
        UPDATE documents
        SET createdAt = NOW()
        WHERE createdAt IS NULL
      `);
      console.log("✅ createdAt NULL 값 수정 완료");
    }

    if (nullCheck[0].null_updated > 0) {
      console.log("🔧 NULL updatedAt 값들을 현재 시간으로 설정 중...");
      await connection.execute(`
        UPDATE documents
        SET updatedAt = NOW()
        WHERE updatedAt IS NULL
      `);
      console.log("✅ updatedAt NULL 값 수정 완료");
    }

    if (nullCheck[0].null_uploaded > 0) {
      console.log("🔧 NULL uploadedAt 값들을 현재 시간으로 설정 중...");
      await connection.execute(`
        UPDATE documents
        SET uploadedAt = NOW()
        WHERE uploadedAt IS NULL
      `);
      console.log("✅ uploadedAt NULL 값 수정 완료");
    }

    // 4. 다른 테이블들도 확인
    const tables = ["users", "visa_applications"];

    for (const table of tables) {
      try {
        console.log(`📊 ${table} 테이블 확인 중...`);

        const [tableNullCheck] = await connection.execute(`
          SELECT
            COUNT(*) as total,
            SUM(CASE WHEN createdAt IS NULL THEN 1 ELSE 0 END) as null_created,
            SUM(CASE WHEN updatedAt IS NULL THEN 1 ELSE 0 END) as null_updated
          FROM ${table}
        `);

        console.log(`${table} NULL 값 현황:`, tableNullCheck[0]);

        if (tableNullCheck[0].null_created > 0) {
          await connection.execute(`
            UPDATE ${table}
            SET createdAt = NOW()
            WHERE createdAt IS NULL
          `);
          console.log(`✅ ${table} createdAt NULL 값 수정 완료`);
        }

        if (tableNullCheck[0].null_updated > 0) {
          await connection.execute(`
            UPDATE ${table}
            SET updatedAt = NOW()
            WHERE updatedAt IS NULL
          `);
          console.log(`✅ ${table} updatedAt NULL 값 수정 완료`);
        }
      } catch (error) {
        console.log(`⚠️ ${table} 테이블 처리 중 오류: ${error.message}`);
      }
    }

    console.log("🎉 MySQL 문제 해결이 완료되었습니다!");
  } catch (error) {
    console.error("❌ MySQL 문제 해결 중 오류 발생:", error);
  } finally {
    await connection.end();
  }
}

if (require.main === module) {
  fixMySQLIssues();
}

module.exports = fixMySQLIssues;
