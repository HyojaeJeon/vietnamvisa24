module.exports = (sequelize, DataTypes) => {
  const Consultation = sequelize.define(
    "Consultation",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      application_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "visa_applications",
          key: "id",
        },
      },
      customer_name: {
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
      service_type: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("pending", "in_progress", "completed", "cancelled"),
        defaultValue: "pending",
      },
      assigned_to: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "admins",
          key: "id",
        },
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "consultations",
      timestamps: true,
      underscored: true,
    }
  );
  Consultation.associate = function (models) {
    Consultation.belongsTo(models.Admin, {
      foreignKey: "assigned_to",
      as: "assignedAdmin",
    });

    Consultation.belongsTo(models.VisaApplication, {
      foreignKey: "application_id",
      as: "application",
    });
  };

  return Consultation;
};
