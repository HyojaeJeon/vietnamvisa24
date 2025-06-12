/**
 * SEO 최적화를 위한 유틸리티 함수들
 */

// 페이지별 메타데이터 생성
export const generatePageMetadata = ({ title, description, keywords = [], canonical = "", ogImage = "/images/og-image.svg", noindex = false }) => {
  const baseTitle = "베트남 비자 센터";
  const fullTitle = title ? `${title} | ${baseTitle}` : baseTitle;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://vietnamvisa24.com";

  return {
    title: fullTitle,
    description,
    keywords: keywords.join(", "),
    robots: {
      index: !noindex,
      follow: !noindex,
      googleBot: {
        index: !noindex,
        follow: !noindex,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      title: fullTitle,
      description,
      url: canonical ? `${baseUrl}${canonical}` : baseUrl,
      siteName: baseTitle,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title || baseTitle,
        },
      ],
      locale: "ko_KR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
      creator: "@vietnamvisa24",
    },
    alternates: {
      canonical: canonical ? `${baseUrl}${canonical}` : baseUrl,
    },
  };
};

// 구조화된 데이터 생성
export const generateStructuredData = {
  // 서비스 페이지용
  service: (service) => ({
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    provider: {
      "@type": "Organization",
      name: "베트남 비자 센터",
      url: process.env.NEXT_PUBLIC_SITE_URL || "https://vietnamvisa24.com",
    },
    serviceType: service.type,
    areaServed: {
      "@type": "Country",
      name: "Vietnam",
    },
    offers: service.offers
      ? {
          "@type": "Offer",
          price: service.offers.price,
          priceCurrency: "KRW",
          availability: "https://schema.org/InStock",
        }
      : undefined,
  }),

  // FAQ 페이지용
  faq: (faqs) => ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }),

  // 브레드크럼 네비게이션
  breadcrumb: (items) => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }),

  // 조직 정보
  organization: () => ({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "베트남 비자 센터",
    alternateName: "Vietnam Visa Center",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://vietnamvisa24.com",
    logo: `${process.env.NEXT_PUBLIC_SITE_URL || "https://vietnamvisa24.com"}/images/logo.svg`,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+82-2-1234-5678",
      contactType: "customer service",
      areaServed: "KR",
      availableLanguage: ["Korean", "Vietnamese", "English"],
    },
    sameAs: ["https://www.facebook.com/vietnamvisa24", "https://www.instagram.com/vietnamvisa24", "https://blog.naver.com/vietnamvisa24"],
  }),

  // 지역 비즈니스
  localBusiness: () => ({
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: "베트남 비자 센터",
    image: `${process.env.NEXT_PUBLIC_SITE_URL || "https://vietnamvisa24.com"}/images/og-image.svg`,
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://vietnamvisa24.com",
    telephone: "+82-2-1234-5678",
    address: {
      "@type": "PostalAddress",
      streetAddress: "서울특별시 강남구",
      addressLocality: "서울",
      addressCountry: "KR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 37.5665,
      longitude: 126.978,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
    priceRange: "$$",
  }),
};

// URL 정규화
export const normalizeUrl = (url) => {
  if (!url) return "";

  // 상대 경로를 절대 경로로 변환
  if (url.startsWith("/")) {
    return `${process.env.NEXT_PUBLIC_SITE_URL || "https://vietnamvisa24.com"}${url}`;
  }

  return url;
};

// 키워드 최적화
export const optimizeKeywords = (baseKeywords, pageSpecificKeywords = []) => {
  const commonKeywords = ["베트남비자", "Vietnam visa", "비자신청", "E-visa", "베트남여행", "비자센터"];

  return [...new Set([...commonKeywords, ...baseKeywords, ...pageSpecificKeywords])];
};

// 메타 설명 최적화 (160자 제한)
export const optimizeDescription = (description) => {
  const maxLength = 160;

  if (description.length <= maxLength) {
    return description;
  }

  // 문장 단위로 자르기
  const sentences = description.split(". ");
  let optimized = "";

  for (const sentence of sentences) {
    if ((optimized + sentence + ". ").length <= maxLength) {
      optimized += (optimized ? ". " : "") + sentence;
    } else {
      break;
    }
  }

  return optimized + (optimized.endsWith(".") ? "" : "...");
};

// 소셜 미디어 이미지 생성 URL
export const getSocialImageUrl = (title, type = "default") => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://vietnamvisa24.com";

  // 동적 OG 이미지 생성 API 엔드포인트 (향후 구현)
  const params = new URLSearchParams({
    title: encodeURIComponent(title),
    type,
  });

  return `${baseUrl}/api/og?${params.toString()}`;
};

// 캐노니컬 URL 생성
export const getCanonicalUrl = (path = "") => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://vietnamvisa24.com";
  const cleanPath = path.replace(/\/+$/, ""); // 끝 슬래시 제거

  return `${baseUrl}${cleanPath}`;
};

// hreflang 태그 생성
export const generateHreflangTags = (path = "") => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://vietnamvisa24.com";

  return {
    "ko-KR": `${baseUrl}${path}`,
    "en-US": `${baseUrl}/en${path}`,
    "vi-VN": `${baseUrl}/vi${path}`,
    "x-default": `${baseUrl}${path}`,
  };
};
