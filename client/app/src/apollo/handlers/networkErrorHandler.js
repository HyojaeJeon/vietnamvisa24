
import { showNotification } from '../../utils/notifications';

/**
 * 네트워크 에러를 중앙에서 처리하는 함수
 * @param {Error} networkError - Apollo Link에서 전달된 네트워크 에러 객체
 */
export const handleNetworkError = (networkError) => {
  console.error(`[Network error]:`, networkError);

  if (networkError.statusCode) {
    switch (networkError.statusCode) {
      case 400:
        showNotification('잘못된 요청입니다.');
        break;
      case 401:
        showNotification('인증이 필요합니다.');
        break;
      case 403:
        showNotification('접근 권한이 없습니다.');
        break;
      case 404:
        showNotification('요청한 리소스를 찾을 수 없습니다.');
        break;
      case 500:
        showNotification('서버 내부 오류가 발생했습니다.');
        break;
      case 502:
      case 503:
      case 504:
        showNotification('서버가 일시적으로 이용 불가능합니다. 잠시 후 다시 시도해주세요.');
        break;
      default:
        showNotification(`네트워크 오류 (${networkError.statusCode}): ${networkError.message}`);
        break;
    }
  } else if (networkError.message) {
    if (networkError.message.includes('fetch')) {
      showNotification('서버에 연결할 수 없습니다. 네트워크 상태를 확인해주세요.');
    } else if (networkError.message.includes('timeout')) {
      showNotification('요청 시간이 초과되었습니다. 다시 시도해주세요.');
    } else {
      showNotification(`네트워크 오류: ${networkError.message}`);
    }
  } else {
    showNotification('네트워크 연결에 문제가 있습니다. 인터넷 연결을 확인해주세요.');
  }
};
