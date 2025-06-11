
const { 
  AppError, 
  ValidationError, 
  AuthenticationError, 
  NotFoundError,
  DuplicateError,
  DatabaseError 
} = require('./errorTypes');

/**
 * GraphQL 에러 포맷터
 */
const formatError = (error) => {
  console.error('GraphQL Error:', {
    message: error.message,
    locations: error.locations,
    path: error.path,
    stack: error.stack
  });

  // 운영 환경에서는 스택 트레이스 숨김
  const isDevelopment = process.env.NODE_ENV === 'development';

  if (error.originalError instanceof AppError) {
    return {
      message: error.message,
      locations: error.locations,
      path: error.path,
      extensions: {
        code: error.originalError.errorCode || 'INTERNAL_SERVER_ERROR',
        statusCode: error.originalError.statusCode,
        details: error.originalError.details,
        ...(isDevelopment && { stacktrace: error.stack })
      }
    };
  }

  // JWT 에러 처리
  if (error.originalError?.name === 'JsonWebTokenError') {
    return {
      message: 'Invalid token',
      locations: error.locations,
      path: error.path,
      extensions: {
        code: 'UNAUTHENTICATED',
        statusCode: 401
      }
    };
  }

  if (error.originalError?.name === 'TokenExpiredError') {
    return {
      message: 'Token expired',
      locations: error.locations,
      path: error.path,
      extensions: {
        code: 'TOKEN_EXPIRED',
        statusCode: 401
      }
    };
  }

  // Sequelize 에러 처리
  if (error.originalError?.name === 'SequelizeValidationError') {
    const details = {};
    error.originalError.errors.forEach(err => {
      details[err.path] = err.message;
    });
    
    return {
      message: 'Validation failed',
      locations: error.locations,
      path: error.path,
      extensions: {
        code: 'VALIDATION_ERROR',
        statusCode: 400,
        details
      }
    };
  }

  if (error.originalError?.name === 'SequelizeUniqueConstraintError') {
    return {
      message: 'Duplicate entry',
      locations: error.locations,
      path: error.path,
      extensions: {
        code: 'DUPLICATE_ERROR',
        statusCode: 409
      }
    };
  }

  if (error.originalError?.name?.startsWith('Sequelize')) {
    return {
      message: 'Database error occurred',
      locations: error.locations,
      path: error.path,
      extensions: {
        code: 'DATABASE_ERROR',
        statusCode: 500,
        ...(isDevelopment && { stacktrace: error.stack })
      }
    };
  }

  // 기본 에러 처리
  return {
    message: isDevelopment ? error.message : 'Internal server error',
    locations: error.locations,
    path: error.path,
    extensions: {
      code: 'INTERNAL_SERVER_ERROR',
      statusCode: 500,
      ...(isDevelopment && { stacktrace: error.stack })
    }
  };
};

/**
 * 데이터베이스 에러를 AppError로 변환
 */
const handleDatabaseError = (error) => {
  if (error.name === 'SequelizeValidationError') {
    const details = {};
    error.errors.forEach(err => {
      details[err.path] = err.message;
    });
    throw new ValidationError('Validation failed', details);
  }

  if (error.name === 'SequelizeUniqueConstraintError') {
    throw new DuplicateError('Duplicate entry');
  }

  if (error.name?.startsWith('Sequelize')) {
    throw new DatabaseError('Database operation failed');
  }

  throw error;
};

/**
 * 비동기 함수를 래핑하여 에러를 자동으로 처리
 */
const asyncHandler = (fn) => {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      handleDatabaseError(error);
    }
  };
};

module.exports = {
  formatError,
  handleDatabaseError,
  asyncHandler
};
