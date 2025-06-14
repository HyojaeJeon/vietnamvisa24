import React, { useState } from "react";
import { Bell, X, Check, CheckCheck, Trash2, Eye } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

/**
 * 실시간 알림을 표시하는 컴포넌트
 */
const NotificationCenter = ({ notifications, unreadCount, isConnected, onMarkAsRead, onMarkAllAsRead, onRemove, onClear }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState("all"); // all, unread, read

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "unread") return !notification.isRead;
    if (filter === "read") return notification.isRead;
    return true;
  });

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
      {/* 알림 버튼 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg"
        aria-label="알림"
      >
        <Bell className="w-6 h-6" />

        {/* 연결 상태 표시 */}
        <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`} />

        {/* 읽지 않은 알림 카운트 */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* 알림 패널 */}
      {isOpen && (
        <div className="absolute right-0 z-50 w-96 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
          {/* 헤더 */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-semibold text-gray-900">알림</h3>
              <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`} />
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 필터 및 액션 */}
          <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
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
          <div className="max-h-96 overflow-y-auto">
            {filteredNotifications.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <Bell className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">{filter === "unread" ? "읽지 않은 알림이 없습니다" : filter === "read" ? "읽은 알림이 없습니다" : "알림이 없습니다"}</p>
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

                        <p className={`mt-1 text-sm ${notification.isRead ? "text-gray-500" : "text-gray-700"}`}>{notification.message}</p>

                        {/* 타임스탬프 */}
                        <p className="mt-1 text-xs text-gray-400">
                          {formatDistanceToNow(new Date(notification.timestamp), {
                            addSuffix: true,
                            locale: ko,
                          })}
                        </p>

                        {/* 추가 데이터 (있는 경우) */}
                        {notification.data && (
                          <div className="mt-2 p-2 bg-gray-100 rounded text-xs text-gray-600">
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
          </div>

          {/* 푸터 (연결 상태) */}
          <div className="p-3 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
              <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`} />
              <span>{isConnected ? "실시간 연결됨" : "연결 끊김"}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
