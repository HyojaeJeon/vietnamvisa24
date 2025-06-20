"use client";

import React, { useState } from "react";
import { useSocket } from "../contexts/SocketContext";
import { Bell, X, BellRing, Trash, MoreVertical } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

/**
 * 실시간 알림을 표시하는 컴포넌트 - NotificationCenter 디자인에 맞춤
 */
const NotificationPanel = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, isConnected, networkStatus } = useSocket();

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all"); // all, unread
  const [showMenu, setShowMenu] = useState(false);

  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab === "unread") return !notification.read;
    return true;
  });

  const getNotificationIcon = (type) => {
    const iconMap = {
      new_application: "📋",
      application_status_change: "📋",
      workflow_progress: "⚡",
      document_reviewed: "📄",
      payment_status_change: "💳",
      consultation_reply: "💬",
      admin_notification: "👨‍💼",
      email_sent: "📧",
      payment_request: "💰",
      document_review: "📝",
      government_submission: "🏛️",
      visa_generated: "🎫",
      visa_email_sent: "📨",
      application_completed: "🎉",
      status_change: "📋",
    };
    return iconMap[type] || "🔔";
  };

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);

    // 신청서 관련 알림의 경우 해당 페이지로 이동
    if (notification.type === "new_application" && notification.data?.id) {
      window.open(`/dashboard/applications/${notification.data.id}`, "_blank");
    }
  };
  return (
    <div className="relative">
      {/* 알림 벨 아이콘 버튼 */}
      <button onClick={() => setIsOpen(!isOpen)} className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200" aria-label="알림">
        <Bell className="w-6 h-6 text-gray-600" />

        {/* 읽지 않은 알림 배지 */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-xs font-medium rounded-full flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}

        {/* 연결 상태 점 */}
        <span className={`absolute top-0 right-0 w-3 h-3 rounded-full border-2 border-white ${isConnected && networkStatus === "online" ? "bg-green-500" : "bg-red-500"}`} />
      </button>

      {/* 알림 패널 드롭다운 */}
      {isOpen && (
        <>
          {" "}
          {/* 배경 오버레이 */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} onKeyDown={(e) => e.key === "Escape" && setIsOpen(false)} role="button" tabIndex={0} aria-label="알림 패널 닫기" />
          {/* 알림 패널 */}
          <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
            {/* 헤더 */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
              <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-gray-100 rounded-md transition-colors duration-200">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* 탭 네비게이션 */}
            <div className="flex border-b border-gray-100">
              <button
                onClick={() => setActiveTab("all")}
                className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors duration-200 ${
                  activeTab === "all" ? "text-blue-600 border-blue-600" : "text-gray-500 border-transparent hover:text-gray-700"
                }`}
              >
                All notifications
              </button>
              <button
                onClick={() => setActiveTab("unread")}
                className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors duration-200 ${
                  activeTab === "unread" ? "text-blue-600 border-blue-600" : "text-gray-500 border-transparent hover:text-gray-700"
                }`}
              >
                Unread ({unreadCount})
              </button>
            </div>

            {/* 알림 목록 */}
            <div className="max-h-96 overflow-y-auto">
              {filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                    <Bell className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500 text-center">{activeTab === "unread" ? "읽지 않은 알림이 없습니다" : "알림이 없습니다"}</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-200 ${!notification.read ? "bg-blue-50" : ""}`}
                    >
                      <div className="flex items-start space-x-3">
                        {/* 아바타/아이콘 */}
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm">{getNotificationIcon(notification.type)}</span>
                          </div>
                        </div>

                        {/* 알림 내용 */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className={`text-sm ${!notification.read ? "font-semibold text-gray-900" : "font-medium text-gray-700"}`}>{notification.title}</p>
                              <p className="text-sm text-gray-600 mt-1">{notification.message}</p>

                              {/* 추가 데이터 표시 */}
                              {notification.data && (
                                <div className="mt-2 text-xs text-gray-500">
                                  {notification.type === "new_application" && (
                                    <span>
                                      신청번호: {notification.data.applicationId} • 신청자: {notification.data.firstName} {notification.data.lastName}
                                    </span>
                                  )}
                                  {notification.type === "application_status_change" && <span>신청번호: {notification.data.applicationNumber}</span>}
                                  {notification.type === "payment_status_change" && notification.data.payment && (
                                    <span>
                                      결제 금액: {notification.data.payment.amount} {notification.data.payment.currency}
                                    </span>
                                  )}
                                  {notification.type === "visa_generated" && notification.data.visaData && <span>비자 번호: {notification.data.visaData.visa_number}</span>}
                                </div>
                              )}

                              <p className="text-xs text-gray-400 mt-2">
                                {formatDistanceToNow(new Date(notification.timestamp), {
                                  addSuffix: true,
                                  locale: ko,
                                })}
                              </p>
                            </div>

                            {/* 읽지 않음 표시 점 */}
                            {!notification.read && <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 푸터 */}
            <div className="border-t border-gray-100 p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className={`w-2 h-2 rounded-full ${isConnected && networkStatus === "online" ? "bg-green-500" : "bg-red-500"}`} />
                  <span className="text-xs text-gray-500">{isConnected && networkStatus === "online" ? "실시간 연결됨" : "연결 끊김"}</span>
                </div>

                {/* 모든 알림 읽음 처리 버튼 */}
                {unreadCount > 0 && (
                  <button onClick={markAllAsRead} className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                    모두 읽음
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationPanel;
