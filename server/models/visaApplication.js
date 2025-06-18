const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const VisaApplication = sequelize.define(
    "VisaApplication",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
      },
      applicationNumber: {
        type: DataTypes.STRING(50),
        unique: true,
        allowNull: true,
      },
      visaType: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      fullName: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      passportNumber: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      nationality: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      birthDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      arrivalDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      departureDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      purpose: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM(
          "pending",
          "processing",
          "document_review",
          "submitted_to_authority",
          "approved",
          "rejected",
          "completed",
        ),
        defaultValue: "pending",
        allowNull: true,
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
      // New fields for enhanced application data
      processingType: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: "standard",
      },
      totalPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0,
      },
      applicationId: {
        type: DataTypes.STRING(100),
        allowNull: true,
        unique: true,
      }, // Personal info additional fields
      firstName: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      lastName: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      phoneOfFriend: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      // Travel info additional fields
      entryPort: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
    },
    {
      tableName: "visa_applications",
      timestamps: true,
      underscored: false,
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  );
  VisaApplication.associate = function (models) {
    // User와의 관계 (신청자)
    VisaApplication.belongsTo(models.User, {
      foreignKey: "userId",
      as: "applicant",
    });

    // 담당자(User, role로 구분)
    VisaApplication.belongsTo(models.User, {
      foreignKey: "assignedTo",
      as: "assignedUser",
    });

    // Documents와의 관계
    VisaApplication.hasMany(models.Document, {
      foreignKey: "applicationId",
      as: "documents",
    });

    // Status History와의 관계
    VisaApplication.hasMany(models.ApplicationStatusHistory, {
      foreignKey: "applicationId",
      as: "statusHistory",
    });

    // Payments와의 관계
    VisaApplication.hasMany(models.Payment, {
      foreignKey: "applicationId",
      as: "payments",
    }); // Workflows와의 관계
    VisaApplication.hasMany(models.ApplicationWorkflow, {
      foreignKey: "applicationId",
      as: "workflows",
    }); // Consultations와의 관계
    VisaApplication.hasMany(models.Consultation, {
      foreignKey: "applicationId",
      as: "consultations",
    });

    // Additional Services와의 Many-to-Many 관계
    if (models.AdditionalService) {
      VisaApplication.belongsToMany(models.AdditionalService, {
        through: "ApplicationAdditionalServices",
        foreignKey: "applicationId",
        otherKey: "additionalServiceId",
        as: "additionalServices",
      });
    }
  };

  return VisaApplication;
};

/*
-- SQLite 마이그레이션: visa_applications 테이블의 NOT NULL 제약 해제용
-- 아래 SQL을 SQLite CLI 또는 DB Browser for SQLite에서 실행하세요.

-- 1. 기존 테이블 구조 확인
.schema visa_applications

-- 2. 새 테이블 생성 (NOT NULL 제거)
CREATE TABLE visa_applications_new (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  application_number VARCHAR(50) UNIQUE,
  visa_type VARCHAR(50),
  full_name VARCHAR(255),
  passport_number VARCHAR(50),
  nationality VARCHAR(50),
  birth_date DATE,
  phone VARCHAR(20),
  email VARCHAR(255),
  arrival_date DATE,
  departure_date DATE,
  purpose VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending',
  assigned_to INTEGER,
  notes TEXT,
  created_at DATETIME,
  updated_at DATETIME
);

-- 3. 데이터 이관
INSERT INTO visa_applications_new
SELECT * FROM visa_applications;

-- 4. 기존 테이블 삭제
DROP TABLE visa_applications;

-- 5. 새 테이블 이름 변경
ALTER TABLE visa_applications_new RENAME TO visa_applications;
*/
