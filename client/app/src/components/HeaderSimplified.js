"use client";

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setLanguage } from "../store/languageSlice";
import { logout } from "../store/authSlice";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Menu, User, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import NotificationCenterEnhanced from "./NotificationCenterEnhanced";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { currentLanguage } = useSelector((state) => state.language);
  const { isAuthenticated, user } = useSelector((state) => state.auth || {});
  const dispatch = useDispatch();
  const router = useRouter();

  // Check if component is mounted (client-side)
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLanguageChange = (value) => {
    dispatch(setLanguage(value));
  };

  const handleLogout = () => {
    dispatch(logout());
    setShowUserMenu(false);
    router.push("/");
  };

  // 알림 내비게이션 핸들러
  const handleNotificationNavigation = (url) => {
    router.push(url);
  };

  // Don't render dynamic content until mounted (prevents hydration issues)
  if (!mounted) {
    return (
      <header className="py-4 bg-white shadow-md">
        <div className="container px-4 mx-auto">
          <div className="flex items-center justify-between">
            <a href="/" className="text-2xl font-bold text-blue-600">
              Vietnam Visa
            </a>
            <div className="items-center hidden space-x-5 md:flex">
              {/* Placeholder content during SSR */}
              <div className="w-[120px] h-10 bg-gray-100 rounded animate-pulse"></div>
              <div className="w-20 h-10 bg-gray-100 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="py-4 bg-white shadow-md">
      <div className="container px-4 mx-auto">
        <div className="flex items-center justify-between">
          <a href="/" className="text-2xl font-bold text-blue-600">
            Vietnam Visa
          </a>

          <div className="items-center hidden space-x-5 md:flex">
            {/* 언어 선택 */}
            {mounted && (
              <Select value={currentLanguage} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="ko">Korean</SelectItem>
                  <SelectItem value="vi">Vietnamese</SelectItem>
                </SelectContent>
              </Select>
            )}

            {/* 인증된 사용자 메뉴 */}
            {mounted && isAuthenticated ? (
              <div className="flex items-center space-x-3">
                {/* 향상된 알림 센터 */}
                <NotificationCenterEnhanced
                  socketNotifications={[]}
                  isConnected={true}
                  onNavigate={handleNotificationNavigation}
                />

                {/* 사용자 메뉴 */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center px-4 py-2 space-x-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    <User size={18} />
                    <span>{user?.name || "사용자"}</span>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 z-50 w-48 py-2 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          router.push("/profile");
                        }}
                        className="flex items-center w-full px-4 py-2 space-x-2 text-left text-gray-700 hover:bg-gray-100"
                      >
                        <User size={16} />
                        <span>내 정보</span>
                      </button>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 space-x-2 text-left text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut size={16} />
                        <span>로그아웃</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* 로그인하지 않은 사용자 메뉴 */
              <div className="flex space-x-3">
                <button
                  onClick={() => router.push("/login")}
                  className="px-6 py-2 text-blue-600 transition-colors border border-blue-600 rounded-lg hover:bg-blue-50"
                >
                  로그인
                </button>
                <button
                  onClick={() => router.push("/register")}
                  className="px-6 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  회원가입
                </button>
              </div>
            )}

            {/* 관리자 로그인 버튼 */}
            <button
              onClick={() => router.push("/dashboard/login")}
              className="px-6 py-2 text-white transition-colors bg-gray-600 rounded-lg hover:bg-gray-700"
            >
              관리자
            </button>
          </div>

          {/* 모바일 메뉴 버튼 */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      {isMenuOpen && (
        <div className="py-4 bg-gray-50">
          <div className="container px-4 mx-auto">
            <div className="flex flex-col space-y-3">
              {/* 모바일 언어 선택 */}
              <Select value={currentLanguage} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="ko">Korean</SelectItem>
                  <SelectItem value="vi">Vietnamese</SelectItem>
                </SelectContent>
              </Select>

              {/* 모바일 사용자 메뉴 */}
              {isAuthenticated ? (
                <div className="space-y-2">
                  <div className="px-4 py-2 rounded-lg bg-blue-50">
                    <p className="text-sm text-gray-600">로그인됨</p>
                    <p className="font-semibold text-blue-800">{user?.name}</p>
                  </div>

                  {/* 모바일 알림 센터 */}
                  <div className="flex justify-center">
                    <NotificationCenterEnhanced
                      socketNotifications={[]}
                      isConnected={true}
                      onNavigate={handleNotificationNavigation}
                    />
                  </div>

                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      router.push("/profile");
                    }}
                    className="flex items-center w-full px-4 py-3 space-x-2 text-left text-gray-700 transition-colors rounded-lg hover:bg-gray-50"
                  >
                    <User size={18} />
                    <span>내 정보</span>
                  </button>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-3 space-x-2 text-left text-red-600 transition-colors rounded-lg hover:bg-red-50"
                  >
                    <LogOut size={18} />
                    <span>로그아웃</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      router.push("/login");
                    }}
                    className="w-full px-4 py-3 font-semibold text-left text-blue-600 transition-colors rounded-lg hover:bg-blue-50"
                  >
                    로그인
                  </button>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      router.push("/register");
                    }}
                    className="w-full px-4 py-3 font-semibold text-left text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    회원가입
                  </button>
                </div>
              )}

              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  router.push("/dashboard/login");
                }}
                className="w-full px-4 py-3 font-semibold text-left text-gray-600 transition-colors rounded-lg hover:bg-gray-50"
              >
                관리자 로그인
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
