
import { toast } from "react-hot-toast";

/**
 * 사용자에게 알림을 표시하는 중앙 관리 함수
 * @param {string} message - 표시할 메시지
 * @param {string} type - 알림 종류 (error, warn, success, info)
 */
export const showNotification = (message, type = 'error') => {
  console.log(`[Notification - ${type}]:`, message);
  
  switch (type) {
    case 'error':
      toast.error(message, {
        duration: 5000,
        position: 'top-center',
      });
      break;
    case 'warn':
      toast(message, {
        icon: '⚠️',
        duration: 4000,
        position: 'top-center',
      });
      break;
    case 'success':
      toast.success(message, {
        duration: 3000,
        position: 'top-center',
      });
      break;
    case 'info':
    default:
      toast(message, {
        duration: 3000,
        position: 'top-center',
      });
      break;
  }
};

/**
 * 에러 메시지를 사용자 친화적으로 변환
 */
export const getErrorMessage = (error) => {
  if (typeof error === 'string') return error;
  if (error?.message) return error.message;
  if (error?.errors?.[0]?.message) return error.errors[0].message;
  return '알 수 없는 오류가 발생했습니다.';
};

/**
 * 인증 관련 에러 처리
 */
export const handleAuthError = () => {
  showNotification('로그인이 필요합니다. 다시 로그인해주세요.');
  
  // Redux 상태 정리
  if (typeof window !== 'undefined' && window.__REDUX_STORE__) {
    window.__REDUX_STORE__.dispatch({ type: 'auth/logout' });
  }
  
  // 로컬 스토리지 정리
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  localStorage.removeItem('autoLoginEmail');
  localStorage.removeItem('autoLoginPassword');
  localStorage.removeItem('autoLoginEnabled');
  
  // 로그인 페이지로 리디렉션
  setTimeout(() => {
    window.location.href = '/login';
  }, 1000);
};
