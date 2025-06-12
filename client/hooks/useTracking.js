"use client";

import { useEffect } from "react";

// Google Analytics 이벤트 추적 훅
export function useGoogleAnalytics() {
  const trackEvent = (action, category, label, value) => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", action, {
        event_category: category,
        event_label: label,
        value: value,
      });
    }
  };

  const trackPageView = (page_title, page_location) => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "page_view", {
        page_title: page_title,
        page_location: page_location,
      });
    }
  };

  const trackConversion = (conversionLabel, conversionValue) => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "conversion", {
        send_to: conversionLabel,
        value: conversionValue,
        currency: "KRW",
      });
    }
  };

  return { trackEvent, trackPageView, trackConversion };
}

// Facebook Pixel 이벤트 추적 훅
export function useFacebookPixel() {
  const trackEvent = (eventName, parameters = {}) => {
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("track", eventName, parameters);
    }
  };

  const trackCustomEvent = (eventName, parameters = {}) => {
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("trackCustom", eventName, parameters);
    }
  };

  const trackPurchase = (value, currency = "KRW") => {
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("track", "Purchase", {
        value: value,
        currency: currency,
      });
    }
  };

  const trackLead = (parameters = {}) => {
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("track", "Lead", parameters);
    }
  };

  return { trackEvent, trackCustomEvent, trackPurchase, trackLead };
}

// 페이지뷰 자동 추적 훅
export function usePageTracking() {
  const { trackPageView } = useGoogleAnalytics();

  useEffect(() => {
    if (typeof window !== "undefined") {
      trackPageView(document.title, window.location.href);
    }
  }, [trackPageView]);
}

// 통합 트래킹 훅
export function useTracking() {
  const googleAnalytics = useGoogleAnalytics();
  const facebookPixel = useFacebookPixel();

  // trackEvent를 통합하여 반환
  const trackEvent = (eventName, parameters = {}) => {
    googleAnalytics.trackEvent?.(eventName, parameters);
    facebookPixel.trackEvent?.(eventName, parameters);
  };

  return {
    trackEvent,
    ...googleAnalytics,
    ...facebookPixel,
  };
}
