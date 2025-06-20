import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { toast } from "react-hot-toast";

/**
 * 알림을 데이터베이스에 저장하는 함수
 */
const saveNotificationToDatabase = async (notification, token) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5002"}/api/notifications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        type: notification.type,
        title: notification.title || notification.message,
        message: notification.message,
        recipient: notification.data?.userId || "system",
        priority: notification.priority || "normal",
        relatedId: notification.data?.applicationId || notification.data?.id,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to save notification");
    }

    const savedNotification = await response.json();
    console.log("✅ Notification saved to database:", savedNotification);
    return savedNotification;
  } catch (error) {
    console.error("❌ Failed to save notification to database:", error);
    return null;
  }
};

/**
 * 간단한 Socket.IO 연결 및 실시간 알림을 관리하는 커스텀 훅
 */
function useSocket(userId, token) {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    console.log("🚀 Setting up socket connection for user:", userId || "guest");

    // Socket.IO 연결 설정
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5002";

    const socketOptions = {
      transports: ["websocket", "polling"],
    };

    // 토큰과 userId가 있으면 인증 정보 추가
    if (userId && token) {
      socketOptions.auth = {
        token: token,
        userId: userId,
      };
    }

    socketRef.current = io(serverUrl, socketOptions);

    // 연결 이벤트
    socketRef.current.on("connect", () => {
      console.log("🔌 Socket.IO connected:", socketRef.current.id);
      setIsConnected(true);

      // 사용자 룸 조인 (userId가 있는 경우만)
      if (userId) {
        socketRef.current.emit("join_user_room", userId);
      }
    });

    // 연결 해제 이벤트
    socketRef.current.on("disconnect", () => {
      console.log("🔌 Socket.IO disconnected");
      setIsConnected(false);
    });

    // 연결 오류 이벤트
    socketRef.current.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      setIsConnected(false);
    }); // dashboard_new_application 이벤트 리스너
    socketRef.current.on("dashboard_new_application", async (data) => {
      console.log("📢 Dashboard new application:", data);

      // 신청서 정보를 포함한 메시지 생성
      const message = data.message || `새로운 ${data.data?.visaType} 신청서가 접수되었습니다. (${data.data?.processingType})`;

      toast(message, {
        duration: 6000,
        icon: "📢",
      });

      const notificationWithId = {
        id: Date.now(),
        ...data,
        title: data.title || message,
        timestamp: new Date().toISOString(),
        isRead: false,
      };

      setNotifications((prev) => [notificationWithId, ...prev.slice(0, 49)]);

      // 서버에서 이미 DB 저장을 처리하므로 클라이언트에서는 제거
      console.log("ℹ️ 알림이 서버에서 이미 DB에 저장되었습니다");
    }); // 신청 상태 변경 알림
    socketRef.current.on("application_status_change", async (data) => {
      console.log("📱 Application status change:", data);

      toast.success(data.message, {
        duration: 5000,
        icon: "📋",
      });

      const notificationWithId = {
        id: Date.now(),
        ...data,
        title: data.title || data.message,
        timestamp: new Date().toISOString(),
        isRead: false,
      };

      setNotifications((prev) => [notificationWithId, ...prev.slice(0, 49)]);

      // 서버에서 이미 DB 저장을 처리
      console.log("ℹ️ 상태 변경 알림이 서버에서 이미 DB에 저장되었습니다");
    });

    // 일반 알림
    socketRef.current.on("notification", async (data) => {
      console.log("🔔 General notification:", data);

      toast(data.message, {
        duration: 4000,
        icon: "🔔",
      });

      const notificationWithId = {
        id: Date.now(),
        ...data,
        title: data.title || data.message,
        timestamp: new Date().toISOString(),
        isRead: false,
      };

      setNotifications((prev) => [notificationWithId, ...prev.slice(0, 49)]);

      // 서버에서 처리하므로 클라이언트 저장 불필요
      console.log("ℹ️ 일반 알림이 서버에서 이미 DB에 저장되었습니다");
    });

    // 컴포넌트 언마운트 시 연결 해제
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [userId, token]);

  // 알림 읽음 처리
  const markNotificationAsRead = (notificationId) => {
    setNotifications((prev) => prev.map((notification) => (notification.id === notificationId ? { ...notification, isRead: true } : notification)));
  };

  // 모든 알림 읽음 처리
  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, isRead: true })));
  };

  // 알림 삭제
  const removeNotification = (notificationId) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== notificationId));
  };

  // 모든 알림 삭제
  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return {
    isConnected,
    notifications,
    unreadCount: notifications.filter((n) => !n.isRead).length,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    removeNotification,
    clearAllNotifications,
    socket: socketRef.current,
  };
}

export default useSocket;
