// 사이트맵 생성 유틸리티
export function generateSitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://vietnamvisa24.com";
  const currentDate = new Date().toISOString().split("T")[0];

  const pages = [
    {
      url: "/",
      changefreq: "daily",
      priority: "1.0",
      lastmod: currentDate,
    },
    {
      url: "/e-visa",
      changefreq: "weekly",
      priority: "0.9",
      lastmod: currentDate,
    },
    {
      url: "/airport-pickup",
      changefreq: "weekly",
      priority: "0.8",
      lastmod: currentDate,
    },
    {
      url: "/real-estate",
      changefreq: "weekly",
      priority: "0.8",
      lastmod: currentDate,
    },
    {
      url: "/about",
      changefreq: "monthly",
      priority: "0.7",
      lastmod: currentDate,
    },
    {
      url: "/contact",
      changefreq: "monthly",
      priority: "0.7",
      lastmod: currentDate,
    },
    {
      url: "/faq",
      changefreq: "weekly",
      priority: "0.6",
      lastmod: currentDate,
    },
    {
      url: "/blog",
      changefreq: "daily",
      priority: "0.8",
      lastmod: currentDate,
    },
    {
      url: "/pricing",
      changefreq: "weekly",
      priority: "0.8",
      lastmod: currentDate,
    },
    {
      url: "/visa-services",
      changefreq: "weekly",
      priority: "0.9",
      lastmod: currentDate,
    },
    {
      url: "/visa-services/e-visa",
      changefreq: "weekly",
      priority: "0.8",
      lastmod: currentDate,
    },
    {
      url: "/visa-services/visa-run",
      changefreq: "weekly",
      priority: "0.8",
      lastmod: currentDate,
    },
    {
      url: "/visa-services/fast-track",
      changefreq: "weekly",
      priority: "0.8",
      lastmod: currentDate,
    },
    {
      url: "/consultation",
      changefreq: "weekly",
      priority: "0.7",
      lastmod: currentDate,
    },
    {
      url: "/application",
      changefreq: "daily",
      priority: "0.9",
      lastmod: currentDate,
    },
    {
      url: "/application/e-visa",
      changefreq: "daily",
      priority: "0.8",
      lastmod: currentDate,
    },
    {
      url: "/application/visa-run",
      changefreq: "daily",
      priority: "0.8",
      lastmod: currentDate,
    },
    {
      url: "/status",
      changefreq: "daily",
      priority: "0.7",
      lastmod: currentDate,
    },
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (page) => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return sitemap;
}

// 로봇 텍스트 생성
export function generateRobotsTxt() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://vietnamvisa24.com";

  return `User-agent: *
Allow: /

# Disallow admin and private pages
Disallow: /admin
Disallow: /dashboard
Disallow: /api/
Disallow: /private/

# Allow important static files
Allow: /images/
Allow: /css/
Allow: /js/

# Sitemap location
Sitemap: ${baseUrl}/sitemap.xml`;
}
