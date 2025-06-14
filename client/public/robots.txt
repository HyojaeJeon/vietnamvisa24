export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://vietnamvisa24.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard/", "/api/", "/_next/", "/admin/", "*.json", "/temp/", "/cache/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
