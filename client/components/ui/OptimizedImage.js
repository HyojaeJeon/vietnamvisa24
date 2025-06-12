"use client";

import Image from "next/image";
import { useState } from "react";

// 최적화된 이미지 컴포넌트
export default function OptimizedImage({ src, alt, width, height, priority = false, className = "", placeholder = "blur", ...props }) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // 기본 blur placeholder 생성
  const blurDataURL = `data:image/svg+xml;base64,${Buffer.from(
    `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#9ca3af" font-size="14">
        Loading...
      </text>
    </svg>`
  ).toString("base64")}`;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!hasError ? (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          placeholder={placeholder}
          blurDataURL={blurDataURL}
          className={`transition-opacity duration-300 ${isLoading ? "opacity-0" : "opacity-100"}`}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setHasError(true);
            setIsLoading(false);
          }}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          {...props}
        />
      ) : (
        <div className="flex items-center justify-center bg-gray-100 text-gray-400" style={{ width, height }}>
          <span>이미지를 불러올 수 없습니다</span>
        </div>
      )}

      {isLoading && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse" style={{ width, height }}>
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}

// Hero 이미지용 최적화된 컴포넌트
export function HeroImage({ src, alt, className = "" }) {
  return <OptimizedImage src={src} alt={alt} width={1200} height={600} priority={true} className={`w-full h-auto object-cover ${className}`} />;
}

// 서비스 카드 이미지용 컴포넌트
export function ServiceCardImage({ src, alt, className = "" }) {
  return <OptimizedImage src={src} alt={alt} width={400} height={300} className={`w-full h-48 object-cover rounded-lg ${className}`} />;
}
