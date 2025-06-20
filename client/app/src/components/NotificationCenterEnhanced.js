import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Bell, X, CheckCheck, Trash2, ExternalLink } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { ko } from "date-fns/locale";
import { useQuery, useMutation } from "@apollo/client";
import { GET_NOTIFICATIONS_PAGINATED } from "../lib/graphql/query/notifications";
import { MARK_NOTIFICATION_AS_READ, DELETE_NOTIFICATION, MARK_ALL_NOTIFICATIONS_AS_READ, DELETE_ALL_NOTIFICATIONS } from "../lib/graphql/mutation/notifications";

/**
 * 향상된 실시간 알림 센터 컴포넌트
 * - Intersection Observer를 이용한 인피니트 스크롤
 * - Apollo Client fetchMore 지원
 * - 클릭 내비게이션 기능
 * - 대량 작업 및 개별 작업 지원
 */
const NotificationCenterEnhanced = ({
  socketNotifications = [],
  isConnected = false,
  onNavigate = null, // 네비게이션 콜백 함수
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState("all"); // all, unread, read
  const [allNotifications, setAllNotifications] = useState([]);
  const scrollRef = useRef(null);
  const loadMoreRef = useRef(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  // GraphQL 뮤테이션들
  const [markAsRead] = useMutation(MARK_NOTIFICATION_AS_READ);
  const [deleteNotification] = useMutation(DELETE_NOTIFICATION);
  const [markAllAsRead] = useMutation(MARK_ALL_NOTIFICATIONS_AS_READ);
  const [deleteAllNotifications] = useMutation(DELETE_ALL_NOTIFICATIONS);
  // GraphQL 쿼리로 페이지네이션된 알림 데이터 로드 (필터 없이 모든 데이터 가져오기)
  const { data, loading, error, fetchMore, refetch } = useQuery(GET_NOTIFICATIONS_PAGINATED, {
    variables: {
      userId: "1", // 임시 하드코딩 - 실제로는 로그인된 사용자 ID 사용
      first: 20,
      filter: null, // 클라이언트에서 필터링하므로 서버에서는 모든 데이터 가져오기
    },
    fetchPolicy: "cache-and-network",
    errorPolicy: "all",
    notifyOnNetworkStatusChange: true,
  });

  // 서버에서 가져온 알림과 소켓 알림을 병합
  useEffect(() => {
    if (data?.getNotificationsPaginated?.notifications) {
      const serverNotifications = data.getNotificationsPaginated.notifications.map((notification) => ({
        ...notification,
        isRead: notification.status?.toLowerCase() === "read",
        timestamp: notification.createdAt,
      }));

      // 소켓 알림과 서버 알림 병합 (중복 제거)
      const combinedNotifications = [...socketNotifications];

      serverNotifications.forEach((serverNotif) => {
        const exists = socketNotifications.find((socketNotif) => socketNotif.id === serverNotif.id);
        if (!exists) {
          combinedNotifications.push(serverNotif);
        }
      });

      // 시간순으로 정렬
      combinedNotifications.sort((a, b) => new Date(b.timestamp || b.createdAt) - new Date(a.timestamp || a.createdAt));

      setAllNotifications(combinedNotifications);
    }
  }, [data, socketNotifications]);

  // Intersection Observer를 이용한 인피니트 스크롤
  useEffect(() => {
    if (!loadMoreRef.current || !data?.getNotificationsPaginated?.pageInfo?.hasNextPage || isLoadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !isLoadingMore) {
          handleLoadMore();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "20px",
      }
    );

    observer.observe(loadMoreRef.current);

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [data?.getNotificationsPaginated?.pageInfo?.hasNextPage, isLoadingMore]);

  // 더 많은 알림 로드
  const handleLoadMore = useCallback(async () => {
    if (isLoadingMore || !data?.getNotificationsPaginated?.pageInfo?.hasNextPage) return;

    setIsLoadingMore(true);
    try {
      await fetchMore({
        variables: {
          after: data.getNotificationsPaginated.pageInfo.endCursor,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;

          return {
            getNotificationsPaginated: {
              ...fetchMoreResult.getNotificationsPaginated,
              notifications: [...prev.getNotificationsPaginated.notifications, ...fetchMoreResult.getNotificationsPaginated.notifications],
            },
          };
        },
      });
    } catch (error) {
      console.error("Error loading more notifications:", error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [data, fetchMore, isLoadingMore]); // 필터링된 알림 계산
  const filteredNotifications = useMemo(() => {
    return allNotifications.filter((notification) => {
      if (filter === "all") return true;
      if (filter === "unread") return !notification.isRead;
      if (filter === "read") return notification.isRead;
      return true;
    });
  }, [allNotifications, filter]);

  // 전체 데이터를 기준으로 한 개수 계산 (필터와 무관하게 항상 동일)
  const notificationCounts = useMemo(() => {
    const unreadCount = allNotifications.filter((n) => !n.isRead).length;
    const readCount = allNotifications.filter((n) => n.isRead).length;
    const totalCount = allNotifications.length;

    return { unreadCount, readCount, totalCount };
  }, [allNotifications]);

  const { unreadCount, readCount, totalCount } = notificationCounts; // 알림 클릭 핸들러 (내비게이션 + 읽음 처리)
  const handleNotificationClick = async (notification) => {
    try {
      // 읽지 않은 알림이면 읽음으로 표시
      if (!notification.isRead) {
        await markNotificationAsRead(notification);
      }

      // 네비게이션 처리
      handleNotificationNavigation(notification);
    } catch (error) {
      console.error("Error handling notification click:", error);
    }
  };

  // 알림 읽음 처리 분리
  const markNotificationAsRead = async (notification) => {
    await markAsRead({
      variables: {
        input: { notificationId: notification.id },
      },
    });

    // 로컬 상태 업데이트
    setAllNotifications((prev) => prev.map((n) => (n.id === notification.id ? { ...n, isRead: true, status: "read" } : n)));
  };

  // 알림 네비게이션 처리 분리
  const handleNotificationNavigation = (notification) => {
    if (!onNavigate) return;

    let targetUrl = notification.targetUrl;

    // targetUrl이 없는 경우 알림 타입에 따라 기본 URL 생성
    if (!targetUrl) {
      targetUrl = generateDefaultTargetUrl(notification);
    }

    if (targetUrl) {
      onNavigate(targetUrl);
      setIsOpen(false); // 알림 패널 닫기
    }
  };
  // 알림 타입에 따른 기본 URL 생성 함수 - 단순화
  const generateDefaultTargetUrl = (notification) => {
    const type = notification.type?.toLowerCase();
    const data = notification.data ? JSON.parse(notification.data) : {};

    // 타입별 URL 매핑
    const urlMappings = {
      application: () => getApplicationUrl(data),
      payment: () => getPaymentUrl(data),
      status_update: () => getStatusUrl(data),
      document: () => getDocumentUrl(data),
      interview: () => getInterviewUrl(data),
      system: () => "/settings",
      promotion: () => getPromotionUrl(data),
    };

    const urlGenerator = urlMappings[type];
    return urlGenerator ? urlGenerator() : "/dashboard";
  };

  // 신청서 관련 URL 생성
  const getApplicationUrl = (data) => {
    if (data.applicationId) return `/application/${data.applicationId}`;
    return "/application/status";
  };

  // 결제 관련 URL 생성
  const getPaymentUrl = (data) => {
    if (data.paymentId) return `/payment/${data.paymentId}`;
    if (data.applicationId) return `/application/${data.applicationId}/payment`;
    return "/payment/history";
  };

  // 상태 업데이트 URL 생성
  const getStatusUrl = (data) => {
    if (data.applicationId) return `/application/${data.applicationId}/status`;
    return "/application/status";
  };

  // 서류 관련 URL 생성
  const getDocumentUrl = (data) => {
    if (data.applicationId) return `/application/${data.applicationId}/documents`;
    return "/documents";
  };

  // 인터뷰 관련 URL 생성
  const getInterviewUrl = (data) => {
    if (data.interviewId) return `/interview/${data.interviewId}`;
    return "/interview/schedule";
  };
  // 프로모션 관련 URL 생성
  const getPromotionUrl = (data) => {
    if (data.promotionId) return `/promotion/${data.promotionId}`;
    return "/promotions";
  };
  // 알림 컨텐츠 렌더링 함수
  const renderNotificationContent = () => {
    if (loading && filteredNotifications.length === 0) {
      return (
        <div className="p-4 text-center text-gray-500">
          <div className="w-6 h-6 mx-auto mb-2 border-2 border-blue-500 rounded-full animate-spin border-t-transparent" />
          알림을 불러오는 중...
        </div>
      );
    }

    if (filteredNotifications.length === 0) {
      return (
        <div className="p-8 text-center text-gray-500">
          <Bell size={48} className="mx-auto mb-4 text-gray-300" />
          <p>알림이 없습니다</p>
        </div>
      );
    }

    return (
      <>
        {filteredNotifications.map((notification, index) => {
          const style = getNotificationStyle(notification.type);
          return (
            <div
              key={notification.id || index}
              role="button"
              tabIndex={0}
              onClick={() => handleNotificationClick(notification)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleNotificationClick(notification);
                }
              }}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                !notification.isRead ? "bg-blue-50" : ""
              }`}
            >
              <div className="flex items-start gap-3">
                {/* 타입 아이콘 */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-full ${style.bgColor} flex items-center justify-center text-sm`}>{style.icon}</div>

                {/* 알림 내용 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <h4 className={`text-sm font-medium ${!notification.isRead ? "text-gray-900" : "text-gray-700"}`}>{notification.title}</h4>
                    <div className="flex items-center gap-1 ml-2">
                      {notification.targetUrl && <ExternalLink size={12} className="text-gray-400" />}
                      <button onClick={(e) => handleDeleteNotification(notification.id, e)} className="text-gray-400 transition-colors hover:text-red-500">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                  <p className="mt-1 text-sm text-gray-600 line-clamp-2">{notification.message}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500">{formatNotificationTime(notification.timestamp || notification.createdAt)}</span>
                    {!notification.isRead && <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full" />}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* 무한 스크롤 트리거 */}
        {data?.getNotificationsPaginated?.pageInfo?.hasNextPage && (
          <div ref={loadMoreRef} className="p-4 text-center">
            {isLoadingMore ? (
              <div className="flex items-center justify-center gap-2 text-gray-500">
                <div className="w-4 h-4 border-2 border-blue-500 rounded-full animate-spin border-t-transparent" />더 많은 알림을 불러오는 중...
              </div>
            ) : (
              <div className="text-sm text-gray-400">스크롤하여 더 보기</div>
            )}
          </div>
        )}
      </>
    );
  };

  // 개별 알림 삭제
  const handleDeleteNotification = async (notificationId, e) => {
    e.stopPropagation(); // 클릭 이벤트 버블링 방지

    try {
      await deleteNotification({
        variables: { id: notificationId },
      });

      // 로컬 상태에서 제거
      setAllNotifications((prev) => prev.filter((n) => n.id !== notificationId));
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  // 모든 알림 읽음 처리
  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead({
        variables: { userId: "1" },
      });

      // 로컬 상태 업데이트
      setAllNotifications((prev) => prev.map((n) => ({ ...n, isRead: true, status: "read" })));

      // 데이터 다시 로드
      refetch();
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  // 모든 알림 삭제
  const handleDeleteAll = async () => {
    try {
      await deleteAllNotifications({
        variables: { userId: "1" },
      });

      // 로컬 상태 초기화
      setAllNotifications([]);

      // 데이터 다시 로드
      refetch();
    } catch (error) {
      console.error("Error deleting all notifications:", error);
    }
  };

  // 시간 포맷팅 함수
  const formatNotificationTime = (timestamp) => {
    if (!timestamp) return "";

    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 60) {
      return `${diffInMinutes}분 전`;
    } else if (diffInMinutes < 1440) {
      // 24시간
      return formatDistanceToNow(date, { addSuffix: true, locale: ko });
    } else {
      return format(date, "MM.dd HH:mm", { locale: ko });
    }
  };

  // 알림 타입별 아이콘 및 색상
  const getNotificationStyle = (type) => {
    switch (type?.toLowerCase()) {
      case "application":
        return { icon: "📋", color: "text-blue-600", bgColor: "bg-blue-50" };
      case "payment":
        return { icon: "💳", color: "text-green-600", bgColor: "bg-green-50" };
      case "status_update":
        return { icon: "📄", color: "text-orange-600", bgColor: "bg-orange-50" };
      case "system":
        return { icon: "⚙️", color: "text-gray-600", bgColor: "bg-gray-50" };
      default:
        return { icon: "🔔", color: "text-blue-600", bgColor: "bg-blue-50" };
    }
  };

  return (
    <div className="relative">
      {/* 알림 벨 아이콘 */}
      <button onClick={() => setIsOpen(!isOpen)} className="relative p-2 text-gray-600 transition-colors hover:text-gray-900" aria-label="알림">
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center min-w-[20px]">{unreadCount > 99 ? "99+" : unreadCount}</span>
        )}
      </button>

      {/* 알림 패널 */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-[70vh] flex flex-col">
          {/* 헤더 */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">알림</h3>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`} />
                  <span className="text-xs text-gray-500">{isConnected ? "연결됨" : "연결 안됨"}</span>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-gray-400 transition-colors hover:text-gray-600">
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* 필터 버튼들 */}
            <div className="flex gap-2 mb-3">
              <button
                onClick={() => setFilter("all")}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${filter === "all" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              >
                전체 ({totalCount})
              </button>
              <button
                onClick={() => setFilter("unread")}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${filter === "unread" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              >
                읽지 않음 ({unreadCount})
              </button>
              <button
                onClick={() => setFilter("read")}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${filter === "read" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              >
                읽음 ({readCount})
              </button>
            </div>

            {/* 대량 작업 버튼들 */}
            {filteredNotifications.length > 0 && (
              <div className="flex gap-2">
                <button onClick={handleMarkAllAsRead} className="flex items-center gap-1 px-3 py-1 text-sm text-green-700 transition-colors bg-green-100 rounded-full hover:bg-green-200">
                  <CheckCheck size={14} />
                  모두 읽음
                </button>
                <button onClick={handleDeleteAll} className="flex items-center gap-1 px-3 py-1 text-sm text-red-700 transition-colors bg-red-100 rounded-full hover:bg-red-200">
                  <Trash2 size={14} />
                  모두 삭제
                </button>
              </div>
            )}
          </div>{" "}
          {/* 알림 목록 */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto" style={{ maxHeight: "400px" }}>
            {renderNotificationContent()}
          </div>
          {/* 에러 표시 */}
          {error && (
            <div className="p-4 border-t border-gray-200 bg-red-50">
              <p className="text-sm text-red-600">알림을 불러오는 중 오류가 발생했습니다.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationCenterEnhanced;
