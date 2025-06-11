const dotenv = require("dotenv");
dotenv.config();

// Replit 환경 감지 - 더 확실한 감지
const isReplit = !!(
  process.env.REPLIT ||
  process.env.REPLIT_DB_URL ||
  process.env.REPL_ID ||
  process.env.REPL_SLUG ||
  process.cwd().includes("/home/runner") ||
  process.env.DB_DIALECT === "mysql" ||
  "sqlite"
);

console.log("🔧 Config - Environment:", isReplit ? "Replit" : "Local");
console.log("🔧 Config - Database:", isReplit ? "SQLite" : "MySQL");

const commonConfig = {
  logging: process.env.NODE_ENV === "development" ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 60000,
    idle: 30000,
    evict: 60000,
    handleDisconnects: true,
  },
  retry: {
    match: [
      /ECONNRESET/,
      /ENOTFOUND/,
      /ECONNREFUSED/,
      /ETIMEDOUT/,
      /ECONNABORTED/,
    ],
    max: 3,
  },
};

// SQLite 설정 (Replit 환경)
const sqliteConfig = {
  dialect: "sqlite",
  storage: process.env.DB_STORAGE || "./vietnam_visa.db",
  define: {
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  },
  ...commonConfig,
};

// MySQL 설정 (로컬 환경)
const mysqlConfig = {
  dialect: "mysql",
  dialectModule: require("mysql2"),
  define: {
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  },
  ...commonConfig,
};

// 개발 환경 설정
const developmentConfig = isReplit
  ? {
      ...sqliteConfig,
    }
  : {
      username: process.env.DB_USER || "appuser",
      password: process.env.DB_PASSWORD || "gywo9988!@",
      database: process.env.DB_NAME || "lngw2025_db",
      host: process.env.DB_HOST || "127.0.0.1",
      port: process.env.DB_PORT || 3306,
      ...mysqlConfig,
    };

// 프로덕션 환경 설정
const productionConfig = isReplit
  ? {
      ...sqliteConfig,
    }
  : {
      username: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "lngw2025_db",
      host: process.env.DB_HOST || "127.0.0.1",
      port: process.env.DB_PORT || 3306,
      ...mysqlConfig,
    };

console.log("🔧 Config - Selected config:", isReplit ? "SQLite" : "MySQL");

module.exports = {
  development: developmentConfig,
  production: productionConfig,
};
