const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

let io;

// 비자 타입 한글 라벨 변환 함수
const getVisaTypeLabel = (visaType) => {
  const labels = {
    E_VISA_GENERAL: "일반 E-비자",
    E_VISA_TOURIST: "관광 E-비자",
    E_VISA_BUSINESS: "상용 E-비자",
    VISA_ON_ARRIVAL: "도착비자",
    MULTIPLE_ENTRY: "복수입국비자",
  };
  return labels[visaType] || visaType;
};

// Socket.IO 초기화
const initializeSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
        "http://localhost:3003",
      ],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // 인증 미들웨어 (선택적)
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    // 토큰이 없는 경우에도 연결 허용 (대시보드 알림용)
    if (!token) {
      console.log("🔓 토큰 없는 연결 허용 (대시보드 알림용)");
      socket.isGuest = true;
      return next();
    }

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "your-secret-key",
      );
      socket.userId = decoded.userId;
      socket.userRole = decoded.role;
      socket.isAuthenticated = true;
      next();
    } catch (err) {
      console.log("⚠️ 토큰 검증 실패, 게스트로 연결 허용");
      socket.isGuest = true;
      next();
    }
  });
  // 연결 이벤트 처리
  io.on("connection", (socket) => {
    const userInfo = socket.isAuthenticated
      ? `User: ${socket.userId}, Role: ${socket.userRole}`
      : "Guest (Dashboard)";
    console.log(`✅ Socket connected: ${socket.id} (${userInfo})`);

    // 사용자별 룸 참가 (인증된 사용자만)
    if (socket.userId && socket.isAuthenticated) {
      socket.join(`user_${socket.userId}`);
    }

    // 관리자인 경우 관리자 룸 참가
    if (
      socket.userRole === "admin" ||
      socket.userRole === "manager" ||
      socket.userRole === "super_admin"
    ) {
      socket.join("admins");
    }

    // 게스트도 일반 대시보드 룸에 참가 (알림 수신용)
    socket.join("dashboard");

    // 애플리케이션별 룸 참가
    socket.on("join_application", (applicationId) => {
      socket.join(`application_${applicationId}`);
      console.log(
        `Socket ${socket.id} joined application room: ${applicationId}`,
      );
    });

    // 애플리케이션 룸 떠나기
    socket.on("leave_application", (applicationId) => {
      socket.leave(`application_${applicationId}`);
      console.log(
        `Socket ${socket.id} left application room: ${applicationId}`,
      );
    });

    // 연결 해제
    socket.on("disconnect", () => {
      console.log(`❌ Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

// 실시간 알림 전송 함수들
const socketNotifications = {
  // 새로운 애플리케이션 알림 (관리자에게)
  notifyNewApplication: async (application) => {
    if (io) {
      console.log("📢 새로운 비자 신청 알림 전송:", application.applicationId);

      const notificationData = {
        type: "dashboard_new_application",
        title: "새로운 비자 신청",
        message: `${application.firstName} ${application.lastName}님의 ${getVisaTypeLabel(application.visaType)} 신청이 접수되었습니다.`,
        data: {
          id: application.id,
          applicationId: application.applicationId,
          userId: application.userId,
          firstName: application.firstName,
          lastName: application.lastName,
          email: application.email,
          visaType: application.visaType,
          processingType: application.processingType,
          totalPrice: application.totalPrice,
          status: application.status,
          createdAt: application.createdAt,
        },
        timestamp: new Date().toISOString(),
      };

      // 1. 데이터베이스에 알림 저장
      try {
        const models = require("../models");
        await models.Notification.create({
          type: notificationData.type,
          title: notificationData.title,
          message: notificationData.message,
          recipient: "system", // 관리자용 알림
          priority: "normal",
          relatedId: application.applicationId,
          read: false,
          status: "unread",
          created_at: new Date(),
          data: JSON.stringify(notificationData.data),
        });
        console.log("✅ 알림이 데이터베이스에 저장되었습니다");
      } catch (dbError) {
        console.error("❌ 데이터베이스 알림 저장 실패:", dbError);
      }

      // 2. 관리자들에게 Socket.IO 알림 전송
      io.to("admins").emit("new_application", {
        type: "new_application",
        title: notificationData.title,
        message: notificationData.message,
        data: notificationData.data,
        timestamp: notificationData.timestamp,
      }); // 3. 대시보드 룸에도 브로드캐스트 (토큰 없이도 접근 가능한 관리자 화면용)
      io.to("dashboard").emit("dashboard_new_application", notificationData);

      console.log("✅ 신청서 알림 전송 완료");
    }
  },
  // 애플리케이션 상태 변경 알림 (고객에게)
  notifyApplicationStatusChange: async (
    userId,
    application,
    previousStatus,
    newStatus,
  ) => {
    if (io) {
      const statusMessages = {
        pending: "신청이 접수되었습니다",
        processing: "신청 검토가 시작되었습니다",
        document_review: "서류 검토 중입니다",
        submitted_to_authority: "정부 기관에 제출되었습니다",
        approved: "비자가 승인되었습니다! 🎉",
        rejected: "신청이 거절되었습니다",
        completed: "처리가 완료되었습니다",
      };

      const notificationData = {
        type: "application_status_change",
        title: "신청 상태 변경",
        message: statusMessages[newStatus] || "상태가 변경되었습니다",
        data: {
          applicationId: application.id,
          applicationNumber: application.applicationNumber,
          previousStatus,
          newStatus,
          application,
        },
        timestamp: new Date().toISOString(),
      };

      // 1. 데이터베이스에 알림 저장
      try {
        const models = require("../models");
        await models.Notification.create({
          type: notificationData.type,
          title: notificationData.title,
          message: notificationData.message,
          recipient: userId || "system",
          priority: "normal",
          relatedId: application.applicationNumber,
          read: false,
          status: "unread",
          created_at: new Date(),
          data: JSON.stringify(notificationData.data),
        });
        console.log("✅ 상태 변경 알림이 데이터베이스에 저장되었습니다");
      } catch (dbError) {
        console.error("❌ 데이터베이스 알림 저장 실패:", dbError);
      }

      // 2. Socket.IO 알림 전송
      io.to(`user_${userId}`).emit(
        "application_status_change",
        notificationData,
      );

      // 애플리케이션 룸에도 전송
      io.to(`application_${application.id}`).emit("application_update", {
        type: "status_update",
        data: application,
        timestamp: new Date().toISOString(),
      });
    }
  },

  // 결제 완료 알림
  notifyPaymentComplete: (userId, payment, application) => {
    if (io) {
      io.to(`user_${userId}`).emit("payment_complete", {
        type: "payment_complete",
        title: "결제 완료",
        message: `${payment.amount} ${payment.currency} 결제가 완료되었습니다.`,
        data: {
          payment,
          application,
        },
        timestamp: new Date().toISOString(),
      });

      // 관리자에게도 알림
      io.to("admins").emit("payment_received", {
        type: "payment_received",
        title: "결제 확인",
        message: `${application.full_name}님의 결제가 완료되었습니다.`,
        data: {
          payment,
          application,
        },
        timestamp: new Date().toISOString(),
      });
    }
  },

  // 문서 업로드 알림 (관리자에게)
  notifyDocumentUploaded: (application, documents) => {
    if (io) {
      io.to("admins").emit("document_uploaded", {
        type: "document_uploaded",
        title: "새 서류 업로드",
        message: `${application.full_name}님이 ${documents.length}개의 서류를 업로드했습니다.`,
        data: {
          application,
          documents,
        },
        timestamp: new Date().toISOString(),
      });
    }
  },

  // 문서 검토 완료 알림 (고객에게)
  notifyDocumentReviewed: (userId, application, document, status) => {
    if (io) {
      const statusMessages = {
        approved: "서류가 승인되었습니다",
        revision_required: "서류 수정이 필요합니다",
        pending: "서류 검토 대기 중입니다",
      };

      io.to(`user_${userId}`).emit("document_reviewed", {
        type: "document_reviewed",
        title: "서류 검토 완료",
        message: `${document.document_name}: ${statusMessages[status]}`,
        data: {
          application,
          document,
          status,
        },
        timestamp: new Date().toISOString(),
      });
    }
  },

  // 워크플로우 진행 알림
  notifyWorkflowProgress: (userId, workflow, currentStep) => {
    if (io) {
      io.to(`user_${userId}`).emit("workflow_progress", {
        type: "workflow_progress",
        title: "처리 진행 상황",
        message: `현재 단계: ${currentStep.name}`,
        data: {
          workflow,
          currentStep,
        },
        timestamp: new Date().toISOString(),
      });

      // 애플리케이션 룸에도 전송
      io.to(`application_${workflow.applicationId}`).emit("workflow_update", {
        type: "workflow_progress",
        data: {
          workflow,
          currentStep,
        },
        timestamp: new Date().toISOString(),
      });
    }
  },

  // 상담 답변 알림
  notifyConsultationReply: (userId, consultation) => {
    if (io) {
      io.to(`user_${userId}`).emit("consultation_reply", {
        type: "consultation_reply",
        title: "상담 답변 도착",
        message: "전문가 상담 답변이 도착했습니다.",
        data: consultation,
        timestamp: new Date().toISOString(),
      });
    }
  },

  // 새로운 상담 요청 알림
  notifyNewConsultation: (consultationData) => {
    try {
      if (io) {
        io.emit("new_consultation", {
          id: consultationData.id,
          name: consultationData.name,
          email: consultationData.email,
          phone: consultationData.phone,
          message: consultationData.message,
          created_at: consultationData.created_at,
        });
        console.log(
          `📢 New consultation notification sent: ${consultationData.name}`,
        );
      }
    } catch (error) {
      console.error("❌ Failed to send consultation notification:", error);
    }
  },
  // 새로운 비자 신청 알림 (Dashboard용 - 토큰 인증 없이)
  notifyNewApplicationToDashboard: (applicationData) => {
    try {
      if (io) {
        io.emit("new_application_dashboard", {
          id: applicationData.id,
          application_number: applicationData.applicationNumber,
          full_name: applicationData.fullName,
          email: applicationData.email,
          visa_type: applicationData.visaType,
          created_at: applicationData.createdAt,
        });
        console.log(
          `📢 Dashboard application notification sent: ${applicationData.applicationNumber}`,
        );
      }
    } catch (error) {
      console.error("❌ Failed to send application notification:", error);
    }
  },

  // 일반 알림 전송
  sendNotification: (target, notification) => {
    if (io) {
      io.to(target).emit("notification", {
        ...notification,
        timestamp: new Date().toISOString(),
      });
    }
  },

  // 브로드캐스트 알림
  broadcast: (event, data) => {
    if (io) {
      io.emit(event, {
        ...data,
        timestamp: new Date().toISOString(),
      });
    }
  },
};

// Socket.IO 인스턴스 가져오기
const getSocketIO = () => io;

module.exports = {
  initializeSocket,
  socketNotifications,
  getSocketIO,
};
