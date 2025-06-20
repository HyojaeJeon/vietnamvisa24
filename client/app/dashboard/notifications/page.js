"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_ALL_NOTIFICATIONS_QUERY, MARK_NOTIFICATION_AS_READ_MUTATION, MARK_ALL_NOTIFICATIONS_AS_READ } from "@/lib/graphql";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Bell,
  Search,
  Filter,
  MoreHorizontal,
  CheckCheck, // 모든 읽음 처리 아이콘
  Eye,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Clock,
  Mail,
  MessageSquare,
  Calendar,
  User,
  Check, // 읽음 표시 아이콘 (MarkAsRead 대체)
} from "lucide-react";

export default function NotificationsManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const { data, loading, error, refetch } = useQuery(GET_ALL_NOTIFICATIONS_QUERY, {
    errorPolicy: "all",
  });
  const [markAsRead] = useMutation(MARK_NOTIFICATION_AS_READ_MUTATION);
  const [markAllAsRead] = useMutation(MARK_ALL_NOTIFICATIONS_AS_READ);

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
      case "APPLICATION_STATUS":
        return CheckCircle;
      case "PAYMENT_RECEIVED":
        return MessageSquare;
      case "DOCUMENT_REQUIRED":
        return AlertTriangle;
      case "SYSTEM":
        return Bell;
      default:
        return Bell;
    }
  };
  const getTypeColor = (type) => {
    switch (type) {
      case "APPLICATION_STATUS":
        return "bg-green-100 text-green-800";
      case "PAYMENT_RECEIVED":
        return "bg-blue-100 text-blue-800";
      case "DOCUMENT_REQUIRED":
        return "bg-orange-100 text-orange-800";
      case "SYSTEM":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "URGENT":
        return "border-l-4 border-red-500";
      case "HIGH":
        return "border-l-4 border-orange-500";
      case "NORMAL":
        return "border-l-4 border-blue-500";
      default:
        return "border-l-4 border-gray-300";
    }
  };
  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) || notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || notification.type === filterType;
    const matchesStatus = filterStatus === "all" || (filterStatus === "read" && notification.isRead) || (filterStatus === "unread" && !notification.isRead);
    return matchesSearch && matchesType && matchesStatus;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (loading) return <div className="p-6">로딩 중...</div>;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center text-3xl font-bold text-gray-900">
            <Bell className="w-8 h-8 mr-3" />
            알림 관리
            {unreadCount > 0 && <span className="px-3 py-1 ml-3 text-sm text-white bg-red-500 rounded-full">{unreadCount}</span>}
          </h1>
          <p className="mt-2 text-gray-600">시스템 알림과 고객 알림을 통합 관리합니다.</p>
        </div>
        {unreadCount > 0 && (
          <Button onClick={handleMarkAllAsRead} className="flex items-center text-white bg-blue-600 hover:bg-blue-700">
            <CheckCheck className="w-4 h-4 mr-2" />
            모두 읽음 처리
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">전체 알림</p>
                <p className="text-2xl font-bold">{notifications.length}</p>
              </div>
              <Bell className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">읽지 않음</p>
                <p className="text-2xl font-bold text-red-600">{unreadCount}</p>
              </div>
              <Mail className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">긴급 알림</p>
                <p className="text-2xl font-bold text-orange-600">{notifications.filter((n) => n.priority === "URGENT").length}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">오늘 알림</p>
                <p className="text-2xl font-bold">{notifications.filter((n) => new Date(n.createdAt).toDateString() === new Date().toDateString()).length}</p>
              </div>
              <Calendar className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="relative">
              <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
              <Input placeholder="알림 검색..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
            </div>{" "}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">모든 유형</option>
              <option value="APPLICATION_STATUS">신청 상태</option>
              <option value="PAYMENT_RECEIVED">결제 확인</option>
              <option value="DOCUMENT_REQUIRED">서류 요청</option>
              <option value="SYSTEM">시스템 알림</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">모든 상태</option>
              <option value="read">읽음</option>
              <option value="unread">읽지 않음</option>
            </select>
            <div className="flex items-center justify-end space-x-2">
              <Button variant="outline" className="flex items-center">
                <Filter className="w-4 h-4 mr-2" />
                필터 초기화
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => {
            const Icon = getNotificationIcon(notification.type);
            return (
              <Card key={notification.id} className={`${getPriorityColor(notification.priority)} ${!notification.is_read ? "bg-blue-50" : ""} hover:shadow-lg transition-shadow`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start flex-1 space-x-4">
                      <div className={`p-2 rounded-lg ${getTypeColor(notification.type)}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                          {!notification.is_read && <span className="px-2 py-1 text-xs text-white bg-blue-500 rounded-full">NEW</span>}
                        </div>
                        <p className="mt-1 text-gray-600">{notification.message}</p>
                        <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {new Date(notification.created_at).toLocaleString("ko-KR")}
                          </span>
                          <span className="flex items-center">
                            <User className="w-3 h-3 mr-1" />
                            {notification.recipient_type === "customer" ? "고객" : notification.recipient_type === "admin" ? "관리자" : "전체"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!notification.is_read && (
                        <Button size="sm" variant="outline" onClick={() => handleMarkAsRead(notification.id)} className="flex items-center">
                          <Check className="w-4 h-4 mr-1" />
                          읽음
                        </Button>
                      )}
                      <Button size="sm" variant="ghost">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <Bell className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500">알림이 없습니다.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
