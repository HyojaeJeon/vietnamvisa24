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
      url: "/residence-card",
      changefreq: "weekly",
      priority: "0.8",
      lastmod: currentDate,
    },
    {
      url: "/mobile-visa-run",
      changefreq: "weekly",
      priority: "0.7",
      lastmod: currentDate,
    },
    {
      url: "/overstay",
      changefreq: "weekly",
      priority: "0.7",
      lastmod: currentDate,
    },
    {
      url: "/car-rental",
      changefreq: "weekly",
      priority: "0.7",
      lastmod: currentDate,
    },
    {
      url: "/aboutUs",
      changefreq: "monthly",
      priority: "0.6",
      lastmod: currentDate,
    },
    {
      url: "/apply",
      changefreq: "weekly",
      priority: "0.8",
      lastmod: currentDate,
    },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
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

  return xml;
}

// 동적 사이트맵 생성 (블로그 포스트, 서비스 페이지 등)
export function generateDynamicSitemap(dynamicPages = []) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://vietnamvisa24.com";
  const currentDate = new Date().toISOString().split("T")[0];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${dynamicPages
  .map(
    (page) => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod || currentDate}</lastmod>
    <changefreq>${page.changefreq || "weekly"}</changefreq>
    <priority>${page.priority || "0.5"}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return xml;
}
