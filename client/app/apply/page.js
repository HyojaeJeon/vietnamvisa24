"use client";

import React, { Suspense } from "react";
import ApplyPageContent from "./ApplyPageContent";

// Loading component
function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-700">로딩 중...</h2>
        <p className="text-gray-500 mt-2">비자 신청 페이지를 준비하고 있습니다</p>
      </div>
    </div>
  );
}

// Main page component
export default function ApplyVisaPage() {
  console.log("ApplyVisaPage rendering...");

  try {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <ApplyPageContent />
      </Suspense>
    );
  } catch (error) {
    console.error("Error in ApplyVisaPage:", error);
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">페이지 로딩 오류</h1>
          <p className="text-red-500">{error.message}</p>
        </div>
      </div>
    );
  }
}
