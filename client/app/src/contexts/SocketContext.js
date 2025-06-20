"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [networkStatus, setNetworkStatus] = useState("online");

  // 네트워크 상태 감지
  useEffect(() => {
    const handleOnline = () => {
      console.log("🌐 네트워크 연결됨");
      setNetworkStatus("online");
    };

    const handleOffline = () => {
      console.log("📵 네트워크 연결 끊김");
      setNetworkStatus("offline");
      setIsConnected(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // 초기 네트워크 상태 설정
    setNetworkStatus(navigator.onLine ? "online" : "offline");

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);
  useEffect(() => {
    // 네트워크가 오프라인인 경우 Socket 연결 시도하지 않음
    if (networkStatus === "offline") {
      console.log("📵 네트워크 오프라인 상태로 Socket 연결 생략");
      return;
    }

    // Socket.IO 클라이언트 초기화 (인증 없이)
    const socketInstance = io(process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5002", {
      transports: ["websocket", "polling"],
      timeout: 20000,
      forceNew: true,
      // 인증 없이 연결하여 대시보드에서 실시간 알림 수신
      auth: {
        // token: null // 관리자 대시보드는 토큰 없이도 알림 수신
      },
    });

    socketInstance.on("connect", () => {
      console.log("✅ Socket.IO 연결됨:", socketInstance.id);
      setIsConnected(true);
    });

    socketInstance.on("disconnect", (reason) => {
      console.log("❌ Socket.IO 연결 해제됨:", reason);
      setIsConnected(false);
    });

    socketInstance.on("connect_error", (error) => {
      console.error("❌ Socket.IO 연결 오류:", error);
      setIsConnected(false);
    });

    // 재연결 시도
    socketInstance.on("reconnect", (attemptNumber) => {
      console.log("🔄 Socket.IO 재연결 성공:", attemptNumber);
      setIsConnected(true);
    });

    socketInstance.on("reconnect_attempt", (attemptNumber) => {
      console.log("🔄 Socket.IO 재연결 시도:", attemptNumber);
    });

    socketInstance.on("reconnect_error", (error) => {
      console.error("❌ Socket.IO 재연결 실패:", error);
    });

    socketInstance.on("reconnect_failed", () => {
      console.error("❌ Socket.IO 재연결 완전 실패");
      setIsConnected(false);
    });

    // 새로운 신청서 알림 수신
    socketInstance.on("dashboard_new_application", (data) => {
      console.log("📢 새로운 신청서 알림 수신:", data);

      const notification = {
        id: `app_${data.data.id}_${Date.now()}`,
        type: "new_application",
        title: "새로운 비자 신청",
        message: `${data.data.firstName} ${data.data.lastName}님의 신청이 접수되었습니다.`,
        data: data.data,
        timestamp: data.timestamp,
        read: false,
      };

      setNotifications((prev) => [notification, ...prev.slice(0, 49)]); // 최대 50개까지만 보관

      // 브라우저 알림 표시 (권한이 있는 경우)
      if (Notification.permission === "granted") {
        new Notification(notification.title, {
          body: notification.message,
          icon: "/favicon.ico",
          badge: "/favicon.ico",
        });
      }
    });

    // 기타 실시간 이벤트들
    socketInstance.on("new_application", (data) => {
      console.log("📢 관리자용 신청서 알림:", data);
      // 추가 처리가 필요한 경우 여기에 구현
    });

    socketInstance.on("application_status_change", (data) => {
      console.log("📢 신청서 상태 변경 알림:", data);
      // 상태 변경 알림 처리
    });

    setSocket(socketInstance); // 정리 함수
    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, [networkStatus]); // networkStatus가 변경될 때마다 재실행

  // 브라우저 알림 권한 요청
  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission().then((permission) => {
          console.log("브라우저 알림 권한:", permission);
        });
      }
    }
  }, []);

  // 알림 읽음 처리
  const markAsRead = (notificationId) => {
    setNotifications((prev) => prev.map((notification) => (notification.id === notificationId ? { ...notification, read: true } : notification)));
  };

  // 모든 알림 읽음 처리
  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })));
  };

  // 알림 삭제
  const removeNotification = (notificationId) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== notificationId));
  };

  // 모든 알림 삭제
  const clearAllNotifications = () => {
    setNotifications([]);
  };
  const value = {
    socket,
    isConnected: isConnected && networkStatus === "online",
    networkStatus,
    notifications,
    unreadCount: notifications.filter((n) => !n.read).length,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};
