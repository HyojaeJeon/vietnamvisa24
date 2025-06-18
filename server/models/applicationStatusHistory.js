module.exports = (sequelize, DataTypes) => {
  const ApplicationStatusHistory = sequelize.define(
    "ApplicationStatusHistory",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      applicationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "visa_applications",
          key: "id",
        },
      },
      previousStatus: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      newStatus: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      changedBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
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
      tableName: "application_status_history",
      timestamps: false,
      underscored: false,
    },
  );

  ApplicationStatusHistory.associate = function (models) {
    ApplicationStatusHistory.belongsTo(models.VisaApplication, {
      foreignKey: "applicationId",
      as: "application",
    });
    ApplicationStatusHistory.belongsTo(models.User, {
      foreignKey: "changedBy",
      as: "changedByUser",
    });
  };

  return ApplicationStatusHistory;
};
