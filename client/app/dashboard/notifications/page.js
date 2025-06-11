"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  GET_ALL_NOTIFICATIONS_QUERY,
  MARK_NOTIFICATION_AS_READ_MUTATION,
  MARK_ALL_NOTIFICATIONS_AS_READ,
} from "../../src/lib/graphql";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../src/components/ui/card";
import { Button } from "../../src/components/ui/button";
import { Input } from "../../src/components/ui/input";
import {
  Bell,
  Search,
  Filter,
  MoreHorizontal,
  CheckCheck,
  Eye,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Clock,
  Mail,
  MessageSquare,
  Calendar,
  User,
  Check,
} from "lucide-react";

export default function NotificationsManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const { data, loading, error, refetch } = useQuery(
    GET_ALL_NOTIFICATIONS_QUERY,
    {
      errorPolicy: "all",
    },
  );
  const [markAsRead] = useMutation(MARK_NOTIFICATION_AS_READ_MUTATION);
  const [markAllAsRead] = useMutation(MARK_ALL_NOTIFICATIONS_AS_READ);

  // Use real data from backend or fallback to mock data
  const notifications = data?.getAllNotifications || [
    {
      id: 1,
      type: "application_status",
      title: "비자 신청 상태 변경",
      message: "김민수님의 E-visa 신청이 승인되었습니다.",
      recipient_type: "customer",
      recipient_id: "user_123",
      is_read: false,
      created_at: "2024-01-16T14:30:00Z",
      priority: "normal",
    },
    {
      id: 2,
      type: "payment_received",
      title: "결제 확인",
      message: "이영희님으로부터 Business Visa 수수료 입금이 확인되었습니다.",
      recipient_type: "admin",
      recipient_id: "admin_456",
      is_read: true,
      created_at: "2024-01-16T12:15:00Z",
      priority: "high",
    },
    {
      id: 3,
      type: "document_required",
      title: "서류 보완 요청",
      message: "박철수님의 노동허가서 신청에 추가 서류가 필요합니다.",
      recipient_type: "customer",
      recipient_id: "user_789",
      is_read: false,
      created_at: "2024-01-16T10:45:00Z",
      priority: "urgent",
    },
    {
      id: 4,
      type: "system_alert",
      title: "시스템 점검 안내",
      message: "2024년 1월 17일 새벽 2시부터 4시까지 시스템 점검이 진행됩니다.",
      recipient_type: "all",
      recipient_id: null,
      is_read: false,
      created_at: "2024-01-15T18:00:00Z",
      priority: "normal",
    },
  ];

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markAsRead({
        variables: { id: notificationId },
      });
      refetch();
    } catch (error) {
      console.error("알림 읽음 처리 오류:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      refetch();
    } catch (error) {
      console.error("모든 알림 읽음 처리 오류:", error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "application_status":
        return CheckCircle;
      case "payment_received":
        return MessageSquare;
      case "document_required":
        return AlertTriangle;
      case "system_alert":
        return Bell;
      default:
        return Bell;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "application_status":
        return "bg-green-100 text-green-800";
      case "payment_received":
        return "bg-blue-100 text-blue-800";
      case "document_required":
        return "bg-orange-100 text-orange-800";
      case "system_alert":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "urgent":
        return "border-l-4 border-red-500";
      case "high":
        return "border-l-4 border-orange-500";
      case "normal":
        return "border-l-4 border-blue-500";
      default:
        return "border-l-4 border-gray-300";
    }
  };

  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType =
      filterType === "all" || notification.type === filterType;
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "read" && notification.is_read) ||
      (filterStatus === "unread" && !notification.is_read);
    return matchesSearch && matchesType && matchesStatus;
  });

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  if (loading) return <div className="p-6">로딩 중...</div>;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Bell className="h-8 w-8 mr-3" />
            알림 관리
            {unreadCount > 0 && (
              <span className="ml-3 px-3 py-1 bg-red-500 text-white text-sm rounded-full">
                {unreadCount}
              </span>
            )}
          </h1>
          <p className="text-gray-600 mt-2">
            시스템 알림과 고객 알림을 통합 관리합니다.
          </p>
        </div>
        <div className="flex space-x-3">
          <Button
            onClick={handleMarkAllAsRead}
            className="bg-green-600 hover:bg-green-700"
          >
            <Check className="h-4 w-4 mr-2" />
            모두 읽음 처리
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="알림 제목이나 내용으로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex space-x-3">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">모든 유형</option>
                <option value="application_status">신청 상태</option>
                <option value="payment_received">결제 확인</option>
                <option value="document_required">서류 요청</option>
                <option value="system_alert">시스템 알림</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">모든 상태</option>
                <option value="unread">읽지 않음</option>
                <option value="read">읽음</option>
              </select>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                필터
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.map((notification) => {
          const NotificationIcon = getNotificationIcon(notification.type);

          return (
            <Card
              key={notification.id}
              className={`hover:shadow-lg transition-shadow ${getPriorityColor(notification.priority)} ${
                !notification.is_read ? "bg-blue-50" : ""
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <NotificationIcon className="h-6 w-6 text-white" />
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-center space-x-3">
                        <h3
                          className={`text-lg font-semibold ${
                            !notification.is_read
                              ? "text-gray-900"
                              : "text-gray-600"
                          }`}
                        >
                          {notification.title}
                        </h3>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(notification.type)}`}
                        >
                          {notification.type === "application_status"
                            ? "신청 상태"
                            : notification.type === "payment_received"
                              ? "결제 확인"
                              : notification.type === "document_required"
                                ? "서류 요청"
                                : "시스템 알림"}
                        </span>
                        {notification.priority === "urgent" && (
                          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                            긴급
                          </span>
                        )}
                        {notification.priority === "high" && (
                          <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">
                            중요
                          </span>
                        )}
                        {!notification.is_read && (
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        )}
                      </div>

                      <p className="text-gray-700 leading-relaxed">
                        {notification.message}
                      </p>

                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>
                            {notification.recipient_type === "customer"
                              ? "고객"
                              : notification.recipient_type === "admin"
                                ? "관리자"
                                : "전체"}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {new Date(notification.created_at).toLocaleString(
                              "ko-KR",
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2">
                    {!notification.is_read && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMarkAsRead(notification.id)}
                      >
                        <CheckCheck className="h-4 w-4 mr-1" />
                        읽음
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      상세
                    </Button>
                    <Button variant="outline" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredNotifications.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">조건에 맞는 알림이 없습니다.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
