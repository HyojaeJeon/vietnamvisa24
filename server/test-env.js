require('dotenv').config();

console.log('🔧 Environment Variables Test:');
console.log('  - DB_FORCE_SQLITE:', process.env.DB_FORCE_SQLITE);
console.log('  - DB_FORCE_MYSQL:', process.env.DB_FORCE_MYSQL);
console.log('  - NODE_ENV:', process.env.NODE_ENV);

// 환경 감지 로직 테스트
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

const isOnlineIDE = !!(
  process.env.CODESANDBOX_SSE ||
  process.env.GITPOD_WORKSPACE_ID ||
  process.env.CODESPACES ||
  process.cwd().includes("/sandbox")
);

const useSQLite =
  (isReplit || isOnlineIDE || process.env.DB_FORCE_SQLITE === "true") &&
  process.env.DB_FORCE_MYSQL !== "true";

console.log('🔧 Environment Detection:');
console.log('  - isReplit:', isReplit);
console.log('  - isOnlineIDE:', isOnlineIDE);
console.log('  - useSQLite:', useSQLite);
console.log('  - Current Directory:', process.cwd());
