/** @type {import('next').NextConfig} */
const nextConfig = {
  // 성능 최적화 설정
  compress: true,
  poweredByHeader: false,

  // 번들 분석 및 최적화
  webpack: (config, { dev, isServer }) => {
    // 프로덕션에서 번들 크기 최적화
    if (!dev && !isServer) {
      // config.optimization.splitChunks.cacheGroups = {
      //   ...config.optimization.splitChunks.cacheGroups,
      //   vendor: {
      //     test: /[\\/]node_modules[\\/]/,
      //     name: "vendors",
      //     chunks: "all",
      //   },
      // };
      Object.assign(config.optimization.splitChunks.cacheGroups, {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
        },
      });
    }

    return config;
  },

  // 이미지 최적화
  images: {
    formats: ["image/webp", "image/avif"],
    domains: ["localhost", "vietnamvisa24.com"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30일
  },

  // 실험적 기능
  experimental: {
    // optimizeCss: true, // 임시 비활성화 - critters 모듈 오류 방지
    optimizePackageImports: ["lucide-react", "@radix-ui/react-select"],
    webVitalsAttribution: ["CLS", "LCP", "FCP", "FID", "TTFB", "INP"],
  },

  // 헤더 설정
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
        ],
      },
      {
        source: "/images/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/icons/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/_next/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  async rewrites() {
    const isReplit = Boolean(process.env.REPLIT || process.env.REPLIT_ID);

    if (isReplit) {
      // Replit 환경: 같은 호스트의 5002 포트로 프록시
      return [
        {
          source: "/graphql",
          destination: "https://7b04571c-0d62-4a51-9cd2-f2eca1d84482-00-1bagmmob6jow8.picard.replit.dev:5002/graphql",
        },
      ];
    }
    if (process.env.NODE_ENV === "development") {
      // 로컬 개발 환경: localhost:5002으로 프록시
      return [
        {
          source: "/graphql",
          destination: "http://localhost:5002/graphql",
        },
      ];
    }

    // 프로덕션: 별도 프록시 없이 빈 배열 반환
    return [];
  },
};

module.exports = nextConfig;
