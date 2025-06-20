"use client";

import React, { useState, useEffect } from "react";
import { useMutation, gql } from "@apollo/client";
import useSocket from "../../src/hooks/useSocket";
import NotificationCenterEnhanced from "../../src/components/NotificationCenterEnhanced";
import { Button } from "../../src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../src/components/ui/card";

const UPDATE_APPLICATION_STATUS = gql`
  mutation UpdateApplicationStatus($id: ID!, $status: ApplicationStatus!) {
    updateApplicationStatus(id: $id, status: $status) {
      id
      status
      application_number
      full_name
      updated_at
    }
  }
`;

const CREATE_VISA_APPLICATION = gql`
  mutation CreateVisaApplication($input: VisaApplicationInput!) {
    createVisaApplication(input: $input) {
      id
      application_number
      status
      full_name
      email
      created_at
    }
  }
`;

export default function SocketTestPage() {
  const [testUserId] = useState("test-user-123");
  const [testToken] = useState("test-token-456");
  const [applicationId, setApplicationId] = useState("1");

  // Socket 연결
  const { isConnected, notifications, unreadCount, markNotificationAsRead, markAllNotificationsAsRead, removeNotification, clearAllNotifications } = useSocket(testUserId, testToken);

  // GraphQL mutations
  const [updateStatus] = useMutation(UPDATE_APPLICATION_STATUS);
  const [createApplication] = useMutation(CREATE_VISA_APPLICATION);

  const handleStatusUpdate = async (newStatus) => {
    try {
      const result = await updateStatus({
        variables: {
          id: applicationId,
          status: newStatus,
        },
      });
      console.log("Status updated:", result.data);
    } catch (error) {
      console.error("Status update error:", error);
    }
  };

  const handleCreateApplication = async () => {
    try {
      const result = await createApplication({
        variables: {
          input: {
            full_name: "테스트 사용자",
            email: "test@example.com",
            phone: "010-1234-5678",
            passport_number: "T123456789",
            visa_type: "E-VISA",
            purpose_of_visit: "관광",
            arrival_date: "2024-07-15",
            departure_date: "2024-07-25",
            nationality: "대한민국",
          },
        },
      });
      console.log("Application created:", result.data);
      if (result.data?.createVisaApplication?.id) {
        setApplicationId(result.data.createVisaApplication.id);
      }
    } catch (error) {
      console.error("Application creation error:", error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header with notification center */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Socket.IO 실시간 알림 테스트</h1>{" "}
        <NotificationCenterEnhanced
          socketNotifications={notifications}
          unreadCount={unreadCount}
          isConnected={isConnected}
          onMarkAsRead={markNotificationAsRead}
          onMarkAllAsRead={markAllNotificationsAsRead}
          onRemove={removeNotification}
          onClear={clearAllNotifications}
        />
      </div>

      {/* Connection status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`} />
            <span>연결 상태</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p>
              <strong>상태:</strong> {isConnected ? "연결됨" : "연결 안됨"}
            </p>
            <p>
              <strong>사용자 ID:</strong> {testUserId}
            </p>
            <p>
              <strong>읽지 않은 알림:</strong> {unreadCount}개
            </p>
            <p>
              <strong>전체 알림:</strong> {notifications.length}개
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Test controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Application creation */}
        <Card>
          <CardHeader>
            <CardTitle>신청서 생성 테스트</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">새로운 비자 신청서를 생성하고 워크플로우를 시작합니다.</p>
            <Button onClick={handleCreateApplication} className="w-full">
              테스트 신청서 생성
            </Button>
          </CardContent>
        </Card>

        {/* Status updates */}
        <Card>
          <CardHeader>
            <CardTitle>상태 변경 테스트</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">신청서 ID:</label>
              <input type="text" value={applicationId} onChange={(e) => setApplicationId(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md" placeholder="신청서 ID 입력" />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button onClick={() => handleStatusUpdate("PROCESSING")} variant="outline" size="sm">
                처리 중
              </Button>
              <Button onClick={() => handleStatusUpdate("DOCUMENT_REVIEW")} variant="outline" size="sm">
                서류 검토
              </Button>
              <Button onClick={() => handleStatusUpdate("SUBMITTED_TO_AUTHORITY")} variant="outline" size="sm">
                기관 제출
              </Button>
              <Button onClick={() => handleStatusUpdate("APPROVED")} variant="outline" size="sm" className="bg-green-50 hover:bg-green-100">
                승인
              </Button>
              <Button onClick={() => handleStatusUpdate("REJECTED")} variant="outline" size="sm" className="bg-red-50 hover:bg-red-100">
                거절
              </Button>
              <Button onClick={() => handleStatusUpdate("COMPLETED")} variant="outline" size="sm" className="bg-blue-50 hover:bg-blue-100">
                완료
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notification history */}
      <Card>
        <CardHeader>
          <CardTitle>알림 기록</CardTitle>
        </CardHeader>
        <CardContent>
          {notifications.length === 0 ? (
            <p className="text-gray-500 text-center py-8">아직 알림이 없습니다.</p>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {notifications.map((notification) => (
                <div key={notification.id} className={`p-3 rounded-lg border ${notification.isRead ? "bg-gray-50 border-gray-200" : "bg-blue-50 border-blue-200"}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{notification.title}</p>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-2">{new Date(notification.timestamp).toLocaleString("ko-KR")}</p>
                    </div>
                    {!notification.isRead && <div className="w-2 h-2 bg-blue-500 rounded-full ml-3 mt-1" />}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
