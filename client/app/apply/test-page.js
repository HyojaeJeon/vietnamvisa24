"use client";

import React from "react";

export default function TestApplyPage() {
  console.log("TestApplyPage rendering...");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">테스트: 베트남 비자 신청</h1>
            <p className="text-gray-600 text-lg">ApplyPageContent 컴포넌트 테스트</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">디버깅 정보</h2>
            <div className="space-y-2 text-sm">
              <div>✅ 페이지 로딩 성공</div>
              <div>✅ React 렌더링 성공</div>
              <div>✅ Tailwind CSS 적용 성공</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
