const { DataTypes } = require("sequelize");
// models/eVisaPrice.js - E-VISA 가격 모델 정의
module.exports = (sequelize) => {
  const EVisaPrice = sequelize.define(
    "EVisaPrice",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      type: {
        // E-VISA 유형: 단수(SINGLE) 또는 복수(MULTIPLE)
        type: DataTypes.ENUM("SINGLE", "MULTIPLE"),
        allowNull: false,
      },
      processingTime: {
        // 처리 기간 옵션
        type: DataTypes.ENUM("NORMAL", "URGENT", "SUPER_URGENT"),
        allowNull: false,
      },
      sellingPriceUsd: {
        // 판매 가격 (USD)
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      sellingPriceVnd: {
        // 판매 가격 (VND)
        type: DataTypes.DECIMAL(18, 0),
        allowNull: false,
      },
      sellingPriceKrw: {
        // 판매 가격 (KRW)
        type: DataTypes.DECIMAL(10, 0),
        allowNull: false,
      },
      marginUsd: {
        // 이익 마진 (USD)
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      marginVnd: {
        // 이익 마진 (VND)
        type: DataTypes.DECIMAL(18, 0),
        allowNull: false,
      },
      marginKrw: {
        // 이익 마진 (KRW)
        type: DataTypes.DECIMAL(10, 0),
        allowNull: false,
      },
      isActive: {
        // 활성화 여부
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      createdBy: {
        // 생성자 사용자 ID (외래키, User 테이블 참조)
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      updatedBy: {
        // 수정자 사용자 ID
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
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
      tableName: "evisa_prices",
      timestamps: false, // 명시적으로 정의한 타임스탬프 사용
      paranoid: true, // deletedAt 소프트 삭제 지원
      underscored: false, // camelCase 필드명 사용
      indexes: [
        {
          unique: true,
          fields: ["type", "processingTime"], // 같은 타입과 처리시간 조합은 유일해야 함
        },
      ],
    },
  );
  // 관계 정의: EVisaPrice -> User (여러 EVisaPrice 레코드가 하나의 User에 속함)
  EVisaPrice.associate = (models) => {
    EVisaPrice.belongsTo(models.User, {
      foreignKey: "createdBy",
      as: "creator",
    });
    EVisaPrice.belongsTo(models.User, {
      foreignKey: "updatedBy",
      as: "updater",
    });
  };

  return EVisaPrice;
};
