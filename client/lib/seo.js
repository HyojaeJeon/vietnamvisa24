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
      locale: "ko_KR",
      url: fullUrl,
      siteName: "베트남 비자 센터",
      title: title || "베트남 비자 센터 | Vietnam Visa Center",
      description: description || "신뢰할 수 있는 베트남 비자 전문 서비스",
      images: images.length > 0 ? images : [defaultImage],
    },
    twitter: {
      card: "summary_large_image",
      title: title || "베트남 비자 센터 | Vietnam Visa Center",
      description: description || "신뢰할 수 있는 베트남 비자 전문 서비스",
      images: images.length > 0 ? images.map((img) => img.url) : [defaultImage.url],
      creator: "@vietnamvisa24",
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
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
}

// 서비스별 메타데이터 템플릿
export const serviceMetadata = {
  evisa: {
    title: "베트남 E-비자 온라인 신청",
    description: "베트남 전자비자(E-visa)를 온라인으로 간편하게 신청하세요. 빠르고 안전한 처리로 베트남 여행을 준비하세요.",
    keywords: ["베트남 E-비자", "전자비자", "온라인 비자신청", "베트남 입국"],
  },
  airportPickup: {
    title: "베트남 공항 픽업 서비스",
    description: "베트남 공항에서 안전하고 편리한 픽업 서비스. 24시간 예약 가능하며 전문 드라이버가 서비스를 제공합니다.",
    keywords: ["베트남 공항픽업", "호치민 공항", "하노이 공항", "공항 셔틀"],
  },
  realEstate: {
    title: "베트남 부동산 컨설팅",
    description: "베트남 부동산 투자 및 임대 전문 컨설팅. 안전한 투자를 위한 법무, 세무 상담까지 원스톱 서비스.",
    keywords: ["베트남 부동산", "부동산 투자", "베트남 아파트", "부동산 컨설팅"],
  },
  residenceCard: {
    title: "베트남 거주카드 신청",
    description: "베트남 장기거주를 위한 거주카드(TRC) 신청 서비스. 전문 상담과 함께 빠른 처리를 보장합니다.",
    keywords: ["베트남 거주카드", "TRC", "장기거주", "베트남 이민"],
  },
  visaRun: {
    title: "베트남 모바일 비자런 서비스",
    description: "캄보디아 국경을 통한 편리한 모바일 비자런 서비스. 안전하고 빠른 비자 연장 솔루션을 제공합니다.",
    keywords: ["베트남 비자런", "모바일 비자런", "비자 연장", "캄보디아 국경"],
  },
  overstay: {
    title: "베트남 오버스테이 해결",
    description: "베트남 오버스테이 문제 해결 전문 서비스. 법적 절차와 벌금 처리까지 완벽하게 도와드립니다.",
    keywords: ["베트남 오버스테이", "벌금 처리", "출국 절차", "법적 상담"],
  },
  carRental: {
    title: "베트남 렌터카 서비스",
    description: "베트남 전 지역 렌터카 서비스. 다양한 차종과 합리적인 가격으로 편안한 베트남 여행을 즐기세요.",
    keywords: ["베트남 렌터카", "차량 대여", "드라이버 포함", "베트남 여행"],
  },
};

// 페이지별 breadcrumb 생성
export function generateBreadcrumb(path) {
  const pathSegments = path.split("/").filter((segment) => segment);
  const breadcrumbList = [
    {
      "@type": "ListItem",
      position: 1,
      name: "홈",
      item: process.env.NEXT_PUBLIC_SITE_URL || "https://vietnamvisa24.com",
    },
  ];

  pathSegments.forEach((segment, index) => {
    const position = index + 2;
    const url = `${process.env.NEXT_PUBLIC_SITE_URL || "https://vietnamvisa24.com"}/${pathSegments.slice(0, index + 1).join("/")}`;

    // 세그먼트를 한국어 이름으로 변환
    const segmentNames = {
      "e-visa": "E-비자",
      "airport-pickup": "공항 픽업",
      "real-estate": "부동산",
      "residence-card": "거주카드",
      "mobile-visa-run": "모바일 비자런",
      overstay: "오버스테이",
      "car-rental": "렌터카",
      aboutUs: "회사소개",
      apply: "신청하기",
      dashboard: "대시보드",
      login: "로그인",
      register: "회원가입",
    };

    breadcrumbList.push({
      "@type": "ListItem",
      position: position,
      name: segmentNames[segment] || segment,
      item: url,
    });
  });

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbList,
  };
}
