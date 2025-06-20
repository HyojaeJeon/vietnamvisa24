const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middleware/auth");
const models = require("../models");

/**
 * 알림 저장 API
 * POST /api/notifications
 */
router.post("/", requireAuth, async (req, res) => {
  try {
    const { type, title, message, recipient, priority, relatedId } = req.body;

    // 입력 검증
    if (!type || !title || !message || !recipient) {
      return res.status(400).json({
        error: "필수 필드가 누락되었습니다.",
        required: ["type", "title", "message", "recipient"],
      });
    }

    // 알림 생성
    const notification = await models.Notification.create({
      type: type,
      title: title,
      message: message,
      recipient: recipient,
      priority: priority || "normal",
      relatedId: relatedId || null,
      read: false,
      status: "unread",
      created_at: new Date(),
    });

    console.log("✅ Notification saved to database:", notification.id);

    res.status(201).json({
      id: notification.id,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      recipient: notification.recipient,
      priority: notification.priority,
      read: notification.read,
      status: notification.status,
      created_at: notification.created_at,
      relatedId: notification.relatedId,
    });
  } catch (error) {
    console.error("❌ Error saving notification:", error);
    res.status(500).json({
      error: "알림 저장에 실패했습니다.",
      details: error.message,
    });
  }
});

/**
 * 사용자별 알림 조회
 * GET /api/notifications
 */
router.get("/", requireAuth, async (req, res) => {
  try {
    const user = req.user;
    const { status, limit = 50 } = req.query;

    const whereCondition = { recipient: user.email };
    if (status) {
      whereCondition.status = status;
    }

    const notifications = await models.Notification.findAll({
      where: whereCondition,
      order: [["created_at", "DESC"]],
      limit: parseInt(limit),
    });

    res.json(notifications);
  } catch (error) {
    console.error("❌ Error fetching notifications:", error);
    res.status(500).json({
      error: "알림 조회에 실패했습니다.",
      details: error.message,
    });
  }
});

/**
 * 알림 읽음 처리
 * PUT /api/notifications/:id/read
 */
router.put("/:id/read", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const notification = await models.Notification.findOne({
      where: { id, recipient: user.email },
    });

    if (!notification) {
      return res.status(404).json({
        error: "알림을 찾을 수 없습니다.",
      });
    }

    await notification.update({
      read: true,
      status: "read",
    });

    res.json({
      id: notification.id,
      read: notification.read,
      status: notification.status,
    });
  } catch (error) {
    console.error("❌ Error marking notification as read:", error);
    res.status(500).json({
      error: "알림 읽음 처리에 실패했습니다.",
      details: error.message,
    });
  }
});

/**
 * 모든 알림 읽음 처리
 * PUT /api/notifications/read-all
 */
router.put("/read-all", requireAuth, async (req, res) => {
  try {
    const user = req.user;

    const [updatedCount] = await models.Notification.update(
      { read: true, status: "read" },
      { where: { recipient: user.email, read: false } }
    );

    res.json({
      success: true,
      message: `${updatedCount}개의 알림을 읽음 처리했습니다.`,
      updatedCount,
    });
  } catch (error) {
    console.error("❌ Error marking all notifications as read:", error);
    res.status(500).json({
      error: "전체 알림 읽음 처리에 실패했습니다.",
      details: error.message,
    });
  }
});

/**
 * 알림 삭제
 * DELETE /api/notifications/:id
 */
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const notification = await models.Notification.findOne({
      where: { id, recipient: user.email },
    });

    if (!notification) {
      return res.status(404).json({
        error: "알림을 찾을 수 없습니다.",
      });
    }

    await notification.destroy();

    res.json({
      success: true,
      message: "알림이 삭제되었습니다.",
    });
  } catch (error) {
    console.error("❌ Error deleting notification:", error);
    res.status(500).json({
      error: "알림 삭제에 실패했습니다.",
      details: error.message,
    });
  }
});

module.exports = router;
