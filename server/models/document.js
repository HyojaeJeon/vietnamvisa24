const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Document = sequelize.define(
    "Document",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      applicationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "visa_applications",
          key: "id",
        },
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      fileName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      fileSize: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      fileType: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      fileData: {
        type: DataTypes.TEXT("long"),
        allowNull: true,
      },
      extractedInfo: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      uploadedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "documents",
      timestamps: true,
      underscored: false,
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    }
  );

  Document.associate = (models) => {
    Document.belongsTo(models.VisaApplication, {
      foreignKey: "applicationId",
      as: "application",
    });
  };

  return Document;
};

module.exports = (sequelize) => {
  const Document = sequelize.define(
    "Document",
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
      type: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: "Document type: passport, photo, etc.",
      },
      fileName: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      fileSize: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      fileType: {
        type: DataTypes.STRING(100),
        defaultValue: "application/octet-stream",
      },
      fileData: {
        type: DataTypes.TEXT("long"),
        comment: "Base64 encoded file data",
      },
      extractedInfo: {
        type: DataTypes.JSON,
        comment: "OCR extracted information",
      },
      uploadedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      }, // 기존 필드들 유지 (호환성을 위해) - camelCase로 통일
      documentType: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      documentName: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      filePath: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("pending", "approved", "revision_required"),
        defaultValue: "pending",
      },
      reviewedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
      },
      reviewedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "documents",
      timestamps: true,
      underscored: false,
      createdAt: "createdAt",
      updatedAt: "updatedAt",
      hooks: {
        beforeUpdate: (document, options) => {
          document.updatedAt = new Date();
        },
      },
    },
  );

  Document.associate = (models) => {
    Document.belongsTo(models.VisaApplication, {
      foreignKey: "applicationId",
      as: "application",
    });

    if (models.User) {
      Document.belongsTo(models.User, {
        foreignKey: "reviewedBy",
        as: "reviewer",
      });
    }
  };

  return Document;
};
