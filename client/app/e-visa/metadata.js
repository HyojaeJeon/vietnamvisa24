import { generateMetadata as generateSEOMetadata } from "../../lib/seo";

export function generateMetadata() {
  return generateSEOMetadata({
    title: "베트남 E-비자 온라인 신청",
    description: "베트남 전자비자(E-visa)를 온라인으로 간편하게 신청하세요. 빠르고 안전한 처리로 베트남 여행을 준비하세요.",
    keywords: ["베트남 E-비자", "전자비자", "온라인 비자신청", "베트남 입국", "베트남 여행"],
    path: "/e-visa",
    images: [
      {
        url: "/images/evisa-og.jpg",
        width: 1200,
        height: 630,
        alt: "베트남 E-비자 신청",
      },
    ],
  });
}
