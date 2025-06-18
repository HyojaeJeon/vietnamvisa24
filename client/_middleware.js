import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // "/dashboard" 경로에만 토큰 검증 적용
  if (pathname.startsWith("/dashboard")) {
    const token = request.cookies.get("adminAccessToken")?.value;
    if (!token) {
      // 토큰 없으면 로그인 페이지로 리다이렉트
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
