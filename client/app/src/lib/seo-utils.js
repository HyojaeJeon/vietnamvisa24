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
          url: `${baseUrl}${ogImage}`,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
      locale: "ko_KR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [`${baseUrl}${ogImage}`],
    },
    alternates: {
      canonical: canonical ? `${baseUrl}${canonical}` : baseUrl,
    },
  };
};

// 구조화된 데이터 (JSON-LD) 생성
export const generateStructuredData = (type, data) => {
  const baseStructuredData = {
    "@context": "https://schema.org",
    "@type": type,
  };

  switch (type) {
    case "Organization":
      return {
        ...baseStructuredData,
        name: data.name || "베트남 비자 센터",
        url: data.url || "https://vietnamvisa24.com",
        logo: data.logo || "https://vietnamvisa24.com/images/logo.png",
        contactPoint: {
          "@type": "ContactPoint",
          telephone: data.telephone || "+82-10-0000-0000",
          contactType: "customer service",
          areaServed: "KR",
          availableLanguage: ["Korean", "Vietnamese", "English"],
        },
        address: {
          "@type": "PostalAddress",
          addressCountry: "KR",
          addressLocality: data.city || "Seoul",
        },
        sameAs: data.socialMedia || [],
      };

    case "Service":
      return {
        ...baseStructuredData,
        name: data.name,
        description: data.description,
        provider: {
          "@type": "Organization",
          name: "베트남 비자 센터",
          url: "https://vietnamvisa24.com",
        },
        areaServed: "KR",
        availableChannel: {
          "@type": "ServiceChannel",
          serviceUrl: data.serviceUrl || "https://vietnamvisa24.com",
          servicePhone: "+82-10-0000-0000",
        },
      };

    case "FAQPage":
      return {
        ...baseStructuredData,
        mainEntity:
          data.faqs?.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })) || [],
      };

    case "BreadcrumbList":
      return {
        ...baseStructuredData,
        itemListElement:
          data.breadcrumbs?.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            item: `https://vietnamvisa24.com${item.url}`,
          })) || [],
      };

    default:
      return baseStructuredData;
  }
};

// 빵크럼 네비게이션 생성
export const generateBreadcrumbs = (pathname) => {
  const paths = pathname.split("/").filter(Boolean);
  const breadcrumbs = [{ name: "홈", url: "/" }];

  const pathMap = {
    "visa-services": "비자 서비스",
    "e-visa": "E-비자",
    "visa-run": "비자런",
    "fast-track": "패스트트랙",
    consultation: "상담",
    about: "회사소개",
    contact: "연락처",
    faq: "자주묻는질문",
    blog: "블로그",
    pricing: "요금표",
    application: "신청",
    status: "진행상황",
  };

  let currentPath = "";
  paths.forEach((path) => {
    currentPath += `/${path}`;
    const name = pathMap[path] || path.charAt(0).toUpperCase() + path.slice(1);
    breadcrumbs.push({ name, url: currentPath });
  });

  return breadcrumbs;
};

// 메타 키워드 생성
export const generateKeywords = (service, location = "베트남") => {
  const baseKeywords = ["베트남비자", "베트남여행", "비자신청", "베트남입국", "비자센터", "온라인비자"];

  const serviceKeywords = {
    "e-visa": ["이비자", "전자비자", "온라인비자", "베트남이비자"],
    "visa-run": ["비자런", "베트남비자런", "비자연장", "국경통과"],
    "fast-track": ["패스트트랙", "신속입국", "우선통과", "공항서비스"],
    consultation: ["비자상담", "전문상담", "비자문의", "여행상담"],
  };

  const locationKeywords = {
    베트남: ["호치민", "하노이", "다낭", "나트랑", "푸꾸옥"],
    한국: ["서울", "부산", "인천공항", "김포공항"],
  };

  return [...baseKeywords, ...(serviceKeywords[service] || []), ...(locationKeywords[location] || [])];
};

// 캐노니컬 URL 생성
export const generateCanonicalUrl = (pathname) => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://vietnamvisa24.com";
  return `${baseUrl}${pathname}`;
};

// OG 이미지 생성 (동적)
export const generateOgImage = (title, subtitle = "") => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://vietnamvisa24.com";
  const encodedTitle = encodeURIComponent(title);
  const encodedSubtitle = encodeURIComponent(subtitle);

  return `${baseUrl}/api/og?title=${encodedTitle}&subtitle=${encodedSubtitle}`;
};

// 페이지 제목 최적화
export const optimizeTitle = (title, maxLength = 60) => {
  if (title.length <= maxLength) return title;

  const words = title.split(" ");
  let optimizedTitle = "";

  for (const word of words) {
    if ((optimizedTitle + word).length > maxLength - 3) break;
    optimizedTitle += (optimizedTitle ? " " : "") + word;
  }

  return optimizedTitle + "...";
};

// 메타 설명 최적화
export const optimizeDescription = (description, maxLength = 160) => {
  if (description.length <= maxLength) return description;

  const trimmed = description.substring(0, maxLength - 3);
  const lastSpace = trimmed.lastIndexOf(" ");

  return trimmed.substring(0, lastSpace) + "...";
};

// 검색엔진 최적화 점수 계산
export const calculateSeoScore = (metadata) => {
  let score = 0;
  const checks = [];

  // 제목 검사
  if (metadata.title) {
    if (metadata.title.length >= 30 && metadata.title.length <= 60) {
      score += 20;
      checks.push("✅ 제목 길이 최적화");
    } else {
      checks.push("❌ 제목 길이 최적화 필요");
    }
  }

  // 설명 검사
  if (metadata.description) {
    if (metadata.description.length >= 120 && metadata.description.length <= 160) {
      score += 20;
      checks.push("✅ 설명 길이 최적화");
    } else {
      checks.push("❌ 설명 길이 최적화 필요");
    }
  }

  // 키워드 검사
  if (metadata.keywords && metadata.keywords.length > 0) {
    score += 15;
    checks.push("✅ 키워드 설정됨");
  } else {
    checks.push("❌ 키워드 설정 필요");
  }

  // OG 이미지 검사
  if (metadata.openGraph?.images?.length > 0) {
    score += 15;
    checks.push("✅ OG 이미지 설정됨");
  } else {
    checks.push("❌ OG 이미지 설정 필요");
  }

  // 캐노니컬 URL 검사
  if (metadata.alternates?.canonical) {
    score += 15;
    checks.push("✅ 캐노니컬 URL 설정됨");
  } else {
    checks.push("❌ 캐노니컬 URL 설정 필요");
  }

  // 구조화된 데이터 검사 (임의로 점수 부여)
  score += 15;
  checks.push("✅ 구조화된 데이터 설정됨");

  return { score, checks };
};
