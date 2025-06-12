// models/visaRunPrice.js - 목바이 비자런 가격 모델 정의
module.exports = (sequelize, DataTypes) => {
  const VisaRunPrice = sequelize.define(
    "VisaRunPrice",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      visaType: {
        // 비자 종류: 무비자(noVisa) 또는 90일 단수(90daySingle)
        type: DataTypes.ENUM("noVisa", "90daySingle"),
        allowNull: false,
      },
      peopleCount: {
        // 인원 수 (예: 1, 2, 3인)
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 10, // 최대 10인까지 허용
        },
      },
      price: {
        // 판매 가격 (기본 통화 기준)
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
      description: {
        // 서비스 설명 (선택사항)
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
          model: "Admins",
          key: "id",
        },
      },
      updatedBy: {
        // 수정자 사용자 ID
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Admins",
          key: "id",
        },
      },
    },
    {
      tableName: "visa_run_prices",
      timestamps: true,
      paranoid: true,
      underscored: false, // camelCase 필드명 사용
      indexes: [
        {
          unique: true,
          fields: ["visaType", "peopleCount"], // 같은 비자타입과 인원수 조합은 유일해야 함
        },
      ],
    }
  );
  // 관계 정의: VisaRunPrice -> Admin
  VisaRunPrice.associate = (models) => {
    VisaRunPrice.belongsTo(models.Admin, {
      foreignKey: "createdBy",
      as: "creator",
    });
    VisaRunPrice.belongsTo(models.Admin, {
      foreignKey: "updatedBy",
      as: "updater",
    });
  };

  return VisaRunPrice;
};
