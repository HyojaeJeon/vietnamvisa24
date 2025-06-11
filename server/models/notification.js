
module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define('Notification', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    type: {
      type: DataTypes.ENUM('application_update', 'status_change', 'consultation', 'system', 'document_required'),
      allowNull: false
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    recipient: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('unread', 'read'),
      defaultValue: 'unread'
    },
    priority: {
      type: DataTypes.ENUM('normal', 'high', 'urgent'),
      defaultValue: 'normal'
    },
    related_id: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    admin_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'admins',
        key: 'id'
      }
    }
  }, {
    tableName: 'notifications',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Notification.associate = function(models) {
    Notification.belongsTo(models.Admin, {
      foreignKey: 'admin_id',
      as: 'admin'
    });
  };

  return Notification;
};
