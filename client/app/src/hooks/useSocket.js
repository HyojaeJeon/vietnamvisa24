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
        title: notification.title,
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
 * Socket.IO 연결 및 실시간 알림을 관리하는 커스텀 훅
 */
const useSocket = (userId, token) => {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // 연결 상태 디버깅
    console.log("🚀 Setting up socket connection for user:", userId || "guest");

    // Socket.IO 연결 설정 - 토큰이 있으면 인증된 연결, 없으면 게스트 연결
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
    });

    // 신청 상태 변경 알림
    socketRef.current.on("application_status_change", async (data) => {
      console.log("📱 Application status change:", data);

      toast.success(data.message, {
        duration: 5000,
        icon: "📋",
      });

      const notificationWithId = { id: Date.now(), ...data, timestamp: new Date().toISOString() };
      setNotifications((prev) => [
        notificationWithId,
        ...prev.slice(0, 49), // 최대 50개 알림 유지
      ]);

      // 데이터베이스에 저장
      await saveNotificationToDatabase(notificationWithId, token);
    }); // 워크플로우 진행 알림
    socketRef.current.on("workflow_progress", async (data) => {
      console.log("⚡ Workflow progress:", data);

      toast(data.message, {
        duration: 4000,
        icon: "⚡",
      });

      const notificationWithId = { id: Date.now(), ...data, timestamp: new Date().toISOString() };
      setNotifications((prev) => [notificationWithId, ...prev.slice(0, 49)]);

      // 데이터베이스에 저장
      await saveNotificationToDatabase(notificationWithId, token);
    }); // 문서 검토 완료 알림
    socketRef.current.on("document_reviewed", async (data) => {
      console.log("📄 Document reviewed:", data);

      const getIcon = () => {
        if (data.data?.status === "approved") return "✅";
        if (data.data?.status === "revision_required") return "📝";
        return "📄";
      };

      toast(data.message, {
        duration: 5000,
        icon: getIcon(),
      });

      const notificationWithId = { id: Date.now(), ...data, timestamp: new Date().toISOString() };
      setNotifications((prev) => [notificationWithId, ...prev.slice(0, 49)]);

      // 데이터베이스에 저장
      await saveNotificationToDatabase(notificationWithId, token);
    });

    // 결제 알림
    socketRef.current.on("payment_status_change", async (data) => {
      console.log("💳 Payment status change:", data);

      const getPaymentIcon = () => {
        if (data.data?.status === "paid") return "✅";
        if (data.data?.status === "failed") return "❌";
        return "💳";
      };
      toast(data.message, {
        duration: 5000,
        icon: getPaymentIcon(),
      });

      const notificationWithId = { id: Date.now(), ...data, timestamp: new Date().toISOString() };
      setNotifications((prev) => [notificationWithId, ...prev.slice(0, 49)]);

      // 데이터베이스에 저장
      await saveNotificationToDatabase(notificationWithId, token);
    });

    // 일반 알림
    socketRef.current.on("notification", async (data) => {
      console.log("🔔 General notification:", data);
      toast(data.message, {
        duration: 4000,
        icon: "🔔",
      });

      const notificationWithId = { id: Date.now(), ...data, timestamp: new Date().toISOString() };
      setNotifications((prev) => [notificationWithId, ...prev.slice(0, 49)]);

      // 데이터베이스에 저장
      await saveNotificationToDatabase(notificationWithId, token);
    });

    // 상담 답변 알림
    socketRef.current.on("consultation_reply", async (data) => {
      console.log("💬 Consultation reply:", data);
      toast(data.message, {
        duration: 6000,
        icon: "💬",
      });

      const notificationWithId = { id: Date.now(), ...data, timestamp: new Date().toISOString() };
      setNotifications((prev) => [notificationWithId, ...prev.slice(0, 49)]);

      // 데이터베이스에 저장
      await saveNotificationToDatabase(notificationWithId, token);
    }); // 관리자용 알림 (관리자인 경우)
    socketRef.current.on("admin_notification", async (data) => {
      console.log("👨‍💼 Admin notification:", data);

      toast(data.message, { duration: 5000, icon: "👨‍💼" });

      const notificationWithId = { id: Date.now(), ...data, timestamp: new Date().toISOString() };
      setNotifications((prev) => [notificationWithId, ...prev.slice(0, 49)]);

      // 데이터베이스에 저장
      await saveNotificationToDatabase(notificationWithId, token);
    });

    // 대시보드 새 신청서 알림
    socketRef.current.on("dashboard_new_application", async (data) => {
      console.log("📢 Dashboard new application:", data);

      // 신청서 정보를 포함한 메시지 생성
      const message = data.message || `새로운 ${data.data?.visaType} 신청서가 접수되었습니다. (${data.data?.processingType})`;

      toast(message, {
        duration: 6000,
        icon: "📢",
      });

      const notificationWithId = { id: Date.now(), ...data, timestamp: new Date().toISOString() };
      setNotifications((prev) => [notificationWithId, ...prev.slice(0, 49)]);

      // 데이터베이스에 저장
      await saveNotificationToDatabase(notificationWithId, token);
    });

    // 컴포넌트 언마운트 시 연결 해제
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [userId, token]); // userId와 token 변경 시 재연결

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
