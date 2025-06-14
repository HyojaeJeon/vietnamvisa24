import { generatePageMetadata } from "./src/lib/seo-utils";

// 정적 페이지 목록
const staticPages = [
  {
    url: "/",
    changeFrequency: "daily",
    priority: 1.0,
  },
  {
    url: "/apply",
    changeFrequency: "weekly",
    priority: 0.9,
  },
  {
    url: "/e-visa",
    changeFrequency: "weekly",
    priority: 0.9,
  },
  {
    url: "/residence-card",
    changeFrequency: "weekly",
    priority: 0.8,
  },
  {
    url: "/airport-pickup",
    changeFrequency: "weekly",
    priority: 0.8,
  },
  {
    url: "/airport-fast-track",
    changeFrequency: "weekly",
    priority: 0.8,
  },
  {
    url: "/mobile-visa-run",
    changeFrequency: "weekly",
    priority: 0.8,
  },
  {
    url: "/overstay",
    changeFrequency: "weekly",
    priority: 0.8,
  },
  {
    url: "/real-estate",
    changeFrequency: "weekly",
    priority: 0.7,
  },
  {
    url: "/car-rental",
    changeFrequency: "weekly",
    priority: 0.7,
  },
  {
    url: "/aboutUs",
    changeFrequency: "monthly",
    priority: 0.6,
  },
  {
    url: "/login",
    changeFrequency: "yearly",
    priority: 0.3,
  },
  {
    url: "/register",
    changeFrequency: "yearly",
    priority: 0.3,
  },
];

export default function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://vietnamvisa24.com";

  return staticPages.map((page) => ({
    url: `${baseUrl}${page.url}`,
    lastModified: new Date(),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
}
