"use client";

import { useState, useEffect } from "react";

// 페이지 전환 로딩 스피너
export const PageLoader = ({ isLoading = false, message = "페이지를 불러오는 중..." }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return 90; // 90%에서 대기
          return prev + Math.random() * 15;
        });
      }, 200);

      return () => clearInterval(interval);
    } else {
      setProgress(100);
      setTimeout(() => setProgress(0), 500);
    }
  }, [isLoading]);

  if (!isLoading && progress === 0) return null;

  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center">
        {/* 진행률 바 */}
        <div className="w-64 h-2 bg-gray-200 rounded-full mb-4 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300 ease-out" style={{ width: `${progress}%` }} />
        </div>

        {/* 로딩 스피너 */}
        <div className="inline-flex items-center gap-3 text-gray-600">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent" />
          <span className="text-sm font-medium">{message}</span>
        </div>
      </div>
    </div>
  );
};

// 스켈레톤 로더
export const SkeletonLoader = ({ lines = 3, className = "", showAvatar = false, showImage = false }) => {
  return (
    <div className={`animate-pulse space-y-3 ${className}`}>
      {showAvatar && (
        <div className="flex items-center space-x-3">
          <div className="rounded-full bg-gray-300 h-10 w-10" />
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-gray-300 rounded w-1/4" />
            <div className="h-3 bg-gray-300 rounded w-1/3" />
          </div>
        </div>
      )}

      {showImage && <div className="h-48 bg-gray-300 rounded-lg mb-4" />}

      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, index) => (
          <div key={index} className={`h-4 bg-gray-300 rounded ${index === lines - 1 ? "w-3/4" : "w-full"}`} />
        ))}
      </div>
    </div>
  );
};

// 카드형 스켈레톤
export const CardSkeleton = ({ count = 1 }) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md p-6">
          <SkeletonLoader showImage lines={2} />
          <div className="mt-4 flex justify-between items-center">
            <div className="h-6 bg-gray-300 rounded w-20" />
            <div className="h-8 bg-blue-300 rounded w-16" />
          </div>
        </div>
      ))}
    </div>
  );
};

// 인라인 로딩 스피너
export const InlineLoader = ({ size = "sm", color = "blue" }) => {
  const sizeClasses = {
    xs: "h-3 w-3",
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  const colorClasses = {
    blue: "border-blue-500",
    green: "border-green-500",
    red: "border-red-500",
    gray: "border-gray-500",
  };

  return <div className={`inline-block animate-spin rounded-full border-2 border-t-transparent ${sizeClasses[size]} ${colorClasses[color]}`} role="status" aria-label="로딩 중" />;
};

// 버튼 로딩 상태
export const LoadingButton = ({ children, isLoading = false, disabled = false, className = "", ...props }) => {
  return (
    <button
      className={`relative inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
        isLoading || disabled ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 active:scale-95"
      } text-white ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading && <InlineLoader size="sm" color="white" />}
      <span className={isLoading ? "ml-2" : ""}>{isLoading ? "처리 중..." : children}</span>
    </button>
  );
};

// 데이터 테이블 로딩
export const TableSkeleton = ({ rows = 5, columns = 4 }) => {
  return (
    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            {Array.from({ length: columns }).map((_, index) => (
              <th key={index} className="px-6 py-3">
                <div className="h-4 bg-gray-300 rounded w-full animate-pulse" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <td key={colIndex} className="px-6 py-4">
                  <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// 이미지 레이지 로딩 with 플레이스홀더
export const LazyImage = ({ src, alt, className = "", placeholderClassName = "", ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!isLoaded && !hasError && (
        <div className={`absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center ${placeholderClassName}`}>
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      )}

      {hasError && (
        <div className={`absolute inset-0 bg-gray-100 flex items-center justify-center ${placeholderClassName}`}>
          <div className="text-center text-gray-500">
            <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm">이미지를 불러올 수 없습니다</span>
          </div>
        </div>
      )}

      <img
        src={src}
        alt={alt}
        className={`transition-opacity duration-300 ${isLoaded ? "opacity-100" : "opacity-0"} ${className}`}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        loading="lazy"
        {...props}
      />
    </div>
  );
};
