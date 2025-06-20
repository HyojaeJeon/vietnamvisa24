const express = require("express");
const { createServer } = require("http");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

const typeDefs = require("./graphql/schema");
const resolvers = require("./graphql/resolvers");
const { connectDB } = require("./database");
const { initializeSocket } = require("./utils/socketManager");
const { formatError, asyncHandler } = require("./utils/errorHandler.js");

// REST API 라우터 임포트
const webhooksRouter = require("./routes/webhooks");
const documentsRouter = require("./routes/documents");
const uploadPassportImageRouter = require("./routes/uploadPassportImage");
const uploadProfileImageRouter = require("./routes/uploadProfileImage");
const notificationsRouter = require("./routes/notifications");

// 리졸버 자동 래핑
const wrapResolvers = (resolvers) => {
  const wrapped = {};
  for (const [typeName, fieldMap] of Object.entries(resolvers)) {
    wrapped[typeName] = {};

    // Scalar 타입은 래핑하지 않음
    if (typeof fieldMap === "object" && fieldMap.constructor === Object) {
      for (const [fieldName, fn] of Object.entries(fieldMap)) {
        if (typeof fn === "function") {
          wrapped[typeName][fieldName] = asyncHandler(fn);
        } else {
          // scalar 또는 다른 특수 타입의 경우 그대로 복사
          wrapped[typeName][fieldName] = fn;
        }
      }
    } else {
      // scalar 정의의 경우 그대로 복사
      wrapped[typeName] = fieldMap;
    }
  }
  return wrapped;
};

async function startServer() {
  // 1) DB 연결
  await connectDB();
  console.log("✅ Database connected successfully");

  // 2) Apollo Server 인스턴스 생성
  const server = new ApolloServer({
    typeDefs,
    resolvers: wrapResolvers(resolvers),
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
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
      "http://localhost:3003",
    ], // 개발 환경 허용 도메인
    credentials: true, // 쿠키·인증 헤더 허용
    methods: ["GET", "POST", "OPTIONS", "PUT", "DELETE"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "admin-token",
      "x-apollo-operation-name",
      "apollo-require-preflight",
      "apollographql-client-name",
      "apollographql-client-version",
    ], // Apollo Client 헤더들 명시적 허용
    exposedHeaders: ["Authorization", "admin-token"],
    optionsSuccessStatus: 200,
    preflightContinue: false,
  };
  // ─────────────────────────────────────────────────────────────

  // 헬스 체크 엔드포인트 (CORS 적용 불필요)
  app.get("/health", (req, res) => {
    res.json({ status: "OK", timestamp: new Date().toISOString() });
  });
  // ─── REST API 라우터 설정 ────────────────────────────────────
  app.use(cors(corsOptions));
  app.use(express.json({ limit: "50mb" })); // 파일 업로드를 위해 크기 제한 증가
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  app.use(cookieParser());
  // 요청 로깅 미들웨어
  app.use((req, res, next) => {
    console.log(`📝 ${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
  });

  // 정적 파일 서빙 (업로드된 파일들)
  app.use("/uploads", express.static(path.join(__dirname, "uploads")));
  console.log("✅ Static file serving registered at /uploads");

  // 문서 관리 API
  app.use(
    "/api/documents",
    (req, res, next) => {
      console.log(`📍 Documents route hit: ${req.method} ${req.url}`);
      next();
    },
    documentsRouter,
  );
  console.log("✅ Documents router registered at /api/documents");

  // 웹훅 API
  app.use("/api/webhooks", webhooksRouter);

  // 여권 정보 추출 API
  app.use("/api/extract_passport", uploadPassportImageRouter);
  console.log(
    "✅ Passport extraction router registered at /api/extract_passport",
  );
  // 프로필 이미지 업로드 API
  app.use("/api/upload_profile_image", uploadProfileImageRouter);
  console.log(
    "✅ Profile image upload router registered at /api/upload_profile_image",
  );

  // 알림 관리 API
  app.use("/api/notifications", notificationsRouter);
  console.log("✅ Notifications router registered at /api/notifications");

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
    express.json({ limit: "50mb" }), // GraphQL용 크기 제한 증가
    expressMiddleware(server, {
      context: async ({ req, res }) => {
        const token =
          req.headers.authorization || req.cookies.accessToken || "";
        const adminToken =
          req.headers["admin-token"] || req.cookies.adminAccessToken || "";
        const refreshToken = req.cookies.refreshToken || "";
        const adminRefreshToken = req.cookies.adminRefreshToken || "";
        const io = req.app.get("io");
        return {
          token,
          adminToken,
          refreshToken,
          adminRefreshToken,
          req,
          res,
          io,
        };
      },
    }),
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
