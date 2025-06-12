"use client";

import React from "react";
import { useTracking } from "../../hooks/useTracking";

class ErrorBoundaryClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });

    // 에러 추적
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // 개발 환경에서는 콘솔에 로그 출력
    if (process.env.NODE_ENV === "development") {
      console.error("ErrorBoundary caught an error:", error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.state.errorInfo, this.handleRetry);
      }

      return (
        <div className="flex flex-col justify-center min-h-screen py-12 bg-gray-50 sm:px-6 lg:px-8">
          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="px-4 py-8 bg-white shadow sm:rounded-lg sm:px-10">
              <div className="text-center">
                {/* 에러 아이콘 */}
                <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>

                {/* 에러 메시지 */}
                <h3 className="mt-4 text-lg font-medium text-gray-900">문제가 발생했습니다</h3>
                <p className="mt-2 text-sm text-gray-500">예상치 못한 오류가 발생했습니다. 잠시 후 다시 시도해주세요.</p>

                {/* 에러 상세 정보 (개발 환경에서만) */}
                {process.env.NODE_ENV === "development" && this.state.error && (
                  <details className="mt-4 text-left">
                    <summary className="text-sm text-gray-700 cursor-pointer hover:text-gray-900">에러 상세 정보 보기</summary>
                    <div className="p-3 mt-2 overflow-auto font-mono text-xs text-gray-800 bg-gray-100 rounded max-h-40">
                      <div className="mb-2">
                        <strong>Error:</strong> {this.state.error.toString()}
                      </div>
                      <div>
                        <strong>Stack:</strong>
                        <pre className="whitespace-pre-wrap">{this.state.errorInfo.componentStack}</pre>
                      </div>
                    </div>
                  </details>
                )}

                {/* 액션 버튼 */}
                <div className="flex flex-col gap-3 mt-6 sm:flex-row">
                  <button
                    onClick={this.handleRetry}
                    className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    다시 시도
                  </button>
                  <button
                    onClick={() => (window.location.href = "/")}
                    className="flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    홈으로 이동
                  </button>
                </div>

                {/* 고객 지원 링크 */}
                <div className="mt-4">
                  <p className="text-xs text-gray-500">
                    문제가 계속되면{" "}
                    <a href="/contact" className="text-blue-600 hover:text-blue-500">
                      고객 지원팀
                    </a>
                    에 문의해주세요.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// 에러 추적을 위한 HOC
export default function ErrorBoundary({ children, fallback, onError }) {
  const trackingEvent = useTracking()?.trackEvent;

  // trackEvent가 undefined일 경우를 대비한 안전한 래퍼
  const safeTrackEvent =
    typeof trackingEvent === "function"
      ? trackingEvent
      : (event, data) => {
          if (typeof window !== "undefined" && window?.console) {
            // 개발 환경에서만 경고 출력
            if (process.env.NODE_ENV === "development") {
              console.warn("[ErrorBoundary] trackEvent is not defined. Fallback invoked.", event, data);
            }
          }
        };

  const handleError = (error, errorInfo) => {
    // 에러 이벤트 추적 (trackEvent가 항상 안전하게 동작)
    safeTrackEvent("error_boundary_triggered", {
      error_message: error.message,
      error_stack: error.stack,
      component_stack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      user_agent: typeof navigator !== "undefined" ? navigator.userAgent : "",
      url: typeof window !== "undefined" ? window.location.href : "",
    });

    // 추가 에러 핸들링
    if (typeof onError === "function") {
      onError(error, errorInfo);
    }
  };

  return (
    <ErrorBoundaryClass fallback={fallback} onError={handleError}>
      {children}
    </ErrorBoundaryClass>
  );
}

// 특정 컴포넌트용 간단한 에러 경계
export const SimpleErrorBoundary = ({ children, message = "이 섹션을 불러오는 중 오류가 발생했습니다." }) => {
  return (
    <ErrorBoundary
      fallback={(error, errorInfo, retry) => (
        <div className="p-4 border border-red-200 rounded-lg bg-red-50">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">오류 발생</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{message}</p>
              </div>
              <div className="mt-3">
                <button onClick={retry} className="px-3 py-1 text-sm text-red-800 bg-red-100 rounded hover:bg-red-200">
                  다시 시도
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  );
};
