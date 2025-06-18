const mysql = require("mysql2/promise");
require("dotenv").config();

async function checkDatabaseStructure() {
  console.log("🔧 MySQL 데이터베이스 구조 확인...");

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "127.0.0.1",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || "vietnamvisa24_db",
    port: process.env.DB_PORT || 3306,
  });

  try {
    // 모든 테이블 목록 확인
    console.log("📊 데이터베이스 테이블 목록:");
    const [tables] = await connection.execute("SHOW TABLES");
    tables.forEach((table) => {
      console.log(`  - ${Object.values(table)[0]}`);
    });

    // documents 테이블 구조 확인
    console.log("\n📋 documents 테이블 구조:");
    try {
      const [documentsDesc] = await connection.execute("DESCRIBE documents");
      documentsDesc.forEach((column) => {
        console.log(
          `  ${column.Field}: ${column.Type} ${column.Null === "NO" ? "NOT NULL" : "NULL"} ${column.Default || ""}`,
        );
      });
    } catch (error) {
      console.log("⚠️ documents 테이블이 존재하지 않음");
    }

    // visa_applications 테이블 구조 확인
    console.log("\n📋 visa_applications 테이블 구조:");
    try {
      const [visaDesc] = await connection.execute("DESCRIBE visa_applications");
      visaDesc.forEach((column) => {
        console.log(
          `  ${column.Field}: ${column.Type} ${column.Null === "NO" ? "NOT NULL" : "NULL"} ${column.Default || ""}`,
        );
      });
    } catch (error) {
      console.log("⚠️ visa_applications 테이블이 존재하지 않음");
    }

    // users 테이블 구조 확인
    console.log("\n📋 users 테이블 구조:");
    try {
      const [usersDesc] = await connection.execute("DESCRIBE users");
      usersDesc.forEach((column) => {
        console.log(
          `  ${column.Field}: ${column.Type} ${column.Null === "NO" ? "NOT NULL" : "NULL"} ${column.Default || ""}`,
        );
      });
    } catch (error) {
      console.log("⚠️ users 테이블이 존재하지 않음");
    }
  } catch (error) {
    console.error("❌ 데이터베이스 구조 확인 중 오류:", error);
  } finally {
    await connection.end();
  }
}

checkDatabaseStructure();
