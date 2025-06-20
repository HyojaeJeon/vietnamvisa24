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
      // Replit SQLite 환경: 안전한 동기화로 변경
      syncOptions = { alter: true };
      console.log("🔄 SQLite in Replit: Using alter sync (preserving data)");
    } else if (isSQLite) {
      // 로컬 SQLite 환경: 기존 데이터 보존
      syncOptions = { alter: true };
      console.log("🔄 SQLite locally: Using alter sync (preserving data)");
    } else {
      // MySQL 환경: 더 안전한 동기화 (alter 대신 safe sync)
      syncOptions = { force: false };
      console.log("🔄 MySQL: Using safe sync (preserving existing structure)");
    }

    // SQLite 최적화 설정
    if (dbDialect === "sqlite") {
      console.log("🔧 Applying SQLite optimizations...");
      await models.sequelize.query("PRAGMA foreign_keys = ON;");
      await models.sequelize.query("PRAGMA journal_mode = WAL;");
      await models.sequelize.query("PRAGMA synchronous = NORMAL;");
      await models.sequelize.query("PRAGMA cache_size = 1000;");
      await models.sequelize.query("PRAGMA temp_store = memory;");
      console.log("✅ SQLite PRAGMA settings applied");
    } // 데이터베이스 동기화 (테이블 생성/업데이트)
    try {
      console.log("🔄 Starting database synchronization...");
      console.log("🔧 Using sync options:", syncOptions);

      // 기존에 설정된 안전한 syncOptions 사용 (force: true 제거)
      await models.sequelize.sync(syncOptions);
      console.log("✅ Database synchronized successfully");
    } catch (syncError) {
      console.error("❌ Database sync error:", syncError);
      console.log("⚠️ Attempting to continue without sync...");

      // Try basic connection test
      try {
        await models.sequelize.authenticate();
        console.log("✅ Database connection is working");
      } catch (authError) {
        console.error("❌ Database authentication failed:", authError);
        throw authError;
      }
    }

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
