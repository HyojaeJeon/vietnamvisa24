import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { toast } from "react-hot-toast";

/**
 * Socket.IO 연결 및 실시간 알림을 관리하는 커스텀 훅
 */
export const useSocket = (userId, token) => {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Socket.IO 연결 설정
    if (userId && token) {
      const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5002";

      socketRef.current = io(serverUrl, {
        auth: {
          token: token,
          userId: userId,
        },
        transports: ["websocket", "polling"],
      });

      // 연결 이벤트
      socketRef.current.on("connect", () => {
        console.log("🔌 Socket.IO connected");
        setIsConnected(true);

        // 사용자 룸 조인
        socketRef.current.emit("join_user_room", userId);
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
      });

      // 신청 상태 변경 알림
      socketRef.current.on("application_status_change", (data) => {
        console.log("📱 Application status change:", data);

        toast.success(data.message, {
          duration: 5000,
          icon: "📋",
        });

        setNotifications((prev) => [
          { id: Date.now(), ...data, timestamp: new Date().toISOString() },
          ...prev.slice(0, 49), // 최대 50개 알림 유지
        ]);
      });

      // 워크플로우 진행 알림
      socketRef.current.on("workflow_progress", (data) => {
        console.log("⚡ Workflow progress:", data);

        toast(data.message, {
          duration: 4000,
          icon: "⚡",
        });

        setNotifications((prev) => [{ id: Date.now(), ...data, timestamp: new Date().toISOString() }, ...prev.slice(0, 49)]);
      });

      // 문서 검토 완료 알림
      socketRef.current.on("document_reviewed", (data) => {
        console.log("📄 Document reviewed:", data);

        const icon = data.data?.status === "approved" ? "✅" : data.data?.status === "revision_required" ? "📝" : "📄";

        toast(data.message, {
          duration: 5000,
          icon: icon,
        });

        setNotifications((prev) => [{ id: Date.now(), ...data, timestamp: new Date().toISOString() }, ...prev.slice(0, 49)]);
      });

      // 결제 알림
      socketRef.current.on("payment_status_change", (data) => {
        console.log("💳 Payment status change:", data);

        const icon = data.data?.status === "paid" ? "✅" : data.data?.status === "failed" ? "❌" : "💳";

        toast(data.message, {
          duration: 5000,
          icon: icon,
        });

        setNotifications((prev) => [{ id: Date.now(), ...data, timestamp: new Date().toISOString() }, ...prev.slice(0, 49)]);
      });

      // 일반 알림
      socketRef.current.on("notification", (data) => {
        console.log("🔔 General notification:", data);

        toast(data.message, {
          duration: 4000,
          icon: "🔔",
        });

        setNotifications((prev) => [{ id: Date.now(), ...data, timestamp: new Date().toISOString() }, ...prev.slice(0, 49)]);
      });

      // 상담 답변 알림
      socketRef.current.on("consultation_reply", (data) => {
        console.log("💬 Consultation reply:", data);

        toast(data.message, {
          duration: 6000,
          icon: "💬",
        });

        setNotifications((prev) => [{ id: Date.now(), ...data, timestamp: new Date().toISOString() }, ...prev.slice(0, 49)]);
      });

      // 관리자용 알림 (관리자인 경우)
      socketRef.current.on("admin_notification", (data) => {
        console.log("👨‍💼 Admin notification:", data);

        toast(data.message, {
          duration: 5000,
          icon: "👨‍💼",
        });

        setNotifications((prev) => [{ id: Date.now(), ...data, timestamp: new Date().toISOString() }, ...prev.slice(0, 49)]);
      });
    }

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

  // Socket emit 헬퍼 함수들
  const joinApplicationRoom = (applicationId) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("join_application_room", applicationId);
    }
  };

  const leaveApplicationRoom = (applicationId) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("leave_application_room", applicationId);
    }
  };

  const sendMessage = (event, data) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, data);
    }
  };

  return {
    isConnected,
    notifications,
    unreadCount: notifications.filter((n) => !n.isRead).length,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    removeNotification,
    clearAllNotifications,
    joinApplicationRoom,
    leaveApplicationRoom,
    sendMessage,
    socket: socketRef.current,
  };
};

export default useSocket;
