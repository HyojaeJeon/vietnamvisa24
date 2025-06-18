const { DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  const Payment = sequelize.define(
    "Payment",
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
      invoiceNumber: {
        type: DataTypes.STRING(50),
        unique: true,
        allowNull: false,
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      currency: {
        type: DataTypes.STRING(3),
        defaultValue: "KRW",
      },
      status: {
        type: DataTypes.ENUM(
          "pending",
          "partial",
          "paid",
          "overdue",
          "cancelled",
        ),
        defaultValue: "pending",
      },
      paymentMethod: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      transactionId: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      paidAmount: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
      },
      dueDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      paidAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      receiptRequested: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      receiptIssued: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
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
      tableName: "payments",
      timestamps: false,
      underscored: false,
    },
  );
  Payment.associate = function (models) {
    Payment.belongsTo(models.VisaApplication, {
      foreignKey: "applicationId",
      as: "application",
    });
  };

  return Payment;
};
