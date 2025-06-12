"use client";

import GoogleAnalytics from "./GoogleAnalytics";
import GoogleTagManager, { GoogleTagManagerNoScript } from "./GoogleTagManager";
import FacebookPixel from "./FacebookPixel";
import NaverAnalytics from "./NaverAnalytics";
import KakaoPixel from "./KakaoPixel";

// 모든 추적 스크립트를 통합 관리하는 컴포넌트
export default function TrackingScripts() {
  const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
  const FACEBOOK_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;
  const NAVER_ANALYTICS_ID = process.env.NEXT_PUBLIC_NAVER_ANALYTICS_ID;
  const KAKAO_PIXEL_ID = process.env.NEXT_PUBLIC_KAKAO_PIXEL_ID;

  return (
    <>
      {/* Google Tag Manager */}
      {GTM_ID && <GoogleTagManager GTM_ID={GTM_ID} />}

      {/* Google Analytics */}
      {GA_MEASUREMENT_ID && <GoogleAnalytics GA_MEASUREMENT_ID={GA_MEASUREMENT_ID} />}

      {/* Facebook Pixel */}
      {FACEBOOK_PIXEL_ID && <FacebookPixel PIXEL_ID={FACEBOOK_PIXEL_ID} />}

      {/* Naver Analytics */}
      {NAVER_ANALYTICS_ID && <NaverAnalytics ANALYTICS_ID={NAVER_ANALYTICS_ID} />}

      {/* Kakao Pixel */}
      {KAKAO_PIXEL_ID && <KakaoPixel PIXEL_ID={KAKAO_PIXEL_ID} />}
    </>
  );
}

// GTM NoScript 컴포넌트도 export
export { GoogleTagManagerNoScript };
