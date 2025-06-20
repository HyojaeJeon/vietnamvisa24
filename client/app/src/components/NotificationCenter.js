import React, { useState, useEffect, useRef, useCallback } from "react";
import { Bell, X, Check, CheckCheck, Trash2, Eye } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { useQuery } from "@apollo/client";
import { GET_NOTIFICATIONS } from "../lib/graphql/query/notifications";

/**
 * 실시간 알림을 표시하는 컴포넌트
 */
const NotificationCenter = ({ notifications, unreadCount, isConnected, onMarkAsRead, onMarkAllAsRead, onRemove, onClear }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState("all"); // all, unread, read

  // 연결 상태 디버깅
  useEffect(() => {
    console.log("🔔 NotificationCenter - Connection state:", {
      isConnected,
      notificationsCount: notifications?.length || 0,
      unreadCount,
    });
  }, [isConnected, notifications, unreadCount]);

  const filteredNotifications = notifications?.filter((notification) => {
    if (filter === "unread") return !notification.isRead;
    if (filter === "read") return notification.isRead;
    return true;
  });

  const getEmptyMessage = () => {
    if (filter === "unread") return "읽지 않은 알림이 없습니다";
    if (filter === "read") return "읽은 알림이 없습니다";
    return "알림이 없습니다";
  };

  const getNotificationIcon = (type) => {
    const iconMap = {
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
    };
    return iconMap[type] || "🔔";
  };

  const getNotificationColor = (type, isRead) => {
    if (isRead) return "bg-gray-50 border-gray-200";

    const colorMap = {
      application_status_change: "bg-blue-50 border-blue-200",
      workflow_progress: "bg-purple-50 border-purple-200",
      document_reviewed: "bg-green-50 border-green-200",
      payment_status_change: "bg-yellow-50 border-yellow-200",
      consultation_reply: "bg-indigo-50 border-indigo-200",
      admin_notification: "bg-red-50 border-red-200",
      email_sent: "bg-blue-50 border-blue-200",
      payment_request: "bg-orange-50 border-orange-200",
      government_submission: "bg-green-50 border-green-200",
      visa_generated: "bg-emerald-50 border-emerald-200",
      application_completed: "bg-green-50 border-green-200",
    };
    return colorMap[type] || "bg-gray-50 border-gray-200";
  };

  return (
    <div className="relative">
      {" "}
      {/* 알림 버튼 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 transition-colors rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-label="알림"
        title={isConnected ? "실시간 연결됨" : "연결 끊김"}
      >
        {/* 종 아이콘 - 연결 상태에 따라 색상 변경 */}
        <Bell className={`w-6 h-6 ${isConnected ? "text-green-600" : "text-red-500"}`} />

        {/* 읽지 않은 알림 개수 배지 */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 inline-flex items-center justify-center min-w-[20px] h-5 text-xs font-bold text-white bg-red-500 rounded-full px-1">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>
      {/* 알림 패널 */}
      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg w-96">
          {" "}
          {/* 헤더 */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <h3 className="text-lg font-semibold text-gray-900">알림</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
          {/* 필터 및 액션 */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex space-x-2">
              <button onClick={() => setFilter("all")} className={`px-3 py-1 text-sm rounded-md ${filter === "all" ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:text-gray-900"}`}>
                전체
              </button>
              <button onClick={() => setFilter("unread")} className={`px-3 py-1 text-sm rounded-md ${filter === "unread" ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:text-gray-900"}`}>
                읽지 않음 ({unreadCount})
              </button>
              <button onClick={() => setFilter("read")} className={`px-3 py-1 text-sm rounded-md ${filter === "read" ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:text-gray-900"}`}>
                읽음
              </button>
            </div>

            <div className="flex space-x-1">
              {unreadCount > 0 && (
                <button onClick={onMarkAllAsRead} className="p-1 text-gray-400 hover:text-gray-600" title="모두 읽음으로 표시">
                  <CheckCheck className="w-4 h-4" />
                </button>
              )}
              <button onClick={onClear} className="p-1 text-gray-400 hover:text-red-600" title="모든 알림 삭제">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          {/* 알림 목록 */}
          <div className="overflow-y-auto max-h-96">
            {" "}
            {filteredNotifications.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <Bell className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">{getEmptyMessage()}</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredNotifications.map((notification) => (
                  <div key={notification.id} className={`p-4 hover:bg-gray-50 transition-colors ${getNotificationColor(notification.type, notification.isRead)}`}>
                    <div className="flex items-start space-x-3">
                      {/* 아이콘 */}
                      <div className="flex-shrink-0 mt-1">
                        <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                      </div>

                      {/* 내용 */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className={`text-sm font-medium ${notification.isRead ? "text-gray-600" : "text-gray-900"}`}>{notification.title}</p>

                          {/* 액션 버튼들 */}
                          <div className="flex space-x-1">
                            {!notification.isRead && (
                              <button onClick={() => onMarkAsRead(notification.id)} className="p-1 text-gray-400 hover:text-blue-600" title="읽음으로 표시">
                                <Eye className="w-3 h-3" />
                              </button>
                            )}
                            <button onClick={() => onRemove(notification.id)} className="p-1 text-gray-400 hover:text-red-600" title="삭제">
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        <p className={`mt-1 text-sm ${notification.isRead ? "text-gray-500" : "text-gray-700"}`}>{notification.message}</p> {/* 타임스탬프 */}
                        <p className="mt-1 text-xs text-gray-400">
                          {(() => {
                            const dateValue = notification.timestamp || notification.createdAt;
                            const date = new Date(dateValue);

                            // 유효한 날짜인지 확인
                            if (isNaN(date.getTime())) {
                              return "날짜 정보 없음";
                            }

                            return formatDistanceToNow(date, {
                              addSuffix: true,
                              locale: ko,
                            });
                          })()}
                        </p>
                        {/* 추가 데이터 (있는 경우) */}
                        {notification.data && (
                          <div className="p-2 mt-2 text-xs text-gray-600 bg-gray-100 rounded">
                            {notification.type === "application_status_change" && <p>신청번호: {notification.data.applicationNumber}</p>}
                            {notification.type === "payment_status_change" && notification.data.payment && (
                              <p>
                                결제 금액: {notification.data.payment.amount} {notification.data.payment.currency}
                              </p>
                            )}
                            {notification.type === "visa_generated" && notification.data.visaData && <p>비자 번호: {notification.data.visaData.visa_number}</p>}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>{" "}
          {/* 푸터 (총 알림 수) */}
          <div className="p-3 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
              <span>총 {notifications?.length}개의 알림</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
