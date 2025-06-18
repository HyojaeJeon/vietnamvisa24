const mysql = requ    // documents 테이블의 잘못된 날짜 값들을 확인
    const [documentsCheck] = await connection.execute(`
      SELECT COUNT(*) as count
      FROM documents
      WHERE createdAt = '0000-00-00 00:00:00'
         OR updatedAt = '0000-00-00 00:00:00'
         OR uploadedAt = '0000-00-00 00:00:00'
         OR reviewedAt = '0000-00-00 00:00:00'
    `);l2/promise");
require("dotenv").config();

async function cleanupMySQLData() {
  console.log("🔧 MySQL 데이터 정리 시작...");

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "127.0.0.1",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || "vietnamvisa24_db",
    port: process.env.DB_PORT || 3306,
  });

  try {
    // 1. 잘못된 datetime 값들을 찾아서 수정
    console.log("📊 잘못된 datetime 값 확인 중...");

    // documents 테이블의 잘못된 날짜 값들을 확인
    const [documentsCheck] = await connection.execute(`
      SELECT COUNT(*) as count
      FROM documents
      WHERE created_at = '0000-00-00 00:00:00'
         OR updated_at = '0000-00-00 00:00:00'
         OR uploaded_at = '0000-00-00 00:00:00'
         OR reviewed_at = '0000-00-00 00:00:00'
    `);

    console.log(
      `🔍 documents 테이블에서 잘못된 datetime 값 발견: ${documentsCheck[0].count}개`,
    );

    if (documentsCheck[0].count > 0) {
      // 잘못된 datetime 값들을 현재 시간으로 수정
      console.log("🔧 잘못된 datetime 값들을 수정 중...");

      await connection.execute(`
        UPDATE documents
        SET created_at = NOW()
        WHERE created_at = '0000-00-00 00:00:00'
      `);

      await connection.execute(`
        UPDATE documents
        SET updated_at = NOW()
        WHERE updated_at = '0000-00-00 00:00:00'
      `);

      await connection.execute(`
        UPDATE documents
        SET uploaded_at = NOW()
        WHERE uploaded_at = '0000-00-00 00:00:00'
      `);

      await connection.execute(`
        UPDATE documents
        SET reviewed_at = NULL
        WHERE reviewed_at = '0000-00-00 00:00:00'
      `);

      console.log(
        "✅ documents 테이블의 잘못된 datetime 값들이 수정되었습니다.",
      );
    }

    // 다른 테이블들도 확인
    const tables = ["users", "visa_applications", "notifications", "payments"];

    for (const table of tables) {
      try {
        const [tableCheck] = await connection.execute(`
          SELECT COUNT(*) as count
          FROM ${table}
          WHERE created_at = '0000-00-00 00:00:00'
             OR updated_at = '0000-00-00 00:00:00'
        `);

        if (tableCheck[0].count > 0) {
          console.log(`🔧 ${table} 테이블의 잘못된 datetime 값 수정 중...`);

          await connection.execute(`
            UPDATE ${table}
            SET created_at = NOW()
            WHERE created_at = '0000-00-00 00:00:00'
          `);

          await connection.execute(`
            UPDATE ${table}
            SET updated_at = NOW()
            WHERE updated_at = '0000-00-00 00:00:00'
          `);

          console.log(`✅ ${table} 테이블 수정 완료`);
        }
      } catch (error) {
        console.log(
          `⚠️ ${table} 테이블 확인 중 오류 (테이블이 존재하지 않을 수 있음): ${error.message}`,
        );
      }
    }

    // 2. SQL_MODE 설정 확인 및 조정
    console.log("🔧 MySQL SQL_MODE 확인 중...");
    const [sqlModeResult] = await connection.execute("SELECT @@sql_mode");
    console.log(`현재 SQL_MODE: ${sqlModeResult[0]["@@sql_mode"]}`);

    // 더 유연한 SQL_MODE 설정 (NO_ZERO_DATE 제거)
    await connection.execute(`
      SET SESSION sql_mode = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION'
    `);

    console.log("✅ SQL_MODE가 더 유연하게 설정되었습니다.");

    console.log("🎉 MySQL 데이터 정리가 완료되었습니다!");
  } catch (error) {
    console.error("❌ MySQL 정리 중 오류 발생:", error);
  } finally {
    await connection.end();
  }
}

if (require.main === module) {
  cleanupMySQLData();
}

module.exports = cleanupMySQLData;
