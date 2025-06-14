// SEO 메타데이터 생성 유틸리티
export function generateMetadata({ title, description, keywords = [], path = "/", images = [], noIndex = false, type = "website" }) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://vietnamvisa24.com";
  const fullUrl = `${baseUrl}${path}`;

  const defaultImage = {
    url: "/og-image.jpg",
    width: 1200,
    height: 630,
    alt: title || "베트남 비자 센터",
  };

  return {
    title: title ? `${title} | 베트남 비자 센터` : "베트남 비자 센터 | Vietnam Visa Center",
    description: description || "신뢰할 수 있는 베트남 비자 전문 서비스. 온라인 비자 신청, 공항 픽업, 부동산 컨설팅 등 베트남 여행 및 거주를 위한 종합 서비스를 제공합니다.",
    keywords: ["베트남비자", "Vietnam visa", "비자신청", "E-visa", "베트남여행", ...keywords],
    alternates: {
      canonical: fullUrl,
    },
    openGraph: {
      type,
      title: title || "베트남 비자 센터",
      description: description || "신뢰할 수 있는 베트남 비자 전문 서비스",
      url: fullUrl,
      siteName: "베트남 비자 센터",
      images: images.length > 0 ? images : [defaultImage],
      locale: "ko_KR",
    },
    twitter: {
      card: "summary_large_image",
      title: title || "베트남 비자 센터",
      description: description || "신뢰할 수 있는 베트남 비자 전문 서비스",
      images: images.length > 0 ? images.map((img) => img.url) : [defaultImage.url],
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
    },
  };
}

// 페이지별 SEO 설정
export const seoConfig = {
  home: {
    title: "베트남 비자 센터",
    description: "베트남 E-비자 신청, 공항 픽업, 부동산 컨설팅 등 베트남 여행 및 거주를 위한 종합 서비스",
    keywords: ["베트남비자", "E-visa", "공항픽업", "부동산", "베트남여행", "비자신청"],
  },
  eVisa: {
    title: "베트남 E-비자 신청",
    description: "온라인으로 간편하게 베트남 E-비자를 신청하세요. 빠르고 안전한 전자비자 서비스 제공",
    keywords: ["베트남 E-비자", "전자비자", "온라인비자신청", "E-visa Vietnam"],
  },
  airportPickup: {
    title: "베트남 공항 픽업 서비스",
    description: "베트남 주요 공항에서 안전하고 편리한 픽업 서비스를 제공합니다",
    keywords: ["베트남 공항픽업", "호치민 공항", "하노이 공항", "다낭 공항"],
  },
  realEstate: {
    title: "베트남 부동산 컨설팅",
    description: "베트남 부동산 투자 및 임대를 위한 전문 컨설팅 서비스",
    keywords: ["베트남 부동산", "베트남 투자", "호치민 부동산", "부동산 컨설팅"],
  },
  about: {
    title: "회사 소개",
    description: "베트남 비자 센터는 한국인을 위한 베트남 종합 서비스 전문업체입니다",
    keywords: ["베트남 비자 센터", "회사소개", "베트남 서비스"],
  },
  contact: {
    title: "연락처",
    description: "베트남 비자 및 기타 서비스 문의는 언제든지 연락주세요",
    keywords: ["연락처", "문의", "상담", "베트남 비자 센터"],
  },
  faq: {
    title: "자주 묻는 질문",
    description: "베트남 비자, 공항 픽업, 부동산 등에 대한 자주 묻는 질문과 답변",
    keywords: ["FAQ", "자주묻는질문", "베트남비자 질문", "비자 FAQ"],
  },
};

// 구조화된 데이터 생성
export function generateStructuredData(type, data) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://vietnamvisa24.com";

  const schemas = {
    Organization: {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "베트남 비자 센터",
      url: baseUrl,
      logo: `${baseUrl}/logo.png`,
      description: "베트남 비자 및 종합 서비스 전문업체",
      address: {
        "@type": "PostalAddress",
        addressCountry: "KR",
        addressLocality: "Seoul",
      },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+82-10-0000-0000",
        contactType: "customer service",
        availableLanguage: ["Korean", "Vietnamese", "English"],
      },
    },

    Service: {
      "@context": "https://schema.org",
      "@type": "Service",
      name: data?.name || "베트남 비자 서비스",
      description: data?.description || "베트남 비자 신청 및 관련 서비스",
      provider: {
        "@type": "Organization",
        name: "베트남 비자 센터",
        url: baseUrl,
      },
      areaServed: "KR",
      serviceType: data?.serviceType || "Visa Service",
    },

    FAQPage: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity:
        data?.faqs?.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })) || [],
    },

    BreadcrumbList: {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement:
        data?.breadcrumbs?.map((breadcrumb, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: breadcrumb.name,
          item: `${baseUrl}${breadcrumb.path}`,
        })) || [],
    },
  };

  return schemas[type] || schemas.Organization;
}

// 빵크럼 생성
export function generateBreadcrumbs(pathname) {
  const pathSegments = pathname.split("/").filter(Boolean);
  const breadcrumbs = [{ name: "홈", path: "/" }];

  const pathMap = {
    "e-visa": "E-비자",
    "airport-pickup": "공항 픽업",
    "real-estate": "부동산",
    about: "회사 소개",
    contact: "연락처",
    faq: "FAQ",
    blog: "블로그",
    application: "신청",
    status: "진행 상황",
  };

  let currentPath = "";
  pathSegments.forEach((segment) => {
    currentPath += `/${segment}`;
    const name = pathMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
    breadcrumbs.push({ name, path: currentPath });
  });

  return breadcrumbs;
}

// Default component export for compatibility
const Seo = ({ title, description, keywords }) => {
  return null; // This is just for compatibility
};

export default Seo;
