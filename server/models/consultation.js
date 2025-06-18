module.exports = (sequelize, DataTypes) => {
  const Consultation = sequelize.define(
    "Consultation",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      applicationId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "visa_applications",
          key: "id",
        },
      },
      customerName: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      serviceType: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM(
          "pending",
          "in_progress",
          "completed",
          "cancelled",
        ),
        defaultValue: "pending",
      },
      assignedTo: {
        type: DataTypes.INTEGER,
        allowNull: true,
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
    { tableName: "consultations", timestamps: false, underscored: false },
  );
  Consultation.associate = function (models) {
    // 담당자: User(role로 구분)
    Consultation.belongsTo(models.User, {
      foreignKey: "assignedTo",
      as: "assignedUser",
    });
    Consultation.belongsTo(models.VisaApplication, {
      foreignKey: "applicationId",
      as: "application",
    });
  };

  return Consultation;
};
