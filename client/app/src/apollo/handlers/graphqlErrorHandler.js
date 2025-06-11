
import { showNotification, handleAuthError } from '../../utils/notifications';

/**
 * GraphQL 에러를 중앙에서 처리하는 함수
 * @param {Array} graphQLErrors - Apollo Link에서 전달된 GraphQL 에러 배열
 */
export const handleGraphQLErrors = (graphQLErrors) => {
  graphQLErrors.forEach(({ message, extensions, locations, path }) => {
    const errorCode = extensions?.code;
    const errorMessage = extensions?.message || message;

    console.error(`[GraphQL Error]: 
      Code: ${errorCode}
      Message: ${errorMessage}
      Path: ${path}
      Location: ${JSON.stringify(locations)}`);

    switch (errorCode) {
      case 'UNAUTHENTICATED':
      case 'AUTHENTICATION_ERROR':
        handleAuthError();
        break;

      case 'FORBIDDEN':
      case 'PERMISSION_DENIED':
        showNotification('이 작업을 수행할 권한이 없습니다.');
        break;

      case 'VALIDATION_ERROR':
      case 'BAD_USER_INPUT':
        const details = extensions?.details || extensions?.invalidArgs || '입력값이 올바르지 않습니다.';
        if (typeof details === 'object') {
          const fieldErrors = Object.entries(details).map(([field, error]) => `${field}: ${error}`).join(', ');
          showNotification(`입력값 오류: ${fieldErrors}`);
        } else {
          showNotification(`입력값 오류: ${details}`);
        }
        break;
      
      case 'NOT_FOUND':
        showNotification('요청한 데이터를 찾을 수 없습니다.');
        break;

      case 'DUPLICATE_ERROR':
        showNotification('이미 존재하는 데이터입니다.');
        break;

      case 'INTERNAL_SERVER_ERROR':
      case 'DATABASE_ERROR':
        showNotification('서버 내부 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        break;

      case 'RATE_LIMITED':
        showNotification('요청이 너무 많습니다. 잠시 후 다시 시도해주세요.');
        break;

      case 'TOKEN_EXPIRED':
        console.log('Token expired, attempting refresh...');
        break; // 토큰 갱신은 errorLink에서 처리

      default:
        if (message === 'Authentication required') {
          handleAuthError();
        } else {
          showNotification(errorMessage || '알 수 없는 서버 오류가 발생했습니다.');
        }
        break;
    }
  });
};

/**
 * 특정 에러 코드인지 확인하는 유틸리티 함수
 */
export const isAuthError = (graphQLErrors) => {
  return graphQLErrors.some(error => 
    ['UNAUTHENTICATED', 'AUTHENTICATION_ERROR', 'TOKEN_EXPIRED'].includes(error.extensions?.code) ||
    error.message === 'Authentication required'
  );
};
