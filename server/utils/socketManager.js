const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

let io;

// Socket.IO 초기화
const initializeSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // 인증 미들웨어
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("Authentication error"));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
      socket.userId = decoded.userId;
      socket.userRole = decoded.role;
      next();
    } catch (err) {
      next(new Error("Authentication error"));
    }
  });

  // 연결 이벤트 처리
  io.on("connection", (socket) => {
    console.log(`✅ Socket connected: ${socket.id} (User: ${socket.userId})`);

    // 사용자별 룸 참가
    if (socket.userId) {
      socket.join(`user_${socket.userId}`);
    }

    // 관리자인 경우 관리자 룸 참가
    if (socket.userRole === "admin" || socket.userRole === "manager" || socket.userRole === "super_admin") {
      socket.join("admins");
    }

    // 애플리케이션별 룸 참가
    socket.on("join_application", (applicationId) => {
      socket.join(`application_${applicationId}`);
      console.log(`User ${socket.userId} joined application room: ${applicationId}`);
    });

    // 애플리케이션 룸 떠나기
    socket.on("leave_application", (applicationId) => {
      socket.leave(`application_${applicationId}`);
      console.log(`User ${socket.userId} left application room: ${applicationId}`);
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
  notifyNewApplication: (application) => {
    if (io) {
      io.to("admins").emit("new_application", {
        type: "new_application",
        title: "새로운 비자 신청",
        message: `${application.full_name}님의 ${application.visa_type} 신청이 접수되었습니다.`,
        data: application,
        timestamp: new Date().toISOString(),
      });
    }
  },

  // 애플리케이션 상태 변경 알림 (고객에게)
  notifyApplicationStatusChange: (userId, application, previousStatus, newStatus) => {
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

      io.to(`user_${userId}`).emit("application_status_change", {
        type: "status_change",
        title: "신청 상태 변경",
        message: statusMessages[newStatus] || "상태가 변경되었습니다",
        data: {
          applicationId: application.id,
          applicationNumber: application.application_number,
          previousStatus,
          newStatus,
          application,
        },
        timestamp: new Date().toISOString(),
      });

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
        console.log(`📢 New consultation notification sent: ${consultationData.name}`);
      }
    } catch (error) {
      console.error("❌ Failed to send consultation notification:", error);
    }
  },

  // 새로운 비자 신청 알림
  notifyNewApplication: (applicationData) => {
    try {
      if (io) {
        io.emit("new_application", {
          id: applicationData.id,
          application_number: applicationData.application_number,
          full_name: applicationData.full_name,
          email: applicationData.email,
          visa_type: applicationData.visa_type,
          created_at: applicationData.created_at,
        });
        console.log(`📢 New application notification sent: ${applicationData.application_number}`);
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