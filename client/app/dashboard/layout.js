"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useQuery } from "@apollo/client";
import { Toaster } from "react-hot-toast";
import { GET_ME_QUERY } from "../src/lib/graphql/query/auth";
import {
  LayoutDashboard,
  FileText,
  Users,
  MessageSquare,
  BarChart3,
  CreditCard,
  CheckSquare,
  Eye,
  Settings,
  LogOut,
  Menu,
  X,
  Shield,
  Bell,
  FolderOpen,
  ChevronDown,
  Home,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import useSocket from "../src/hooks/useSocket";
import NotificationCenter from "../src/components/NotificationCenter";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const { data, loading, error } = useQuery(GET_ME_QUERY, {
    errorPolicy: "all",
  }); // User 기반 토큰/ID
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  const userId = data?.getMe?.id;

  const { isConnected, notifications, unreadCount, markNotificationAsRead, markAllNotificationsAsRead, removeNotification, clearAllNotifications } = useSocket(userId, token);

  // 화면 크기 감지
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  const menuItems = [
    {
      name: "대시보드",
      href: "/dashboard",
      icon: LayoutDashboard,
      active: pathname === "/dashboard",
      color: "text-blue-600",
    },
    {
      name: "비자 신청 관리",
      href: "/dashboard/applications",
      icon: FileText,
      active: pathname.startsWith("/dashboard/applications"),
      color: "text-green-600",
    },
    {
      name: "고객 상담",
      href: "/dashboard/consultations",
      icon: MessageSquare,
      active: pathname.startsWith("/dashboard/consultations"),
      color: "text-purple-600",
    },
    {
      name: "서류 관리",
      href: "/dashboard/documents",
      icon: FolderOpen,
      active: pathname.startsWith("/dashboard/documents"),
      color: "text-orange-600",
    },
    {
      name: "서비스 가격 관리",
      href: "/dashboard/services",
      icon: Sparkles,
      active: pathname.startsWith("/dashboard/services"),
      color: "text-emerald-600",
    },
    {
      name: "가격표 관리",
      href: "/dashboard/pricing",
      icon: CreditCard,
      active: pathname.startsWith("/dashboard/pricing"),
      color: "text-cyan-600",
    },
    {
      name: "알림 관리",
      href: "/dashboard/notifications",
      icon: Bell,
      active: pathname.startsWith("/dashboard/notifications"),
      color: "text-yellow-600",
    },
    {
      name: "유저 관리",
      href: "/dashboard/users",
      icon: Users,
      active: pathname.startsWith("/dashboard/users"),
      color: "text-indigo-600",
    },
    {
      name: "통계 및 리포트",
      href: "/dashboard/reports",
      icon: BarChart3,
      active: pathname.startsWith("/dashboard/reports"),
      color: "text-red-600",
    },
    {
      name: "결제 관리",
      href: "/dashboard/payments",
      icon: CreditCard,
      active: pathname.startsWith("/dashboard/payments"),
      color: "text-teal-600",
    },
    {
      name: "워크플로우",
      href: "/dashboard/workflows",
      icon: CheckSquare,
      active: pathname.startsWith("/dashboard/workflows"),
      color: "text-lime-600",
    },
    {
      name: "고객 화면",
      href: "/dashboard/customer-preview",
      icon: Eye,
      active: pathname.startsWith("/dashboard/customer-preview"),
      color: "text-pink-600",
    },
    {
      name: "시스템 설정",
      href: "/dashboard/settings",
      icon: Settings,
      active: pathname.startsWith("/dashboard/settings"),
      color: "text-gray-600",
    },
  ];
  // 로그아웃 핸들러 추가
  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("token"); // 기존 키도 제거
      localStorage.removeItem("user");
      localStorage.removeItem("autoLoginEmail");
      localStorage.removeItem("autoLoginPassword");
      localStorage.removeItem("autoLoginEnabled");
      // Redux store 초기화 (store가 전역에 있다면 dispatch)
      try {
        window.__REDUX_STORE__?.dispatch?.({ type: "auth/logout" });
      } catch (e) {}
      // Apollo 캐시 초기화 (window.__APOLLO_CLIENT__가 있다면)
      try {
        window.__APOLLO_CLIENT__?.clearStore?.();
        window.__APOLLO_CLIENT__?.resetStore?.();
      } catch (e) {}
      // 로그인 페이지로 이동
      window.location.replace("/login");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
          <p className="font-medium text-gray-600">시스템을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Mobile sidebar overlay */}
      {isMobile && sidebarOpen && <div className="fixed inset-0 z-40 transition-opacity duration-300 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <div
        className={`
        fixed lg:static inset-y-0 left-0 z-50
        ${sidebarOpen ? "w-72" : "w-0 lg:w-16"}
        bg-white shadow-2xl
        transform transition-all duration-300 ease-in-out
        ${isMobile ? (sidebarOpen ? "translate-x-0" : "-translate-x-full") : "translate-x-0"}
        border-r border-gray-200 overflow-hidden
      `}
      >
        {/* Sidebar header */}
        <div className={`relative flex items-center justify-between h-20 px-4 bg-gradient-to-r from-blue-600 to-indigo-700 ${!sidebarOpen && !isMobile ? "px-2" : ""}`}>
          {sidebarOpen && (
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="flex items-center justify-center w-12 h-12 bg-white shadow-lg rounded-xl">
                  <Shield className="text-blue-600 h-7 w-7" />
                </div>
                <div className="absolute w-4 h-4 bg-green-500 border-2 border-white rounded-full -top-1 -right-1"></div>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">VietnamVisa</h2>
                <p className="text-sm font-medium text-blue-100">대시보드 시스템</p>
              </div>
            </div>
          )}

          {!sidebarOpen && !isMobile && (
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-white shadow-lg rounded-xl">
              <Shield className="text-blue-600 h-7 w-7" />
            </div>
          )}

          {/* Desktop toggle button */}
          {!isMobile && (
            <button onClick={toggleSidebar} className="p-2 text-white transition-colors rounded-lg hover:bg-white/20">
              {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </button>
          )}

          {/* Mobile close button */}
          {isMobile && (
            <button onClick={() => setSidebarOpen(false)} className="p-2 text-white transition-colors rounded-lg hover:bg-white/20">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>{" "}
        {/* User info */}
        {data?.getMe && sidebarOpen && (
          <div className="px-6 py-6 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="flex items-center justify-center shadow-lg w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                  <span className="text-lg font-bold text-white">{data.getMe.name.charAt(0)}</span>
                </div>
                <div className="absolute -bottom-1 -right-1">
                  <Sparkles className="w-5 h-5 text-yellow-500" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-lg font-bold text-gray-900">{data.getMe.name}</p>
                <p className="mb-2 text-sm text-gray-600">{data.getMe.email}</p>
                <span
                  className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${
                    data.getMe.role === "SUPER_ADMIN"
                      ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                      : data.getMe.role === "MANAGER"
                      ? "bg-blue-100 text-blue-800 border border-blue-200"
                      : "bg-green-100 text-green-800 border border-green-200"
                  }`}
                >
                  {data.getMe.role === "SUPER_ADMIN" ? "최고권한" : data.getMe.role === "MANAGER" ? "매니저" : "스태프"}
                </span>
              </div>
            </div>
          </div>
        )}
        {/* Collapsed user info */}
        {data?.getMe && !sidebarOpen && !isMobile && (
          <div className="px-2 py-4 border-b border-gray-200">
            <div className="flex justify-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg shadow-lg bg-gradient-to-br from-blue-500 to-indigo-600">
                <span className="text-sm font-bold text-white">{data.getMe.name.charAt(0)}</span>
              </div>
            </div>
          </div>
        )}
        {/* Navigation */}
        <nav className={`flex-1 py-6 space-y-2 overflow-y-auto ${sidebarOpen ? "px-4" : "px-2"}`}>
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.name}
                onClick={() => {
                  router.push(item.href);
                  if (isMobile) setSidebarOpen(false);
                }}
                className={`w-full group flex items-center text-sm font-medium rounded-xl transition-all duration-200 ${sidebarOpen ? "px-4 py-3" : "px-3 py-3 justify-center"} ${
                  item.active
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transform scale-[1.02]"
                    : "text-gray-700 hover:bg-gradient-to-r hover:from-gray-100 hover:to-blue-50 hover:text-blue-700"
                }`}
                title={!sidebarOpen ? item.name : ""}
              >
                <IconComponent className={`h-5 w-5 transition-colors ${sidebarOpen ? "mr-3" : ""} ${item.active ? "text-white" : item.color + " group-hover:text-blue-600"}`} />
                {sidebarOpen && (
                  <>
                    <span className="font-medium">{item.name}</span>
                    {item.active && (
                      <div className="ml-auto">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </nav>
        {/* Logout button */}
        <div className={`border-t border-gray-200 bg-gray-50 ${sidebarOpen ? "p-4" : "p-2"}`}>
          <button
            onClick={handleLogout}
            className={`w-full flex items-center text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 group ${
              sidebarOpen ? "px-4 py-3" : "px-3 py-3 justify-center"
            }`}
            title={!sidebarOpen ? "로그아웃" : ""}
          >
            <LogOut className={`h-5 w-5 text-gray-500 group-hover:text-red-600 transition-colors ${sidebarOpen ? "mr-3" : ""}`} />
            {sidebarOpen && <span className="font-medium">로그아웃</span>}
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${!isMobile && !sidebarOpen ? "ml-0" : ""}`}>
        {/* Top bar */}
        <div className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 border-b border-gray-200 shadow-sm bg-white/90 backdrop-blur-md">
          <div className="flex items-center space-x-4">
            <button onClick={toggleSidebar} className="p-2 text-gray-500 transition-all rounded-lg hover:text-gray-700 hover:bg-gray-100">
              <Menu className="w-5 h-5" />
            </button>

            <div className="items-center hidden space-x-2 lg:flex">
              <Home className="w-4 h-4 text-gray-400" />
              <ChevronDown className="h-4 w-4 text-gray-400 rotate-[-90deg]" />
              <span className="text-sm font-medium text-gray-600">{menuItems.find((item) => item.active)?.name || "대시보드"}</span>
            </div>
          </div>{" "}
          <div className="flex items-center space-x-4">
            <NotificationCenter
              notifications={notifications}
              unreadCount={unreadCount}
              isConnected={isConnected}
              onMarkAsRead={markNotificationAsRead}
              onMarkAllAsRead={markAllNotificationsAsRead}
              onRemove={removeNotification}
              onClear={clearAllNotifications}
            />

            <div className="hidden px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded-lg sm:block">
              {new Date().toLocaleDateString("ko-KR", {
                month: "short",
                day: "numeric",
                weekday: "short",
              })}
            </div>
          </div>
        </div>{" "}
        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>

      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            duration: 3000,
            theme: {
              primary: "green",
              secondary: "black",
            },
          },
        }}
      />
    </div>
  );
}
