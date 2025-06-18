// models/fastTrackPrice.js - 패스트트랙 가격 모델 정의
module.exports = (sequelize, DataTypes) => {
  const FastTrackPrice = sequelize.define(
    "FastTrackPrice",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      serviceType: {
        // 서비스 유형: 입국(arrival), 프리미엄 입국(premiumArrival), 출국(departure)
        type: DataTypes.ENUM("arrival", "premiumArrival", "departure"),
        allowNull: false,
      },
      airport: {
        // 공항 코드 (예: SGN, HAN, DAD 등)
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      price: {
        // 판매 가격
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      marginUSD: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      marginVND: {
        type: DataTypes.DECIMAL(18, 0),
        allowNull: false,
      },
      marginKRW: {
        // KRW로 통일
        type: DataTypes.DECIMAL(10, 0),
        allowNull: false,
      },
      processingTime: {
        // 처리 시간 (예: "30분", "1시간")
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      description: {
        // 서비스 상세 설명
        type: DataTypes.TEXT,
        allowNull: true,
      },
      isActive: {
        // 활성화 여부
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      createdBy: {
        // 생성자 (외래키)
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
      tableName: "fast_track_prices",
      timestamps: false,
      paranoid: true,
      underscored: false, // camelCase 필드명 사용
      indexes: [
        {
          unique: true,
          fields: ["serviceType", "airport"], // 같은 서비스타입과 공항 조합은 유일해야 함
        },
      ],
    },
  );
  // 관계 정의: FastTrackPrice -> User
  FastTrackPrice.associate = (models) => {
    FastTrackPrice.belongsTo(models.User, {
      foreignKey: "createdBy",
      as: "creator",
    });
    FastTrackPrice.belongsTo(models.User, {
      foreignKey: "updatedBy",
      as: "updater",
    });
  };

  return FastTrackPrice;
};
