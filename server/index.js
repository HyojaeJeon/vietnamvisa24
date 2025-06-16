// // index.js
// const express = require("express");
// const { createServer } = require("http");
// const { ApolloServer } = require("@apollo/server");
// const { expressMiddleware } = require("@apollo/server/express4");
// const cors = require("cors");
// const cookieParser = require("cookie-parser");
// const typeDefs = require("./graphql/schema");
// const resolvers = require("./graphql/resolvers");
// const { formatError } = require("./utils/errorHandler");
// const { connectDB } = require("./database");
// const { initializeSocket } = require("./utils/socketManager");

// // API 라우터 임포트
// const webhooksRouter = require("./routes/webhooks");
// const documentsRouter = require("./routes/documents");

// async function startServer() {
//   // 1) DB 연결
//   await connectDB();
//   console.log("✅ Database connected successfully");

//   // 2) Apollo Server 인스턴스 생성
//   const server = new ApolloServer({
//     typeDefs,
//     resolvers,
//     formatError,
//     introspection: true, // 개발용: GraphQL Playgrounds 허용
//   });
//   await server.start();
//   console.log("✅ Apollo Server started");
//   const app = express();
//   const httpServer = createServer(app);

//   // Socket.IO 초기화
//   const io = initializeSocket(httpServer);
//   console.log("✅ Socket.IO initialized");

//   // 앱에 Socket.IO 인스턴스 저장 (리졸버에서 사용하기 위해)
//   app.set("io", io);
//   // ─── CORS 옵션 정의 ───────────────────────────────────────────
//   const corsOptions = {
//     origin: true, // 모든 origin 허용 (개발용)
//     credentials: true, // 쿠키·인증 헤더 허용
//     methods: ["GET", "POST", "OPTIONS", "PUT", "DELETE"], // 허용할 HTTP 메서드
//     allowedHeaders: ["Content-Type", "Authorization", "admin-token", "Apollo-Require-Preflight"],
//     exposedHeaders: ["Authorization"],
//     optionsSuccessStatus: 200,
//   };
//   // ─────────────────────────────────────────────────────────────

//   // 헬스 체크 엔드포인트 (CORS 적용 불필요)
//   app.get("/health", (req, res) => {
//     res.json({ status: "OK", timestamp: new Date().toISOString() });
//   });

//   // ─── REST API 라우터 설정 ────────────────────────────────────
//   app.use(cors(corsOptions)); // 모든 라우터에 CORS 적용
//   app.use(express.json()); // JSON 파서 적용
//   app.use(cookieParser());

//   // 요청 로깅 미들웨어 추가
//   app.use((req, res, next) => {
//     console.log(`📝 ${new Date().toISOString()} - ${req.method} ${req.url}`);
//     next();
//   });

//   // 문서 관리 API 라우터 디버깅
//   app.use(
//     "/api/documents",
//     (req, res, next) => {
//       console.log(`📍 Documents route hit: ${req.method} ${req.url}`);
//       next();
//     },
//     documentsRouter
//   );
//   console.log("✅ Documents router registered at /api/documents");

//   // 웹훅 API 라우터 (결제 서비스 연동)
//   app.use("/api/webhooks", webhooksRouter);

//   // 업로드된 파일의 정적 서빙 (선택사항)
//   app.use("/uploads", express.static("uploads"));
//   // ─────────────────────────────────────────────────────────────

//   // ─── GraphQL 전용 CORS + JSON 파서 + Apollo 미들웨어 ────────────
//   app.options("/graphql", cors(corsOptions)); // 사전 요청 처리

//   // 요청 로깅 미들웨어 추가
//   app.use("/graphql", (req, res, next) => {
//     console.log(`📝 GraphQL Request: ${req.method} ${req.url}`);
//     console.log(`📝 Origin: ${req.headers.origin}`);
//     console.log(`📝 Headers:`, req.headers);
//     next();
//   });
//   app.use(
//     "/graphql",
//     cors(corsOptions),
//     express.json(),
//     expressMiddleware(server, {
//       context: async ({ req, res }) => {
//         const token = req.headers.authorization || req.cookies.accessToken || "";
//         const adminToken = req.headers["admin-token"] || req.cookies.adminAccessToken || "";
//         const refreshToken = req.cookies.refreshToken || "";
//         const adminRefreshToken = req.cookies.adminRefreshToken || "";
//         const io = req.app.get("io");
//         return { token, adminToken, refreshToken, adminRefreshToken, req, res, io };
//       },
//     })
//   ); // ─────────────────────────────────────────────────────────────
//   // 서버 기동 (Socket.IO와 함께)
//   const PORT = process.env.PORT || 5002;
//   httpServer.listen(PORT, "0.0.0.0", () => {
//     console.log(`🚀 Server running on http://0.0.0.0:${PORT}/graphql`);
//     console.log(`📊 Health available at http://0.0.0.0:${PORT}/health`);
//     console.log(`⚡ Socket.IO ready for real-time communication`);
//   });
// }

// startServer().catch((err) => {
//   console.error("❌ Failed to start server:", err);
//   process.exit(1);
// });

// server/index.js
const express = require("express");
const { createServer } = require("http");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

const typeDefs = require("./graphql/schema");
const resolvers = require("./graphql/resolvers");
const { formatError } = require("./utils/errorHandler");
const { connectDB } = require("./database");
const { initializeSocket } = require("./utils/socketManager");

// REST API 라우터 임포트
const webhooksRouter = require("./routes/webhooks");
const documentsRouter = require("./routes/documents");
const uploadPassportImageRouter = require("./routes/uploadPassportImage");

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
  const httpServer = createServer(app);

  // Socket.IO 초기화
  const io = initializeSocket(httpServer);
  console.log("✅ Socket.IO initialized");

  // 앱에 Socket.IO 인스턴스 저장 (리졸버에서 사용하기 위해)
  app.set("io", io);

  // ─── CORS 옵션 정의 ───────────────────────────────────────────
  const corsOptions = {
    origin: true, // 모든 origin 허용 (개발용)
    credentials: true, // 쿠키·인증 헤더 허용
    methods: ["GET", "POST", "OPTIONS", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "admin-token", "Apollo-Require-Preflight"],
    exposedHeaders: ["Authorization"],
    optionsSuccessStatus: 200,
  };
  // ─────────────────────────────────────────────────────────────

  // 헬스 체크 엔드포인트 (CORS 적용 불필요)
  app.get("/health", (req, res) => {
    res.json({ status: "OK", timestamp: new Date().toISOString() });
  });

  // ─── REST API 라우터 설정 ────────────────────────────────────
  app.use(cors(corsOptions));
  app.use(express.json());
  app.use(cookieParser());

  // 요청 로깅 미들웨어
  app.use((req, res, next) => {
    console.log(`📝 ${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
  });

  // 문서 관리 API
  app.use(
    "/api/documents",
    (req, res, next) => {
      console.log(`📍 Documents route hit: ${req.method} ${req.url}`);
      next();
    },
    documentsRouter
  );
  console.log("✅ Documents router registered at /api/documents");

  // 웹훅 API
  app.use("/api/webhooks", webhooksRouter);

  // 여권 정보 추출 API
  app.use("/api/extract_passport", uploadPassportImageRouter);
  console.log("✅ Passport extraction router registered at /api/extract_passport");

  // 업로드된 파일 정적 서빙
  app.use("/uploads", express.static(path.join(__dirname, "uploads")));
  // ─────────────────────────────────────────────────────────────

  // ─── GraphQL 전용 미들웨어 ───────────────────────────────────
  app.options("/graphql", cors(corsOptions));
  app.use(
    "/graphql",
    (req, res, next) => {
      console.log(`📝 GraphQL Request: ${req.method} ${req.url}`);
      console.log(`📝 Origin: ${req.headers.origin}`);
      console.log(`📝 Headers:`, req.headers);
      next();
    },
    cors(corsOptions),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req, res }) => {
        const token = req.headers.authorization || req.cookies.accessToken || "";
        const adminToken = req.headers["admin-token"] || req.cookies.adminAccessToken || "";
        const refreshToken = req.cookies.refreshToken || "";
        const adminRefreshToken = req.cookies.adminRefreshToken || "";
        const io = req.app.get("io");
        return { token, adminToken, refreshToken, adminRefreshToken, req, res, io };
      },
    })
  );
  // ─────────────────────────────────────────────────────────────

  // 서버 기동
  const PORT = process.env.PORT || 5002;
  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on http://0.0.0.0:${PORT}/graphql`);
    console.log(`📊 Health available at http://0.0.0.0:${PORT}/health`);
    console.log(`⚡ Socket.IO ready for real-time communication`);
  });
}

startServer().catch((err) => {
  console.error("❌ Failed to start server:", err);
  process.exit(1);
});
