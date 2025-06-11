const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const cors = require('cors');
const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');
const { formatError } = require('./utils/errorHandler');
const { connectDB } = require('./database');

const app = express();

// CORS 설정
const corsOptions = {
  origin: ['http://localhost:3000', 'https://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'admin-token'],
};

app.use(cors(corsOptions));
app.use(express.json());

async function startServer() {
  try {
    // 데이터베이스 연결
    await connectDB();
    console.log('✅ Database connected successfully');

    // Apollo Server 생성
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      formatError,
      introspection: true,
      playground: true
    });

    await server.start();
    console.log('✅ Apollo Server started');

    // GraphQL 미들웨어 설정
    app.use('/graphql', expressMiddleware(server, {
      context: async ({ req }) => {
        const token = req.headers.authorization || '';
        const adminToken = req.headers['admin-token'] || '';

        return {
          token,
          adminToken,
          req
        };
      }
    }));

    // 헬스 체크 엔드포인트
    app.get('/health', (req, res) => {
      res.json({ status: 'OK', timestamp: new Date().toISOString() });
    });

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on http://0.0.0.0:${PORT}/graphql`);
      console.log(`📊 Health check available at http://0.0.0.0:${PORT}/health`);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();