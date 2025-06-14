// SEO 친화적인 서버 컴포넌트로 리팩토링된 메인 페이지
import React from "react";
import dynamic from "next/dynamic";

// 정적 컴포넌트들 - 서버 사이드 렌더링 지원
import StaticHeroSection from "./src/components/StaticHeroSection";
import StaticProcessSteps from "./src/components/StaticProcessSteps";
import StaticFaqSection from "./src/components/StaticFaqSection";
import StaticCompanyInfo from "./src/components/StaticCompanyInfo";
import StaticFooter from "./src/components/StaticFooter";

// 인터랙티브 섹션들 - 클라이언트 사이드에서만 로드
const InteractiveSections = dynamic(() => import("./src/components/InteractiveSections"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container px-4 py-16 mx-auto">
        <div className="text-center">
          <div className="w-1/3 h-8 mx-auto mb-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-2/3 h-4 mx-auto bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  ),
});

// 메타데이터 설정 (SEO 최적화)
export const metadata = {
  title: "베트남 비자 신청 대행 | Vietnam Visa 24 - 99.8% 승인률 보장",
  description: "베트남 E-VISA 전문 대행 서비스. 99.8% 승인률, 24시간 빠른 처리, 한국어 완벽 지원. 복잡한 비자 신청을 전문가가 완벽하게 처리해드립니다.",
  keywords: "베트남 비자, E-VISA, 베트남 관광비자, 베트남 상용비자, 비자 대행, 베트남 여행",
  openGraph: {
    title: "베트남 비자 신청 대행 | Vietnam Visa 24",
    description: "99.8% 승인률의 믿을 수 있는 베트남 비자 대행 서비스. 24시간 빠른 처리로 여행 준비를 완벽하게 도와드립니다.",
    type: "website",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "베트남 비자 신청 대행 | Vietnam Visa 24",
    description: "99.8% 승인률의 믿을 수 있는 베트남 비자 대행 서비스",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// 서버 컴포넌트로 변환된 메인 페이지
export default function HomePage() {
  return (
    <>
      {/* 인터랙티브 헤더와 챗봇 등 클라이언트 기능 */}
      <InteractiveSections />

      {/* 정적 콘텐츠 - 서버 사이드 렌더링으로 SEO 최적화 */}
      <main>
        <StaticHeroSection />
        <StaticProcessSteps />
        <StaticCompanyInfo />
        <StaticFaqSection />
      </main>

      {/* 정적 푸터 */}
      <StaticFooter />
    </>
  );
}
