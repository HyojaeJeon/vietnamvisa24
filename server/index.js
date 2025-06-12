// index.js
const express = require("express");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const cors = require("cors");
const typeDefs = require("./graphql/schema");
const resolvers = require("./graphql/resolvers");
const { formatError } = require("./utils/errorHandler");
const { connectDB } = require("./database");

async function startServer() {
  // 1) DB 연결
  await connectDB();
  console.log("✅ Database connected successfully");

  // 2) Apollo Server 인스턴스 생성
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    formatError,
    introspection: true, // 개발용: GraphQL Playgrounds 허용
  });
  await server.start();
  console.log("✅ Apollo Server started");

  const app = express();
  // ─── CORS 옵션 정의 ───────────────────────────────────────────
  const corsOptions = {
    origin: true, // 모든 origin 허용 (개발용)
    credentials: true, // 쿠키·인증 헤더 허용
    methods: ["GET", "POST", "OPTIONS", "PUT", "DELETE"], // 허용할 HTTP 메서드
    allowedHeaders: ["Content-Type", "Authorization", "admin-token", "Apollo-Require-Preflight"],
    exposedHeaders: ["Authorization"],
    optionsSuccessStatus: 200,
  };
  // ─────────────────────────────────────────────────────────────

  // 헬스 체크 엔드포인트 (CORS 적용 불필요)
  app.get("/health", (req, res) => {
    res.json({ status: "OK", timestamp: new Date().toISOString() });
  });
  // ─── GraphQL 전용 CORS + JSON 파서 + Apollo 미들웨어 ────────────
  app.options("/graphql", cors(corsOptions)); // 사전 요청 처리

  // 요청 로깅 미들웨어 추가
  app.use("/graphql", (req, res, next) => {
    console.log(`📝 GraphQL Request: ${req.method} ${req.url}`);
    console.log(`📝 Origin: ${req.headers.origin}`);
    console.log(`📝 Headers:`, req.headers);
    next();
  });

  app.use(
    "/graphql",
    cors(corsOptions), // CORS 헤더 부착
    express.json(), // JSON 요청 바디 파싱
    expressMiddleware(server, {
      context: async ({ req }) => {
        const token = req.headers.authorization || "";
        const adminToken = req.headers["admin-token"] || "";
        return { token, adminToken, req };
      },
    })
  );
  // ─────────────────────────────────────────────────────────────
  // 서버 기동
  const PORT = process.env.PORT || 5002;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on http://0.0.0.0:${PORT}/graphql`);
    console.log(`📊 Health available at http://0.0.0.0:${PORT}/health`);
  });
}

startServer().catch((err) => {
  console.error("❌ Failed to start server:", err);
  process.exit(1);
});
