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
    ); // 데이터베이스 동기화 (테이블 생성/업데이트)
    await models.sequelize.sync({ force: false, alter: true });
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
