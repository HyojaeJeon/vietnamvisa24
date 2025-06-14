"use client";

import { useState } from "react";
import ProtectedRoute from "../../../app/src/components/auth/ProtectedRoute";
import PricingManagement from "./PricingManagement";

export default function PricingPage() {
  return (
    <ProtectedRoute requiredRole="ADMIN">
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow">
          <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">가격표 관리</h1>
                <p className="mt-2 text-sm text-gray-600">E-VISA, Visa Run, Fast Track 서비스의 가격을 관리합니다.</p>
              </div>
            </div>
          </div>
        </div>

        <main className="py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <PricingManagement />
        </main>
      </div>
    </ProtectedRoute>
  );
}
