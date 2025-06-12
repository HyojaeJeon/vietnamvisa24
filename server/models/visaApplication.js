module.exports = (sequelize, DataTypes) => {
  const VisaApplication = sequelize.define(
    "VisaApplication",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
      },
      application_number: {
        type: DataTypes.STRING(50),
        unique: true,
      },
      visa_type: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      full_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      passport_number: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      nationality: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      birth_date: {
        type: DataTypes.DATEONLY,
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
      arrival_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      departure_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      purpose: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("pending", "processing", "document_review", "submitted_to_authority", "approved", "rejected", "completed"),
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
      tableName: "visa_applications",
      timestamps: true,
      underscored: true,
    }
  );

  VisaApplication.associate = function (models) {
    // User와의 관계 (신청자)
    VisaApplication.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "applicant",
    });

    // Admin과의 관계 (담당자)
    VisaApplication.belongsTo(models.Admin, {
      foreignKey: "assigned_to",
      as: "assignedAdmin",
    });

    // Documents와의 관계
    VisaApplication.hasMany(models.Document, {
      foreignKey: "application_id",
      as: "documents",
    });

    // Status History와의 관계
    VisaApplication.hasMany(models.ApplicationStatusHistory, {
      foreignKey: "application_id",
      as: "statusHistory",
    });

    // Payments와의 관계
    VisaApplication.hasMany(models.Payment, {
      foreignKey: "application_id",
      as: "payments",
    }); // Workflows와의 관계
    VisaApplication.hasMany(models.ApplicationWorkflow, {
      foreignKey: "application_id",
      as: "workflows",
    });

    // Consultations와의 관계
    VisaApplication.hasMany(models.Consultation, {
      foreignKey: "application_id",
      as: "consultations",
    });
  };

  return VisaApplication;
};
