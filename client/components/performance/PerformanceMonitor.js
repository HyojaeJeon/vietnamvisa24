"use client";

import { useEffect } from "react";
import { useTracking } from "../../hooks/useTracking";

export default function PerformanceMonitor() {
  // useTracking이 undefined를 반환할 가능성까지 방지 (optional chaining 사용)
  const trackingEvent = useTracking()?.trackEvent;

  // trackEvent가 undefined일 경우를 대비한 안전한 래퍼
  const safeTrackEvent =
    typeof trackingEvent === "function"
      ? trackingEvent
      : (event, data) => {
          if (typeof window !== "undefined" && window?.console) {
            if (process.env.NODE_ENV === "development") {
              console.warn("[PerformanceMonitor] trackEvent is not defined. Fallback invoked.", event, data);
            }
          }
        };

  console.log("[Debug] trackingEvent value:", trackingEvent);
  console.log("[Debug] safeTrackEvent is a function:", typeof safeTrackEvent === "function");

  useEffect(() => {
    // Performance Observer 설정
    if (typeof window !== "undefined" && "PerformanceObserver" in window) {
      // Navigation Timing 모니터링
      const navigationObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === "navigation") {
            const { domContentLoadedEventEnd, loadEventEnd, responseStart, requestStart, domInteractive, domComplete } = entry;

            // 페이지 로드 성능 메트릭 추적
            safeTrackEvent("performance_timing", {
              dom_content_loaded: Math.round(domContentLoadedEventEnd),
              page_load_complete: Math.round(loadEventEnd),
              time_to_first_byte: Math.round(responseStart - requestStart),
              dom_interactive: Math.round(domInteractive),
              dom_complete: Math.round(domComplete),
            });
          }
        }
      });

      navigationObserver.observe({ type: "navigation", buffered: true });

      // Resource Timing 모니터링 (큰 리소스만)
      const resourceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          // 1MB 이상의 리소스만 추적
          if (entry.transferSize > 1024 * 1024) {
            safeTrackEvent("large_resource_loaded", {
              resource_url: entry.name,
              transfer_size: entry.transferSize,
              load_time: Math.round(entry.duration),
              resource_type: entry.initiatorType,
            });
          }
        }
      });

      resourceObserver.observe({ type: "resource", buffered: false });

      // Long Task 모니터링
      const longTaskObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) {
            // 50ms 이상의 긴 작업
            safeTrackEvent("long_task_detected", {
              task_duration: Math.round(entry.duration),
              task_start_time: Math.round(entry.startTime),
            });
          }
        }
      });

      longTaskObserver.observe({ type: "longtask", buffered: false });

      // 메모리 사용량 모니터링 (Chrome에서만 지원)
      const checkMemoryUsage = () => {
        if ("memory" in performance) {
          const memInfo = performance.memory;
          const memoryUsage = {
            used_heap: Math.round(memInfo.usedJSHeapSize / 1024 / 1024), // MB
            total_heap: Math.round(memInfo.totalJSHeapSize / 1024 / 1024), // MB
            heap_limit: Math.round(memInfo.jsHeapSizeLimit / 1024 / 1024), // MB
          };

          // 메모리 사용량이 70% 이상일 때만 추적
          if (memoryUsage.used_heap / memoryUsage.heap_limit > 0.7) {
            safeTrackEvent("high_memory_usage", memoryUsage);
          }
        }
      };

      // 30초마다 메모리 사용량 체크
      const memoryInterval = setInterval(checkMemoryUsage, 30000);

      // 사용자 상호작용 지연 모니터링
      const measureInteractionDelay = () => {
        let interactionStart = 0;

        const handleUserInteraction = (event) => {
          interactionStart = performance.now();
        };

        const handleResponseTime = () => {
          if (interactionStart > 0) {
            const delay = performance.now() - interactionStart;
            if (delay > 100) {
              // 100ms 이상의 지연만 추적
              safeTrackEvent("interaction_delay", {
                delay_ms: Math.round(delay),
                interaction_type: "user_input",
              });
            }
            interactionStart = 0;
          }
        };

        // 주요 사용자 상호작용 이벤트 리스너
        ["click", "keydown", "touchstart"].forEach((eventType) => {
          document.addEventListener(eventType, handleUserInteraction, { passive: true });
        });

        // 다음 프레임에서 응답 시간 측정
        document.addEventListener(
          "click",
          () => {
            requestAnimationFrame(handleResponseTime);
          },
          { passive: true }
        );
      };

      measureInteractionDelay();

      // 정리 함수
      return () => {
        navigationObserver.disconnect();
        resourceObserver.disconnect();
        longTaskObserver.disconnect();
        clearInterval(memoryInterval);
      };
    }
  }, [trackingEvent]);

  return null; // 렌더링할 UI 없음
}

// 성능 임계값 설정
export const PERFORMANCE_THRESHOLDS = {
  // Core Web Vitals
  LCP_GOOD: 2500,
  LCP_NEEDS_IMPROVEMENT: 4000,
  FID_GOOD: 100,
  FID_NEEDS_IMPROVEMENT: 300,
  CLS_GOOD: 0.1,
  CLS_NEEDS_IMPROVEMENT: 0.25,

  // 추가 메트릭
  TTFB_GOOD: 600,
  FCP_GOOD: 1800,
  TTI_GOOD: 3800,
};

// 성능 등급 계산 유틸리티
export const getPerformanceGrade = (metric, value) => {
  const thresholds = PERFORMANCE_THRESHOLDS;

  switch (metric) {
    case "LCP":
      if (value <= thresholds.LCP_GOOD) return "good";
      if (value <= thresholds.LCP_NEEDS_IMPROVEMENT) return "needs-improvement";
      return "poor";

    case "FID":
      if (value <= thresholds.FID_GOOD) return "good";
      if (value <= thresholds.FID_NEEDS_IMPROVEMENT) return "needs-improvement";
      return "poor";

    case "CLS":
      if (value <= thresholds.CLS_GOOD) return "good";
      if (value <= thresholds.CLS_NEEDS_IMPROVEMENT) return "needs-improvement";
      return "poor";

    default:
      return "unknown";
  }
};
