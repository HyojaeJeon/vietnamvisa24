"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@apollo/client";
import { GET_ADMIN_ME_QUERY } from "../../src/lib/graphql";
import ServicesManagement from "./ServicesManagement";

export default function ServicesPage() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);

  const { data, error } = useQuery(GET_ADMIN_ME_QUERY, {
    errorPolicy: "all",
    skip: !authChecked, // 인증 토큰 확인 전에는 쿼리 skip
  });
  useEffect(() => {
    // 클라이언트에서만 localStorage 접근
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    if (!token) {
      router.replace("/dashboard/login");
      setAuthChecked(true);
      return;
    }
    setAuthChecked(true);
  }, [router]);

  useEffect(() => {
    if (authChecked && error?.message?.includes("Authentication")) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
      }
      router.replace("/dashboard/login");
    }
  }, [authChecked, error, router]);

  // 인증 체크 전에는 아무것도 렌더링하지 않음
  if (!authChecked) return null;

  // 인증된 유저 정보가 없으면 null 반환(리다이렉트만 수행)
  if (!data?.getAdminMe) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">서비스 가격 관리</h1>
              <p className="mt-2 text-sm text-gray-600">모든 서비스의 가격을 한 곳에서 관리합니다. (E-VISA, Visa Run, Fast Track)</p>
            </div>
          </div>
        </div>
      </div>

      <main className="py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <ServicesManagement />
      </main>
    </div>
  );
}
