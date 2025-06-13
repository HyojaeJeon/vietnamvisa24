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

  // 테스트용 ID는 실제 로드하지 않음
  const isValidGTM = GTM_ID && GTM_ID !== "GTM-VN24VISA" && !GTM_ID.includes("test");
  const isValidGA = GA_MEASUREMENT_ID && GA_MEASUREMENT_ID !== "G-VN24VISA123" && !GA_MEASUREMENT_ID.includes("test");

  return (
    <>
      {/* Google Tag Manager - 실제 프로덕션 ID만 */}
      {isValidGTM && <GoogleTagManager GTM_ID={GTM_ID} />}

      {/* Google Analytics - 실제 프로덕션 ID만 */}
      {isValidGA && <GoogleAnalytics GA_MEASUREMENT_ID={GA_MEASUREMENT_ID} />}

      {/* Facebook Pixel */}
      {FACEBOOK_PIXEL_ID && FACEBOOK_PIXEL_ID !== "test" && <FacebookPixel PIXEL_ID={FACEBOOK_PIXEL_ID} />}

      {/* Naver Analytics */}
      {NAVER_ANALYTICS_ID && NAVER_ANALYTICS_ID !== "test" && <NaverAnalytics ANALYTICS_ID={NAVER_ANALYTICS_ID} />}

      {/* Kakao Pixel */}
      {KAKAO_PIXEL_ID && KAKAO_PIXEL_ID !== "test" && <KakaoPixel PIXEL_ID={KAKAO_PIXEL_ID} />}
    </>
  );
}

// GTM NoScript 컴포넌트도 export
export { GoogleTagManagerNoScript };
