const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const cors = require("cors");
require("dotenv").config();

const typeDefs = require("./graphql/schema");
const resolvers = require("./graphql/resolvers");
const models = require("./models");

const { connectDB } = require("./database");

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 5000;

  const whiteList = [
    "https://7b04571c-0d62-4a51-9cd2-f2eca1d84482-00-1bagmmob6jow8.picard.replit.dev",
    "https://7b04571c-0d62-4a51-9cd2-f2eca1d84482-00-1bagmmob6jow8.picard.replit.dev:3000",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
  ];
  
  // CORS configuration
  app.use(
    cors({
      origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (process.env.NODE_ENV === "production") {
          return callback(null, process.env.CLIENT_URL);
        }
        
        if (whiteList.indexOf(origin) !== -1) {
          return callback(null, true);
        } else {
          console.log('CORS blocked origin:', origin);
          return callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'admin-token'],
    }),
  );

  // Connect to MySQL
  await connectDB();

  // Create Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      const token = req.headers.authorization?.replace("Bearer ", "") || "";
      const adminToken = req.headers["admin-token"] || "";
      return { token, adminToken };
    },
  });

  await server.start();

  // Apply Apollo GraphQL middleware
  server.applyMiddleware({
    app,
    path: "/graphql",
    cors: false,
  });

  // Handle preflight requests
  app.options('*', (req, res) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, admin-token');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.sendStatus(200);
  });

  // Health check endpoint
  app.get("/health", (req, res) => {
    res.json({ status: "OK", message: "Server is running" });
  });

  const serverInstance = app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server ready at http://0.0.0.0:${PORT}`);
    console.log(
      `🚀 GraphQL endpoint ready at http://0.0.0.0:${PORT}${server.graphqlPath}`,
    );
  });

  // Handle server errors (including port conflicts)
  serverInstance.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`❌ Port ${PORT} is already in use. Trying to kill existing process...`);
      process.exit(1);
    } else {
      console.error('❌ Server error:', err);
      process.exit(1);
    }
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('🔄 SIGTERM received, shutting down gracefully');
    serverInstance.close(() => {
      console.log('✅ Server closed');
      process.exit(0);
    });
  });

  process.on('SIGINT', () => {
    console.log('🔄 SIGINT received, shutting down gracefully');
    serverInstance.close(() => {
      console.log('✅ Server closed');
      process.exit(0);
    });
  });
}

startServer().catch((error) => {
  console.error("Error starting server:", error);
});
