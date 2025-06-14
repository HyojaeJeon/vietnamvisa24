
"use client";

import React from "react";
import { redirect } from "next/navigation";

export default function DashboardApply() {
  // 관리자 대시보드에서 신청 페이지로 리다이렉트
  React.useEffect(() => {
    redirect("/apply");
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <p className="text-gray-600">비자 신청 페이지로 이동 중...</p>
      </div>
    </div>
  );
}
