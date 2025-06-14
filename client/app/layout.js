// import "./globals.css";
// import Providers from "./providers";
// import TrackingScripts, { GoogleTagManagerNoScript } from "../components/analytics";
// import { BusinessStructuredData, WebsiteStructuredData } from "../components/seo/StructuredData";
// import WebVitals from "../components/performance/WebVitals";
// import ErrorBoundary from "../components/errors/ErrorBoundary";
// import { SkipLink } from "../components/accessibility/A11yComponents";
// import PropTypes from "prop-types";
// import dynamic from "next/dynamic";

// // Dynamic import for PerformanceMonitor to prevent hydration issues
// const PerformanceMonitor = dynamic(() => import("../components/performance/PerformanceMonitor"), {
//   ssr: false,
//   loading: () => null,
// });

// export const metadata = {
//   title: {
//     default: "베트남 비자 센터 | Vietnam Visa Center",
//     template: "%s | 베트남 비자 센터",
//   },
//   description: "신뢰할 수 있는 베트남 비자 전문 서비스. 온라인 비자 신청, 공항 픽업, 부동산 컨설팅 등 베트남 여행 및 거주를 위한 종합 서비스를 제공합니다.",
//   keywords: ["베트남비자", "Vietnam visa", "비자신청", "E-visa", "베트남여행", "공항픽업", "베트남부동산", "거주카드", "비자런", "오버스테이"],
//   authors: [{ name: "Vietnam Visa Center" }],
//   creator: "Vietnam Visa Center",
//   publisher: "Vietnam Visa Center",
//   formatDetection: {
//     email: false,
//     address: false,
//     telephone: false,
//   },
//   metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://vietnamvisa24.com"),
//   alternates: {
//     canonical: "/",
//     languages: {
//       "ko-KR": "/",
//       "en-US": "/en",
//       "vi-VN": "/vi",
//     },
//   },
//   openGraph: {
//     type: "website",
//     locale: "ko_KR",
//     url: "/",
//     siteName: "베트남 비자 센터",
//     title: "베트남 비자 센터 | Vietnam Visa Center",
//     description: "신뢰할 수 있는 베트남 비자 전문 서비스. 온라인 비자 신청, 공항 픽업, 부동산 컨설팅 등 베트남 여행 및 거주를 위한 종합 서비스를 제공합니다.",
//     images: [
//       {
//         url: "/images/og-image.svg",
//         width: 1200,
//         height: 630,
//         alt: "베트남 비자 센터",
//         type: "image/svg+xml",
//       },
//     ],
//   },
//   twitter: {
//     card: "summary_large_image",
//     title: "베트남 비자 센터 | Vietnam Visa Center",
//     description: "신뢰할 수 있는 베트남 비자 전문 서비스",
//     images: ["/images/og-image.svg"],
//     creator: "@vietnamvisa24",
//     site: "@vietnamvisa24",
//   },
//   robots: {
//     index: true,
//     follow: true,
//     googleBot: {
//       index: true,
//       follow: true,
//       "max-video-preview": -1,
//       "max-image-preview": "large",
//       "max-snippet": -1,
//     },
//   },
//   verification: {
//     google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
//     other: {
//       "naver-site-verification": process.env.NEXT_PUBLIC_NAVER_VERIFICATION,
//     },
//   }, // 추가 SEO 개선사항
//   category: "Travel Services",
//   classification: "Government Services",
//   generator: "Next.js",
//   applicationName: "베트남 비자 센터",
//   referrer: "origin-when-cross-origin",
//   manifest: "/manifest.json",
//   icons: {
//     icon: "/favicon.svg",
//     shortcut: "/favicon.svg",
//     apple: "/apple-touch-icon.svg",
//     other: {
//       rel: "apple-touch-icon-precomposed",
//       url: "/apple-touch-icon.svg",
//     },
//   },
// };

// export const viewport = {
//   width: "device-width",
//   initialScale: 1,
//   maximumScale: 5,
//   userScalable: true,
//   colorScheme: "light",
//   themeColor: [
//     { media: "(prefers-color-scheme: light)", color: "#1e40af" },
//     { media: "(prefers-color-scheme: dark)", color: "#1e40af" },
//   ],
// };

// export default function RootLayout({ children }) {
//   const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
//   const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
//   const FACEBOOK_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;

//   const isValidGTM = GTM_ID && GTM_ID !== "test";
//   const isValidGA = GA_MEASUREMENT_ID && GA_MEASUREMENT_ID !== "test";

//   return (
//     <html lang="ko">
//       <head>
//         {/* 추적 스크립트 */}
//         <TrackingScripts />
//         {/* 구조화된 데이터 */}
//         <BusinessStructuredData />
//         <WebsiteStructuredData />
//         {/* 추가 메타 태그 */}
//         <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
//         <meta name="theme-color" content="#1e40af" />
//         <meta name="color-scheme" content="light" />
//         <meta name="mobile-web-app-capable" content="yes" />
//         <meta name="apple-mobile-web-app-capable" content="yes" />
//         <meta name="apple-mobile-web-app-status-bar-style" content="default" />
//         <meta name="apple-mobile-web-app-title" content="베트남 비자 센터" />
//         <meta name="application-name" content="베트남 비자 센터" /> <meta name="msapplication-TileColor" content="#1e40af" />
//         <meta name="msapplication-config" content="/browserconfig.xml" />
//         {/* 파비콘 및 아이콘 */}
//         <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
//         <link rel="apple-touch-icon" href="/apple-touch-icon.svg" />
//         <link rel="manifest" href="/manifest.json" />
//         {/* 프리로드 중요 리소스 */}
//         <link rel="preconnect" href="https://fonts.googleapis.com" />
//         <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
//         {/* Analytics 스크립트 프리로드 - 실제 사용되는 것만 조건부로 */}
//         {isValidGTM && <link rel="preload" as="script" href={`https://www.googletagmanager.com/gtag/js?id=${GTM_ID}`} />}
//         {isValidGA && <link rel="preload" as="script" href={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} />}
//         {/* DNS 프리페치 - Analytics가 실제로 활성화된 경우에만 */}
//         {(isValidGTM || isValidGA) && (
//           <>
//             <link rel="dns-prefetch" href="//www.google-analytics.com" />
//             <link rel="dns-prefetch" href="//www.googletagmanager.com" />
//           </>
//         )}
//         {FACEBOOK_PIXEL_ID && FACEBOOK_PIXEL_ID !== "test" && <link rel="dns-prefetch" href="//connect.facebook.net" />}
//       </head>
//       <body className="antialiased">
//         {/* 접근성 스킵 링크 */}
//         <SkipLink />
//         {/* Google Tag Manager NoScript */}
//         {isValidGTM && <GoogleTagManagerNoScript GTM_ID={GTM_ID} />}
//         {/* 성능 모니터링 */}
//         <WebVitals />
//         <PerformanceMonitor />
//         {/* 에러 경계로 앱 전체 감싸기 */}
//         <ErrorBoundary>
//           <Providers>{children}</Providers>
//         </ErrorBoundary>
//         {/* 스키마 마크업 - 페이지별 구조화된 데이터 */}
//         <script
//           type="application/ld+json"
//           dangerouslySetInnerHTML={{
//             __html: JSON.stringify({
//               "@context": "https://schema.org",
//               "@type": "WebSite",
//               name: "베트남 비자 센터",
//               alternateName: "Vietnam Visa Center",
//               url: process.env.NEXT_PUBLIC_SITE_URL || "https://vietnamvisa24.com",
//               potentialAction: {
//                 "@type": "SearchAction",
//                 target: {
//                   "@type": "EntryPoint",
//                   urlTemplate: `${process.env.NEXT_PUBLIC_SITE_URL || "https://vietnamvisa24.com"}/search?q={search_term_string}`,
//                 },
//                 "query-input": "required name=search_term_string",
//               },
//             }),
//           }}
//         />
//       </body>
//     </html>
//   );
// }

// RootLayout.propTypes = {
//   children: PropTypes.node.isRequired,
// };
import "./globals.css";
import Providers from "./providers";
import TrackingScripts, { GoogleTagManagerNoScript } from "../components/analytics";
import { BusinessStructuredData, WebsiteStructuredData } from "../components/seo/StructuredData";
import WebVitals from "../components/performance/WebVitals";
import ErrorBoundary from "../components/errors/ErrorBoundary";
import { SkipLink } from "../components/accessibility/A11yComponents";
import dynamic from "next/dynamic";

// Dynamic import for PerformanceMonitor to prevent hydration issues
const PerformanceMonitor = dynamic(() => import("../components/performance/PerformanceMonitor"), {
  ssr: false,
  loading: () => null,
});

// metadata 객체를 통해 대부분의 <head> 태그를 관리합니다.
export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://vietnamvisa24.com"),

  // 기본 SEO
  title: {
    default: "베트남 비자 센터 | Vietnam Visa Center",
    template: "%s | 베트남 비자 센터",
  },
  description: "신뢰할 수 있는 베트남 비자 전문 서비스. 온라인 비자 신청, 공항 픽업, 부동산 컨설팅 등 베트남 여행 및 거주를 위한 종합 서비스를 제공합니다.",
  keywords: ["베트남비자", "Vietnam visa", "비자신청", "E-visa", "베트남여행", "공항픽업", "베트남부동산", "거주카드", "비자런", "오버스테이"],

  // 작성자 및 게시자 정보
  authors: [{ name: "Vietnam Visa Center" }],
  creator: "Vietnam Visa Center",
  publisher: "Vietnam Visa Center",

  // 기타 정보
  generator: "Next.js",
  applicationName: "베트남 비자 센터",
  referrer: "origin-when-cross-origin",
  formatDetection: { email: false, address: false, telephone: false },

  // 소셜 및 공유 (Open Graph, Twitter)
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "/",
    siteName: "베트남 비자 센터",
    title: "베트남 비자 센터 | Vietnam Visa Center",
    description: "신뢰할 수 있는 베트남 비자 전문 서비스. 온라인 비자 신청, 공항 픽업, 부동산 컨설팅 등 베트남 여행 및 거주를 위한 종합 서비스를 제공합니다.",
    images: [
      {
        url: "/images/og-image.svg",
        width: 1200,
        height: 630,
        alt: "베트남 비자 센터",
        type: "image/svg+xml",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "베트남 비자 센터 | Vietnam Visa Center",
    description: "신뢰할 수 있는 베트남 비자 전문 서비스",
    images: ["/images/og-image.svg"],
    creator: "@vietnamvisa24",
    site: "@vietnamvisa24",
  },

  // 로봇 및 검색엔진 최적화
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

  // 사이트 소유권 확인
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
    other: { "naver-site-verification": process.env.NEXT_PUBLIC_NAVER_VERIFICATION },
  },

  // 기타 메타 태그 - 표준 PWA 설정을 여기에 추가합니다.
  other: {
    "mobile-web-app-capable": "yes",
    "preconnect-supabase": "https://aibdxsebwhalbnugsqel.supabase.co",
  },

  // 아이콘 및 매니페스트 (PWA)
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/apple-touch-icon.svg",
    other: {
      // apple-touch-icon-precomposed를 위한 설정
      "mobile-web-app-capable": "yes",
      rel: "apple-touch-icon-precomposed",
      url: "/apple-touch-icon.svg",
    },
  },

  // Apple PWA 관련 설정
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "베트남 비자 센터",
  },

  // 기타 메타 태그
  category: "Travel Services",
  classification: "Visa and Travel Services",
};

// viewport 객체를 통해 뷰포트와 테마 색상을 관리합니다.
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  colorScheme: "light",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#1e40af" },
    { media: "(prefers-color-scheme: dark)", color: "#1e40af" },
  ],
};

import StoreProvider from "./storeProvider";
import ApolloProvider from "./apolloProvider";

export default function RootLayout({ children }) {
  const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
  const isValidGTM = GTM_ID && GTM_ID !== "test";

  return (
    <html lang="ko">
      {/* <head> 태그는 여기에 필요 없습니다. Next.js가 위 metadata와 viewport 객체로 자동 생성합니다. */}
      <body className="antialiased">
        {/* 접근성 스킵 링크 */}
        <SkipLink />

        {/* Google Tag Manager NoScript는 body 바로 다음에 위치합니다. */}
        {isValidGTM && <GoogleTagManagerNoScript GTM_ID={GTM_ID} />}

        <StoreProvider>
          <ApolloProvider>
            <Providers>
              <ErrorBoundary>
                <NoSSR>{children}</NoSSR>
              </ErrorBoundary>
            </Providers>
          </ApolloProvider>
        </StoreProvider>

        {/* 스크립트 및 구조화 데이터 컴포넌트는 body 내부에 위치시켜 하이드레이션 오류를 방지합니다. */}
        <TrackingScripts />
        <BusinessStructuredData />
        <WebsiteStructuredData />

        {/* 성능 측정 관련 컴포넌트 */}
        <WebVitals />
        <PerformanceMonitor />
      </body>
    </html>
  );
}