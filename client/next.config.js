
/** @type {import('next').NextConfig} */
const nextConfig = {
  // rewrites 설정을 Replit 환경에 맞게 수정
  async rewrites() {
    // Replit 환경에서는 같은 도메인의 다른 포트로 proxy
    const isReplit = process.env.REPLIT || process.env.REPL_ID;

    if (isReplit) {
      // Replit 환경에서는 현재 호스트의 5000 포트로 프록시
      return [
        {
          source: "/graphql",
          destination: "https://7b04571c-0d62-4a51-9cd2-f2eca1d84482-00-1bagmmob6jow8.picard.replit.dev:5000/graphql",
        },
      ];
    } else {
      // 로컬 환경
      return [
        {
          source: "/graphql",
          destination: "http://localhost:5000/graphql",
        },
      ];
    }
  },
};

module.exports = nextConfig;
