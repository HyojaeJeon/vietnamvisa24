"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // 인증 상태 확인 로직
    // 개발 환경에서는 임시로 인증된 것으로 간주
    const checkAuth = () => {
      // 실제 환경에서는 토큰 검증 등의 로직이 필요
      const token = localStorage.getItem('authToken');
      
      if (process.env.NODE_ENV === 'development') {
        // 개발 환경에서는 항상 인증된 것으로 처리
        setIsAuthenticated(true);
      } else {
        // 실제 환경에서는 토큰 검증
        if (token) {
          setIsAuthenticated(true);
        } else {
          router.push('/auth/login');
        }
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 border-b-2 border-blue-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">인증 확인 중...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">접근 권한이 필요합니다</h2>
          <p className="text-gray-600 mb-4">이 페이지에 접근하려면 로그인이 필요합니다.</p>
          <button
            onClick={() => router.push('/auth/login')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            로그인 페이지로 이동
          </button>
        </div>
      </div>
    );
  }

  return children;
}
