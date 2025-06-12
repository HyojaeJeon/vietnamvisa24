"use client";

import { useEffect } from "react";
import { onCLS, onINP, onFCP, onLCP, onTTFB } from "web-vitals";

// Web Vitals 모니터링 컴포넌트
export default function WebVitals() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      function sendToAnalytics(metric) {
        // Google Analytics로 전송
        if (window.gtag) {
          window.gtag("event", metric.name, {
            event_category: "Web Vitals",
            event_label: metric.id,
            value: Math.round(metric.name === "CLS" ? metric.value * 1000 : metric.value),
            non_interaction: true,
          });
        }

        // Facebook Pixel로 전송
        if (window.fbq) {
          window.fbq("trackCustom", "WebVitals", {
            metric_name: metric.name,
            metric_value: metric.value,
            metric_rating: metric.rating,
          });
        }

        // 콘솔에 로그 (개발 환경)
        if (process.env.NODE_ENV === "development") {
          console.log(`[Web Vitals] ${metric.name}:`, metric.value, metric.rating);
        }
      }

      // Core Web Vitals 측정
      onCLS(sendToAnalytics);
      onINP(sendToAnalytics);
      onFCP(sendToAnalytics);
      onLCP(sendToAnalytics);
      onTTFB(sendToAnalytics);
    }
  }, []);

  return null; // 렌더링할 UI가 없음
}

// 개별 성능 메트릭 훅
export function usePerformanceMonitoring() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      // 페이지 로드 시간 측정
      const [navigationEntry] = performance.getEntriesByType("navigation");
      if (navigationEntry) {
        const loadTime = navigationEntry.loadEventEnd - navigationEntry.startTime;

        // Resource Timing API로 리소스 로딩 시간 측정
        const resources = performance.getEntriesByType("resource");

        setTimeout(() => {
          if (window.gtag) {
            window.gtag("event", "page_load_time", {
              event_category: "Performance",
              event_label: window.location.pathname,
              value: loadTime,
            });

            // 느린 리소스 찾기
            const slowResources = resources.filter((resource) => resource.duration > 1000);
            slowResources.forEach((resource) => {
              window.gtag("event", "slow_resource", {
                event_category: "Performance",
                event_label: resource.name,
                value: resource.duration,
              });
            });
          }
        }, 0);
      }
    }
  }, []);
}
