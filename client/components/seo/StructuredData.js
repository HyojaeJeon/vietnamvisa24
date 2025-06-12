"use client";

import Script from "next/script";

// 구조화된 데이터 컴포넌트
export default function StructuredData({ data }) {
  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data),
      }}
    />
  );
}

// 기본 비즈니스 정보 구조화된 데이터
export function BusinessStructuredData() {
  const businessData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "베트남 비자 센터",
    alternateName: "Vietnam Visa Center",
    description: "신뢰할 수 있는 베트남 비자 전문 서비스. 온라인 비자 신청, 공항 픽업, 부동산 컨설팅 등 베트남 여행 및 거주를 위한 종합 서비스를 제공합니다.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://vietnamvisa24.com",
    logo: {
      "@type": "ImageObject",
      url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://vietnamvisa24.com"}/logo.png`,
      width: "200",
      height: "60",
    },
    image: `${process.env.NEXT_PUBLIC_SITE_URL || "https://vietnamvisa24.com"}/og-image.jpg`,
    telephone: "+84-xxx-xxx-xxxx",
    email: "info@vietnamvisa24.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Ho Chi Minh City",
      addressLocality: "Ho Chi Minh City",
      addressCountry: "VN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "10.8231",
      longitude: "106.6297",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday"],
        opens: "09:00",
        closes: "15:00",
      },
    ],
    serviceArea: {
      "@type": "Country",
      name: "Vietnam",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "베트남 비자 서비스",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "베트남 E-비자 신청",
            description: "온라인으로 간편하게 베트남 전자비자를 신청하세요",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "공항 픽업 서비스",
            description: "베트남 공항에서 안전하고 편리한 픽업 서비스",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "부동산 컨설팅",
            description: "베트남 부동산 투자 및 임대 전문 컨설팅",
          },
        },
      ],
    },
    sameAs: ["https://www.facebook.com/vietnamvisa24", "https://www.instagram.com/vietnamvisa24", "https://blog.naver.com/vietnamvisa24"],
  };

  return <StructuredData data={businessData} />;
}

// 웹사이트 구조화된 데이터
export function WebsiteStructuredData() {
  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "베트남 비자 센터",
    alternateName: "Vietnam Visa Center",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://vietnamvisa24.com",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${process.env.NEXT_PUBLIC_SITE_URL || "https://vietnamvisa24.com"}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    publisher: {
      "@type": "Organization",
      name: "베트남 비자 센터",
      logo: {
        "@type": "ImageObject",
        url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://vietnamvisa24.com"}/logo.png`,
      },
    },
  };

  return <StructuredData data={websiteData} />;
}

// 서비스 페이지용 구조화된 데이터
export function ServiceStructuredData({ serviceName, description, price, category }) {
  const serviceData = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: serviceName,
    description: description,
    provider: {
      "@type": "LocalBusiness",
      name: "베트남 비자 센터",
      url: process.env.NEXT_PUBLIC_SITE_URL || "https://vietnamvisa24.com",
    },
    areaServed: {
      "@type": "Country",
      name: "Vietnam",
    },
    serviceType: category,
    offers: price
      ? {
          "@type": "Offer",
          price: price,
          priceCurrency: "KRW",
          availability: "https://schema.org/InStock",
        }
      : undefined,
  };

  return <StructuredData data={serviceData} />;
}
