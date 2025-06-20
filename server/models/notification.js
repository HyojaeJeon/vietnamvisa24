const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Notification = sequelize.define(
    "Notification",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      type: {
        type: DataTypes.ENUM(
          "application_update",
          "status_change",
          "consultation",
          "system",
          "document_required",
          "dashboard_new_application",
          "new_application",
          "application_status_change",
          "notification",
        ),
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      recipient: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("unread", "read"),
        defaultValue: "unread",
      },
      priority: {
        type: DataTypes.ENUM("normal", "high", "urgent"),
        defaultValue: "normal",
      },
      relatedId: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      targetUrl: {
        type: DataTypes.STRING(500),
        allowNull: true,
        comment: "클릭 시 이동할 URL 경로",
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "notifications",
      timestamps: false,
      underscored: false,
    },
  );

  return Notification;
};
