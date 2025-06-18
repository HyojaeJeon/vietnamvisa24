const { Sequelize } = require("sequelize");
const models = require("./models");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = async () => {
  try {
    console.log("DB_USER:", process.env.DB_USER);
    console.log("DB_PASSWORD:", process.env.DB_PASSWORD);

    // 데이터베이스 연결 테스트
    await models.sequelize.authenticate();

    // 환경에 따른 데이터베이스 타입 표시
    const dbDialect = models.sequelize.getDialect();
    const dbName =
      models.sequelize.config.database || models.sequelize.config.storage;
    console.log(
      `✅ Connected to ${dbDialect.toUpperCase()} database: ${dbName}`,
    );

    // 환경에 따른 동기화 옵션 설정
    const isReplit =
      process.cwd().includes("/home/runner") || process.env.REPLIT;
    const isSQLite = dbDialect === "sqlite";

    let syncOptions;
    if (isReplit && isSQLite) {
      // Replit SQLite 환경: 깨끗하게 시작
      syncOptions = { force: true };
      console.log("🔄 SQLite in Replit: Using force sync (recreating tables)");
    } else if (isSQLite) {
      // 로컬 SQLite 환경: 기존 데이터 보존
      syncOptions = { force: false };
      console.log("🔄 SQLite locally: Using safe sync (preserving data)");
    } else {
      // MySQL 환경: 더 안전한 동기화 (alter 대신 safe sync)
      syncOptions = { force: false };
      console.log("🔄 MySQL: Using safe sync (preserving existing structure)");
    }

    // 데이터베이스 동기화 (테이블 생성/업데이트)
    await models.sequelize.sync(syncOptions);
    console.log("✅ Database tables synchronized successfully");

    // 테이블 생성이 완료될 때까지 잠시 대기
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // 기본 관리자 계정 생성
    await createDefaultAdmin();

    return models.sequelize;
  } catch (error) {
    console.error("❌ Database Connection Error:", error);

    // MySQL 연결 실패 시 도움말 표시
    if (
      error.name === "SequelizeConnectionError" &&
      error.parent?.code === "ER_BAD_DB_ERROR"
    ) {
      console.log("");
      console.log("🔧 Database not found. Please create the database first:");
      console.log("   npm run mysql:create");
      console.log("   or manually run: scripts/create-mysql-db.sql");
    } else if (error.name === "SequelizeConnectionRefusedError") {
      console.log("");
      console.log("🔧 Cannot connect to MySQL. Please check:");
      console.log("   1. MySQL service is running");
      console.log("   2. Connection credentials in .env file");
      console.log("   3. Database exists (run: npm run mysql:create)");
    }
    throw error;
  }
};

const createDefaultAdmin = async () => {
  try {
    // Check if User model exists and is ready
    if (!models.User) {
      console.error("❌ User model not found");
      return;
    }

    const existingAdmin = await models.User.findOne({
      where: { email: "admin@vietnamvisa.com" },
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("admin123!", 10);
      await models.User.create({
        email: "admin@vietnamvisa.com",
        password: hashedPassword,
        name: "Super Admin",
        role: "SUPER_ADMIN",
      });
      console.log(
        "✅ Default admin created - Email: admin@vietnamvisa.com, Password: admin123!",
      );
    } else {
      console.log("✅ Default admin already exists");
    }
  } catch (error) {
    console.error("❌ Error creating default admin:", error.message);
    // Don't throw the error to prevent server startup failure
  }
};

const getDB = () => {
  return models;
};

module.exports = {
  connectDB,
  getDB,
  models,
};
