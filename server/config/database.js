const dotenv = require("dotenv");
dotenv.config({ path: require("path").resolve(__dirname, "../../.env") });

console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD);

// 환경 감지 로직 개선 - 더 포괄적인 Replit 환경 감지
const isReplit = !!(
  process.env.REPLIT ||
  process.env.REPLIT_DB_URL ||
  process.env.REPL_ID ||
  process.env.REPL_SLUG ||
  process.env.REPL_OWNER ||
  process.env.REPLIT_DEPLOYMENT ||
  process.cwd().includes("/home/runner") ||
  process.env.DB_DIALECT === "sqlite" ||
  process.env.PLATFORM === "replit"
);

// CodeSandbox나 기타 온라인 IDE 환경 감지
const isOnlineIDE = !!(
  process.env.CODESANDBOX_SSE ||
  process.env.GITPOD_WORKSPACE_ID ||
  process.env.CODESPACES ||
  process.cwd().includes("/sandbox")
);

// SQLite 사용 조건: 온라인 환경이거나 명시적으로 SQLite 강제 설정
const useSQLite =
  (isReplit || isOnlineIDE || process.env.DB_FORCE_SQLITE === "true") &&
  process.env.DB_FORCE_MYSQL !== "true";

// MySQL 사용 조건: 로컬 환경이거나 명시적으로 MySQL 강제 설정
const useMySQL = !useSQLite;

console.log("🔧 Database Config - Environment Detection:");
console.log("  - Replit Environment:", isReplit);
console.log("  - Online IDE Environment:", isOnlineIDE);
console.log("  - Current Working Directory:", process.cwd());
console.log("  - Platform:", process.platform);
console.log("  - Is Local Environment:", !isReplit && !isOnlineIDE);
console.log("🔧 Database Config - Settings:");
console.log("  - Use SQLite:", useSQLite ? "✅ YES" : "❌ NO");
console.log("  - Use MySQL:", useMySQL ? "✅ YES" : "❌ NO");
console.log(
  "  - Force SQLite:",
  process.env.DB_FORCE_SQLITE === "true" ? "✅ YES" : "❌ NO",
);
console.log(
  "  - Force MySQL:",
  process.env.DB_FORCE_MYSQL === "true" ? "✅ YES" : "❌ NO",
);
console.log("🔧 Selected Database:", useSQLite ? "🗄️ SQLite" : "🐬 MySQL");

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

// SQLite 설정 (Replit 환경 또는 온라인 IDE)
const sqliteConfig = {
  dialect: "sqlite",
  storage: process.env.DB_STORAGE || "./vietnam_visa.db",
  define: {
    timestamps: true,
    underscored: false,
  },
  // SQLite 특화 설정
  dialectOptions: {
    // SQLite에서 foreign key 제약조건 활성화
    foreignKeys: true,
  },
  // SQLite는 pool 설정이 필요하지 않음
  pool: undefined,
  ...commonConfig,
  // SQLite에서는 retry 로직을 단순화
  retry: {
    max: 1,
  },
};

// MySQL 설정 (로컬 환경)
const mysqlConfig = {
  dialect: "mysql",
  dialectModule: require("mysql2"),
  define: {
    timestamps: true,
    underscored: false,
  },
  ...commonConfig,
};

// 개발 환경 설정
const developmentConfig = useSQLite
  ? {
      ...sqliteConfig,
    }
  : {
      username: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || "vietnamvisa24_db",
      host: process.env.DB_HOST || "127.0.0.1",
      port: parseInt(process.env.DB_PORT) || 3306,
      ...mysqlConfig,
    };

// 프로덕션 환경 설정
const productionConfig = useSQLite
  ? {
      ...sqliteConfig,
    }
  : {
      username: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || "vietnamvisa24_db",
      host: process.env.DB_HOST || "127.0.0.1",
      port: parseInt(process.env.DB_PORT) || 3306,
      ...mysqlConfig,
    };

module.exports = {
  development: developmentConfig,
  production: productionConfig,
};
