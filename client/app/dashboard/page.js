"use client";

import React from "react";
import { useQuery, useSubscription } from "@apollo/client";
import { GET_APPLICATION_STATUS_COUNTS, APPLICATION_STATUS_COUNTS_UPDATED_SUBSCRIPTION } from "../src/lib/graphql/query/applications";
import { Card, CardContent, CardHeader, CardTitle } from "../src/components/ui/card";
import { FileText, Users, DollarSign, AlertTriangle, CheckCircle, TrendingUp, Calendar, Eye, AlertCircle, Activity, BarChart3 } from "lucide-react";

export default function Dashboard() {
  // 실시간 상태 카운트 데이터 조회
  const {
    data: statusCountsData,
    loading: statusCountsLoading,
    refetch: refetchStatusCounts,
  } = useQuery(GET_APPLICATION_STATUS_COUNTS, {
    errorPolicy: "all",
    fetchPolicy: "cache-and-network",
  });

  // 실시간 상태 카운트 변경 구독
  useSubscription(APPLICATION_STATUS_COUNTS_UPDATED_SUBSCRIPTION, {
    onSubscriptionData: ({ subscriptionData }) => {
      console.log("📊 상태 카운트 업데이트:", subscriptionData.data?.applicationStatusCountsUpdated);
      if (subscriptionData.data?.applicationStatusCountsUpdated) {
        // 상태 카운트 새로고침
        refetchStatusCounts();
      }
    },
    onError: (error) => {
      console.error("❌ APPLICATION_STATUS_COUNTS_UPDATED 구독 오류:", error);
    },
  });

  // 실제 상태 카운트 데이터 (GraphQL에서 가져온 데이터 또는 기본값)
  const realStatusCounts = statusCountsData?.applicationStatusCounts || {
    pending: 0,
    processing: 0,
    document_review: 0,
    submitted_to_authority: 0,
    approved: 0,
    completed: 0,
    total: 0,
  };

  // 상태 데이터를 UI 형식으로 변환
  const statusData = [
    {
      status: "신청 접수",
      count: realStatusCounts.pending,
      color: "bg-blue-500",
      key: "pending",
    },
    {
      status: "서류 검토 중",
      count: realStatusCounts.document_review,
      color: "bg-yellow-500",
      key: "document_review",
    },
    {
      status: "기관 제출",
      count: realStatusCounts.submitted_to_authority,
      color: "bg-purple-500",
      key: "submitted_to_authority",
    },
    {
      status: "승인 완료",
      count: realStatusCounts.approved,
      color: "bg-emerald-500",
      key: "approved",
    },
    {
      status: "발급 완료",
      count: realStatusCounts.completed,
      color: "bg-green-500",
      key: "completed",
    },
  ];
  const todayStats = [
    {
      id: "new-applications",
      title: "신규 신청",
      value: "12",
      subtitle: "E-visa: 8건, 장기비자: 4건",
      icon: FileText,
      color: "bg-blue-500",
      change: "+15%",
      changeType: "increase",
    },
    {
      id: "new-consultations",
      title: "신규 상담 문의",
      value: "8",
      subtitle: "전화: 5건, 채팅: 3건",
      icon: Users,
      color: "bg-green-500",
      change: "+8%",
      changeType: "increase",
    },
    {
      id: "completed-today",
      title: "처리 완료",
      value: "25",
      subtitle: "승인: 23건, 반려: 2건",
      icon: CheckCircle,
      color: "bg-purple-500",
      change: "+12%",
      changeType: "increase",
    },
    {
      id: "expected-revenue",
      title: "예상 매출",
      value: "₩2,450,000",
      subtitle: "이번 달 누적",
      icon: DollarSign,
      color: "bg-orange-500",
      change: "+18%",
      changeType: "increase",
    },
  ];

  // Mock urgent actions
  const urgentActions = [
    {
      id: 1,
      type: "document_required",
      title: "서류 보완 요청 후 미제출",
      customer: "김○○",
      visa_type: "E-visa",
      days_overdue: 3,
      priority: "high",
    },
    {
      id: 2,
      type: "deadline_approaching",
      title: "마감 임박",
      customer: "이○○",
      visa_type: "노동허가서",
      days_left: 1,
      priority: "urgent",
    },
    {
      id: 3,
      type: "express_request",
      title: "긴급 발급 신청",
      customer: "박○○",
      visa_type: "Business visa",
      hours_left: 6,
      priority: "urgent",
    },
  ];

  // Mock recent activities
  const recentActivities = [
    {
      id: 1,
      action: "고객 김○○, E-visa 신청 접수",
      time: "5분 전",
      type: "application",
    },
    {
      id: 2,
      action: "고객 이○○, 노동허가서 '기관 제출'로 상태 변경",
      time: "12분 전",
      type: "status_change",
    },
    {
      id: 3,
      action: "고객 박○○, 서류 업로드 완료",
      time: "18분 전",
      type: "document",
    },
    {
      id: 4,
      action: "고객 최○○, Business visa 승인 완료",
      time: "25분 전",
      type: "approval",
    },
    {
      id: 5,
      action: "고객 정○○, 상담 문의 접수",
      time: "32분 전",
      type: "consultation",
    },
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "urgent":
        return "border-red-500 bg-red-50";
      case "high":
        return "border-orange-500 bg-orange-50";
      default:
        return "border-gray-200 bg-white";
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case "application":
        return <FileText className="w-4 h-4 text-blue-500" />;
      case "status_change":
        return <Activity className="w-4 h-4 text-purple-500" />;
      case "document":
        return <Eye className="w-4 h-4 text-green-500" />;
      case "approval":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "consultation":
        return <Users className="w-4 h-4 text-orange-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">안녕하세요, 관리자님! 👋</h1>
        <p className="mt-2 text-gray-600">오늘도 베트남 비자 서비스 운영을 위해 수고하고 계시네요.</p>
      </div>

      {/* Today's Summary */}
      <div>
        <h2 className="flex items-center mb-4 text-xl font-semibold text-gray-900">
          <Calendar className="w-5 h-5 mr-2" />
          오늘의 현황
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {" "}
          {todayStats.map((stat) => {
            const IconComponent = stat.icon;
            return (
              <Card key={stat.id} className="transition-shadow hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                      <p className="mt-1 text-xs text-gray-500">{stat.subtitle}</p>
                    </div>
                    <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="flex items-center mt-4">
                    <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
                    <span className="text-sm font-medium text-green-600">{stat.change}</span>
                    <span className="ml-1 text-sm text-gray-500">전일 대비</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Urgent Actions */}
      <div>
        <h2 className="flex items-center mb-4 text-xl font-semibold text-gray-900">
          <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
          긴급 처리 필요 건
        </h2>
        <div className="space-y-3">
          {urgentActions.map((item) => (
            <Card key={item.id} className={`border-l-4 ${getPriorityColor(item.priority)}`}>
              {" "}
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className={`h-5 w-5 ${item.priority === "urgent" ? "text-red-500" : "text-orange-500"}`} />
                    <div>
                      <p className="font-medium text-gray-900">{item.title}</p>
                      <p className="text-sm text-gray-600">
                        고객: {item.customer} | {item.visa_type}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-sm font-medium ${item.priority === "urgent" ? "text-red-600" : "text-orange-600"}`}>
                      {(() => {
                        if (item.days_overdue) return `${item.days_overdue}일 지연`;
                        if (item.days_left) return `${item.days_left}일 남음`;
                        return `${item.hours_left}시간 남음`;
                      })()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Overall Status Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              전체 신청 현황
            </CardTitle>
          </CardHeader>
          <CardContent>
            {" "}
            <div className="space-y-4">
              {statusCountsLoading ? (
                <div className="text-center text-gray-500">상태 데이터 로딩 중...</div>
              ) : (
                statusData.map((item) => (
                  <div key={item.key} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 ${item.color} rounded`}></div>
                      <span className="text-sm font-medium text-gray-700">{item.status}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-gray-900">{item.count}건</span>
                      <div className="w-20 h-2 bg-gray-200 rounded-full">
                        <div
                          className={`h-2 ${item.color} rounded-full`}
                          style={{
                            width: `${realStatusCounts.total > 0 ? (item.count / realStatusCounts.total) * 100 : 0}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="pt-4 mt-4 border-t">
              <p className="text-sm text-gray-600">
                총 <span className="font-bold">{realStatusCounts.total}건</span>의 신청이 진행 중입니다.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              최근 활동 로그
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="mt-1">{getActivityIcon(activity.type)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-4 mt-4 border-t">
              <button className="text-sm font-medium text-blue-600 hover:text-blue-800">모든 활동 보기 →</button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
