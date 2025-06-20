"use client";

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useQuery, useMutation } from "@apollo/client";
import { setLanguage } from "../store/languageSlice";
import { logout } from "../store/authSlice";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Menu, User, LogOut, Bell, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { GET_USER_NOTIFICATIONS, GET_UNREAD_NOTIFICATIONS_COUNT } from "../lib/graphql/query/notifications";
import { 
  MARK_NOTIFICATION_AS_READ_MUTATION, 
  DELETE_NOTIFICATION_MUTATION,
  MARK_ALL_NOTIFICATIONS_AS_READ_MUTATION,
  DELETE_ALL_NOTIFICATIONS_MUTATION 
} from "../lib/graphql/mutation/notifications";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { currentLanguage } = useSelector((state) => state.language);
  const { isAuthenticated, user } = useSelector((state) => state.auth || {});
  const dispatch = useDispatch();
  const router = useRouter();

  // 알림 관련 GraphQL 쿼리 및 뮤테이션
  const { data: notificationsData, refetch: refetchNotifications } = useQuery(GET_USER_NOTIFICATIONS, {
    variables: { userId: user?.id?.toString() },
    skip: !isAuthenticated || !user?.id,
    pollInterval: 30000, // 30초마다 새로고침
  });

  const { data: unreadCountData, refetch: refetchUnreadCount } = useQuery(GET_UNREAD_NOTIFICATIONS_COUNT, {
    variables: { userId: user?.id?.toString() },
    skip: !isAuthenticated || !user?.id,
    pollInterval: 30000,
  });

  const [markAsRead] = useMutation(MARK_NOTIFICATION_AS_READ_MUTATION);
  const [deleteNotification] = useMutation(DELETE_NOTIFICATION_MUTATION);
  const [markAllAsRead] = useMutation(MARK_ALL_NOTIFICATIONS_AS_READ_MUTATION);
  const [deleteAllNotifications] = useMutation(DELETE_ALL_NOTIFICATIONS_MUTATION);

  const notifications = notificationsData?.getNotificationsByUser || [];
  const unreadCount = unreadCountData?.getUnreadNotificationsCount || 0;

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

  // 알림 관련 핸들러 함수들
  const handleNotificationClick = async (notification) => {
    try {
      // 읽지 않은 알림이면 읽음으로 표시
      if (notification.status === "unread") {
        await markAsRead({
          variables: { input: { notificationId: notification.id } }
        });
        refetchNotifications();
        refetchUnreadCount();
      }

      // 대상 URL로 이동
      if (notification.targetUrl) {
        router.push(notification.targetUrl);
      } else if (notification.relatedId) {
        // 기본 경로 설정 (비자 신청 상세 페이지)
        router.push(`/dashboard/applications/${notification.relatedId}`);
      }

      setShowNotifications(false);
    } catch (error) {
      console.error("알림 처리 오류:", error);
    }
  };

  const handleDeleteNotification = async (notificationId, e) => {
    e.stopPropagation();
    try {
      await deleteNotification({ variables: { id: notificationId } });
      refetchNotifications();
      refetchUnreadCount();
    } catch (error) {
      console.error("알림 삭제 오류:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead({ variables: { userId: user.id.toString() } });
      refetchNotifications();
      refetchUnreadCount();
    } catch (error) {
      console.error("모든 알림 읽음 처리 오류:", error);
    }
  };

  const handleDeleteAllNotifications = async () => {
    try {
      await deleteAllNotifications({ variables: { userId: user.id.toString() } });
      refetchNotifications();
      refetchUnreadCount();
    } catch (error) {
      console.error("모든 알림 삭제 오류:", error);
    }
  };

  const formatNotificationTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    // 1분 미만
    if (diff < 60000) {
      return '방금 전';
    }
    // 1시간 미만
    if (diff < 3600000) {
      return `${Math.floor(diff / 60000)}분 전`;
    }
    // 24시간 미만
    if (diff < 86400000) {
      return `${Math.floor(diff / 3600000)}시간 전`;
    }
    // 그 외는 날짜 표시
    return date.toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Don't render dynamic content until mounted (prevents hydration issues)
  if (!mounted) {
    return (
      <header className="bg-white py-4 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <a href="/" className="text-2xl font-bold text-blue-600">
              Vietnam Visa
            </a>
            <div className="hidden md:flex items-center space-x-5">
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
    <header className="bg-white py-4 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <a href="/" className="text-2xl font-bold text-blue-600">
            Vietnam Visa
          </a>
          <div className="hidden md:flex items-center space-x-5">
            {mounted && (
              <Select
                value={currentLanguage}
                onValueChange={handleLanguageChange}
              >
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

            {mounted && isAuthenticated ? (
              <div className="flex items-center space-x-3">
                {/* 알림 버튼 */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Bell size={20} />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center min-w-[20px]">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* 알림 드롭다운 */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 max-h-96 overflow-y-auto">
                      <div className="px-4 py-2 border-b border-gray-200 flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">알림</h3>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={handleMarkAllAsRead}
                            className="text-xs text-blue-600 hover:text-blue-800"
                            disabled={unreadCount === 0}
                          >
                            모두 읽음
                          </button>
                          <button
                            onClick={handleDeleteAllNotifications}
                            className="text-xs text-red-600 hover:text-red-800"
                          >
                            모두 삭제
                          </button>
                        </div>
                      </div>

                      {notifications.length === 0 ? (
                        <div className="px-4 py-8 text-center text-gray-500">
                          알림이 없습니다
                        </div>
                      ) : (
                        <div className="max-h-64 overflow-y-auto">
                          {notifications.map((notification) => (
                            <div
                              key={notification.id}
                              onClick={() => handleNotificationClick(notification)}
                              className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${
                                notification.status === 'unread' ? 'bg-blue-50' : ''
                              }`}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center space-x-2">
                                    <h4 className={`text-sm font-medium truncate ${
                                      notification.status === 'unread' ? 'text-blue-900' : 'text-gray-900'
                                    }`}>
                                      {notification.title}
                                    </h4>
                                    {notification.status === 'unread' && (
                                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                                    )}
                                  </div>
                                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                    {notification.message}
                                  </p>
                                  <p className="text-xs text-gray-400 mt-1">
                                    {formatNotificationTime(notification.createdAt)}
                                  </p>
                                </div>
                                <button
                                  onClick={(e) => handleDeleteNotification(notification.id, e)}
                                  className="ml-2 p-1 text-gray-400 hover:text-red-600 flex-shrink-0"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* 사용자 메뉴 */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <User size={18} />
                    <span>{user?.name || "사용자"}</span>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          router.push("/profile");
                        }}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                      >
                        <User size={16} />
                        <span>내 정보</span>
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                      >
                        <LogOut size={16} />
                        <span>로그아웃</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex space-x-3">
                <button
                  onClick={() => router.push("/login")}
                  className="px-6 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  로그인
                </button>
                <button
                  onClick={() => router.push("/register")}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  회원가입
                </button>
              </div>
            )}

            <button
              onClick={() => router.push("/dashboard/login")}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              관리자
            </button>
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="bg-gray-50 py-4">
          <div className="container mx-auto px-4">
            <div className="flex flex-col space-y-3">
              <Select
                value={currentLanguage}
                onValueChange={handleLanguageChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="ko">Korean</SelectItem>
                  <SelectItem value="vi">Vietnamese</SelectItem>
                </SelectContent>
              </Select>

              {isAuthenticated ? (
                <div className="space-y-2">
                  <div className="px-4 py-2 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600">로그인됨</p>
                    <p className="font-semibold text-blue-800">{user?.name}</p>
                  </div>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      router.push("/profile");
                    }}
                    className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <User size={18} />
                    <span>내 정보</span>
                  </button>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center space-x-2"
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
                    className="w-full text-left px-4 py-3 text-blue-600 font-semibold hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    로그인
                  </button>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      router.push("/register");
                    }}
                    className="w-full text-left px-4 py-3 bg-blue-600 text-white font-semibold hover:bg-blue-700 rounded-lg transition-colors"
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
                className="w-full text-left px-4 py-3 text-gray-600 font-semibold hover:bg-gray-50 rounded-lg transition-colors"
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
