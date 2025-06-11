
module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define('Payment', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    application_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'visa_applications',
        key: 'id'
      }
    },
    invoice_number: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    currency: {
      type: DataTypes.STRING(3),
      defaultValue: 'KRW'
    },
    status: {
      type: DataTypes.ENUM('pending', 'partial', 'paid', 'overdue', 'cancelled'),
      defaultValue: 'pending'
    },
    payment_method: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    transaction_id: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    paid_amount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },
    due_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    paid_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    receipt_requested: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    receipt_issued: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'payments',
    timestamps: true,
    underscored: true
  });

  Payment.associate = function(models) {
    Payment.belongsTo(models.VisaApplication, {
      foreignKey: 'application_id',
      as: 'application'
    });
  };

  return Payment;
};
