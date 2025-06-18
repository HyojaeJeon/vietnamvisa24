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
    const { REPL_OWNER, REPL_SLUG, REPLIT_DEPLOYMENT, NODE_ENV } = process.env;

    console.log("Environment Variables:", NODE_ENV);
    // 오직 실제 배포된(Replit Deploy) 환경에서만 true
    const isReplit = REPLIT_DEPLOYMENT === "1";
    const replitHost = isReplit && REPL_OWNER && REPL_SLUG ? `${REPL_SLUG}-${REPL_OWNER}.repl.co` : null;
    if (isReplit && replitHost) {
      console.log("Replit Deploy detected, using dynamic rewrites.");
      console.log("Replit host:", replitHost);
      return [
        {
          source: "/graphql",
          destination: `https://${replitHost}:5002/graphql`,
        },
        {
          source: "/api/documents/:path*",
          destination: `https://${replitHost}:5002/api/documents/:path*`,
        },
      ];
    }
    if (process.env.NODE_ENV === "development") {
      // Replit 개발 환경: 0.0.0.0:5002로 프록시
      return [
        {
          source: "/graphql",
          destination: "http://0.0.0.0:5002/graphql",
        },
        {
          source: "/api/documents/:path*",
          destination: `http://0.0.0.0:5002/api/documents/:path*`,
        },
        {
          source: "/api/:path*",
          destination: `http://0.0.0.0:5002/api/:path*`,
        },
      ];
    }

    // 프로덕션: 별도 프록시 없이 빈 배열 반환
    return [];
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;